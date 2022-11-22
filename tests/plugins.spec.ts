import { plugins } from '../src'

test('Plugin scan', async () => {
  plugins.setConfig('PLUGIN_PATH', __dirname)
  const scanned = plugins.scanPlugins()
  expect(scanned).toStrictEqual(
    [
      {
        code: 'Euro',
        title: 'Currency Euro',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15 18.5c-2.51 0-4.68-1.42-5.76-3.5H15v-2H8.58c-.05-.33-.08-.66-.08-1s.03-.67.08-1H15V9H9.24C10.32 6.92 12.5 5.5 15 5.5c1.61 0 3.09.59 4.23 1.57L21 5.3C19.41 3.87 17.3 3 15 3c-3.92 0-7.24 2.51-8.48 6H3v2h3.06c-.04.33-.06.66-.06 1s.02.67.06 1H3v2h3.52c1.24 3.49 4.56 6 8.48 6 2.31 0 4.41-.87 6-2.3l-1.78-1.77c-1.13.98-2.6 1.57-4.22 1.57z"/></svg>',
        path: '/home/wigy/project/tasenor-common-node/tests/data/plugins/Euro',
        version: '1.0.11',
        releaseDate: '2022-03-11',
        use: 'ui',
        type: 'currency',
        description: 'Support for euro currency.'
      },
      {
        code: 'FinnishLimitedCompanyLite',
        title: 'Finnish Limited Company - Lite',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11.17 8l-.58-.59L9.17 6H4v12h16V8h-8z" opacity=".3"/><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l1.41 1.41.59.59H20v10z"/></svg>',
        path: '/home/wigy/project/tasenor-common-node/tests/data/plugins/FinnishLimitedCompanyLite',
        version: '1.0.22',
        releaseDate: '2022-07-10',
        use: 'both',
        type: 'scheme',
        description: 'Small accounting scheme for Finnish limited company.'
      },
      {
        code: 'LedgerReport',
        title: 'Ledger Report',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><path d="M14,5H5v14h14v-9h-5V5z M8,17c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S8.55,17,8,17z M8,13 c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S8.55,13,8,13z M8,9C7.45,9,7,8.55,7,8s0.45-1,1-1s1,0.45,1,1S8.55,9,8,9z" opacity=".3"/><circle cx="8" cy="8" r="1"/><path d="M15,3H5C3.9,3,3.01,3.9,3.01,5L3,19c0,1.1,0.89,2,1.99,2H19c1.1,0,2-0.9,2-2V9L15,3z M19,19H5V5h9v5h5V19z"/><circle cx="8" cy="12" r="1"/><circle cx="8" cy="16" r="1"/></g></g></svg>',
        path: '/home/wigy/project/tasenor-common-node/tests/data/plugins/LedgerReport',
        version: '1.0.13',
        releaseDate: '2022-03-05',
        use: 'backend',
        type: 'report',
        description: 'General purpose ledger report listing all entries in each account. Each account has also running total for balance.'
      }
    ]
  )
})
