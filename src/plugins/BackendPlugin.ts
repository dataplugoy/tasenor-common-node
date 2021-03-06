import path from 'path'
import { TasenorElement, BackendCatalog, Constructor, DirectoryPath, FilePath, Language, PluginCode, PluginType, PluginUse, Version } from '@dataplug/tasenor-common'
import { KnexDatabase, getServerRoot } from '..'
import { ID } from 'interactive-elements'

/**
 * Baseclass for all plugins for back-end.
 */
export class BackendPlugin {

  public id: ID
  public code: PluginCode
  public title: string
  public version: Version | null
  public releaseDate: Date | string | null
  public use: PluginUse | 'unknown'
  public type: PluginType | 'unknown'
  public icon: string
  public description: string
  public path: string
  public languages: Record<string, Record<string, string>>
  private catalog?: BackendCatalog

  constructor() {
    this.id = null
    this.code = '' as PluginCode
    this.title = ''
    this.version = null
    this.releaseDate = null
    this.use = 'unknown'
    this.type = 'unknown'
    this.icon = ''
    this.description = ''
    this.path = ''

    // Plugin translations from language code to the translation dictionary.
    this.languages = {
    }
  }

  /**
   * Hook to be executed once during installing.
   */
  async install(): Promise<void> {
  }

  /**
   * Hook to be executed one during uninstalling.
   */
  async uninstall(): Promise<void> {
  }

  /**
   * Hook to be executed once for every database during installing.
   * @param db Knex instance of the database.
   */
  async installToDb(db: KnexDatabase): Promise<void> {
  }

  /**
   * Hook to be executed once for every database during uninstalling.
   * @param db Knex instance of the database.
   */
  async uninstallFromDb(db: KnexDatabase): Promise<void> {
  }

  /**
   * Get the full path to the directory of this plugin.
   * @returns The path.
   */
  get fullPath(): DirectoryPath {
    return path.join(getServerRoot(), 'src', 'plugins', this.path) as DirectoryPath
  }

  /**
   * Construct the full path to the file of this module.
   * @param name
   * @returns The path.
   */
  filePath(name: string): FilePath {
    return `${this.fullPath}/${name}` as FilePath
  }

  /**
   * Collect meta data as a JSON object.
   * @returns Object
   */
  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      code: this.code,
      title: this.title,
      description: this.description,
      icon: this.icon,
      version: this.version,
      releaseDate: this.releaseDate,
      use: this.use,
      type: this.type,
      path: this.path
    }
  }

  /**
   * Get the UI setting description or null if the plugin has no settings.
   */
  getSettings(): TasenorElement | null {
    return null
  }

  /**
   * Get the UI setting description or null if the plugin has no settings.
   */
  getGlobalSettings(): TasenorElement | null {
    return null
  }

  /**
   * Do the translation for a string.
   */
  t(str: string, lang: Language): string {
    if (this.catalog) {
      return this.catalog.t(str, lang)
    }
    // Mainly useful for plugin testing: translate using local plugin translations if no catalog available.
    if ((lang in this.languages) && (str in this.languages[lang])) {
      return this.languages[lang][str]
    }
    return str
  }

  /**
   * Get the settings variable values for this plugin.
   * @param db
   * @param name
   */
  async getSetting(db: KnexDatabase, name: string) {
    const setting = await db('settings').select('value').where({ name: `${this.code}.${name}` }).first()
    return setting ? setting.value : undefined
  }

  /**
   * Create an instance of a plugin class and copy static fields into the instance.
   * @param Class
   * @param path
   * @returns
   */
  static create(Class: Constructor<BackendPlugin>, path: FilePath, catalog: BackendCatalog): BackendPlugin {
    const instance = new Class()
    instance.path = path
    instance.catalog = catalog
    return instance
  }
}
