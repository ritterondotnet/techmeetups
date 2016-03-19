(function(){Meteor.publish('meetups', function(){
  return Meetups.find();
});
}).call(this);

//# sourceMappingURL=meetups.js.map
