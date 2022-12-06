import { DirectoryPath, Url } from '@dataplug/tasenor-common'
import path from 'path'
import { GitRepo } from '../src'

const SAMPLE_URL = 'https://github.com/githubtraining/hellogitworld' as Url

test('Test git repo', async () => {
  const dst = path.join(__dirname, 'out', 'hellogitworld') as DirectoryPath
  const repo = new GitRepo(SAMPLE_URL, dst)
  await repo.clean()
  await repo.latest()

  expect(repo.glob('src/*')).toContain('src/Main.groovy')
})
