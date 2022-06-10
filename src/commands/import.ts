/* eslint-disable camelcase */
import fs from 'fs'
import mime from 'mime-types'
import { Command } from '../cli'
import { ArgumentParser } from 'argparse'
import { ProcessModelData } from 'interactive-elements'
import { log } from '@dataplug/tasenor-common'

type ProcessPostResponse = { processId: number, step: number, status: string }

class ImportCommand extends Command {

  addArguments(parser: ArgumentParser): void {
    const sub = parser.add_subparsers()

    const ls = sub.add_parser('ls', { help: 'List all imports' })
    ls.set_defaults({ subCommand: 'ls' })
    ls.add_argument('db', { help: 'Name of the database' })
    ls.add_argument('name', { help: 'Name of the importer' })

    const create = sub.add_parser('create', { help: 'Import a file' })
    create.set_defaults({ subCommand: 'create' })
    create.add_argument('--first', { help: 'First date of the allowed period YYYY-MM-DD', default: '1900-01-01' })
    create.add_argument('--last', { help: 'Final date of the allowed period YYYY-MM-DD', default: '2999-12-31' })
    create.add_argument('db', { help: 'Name of the database' })
    create.add_argument('name', { help: 'Name of the importer' })
    create.add_argument('file', { help: 'Path to the file to import' })
    create.add_argument('answers', { help: 'Answer file', nargs: '?' })
  }

  async ls() {
    const { db, name } = this.args
    const importer = await this.importer(db, name)
    const resp = await this.get(`/db/${db}/import/${importer.id}`)
    this.out('import', resp)
  }

  async create() {
    const { db, name, file, answers, first, last } = this.args
    const importer = await this.importer(db, name)
    const encoding = 'base64'
    const data = fs.readFileSync(this.str(file)).toString(encoding)
    const type = mime.lookup(file)
    const answersArg = answers ? await this.jsonData(answers) : null

    const resp: ProcessPostResponse = await this.post(`/db/${db}/importer/${importer.id}`, {
      firstDate: first,
      lastDate: last,
      files: [{
        name: file,
        encoding,
        type,
        data
      }]
    })
    this.out('import', resp)

    if (answersArg) {
      log(`Uploading answers to process #${resp.processId}`)
      const resp2 = await this.post(`/db/${db}/import/${importer.id}/process/${resp.processId}`, {
        answer: answersArg
      })
      this.out('import', resp2)
    }
  }

  print(data: ProcessModelData[] | ProcessPostResponse) {
    if ('processId' in data && 'step' in data) {
      log(`Process ID: ${data.processId}, Step: ${data.step}, ${data.status}`)
      return
    }
    for (const imp of data.sort((a, b) => (a.id || 0) - (b.id || 0))) {
      const { id, name, status, error } = imp
      console.log(`#${id} ${name} ${status}`)
      if (error) {
        console.log('  ', error)
      }
      console.log()
    }

  }

  async run() {
    await this.runBy('subCommand')
  }
}

export default ImportCommand
