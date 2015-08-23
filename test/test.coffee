should = require 'should'
dummyProtocol = require './dummy-protocol'
mud = require '../'

mud.protocol.dummy = dummyProtocol

Error.stackTraceLimit = Infinity

connect = (fn)->
  (cb)->
    mud.connect 'dummy://test', (err, db)->
      throw err if err
      fn db, cb

it 'should not allow unregistered protocols', (done)->
  mud.connect 'foobar://test', (err, db)->
    (should err.message).equal 'invalid protocol: foobar'
    (should db).not.be.ok()
    done()

it 'should properly handle connection errors', (done)->
  mud.connect 'dummy://error', (err, db)->
    (should err.message).equal 'unknown database: error'
    (should db).not.be.ok()
    done()

it 'should connect', connect (db, done)->
  (should db).be.ok()
  (should db.protocol).equal dummyProtocol
  (should db.urlInfo).be.ok()
  (should db.urlInfo.protocol).equal 'dummy:'
  done()
