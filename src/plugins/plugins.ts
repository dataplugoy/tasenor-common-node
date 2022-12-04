import fs from 'fs'
import glob from 'glob'
import path from 'path'
import { TasenorPlugin, IncompleteTasenorPlugin, PluginCatalog, ERP_API, FilePath } from '@dataplug/tasenor-common'
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

interface PluginState {
  installed: boolean
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
 * Read data from the plugin's index file(s) found from the given path.
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
 * Read the local plugin state.
 */
function loadPluginState(plugin: IncompleteTasenorPlugin): PluginState {
  const stateFile = path.join(plugin.path, '.state')
  if (fs.existsSync(stateFile)) {
    return JSON.parse(fs.readFileSync(stateFile).toString('utf-8'))
  }
  return {
    installed: false
  }
}

/**
 * Save local plugin state.
 */
function savePluginState(plugin: IncompleteTasenorPlugin, state: PluginState): void {
  const stateFile = path.join(plugin.path, '.state')
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2) + '\n')
}

/**
 * Check if plugin is marked as installed.
 */
function isInstalled(plugin: IncompleteTasenorPlugin): boolean {
  return loadPluginState(plugin).installed
}

/**
 * Collection of file system and API related plugin handling functions for fetching, building and scanning.
 */
export const plugins = {
  findPluginFromIndex,
  fetchOfficialPluginList,
  getConfig,
  isInstalled,
  loadPluginIndex,
  loadPluginState,
  samePlugins,
  savePluginState,
  scanPlugins,
  setConfig,
  sortPlugins
}
