import { Command } from '../cli'
import { ArgumentParser } from 'argparse'
import { latestVersion, log, TasenorPlugin } from '@dataplug/tasenor-common'

class PluginCommand extends Command {

  addArguments(parser: ArgumentParser): void {
    const sub = parser.add_subparsers()

    const ls = sub.add_parser('ls', { help: 'List plugins and their status' })
    ls.set_defaults({ subCommand: 'ls' })

    const install = sub.add_parser('install', { help: 'Install a plugins' })
    install.set_defaults({ subCommand: 'install' })
    install.add_argument('code', { help: 'Plugin code' })
  }

  print(data: TasenorPlugin[]) {
    for (const plugin of data.sort((a, b) => a.id - b.id)) {
      const { id, code, installedVersion, use, type } = plugin
      console.log(`#${id} ${code} ${use} ${type} ${installedVersion ? '[v' + installedVersion + ']' : ''}`)
    }
  }

  async ls() {
    const resp = await this.getUi('/internal/plugins')
    this.out('plugin', resp)
  }

  async install() {
    const { code } = this.args
    const plugin = await this.plugin(code)
    const version = plugin.versions ? latestVersion(plugin.versions.map(v => v.version)) : null
    if (!version) {
      throw new Error(`No version available of plugin ${code}.`)
    }
    log(`Installing plugin ${code} version ${version}`)
    await this.postUi('/internal/plugins', { code, version })
  }

  async run() {
    await this.runBy('subCommand')
  }
}

export default PluginCommand
