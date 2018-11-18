const {send} = require('micro');

module.exports = (res, req) => {
  // console.log('res', res)
  send('res from chatservice_2.0')
}