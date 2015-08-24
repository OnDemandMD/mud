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

it 'should perform an empty transaction', connect (db, done)->
  db ->
    return
  , (err)->
    (should err).not.be.ok()
    done()

it 'should have a table length', connect (db, done)->
  l = 0
  db ->
    l = @length
  , (err)->
    throw err if err
    l.should.equal 1
    done()

it 'should have a table', connect (db, done)->
  db ->
    (should @zipcodes).be.ok()
    (should @foobar).not.be.ok()
  , (err)->
    throw err if err
    done()

it 'should perform a simple select', connect (db, done)->
  selected = []
  db ->
    # Get all zip codes
    selected = @zipcodes.pluck.zip()
  , (err)->
    throw err if err
    selected.length.should.equal 4999
    # TODO actually check properties
    done()
