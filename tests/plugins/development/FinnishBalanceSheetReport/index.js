const ReportPlugin = require('../../ReportPlugin')

class FinnishBalanceSheetReport extends ReportPlugin {
  constructor() {
    super()
    this.code = 'FinnishBalanceSheetReport'
    this.title = 'Balance Sheet Report (Finnish)'
    this.version = '1.0'
    this.icon = 'Toc'
    this.releaseDate = '2021-05-17'
    this.use = 'backend'
    this.type = 'report'
    this.description = 'Balance sheet report translated in Finnish.'

    this.changeLog = {
      '1.0': 'Initial release.'
    }
  }
}

module.exports = FinnishBalanceSheetReport
