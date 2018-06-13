const BrokerDaemonClient = require('../broker-daemon-client')
const Table = require('cli-table')
require('colors')

/**
 * Prints table of the users orders
 * @param {String} market
 * @param {Array.<{blockOrderId, side, amount, price, timeInForce, status>}}

 * @returns {Void}
 */
function createUI (market, orders) {
  console.log('hello')
  console.log(orders)
  const orderTable = new Table({
    head: ['Order ID', 'Side', 'Amount', 'Limit Price', 'Time', 'Status'],
    colWidths: [45, 7, 18, 18, 6, 10],
    style: { head: ['gray'] }
  })

  const ui = []

  ui.push('')
  ui.push(String(`Orders: ${market.toUpperCase()}`).bold.white)
  ui.push('')

  orders.forEach((order) => {
    const price = order.limitPrice || 'MARKET'
    const side = order.side === 'BID' ? order.side.green : order.side.red
    orderTable.push([order.blockOrderId, side, order.amount, price, order.timeInForce, order.status])
  })

  ui.push(orderTable.toString())
  console.log(ui.join('\n') + '\n')
}

/**
 * kcli order summary
 *
 * ex: `kcli order summary --market 'BTC/LTC'
 *
 * @param {Object} args
 * @param {Object} opts
 * @param {String} opts.market
 * @param {String} [rpcaddress] opts.rpcaddress
 * @param {Logger} logger
 */
async function summary (args, opts, logger) {
  const { market, rpcAddress = null } = opts
  const request = { market }
  try {
    const brokerDaemonClient = new BrokerDaemonClient(rpcAddress)
    console.log('wtf')
    const orders = await brokerDaemonClient.orderService.getBlockOrders(request)
    console.log('hello friends')
    console.log(orders)
    createUI(market, orders.blockOrders)
  } catch (e) {
    logger.error(e)
  }
};

module.exports = summary