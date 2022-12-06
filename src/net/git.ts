import { DirectoryPath, error, log, Url } from '@dataplug/tasenor-common'
import simpleGit, { SimpleGit } from 'simple-git'
import fs from 'fs'
import glob from 'glob'

/**
 * A git repo storage.
 */
export class GitRepo {

  url: Url
  path: DirectoryPath
  git: SimpleGit

  constructor(url: Url, path: DirectoryPath) {
    this.url = url
    this.path = path
    this.git = simpleGit()
    this.git.outputHandler(function(command, stdout, stderr) {
      stdout.on('data', (str) => log(`GIT: ${str}`))
      stderr.on('data', (str) => error(`GIT: ${str.toString('utf-8')}`))
    })
  }

  /**
   * Delete all if repo exists.
   */
  async clean(): Promise<void> {
    if (!fs.existsSync(this.path)) {
      return
    }
    await fs.promises.rm(this.path, { recursive: true })
  }

  /**
   * Clone or update the repo.
   */
  async latest(): Promise<void> {
    await this.git.clone(this.url, this.path)
  }

  /**
   * List files from repo returning local relative paths.
   */
  glob(pattern: string): string[] {
    const N = this.path.length
    return glob.sync(this.path + '/' + pattern).map((s: string) => {
      if (s.substring(0, N) !== this.path) {
        throw new Error(`Strage. Glob found a file ${s} from repo ${this.path}.`)
      }
      return s.substring(N + 1)
    })
  }
}
