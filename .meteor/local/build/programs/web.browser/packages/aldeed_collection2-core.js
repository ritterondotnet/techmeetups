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
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var _ = Package.underscore._;
var check = Package.check.check;
var Match = Package.check.Match;
var Mongo = Package.mongo.Mongo;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var EJSON = Package.ejson.EJSON;
var EventEmitter = Package['raix:eventemitter'].EventEmitter;

/* Package-scope variables */
var Collection2, Mongo;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/aldeed_collection2-core/lib/collection2.js                                                               //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// Exported only for listening to events                                                                             // 1
Collection2 = new EventEmitter();                                                                                    // 2
                                                                                                                     // 3
// backwards compatibility                                                                                           // 4
if (typeof Mongo === "undefined") {                                                                                  // 5
  Mongo = {};                                                                                                        // 6
  Mongo.Collection = Meteor.Collection;                                                                              // 7
}                                                                                                                    // 8
                                                                                                                     // 9
/**                                                                                                                  // 10
 * Mongo.Collection.prototype.attachSchema                                                                           // 11
 * @param {SimpleSchema|Object} ss - SimpleSchema instance or a schema definition object                             // 12
 *    from which to create a new SimpleSchema instance                                                               // 13
 * @param {Object} [options]                                                                                         // 14
 * @param {Boolean} [options.transform=false] Set to `true` if your document must be passed                          // 15
 *    through the collection's transform to properly validate.                                                       // 16
 * @param {Boolean} [options.replace=false] Set to `true` to replace any existing schema instead of combining        // 17
 * @return {undefined}                                                                                               // 18
 *                                                                                                                   // 19
 * Use this method to attach a schema to a collection created by another package,                                    // 20
 * such as Meteor.users. It is most likely unsafe to call this method more than                                      // 21
 * once for a single collection, or to call this for a collection that had a                                         // 22
 * schema object passed to its constructor.                                                                          // 23
 */                                                                                                                  // 24
Mongo.Collection.prototype.attachSchema = function c2AttachSchema(ss, options) {                                     // 25
  var self = this;                                                                                                   // 26
  options = options || {};                                                                                           // 27
                                                                                                                     // 28
  // Allow passing just the schema object                                                                            // 29
  if (!(ss instanceof SimpleSchema)) {                                                                               // 30
    ss = new SimpleSchema(ss);                                                                                       // 31
  }                                                                                                                  // 32
                                                                                                                     // 33
  self._c2 = self._c2 || {};                                                                                         // 34
                                                                                                                     // 35
  // If we've already attached one schema, we combine both into a new schema unless options.replace is `true`        // 36
  if (self._c2._simpleSchema && options.replace !== true) {                                                          // 37
    ss = new SimpleSchema([self._c2._simpleSchema, ss]);                                                             // 38
  }                                                                                                                  // 39
                                                                                                                     // 40
  var selector = options.selector;                                                                                   // 41
                                                                                                                     // 42
  function attachTo(obj) {                                                                                           // 43
    if (typeof selector === "object") {                                                                              // 44
      // we need an array to hold multiple schemas                                                                   // 45
      obj._c2._simpleSchemas = obj._c2._simpleSchemas || [];                                                         // 46
      obj._c2._simpleSchemas.push({                                                                                  // 47
        schema: new SimpleSchema(ss),                                                                                // 48
        selector: selector,                                                                                          // 49
      });                                                                                                            // 50
    } else {                                                                                                         // 51
      // Track the schema in the collection                                                                          // 52
      obj._c2._simpleSchema = ss;                                                                                    // 53
    }                                                                                                                // 54
  }                                                                                                                  // 55
                                                                                                                     // 56
  attachTo(self);                                                                                                    // 57
  // Attach the schema to the underlying LocalCollection, too                                                        // 58
  if (self._collection instanceof LocalCollection) {                                                                 // 59
    self._collection._c2 = self._collection._c2 || {};                                                               // 60
    attachTo(self._collection);                                                                                      // 61
  }                                                                                                                  // 62
                                                                                                                     // 63
  defineDeny(self, options);                                                                                         // 64
  keepInsecure(self);                                                                                                // 65
                                                                                                                     // 66
  Collection2.emit('schema.attached', self, ss, options);                                                            // 67
};                                                                                                                   // 68
                                                                                                                     // 69
