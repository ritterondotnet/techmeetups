//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var Mongo = Package.mongo.Mongo;

(function () {

//////////////////////////////////////////////////////////////////////////////
//                                                                          //
// packages/dburles:collection-helpers/collection-helpers.js                //
//                                                                          //
//////////////////////////////////////////////////////////////////////////////
                                                                            //
Mongo.Collection.prototype.helpers = function(helpers) {                    // 1
  var self = this;                                                          // 2
                                                                            // 3
  if (self._transform && ! self._helpers)                                   // 4
    throw new Meteor.Error("Can't apply helpers to '" +                     // 5
      self._name + "' a transform function already exists!");               // 6
                                                                            // 7
  if (! self._helpers) {                                                    // 8
    self._helpers = function Document(doc) { return _.extend(this, doc); }; // 9
    self._transform = function(doc) {                                       // 10
      return new self._helpers(doc);                                        // 11
    };                                                                      // 12
  }                                                                         // 13
                                                                            // 14
  _.each(helpers, function(helper, key) {                                   // 15
    self._helpers.prototype[key] = helper;                                  // 16
  });                                                                       // 17
};                                                                          // 18
                                                                            // 19
//////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['dburles:collection-helpers'] = {};

})();
