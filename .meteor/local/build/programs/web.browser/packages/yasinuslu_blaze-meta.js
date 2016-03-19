//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
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
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Meta;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/yasinuslu_blaze-meta/packages/yasinuslu_blaze-meta.js                           //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
(function () {                                                                              // 1
                                                                                            // 2
///////////////////////////////////////////////////////////////////////////////////////     // 3
//                                                                                   //     // 4
// packages/yasinuslu:blaze-meta/lib/template.meta.js                                //     // 5
//                                                                                   //     // 6
///////////////////////////////////////////////////////////////////////////////////////     // 7
                                                                                     //     // 8
                                                                                     // 1   // 9
Template.__checkName("MetaTags");                                                    // 2   // 10
Template["MetaTags"] = new Template("Template.MetaTags", (function() {               // 3   // 11
  var view = this;                                                                   // 4   // 12
  return Blaze.Each(function() {                                                     // 5   // 13
    return Spacebars.call(view.lookup("tags"));                                      // 6   // 14
  }, function() {                                                                    // 7   // 15
    return [ "\n    ", Spacebars.include(view.lookupTemplate("_MetaTag")), "\n  " ]; // 8   // 16
  });                                                                                // 9   // 17
}));                                                                                 // 10  // 18
                                                                                     // 11  // 19
///////////////////////////////////////////////////////////////////////////////////////     // 20
                                                                                            // 21
}).call(this);                                                                              // 22
                                                                                            // 23
                                                                                            // 24
                                                                                            // 25
                                                                                            // 26
                                                                                            // 27
                                                                                            // 28
