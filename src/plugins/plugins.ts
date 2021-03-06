import fs from 'fs'
import fsPromises from 'fs/promises'
import glob from 'glob'
import path from 'path'
import tar from 'tar'
import { TasenorPlugin, TasenorPluginPackaged, IncompleteTasenorPlugin, PluginCatalog, ERP_API, ServiceResponse } from '@dataplug/tasenor-common'
import { create } from 'ts-opaque'

const PLUGIN_FIELDS = ['code', 'title', 'version', 'icon', 'releaseDate', 'use', 'type', 'description']

interface PluginConfig {
  BUILD_PATH?: string
  DEVELOPMENT_PATH?: string
  INSTALL_PATH?: string
  PLUGIN_PATH?: string
}
type ConfigVariable = keyof PluginConfig

// Internal configuration for the module.
const config: PluginConfig = {
  BUILD_PATH: undefined,
  DEVELOPMENT_PATH: undefined,
  INSTALL_PATH: undefined,
  PLUGIN_PATH: undefined
}

/**
 * Get the configuration variable or throw an error.
 * @param variable Name of the variable.
 */
function getConfig(variable: ConfigVariable): string {
  const value = config[variable]
  if (value === undefined) {
    throw new Error(`Configuration variable ${variable} is required but it is not set.`)
  }
  return value
}

/**
 * Set the configuration variable. When setting the root for plugins other directories are set automatically.
 * @param variable Name of the variable.
 * @param value Value of the variable.
 */
function setConfig(variable: ConfigVariable, value: string): void {
  config[variable] = value
  if (variable === 'PLUGIN_PATH') {
    if (fs.existsSync(path.join(value, 'build'))) {
      setConfig('BUILD_PATH', path.join(value, 'build'))
    }
    if (fs.existsSync(path.join(value, 'Build'))) {
      setConfig('BUILD_PATH', path.join(value, 'Build'))
    }
    if (fs.existsSync(path.join(value, 'installed'))) {
      setConfig('INSTALL_PATH', path.join(value, 'installed'))
    }
    if (fs.existsSync(path.join(value, 'Installed'))) {
      setConfig('INSTALL_PATH', path.join(value, 'Installed'))
    }
    if (fs.existsSync(path.join(value, 'development'))) {
      setConfig('DEVELOPMENT_PATH', path.join(value, 'development'))
    }
    if (fs.existsSync(path.join(value, 'Development'))) {
      setConfig('DEVELOPMENT_PATH', path.join(value, 'Development'))
    }
  }
}

/**
 * Sort list of plugins according to the code.
 * @param plugins A list of plugins.
 * @returns New sorted list.
 */
function sortPlugins(plugins: TasenorPlugin[]): TasenorPlugin[] {
  return plugins.sort((a, b) => a.code < b.code ? -1 : (a.code > b.code ? 1 : 0))
}

/**
 * Compare two plugin lists if they are essentially the same.
 * @param listA
 * @param listB
 * @returns True if code, versions and path match.
 */
function samePlugins(listA: TasenorPlugin[], listB: TasenorPlugin[]): boolean {
  if (listA.length !== listB.length) {
    return false
  }
  listA = sortPlugins(listA)
  listB = sortPlugins(listB)
  for (let i = 0; i < listA.length; i++) {
    if (listA[i].id !== listB[i].id ||
      listA[i].code !== listB[i].code ||
      listA[i].installedVersion !== listB[i].installedVersion ||
      listA[i].path !== listB[i].path
    ) {
      return false
    }
    if (listA[i].versions || listB[i].versions) {
      const versionsA = listA[i].versions || []
      const versionsB = listB[i].versions || []
      if (versionsA.length !== versionsB.length) {
        return false
      }
      for (let j = 0; j < versionsA.length; j++) {
        if (versionsA[j].version !== versionsB[j].version) {
          return false
        }
      }
    }
  }
  return true
}

/**
 * Read in the current `index.json` file.
 */
function loadPluginIndex(): PluginCatalog {
  if (fs.existsSync(path.join(getConfig('PLUGIN_PATH'), 'index.json'))) {
    return JSON.parse(fs.readFileSync(path.join(getConfig('PLUGIN_PATH'), 'index.json')).toString('utf-8'))
  }
  return []
}

