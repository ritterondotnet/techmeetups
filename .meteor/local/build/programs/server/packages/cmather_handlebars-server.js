(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var OriginalHandlebars, Handlebars;

(function(){

////////////////////////////////////////////////////////////////////////////
//                                                                        //
// packages/cmather_handlebars-server/packages/cmather_handlebars-server. //
//                                                                        //
////////////////////////////////////////////////////////////////////////////
                                                                          //
(function () {                                                            // 1
                                                                          // 2
///////////////////////////////////////////////////////////////////////   // 3
//                                                                   //   // 4
// packages/cmather:handlebars-server/handlebars-server.js           //   // 5
//                                                                   //   // 6
///////////////////////////////////////////////////////////////////////   // 7
                                                                     //   // 8
OriginalHandlebars = Npm.require('handlebars');                      // 1
Handlebars = Handlebars || {};                                       // 2
                                                                     // 3
_.extend(Handlebars, {                                               // 4
  templates: {},                                                     // 5
});                                                                  // 6
                                                                     // 7
///////////////////////////////////////////////////////////////////////   // 16
                                                                          // 17
}).call(this);                                                            // 18
                                                                          // 19
////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['cmather:handlebars-server'] = {
  Handlebars: Handlebars,
  OriginalHandlebars: OriginalHandlebars
};

})();

//# sourceMappingURL=cmather_handlebars-server.js.map