_.each([Mongo.Collection, LocalCollection], function (obj) {                                                         // 70
  /**                                                                                                                // 71
   * simpleSchema                                                                                                    // 72
   * @description function detect the correct schema by given params. If it                                          // 73
   * detect multi-schema presence in `self`, then it made an attempt to find a                                       // 74
   * `selector` in args                                                                                              // 75
   * @param {Object} doc - It could be <update> on update/upsert or document                                         // 76
   * itself on insert/remove                                                                                         // 77
   * @param {Object} [options] - It could be <update> on update/upsert etc                                           // 78
   * @param {Object} [query] - it could be <query> on update/upsert                                                  // 79
   * @return {Object} Schema                                                                                         // 80
   */                                                                                                                // 81
  obj.prototype.simpleSchema = function (doc, options, query) {                                                      // 82
    if (!this._c2) return null;                                                                                      // 83
    if (this._c2._simpleSchema) return this._c2._simpleSchema;                                                       // 84
                                                                                                                     // 85
    var schemas = this._c2._simpleSchemas;                                                                           // 86
    if (schemas && schemas.length > 0) {                                                                             // 87
      if (!doc) throw new Error('collection.simpleSchema() requires doc argument when there are multiple schemas');  // 88
                                                                                                                     // 89
      var schema, selector, target;                                                                                  // 90
      for (var i = 0; i < schemas.length; i++) {                                                                     // 91
        schema = schemas[i];                                                                                         // 92
        selector = Object.keys(schema.selector)[0];                                                                  // 93
                                                                                                                     // 94
        // We will set this to undefined because in theory you might want to select                                  // 95
        // on a null value.                                                                                          // 96
        target = undefined;                                                                                          // 97
                                                                                                                     // 98
        // here we are looking for selector in different places                                                      // 99
        // $set should have more priority here                                                                       // 100
        if (doc.$set && typeof doc.$set[selector] !== 'undefined') {                                                 // 101
          target = doc.$set[selector];                                                                               // 102
        } else if (typeof doc[selector] !== 'undefined') {                                                           // 103
          target = doc[selector];                                                                                    // 104
        } else if (options && options.selector) {                                                                    // 105
          target = options.selector[selector];                                                                       // 106
        } else if (query && query[selector]) { // on upsert/update operations                                        // 107
          target = query[selector];                                                                                  // 108
        }                                                                                                            // 109
                                                                                                                     // 110
        // we need to compare given selector with doc property or option to                                          // 111
        // find right schema                                                                                         // 112
        if (target !== undefined && target === schema.selector[selector]) {                                          // 113
          return schema.schema;                                                                                      // 114
        }                                                                                                            // 115
      }                                                                                                              // 116
    }                                                                                                                // 117
                                                                                                                     // 118
    return null;                                                                                                     // 119
  };                                                                                                                 // 120
});                                                                                                                  // 121
                                                                                                                     // 122
// Wrap DB write operation methods                                                                                   // 123
_.each(['insert', 'update'], function(methodName) {                                                                  // 124
  var _super = Mongo.Collection.prototype[methodName];                                                               // 125
  Mongo.Collection.prototype[methodName] = function() {                                                              // 126
    var self = this, options,                                                                                        // 127
        args = _.toArray(arguments);                                                                                 // 128
                                                                                                                     // 129
    options = (methodName === "insert") ? args[1] : args[2];                                                         // 130
                                                                                                                     // 131
    // Support missing options arg                                                                                   // 132
    if (!options || typeof options === "function") {                                                                 // 133
      options = {};                                                                                                  // 134
    }                                                                                                                // 135
                                                                                                                     // 136
    if (self._c2 && options.bypassCollection2 !== true) {                                                            // 137
      var userId = null;                                                                                             // 138
      try { // https://github.com/aldeed/meteor-collection2/issues/175                                               // 139
        userId = Meteor.userId();                                                                                    // 140
      } catch (err) {}                                                                                               // 141
                                                                                                                     // 142
      args = doValidate.call(                                                                                        // 143
        self,                                                                                                        // 144
        methodName,                                                                                                  // 145
        args,                                                                                                        // 146
        true, // getAutoValues                                                                                       // 147
        userId,                                                                                                      // 148
        Meteor.isServer // isFromTrustedCode                                                                         // 149
      );                                                                                                             // 150
      if (!args) {                                                                                                   // 151
        // doValidate already called the callback or threw the error so we're done.                                  // 152
        // But insert should always return an ID to match core behavior.                                             // 153
        return methodName === "insert" ? self._makeNewID() : undefined;                                              // 154
      }                                                                                                              // 155
    } else {                                                                                                         // 156
      // We still need to adjust args because insert does not take options                                           // 157
      if (methodName === "insert" && typeof args[1] !== 'function') args.splice(1, 1);                               // 158
    }                                                                                                                // 159
                                                                                                                     // 160
    return _super.apply(self, args);                                                                                 // 161
  };                                                                                                                 // 162
});                                                                                                                  // 163
                                                                                                                     // 164