/**
 * Find the named plugin from the current `index.json` file.
 * @param {String} code
 * @returns Data or null if not found.
 */
function findPluginFromIndex(code: string): TasenorPlugin | null {
  const index = loadPluginIndex()
  const plugin = index.find(plugin => plugin.code === code)
  return plugin || null
}

/**
 * Get the current plugin list maintained by ERP.
 * @returns The latest list.
 */
async function fetchOfficialPluginList(): Promise<TasenorPlugin[]> {
  const plugins = await ERP_API.call('GET', '/plugins')
  if (plugins.success) {
    return plugins.data as unknown as TasenorPlugin[]
  }
  return []
}

/**
 * Construct plugin list from the current `Installed` directory.
 */
function scanInstalledPlugins(): TasenorPlugin[] {
  const installPath = getConfig('INSTALL_PATH')
  const installPathParts = installPath.split('/')
  const files = glob.sync(path.join(installPath, '*', 'plugin.json'))
  const plugins: PluginCatalog = []
  for (const file of files) {
    const plugin = JSON.parse(fs.readFileSync(file).toString('utf-8'))
    const pathParts = file.split('/')
    plugin.path = `${installPathParts[installPathParts.length - 1]}/${pathParts[pathParts.length - 2]}`
    plugins.push(plugin)
  }
  return plugins
}

/**
 * Scan for all UI plugins found from the development directory.
 * @returns A list of plugins.
 */
function scanUIPlugins(): IncompleteTasenorPlugin[] {
  const files = glob.sync(path.join(getConfig('DEVELOPMENT_PATH'), '*', 'index.tsx')).concat(
    glob.sync(path.join(getConfig('DEVELOPMENT_PATH'), '*', 'ui', 'index.tsx'))
  )
  const regex = new RegExp(`^\\s*static\\s+(${PLUGIN_FIELDS.join('|')})\\s*=\\s*(?:'([^']*)'|"([^"]*)")`)
  const plugins: IncompleteTasenorPlugin[] = []
  for (const file of files) {
    let pluginPath
    const pathParts = file.split('/')
    if (pathParts[pathParts.length - 2] === 'ui') {
      pluginPath = `${pathParts[pathParts.length - 4]}/${pathParts[pathParts.length - 3]}`
    } else {
      pluginPath = `${pathParts[pathParts.length - 3]}/${pathParts[pathParts.length - 2]}`
    }
    const data: IncompleteTasenorPlugin = {
      code: create('Unknown'),
      title: 'Unknown Development Plugin',
      icon: 'HelpOutline',
      path: pluginPath,
      version: create('0'),
      releaseDate: null,
      use: 'unknown',
      type: 'unknown',
      description: 'No description'
    }
    const code = fs.readFileSync(file).toString('utf-8').split('\n')
    for (const line of code) {
      const match = regex.exec(line)
      if (match) {
        data[match[1]] = match[2]
      }
    }
    if (data.releaseDate) {
      data.releaseDate = new Date(data.releaseDate)
    }
    plugins.push(data)
  }
  return plugins
}

/**
 * Scan for all backend plugins found from the development directory.
 * @returns A list of plugins.
 */
function scanBackendPlugins(): IncompleteTasenorPlugin[] {
  const files = glob.sync(path.join(getConfig('DEVELOPMENT_PATH'), '*', 'index.ts')).concat(
    glob.sync(path.join(getConfig('DEVELOPMENT_PATH'), '*', 'backend', 'index.ts'))
  )
  const regex = new RegExp(`^\\s*this\\.(${PLUGIN_FIELDS.join('|')})\\s*=\\s*(?:'([^']*)'|"([^"]*)")`)
  const plugins: IncompleteTasenorPlugin[] = []
  for (const file of files) {
    const pathParts = file.split('/')
    let pluginPath
    if (pathParts[pathParts.length - 2] === 'backend') {
      pluginPath = `${pathParts[pathParts.length - 4]}/${pathParts[pathParts.length - 3]}`
    } else {
      pluginPath = `${pathParts[pathParts.length - 3]}/${pathParts[pathParts.length - 2]}`
    }
    const data: IncompleteTasenorPlugin = {
      code: create('Unknown'),
      title: 'Unknown Development Plugin',
      icon: 'HelpOutline',
      path: pluginPath,
      version: create('0'),
      releaseDate: null,
      use: 'unknown',
      type: 'unknown',
      description: 'No description'
    }
    const code = fs.readFileSync(file).toString('utf-8').split('\n')
    for (const line of code) {
      const match = regex.exec(line)
      if (match) {
        data[match[1]] = match[2]
      }
    }
    if (data.releaseDate) {
      data.releaseDate = new Date(data.releaseDate)
    }
    plugins.push(data)
  }

  return plugins
}

