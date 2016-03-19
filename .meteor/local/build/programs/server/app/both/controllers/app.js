(function(){AppController = RouteController.extend({
  layoutTemplate: 'appLayout'
});

AppController.events({
  'click [data-action=logout]' : function() {
    AccountsTemplates.logout();
  }
});

}).call(this);

//# sourceMappingURL=app.js.map