/*                                                                                                                   // 165
 * Private                                                                                                           // 166
 */                                                                                                                  // 167
                                                                                                                     // 168
function doValidate(type, args, getAutoValues, userId, isFromTrustedCode) {                                          // 169
  var self = this, doc, callback, error, options, isUpsert, selector, last, hasCallback;                             // 170
                                                                                                                     // 171
  if (!args.length) {                                                                                                // 172
    throw new Error(type + " requires an argument");                                                                 // 173
  }                                                                                                                  // 174
                                                                                                                     // 175
  // Gather arguments and cache the selector                                                                         // 176
  if (type === "insert") {                                                                                           // 177
    doc = args[0];                                                                                                   // 178
    options = args[1];                                                                                               // 179
    callback = args[2];                                                                                              // 180
                                                                                                                     // 181
    // The real insert doesn't take options                                                                          // 182
    if (typeof options === "function") {                                                                             // 183
      args = [doc, options];                                                                                         // 184
    } else if (typeof callback === "function") {                                                                     // 185
      args = [doc, callback];                                                                                        // 186
    } else {                                                                                                         // 187
      args = [doc];                                                                                                  // 188
    }                                                                                                                // 189
  } else if (type === "update") {                                                                                    // 190
    selector = args[0];                                                                                              // 191
    doc = args[1];                                                                                                   // 192
    options = args[2];                                                                                               // 193
    callback = args[3];                                                                                              // 194
  } else {                                                                                                           // 195
    throw new Error("invalid type argument");                                                                        // 196
  }                                                                                                                  // 197
                                                                                                                     // 198
  var validatedObjectWasInitiallyEmpty = _.isEmpty(doc);                                                             // 199
                                                                                                                     // 200
  // Support missing options arg                                                                                     // 201
  if (!callback && typeof options === "function") {                                                                  // 202
    callback = options;                                                                                              // 203
    options = {};                                                                                                    // 204
  }                                                                                                                  // 205
  options = options || {};                                                                                           // 206
                                                                                                                     // 207
  last = args.length - 1;                                                                                            // 208
                                                                                                                     // 209
  hasCallback = (typeof args[last] === 'function');                                                                  // 210
                                                                                                                     // 211
  // If update was called with upsert:true, flag as an upsert                                                        // 212
  isUpsert = (type === "update" && options.upsert === true);                                                         // 213
                                                                                                                     // 214
  // we need to pass `doc` and `options` to `simpleSchema` method, that's why                                        // 215
  // schema declaration moved here                                                                                   // 216
  var schema = self.simpleSchema(doc, options, selector);                                                            // 217
  var isLocalCollection = (self._connection === null);                                                               // 218
                                                                                                                     // 219
  // On the server and for local collections, we allow passing `getAutoValues: false` to disable autoValue functions
  if ((Meteor.isServer || isLocalCollection) && options.getAutoValues === false) {                                   // 221
    getAutoValues = false;                                                                                           // 222
  }                                                                                                                  // 223
                                                                                                                     // 224
  // Determine validation context                                                                                    // 225
  var validationContext = options.validationContext;                                                                 // 226
  if (validationContext) {                                                                                           // 227
    if (typeof validationContext === 'string') {                                                                     // 228
      validationContext = schema.namedContext(validationContext);                                                    // 229
    }                                                                                                                // 230
  } else {                                                                                                           // 231
    validationContext = schema.namedContext();                                                                       // 232
  }                                                                                                                  // 233
                                                                                                                     // 234
  // Add a default callback function if we're on the client and no callback was given                                // 235
  if (Meteor.isClient && !callback) {                                                                                // 236
    // Client can't block, so it can't report errors by exception,                                                   // 237
    // only by callback. If they forget the callback, give them a                                                    // 238
    // default one that logs the error, so they aren't totally                                                       // 239
    // baffled if their writes don't work because their database is                                                  // 240
    // down.                                                                                                         // 241
    callback = function(err) {                                                                                       // 242
      if (err) {                                                                                                     // 243
        Meteor._debug(type + " failed: " + (err.reason || err.stack));                                               // 244
      }                                                                                                              // 245
    };                                                                                                               // 246
  }                                                                                                                  // 247
                                                                                                                     // 248
  // If client validation is fine or is skipped but then something                                                   // 249
  // is found to be invalid on the server, we get that error back                                                    // 250
  // as a special Meteor.Error that we need to parse.                                                                // 251
  if (Meteor.isClient && hasCallback) {                                                                              // 252
    callback = args[last] = wrapCallbackForParsingServerErrors(validationContext, callback);                         // 253
  }                                                                                                                  // 254
                                                                                                                     // 255
  var schemaAllowsId = schema.allowsKey("_id");                                                                      // 256
  if (type === "insert" && !doc._id && schemaAllowsId) {                                                             // 257
    doc._id = self._makeNewID();                                                                                     // 258
  }                                                                                                                  // 259
                                                                                                                     // 260
  // Get the docId for passing in the autoValue/custom context                                                       // 261
  var docId;                                                                                                         // 262
  if (type === 'insert') {                                                                                           // 263
    docId = doc._id; // might be undefined                                                                           // 264
  } else if (type === "update" && selector) {                                                                        // 265
    docId = typeof selector === 'string' || selector instanceof Mongo.ObjectID ? selector : selector._id;            // 266
  }                                                                                                                  // 267
                                                                                                                     // 268
  // If _id has already been added, remove it temporarily if it's                                                    // 269
  // not explicitly defined in the schema.                                                                           // 270
  var cachedId;                                                                                                      // 271
  if (doc._id && !schemaAllowsId) {                                                                                  // 272
    cachedId = doc._id;                                                                                              // 273
    delete doc._id;                                                                                                  // 274
  }                                                                                                                  // 275
                                                                                                                     // 276
  function doClean(docToClean, getAutoValues, filter, autoConvert, removeEmptyStrings, trimStrings) {                // 277
    // Clean the doc/modifier in place                                                                               // 278
    schema.clean(docToClean, {                                                                                       // 279
      filter: filter,                                                                                                // 280
      autoConvert: autoConvert,                                                                                      // 281
      getAutoValues: getAutoValues,                                                                                  // 282
      isModifier: (type !== "insert"),                                                                               // 283
      removeEmptyStrings: removeEmptyStrings,                                                                        // 284
      trimStrings: trimStrings,                                                                                      // 285
      extendAutoValueContext: _.extend({                                                                             // 286
        isInsert: (type === "insert"),                                                                               // 287
        isUpdate: (type === "update" && options.upsert !== true),                                                    // 288
        isUpsert: isUpsert,                                                                                          // 289
        userId: userId,                                                                                              // 290
        isFromTrustedCode: isFromTrustedCode,                                                                        // 291
        docId: docId,                                                                                                // 292
        isLocalCollection: isLocalCollection                                                                         // 293
      }, options.extendAutoValueContext || {})                                                                       // 294
    });                                                                                                              // 295
  }                                                                                                                  // 296
                                                                                                                     // 297
  // Preliminary cleaning on both client and server. On the server and for local                                     // 298
  // collections, automatic values will also be set at this point.                                                   // 299
  doClean(                                                                                                           // 300
    doc,                                                                                                             // 301
    getAutoValues,                                                                                                   // 302
    options.filter !== false,                                                                                        // 303
    options.autoConvert !== false,                                                                                   // 304
    options.removeEmptyStrings !== false,                                                                            // 305
    options.trimStrings !== false                                                                                    // 306
  );                                                                                                                 // 307
                                                                                                                     // 308
  // We clone before validating because in some cases we need to adjust the                                          // 309
  // object a bit before validating it. If we adjusted `doc` itself, our                                             // 310
  // changes would persist into the database.                                                                        // 311
  var docToValidate = {};                                                                                            // 312
  for (var prop in doc) {                                                                                            // 313
    // We omit prototype properties when cloning because they will not be valid                                      // 314
    // and mongo omits them when saving to the database anyway.                                                      // 315
    if (doc.hasOwnProperty(prop)) {                                                                                  // 316
      docToValidate[prop] = doc[prop];                                                                               // 317
    }                                                                                                                // 318
  }                                                                                                                  // 319
                                                                                                                     // 320
  // On the server, upserts are possible; SimpleSchema handles upserts pretty                                        // 321
  // well by default, but it will not know about the fields in the selector,                                         // 322
  // which are also stored in the database if an insert is performed. So we                                          // 323
  // will allow these fields to be considered for validation by adding them                                          // 324
  // to the $set in the modifier. This is no doubt prone to errors, but there                                        // 325
  // probably isn't any better way right now.                                                                        // 326
  if (Meteor.isServer && isUpsert && _.isObject(selector)) {                                                         // 327
    var set = docToValidate.$set || {};                                                                              // 328
    docToValidate.$set = _.clone(selector);                                                                          // 329
    if (!schemaAllowsId) delete docToValidate.$set._id;                                                              // 330
    _.extend(docToValidate.$set, set);                                                                               // 331
  }                                                                                                                  // 332
                                                                                                                     // 333
  // Set automatic values for validation on the client.                                                              // 334
  // On the server, we already updated doc with auto values, but on the client,                                      // 335
  // we will add them to docToValidate for validation purposes only.                                                 // 336
  // This is because we want all actual values generated on the server.                                              // 337
  if (Meteor.isClient && !isLocalCollection) {                                                                       // 338
    doClean(docToValidate, true, false, false, false, false);                                                        // 339
  }                                                                                                                  // 340
                                                                                                                     // 341
  // XXX Maybe move this into SimpleSchema                                                                           // 342
  if (!validatedObjectWasInitiallyEmpty && _.isEmpty(docToValidate)) {                                               // 343
    throw new Error('After filtering out keys not in the schema, your ' +                                            // 344
      (type === 'update' ? 'modifier' : 'object') +                                                                  // 345
      ' is now empty');                                                                                              // 346
  }                                                                                                                  // 347
                                                                                                                     // 348
  // Validate doc                                                                                                    // 349
  var isValid;                                                                                                       // 350
  if (options.validate === false) {                                                                                  // 351
    isValid = true;                                                                                                  // 352
  } else {                                                                                                           // 353
    isValid = validationContext.validate(docToValidate, {                                                            // 354
      modifier: (type === "update" || type === "upsert"),                                                            // 355
      upsert: isUpsert,                                                                                              // 356
      extendedCustomContext: _.extend({                                                                              // 357
        isInsert: (type === "insert"),                                                                               // 358
        isUpdate: (type === "update" && options.upsert !== true),                                                    // 359
        isUpsert: isUpsert,                                                                                          // 360
        userId: userId,                                                                                              // 361
        isFromTrustedCode: isFromTrustedCode,                                                                        // 362
        docId: docId,                                                                                                // 363
        isLocalCollection: isLocalCollection                                                                         // 364
      }, options.extendedCustomContext || {})                                                                        // 365
    });                                                                                                              // 366
  }                                                                                                                  // 367
                                                                                                                     // 368
  if (isValid) {                                                                                                     // 369
    // Add the ID back                                                                                               // 370
    if (cachedId) {                                                                                                  // 371
      doc._id = cachedId;                                                                                            // 372
    }                                                                                                                // 373
                                                                                                                     // 374
    // Update the args to reflect the cleaned doc                                                                    // 375
    // XXX not sure this is necessary since we mutate                                                                // 376
    if (type === "insert") {                                                                                         // 377
      args[0] = doc;                                                                                                 // 378
    } else {                                                                                                         // 379
      args[1] = doc;                                                                                                 // 380
    }                                                                                                                // 381
                                                                                                                     // 382
    // If callback, set invalidKey when we get a mongo unique error                                                  // 383
    if (Meteor.isServer && hasCallback) {                                                                            // 384
      args[last] = wrapCallbackForParsingMongoValidationErrors(validationContext, args[last]);                       // 385
    }                                                                                                                // 386
                                                                                                                     // 387
    return args;                                                                                                     // 388
  } else {                                                                                                           // 389
    error = getErrorObject(validationContext);                                                                       // 390
    if (callback) {                                                                                                  // 391
      // insert/update/upsert pass `false` when there's an error, so we do that                                      // 392
      callback(error, false);                                                                                        // 393
    } else {                                                                                                         // 394
      throw error;                                                                                                   // 395
    }                                                                                                                // 396
  }                                                                                                                  // 397
}                                                                                                                    // 398
                                                                                                                     // 399
