//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Template = Package.templating.Template;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Meta;

(function () {

///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
// packages/yasinuslu:blaze-meta/lib/template.meta.js                                //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
                                                                                     //
                                                                                     // 1
Template.__checkName("MetaTags");                                                    // 2
Template["MetaTags"] = new Template("Template.MetaTags", (function() {               // 3
  var view = this;                                                                   // 4
  return Blaze.Each(function() {                                                     // 5
    return Spacebars.call(view.lookup("tags"));                                      // 6
  }, function() {                                                                    // 7
    return [ "\n    ", Spacebars.include(view.lookupTemplate("_MetaTag")), "\n  " ]; // 8
  });                                                                                // 9
}));                                                                                 // 10
                                                                                     // 11
///////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
// packages/yasinuslu:blaze-meta/lib/meta.js                                         //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
                                                                                     //
Meta = {                                                                             // 1
  options: {                                                                         // 2
    title: "Default Title",                                                          // 3
    suffix: "Suffix for title"                                                       // 4
  },                                                                                 // 5
                                                                                     // 6
  dict: new ReactiveDict(),                                                          // 7
                                                                                     // 8
  converters: {                                                                      // 9
    title: function(title) {                                                         // 10
      if (_.isFunction(title)) {                                                     // 11
        title = title();                                                             // 12
      }                                                                              // 13
                                                                                     // 14
      if (_.isEmpty(title)) {                                                        // 15
        return Meta.options.title || "";                                             // 16
      }                                                                              // 17
                                                                                     // 18
      if (!_.isEmpty(Meta.options.suffix)) {                                         // 19
        title = title + " | " + Meta.options.suffix;                                 // 20
      }                                                                              // 21
                                                                                     // 22
      return title;                                                                  // 23
    },                                                                               // 24
                                                                                     // 25
    meta: function(property, content) {                                              // 26
      var options = _.isObject(property) ? property : {                              // 27
        name: 'property',                                                            // 28
        property: property,                                                          // 29
        content: content                                                             // 30
      };                                                                             // 31
                                                                                     // 32
      return options;                                                                // 33
    }                                                                                // 34
  },                                                                                 // 35
                                                                                     // 36
  init: function() {                                                                 // 37
    Meta.setTitle("");                                                               // 38
  },                                                                                 // 39
                                                                                     // 40
  config: function(opts) {                                                           // 41
    _.extend(Meta.options, opts.options);                                            // 42
    _.extend(Meta.converters, opts.converters);                                      // 43
  },                                                                                 // 44
                                                                                     // 45
  setVar: function(key, value) {                                                     // 46
    Meta.dict.set(key, value);                                                       // 47
  },                                                                                 // 48
                                                                                     // 49
  getVar: function(key) {                                                            // 50
    return Meta.dict.get(key);                                                       // 51
  },                                                                                 // 52
                                                                                     // 53
  set: function(property, content) {                                                 // 54
    var properties = property;                                                       // 55
    if (!_.isArray(property)) {                                                      // 56
      properties = new Array(property);                                              // 57
    }                                                                                // 58
                                                                                     // 59
    properties.forEach(function(property, key) {                                     // 60
      var meta;                                                                      // 61
      Tracker.nonreactive(function() {                                               // 62
        meta = Meta.getVar("tag") || {};                                             // 63
      });                                                                            // 64
      var m = Meta.converters.meta(property, content);                               // 65
      meta[m.property] = m;                                                          // 66
      Meta.setVar("tag", meta);                                                      // 67
    });                                                                              // 68
                                                                                     // 69
  },                                                                                 // 70
                                                                                     // 71
  unset: function(property) {                                                        // 72
    var meta;                                                                        // 73
    Tracker.nonreactive(function() {                                                 // 74
      meta = Meta.getVar("tag") || {};                                               // 75
    });                                                                              // 76
    var m = Meta.converters.meta(property);                                          // 77
    delete meta[m.property];                                                         // 78
    Meta.setVar("tag", meta);                                                        // 79
  },                                                                                 // 80
                                                                                     // 81
  setTitle: function(title) {                                                        // 82
    Meta.setVar("title", Meta.converters.title(title));                              // 83
  },                                                                                 // 84
                                                                                     // 85
  getTitle: function() {                                                             // 86
    return Meta.getVar("title");                                                     // 87
  },                                                                                 // 88
                                                                                     // 89
  arr: function() {                                                                  // 90
    var meta = Meta.getVar("tag");                                                   // 91
    return _.toArray(meta);                                                          // 92
  },                                                                                 // 93
                                                                                     // 94
  hash: function() {                                                                 // 95
    return Meta.getVar("tag");                                                       // 96
  }                                                                                  // 97
};                                                                                   // 98
                                                                                     // 99
Template.MetaTags.helpers({                                                          // 100
                                                                                     // 101
  tags: function() {                                                                 // 102
    return Meta.arr();                                                               // 103
  },                                                                                 // 104
                                                                                     // 105
  _MetaTag: function() {                                                             // 106
    var attrs = {};                                                                  // 107
    attrs[this.name] = this.property;                                                // 108
    attrs.content = this.content;                                                    // 109
    return Blaze.Template(function() {                                               // 110
      return HTML.META(attrs);                                                       // 111
    });                                                                              // 112
  }                                                                                  // 113
});                                                                                  // 114
                                                                                     // 115
Meteor.startup(function() {                                                          // 116
  Meta.init();                                                                       // 117
                                                                                     // 118
  Blaze.render(Template.MetaTags, document.head);                                    // 119
                                                                                     // 120
  Tracker.autorun(function() {                                                       // 121
    document.title = Meta.getTitle();                                                // 122
  });                                                                                // 123
});                                                                                  // 124
///////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['yasinuslu:blaze-meta'] = {
  Meta: Meta
};

})();
