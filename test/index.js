var assert = require('assert');
var database = require('../index')('http://localhost:5984');
var rando = require('random-string');

var couches = {
  couchy_test: 'couchy_test'
};

describe('database', function() {
  afterEach(function() {
    return database.removeAll(couches).catch((err) => {
      if (err.statusCode === 404) return;
      throw err;
    });
  });
  describe('.start', function() {
    it('must return ok: true if databases exists', function() {
      return database.create(couches.couchy_test)
        .then(() => {
          database.start(couches).then((arr) => {
            arr.forEach((res) => {
              assert(res, {ok: true});
            });
          });
        });
    });

    it('must return ok: true', function() {
      return database.start(couches).then((arr) => {
        arr.forEach((res) => {
          assert(res, {ok: true});
        });
      });
    });
  });

  describe('.createAll', function() {
    it('must return error if databases exists', function() {
      return database.create(couches.couchy_test)
        .then((res) => {
          database.createAll()
            .catch((e) => {
              assert.equal(e.error, 'file_exists');
            });
        });
    });

    it('must return array', function() {
      database.createAll(couches)
        .then((arr) => {
          assert(arr instanceof Array);
        });
    });

    it('must return ok: true', function() {
      database.createAll(couches)
        .then((arr) => {
          arr.forEach((res) => {
            assert(res, {ok: true});
          });
        });
    });
  });

  describe('.removeAll', function() {
    it('must return error if databases do not exist', function() {
      return database.removeAll()
        .catch((e) => {
          assert.equal(e.error, 'not_found');
        });
    });

    it('must return array', function() {
      database.createAll(couches)
        .then(() => {
          database.removeAll()
            .then((arr) => {
              assert(arr instanceof Array);
            });
        });
    });

    it('must return array', function() {
      database.createAll(couches)
        .then(() => {
          database.removeAll()
            .then((arr) => {
              arr.forEach((res) => {
                assert(res, {ok: true});
              });
            });
        });
    });
  });
});
