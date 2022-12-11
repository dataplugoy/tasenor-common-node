import { DirectoryPath, error, log, Url } from '@dataplug/tasenor-common'
import simpleGit, { SimpleGit } from 'simple-git'
import gitUrlParse from 'git-url-parse'
import fs from 'fs'
import glob from 'glob'
import path from 'path'
import { systemPiped } from '../system'

/**
 * A git repo storage.
 */
export class GitRepo {

  url: Url
  path: DirectoryPath
  git: SimpleGit

  constructor(url: Url, dir: DirectoryPath) {
    this.url = url
    this.setDir(dir)
    this.git = simpleGit()
    this.git.outputHandler(function(command, stdout, stderr) {
      stdout.on('data', (str) => log(`GIT: ${str}`.trim()))
      stderr.on('data', (str) => error(`GIT: ${str.toString('utf-8')}`.trim()))
    })
  }

  /**
   * Initialize path and instantiate Simple Git if path exists.
   */
  setDir(dir: DirectoryPath) {
    this.path = dir
    if (fs.existsSync(dir)) {
      this.git = simpleGit({ baseDir: dir })
    } else {
      this.git = simpleGit()
    }
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
   * Clone the repo if it is not yet there. Return true if the repo was fetched.
   */
  async fetch(): Promise<boolean> {
    if (fs.existsSync(this.path)) {
      return false
    }
    await this.git.clone(this.url, this.path)
    this.setDir(this.path)
    return true
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

  /**
   * Gather all repos found from the directory.
   */
  static async all(dir: DirectoryPath): Promise<GitRepo[]> {
    const repos: GitRepo[] = []
    const dotGits = glob.sync(dir + '/*/.git')
    for (const dotGit of dotGits) {
      const dir = path.dirname(dotGit) as DirectoryPath
      const remote = (await simpleGit(dir).getRemotes(true)).find(r => r.name === 'origin')
      if (remote) {
        repos.push(new GitRepo(remote.refs.fetch as Url, dir))
      }
    }
    return repos
  }

  /**
   * Extract default dir name for repo URL.
   */
  static defaultDir(repo: Url): string {
    const { pathname } = gitUrlParse(repo)
    return path.basename(pathname).replace(/\.git/, '')
  }

  /**
   * Ensure repo is downloaded and return repo instance.
   */
  static async get(repoUrl: Url, parentDir: DirectoryPath, runYarnInstall: boolean = false): Promise<GitRepo> {
    const repo = new GitRepo(repoUrl, path.join(parentDir, GitRepo.defaultDir(repoUrl)) as DirectoryPath)
    const fetched = await repo.fetch()
    if (fetched && runYarnInstall) {
      await systemPiped(`cd "${repo.path}" && yarn install`)
    }
    return repo
  }
}
