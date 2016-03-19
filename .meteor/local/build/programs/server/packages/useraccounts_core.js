(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Accounts = Package['accounts-base'].Accounts;
var AccountsServer = Package['accounts-base'].AccountsServer;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;

/* Package-scope variables */
var Field, STATE_PAT, ERRORS_PAT, INFO_PAT, INPUT_ICONS_PAT, ObjWithStringValues, TEXTS_PAT, CONFIG_PAT, FIELD_SUB_PAT, FIELD_PAT, AT, AccountsTemplates;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/useraccounts_core/lib/field.js                                                                     //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
// ---------------------------------------------------------------------------------                           // 1
// Field object                                                                                                // 2
// ---------------------------------------------------------------------------------                           // 3
                                                                                                               // 4
Field = function(field) {                                                                                      // 5
  check(field, FIELD_PAT);                                                                                     // 6
  _.defaults(this, field);                                                                                     // 7
                                                                                                               // 8
  this.validating = new ReactiveVar(false);                                                                    // 9
  this.status = new ReactiveVar(null);                                                                         // 10
};                                                                                                             // 11
                                                                                                               // 12
if (Meteor.isClient) {                                                                                         // 13
  Field.prototype.clearStatus = function() {                                                                   // 14
    return this.status.set(null);                                                                              // 15
  };                                                                                                           // 16
}                                                                                                              // 17
                                                                                                               // 18
if (Meteor.isServer) {                                                                                         // 19
  Field.prototype.clearStatus = function() {                                                                   // 20
    // Nothing to do server-side                                                                               // 21
    return;                                                                                                    // 22
  };                                                                                                           // 23
}                                                                                                              // 24
                                                                                                               // 25
Field.prototype.fixValue = function(value) {                                                                   // 26
  if (this.type === "checkbox") {                                                                              // 27
    return !!value;                                                                                            // 28
  }                                                                                                            // 29
                                                                                                               // 30
  if (this.type === "select") {                                                                                // 31
    // TODO: something working...                                                                              // 32
    return value;                                                                                              // 33
  }                                                                                                            // 34
                                                                                                               // 35
  if (this.type === "radio") {                                                                                 // 36
    // TODO: something working...                                                                              // 37
    return value;                                                                                              // 38
  }                                                                                                            // 39
                                                                                                               // 40
  // Possibly applies required transformations to the input value                                              // 41
  if (this.trim) {                                                                                             // 42
    value = value.trim();                                                                                      // 43
  }                                                                                                            // 44
                                                                                                               // 45
  if (this.lowercase) {                                                                                        // 46
    value = value.toLowerCase();                                                                               // 47
  }                                                                                                            // 48
                                                                                                               // 49
  if (this.uppercase) {                                                                                        // 50
    value = value.toUpperCase();                                                                               // 51
  }                                                                                                            // 52
                                                                                                               // 53
  if (!!this.transform) {                                                                                      // 54
    value = this.transform(value);                                                                             // 55
  }                                                                                                            // 56
                                                                                                               // 57
  return value;                                                                                                // 58
};                                                                                                             // 59
                                                                                                               // 60
if (Meteor.isClient) {                                                                                         // 61
  Field.prototype.getDisplayName = function(state) {                                                           // 62
    var displayName = this.displayName;                                                                        // 63
                                                                                                               // 64
    if (_.isFunction(displayName)) {                                                                           // 65
      displayName = displayName();                                                                             // 66
    } else if (_.isObject(displayName)) {                                                                      // 67
      displayName = displayName[state] || displayName["default"];                                              // 68
    }                                                                                                          // 69
                                                                                                               // 70
    if (!displayName) {                                                                                        // 71
      displayName = capitalize(this._id);                                                                      // 72
    }                                                                                                          // 73
                                                                                                               // 74
    return displayName;                                                                                        // 75
  };                                                                                                           // 76
}                                                                                                              // 77
                                                                                                               // 78
if (Meteor.isClient) {                                                                                         // 79
  Field.prototype.getPlaceholder = function(state) {                                                           // 80
    var placeholder = this.placeholder;                                                                        // 81
                                                                                                               // 82
    if (_.isObject(placeholder)) {                                                                             // 83
      placeholder = placeholder[state] || placeholder["default"];                                              // 84
    }                                                                                                          // 85
                                                                                                               // 86
    if (!placeholder) {                                                                                        // 87
      placeholder = capitalize(this._id);                                                                      // 88
    }                                                                                                          // 89
                                                                                                               // 90
    return placeholder;                                                                                        // 91
  };                                                                                                           // 92
}                                                                                                              // 93
                                                                                                               // 94
Field.prototype.getStatus = function() {                                                                       // 95
  return this.status.get();                                                                                    // 96
};                                                                                                             // 97
                                                                                                               // 98
if (Meteor.isClient) {                                                                                         // 99
  Field.prototype.getValue = function(tempalteInstance) {                                                      // 100
    if (this.type === "checkbox") {                                                                            // 101
      return !!(tempalteInstance.$("#at-field-" + this._id + ":checked").val());                               // 102
    }                                                                                                          // 103
                                                                                                               // 104
    if (this.type === "radio") {                                                                               // 105
      return tempalteInstance.$("[name=at-field-"+ this._id + "]:checked").val();                              // 106
    }                                                                                                          // 107
                                                                                                               // 108
    return tempalteInstance.$("#at-field-" + this._id).val();                                                  // 109
  };                                                                                                           // 110
}                                                                                                              // 111
                                                                                                               // 112
if (Meteor.isClient) {                                                                                         // 113
  Field.prototype.hasError = function() {                                                                      // 114
    return this.negativeValidation && this.status.get();                                                       // 115
  };                                                                                                           // 116
}                                                                                                              // 117
                                                                                                               // 118
if (Meteor.isClient) {                                                                                         // 119
  Field.prototype.hasIcon = function() {                                                                       // 120
    if (this.showValidating && this.isValidating()) {                                                          // 121
      return true;                                                                                             // 122
    }                                                                                                          // 123
                                                                                                               // 124
    if (this.negativeFeedback && this.hasError()) {                                                            // 125
      return true;                                                                                             // 126
    }                                                                                                          // 127
                                                                                                               // 128
    if (this.positiveFeedback && this.hasSuccess()) {                                                          // 129
      return true;                                                                                             // 130
    }                                                                                                          // 131
  };                                                                                                           // 132
}                                                                                                              // 133
                                                                                                               // 134
if (Meteor.isClient) {                                                                                         // 135
  Field.prototype.hasSuccess = function() {                                                                    // 136
    return this.positiveValidation && this.status.get() === false;                                             // 137
  };                                                                                                           // 138
}                                                                                                              // 139
                                                                                                               // 140
if (Meteor.isClient)                                                                                           // 141
  Field.prototype.iconClass = function() {                                                                     // 142
    if (this.isValidating()) {                                                                                 // 143
      return AccountsTemplates.texts.inputIcons["isValidating"];                                               // 144
    }                                                                                                          // 145
                                                                                                               // 146
    if (this.hasError()) {                                                                                     // 147
      return AccountsTemplates.texts.inputIcons["hasError"];                                                   // 148
    }                                                                                                          // 149
                                                                                                               // 150
    if (this.hasSuccess()) {                                                                                   // 151
      return AccountsTemplates.texts.inputIcons["hasSuccess"];                                                 // 152
    }                                                                                                          // 153
  };                                                                                                           // 154
                                                                                                               // 155
if (Meteor.isClient) {                                                                                         // 156
  Field.prototype.isValidating = function() {                                                                  // 157
    return this.validating.get();                                                                              // 158
  };                                                                                                           // 159
}                                                                                                              // 160
                                                                                                               // 161
if (Meteor.isClient) {                                                                                         // 162
  Field.prototype.setError = function(err) {                                                                   // 163
    check(err, Match.OneOf(String, undefined, Boolean));                                                       // 164
                                                                                                               // 165
    if (err === false) {                                                                                       // 166
      return this.status.set(false);                                                                           // 167
    }                                                                                                          // 168
                                                                                                               // 169
    return this.status.set(err || true);                                                                       // 170
  };                                                                                                           // 171
}                                                                                                              // 172
                                                                                                               // 173
if (Meteor.isServer) {                                                                                         // 174
  Field.prototype.setError = function(err) {                                                                   // 175
    // Nothing to do server-side                                                                               // 176
    return;                                                                                                    // 177
  };                                                                                                           // 178
}                                                                                                              // 179
                                                                                                               // 180
if (Meteor.isClient) {                                                                                         // 181
  Field.prototype.setSuccess = function() {                                                                    // 182
    return this.status.set(false);                                                                             // 183
  };                                                                                                           // 184
}                                                                                                              // 185
                                                                                                               // 186
if (Meteor.isServer) {                                                                                         // 187
  Field.prototype.setSuccess = function() {                                                                    // 188
    // Nothing to do server-side                                                                               // 189
    return;                                                                                                    // 190
  };                                                                                                           // 191
}                                                                                                              // 192
                                                                                                               // 193
if (Meteor.isClient) {                                                                                         // 194
  Field.prototype.setValidating = function(state) {                                                            // 195
    check(state, Boolean);                                                                                     // 196
    return this.validating.set(state);                                                                         // 197
  };                                                                                                           // 198
}                                                                                                              // 199
                                                                                                               // 200
if (Meteor.isServer) {                                                                                         // 201
  Field.prototype.setValidating = function(state) {                                                            // 202
    // Nothing to do server-side                                                                               // 203
    return;                                                                                                    // 204
  };                                                                                                           // 205
}                                                                                                              // 206
                                                                                                               // 207
if (Meteor.isClient) {                                                                                         // 208
  Field.prototype.setValue = function(tempalteInstance, value) {                                               // 209
    if (this.type === "checkbox") {                                                                            // 210
      tempalteInstance.$("#at-field-" + this._id).prop('checked', true);                                       // 211
      return;                                                                                                  // 212
    }                                                                                                          // 213
                                                                                                               // 214
    if (this.type === "radio") {                                                                               // 215
      tempalteInstance.$("[name=at-field-"+ this._id + "]").prop('checked', true);                             // 216
      return;                                                                                                  // 217
    }                                                                                                          // 218
                                                                                                               // 219
    tempalteInstance.$("#at-field-" + this._id).val(value);                                                    // 220
  };                                                                                                           // 221
}                                                                                                              // 222
                                                                                                               // 223
Field.prototype.validate = function(value, strict) {                                                           // 224
  check(value, Match.OneOf(undefined, String, Boolean));                                                       // 225
  this.setValidating(true);                                                                                    // 226
  this.clearStatus();                                                                                          // 227
                                                                                                               // 228
  if (_.isUndefined(value) || value === '') {                                                                  // 229
    if (!!strict) {                                                                                            // 230
      if (this.required) {                                                                                     // 231
        this.setError(AccountsTemplates.texts.requiredField);                                                  // 232
        this.setValidating(false);                                                                             // 233
                                                                                                               // 234
        return AccountsTemplates.texts.requiredField;                                                          // 235
      } else {                                                                                                 // 236
        this.setSuccess();                                                                                     // 237
        this.setValidating(false);                                                                             // 238
                                                                                                               // 239
        return false;                                                                                          // 240
      }                                                                                                        // 241
    } else {                                                                                                   // 242
      this.clearStatus();                                                                                      // 243
      this.setValidating(false);                                                                               // 244
                                                                                                               // 245
      return null;                                                                                             // 246
    }                                                                                                          // 247
  }                                                                                                            // 248
                                                                                                               // 249
  var valueLength = value.length;                                                                              // 250
  var minLength = this.minLength;                                                                              // 251
  if (minLength && valueLength < minLength) {                                                                  // 252
    this.setError(AccountsTemplates.texts.minRequiredLength + ": " + minLength);                               // 253
    this.setValidating(false);                                                                                 // 254
                                                                                                               // 255
    return AccountsTemplates.texts.minRequiredLength + ": " + minLength;                                       // 256
  }                                                                                                            // 257
                                                                                                               // 258
  var maxLength = this.maxLength;                                                                              // 259
  if (maxLength && valueLength > maxLength) {                                                                  // 260
    this.setError(AccountsTemplates.texts.maxAllowedLength + ": " + maxLength);                                // 261
    this.setValidating(false);                                                                                 // 262
                                                                                                               // 263
    return AccountsTemplates.texts.maxAllowedLength + ": " + maxLength;                                        // 264
  }                                                                                                            // 265
                                                                                                               // 266
  if (this.re && valueLength && !value.match(this.re)) {                                                       // 267
    this.setError(this.errStr);                                                                                // 268
    this.setValidating(false);                                                                                 // 269
                                                                                                               // 270
    return this.errStr;                                                                                        // 271
  }                                                                                                            // 272
                                                                                                               // 273
  if (this.func) {                                                                                             // 274
    var result = this.func(value);                                                                             // 275
    var err = result === true ? this.errStr || true : result;                                                  // 276
                                                                                                               // 277
    if (_.isUndefined(result)) {                                                                               // 278
      return err;                                                                                              // 279
    }                                                                                                          // 280
                                                                                                               // 281
    this.status.set(err);                                                                                      // 282
    this.setValidating(false);                                                                                 // 283
                                                                                                               // 284
    return err;                                                                                                // 285
  }                                                                                                            // 286
                                                                                                               // 287
  this.setSuccess();                                                                                           // 288
  this.setValidating(false);                                                                                   // 289
                                                                                                               // 290
  return false;                                                                                                // 291
};                                                                                                             // 292
                                                                                                               // 293
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/useraccounts_core/lib/core.js                                                                      //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
// ---------------------------------------------------------------------------------                           // 1
// Patterns for methods" parameters                                                                            // 2
// ---------------------------------------------------------------------------------                           // 3
                                                                                                               // 4
STATE_PAT = {                                                                                                  // 5
  changePwd: Match.Optional(String),                                                                           // 6
  enrollAccount: Match.Optional(String),                                                                       // 7
  forgotPwd: Match.Optional(String),                                                                           // 8
  resetPwd: Match.Optional(String),                                                                            // 9
  signIn: Match.Optional(String),                                                                              // 10
  signUp: Match.Optional(String),                                                                              // 11
  verifyEmail: Match.Optional(String),                                                                         // 12
  resendVerificationEmail: Match.Optional(String),                                                             // 13
};                                                                                                             // 14
                                                                                                               // 15
ERRORS_PAT = {                                                                                                 // 16
  accountsCreationDisabled: Match.Optional(String),                                                            // 17
  cannotRemoveService: Match.Optional(String),                                                                 // 18
  captchaVerification: Match.Optional(String),                                                                 // 19
  loginForbidden: Match.Optional(String),                                                                      // 20
  mustBeLoggedIn: Match.Optional(String),                                                                      // 21
  pwdMismatch: Match.Optional(String),                                                                         // 22
  validationErrors: Match.Optional(String),                                                                    // 23
  verifyEmailFirst: Match.Optional(String),                                                                    // 24
};                                                                                                             // 25
                                                                                                               // 26
INFO_PAT = {                                                                                                   // 27
  emailSent: Match.Optional(String),                                                                           // 28
  emailVerified: Match.Optional(String),                                                                       // 29
  pwdChanged: Match.Optional(String),                                                                          // 30
  pwdReset: Match.Optional(String),                                                                            // 31
  pwdSet: Match.Optional(String),                                                                              // 32
  signUpVerifyEmail: Match.Optional(String),                                                                   // 33
  verificationEmailSent: Match.Optional(String),                                                               // 34
};                                                                                                             // 35
                                                                                                               // 36
INPUT_ICONS_PAT = {                                                                                            // 37
  hasError: Match.Optional(String),                                                                            // 38
  hasSuccess: Match.Optional(String),                                                                          // 39
  isValidating: Match.Optional(String),                                                                        // 40
};                                                                                                             // 41
                                                                                                               // 42
ObjWithStringValues = Match.Where(function (x) {                                                               // 43
  check(x, Object);                                                                                            // 44
  _.each(_.values(x), function(value) {                                                                        // 45
      check(value, String);                                                                                    // 46
  });                                                                                                          // 47
  return true;                                                                                                 // 48
});                                                                                                            // 49
                                                                                                               // 50
TEXTS_PAT = {                                                                                                  // 51
  button: Match.Optional(STATE_PAT),                                                                           // 52
  errors: Match.Optional(ERRORS_PAT),                                                                          // 53
  info: Match.Optional(INFO_PAT),                                                                              // 54
  inputIcons: Match.Optional(INPUT_ICONS_PAT),                                                                 // 55
  maxAllowedLength: Match.Optional(String),                                                                    // 56
  minRequiredLength: Match.Optional(String),                                                                   // 57
  navSignIn: Match.Optional(String),                                                                           // 58
  navSignOut: Match.Optional(String),                                                                          // 59
  optionalField: Match.Optional(String),                                                                       // 60
  pwdLink_link: Match.Optional(String),                                                                        // 61
  pwdLink_pre: Match.Optional(String),                                                                         // 62
  pwdLink_suff: Match.Optional(String),                                                                        // 63
  requiredField: Match.Optional(String),                                                                       // 64
  resendVerificationEmailLink_pre: Match.Optional(String),                                                     // 65
  resendVerificationEmailLink_link: Match.Optional(String),                                                    // 66
  resendVerificationEmailLink_suff: Match.Optional(String),                                                    // 67
  sep: Match.Optional(String),                                                                                 // 68
  signInLink_link: Match.Optional(String),                                                                     // 69
  signInLink_pre: Match.Optional(String),                                                                      // 70
  signInLink_suff: Match.Optional(String),                                                                     // 71
  signUpLink_link: Match.Optional(String),                                                                     // 72
  signUpLink_pre: Match.Optional(String),                                                                      // 73
  signUpLink_suff: Match.Optional(String),                                                                     // 74
  socialAdd: Match.Optional(String),                                                                           // 75
  socialConfigure: Match.Optional(String),                                                                     // 76
  socialIcons: Match.Optional(ObjWithStringValues),                                                            // 77
  socialRemove: Match.Optional(String),                                                                        // 78
  socialSignIn: Match.Optional(String),                                                                        // 79
  socialSignUp: Match.Optional(String),                                                                        // 80
  socialWith: Match.Optional(String),                                                                          // 81
  termsAnd: Match.Optional(String),                                                                            // 82
  termsPreamble: Match.Optional(String),                                                                       // 83
  termsPrivacy: Match.Optional(String),                                                                        // 84
  termsTerms: Match.Optional(String),                                                                          // 85
  title: Match.Optional(STATE_PAT),                                                                            // 86
};                                                                                                             // 87
                                                                                                               // 88
// Configuration pattern to be checked with check                                                              // 89
CONFIG_PAT = {                                                                                                 // 90
  // Behaviour                                                                                                 // 91
  confirmPassword: Match.Optional(Boolean),                                                                    // 92
  defaultState: Match.Optional(String),                                                                        // 93
  enablePasswordChange: Match.Optional(Boolean),                                                               // 94
  enforceEmailVerification: Match.Optional(Boolean),                                                           // 95
  focusFirstInput: Match.Optional(Boolean),                                                                    // 96
  forbidClientAccountCreation: Match.Optional(Boolean),                                                        // 97
  lowercaseUsername: Match.Optional(Boolean),                                                                  // 98
  overrideLoginErrors: Match.Optional(Boolean),                                                                // 99
  sendVerificationEmail: Match.Optional(Boolean),                                                              // 100
  socialLoginStyle: Match.Optional(Match.OneOf("popup", "redirect")),                                          // 101
                                                                                                               // 102
  // Appearance                                                                                                // 103
  defaultLayout: Match.Optional(String),                                                                       // 104
  hideSignInLink: Match.Optional(Boolean),                                                                     // 105
  hideSignUpLink: Match.Optional(Boolean),                                                                     // 106
  showAddRemoveServices: Match.Optional(Boolean),                                                              // 107
  showForgotPasswordLink: Match.Optional(Boolean),                                                             // 108
  showResendVerificationEmailLink: Match.Optional(Boolean),                                                    // 109
  showLabels: Match.Optional(Boolean),                                                                         // 110
  showPlaceholders: Match.Optional(Boolean),                                                                   // 111
                                                                                                               // 112
  // Client-side Validation                                                                                    // 113
  continuousValidation: Match.Optional(Boolean),                                                               // 114
  negativeFeedback: Match.Optional(Boolean),                                                                   // 115
  negativeValidation: Match.Optional(Boolean),                                                                 // 116
  positiveFeedback: Match.Optional(Boolean),                                                                   // 117
  positiveValidation: Match.Optional(Boolean),                                                                 // 118
  showValidating: Match.Optional(Boolean),                                                                     // 119
                                                                                                               // 120
  // Privacy Policy and Terms of Use                                                                           // 121
  privacyUrl: Match.Optional(String),                                                                          // 122
  termsUrl: Match.Optional(String),                                                                            // 123
                                                                                                               // 124
  // Redirects                                                                                                 // 125
  homeRoutePath: Match.Optional(String),                                                                       // 126
  redirectTimeout: Match.Optional(Number),                                                                     // 127
                                                                                                               // 128
  // Hooks                                                                                                     // 129
  onLogoutHook: Match.Optional(Function),                                                                      // 130
  onSubmitHook: Match.Optional(Function),                                                                      // 131
  preSignUpHook: Match.Optional(Function),                                                                     // 132
  postSignUpHook: Match.Optional(Function),                                                                    // 133
                                                                                                               // 134
  texts: Match.Optional(TEXTS_PAT),                                                                            // 135
                                                                                                               // 136
  //reCaptcha config                                                                                           // 137
  reCaptcha: Match.Optional({                                                                                  // 138
    data_type: Match.Optional(Match.OneOf("audio", "image")),                                                  // 139
    secretKey: Match.Optional(String),                                                                         // 140
    siteKey: Match.Optional(String),                                                                           // 141
    theme: Match.Optional(Match.OneOf("dark", "light")),                                                       // 142
  }),                                                                                                          // 143
                                                                                                               // 144
  showReCaptcha: Match.Optional(Boolean),                                                                      // 145
};                                                                                                             // 146
                                                                                                               // 147
                                                                                                               // 148
FIELD_SUB_PAT = {                                                                                              // 149
  "default": Match.Optional(String),                                                                           // 150
  changePwd: Match.Optional(String),                                                                           // 151
  enrollAccount: Match.Optional(String),                                                                       // 152
  forgotPwd: Match.Optional(String),                                                                           // 153
  resetPwd: Match.Optional(String),                                                                            // 154
  signIn: Match.Optional(String),                                                                              // 155
  signUp: Match.Optional(String),                                                                              // 156
};                                                                                                             // 157
                                                                                                               // 158
                                                                                                               // 159
// Field pattern                                                                                               // 160
FIELD_PAT = {                                                                                                  // 161
  _id: String,                                                                                                 // 162
  type: String,                                                                                                // 163
  required: Match.Optional(Boolean),                                                                           // 164
  displayName: Match.Optional(Match.OneOf(String, Match.Where(_.isFunction), FIELD_SUB_PAT)),                  // 165
  placeholder: Match.Optional(Match.OneOf(String, FIELD_SUB_PAT)),                                             // 166
  select: Match.Optional([{text: String, value: Match.Any}]),                                                  // 167
  minLength: Match.Optional(Match.Integer),                                                                    // 168
  maxLength: Match.Optional(Match.Integer),                                                                    // 169
  re: Match.Optional(RegExp),                                                                                  // 170
  func: Match.Optional(Match.Where(_.isFunction)),                                                             // 171
  errStr: Match.Optional(String),                                                                              // 172
                                                                                                               // 173
  // Client-side Validation                                                                                    // 174
  continuousValidation: Match.Optional(Boolean),                                                               // 175
  negativeFeedback: Match.Optional(Boolean),                                                                   // 176
  negativeValidation: Match.Optional(Boolean),                                                                 // 177
  positiveValidation: Match.Optional(Boolean),                                                                 // 178
  positiveFeedback: Match.Optional(Boolean),                                                                   // 179
                                                                                                               // 180
  // Transforms                                                                                                // 181
  trim: Match.Optional(Boolean),                                                                               // 182
  lowercase: Match.Optional(Boolean),                                                                          // 183
  uppercase: Match.Optional(Boolean),                                                                          // 184
  transform: Match.Optional(Match.Where(_.isFunction)),                                                        // 185
                                                                                                               // 186
  // Custom options                                                                                            // 187
  options: Match.Optional(Object),                                                                             // 188
  template: Match.Optional(String),                                                                            // 189
};                                                                                                             // 190
                                                                                                               // 191
// -----------------------------------------------------------------------------                               // 192
// AccountsTemplates object                                                                                    // 193
// -----------------------------------------------------------------------------                               // 194
                                                                                                               // 195
// -------------------                                                                                         // 196
// Client/Server stuff                                                                                         // 197
// -------------------                                                                                         // 198
                                                                                                               // 199
// Constructor                                                                                                 // 200
AT = function() {                                                                                              // 201
                                                                                                               // 202
};                                                                                                             // 203
                                                                                                               // 204
AT.prototype.CONFIG_PAT = CONFIG_PAT;                                                                          // 205
                                                                                                               // 206
/*                                                                                                             // 207
  Each field object is represented by the following properties:                                                // 208
    _id:         String   (required)  // A unique field"s id / name                                            // 209
    type:        String   (required)  // Displayed input type                                                  // 210
    required:    Boolean  (optional)  // Specifies Whether to fail or not when field is left empty             // 211
    displayName: String   (optional)  // The field"s name to be displayed as a label above the input element   // 212
    placeholder: String   (optional)  // The placeholder text to be displayed inside the input element         // 213
    minLength:   Integer  (optional)  // Possibly specifies the minimum allowed length                         // 214
    maxLength:   Integer  (optional)  // Possibly specifies the maximum allowed length                         // 215
    re:          RegExp   (optional)  // Regular expression for validation                                     // 216
    func:        Function (optional)  // Custom function for validation                                        // 217
    errStr:      String   (optional)  // Error message to be displayed in case re validation fails             // 218
*/                                                                                                             // 219
                                                                                                               // 220
                                                                                                               // 221
// Allowed input types                                                                                         // 222
AT.prototype.INPUT_TYPES = [                                                                                   // 223
  "checkbox",                                                                                                  // 224
  "email",                                                                                                     // 225
  "hidden",                                                                                                    // 226
  "password",                                                                                                  // 227
  "radio",                                                                                                     // 228
  "select",                                                                                                    // 229
  "tel",                                                                                                       // 230
  "text",                                                                                                      // 231
  "url",                                                                                                       // 232
];                                                                                                             // 233
                                                                                                               // 234
// Current configuration values                                                                                // 235
AT.prototype.options = {                                                                                       // 236
  // Appearance                                                                                                // 237
  //defaultLayout: undefined,                                                                                  // 238
  showAddRemoveServices: false,                                                                                // 239
  showForgotPasswordLink: false,                                                                               // 240
  showResendVerificationEmailLink: false,                                                                      // 241
  showLabels: true,                                                                                            // 242
  showPlaceholders: true,                                                                                      // 243
                                                                                                               // 244
  // Behaviour                                                                                                 // 245
  confirmPassword: true,                                                                                       // 246
  defaultState: "signIn",                                                                                      // 247
  enablePasswordChange: false,                                                                                 // 248
  focusFirstInput: !Meteor.isCordova,                                                                          // 249
  forbidClientAccountCreation: false,                                                                          // 250
  lowercaseUsername: false,                                                                                    // 251
  overrideLoginErrors: true,                                                                                   // 252
  sendVerificationEmail: false,                                                                                // 253
  socialLoginStyle: "popup",                                                                                   // 254
                                                                                                               // 255
  // Client-side Validation                                                                                    // 256
  //continuousValidation: false,                                                                               // 257
  //negativeFeedback: false,                                                                                   // 258
  //negativeValidation: false,                                                                                 // 259
  //positiveValidation: false,                                                                                 // 260
  //positiveFeedback: false,                                                                                   // 261
  //showValidating: false,                                                                                     // 262
                                                                                                               // 263
  // Privacy Policy and Terms of Use                                                                           // 264
  privacyUrl: undefined,                                                                                       // 265
  termsUrl: undefined,                                                                                         // 266
                                                                                                               // 267
  // Hooks                                                                                                     // 268
  onSubmitHook: undefined,                                                                                     // 269
};                                                                                                             // 270
                                                                                                               // 271
AT.prototype.texts = {                                                                                         // 272
  button: {                                                                                                    // 273
    changePwd: "updateYourPassword",                                                                           // 274
    //enrollAccount: "createAccount",                                                                          // 275
    enrollAccount: "signUp",                                                                                   // 276
    forgotPwd: "emailResetLink",                                                                               // 277
    resetPwd: "setPassword",                                                                                   // 278
    signIn: "signIn",                                                                                          // 279
    signUp: "signUp",                                                                                          // 280
    resendVerificationEmail: "Send email again",                                                               // 281
  },                                                                                                           // 282
  errors: {                                                                                                    // 283
    accountsCreationDisabled: "Client side accounts creation is disabled!!!",                                  // 284
    cannotRemoveService: "Cannot remove the only active service!",                                             // 285
    captchaVerification: "Captcha verification failed!",                                                       // 286
    loginForbidden: "error.accounts.Login forbidden",                                                          // 287
    mustBeLoggedIn: "error.accounts.Must be logged in",                                                        // 288
    pwdMismatch: "error.pwdsDontMatch",                                                                        // 289
    validationErrors: "Validation Errors",                                                                     // 290
    verifyEmailFirst: "Please verify your email first. Check the email and follow the link!",                  // 291
  },                                                                                                           // 292
  navSignIn: 'signIn',                                                                                         // 293
  navSignOut: 'signOut',                                                                                       // 294
  info: {                                                                                                      // 295
    emailSent: "info.emailSent",                                                                               // 296
    emailVerified: "info.emailVerified",                                                                       // 297
    pwdChanged: "info.passwordChanged",                                                                        // 298
    pwdReset: "info.passwordReset",                                                                            // 299
    pwdSet: "Password Set",                                                                                    // 300
    signUpVerifyEmail: "Successful Registration! Please check your email and follow the instructions.",        // 301
    verificationEmailSent: "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.",
  },                                                                                                           // 303
  inputIcons: {                                                                                                // 304
    isValidating: "fa fa-spinner fa-spin",                                                                     // 305
    hasSuccess: "fa fa-check",                                                                                 // 306
    hasError: "fa fa-times",                                                                                   // 307
  },                                                                                                           // 308
  maxAllowedLength: "Maximum allowed length",                                                                  // 309
  minRequiredLength: "Minimum required length",                                                                // 310
  optionalField: "optional",                                                                                   // 311
  pwdLink_pre: "",                                                                                             // 312
  pwdLink_link: "forgotPassword",                                                                              // 313
  pwdLink_suff: "",                                                                                            // 314
  requiredField: "Required Field",                                                                             // 315
  resendVerificationEmailLink_pre: "Verification email lost?",                                                 // 316
  resendVerificationEmailLink_link: "Send again",                                                              // 317
  resendVerificationEmailLink_suff: "",                                                                        // 318
  sep: "OR",                                                                                                   // 319
  signInLink_pre: "ifYouAlreadyHaveAnAccount",                                                                 // 320
  signInLink_link: "signin",                                                                                   // 321
  signInLink_suff: "",                                                                                         // 322
  signUpLink_pre: "dontHaveAnAccount",                                                                         // 323
  signUpLink_link: "signUp",                                                                                   // 324
  signUpLink_suff: "",                                                                                         // 325
  socialAdd: "add",                                                                                            // 326
  socialConfigure: "configure",                                                                                // 327
  socialIcons: {                                                                                               // 328
      "meteor-developer": "fa fa-rocket"                                                                       // 329
  },                                                                                                           // 330
  socialRemove: "remove",                                                                                      // 331
  socialSignIn: "signIn",                                                                                      // 332
  socialSignUp: "signUp",                                                                                      // 333
  socialWith: "with",                                                                                          // 334
  termsPreamble: "clickAgree",                                                                                 // 335
  termsPrivacy: "privacyPolicy",                                                                               // 336
  termsAnd: "and",                                                                                             // 337
  termsTerms: "terms",                                                                                         // 338
  title: {                                                                                                     // 339
    changePwd: "changePassword",                                                                               // 340
    enrollAccount: "createAccount",                                                                            // 341
    forgotPwd: "resetYourPassword",                                                                            // 342
    resetPwd: "resetYourPassword",                                                                             // 343
    signIn: "signIn",                                                                                          // 344
    signUp: "createAccount",                                                                                   // 345
    verifyEmail: "",                                                                                           // 346
    resendVerificationEmail: "Send the verification email again",                                              // 347
  },                                                                                                           // 348
};                                                                                                             // 349
                                                                                                               // 350
AT.prototype.SPECIAL_FIELDS = [                                                                                // 351
  "password_again",                                                                                            // 352
  "username_and_email",                                                                                        // 353
];                                                                                                             // 354
                                                                                                               // 355
// SignIn / SignUp fields                                                                                      // 356
AT.prototype._fields = [                                                                                       // 357
  new Field({                                                                                                  // 358
    _id: "email",                                                                                              // 359
    type: "email",                                                                                             // 360
    required: true,                                                                                            // 361
    lowercase: true,                                                                                           // 362
    trim: true,                                                                                                // 363
    func: function(email) {                                                                                    // 364
        return !_.contains(email, '@');                                                                        // 365
    },                                                                                                         // 366
    errStr: 'Invalid email',                                                                                   // 367
  }),                                                                                                          // 368
  new Field({                                                                                                  // 369
    _id: "password",                                                                                           // 370
    type: "password",                                                                                          // 371
    required: true,                                                                                            // 372
    minLength: 6,                                                                                              // 373
    displayName: {                                                                                             // 374
        "default": "password",                                                                                 // 375
        changePwd: "newPassword",                                                                              // 376
        resetPwd: "newPassword",                                                                               // 377
    },                                                                                                         // 378
    placeholder: {                                                                                             // 379
        "default": "password",                                                                                 // 380
        changePwd: "newPassword",                                                                              // 381
        resetPwd: "newPassword",                                                                               // 382
    },                                                                                                         // 383
  }),                                                                                                          // 384
];                                                                                                             // 385
                                                                                                               // 386
                                                                                                               // 387
AT.prototype._initialized = false;                                                                             // 388
                                                                                                               // 389
// Input type validation                                                                                       // 390
AT.prototype._isValidInputType = function(value) {                                                             // 391
    return _.indexOf(this.INPUT_TYPES, value) !== -1;                                                          // 392
};                                                                                                             // 393
                                                                                                               // 394
AT.prototype.addField = function(field) {                                                                      // 395
    // Fields can be added only before initialization                                                          // 396
    if (this._initialized) {                                                                                   // 397
      throw new Error("AccountsTemplates.addField should strictly be called before AccountsTemplates.init!");  // 398
    }                                                                                                          // 399
                                                                                                               // 400
    field = _.pick(field, _.keys(FIELD_PAT));                                                                  // 401
    check(field, FIELD_PAT);                                                                                   // 402
    // Checks there"s currently no field called field._id                                                      // 403
    if (_.indexOf(_.pluck(this._fields, "_id"), field._id) !== -1) {                                           // 404
      throw new Error("A field called " + field._id + " already exists!");                                     // 405
    }                                                                                                          // 406
    // Validates field.type                                                                                    // 407
    if (!this._isValidInputType(field.type)) {                                                                 // 408
      throw new Error("field.type is not valid!");                                                             // 409
    }                                                                                                          // 410
    // Checks field.minLength is strictly positive                                                             // 411
    if (typeof field.minLength !== "undefined" && field.minLength <= 0) {                                      // 412
      throw new Error("field.minLength should be greater than zero!");                                         // 413
    }                                                                                                          // 414
    // Checks field.maxLength is strictly positive                                                             // 415
    if (typeof field.maxLength !== "undefined" && field.maxLength <= 0) {                                      // 416
      throw new Error("field.maxLength should be greater than zero!");                                         // 417
    }                                                                                                          // 418
    // Checks field.maxLength is greater than field.minLength                                                  // 419
    if (typeof field.minLength !== "undefined" && typeof field.minLength !== "undefined" && field.maxLength < field.minLength) {
      throw new Error("field.maxLength should be greater than field.maxLength!");                              // 421
    }                                                                                                          // 422
                                                                                                               // 423
    if (!(Meteor.isServer && _.contains(this.SPECIAL_FIELDS, field._id))) {                                    // 424
      this._fields.push(new Field(field));                                                                     // 425
    }                                                                                                          // 426
                                                                                                               // 427
    return this._fields;                                                                                       // 428
};                                                                                                             // 429
                                                                                                               // 430
AT.prototype.addFields = function(fields) {                                                                    // 431
  var ok;                                                                                                      // 432
                                                                                                               // 433
  try { // don"t bother with `typeof` - just access `length` and `catch`                                       // 434
    ok = fields.length > 0 && "0" in Object(fields);                                                           // 435
  } catch (e) {                                                                                                // 436
    throw new Error("field argument should be an array of valid field objects!");                              // 437
  }                                                                                                            // 438
  if (ok) {                                                                                                    // 439
    _.map(fields, function(field) {                                                                            // 440
      this.addField(field);                                                                                    // 441
    }, this);                                                                                                  // 442
  } else {                                                                                                     // 443
    throw new Error("field argument should be an array of valid field objects!");                              // 444
  }                                                                                                            // 445
                                                                                                               // 446
  return this._fields;                                                                                         // 447
};                                                                                                             // 448
                                                                                                               // 449
AT.prototype.configure = function(config) {                                                                    // 450
  // Configuration options can be set only before initialization                                               // 451
  if (this._initialized) {                                                                                     // 452
    throw new Error("Configuration options must be set before AccountsTemplates.init!");                       // 453
  }                                                                                                            // 454
                                                                                                               // 455
  // Updates the current configuration                                                                         // 456
  check(config, CONFIG_PAT);                                                                                   // 457
  var options = _.omit(config, "texts", "reCaptcha");                                                          // 458
  this.options = _.defaults(options, this.options);                                                            // 459
                                                                                                               // 460
  // Possibly sets up reCaptcha options                                                                        // 461
  var reCaptcha = config.reCaptcha;                                                                            // 462
  if (reCaptcha) {                                                                                             // 463
    // Updates the current button object                                                                       // 464
    this.options.reCaptcha = _.defaults(reCaptcha, this.options.reCaptcha || {});                              // 465
  }                                                                                                            // 466
                                                                                                               // 467
  // Possibly sets up texts...                                                                                 // 468
  if (config.texts) {                                                                                          // 469
    var texts = config.texts;                                                                                  // 470
    var simpleTexts = _.omit(texts, "button", "errors", "info", "inputIcons", "socialIcons", "title");         // 471
                                                                                                               // 472
    this.texts = _.defaults(simpleTexts, this.texts);                                                          // 473
                                                                                                               // 474
    if (texts.button) {                                                                                        // 475
      // Updates the current button object                                                                     // 476
      this.texts.button = _.defaults(texts.button, this.texts.button);                                         // 477
    }                                                                                                          // 478
                                                                                                               // 479
    if (texts.errors) {                                                                                        // 480
      // Updates the current errors object                                                                     // 481
      this.texts.errors = _.defaults(texts.errors, this.texts.errors);                                         // 482
    }                                                                                                          // 483
                                                                                                               // 484
    if (texts.info) {                                                                                          // 485
      // Updates the current info object                                                                       // 486
      this.texts.info = _.defaults(texts.info, this.texts.info);                                               // 487
    }                                                                                                          // 488
                                                                                                               // 489
    if (texts.inputIcons) {                                                                                    // 490
      // Updates the current inputIcons object                                                                 // 491
      this.texts.inputIcons = _.defaults(texts.inputIcons, this.texts.inputIcons);                             // 492
    }                                                                                                          // 493
                                                                                                               // 494
    if (texts.socialIcons) {                                                                                   // 495
      // Updates the current socialIcons object                                                                // 496
      this.texts.socialIcons = _.defaults(texts.socialIcons, this.texts.socialIcons);                          // 497
    }                                                                                                          // 498
                                                                                                               // 499
    if (texts.title) {                                                                                         // 500
      // Updates the current title object                                                                      // 501
      this.texts.title = _.defaults(texts.title, this.texts.title);                                            // 502
    }                                                                                                          // 503
  }                                                                                                            // 504
};                                                                                                             // 505
                                                                                                               // 506
                                                                                                               // 507
AT.prototype.configureRoute = function(route, options) {                                                       // 508
  console.warn('You now need a routing package like useraccounts:iron-routing or useraccounts:flow-routing to be able to configure routes!');
};                                                                                                             // 510
                                                                                                               // 511
                                                                                                               // 512
AT.prototype.hasField = function(fieldId) {                                                                    // 513
  return !!this.getField(fieldId);                                                                             // 514
};                                                                                                             // 515
                                                                                                               // 516
AT.prototype.getField = function(fieldId) {                                                                    // 517
  var field = _.filter(this._fields, function(field) {                                                         // 518
    return field._id === fieldId;                                                                              // 519
  });                                                                                                          // 520
                                                                                                               // 521
  return (field.length === 1) ? field[0] : undefined;                                                          // 522
};                                                                                                             // 523
                                                                                                               // 524
AT.prototype.getFields = function() {                                                                          // 525
    return this._fields;                                                                                       // 526
};                                                                                                             // 527
                                                                                                               // 528
AT.prototype.getFieldIds = function() {                                                                        // 529
    return _.pluck(this._fields, "_id");                                                                       // 530
};                                                                                                             // 531
                                                                                                               // 532
AT.prototype.getRoutePath = function(route) {                                                                  // 533
    return "#";                                                                                                // 534
};                                                                                                             // 535
                                                                                                               // 536
AT.prototype.oauthServices = function() {                                                                      // 537
  // Extracts names of available services                                                                      // 538
  var names;                                                                                                   // 539
                                                                                                               // 540
  if (Meteor.isServer) {                                                                                       // 541
    names = (Accounts.oauth && Accounts.oauth.serviceNames()) || [];                                           // 542
  } else {                                                                                                     // 543
    names = (Accounts.oauth && Accounts.loginServicesConfigured() && Accounts.oauth.serviceNames()) || [];     // 544
  }                                                                                                            // 545
  // Extracts names of configured services                                                                     // 546
  var configuredServices = [];                                                                                 // 547
                                                                                                               // 548
  if (Accounts.loginServiceConfiguration) {                                                                    // 549
    configuredServices = _.pluck(Accounts.loginServiceConfiguration.find().fetch(), "service");                // 550
  }                                                                                                            // 551
                                                                                                               // 552
  // Builds a list of objects containing service name as _id and its configuration status                      // 553
  var services = _.map(names, function(name) {                                                                 // 554
    return {                                                                                                   // 555
      _id : name,                                                                                              // 556
      configured: _.contains(configuredServices, name),                                                        // 557
    };                                                                                                         // 558
  });                                                                                                          // 559
                                                                                                               // 560
  // Checks whether there is a UI to configure services...                                                     // 561
  // XXX: this only works with the accounts-ui package                                                         // 562
  var showUnconfigured = typeof Accounts._loginButtonsSession !== "undefined";                                 // 563
                                                                                                               // 564
  // Filters out unconfigured services in case they"re not to be displayed                                     // 565
  if (!showUnconfigured) {                                                                                     // 566
    services = _.filter(services, function(service) {                                                          // 567
      return service.configured;                                                                               // 568
    });                                                                                                        // 569
  }                                                                                                            // 570
                                                                                                               // 571
  // Sorts services by name                                                                                    // 572
  services = _.sortBy(services, function(service) {                                                            // 573
    return service._id;                                                                                        // 574
  });                                                                                                          // 575
                                                                                                               // 576
  return services;                                                                                             // 577
};                                                                                                             // 578
                                                                                                               // 579
AT.prototype.removeField = function(fieldId) {                                                                 // 580
  // Fields can be removed only before initialization                                                          // 581
  if (this._initialized) {                                                                                     // 582
    throw new Error("AccountsTemplates.removeField should strictly be called before AccountsTemplates.init!");
  }                                                                                                            // 584
  // Tries to look up the field with given _id                                                                 // 585
  var index = _.indexOf(_.pluck(this._fields, "_id"), fieldId);                                                // 586
                                                                                                               // 587
  if (index !== -1) {                                                                                          // 588
    return this._fields.splice(index, 1)[0];                                                                   // 589
  } else if (!(Meteor.isServer && _.contains(this.SPECIAL_FIELDS, fieldId))) {                                 // 590
    throw new Error("A field called " + fieldId + " does not exist!");                                         // 591
  }                                                                                                            // 592
};                                                                                                             // 593
                                                                                                               // 594
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/useraccounts_core/lib/server.js                                                                    //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
/* global                                                                                                      // 1
  AT: false,                                                                                                   // 2
  AccountsTemplates: false                                                                                     // 3
*/                                                                                                             // 4
"use strict";                                                                                                  // 5
                                                                                                               // 6
// Initialization                                                                                              // 7
AT.prototype.init = function() {                                                                               // 8
  console.warn("[AccountsTemplates] There is no more need to call AccountsTemplates.init()! Simply remove the call ;-)");
};                                                                                                             // 10
                                                                                                               // 11
AT.prototype._init = function() {                                                                              // 12
  if (this._initialized) {                                                                                     // 13
    return;                                                                                                    // 14
  }                                                                                                            // 15
                                                                                                               // 16
  // Checks there is at least one account service installed                                                    // 17
  if (!Package["accounts-password"] && (!Accounts.oauth || Accounts.oauth.serviceNames().length === 0)) {      // 18
    throw Error("AccountsTemplates: You must add at least one account service!");                              // 19
  }                                                                                                            // 20
                                                                                                               // 21
  // A password field is strictly required                                                                     // 22
  var password = this.getField("password");                                                                    // 23
  if (!password) {                                                                                             // 24
    throw Error("A password field is strictly required!");                                                     // 25
  }                                                                                                            // 26
                                                                                                               // 27
  if (password.type !== "password") {                                                                          // 28
    throw Error("The type of password field should be password!");                                             // 29
  }                                                                                                            // 30
                                                                                                               // 31
  // Then we can have "username" or "email" or even both of them                                               // 32
  // but at least one of the two is strictly required                                                          // 33
  var username = this.getField("username");                                                                    // 34
  var email = this.getField("email");                                                                          // 35
                                                                                                               // 36
  if (!username && !email) {                                                                                   // 37
    throw Error("At least one field out of username and email is strictly required!");                         // 38
  }                                                                                                            // 39
                                                                                                               // 40
  if (username && !username.required) {                                                                        // 41
    throw Error("The username field should be required!");                                                     // 42
  }                                                                                                            // 43
                                                                                                               // 44
  if (email) {                                                                                                 // 45
    if (email.type !== "email") {                                                                              // 46
      throw Error("The type of email field should be email!");                                                 // 47
    }                                                                                                          // 48
                                                                                                               // 49
    if (username) {                                                                                            // 50
      // username and email                                                                                    // 51
      if (username.type !== "text") {                                                                          // 52
        throw Error("The type of username field should be text when email field is present!");                 // 53
      }                                                                                                        // 54
    } else {                                                                                                   // 55
      // email only                                                                                            // 56
      if (!email.required) {                                                                                   // 57
        throw Error("The email field should be required when username is not present!");                       // 58
      }                                                                                                        // 59
    }                                                                                                          // 60
  } else {                                                                                                     // 61
    // username only                                                                                           // 62
    if (username.type !== "text" && username.type !== "tel") {                                                 // 63
      throw Error("The type of username field should be text or tel!");                                        // 64
    }                                                                                                          // 65
  }                                                                                                            // 66
                                                                                                               // 67
  // Possibly publish more user data in order to be able to show add/remove                                    // 68
  // buttons for 3rd-party services                                                                            // 69
  if (this.options.showAddRemoveServices) {                                                                    // 70
    // Publish additional current user info to get the list of registered services                             // 71
    // XXX TODO: use                                                                                           // 72
    // Accounts.addAutopublishFields({                                                                         // 73
    //   forLoggedInUser: ['services.facebook'],                                                               // 74
    //   forOtherUsers: [],                                                                                    // 75
    // })                                                                                                      // 76
    // ...adds only user.services.*.id                                                                         // 77
    Meteor.publish("userRegisteredServices", function() {                                                      // 78
      var userId = this.userId;                                                                                // 79
      return Meteor.users.find(userId, {fields: {services: 1}});                                               // 80
      /*                                                                                                       // 81
      if (userId) {                                                                                            // 82
        var user = Meteor.users.findOne(userId);                                                               // 83
        var services_id = _.chain(user.services)                                                               // 84
          .keys()                                                                                              // 85
          .reject(function(service) {return service === "resume";})                                            // 86
          .map(function(service) {return "services." + service + ".id";})                                      // 87
          .value();                                                                                            // 88
        var projection = {};                                                                                   // 89
        _.each(services_id, function(key) {projection[key] = 1;});                                             // 90
        return Meteor.users.find(userId, {fields: projection});                                                // 91
      }                                                                                                        // 92
      */                                                                                                       // 93
    });                                                                                                        // 94
  }                                                                                                            // 95
                                                                                                               // 96
  // Security stuff                                                                                            // 97
  if (this.options.overrideLoginErrors) {                                                                      // 98
    Accounts.validateLoginAttempt(function(attempt) {                                                          // 99
      if (attempt.error) {                                                                                     // 100
        var reason = attempt.error.reason;                                                                     // 101
        if (reason === "User not found" || reason === "Incorrect password") {                                  // 102
          throw new Meteor.Error(403, AccountsTemplates.texts.errors.loginForbidden);                          // 103
        }                                                                                                      // 104
      }                                                                                                        // 105
      return attempt.allowed;                                                                                  // 106
    });                                                                                                        // 107
  }                                                                                                            // 108
                                                                                                               // 109
  if (this.options.sendVerificationEmail && this.options.enforceEmailVerification) {                           // 110
    Accounts.validateLoginAttempt(function(attempt) {                                                          // 111
      if (!attempt.allowed) {                                                                                  // 112
        return false;                                                                                          // 113
      }                                                                                                        // 114
                                                                                                               // 115
      if (attempt.type !== "password" || attempt.methodName !== "login") {                                     // 116
        return attempt.allowed;                                                                                // 117
      }                                                                                                        // 118
                                                                                                               // 119
      var user = attempt.user;                                                                                 // 120
      if (!user) {                                                                                             // 121
        return attempt.allowed;                                                                                // 122
      }                                                                                                        // 123
                                                                                                               // 124
      var ok = true;                                                                                           // 125
      var loginEmail = attempt.methodArguments[0].user.email;                                                  // 126
      if (loginEmail) {                                                                                        // 127
        var email = _.filter(user.emails, function(obj) {                                                      // 128
          return obj.address === loginEmail;                                                                   // 129
        });                                                                                                    // 130
        if (!email.length || !email[0].verified) {                                                             // 131
          ok = false;                                                                                          // 132
        }                                                                                                      // 133
      } else {                                                                                                 // 134
        // we got the username, lets check there's at lease one verified email                                 // 135
        var emailVerified = _.chain(user.emails)                                                               // 136
        .pluck('verified')                                                                                     // 137
        .any()                                                                                                 // 138
        .value();                                                                                              // 139
                                                                                                               // 140
        if (!emailVerified) {                                                                                  // 141
          ok = false;                                                                                          // 142
        }                                                                                                      // 143
      }                                                                                                        // 144
      if (!ok) {                                                                                               // 145
        throw new Meteor.Error(401, AccountsTemplates.texts.errors.verifyEmailFirst);                          // 146
      }                                                                                                        // 147
                                                                                                               // 148
      return attempt.allowed;                                                                                  // 149
    });                                                                                                        // 150
  }                                                                                                            // 151
                                                                                                               // 152
  //Check that reCaptcha secret keys are available                                                             // 153
  if (this.options.showReCaptcha) {                                                                            // 154
    var atSecretKey = AccountsTemplates.options.reCaptcha && AccountsTemplates.options.reCaptcha.secretKey;    // 155
    var settingsSecretKey = Meteor.settings.reCaptcha && Meteor.settings.reCaptcha.secretKey;                  // 156
                                                                                                               // 157
    if (!atSecretKey && !settingsSecretKey) {                                                                  // 158
      throw new Meteor.Error(401, "User Accounts: reCaptcha secret key not found! Please provide it or set showReCaptcha to false." );
    }                                                                                                          // 160
  }                                                                                                            // 161
                                                                                                               // 162
  // Marks AccountsTemplates as initialized                                                                    // 163
  this._initialized = true;                                                                                    // 164
};                                                                                                             // 165
                                                                                                               // 166
AccountsTemplates = new AT();                                                                                  // 167
                                                                                                               // 168
// Client side account creation is disabled by default:                                                        // 169
// the methos ATCreateUserServer is used instead!                                                              // 170
// to actually disable client side account creation use:                                                       // 171
//                                                                                                             // 172
//    AccountsTemplates.config({                                                                               // 173
//        forbidClientAccountCreation: true                                                                    // 174
//    });                                                                                                      // 175
                                                                                                               // 176
Accounts.config({                                                                                              // 177
  forbidClientAccountCreation: true                                                                            // 178
});                                                                                                            // 179
                                                                                                               // 180
// Initialization                                                                                              // 181
Meteor.startup(function() {                                                                                    // 182
  AccountsTemplates._init();                                                                                   // 183
});                                                                                                            // 184
                                                                                                               // 185
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/useraccounts_core/lib/methods.js                                                                   //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
/* global                                                                                                      // 1
  AccountsTemplates: false                                                                                     // 2
*/                                                                                                             // 3
"use strict";                                                                                                  // 4
                                                                                                               // 5
Meteor.methods({                                                                                               // 6
  ATRemoveService: function(serviceName) {                                                                     // 7
    check(serviceName, String);                                                                                // 8
                                                                                                               // 9
    var userId = this.userId;                                                                                  // 10
                                                                                                               // 11
    if (userId) {                                                                                              // 12
      var user = Meteor.users.findOne(userId);                                                                 // 13
      var numServices = _.keys(user.services).length; // including "resume"                                    // 14
      var unset = {};                                                                                          // 15
                                                                                                               // 16
      if (numServices === 2) {                                                                                 // 17
        throw new Meteor.Error(403, AccountsTemplates.texts.errors.cannotRemoveService, {});                   // 18
      }                                                                                                        // 19
                                                                                                               // 20
      unset["services." + serviceName] = "";                                                                   // 21
      Meteor.users.update(userId, {$unset: unset});                                                            // 22
    }                                                                                                          // 23
  },                                                                                                           // 24
});                                                                                                            // 25
                                                                                                               // 26
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/useraccounts_core/lib/server_methods.js                                                            //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
/* global                                                                                                      // 1
  AccountsTemplates                                                                                            // 2
*/                                                                                                             // 3
"use strict";                                                                                                  // 4
                                                                                                               // 5
Meteor.methods({                                                                                               // 6
  ATCreateUserServer: function(options) {                                                                      // 7
    if (AccountsTemplates.options.forbidClientAccountCreation) {                                               // 8
      throw new Meteor.Error(403, AccountsTemplates.texts.errors.accountsCreationDisabled);                    // 9
    }                                                                                                          // 10
                                                                                                               // 11
    // createUser() does more checking.                                                                        // 12
    check(options, Object);                                                                                    // 13
    var allFieldIds = AccountsTemplates.getFieldIds();                                                         // 14
                                                                                                               // 15
    // Picks-up whitelisted fields for profile                                                                 // 16
    var profile = options.profile;                                                                             // 17
    profile = _.pick(profile, allFieldIds);                                                                    // 18
    profile = _.omit(profile, "username", "email", "password");                                                // 19
                                                                                                               // 20
    // Validates fields" value                                                                                 // 21
    var signupInfo = _.clone(profile);                                                                         // 22
    if (options.username) {                                                                                    // 23
      signupInfo.username = options.username;                                                                  // 24
                                                                                                               // 25
      if (AccountsTemplates.options.lowercaseUsername) {                                                       // 26
        signupInfo.username = signupInfo.username.trim().replace(/\s+/gm, ' ');                                // 27
        options.profile.name = signupInfo.username;                                                            // 28
        signupInfo.username = signupInfo.username.toLowerCase().replace(/\s+/gm, '');                          // 29
        options.username = signupInfo.username;                                                                // 30
      }                                                                                                        // 31
    }                                                                                                          // 32
                                                                                                               // 33
    if (options.email) {                                                                                       // 34
      signupInfo.email = options.email;                                                                        // 35
                                                                                                               // 36
      if (AccountsTemplates.options.lowercaseUsername) {                                                       // 37
        signupInfo.email = signupInfo.email.toLowerCase().replace(/\s+/gm, '');                                // 38
        options.email = signupInfo.email;                                                                      // 39
      }                                                                                                        // 40
    }                                                                                                          // 41
                                                                                                               // 42
    if (options.password) {                                                                                    // 43
      signupInfo.password = options.password;                                                                  // 44
    }                                                                                                          // 45
                                                                                                               // 46
    var validationErrors = {};                                                                                 // 47
    var someError = false;                                                                                     // 48
                                                                                                               // 49
    // Validates fields values                                                                                 // 50
    _.each(AccountsTemplates.getFields(), function(field) {                                                    // 51
      var fieldId = field._id;                                                                                 // 52
      var value = signupInfo[fieldId];                                                                         // 53
                                                                                                               // 54
      if (fieldId === "password") {                                                                            // 55
        // Can"t Pick-up password here                                                                         // 56
        // NOTE: at this stage the password is already encripted,                                              // 57
        //       so there is no way to validate it!!!                                                          // 58
        check(value, Object);                                                                                  // 59
        return;                                                                                                // 60
      }                                                                                                        // 61
                                                                                                               // 62
      var validationErr = field.validate(value, "strict");                                                     // 63
      if (validationErr) {                                                                                     // 64
        validationErrors[fieldId] = validationErr;                                                             // 65
        someError = true;                                                                                      // 66
      }                                                                                                        // 67
    });                                                                                                        // 68
                                                                                                               // 69
    if (AccountsTemplates.options.showReCaptcha) {                                                             // 70
      var secretKey = null;                                                                                    // 71
                                                                                                               // 72
      if (AccountsTemplates.options.reCaptcha && AccountsTemplates.options.reCaptcha.secretKey) {              // 73
        secretKey = AccountsTemplates.options.reCaptcha.secretKey;                                             // 74
      } else {                                                                                                 // 75
        secretKey = Meteor.settings.reCaptcha.secretKey;                                                       // 76
      }                                                                                                        // 77
                                                                                                               // 78
      var apiResponse = HTTP.post("https://www.google.com/recaptcha/api/siteverify", {                         // 79
        params: {                                                                                              // 80
          secret: secretKey,                                                                                   // 81
          response: options.profile.reCaptchaResponse,                                                         // 82
          remoteip: this.connection.clientAddress,                                                             // 83
        }                                                                                                      // 84
      }).data;                                                                                                 // 85
                                                                                                               // 86
      if (!apiResponse.success) {                                                                              // 87
        throw new Meteor.Error(403, AccountsTemplates.texts.errors.captchaVerification,                        // 88
          apiResponse['error-codes'] ? apiResponse['error-codes'].join(", ") : "Unknown Error.");              // 89
      }                                                                                                        // 90
    }                                                                                                          // 91
                                                                                                               // 92
    if (someError) {                                                                                           // 93
      throw new Meteor.Error(403, AccountsTemplates.texts.errors.validationErrors, validationErrors);          // 94
    }                                                                                                          // 95
                                                                                                               // 96
    // Possibly removes the profile field                                                                      // 97
    if (_.isEmpty(options.profile)) {                                                                          // 98
      delete options.profile;                                                                                  // 99
    }                                                                                                          // 100
                                                                                                               // 101
    // Create user. result contains id and token.                                                              // 102
    var userId = Accounts.createUser(options);                                                                 // 103
    // safety belt. createUser is supposed to throw on error. send 500 error                                   // 104
    // instead of sending a verification email with empty userid.                                              // 105
    if (! userId) {                                                                                            // 106
      throw new Error("createUser failed to insert new user");                                                 // 107
    }                                                                                                          // 108
                                                                                                               // 109
    // Call postSignUpHook, if any...                                                                          // 110
    var postSignUpHook = AccountsTemplates.options.postSignUpHook;                                             // 111
    if (postSignUpHook) {                                                                                      // 112
      postSignUpHook(userId, options);                                                                         // 113
    }                                                                                                          // 114
                                                                                                               // 115
    // Send a email address verification email in case the context permits it                                  // 116
    // and the specific configuration flag was set to true                                                     // 117
    if (options.email && AccountsTemplates.options.sendVerificationEmail) {                                    // 118
      Accounts.sendVerificationEmail(userId, options.email);                                                   // 119
    }                                                                                                          // 120
  },                                                                                                           // 121
                                                                                                               // 122
  // Resend a user's verification e-mail                                                                       // 123
  ATResendVerificationEmail: function (email) {                                                                // 124
    check(email, String);                                                                                      // 125
                                                                                                               // 126
    var user = Meteor.users.findOne({ "emails.address": email });                                              // 127
                                                                                                               // 128
    // Send the standard error back to the client if no user exist with this e-mail                            // 129
    if (!user) {                                                                                               // 130
      throw new Meteor.Error(403, "User not found");                                                           // 131
    }                                                                                                          // 132
                                                                                                               // 133
    try {                                                                                                      // 134
      Accounts.sendVerificationEmail(user._id);                                                                // 135
    } catch (error) {                                                                                          // 136
      // Handle error when email already verified                                                              // 137
      // https://github.com/dwinston/send-verification-email-bug                                               // 138
      throw new Meteor.Error(403, "Already verified");                                                         // 139
    }                                                                                                          // 140
  },                                                                                                           // 141
});                                                                                                            // 142
                                                                                                               // 143
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['useraccounts:core'] = {
  AccountsTemplates: AccountsTemplates
};

})();

//# sourceMappingURL=useraccounts_core.js.map
