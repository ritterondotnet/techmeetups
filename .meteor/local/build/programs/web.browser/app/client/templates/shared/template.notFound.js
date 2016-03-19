(function(){
Template.__checkName("notFound");
Template["notFound"] = new Template("Template.notFound", (function() {
  var view = this;
  return HTML.Raw('<div class="template-not-found">\n    <div class="container text-center">\n      <h1>Not Found</h1>\n      <p>\n        That page doesn\'t exist!\n      </p>\n    </div>\n  </div>');
}));

}).call(this);
