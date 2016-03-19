//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ECMAScript = Package.ecmascript.ECMAScript;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var Random = Package.random.Random;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Factory;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/dburles_factory/factory.js                                                      //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
/* global LocalCollection */                                                                //
/* global Factory:true */                                                                   //
                                                                                            //
var factories = {};                                                                         // 4
                                                                                            //
Factory = (function () {                                                                    // 6
  function Factory(name, collection, attributes) {                                          // 7
    babelHelpers.classCallCheck(this, Factory);                                             //
                                                                                            //
    this.name = name;                                                                       // 8
    this.collection = collection;                                                           // 9
    this.attributes = attributes;                                                           // 10
    this.afterHooks = [];                                                                   // 11
    this.sequence = 0;                                                                      // 12
  }                                                                                         //
                                                                                            //
  Factory.prototype.after = (function () {                                                  // 6
    function after(fn) {                                                                    // 15
      this.afterHooks.push(fn);                                                             // 16
      return this;                                                                          // 17
    }                                                                                       //
                                                                                            //
    return after;                                                                           //
  })();                                                                                     //
                                                                                            //
  return Factory;                                                                           //
})();                                                                                       //
                                                                                            //
Factory.define = function (name, collection, attributes) {                                  // 21
  factories[name] = new Factory(name, collection, attributes);                              // 22
  return factories[name];                                                                   // 23
};                                                                                          //
                                                                                            //
Factory.get = function (name) {                                                             // 26
  var factory = factories[name];                                                            // 27
  if (!factory) {                                                                           // 28
    throw new Error("Factory: There is no factory named " + name);                          // 29
  }                                                                                         //
  return factory;                                                                           // 31
};                                                                                          //
                                                                                            //
Factory.build = function (name) {                                                           // 34
  var attributes = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];    //
                                                                                            //
  var factory = Factory.get(name);                                                          // 35
  var result = {};                                                                          // 36
                                                                                            //
  // "raw" attributes without functions evaluated, or dotted properties resolved            //
  var extendedAttributes = _.extend({}, factory.attributes, attributes);                    // 39
                                                                                            //
  // either create a new factory and return its _id                                         //
  // or return a 'fake' _id (since we're not inserting anything)                            //
  var makeRelation = function (relName) {                                                   // 43
    if (options.insert) {                                                                   // 44
      return Factory.create(relName)._id;                                                   // 45
    }                                                                                       //
    if (options.tree) {                                                                     // 47
      return Factory.build(relName, {}, { tree: true });                                    // 48
    }                                                                                       //
    // fake an id on build                                                                  //
    return Random.id();                                                                     // 51
  };                                                                                        //
                                                                                            //
  var getValue = function (value) {                                                         // 54
    return value instanceof Factory ? makeRelation(value.name) : value;                     // 55
  };                                                                                        //
                                                                                            //
  var getValueFromFunction = function (func) {                                              // 58
    var api = {                                                                             // 59
      sequence: function (fn) {                                                             // 60
        return fn(factory.sequence);                                                        //
      }                                                                                     //
    };                                                                                      //
    var fnRes = func.call(result, api);                                                     // 62
    return getValue(fnRes);                                                                 // 63
  };                                                                                        //
                                                                                            //
  factory.sequence += 1;                                                                    // 66
                                                                                            //
  var walk = function (record, object) {                                                    // 68
    _.each(object, function (value, key) {                                                  // 69
      var newValue = value;                                                                 // 70
      // is this a Factory instance?                                                        //
      if (value instanceof Factory) {                                                       // 72
        newValue = makeRelation(value.name);                                                // 73
      } else if (_.isArray(value)) {                                                        //
        newValue = value.map(function (element) {                                           // 75
          if (_.isFunction(element)) {                                                      // 76
            return getValueFromFunction(element);                                           // 77
          }                                                                                 //
          return getValue(element);                                                         // 79
        });                                                                                 //
      } else if (_.isFunction(value)) {                                                     //
        newValue = getValueFromFunction(value);                                             // 82
        // if an object literal is passed in, traverse deeper into it                       //
      } else if (Object.prototype.toString.call(value) === '[object Object]') {             //
          record[key] = record[key] || {};                                                  // 85
          return walk(record[key], value);                                                  // 86
        }                                                                                   //
                                                                                            //
      var modifier = { $set: {} };                                                          // 89
                                                                                            //
      if (key !== '_id') {                                                                  // 91
        modifier.$set[key] = newValue;                                                      // 92
      }                                                                                     //
                                                                                            //
      LocalCollection._modify(record, modifier);                                            // 95
    });                                                                                     //
  };                                                                                        //
                                                                                            //
  walk(result, extendedAttributes);                                                         // 99
                                                                                            //
  if (!options.tree) {                                                                      // 101
    result._id = extendedAttributes._id || Random.id();                                     // 102
  }                                                                                         //
  return result;                                                                            // 104
};                                                                                          //
                                                                                            //
Factory.tree = function (name, attributes) {                                                // 107
  return Factory.build(name, attributes, { tree: true });                                   // 108
};                                                                                          //
                                                                                            //
Factory._create = function (name, doc) {                                                    // 111
  var collection = Factory.get(name).collection;                                            // 112
  var insertId = collection.insert(doc);                                                    // 113
  var record = collection.findOne(insertId);                                                // 114
  return record;                                                                            // 115
};                                                                                          //
                                                                                            //
Factory.create = function (name) {                                                          // 118
  var attributes = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                                                                                            //
  var doc = Factory.build(name, attributes, { insert: true });                              // 119
  var record = Factory._create(name, doc);                                                  // 120
                                                                                            //
  Factory.get(name).afterHooks.forEach(function (cb) {                                      // 122
    return cb(record);                                                                      //
  });                                                                                       //
                                                                                            //
  return record;                                                                            // 124
};                                                                                          //
                                                                                            //
Factory.extend = function (name) {                                                          // 127
  var attributes = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                                                                                            //
  return _.extend(_.clone(Factory.get(name).attributes), attributes);                       // 128
};                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['dburles:factory'] = {
  Factory: Factory
};

})();
