#!/usr/bin/env node
var debug = require('debug')('cloudbit-output')
var program = require('commander')





program
  .option('-n --deviceId <id>', 'Device ID to output to', String)
  .option('-o --accessToken <accessToken>', 'OAuth Access Token', String)
  .option('-t --times <count>', 'Output times (default 5)', Number)
  .option('-p --percent <int>', 'Percent to output (default 100)', Number)
  .option('-d --durationMs <ms>', 'Duration to output in milliseconds (default 124)', Number)
  .option('-i --intervalMs <ms>', 'Time between each output in milliseconds (default 1000)', Number)
  .parse(process.argv)



var config = {
  device_id: program.deviceId,
  access_token: program.accessToken,
  times: program.times || 5,
  duration_ms: program.durationMs || 124,
  interval_ms: program.intervalMs || 1000,
  percent: program.percent || 100
}

debug('Launching with configuration:\n\n %s', JSON.stringify(config, null, 2))

if (!config.device_id) throw new Error('Must provide a deviceId')
if (!config.access_token) throw new Error('Must provide an accessToken')

var times_left = config.times
var output = require('littlebits-cloud-http')
  .output
  .defaults({
    device_id: config.device_id,
    access_token: config.access_token,
    duration_ms: config.duration_ms,
    percent: config.percent
  })

var loop = setInterval(function() {
  if (times_left === 0) {
    clearInterval(loop)
    debug('DONE')
    return
  }
  var count = (config.times - times_left + 1)
  debug('sending output %d', count)
  output(ResponseHandler(count))
  times_left = times_left - 1
}, config.interval_ms)



function ResponseHandler(count) {
  return function handleResponse(err) {
    if (err) return debug('output ERROR! %j', err)
    debug('output %d OK!', count)
  }
}
