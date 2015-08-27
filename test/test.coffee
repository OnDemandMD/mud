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

it 'should perform a simple select (zip)', connect (db, done)->
  selected = []
  db ->
    selected = @zipcodes.pluck.zip()
  , (err)->
    throw err if err
    selected.length.should.equal 4999
    selected[0].should.equal 501
    selected.should.be.instanceOf Array
    selected.slice(0, 1)[0].should.equal 501
    done()

it 'should perform a simple select (multiple results)', connect (db, done)->
  zips = []
  cities = []
  db ->
    zips = @zipcodes.pluck.zip()
    cities = @zipcodes.pluck.city()
  , (err)->
    throw err if err
    zips.length.should.equal 4999
    zips[0].should.equal 501
    zips.should.be.instanceOf Array
    zips.slice(0, 1)[0].should.equal 501
    cities.length.should.equal 4999
    cities[0].should.equal 'Holtsville'
    cities.should.be.instanceOf Array
    cities.slice(0, 1)[0].should.equal 'Holtsville'
    done()

it 'should perform an async transaction', connect (db, done)->
  zips = []
  db (cb)->
    setTimeout (=>
      zips = @zipcodes.pluck.zip()
      cb()
    ), 0
  , (err)->
    throw err if err
    zips.length.should.equal 4999
    zips[0].should.equal 501
    zips.should.be.instanceOf Array
    zips.slice(0, 1)[0].should.equal 501
    done()
