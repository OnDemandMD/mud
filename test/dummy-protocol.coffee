DB = require './dummy-db'

module.exports =
  connect: (db, opts, cb)->
    if db.urlInfo.host isnt 'test'
      return cb new Error "unknown database: #{db.urlInfo.host}"
    return cb()

  getTables: (db, cb)->
    cb null, zipcodes: {rows: DB.length, columns: Object.keys DB[0]}
