(function(){Meetups = new Mongo.Collection('meetups');

Meetups.helpers({

});

Meetups.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
});
}).call(this);

//# sourceMappingURL=meetups.js.map
