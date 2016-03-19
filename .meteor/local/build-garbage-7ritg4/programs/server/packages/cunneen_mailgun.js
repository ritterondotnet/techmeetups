(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Email = Package.email.Email;

/* Package-scope variables */
var username, password, host, port;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/cunneen:mailgun/mailgun.js                                                                          //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/* Usage:                                                                                                       // 1
                                                                                                                // 2
  Meteor.startup(function(){                                                                                    // 3
    Meteor.Mailgun.config({                                                                                     // 4
      username = 'MAILGUN_USERNAME',                                                                            // 5
      password = 'MAILGUN_PASSWORD'                                                                             // 6
    });                                                                                                         // 7
  });                                                                                                           // 8
                                                                                                                // 9
 * In server directory:                                                                                         // 10
                                                                                                                // 11
    Meteor.Mailgun.send({                                                                                       // 12
      to: 'something@something.com',                                                                            // 13
      from: 'you@yourdomain.com',                                                                               // 14
      subject: 'A subject',                                                                                     // 15
      text: 'This is the text',                                                                                 // 16
      html: 'With meteor it''s easy to set up <strong>HTML</strong> <span style="color:red">emails</span> too.' // 17
    });                                                                                                         // 18
 *                                                                                                              // 19
 */                                                                                                             // 20
                                                                                                                // 21
Meteor.Mailgun = {                                                                                              // 22
  config: function(options){                                                                                    // 23
    username = options['username'];                                                                             // 24
    password = options['password'];                                                                             // 25
    host = '@smtp.mailgun.org';                                                                                 // 26
    port = '465';                                                                                               // 27
    process.env.MAIL_URL = 'smtp://' + username + ':' + password + host + ':' + port + '/';                     // 28
  },                                                                                                            // 29
  // a wrapper for Email just to be consistent.                                                                 // 30
  send: function(options){                                                                                      // 31
    Email.send(options);                                                                                        // 32
  }                                                                                                             // 33
}                                                                                                               // 34
                                                                                                                // 35
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['cunneen:mailgun'] = {};

})();

//# sourceMappingURL=cunneen_mailgun.js.map
