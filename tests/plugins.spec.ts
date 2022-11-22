import path from 'path'
import { plugins } from '../src'

test('Plugin scan', async () => {
  plugins.setConfig('PLUGIN_PATH', path.join(__dirname, 'data', 'plugins'))
  plugins.scanPlugins()
})
