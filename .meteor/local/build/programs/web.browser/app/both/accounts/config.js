(function(){AccountsTemplates.configureRoute('signIn', {layoutTemplate: 'appLayout'});
AccountsTemplates.configureRoute('signUp', {layoutTemplate: 'appLayout'});
var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
      _id: "username",
      type: "text",
      displayName: "username",
      required: true,
      minLength: 5,
  },
  {
      _id: 'email',
      type: 'email',
      required: true,
      displayName: "email",
      re: /.+@(.+){2,}\.(.+){2,}/,
      errStr: 'Invalid email',
  },
  pwd
]);
AccountsTemplates.configureRoute('ensureSignedIn', {layoutTemplate: 'appLayout'});

}).call(this);
