should = require 'should'
cloneDeep = require 'clone-deep'
DB = require './dummy-db'

performOperation = (operation, cb)->
  # will always be zip-codes
  if operation.table isnt 'zipcodes'
    return cb new Error "invalid table: #{operation.table}"

  result = {}
  switch operation.operation
    when 'select'
      result = []
      for row in DB when operation.column of row
        result.push "#{operation.column}": row[operation.column]

  processor = operation.processor || (o, r, cb)-> cb null, r
  processor operation, result, cb

module.exports =
  connect: (db, opts, cb)->
    if db.urlInfo.host isnt 'test'
      return cb new Error "unknown database: #{db.urlInfo.host}"

    db.testOperations = []
    db.transactionCount = 0
    db.failedTransactions = 0
    db.committedTransactions = 0

    return cb()

  getTables: (db, cb)->
    cb null, zipcodes: {rows: DB.length, columns: Object.keys DB[0]}

  operate: (db, transactionId, operation, cb)->
    if transactionId >= db.transactionCount or transactionId < 0
      return cb new Error 'invalid transaction ID'
    db.testOperations.push cloneDeep operation
    return performOperation operation, cb

  transactionBegin: (db, cb)->
    cb null, db.transactionCount++
  transactionFail: (db, id, cb)->
    if id >= db.transactionCount or id < 0
      return cb new Error 'invalid transaction ID'
    ++db.failedTransactions
    cb()
  transactionCommit: (db, id, cb)->
    if id >= db.transactionCount or id < 0
      return cb new Error 'invalid transaction ID'
    ++db.committedTransactions
    cb()
