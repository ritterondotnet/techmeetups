(function(){Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<!DOCTYPE html>\r\n<html>\r\n  <head>\r\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title></title>\r\n  </head>\r\n  <body>\r\n    Oops, this page can't be found.\r\n  </body>\r\n</html>\r\n");Handlebars.templates["404"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "404"});};
}).call(this);

//# sourceMappingURL=handlebars.404.js.map
