(function(){
Template.__checkName("home");
Template["home"] = new Template("Template.home", (function() {
  var view = this;
  return HTML.Raw('<div class="template-home">\n    <div class="page-header">\n      <h1 class="text-center">Welcome to TechMeetups</h1>\n    </div>\n    <p class="text-center">\n    	To browse or add a meetup to our directory, please choose an option below.\n    </p>\n    <div class="text-center">\n    	<a href="/meetups/add" class="btn btn-primary">Add Meetup</a>\n		<a href="/meetups" class="btn btn-default">Find a Meetup</a>\n    </div>\n  </div>');
}));

}).call(this);