function getErrorObject(context) {                                                                                   // 400
  var message, invalidKeys = context.invalidKeys();                                                                  // 401
  if (invalidKeys.length) {                                                                                          // 402
    message = context.keyErrorMessage(invalidKeys[0].name);                                                          // 403
  } else {                                                                                                           // 404
    message = "Failed validation";                                                                                   // 405
  }                                                                                                                  // 406
  var error = new Error(message);                                                                                    // 407
  error.invalidKeys = invalidKeys;                                                                                   // 408
  error.validationContext = context;                                                                                 // 409
  // If on the server, we add a sanitized error, too, in case we're                                                  // 410
  // called from a method.                                                                                           // 411
  if (Meteor.isServer) {                                                                                             // 412
    error.sanitizedError = new Meteor.Error(400, message, EJSON.stringify(error.invalidKeys));                       // 413
  }                                                                                                                  // 414
  return error;                                                                                                      // 415
}                                                                                                                    // 416
                                                                                                                     // 417
function addUniqueError(context, errorMessage) {                                                                     // 418
  var name = errorMessage.split('c2_')[1].split(' ')[0];                                                             // 419
  var val = errorMessage.split('dup key:')[1].split('"')[1];                                                         // 420
  context.addInvalidKeys([{                                                                                          // 421
    name: name,                                                                                                      // 422
    type: 'notUnique',                                                                                               // 423
    value: val                                                                                                       // 424
  }]);                                                                                                               // 425
}                                                                                                                    // 426
                                                                                                                     // 427
