(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Collection2 = Package['aldeed:collection2-core'].Collection2;
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var check = Package.check.check;
var Match = Package.check.Match;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/aldeed_schema-deny/lib/deny.js                                             //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
// Extend the schema options allowed by SimpleSchema                                   // 1
SimpleSchema.extendOptions({                                                           // 2
  denyInsert: Match.Optional(Boolean),                                                 // 3
  denyUpdate: Match.Optional(Boolean),                                                 // 4
});                                                                                    // 5
                                                                                       // 6
// Define validation error messages                                                    // 7
SimpleSchema.messages({                                                                // 8
  insertNotAllowed: "[label] cannot be set during an insert",                          // 9
  updateNotAllowed: "[label] cannot be set during an update"                           // 10
});                                                                                    // 11
                                                                                       // 12
Collection2.on('schema.attached', function (collection, ss) {                          // 13
  ss.addValidator(function() {                                                         // 14
    if (!this.isSet) return;                                                           // 15
                                                                                       // 16
    var def = this.definition;                                                         // 17
                                                                                       // 18
    if (def.denyInsert && this.isInsert) return "insertNotAllowed";                    // 19
    if (def.denyUpdate && (this.isUpdate || this.isUpsert)) return "updateNotAllowed";
  });                                                                                  // 21
});                                                                                    // 22
                                                                                       // 23
/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['aldeed:schema-deny'] = {};

})();

//# sourceMappingURL=aldeed_schema-deny.js.map
