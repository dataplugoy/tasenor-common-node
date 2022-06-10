import path from 'path'
import { plugins } from '../src'

test('Plugin index management and configuration', async () => {
  expect(() => plugins.loadPluginIndex()).toThrow()
  plugins.setConfig('PLUGIN_PATH', path.join(__dirname, 'plugins'))
  const index = plugins.loadPluginIndex()
  expect(index).toBeTruthy()
  expect(plugins.findPluginFromIndex('Finnish')).toBeTruthy()
  expect(plugins.findPluginFromIndex('NoSuchFinnish')).toBeNull()
  expect(plugins.getConfig('BUILD_PATH')).toBeTruthy()
  expect(plugins.getConfig('DEVELOPMENT_PATH')).toBeTruthy()
  expect(plugins.getConfig('INSTALL_PATH')).toBeTruthy()
  const installed = plugins.scanInstalledPlugins()
  expect(installed.length).toBe(1)
  expect(installed[0].path).toBe('installed/Finnish')
})