(function () {                                                                              // 29
                                                                                            // 30
///////////////////////////////////////////////////////////////////////////////////////     // 31
//                                                                                   //     // 32
// packages/yasinuslu:blaze-meta/lib/meta.js                                         //     // 33
//                                                                                   //     // 34
///////////////////////////////////////////////////////////////////////////////////////     // 35
                                                                                     //     // 36
Meta = {                                                                             // 1   // 37
  options: {                                                                         // 2   // 38
    title: "Default Title",                                                          // 3   // 39
    suffix: "Suffix for title",                                                      // 4   // 40
    separator: " | "                                                                 // 5   // 41
  },                                                                                 // 6   // 42
                                                                                     // 7   // 43
  dict: new ReactiveDict(),                                                          // 8   // 44
                                                                                     // 9   // 45
  converters: {                                                                      // 10  // 46
    title: function(title) {                                                         // 11  // 47
      if (_.isFunction(title)) {                                                     // 12  // 48
        title = title();                                                             // 13  // 49
      }                                                                              // 14  // 50
                                                                                     // 15  // 51
      if (_.isEmpty(title)) {                                                        // 16  // 52
        return Meta.options.title || "";                                             // 17  // 53
      }                                                                              // 18  // 54
                                                                                     // 19  // 55
      if (!_.isEmpty(Meta.options.suffix)) {                                         // 20  // 56
        title = title + Meta.options.separator + Meta.options.suffix;                // 21  // 57
      }                                                                              // 22  // 58
                                                                                     // 23  // 59
      return title;                                                                  // 24  // 60
    },                                                                               // 25  // 61
                                                                                     // 26  // 62
    meta: function(property, content) {                                              // 27  // 63
      var options = _.isObject(property) ? property : {                              // 28  // 64
        name: 'property',                                                            // 29  // 65
        property: property,                                                          // 30  // 66
        content: content                                                             // 31  // 67
      };                                                                             // 32  // 68
                                                                                     // 33  // 69
      return options;                                                                // 34  // 70
    }                                                                                // 35  // 71
  },                                                                                 // 36  // 72
                                                                                     // 37  // 73
  init: function() {                                                                 // 38  // 74
    Meta.setTitle("");                                                               // 39  // 75
  },                                                                                 // 40  // 76
                                                                                     // 41  // 77
  config: function(opts) {                                                           // 42  // 78
    _.extend(Meta.options, opts.options);                                            // 43  // 79
    _.extend(Meta.converters, opts.converters);                                      // 44  // 80
  },                                                                                 // 45  // 81
                                                                                     // 46  // 82
  setVar: function(key, value) {                                                     // 47  // 83
    Meta.dict.set(key, value);                                                       // 48  // 84
  },                                                                                 // 49  // 85
                                                                                     // 50  // 86
  getVar: function(key) {                                                            // 51  // 87
    return Meta.dict.get(key);                                                       // 52  // 88
  },                                                                                 // 53  // 89
                                                                                     // 54  // 90
  set: function(property, content) {                                                 // 55  // 91
    var properties = property;                                                       // 56  // 92
    if (!_.isArray(property)) {                                                      // 57  // 93
      properties = new Array(property);                                              // 58  // 94
    }                                                                                // 59  // 95
                                                                                     // 60  // 96
    properties.forEach(function(property, key) {                                     // 61  // 97
      var meta;                                                                      // 62  // 98
      Tracker.nonreactive(function() {                                               // 63  // 99
        meta = Meta.getVar("tag") || {};                                             // 64  // 100
      });                                                                            // 65  // 101
      var m = Meta.converters.meta(property, content);                               // 66  // 102
      meta[m.property] = m;                                                          // 67  // 103
      Meta.setVar("tag", meta);                                                      // 68  // 104
    });                                                                              // 69  // 105
                                                                                     // 70  // 106
  },                                                                                 // 71  // 107
                                                                                     // 72  // 108
  unset: function(property) {                                                        // 73  // 109
    var meta;                                                                        // 74  // 110
    Tracker.nonreactive(function() {                                                 // 75  // 111
      meta = Meta.getVar("tag") || {};                                               // 76  // 112
    });                                                                              // 77  // 113
    var m = Meta.converters.meta(property);                                          // 78  // 114
    delete meta[m.property];                                                         // 79  // 115
    Meta.setVar("tag", meta);                                                        // 80  // 116
  },                                                                                 // 81  // 117
                                                                                     // 82  // 118
  unsetAll: function () {                                                            // 83  // 119
    _.each(Meta.arr(), function (item) {                                             // 84  // 120
      Meta.unset(item.property);                                                     // 85  // 121
    });                                                                              // 86  // 122
  },                                                                                 // 87  // 123
                                                                                     // 88  // 124
  setTitle: function(title) {                                                        // 89  // 125
    Meta.setVar("title", Meta.converters.title(title));                              // 90  // 126
  },                                                                                 // 91  // 127
                                                                                     // 92  // 128
  getTitle: function() {                                                             // 93  // 129
    return Meta.getVar("title");                                                     // 94  // 130
  },                                                                                 // 95  // 131
                                                                                     // 96  // 132
  arr: function() {                                                                  // 97  // 133
    var meta = Meta.getVar("tag");                                                   // 98  // 134
    return _.toArray(meta);                                                          // 99  // 135
  },                                                                                 // 100
                                                                                     // 101
  hash: function() {                                                                 // 102
    return Meta.getVar("tag");                                                       // 103
  }                                                                                  // 104
};                                                                                   // 105
                                                                                     // 106
Template.MetaTags.helpers({                                                          // 107
                                                                                     // 108
  tags: function() {                                                                 // 109
    return Meta.arr();                                                               // 110
  },                                                                                 // 111
                                                                                     // 112
  _MetaTag: function() {                                                             // 113
    var attrs = {};                                                                  // 114
    attrs[this.name] = this.property;                                                // 115
    attrs.content = this.content;                                                    // 116
    return Blaze.Template(function() {                                               // 117
      return HTML.META(attrs);                                                       // 118
    });                                                                              // 119
  }                                                                                  // 120
});                                                                                  // 121
                                                                                     // 122
Meteor.startup(function() {                                                          // 123
  Meta.init();                                                                       // 124
                                                                                     // 125
  Blaze.render(Template.MetaTags, document.head);                                    // 126
                                                                                     // 127
  Tracker.autorun(function() {                                                       // 128
    document.title = Meta.getTitle();                                                // 129
  });                                                                                // 130
});                                                                                  // 131
                                                                                     // 132
///////////////////////////////////////////////////////////////////////////////////////     // 169
                                                                                            // 170
}).call(this);                                                                              // 171
                                                                                            // 172
//////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['yasinuslu:blaze-meta'] = {
  Meta: Meta
};

})();
