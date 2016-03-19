(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Email = Package.email.Email;
var EmailInternals = Package.email.EmailInternals;

/* Package-scope variables */
var username, password, host, port;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cunneen_mailgun/packages/cunneen_mailgun.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
(function () {                                                                                                        // 1
                                                                                                                      // 2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 3
//                                                                                                              //    // 4
// packages/cunneen:mailgun/mailgun.js                                                                          //    // 5
//                                                                                                              //    // 6
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 7
                                                                                                                //    // 8
/* Usage:                                                                                                       // 1  // 9
                                                                                                                // 2  // 10
  Meteor.startup(function(){                                                                                    // 3  // 11
    Meteor.Mailgun.config({                                                                                     // 4  // 12
      username = 'MAILGUN_USERNAME',                                                                            // 5  // 13
      password = 'MAILGUN_PASSWORD'                                                                             // 6  // 14
    });                                                                                                         // 7  // 15
  });                                                                                                           // 8  // 16
                                                                                                                // 9  // 17
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 44
                                                                                                                      // 45
}).call(this);                                                                                                        // 46
                                                                                                                      // 47
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['cunneen:mailgun'] = {};

})();

//# sourceMappingURL=cunneen_mailgun.js.map
