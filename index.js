'use strict';

var nano = require('nano');
var promisify = require('promisify-node');

const SUCCESS = {ok: true};

var Coucher = function(url) {

  var db = promisify(nano(url).db);

  this.url = url;
  this.create = db.create;
  this.destroy = db.destroy;
  this.createAll = (couches) => {
    return collect(couches, db.create);
  };
  this.removeAll = (couches) => {
    return collect(couches, db.destroy);
  };
  
  return this;
};

Coucher.prototype.start = function(couches) {
  var createAll = this.createAll;
  return new Promise((resolve, reject) => {
    createAll(couches)
      .then(resolve)
      .catch((e) => {
        if (e.error == 'file_exists') return resolve([SUCCESS]);
        reject(e);
      });
  });
};

function collect(obj, method) {
  var dbs = [];
  
  if (obj) {
    Object.keys(obj).forEach((key) => {
      dbs.push(method.call(this, obj[key]));
    });
  };

  return Promise.all(dbs);
};

module.exports = (url) => {
  return new Coucher(url);
};