function wrapCallbackForParsingMongoValidationErrors(validationContext, cb) {                                        // 428
  return function wrappedCallbackForParsingMongoValidationErrors(error) {                                            // 429
    var args = _.toArray(arguments);                                                                                 // 430
    if (error &&                                                                                                     // 431
        ((error.name === "MongoError" && error.code === 11001) || error.message.indexOf('MongoError: E11000' !== -1)) &&
        error.message.indexOf('c2_') !== -1) {                                                                       // 433
      addUniqueError(validationContext, error.message);                                                              // 434
      args[0] = getErrorObject(validationContext);                                                                   // 435
    }                                                                                                                // 436
    return cb.apply(this, args);                                                                                     // 437
  };                                                                                                                 // 438
}                                                                                                                    // 439
                                                                                                                     // 440
function wrapCallbackForParsingServerErrors(validationContext, cb) {                                                 // 441
  return function wrappedCallbackForParsingServerErrors(error) {                                                     // 442
    var args = _.toArray(arguments);                                                                                 // 443
    // Handle our own validation errors                                                                              // 444
    if (error instanceof Meteor.Error &&                                                                             // 445
        error.error === 400 &&                                                                                       // 446
        error.reason === "INVALID" &&                                                                                // 447
        typeof error.details === "string") {                                                                         // 448
      var invalidKeysFromServer = EJSON.parse(error.details);                                                        // 449
      validationContext.addInvalidKeys(invalidKeysFromServer);                                                       // 450
      args[0] = getErrorObject(validationContext);                                                                   // 451
    }                                                                                                                // 452
    // Handle Mongo unique index errors, which are forwarded to the client as 409 errors                             // 453
    else if (error instanceof Meteor.Error &&                                                                        // 454
             error.error === 409 &&                                                                                  // 455
             error.reason &&                                                                                         // 456
             error.reason.indexOf('E11000') !== -1 &&                                                                // 457
             error.reason.indexOf('c2_') !== -1) {                                                                   // 458
      addUniqueError(validationContext, error.reason);                                                               // 459
      args[0] = getErrorObject(validationContext);                                                                   // 460
    }                                                                                                                // 461
    return cb.apply(this, args);                                                                                     // 462
  };                                                                                                                 // 463
}                                                                                                                    // 464
                                                                                                                     // 465
