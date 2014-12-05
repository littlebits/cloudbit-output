#!/usr/bin/env node
var debug = require('debug')('cloudbit-output')
var program = require('commander')





program
  .option('-n --deviceId <id>', 'Device ID to output to', String)
  .option('-o --accessToken <accessToken>', 'OAuth Access Token', String)
  .option('-t --times <count>', 'Output times (default 5)', Number)
  .option('-p --percent', 'Percent to output (default 100)', Number)
  .option('-d --durationMs <ms>', 'Duration to output in milliseconds (default 124)', Number)
  .option('-i --intervalMs <ms>', 'Time between each output in milliseconds (default 1000)', Number)
  .parse(process.argv)



var times = program.times || 5
var duration_ms = program.durationMs || 124
var interval_ms = program.intervalMs || 1000
var percent = program.percent || 100
var device_id = program.deviceId
var access_token = program.accessToken

if (!device_id) throw new Error('Must provide a deviceId')
if (!access_token) throw new Error('Must provide an accessToken')



var times_left = times
var output = require('littlebits-cloud-http')
  .defaults({ device_id: device_id, access_token: access_token })
  .output
  .bind(null, { duration_ms: duration_ms, percent: percent })

var loop = setInterval(function() {
  if (times_left === 0) {
    clearInterval(loop)
    debug('DONE')
    return
  }
  var count = (times - times_left + 1)
  debug('sending output %d', count)
  output(ResponseHandler(count))
  times_left = times_left - 1
}, interval_ms)



function ResponseHandler(count) {
  return function handleResponse(err) {
    if (err) return debug('output ERROR! %j', err)
    debug('output %d OK!', count)
  }
}
