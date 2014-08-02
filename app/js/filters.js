'use strict';

/* Filters */

angular.module('myApp.filters', [])
  .filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])

  .filter('userFilter', function() {
    return function(input, filterStr) {
      var result = [];

      var filterStr = filterStr.replace(/\,/gi, ''); // remove , from input string
      var filters = filterStr.split(' '); // extract filter parts

      for (var i= 0; i<input.length; i++) {
        var user = input[i];
        var matchCount = 0;
        for (var j=0; j<filters.length; j++) {
          var filter = filters[j];
          if (user.firstName.indexOf(filter) != -1 ||
              user.lastName.indexOf(filter) != -1 ||
              user.userName.indexOf(filter) != -1 ||
              user.email.indexOf(filter) != -1) {
            matchCount++;
          }
        }
        if (matchCount == filters.length) {
          result.push(user);
        }
      }

      return result;
    };
  });