var alreadyInsecured = {};                                                                                           // 466
function keepInsecure(c) {                                                                                           // 467
  // If insecure package is in use, we need to add allow rules that return                                           // 468
  // true. Otherwise, it would seemingly turn off insecure mode.                                                     // 469
  if (Package && Package.insecure && !alreadyInsecured[c._name]) {                                                   // 470
    c.allow({                                                                                                        // 471
      insert: function() {                                                                                           // 472
        return true;                                                                                                 // 473
      },                                                                                                             // 474
      update: function() {                                                                                           // 475
        return true;                                                                                                 // 476
      },                                                                                                             // 477
      remove: function () {                                                                                          // 478
        return true;                                                                                                 // 479
      },                                                                                                             // 480
      fetch: [],                                                                                                     // 481
      transform: null                                                                                                // 482
    });                                                                                                              // 483
    alreadyInsecured[c._name] = true;                                                                                // 484
  }                                                                                                                  // 485
  // If insecure package is NOT in use, then adding the two deny functions                                           // 486
  // does not have any effect on the main app's security paradigm. The                                               // 487
  // user will still be required to add at least one allow function of her                                           // 488
  // own for each operation for this collection. And the user may still add                                          // 489
  // additional deny functions, but does not have to.                                                                // 490
}                                                                                                                    // 491
                                                                                                                     // 492
