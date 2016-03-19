(function(){
Template.__checkName("dashboard");
Template["dashboard"] = new Template("Template.dashboard", (function() {
  var view = this;
  return HTML.DIV({
    "class": "template-dashboard"
  }, HTML.Raw('\n    <div class="page-header">\n      <h1>Dashboard</h1>\n    </div>\n\n    '), HTML.UL({
    "class": "list-group"
  }, "\n      ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("items"));
  }, function() {
    return [ "\n        ", HTML.LI({
      "class": "list-group-item"
    }, Blaze.View("lookup:name", function() {
      return Spacebars.mustache(view.lookup("name"));
    }), " ", HTML.SPAN({
      "class": "label label-default"
    }, Blaze.View("lookup:rating", function() {
      return Spacebars.mustache(view.lookup("rating"));
    }))), "\n      " ];
  }), "\n    "), "\n\n  ");
}));

})();
