import { DirectoryPath, Url } from '@dataplug/tasenor-common'
import path from 'path'
import { GitRepo } from '../src'

const SAMPLE_URL = 'https://github.com/githubtraining/hellogitworld' as Url
const DEST = path.join(__dirname, 'out', 'hellogitworld') as DirectoryPath

test('Test git repo', async () => {
  const repo = new GitRepo(SAMPLE_URL, DEST)
  await repo.clean()
  await repo.fetch()

  expect(repo.glob('src/*')).toContain('src/Main.groovy')

  const all = await GitRepo.all(path.join(__dirname, 'out') as DirectoryPath)
  expect(all[0].path).toBe(DEST)
  expect(all[0].url).toBe(SAMPLE_URL)
})