var alreadyDefined = {};                                                                                             // 493
function defineDeny(c, options) {                                                                                    // 494
  if (!alreadyDefined[c._name]) {                                                                                    // 495
                                                                                                                     // 496
    var isLocalCollection = (c._connection === null);                                                                // 497
                                                                                                                     // 498
    // First define deny functions to extend doc with the results of clean                                           // 499
    // and autovalues. This must be done with "transform: null" or we would be                                       // 500
    // extending a clone of doc and therefore have no effect.                                                        // 501
    c.deny({                                                                                                         // 502
      insert: function(userId, doc) {                                                                                // 503
        // Referenced doc is cleaned in place                                                                        // 504
        c.simpleSchema().clean(doc, {                                                                                // 505
          isModifier: false,                                                                                         // 506
          // We don't do these here because they are done on the client if desired                                   // 507
          filter: false,                                                                                             // 508
          autoConvert: false,                                                                                        // 509
          removeEmptyStrings: false,                                                                                 // 510
          trimStrings: false,                                                                                        // 511
          extendAutoValueContext: {                                                                                  // 512
            isInsert: true,                                                                                          // 513
            isUpdate: false,                                                                                         // 514
            isUpsert: false,                                                                                         // 515
            userId: userId,                                                                                          // 516
            isFromTrustedCode: false,                                                                                // 517
            docId: doc._id,                                                                                          // 518
            isLocalCollection: isLocalCollection                                                                     // 519
          }                                                                                                          // 520
        });                                                                                                          // 521
                                                                                                                     // 522
        return false;                                                                                                // 523
      },                                                                                                             // 524
      update: function(userId, doc, fields, modifier) {                                                              // 525
        // Referenced modifier is cleaned in place                                                                   // 526
        c.simpleSchema().clean(modifier, {                                                                           // 527
          isModifier: true,                                                                                          // 528
          // We don't do these here because they are done on the client if desired                                   // 529
          filter: false,                                                                                             // 530
          autoConvert: false,                                                                                        // 531
          removeEmptyStrings: false,                                                                                 // 532
          trimStrings: false,                                                                                        // 533
          extendAutoValueContext: {                                                                                  // 534
            isInsert: false,                                                                                         // 535
            isUpdate: true,                                                                                          // 536
            isUpsert: false,                                                                                         // 537
            userId: userId,                                                                                          // 538
            isFromTrustedCode: false,                                                                                // 539
            docId: doc && doc._id,                                                                                   // 540
            isLocalCollection: isLocalCollection                                                                     // 541
          }                                                                                                          // 542
        });                                                                                                          // 543
                                                                                                                     // 544
        return false;                                                                                                // 545
      },                                                                                                             // 546
      fetch: ['_id'],                                                                                                // 547
      transform: null                                                                                                // 548
    });                                                                                                              // 549
                                                                                                                     // 550
    // Second define deny functions to validate again on the server                                                  // 551
    // for client-initiated inserts and updates. These should be                                                     // 552
    // called after the clean/autovalue functions since we're adding                                                 // 553
    // them after. These must *not* have "transform: null" if options.transform is true because                      // 554
    // we need to pass the doc through any transforms to be sure                                                     // 555
    // that custom types are properly recognized for type validation.                                                // 556
    c.deny(_.extend({                                                                                                // 557
      insert: function(userId, doc) {                                                                                // 558
        // We pass the false options because we will have done them on client if desired                             // 559
        doValidate.call(                                                                                             // 560
          c,                                                                                                         // 561
          "insert",                                                                                                  // 562
          [                                                                                                          // 563
            doc,                                                                                                     // 564
            {                                                                                                        // 565
              trimStrings: false,                                                                                    // 566
              removeEmptyStrings: false,                                                                             // 567
              filter: false,                                                                                         // 568
              autoConvert: false                                                                                     // 569
            },                                                                                                       // 570
            function(error) {                                                                                        // 571
              if (error) {                                                                                           // 572
                throw new Meteor.Error(400, 'INVALID', EJSON.stringify(error.invalidKeys));                          // 573
              }                                                                                                      // 574
            }                                                                                                        // 575
          ],                                                                                                         // 576
          false, // getAutoValues                                                                                    // 577
          userId,                                                                                                    // 578
          false // isFromTrustedCode                                                                                 // 579
        );                                                                                                           // 580
                                                                                                                     // 581
        return false;                                                                                                // 582
      },                                                                                                             // 583
      update: function(userId, doc, fields, modifier) {                                                              // 584
        // NOTE: This will never be an upsert because client-side upserts                                            // 585
        // are not allowed once you define allow/deny functions.                                                     // 586
        // We pass the false options because we will have done them on client if desired                             // 587
        doValidate.call(                                                                                             // 588
          c,                                                                                                         // 589
          "update",                                                                                                  // 590
          [                                                                                                          // 591
            {_id: doc && doc._id},                                                                                   // 592
            modifier,                                                                                                // 593
            {                                                                                                        // 594
              trimStrings: false,                                                                                    // 595
              removeEmptyStrings: false,                                                                             // 596
              filter: false,                                                                                         // 597
              autoConvert: false                                                                                     // 598
            },                                                                                                       // 599
            function(error) {                                                                                        // 600
              if (error) {                                                                                           // 601
                throw new Meteor.Error(400, 'INVALID', EJSON.stringify(error.invalidKeys));                          // 602
              }                                                                                                      // 603
            }                                                                                                        // 604
          ],                                                                                                         // 605
          false, // getAutoValues                                                                                    // 606
          userId,                                                                                                    // 607
          false // isFromTrustedCode                                                                                 // 608
        );                                                                                                           // 609
                                                                                                                     // 610
        return false;                                                                                                // 611
      },                                                                                                             // 612
      fetch: ['_id']                                                                                                 // 613
    }, options.transform === true ? {} : {transform: null}));                                                        // 614
                                                                                                                     // 615
    // note that we've already done this collection so that we don't do it again                                     // 616
    // if attachSchema is called again                                                                               // 617
    alreadyDefined[c._name] = true;                                                                                  // 618
  }                                                                                                                  // 619
}                                                                                                                    // 620
                                                                                                                     // 621
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['aldeed:collection2-core'] = {
  Collection2: Collection2
};

})();