/**
 * Remove all files and directories from build directory.
 */
async function cleanBuildDir(): Promise<void> {
  const buildDir = getConfig('BUILD_PATH')
  await fsPromises.rm(buildDir, { force: true, recursive: true })
  return fsPromises.mkdir(buildDir)
}

/**
 * Remove all files and directories from development directory.
 */
async function cleanDevDir(): Promise<void> {
  const buildDir = getConfig('DEVELOPMENT_PATH')
  await fsPromises.rm(buildDir, { force: true, recursive: true })
  return fsPromises.mkdir(buildDir)
}

/**
 * Remove all files and directories from installed directory.
 */
async function cleanInstallDir(): Promise<void> {
  const buildDir = getConfig('INSTALL_PATH')
  await fsPromises.rm(buildDir, { force: true, recursive: true })
  return fsPromises.mkdir(buildDir)
}

/**
 * Build a tar package of the plugin from the given directories.
 * @param plugin JSON data of the plugin.
 * @param uiPath Path to the UI part.
 * @param backendPath Path to the backebd part.
 * @returns Tar path.
 */
async function buildPlugin(plugin: TasenorPlugin, uiPath: string | null, backendPath: string | null): Promise<string> {
  const tarPath = path.join(getConfig('BUILD_PATH'), `${plugin.code}-${plugin.version}.tgz`)
  await fsPromises.mkdir(path.join(getConfig('BUILD_PATH'), plugin.code), { recursive: true })
  await fsPromises.writeFile(path.join(getConfig('BUILD_PATH'), plugin.code, 'plugin.json'), JSON.stringify(plugin, null, 2))

  if (plugin.use !== 'ui') {
    if (!backendPath) {
      throw new Error('No backend path given.')
    }
    await fsPromises.mkdir(path.join(getConfig('BUILD_PATH'), plugin.code, 'backend'), { recursive: true })
    for (const file of glob.sync(path.join(backendPath, '*'))) {
      await fsPromises.copyFile(file, path.join(getConfig('BUILD_PATH'), plugin.code, 'backend', path.basename(file)))
    }
  }

  if (plugin.use !== 'backend') {
    if (!uiPath) {
      throw new Error('No UI path given.')
    }
    await fsPromises.mkdir(path.join(getConfig('BUILD_PATH'), plugin.code, 'ui'), { recursive: true })
    for (const file of glob.sync(path.join(uiPath, '*'))) {
      await fsPromises.copyFile(file, path.join(getConfig('BUILD_PATH'), plugin.code, 'ui', path.basename(file)))
    }
  }

  await tar.c({ gzip: true, cwd: getConfig('BUILD_PATH'), file: tarPath }, ['./' + plugin.code])
  return tarPath
}

/**
 * Publish a plugin to ERP.
 * @param plugin
 * @param tarPath
 * @returns
 */
async function publishPlugin(plugin: TasenorPluginPackaged, tarPath): ServiceResponse {
  plugin.releaseDate = new Date()
  plugin.package = fs.readFileSync(tarPath).toString('base64')
  return ERP_API.call('POST', '/plugins/publish', plugin)
}

/**
 * Collection of file system and API related plugin handling functions for fetching, building and scanning.
 */
export const plugins = {
  buildPlugin,
  cleanBuildDir,
  cleanDevDir,
  cleanInstallDir,
  findPluginFromIndex,
  fetchOfficialPluginList,
  getConfig,
  loadPluginIndex,
  publishPlugin,
  samePlugins,
  scanBackendPlugins,
  scanInstalledPlugins,
  scanUIPlugins,
  setConfig,
  sortPlugins
}
