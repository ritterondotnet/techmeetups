(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ECMAScript = Package.ecmascript.ECMAScript;
var check = Package.check.check;
var Match = Package.check.Match;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var ValidationError;

(function(){

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// packages/mdg_validation-error/validation-error.js                                  //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////
                                                                                      //
// The "details" property of the ValidationError must be an array of objects          //
// containing at least two properties. The "name" and "type" properties are           //
// required.                                                                          //
var errorsPattern = [Match.ObjectIncluding({                                          // 4
  name: String,                                                                       // 5
  type: String                                                                        // 6
})];                                                                                  //
                                                                                      //
ValidationError = (function (_Meteor$Error) {                                         // 9
  babelHelpers.inherits(_class, _Meteor$Error);                                       //
                                                                                      //
  function _class(errors) {                                                           // 10
    var message = arguments.length <= 1 || arguments[1] === undefined ? ValidationError.DEFAULT_MESSAGE : arguments[1];
    babelHelpers.classCallCheck(this, _class);                                        //
                                                                                      //
    check(errors, errorsPattern);                                                     // 11
    check(message, String);                                                           // 12
                                                                                      //
    return _Meteor$Error.call(this, ValidationError.ERROR_CODE, message, errors);     // 14
  }                                                                                   //
                                                                                      //
  // Static method checking if a given Meteor.Error is an instance of                 //
  // ValidationError.                                                                 //
                                                                                      //
  _class.is = (function () {                                                          //
    function is(err) {                                                                // 19
      return err instanceof Meteor.Error && err.error === ValidationError.ERROR_CODE;
    }                                                                                 //
                                                                                      //
    return is;                                                                        //
  })();                                                                               //
                                                                                      //
  return _class;                                                                      //
})(Meteor.Error);                                                                     //
                                                                                      //
// Universal validation error code to be use in applications and packages.            //
ValidationError.ERROR_CODE = 'validation-error';                                      // 25
// Default validation error message that can be changed globally.                     //
ValidationError.DEFAULT_MESSAGE = 'Validation failed';                                // 27
////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mdg:validation-error'] = {
  ValidationError: ValidationError
};

})();

//# sourceMappingURL=mdg_validation-error.js.map
