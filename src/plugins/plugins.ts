import fs from 'fs'
import glob from 'glob'
import path from 'path'
import { TasenorPlugin, TasenorPluginPackaged, IncompleteTasenorPlugin, PluginCatalog, ERP_API, ServiceResponse, FilePath } from '@dataplug/tasenor-common'
import { create } from 'ts-opaque'

const PLUGIN_FIELDS = ['code', 'title', 'version', 'icon', 'releaseDate', 'use', 'type', 'description']

interface PluginConfig {
  PLUGIN_PATH?: string
}
type ConfigVariable = keyof PluginConfig

// Internal configuration for the module.
const config: PluginConfig = {
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
  if (variable in config) {
    config[variable] = value
  } else {
    throw new Error(`No such configuration variable as ${variable}.`)
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
  // TODO: What to do this? Remove?
  const plugins = await ERP_API.call('GET', '/plugins')
  if (plugins.success) {
    return plugins.data as unknown as TasenorPlugin[]
  }
  return []
}

/**
 * Extract local part from the plugin file path relative to plugin directory (remove optional basename from the end).
 */
function relativePluginPath(p: string, basename: string | null = null) {
  const rootPath = path.resolve(getConfig('PLUGIN_PATH'))
  p = path.resolve(p)
  p = p.substring(rootPath.length + 1, p.length)
  if (basename !== null) {
    p = p.replace(basename, '').replace(/\/+$/, '')
  }
  return p
}

/**
 * Scan all plugins from the plugin directory based on index files found.
 */
function scanPlugins(): IncompleteTasenorPlugin[] {
  const rootPath = path.resolve(getConfig('PLUGIN_PATH'))

  const uiFiles = glob.sync(path.join(rootPath, '**', 'ui', 'index.tsx'))
  const backendFiles = glob.sync(path.join(rootPath, '**', 'backend', 'index.ts'))

  const pluginSet = new Set<FilePath>(uiFiles.map(p => relativePluginPath(p, 'ui/index.tsx')).concat(
    backendFiles.map(p => relativePluginPath(p, 'backend/index.ts'))))

  return [...pluginSet].map(scanPlugin)
}

/**
 * Construct plugin list from the current `Installed` directory.
 */
function scanInstalledPlugins(): TasenorPlugin[] {
  /*
  TODO: Check this out.

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
  */
  return []
}

/**
 * Read data from the index file(s) found from the given path.
 */
function scanPlugin(pluginPath: FilePath): IncompleteTasenorPlugin {
  const rootPath = path.resolve(getConfig('PLUGIN_PATH'))
  const uiPath: FilePath = path.join(rootPath, pluginPath, 'ui', 'index.tsx') as FilePath
  const ui = fs.existsSync(uiPath) ? readUIPlugin(uiPath) : null
  const backendPath: FilePath = path.join(rootPath, pluginPath, 'backend', 'index.ts') as FilePath
  const backend = fs.existsSync(backendPath) ? readBackendPlugin(backendPath) : null
  if (ui && backend) {
    for (const field of PLUGIN_FIELDS) {
      if (ui[field] !== backend[field]) {
        throw new Error(`A field '${field}' have contradicting values ${JSON.stringify(ui[field])} and ${JSON.stringify(backend[field])} for index files '${uiPath}' and '${backendPath}'.`)
      }
    }
  }
  if (ui === null && backend === null) {
    throw new Error(`Cannot find any plugins in '${pluginPath}'.`)
  }
  return ui || backend as IncompleteTasenorPlugin
}

/**
 * Read UI plugin data from the given index file.
 */
function readUIPlugin(indexPath: FilePath): IncompleteTasenorPlugin {
  const regex = new RegExp(`^\\s*static\\s+(${PLUGIN_FIELDS.join('|')})\\s*=\\s*(?:'([^']*)'|"([^"]*)")`)

  const data: IncompleteTasenorPlugin = {
    code: create('Unknown'),
    title: 'Unknown Development Plugin',
    icon: 'HelpOutline',
    path: path.dirname(path.dirname(indexPath)),
    version: create('0'),
    releaseDate: null,
    use: 'unknown',
    type: 'unknown',
    description: 'No description'
  }
  const code = fs.readFileSync(indexPath).toString('utf-8').split('\n')
  for (const line of code) {
    const match = regex.exec(line)
    if (match) {
      data[match[1]] = match[2]
    }
  }

  return data
}

function readBackendPlugin(indexPath: FilePath): IncompleteTasenorPlugin {
  const regex = new RegExp(`^\\s*this\\.(${PLUGIN_FIELDS.join('|')})\\s*=\\s*(?:'([^']*)'|"([^"]*)")`)

  const data: IncompleteTasenorPlugin = {
    code: create('Unknown'),
    title: 'Unknown Development Plugin',
    icon: 'HelpOutline',
    path: path.dirname(path.dirname(indexPath)),
    version: create('0'),
    releaseDate: null,
    use: 'unknown',
    type: 'unknown',
    description: 'No description'
  }
  const code = fs.readFileSync(indexPath).toString('utf-8').split('\n')
  for (const line of code) {
    const match = regex.exec(line)
    if (match) {
      data[match[1]] = match[2]
    }
  }

  return data
}

/**
 * Scan for all backend plugins found from the development directory.
 * @returns A list of plugins.
 */
function scanBackendPlugins(): IncompleteTasenorPlugin[] {
  /*
  TODO: Check this out.

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
  */
  return []
}

/**
 * Remove all files and directories from build directory.
 */
async function cleanBuildDir(): Promise<void> {
  /*
  TODO: Check this out.
  const buildDir = getConfig('BUILD_PATH')
  await fsPromises.rm(buildDir, { force: true, recursive: true })
  return fsPromises.mkdir(buildDir)
  */
}

/**
 * Remove all files and directories from development directory.
 */
async function cleanDevDir(): Promise<void> {
  /*
  TODO: Check this out.

  const buildDir = getConfig('DEVELOPMENT_PATH')
  await fsPromises.rm(buildDir, { force: true, recursive: true })
  return fsPromises.mkdir(buildDir)
  */
}

/**
 * Remove all files and directories from installed directory.
 */
async function cleanInstallDir(): Promise<void> {
  /*
  TODO: Check this out.
  const buildDir = getConfig('INSTALL_PATH')
  await fsPromises.rm(buildDir, { force: true, recursive: true })
  return fsPromises.mkdir(buildDir)
  */
}

/**
 * Build a tar package of the plugin from the given directories.
 * @param plugin JSON data of the plugin.
 * @param uiPath Path to the UI part.
 * @param backendPath Path to the backebd part.
 * @returns Tar path.
 */
async function buildPlugin(plugin: TasenorPlugin, uiPath: string | null, backendPath: string | null): Promise<string> {
  /*
  TODO: Check this out.

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
  */
  return ''
}

/**
 * Publish a plugin to ERP.
 * @param plugin
 * @param tarPath
 * @returns
 */
async function publishPlugin(plugin: TasenorPluginPackaged, tarPath): ServiceResponse {
  // TODO: Remove.
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
  scanPlugins,
  setConfig,
  sortPlugins
}
