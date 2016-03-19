(function(){
Template.__checkName("meetups");
Template["meetups"] = new Template("Template.meetups", (function() {
  var view = this;
  return HTML.DIV({
    "class": "template-meetups"
  }, HTML.Raw('\n    <div class="page-header">\n      <h1>Meetups</h1>\n    </div>\n\n    '), HTML.UL({
    "class": "list-group"
  }, "\n      ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("meetups"));
  }, function() {
    return [ "\n        ", HTML.LI({
      "class": "list-group-item"
    }, Blaze.View("lookup:title", function() {
      return Spacebars.mustache(view.lookup("title"));
    }), " ", HTML.SPAN({
      "class": "label label-default"
    }, Blaze.View("lookup:city", function() {
      return Spacebars.mustache(view.lookup("city"));
    }), ", ", Blaze.View("lookup:state", function() {
      return Spacebars.mustache(view.lookup("state"));
    }))), "\n      " ];
  }, function() {
    return [ "\n        ", HTML.P("\n          There are currently no Meetups.\n        "), "\n      " ];
  }), "\n    "), "\n\n  ");
}));

}).call(this);
