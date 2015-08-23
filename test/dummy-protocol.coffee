DB = require './dummy-db'

module.exports =
  connect: (db, cb)->
    if db.urlInfo.host isnt 'test'
      return cb new Error "unknown database: #{db.urlInfo.host}"
    return cb()
