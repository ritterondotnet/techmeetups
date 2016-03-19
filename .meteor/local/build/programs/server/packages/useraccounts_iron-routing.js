(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var check = Package.check.check;
var Match = Package.check.Match;
var Router = Package['iron:router'].Router;
var RouteController = Package['iron:router'].RouteController;
var _ = Package.underscore._;
var AccountsTemplates = Package['useraccounts:core'].AccountsTemplates;
var Iron = Package['iron:core'].Iron;
var Accounts = Package['accounts-base'].Accounts;
var AccountsServer = Package['accounts-base'].AccountsServer;
var T9n = Package['softwarerero:accounts-t9n'].T9n;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/useraccounts_iron-routing/lib/core.js                                                              //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
/* global                                                                                                      // 1
  AccountsTemplates: false                                                                                     // 2
*/                                                                                                             // 3
'use strict';                                                                                                  // 4
                                                                                                               // 5
// ---------------------------------------------------------------------------------                           // 6
                                                                                                               // 7
// Patterns for methods" parameters                                                                            // 8
                                                                                                               // 9
// ---------------------------------------------------------------------------------                           // 10
                                                                                                               // 11
// Route configuration pattern to be checked with check                                                        // 12
var ROUTE_PAT = {                                                                                              // 13
  name: Match.Optional(String),                                                                                // 14
  path: Match.Optional(String),                                                                                // 15
  template: Match.Optional(String),                                                                            // 16
  layoutTemplate: Match.Optional(String),                                                                      // 17
  redirect: Match.Optional(Match.OneOf(String, Match.Where(_.isFunction))),                                    // 18
};                                                                                                             // 19
                                                                                                               // 20
/*                                                                                                             // 21
  Routes configuration can be done by calling AccountsTemplates.configureRoute with the route name and the     // 22
  following options in a separate object. E.g. AccountsTemplates.configureRoute("gingIn", option);             // 23
    name:           String (optional). A unique route"s name to be passed to iron-router                       // 24
    path:           String (optional). A unique route"s path to be passed to iron-router                       // 25
    template:       String (optional). The name of the template to be rendered                                 // 26
    layoutTemplate: String (optional). The name of the layout to be used                                       // 27
    redirect:       String (optional). The name of the route (or its path) where to redirect after form submit
*/                                                                                                             // 29
                                                                                                               // 30
                                                                                                               // 31
// Allowed routes along with theirs default configuration values                                               // 32
AccountsTemplates.ROUTE_DEFAULT = {                                                                            // 33
  changePwd:      { name: "atChangePwd",      path: "/change-password"},                                       // 34
  enrollAccount:  { name: "atEnrollAccount",  path: "/enroll-account"},                                        // 35
  ensureSignedIn: { name: "atEnsureSignedIn", path: null},                                                     // 36
  forgotPwd:      { name: "atForgotPwd",      path: "/forgot-password"},                                       // 37
  resetPwd:       { name: "atResetPwd",       path: "/reset-password"},                                        // 38
  signIn:         { name: "atSignIn",         path: "/sign-in"},                                               // 39
  signUp:         { name: "atSignUp",         path: "/sign-up"},                                               // 40
  verifyEmail:    { name: "atVerifyEmail",    path: "/verify-email"},                                          // 41
  resendVerificationEmail: { name: "atResendVerificationEmail", path: "/send-again"},                          // 42
};                                                                                                             // 43
                                                                                                               // 44
                                                                                                               // 45
// Current configuration values                                                                                // 46
// Redirects                                                                                                   // 47
AccountsTemplates.options.homeRoutePath = "/";                                                                 // 48
AccountsTemplates.options.redirectTimeout = 2000; // 2 seconds                                                 // 49
                                                                                                               // 50
// Known routes used to filter out previous path for redirects...                                              // 51
AccountsTemplates.knownRoutes = [];                                                                            // 52
                                                                                                               // 53
// Configured routes                                                                                           // 54
AccountsTemplates.routes = {};                                                                                 // 55
                                                                                                               // 56
AccountsTemplates.configureRoute = function(route, options) {                                                  // 57
  check(route, String);                                                                                        // 58
  check(options, Match.OneOf(undefined, Match.ObjectIncluding(ROUTE_PAT)));                                    // 59
  options = _.clone(options);                                                                                  // 60
  // Route Configuration can be done only before initialization                                                // 61
  if (this._initialized) {                                                                                     // 62
    throw new Error("Route Configuration can be done only before AccountsTemplates.init!");                    // 63
  }                                                                                                            // 64
  // Only allowed routes can be configured                                                                     // 65
  if (!(route in this.ROUTE_DEFAULT)) {                                                                        // 66
    throw new Error("Unknown Route!");                                                                         // 67
  }                                                                                                            // 68
  // Allow route configuration only once                                                                       // 69
  if (route in this.routes) {                                                                                  // 70
    throw new Error("Route already configured!");                                                              // 71
  }                                                                                                            // 72
                                                                                                               // 73
  // Possibly adds a initial / to the provided path                                                            // 74
  if (options && options.path && options.path[0] !== "/") {                                                    // 75
    options.path = "/" + options.path;                                                                         // 76
  }                                                                                                            // 77
  // Updates the current configuration                                                                         // 78
  options = _.defaults(options || {}, this.ROUTE_DEFAULT[route]);                                              // 79
                                                                                                               // 80
  this.routes[route] = options;                                                                                // 81
  // Known routes are used to filter out previous path for redirects...                                        // 82
  AccountsTemplates.knownRoutes.push(options.path);                                                            // 83
                                                                                                               // 84
  if (Meteor.isServer){                                                                                        // 85
    // Configures "reset password" email link                                                                  // 86
    if (route === "resetPwd"){                                                                                 // 87
      var resetPwdPath = options.path.substr(1);                                                               // 88
      Accounts.urls.resetPassword = function(token){                                                           // 89
        return Meteor.absoluteUrl(resetPwdPath + "/" + token);                                                 // 90
      };                                                                                                       // 91
    }                                                                                                          // 92
    // Configures "enroll account" email link                                                                  // 93
    if (route === "enrollAccount"){                                                                            // 94
      var enrollAccountPath = options.path.substr(1);                                                          // 95
      Accounts.urls.enrollAccount = function(token){                                                           // 96
        return Meteor.absoluteUrl(enrollAccountPath + "/" + token);                                            // 97
      };                                                                                                       // 98
    }                                                                                                          // 99
    // Configures "verify email" email link                                                                    // 100
    if (route === "verifyEmail"){                                                                              // 101
      var verifyEmailPath = options.path.substr(1);                                                            // 102
      Accounts.urls.verifyEmail = function(token){                                                             // 103
        return Meteor.absoluteUrl(verifyEmailPath + "/" + token);                                              // 104
      };                                                                                                       // 105
    }                                                                                                          // 106
  }                                                                                                            // 107
                                                                                                               // 108
  if (route === "ensureSignedIn") {                                                                            // 109
    return;                                                                                                    // 110
  }                                                                                                            // 111
  if (route === "changePwd" && !AccountsTemplates.options.enablePasswordChange) {                              // 112
    throw new Error("changePwd route configured but enablePasswordChange set to false!");                      // 113
  }                                                                                                            // 114
  if (route === "forgotPwd" && !AccountsTemplates.options.showForgotPasswordLink) {                            // 115
    throw new Error("forgotPwd route configured but showForgotPasswordLink set to false!");                    // 116
  }                                                                                                            // 117
  if (route === "signUp" && AccountsTemplates.options.forbidClientAccountCreation) {                           // 118
    throw new Error("signUp route configured but forbidClientAccountCreation set to true!");                   // 119
  }                                                                                                            // 120
                                                                                                               // 121
  // Determines the default layout to be used in case no specific one is specified for single routes           // 122
  var defaultLayout = AccountsTemplates.options.defaultLayout || Router.options.layoutTemplate;                // 123
                                                                                                               // 124
  var name = options.name; // Default provided...                                                              // 125
  var path = options.path; // Default provided...                                                              // 126
  var template = options.template || "fullPageAtForm";                                                         // 127
  var layoutTemplate = options.layoutTemplate || defaultLayout;                                                // 128
  var additionalOptions = _.omit(options, [                                                                    // 129
    "layoutTemplate", "name", "path", "redirect", "template"                                                   // 130
  ]);                                                                                                          // 131
                                                                                                               // 132
  // Possibly adds token parameter                                                                             // 133
  if (_.contains(["enrollAccount", "resetPwd", "verifyEmail"], route)){                                        // 134
    path += "/:paramToken";                                                                                    // 135
    if (route === "verifyEmail") {                                                                             // 136
      Router.route(path, _.extend(additionalOptions, {                                                         // 137
        name: name,                                                                                            // 138
        template: template,                                                                                    // 139
        layoutTemplate: layoutTemplate,                                                                        // 140
        onRun: function() {                                                                                    // 141
          AccountsTemplates.setState(route);                                                                   // 142
          AccountsTemplates.setDisabled(true);                                                                 // 143
          var token = this.params.paramToken;                                                                  // 144
          Accounts.verifyEmail(token, function(error){                                                         // 145
            AccountsTemplates.setDisabled(false);                                                              // 146
            AccountsTemplates.submitCallback(error, route, function(){                                         // 147
              AccountsTemplates.state.form.set("result", AccountsTemplates.texts.info.emailVerified);          // 148
            });                                                                                                // 149
          });                                                                                                  // 150
                                                                                                               // 151
          this.next();                                                                                         // 152
        },                                                                                                     // 153
        onStop: function() {                                                                                   // 154
          AccountsTemplates.clearState();                                                                      // 155
        },                                                                                                     // 156
      }));                                                                                                     // 157
    }                                                                                                          // 158
    else {                                                                                                     // 159
      Router.route(path, _.extend(additionalOptions, {                                                         // 160
        name: name,                                                                                            // 161
        template: template,                                                                                    // 162
        layoutTemplate: layoutTemplate,                                                                        // 163
        onBeforeAction: function() {                                                                           // 164
          AccountsTemplates.paramToken = this.params.paramToken;                                               // 165
          AccountsTemplates.setState(route);                                                                   // 166
          this.next();                                                                                         // 167
        },                                                                                                     // 168
        onStop: function() {                                                                                   // 169
          AccountsTemplates.clearState();                                                                      // 170
          AccountsTemplates.paramToken = null;                                                                 // 171
        }                                                                                                      // 172
      }));                                                                                                     // 173
    }                                                                                                          // 174
  }                                                                                                            // 175
  else {                                                                                                       // 176
    Router.route(path, _.extend(additionalOptions, {                                                           // 177
      name: name,                                                                                              // 178
      template: template,                                                                                      // 179
      layoutTemplate: layoutTemplate,                                                                          // 180
      onBeforeAction: function() {                                                                             // 181
        var redirect = false;                                                                                  // 182
        if (route === 'changePwd') {                                                                           // 183
          if (!Meteor.loggingIn() && !Meteor.userId()) {                                                       // 184
            redirect = true;                                                                                   // 185
          }                                                                                                    // 186
        }                                                                                                      // 187
        else if (Meteor.userId()) {                                                                            // 188
          redirect = true;                                                                                     // 189
        }                                                                                                      // 190
        if (redirect) {                                                                                        // 191
          AccountsTemplates.postSubmitRedirect(route);                                                         // 192
          this.stop();                                                                                         // 193
        }                                                                                                      // 194
        else {                                                                                                 // 195
          AccountsTemplates.setState(route);                                                                   // 196
          this.next();                                                                                         // 197
        }                                                                                                      // 198
      },                                                                                                       // 199
      onStop: function() {                                                                                     // 200
        AccountsTemplates.clearState();                                                                        // 201
      }                                                                                                        // 202
    }));                                                                                                       // 203
  }                                                                                                            // 204
};                                                                                                             // 205
                                                                                                               // 206
                                                                                                               // 207
AccountsTemplates.getRouteName = function(route) {                                                             // 208
  if (route in this.routes) {                                                                                  // 209
    return this.routes[route].name;                                                                            // 210
  }                                                                                                            // 211
  return null;                                                                                                 // 212
};                                                                                                             // 213
                                                                                                               // 214
AccountsTemplates.getRoutePath = function(route) {                                                             // 215
  if (route in this.routes) {                                                                                  // 216
    return this.routes[route].path;                                                                            // 217
  }                                                                                                            // 218
  return "#";                                                                                                  // 219
};                                                                                                             // 220
                                                                                                               // 221
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/useraccounts_iron-routing/lib/server.js                                                            //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
/* global                                                                                                      // 1
  Iron: false                                                                                                  // 2
*/                                                                                                             // 3
'use strict';                                                                                                  // 4
                                                                                                               // 5
                                                                                                               // 6
// Fake server-side IR plugin to allow for shared routing files                                                // 7
Iron.Router.plugins.ensureSignedIn = function (router, options) {};                                            // 8
                                                                                                               // 9
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['useraccounts:iron-routing'] = {};

})();

//# sourceMappingURL=useraccounts_iron-routing.js.map
