'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource'])
  .factory('UserService', function($rootScope, CpService, $q){
    var initialized = false;
    var deferred = $q.defer();

    var userInfo = {
      resolved: deferred.promise,
      isLoggedIn: false,
      loggedInUser: null,
      authorities: [],
      statusMessage: ''
    };

    if (!initialized) {
      CpService.getAuthStatus($rootScope.cpInstance.id).then(function(result) {
        // to remain object references
        userInfo.isLoggedIn = result.data.loggedIn;
        userInfo.loggedInUser = result.data.loggedInUser;
        userInfo.authorities = result.data.authorities;
        userInfo.status = '';
        deferred.resolve(true);
      });
      initialized = true;
    }

    userInfo.hasAuthority = function(authority) {
      if (userInfo.authorities.indexOf(authority) >= 0) {
        return true;
      }
      return false;
    }

    return userInfo;
  })

  .factory('UtilService', function() {
    var obj = {};

    obj.intersectArrays = function(arrayList) {
      if (arrayList == null) {
        return null;
      }
      if (arrayList.length == 1) {
        return arrayList[0];
      }

      var result = angular.copy(arrayList[0]);
      var firstArray = arrayList[0];

      // intersect all arrays
      for (var i=firstArray.length-1; i>=0; i--) {
        for (var j=1; j<arrayList.length; j++) {
          if (arrayList[j].indexOf(firstArray[i]) == -1 && result.indexOf(firstArray[i]) >= 0) {
            var indexToRemove = result.indexOf(firstArray[i]);
            result.splice(indexToRemove, 1);
          }
        }
      }

      return result;
    }

    obj.getObjectById = function(id, objects) {
      for (var i=0; i<objects.length; i++) {
        if (objects[i].id == id) {
          return objects[i];
        }
      }

      return null;
    }

    obj.getPreviousArrayElement = function(array, currentElement) {
      for (var i=0; i<array.length; i++) {
        if (array[i] == currentElement) {
          if (i != 0)
            return array[i-1];
        }
      }
      return null;
    }

    obj.getNextArrayElement = function(array, currentElement) {
      for (var i=0; i<array.length; i++) {
        if (array[i] == currentElement) {
          if (i+1 < array.length)
            return array[i+1];
        }
      }
      return null;
    }

    return obj;
  })

  .factory('LoginService', function(CpService, UserService, $rootScope, $timeout, $q) {
    var obj = {};

    obj.login = function(username, password) {
      var deferred = $q.defer();

      CpService.login(username, password).then(function(userResult) {
        // login failed
        if (userResult.data == null || userResult.data == '') {
          obj.logout();
          UserService.statusMessage = 'Ungültige Login Daten';
          $timeout(function() { UserService.statusMessage = ''; }, 5000);
          deferred.resolve(false);
        }
        // login success
        else {
          CpService.getAuthorities(userResult.data.id, $rootScope.cpInstance.id).then(function(authoritiesResult) {
            UserService.isLoggedIn = true;
            UserService.loggedInUser = userResult.data;
            UserService.authorities = authoritiesResult.data;
            UserService.statusMessage = '';
            deferred.resolve(true);
          });
        }
      });

      return deferred.promise;
    }

    obj.logout = function() {
      CpService.logout();
      UserService.isLoggedIn = false;
      UserService.loggedInUser = null;
      UserService.authorities = [];
      UserService.statusMessage = '';
    }

    obj.register = function(user) {
      CpService.registerUser(user.userName, user.password, user.email, user.firstName, user.lastName, $rootScope.cpInstance.shortName).then(function(result) {
          if (result.data != null && result.data != '') {
            UserService.statusMessage = 'User erfolgreich angelegt - bitte aktivieren';
            $timeout(function() { UserService.statusMessage = ''; }, 3000);
          }
          else {
            UserService.statusMessage = 'Fehler beim anlegen des Users';
            $timeout(function() { UserService.statusMessage = ''; }, 5000);
          }
      });
    }

    return obj;
  })

  .factory('DateService', function(){
    var dateService = {};

    dateService.parseDateTimeString = function(dateTimeString) {
      if (dateTimeString == null || dateTimeString.length != 16) {
        throw new Error("unable to parse dateTimeString");
      }

      var dateTimeParts = dateTimeString.split(' ');
      var dateParts = dateTimeParts[0].split('.');
      var timeParts = dateTimeParts[1].split(':');

      var date = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0], timeParts[0], timeParts[1], 0);
      return date;
    }

    dateService.parseDateString = function(dateString) {
      if (dateString == null || dateString.length != 10) {
        throw new Error("unable to parse dateString");
      }

      var dateParts = dateString.split('.');

      var date = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
      return date;
    }

    dateService.formatAsDateString = function(date) {
      if (date == null || !(date instanceof Date)) {
        throw new Error('invalid date passed');
      }

      var str = padStr(date.getDate()) + "." + padStr(date.getMonth()+1) + "." + date.getFullYear();
      return str;
    }

    dateService.formatAsTimeSpanString = function(fromTimeStamp, toTimeStamp) {
      if (fromTimeStamp == null || toTimeStamp == null) {
        throw new Error('invalid timestamps passed');
      }

      var fromDate = new Date(fromTimeStamp);
      var toDate = new Date(toTimeStamp);

      var str = padStr(fromDate.getDate()) + "." + padStr(fromDate.getMonth()+1) + "." + fromDate.getFullYear() +
        ', ' + padStr(fromDate.getHours()) + ':' + padStr(fromDate.getMinutes()) + " - " +
        padStr(toDate.getHours()) + ':' + padStr(toDate.getMinutes());
      return str;
    }

    dateService.formatAsDateTimeString = function(date) {
      if (date == null || !(date instanceof Date)) {
        throw new Error('invalid date passed');
      }

      var str = padStr(date.getDate()) + "." + padStr(date.getMonth()+1) + "." + date.getFullYear() +
        ' ' + padStr(date.getHours()) + ':' + padStr(date.getMinutes());
      return str;
    }

    dateService.isBeforeNow = function(dateTimeString) {
      var now = new Date();
      var inputDate = dateService.parseDateTimeString(dateTimeString);

      if (inputDate < now) {
        return true;
      }
      return false;
    }

    dateService.isBeforeNowDate = function(date) {
      var now = new Date();

      if (date < now) {
        return true;
      }
      return false;
    }

    dateService.isBeforeNowTimeStamp = function(timeStamp) {
      var now = new Date();
      var date = new Date(timeStamp);

      if (date < now) {
        return true;
      }
      return false;
    }

    dateService.isCurrentDate = function(dateString) {
      var now = new Date();
      var inputDate = dateService.parseDateString(dateString);

      if (inputDate.getFullYear() == now.getFullYear() && inputDate.getMonth() == now.getMonth()
          && inputDate.getDate() == now.getDate()) {
        return true;
      }
      return false;
    }

    dateService.isValidDateString = function(dateString) {
      if (dateString == null || dateString.length != 10) {
        return false;
      }

      var dateParts = dateString.split('.');
      if (dateParts.length != 3) {
        return false;
      }
      if (parseInt(dateParts[0], 10) > 31 || parseInt(dateParts[1], 10) > 12 || parseInt(dateParts[2], 10) < 0) {
        return false;
      }

      return true;
    }

    var padStr = function(i) {
      return (i < 10) ? "0" + i : "" + i;
    }

    dateService.getWeekDayString = function(dateString) {
      var date = dateService.parseDateString(dateString);
      var dayOfWeek = date.getDay();

      if (dayOfWeek == 1) return "Mo";
      if (dayOfWeek == 2) return "Di";
      if (dayOfWeek == 3) return "Mi";
      if (dayOfWeek == 4) return "Do";
      if (dayOfWeek == 5) return "Fr";
      if (dayOfWeek == 6) return "Sa";
      if (dayOfWeek == 0) return "So";
      return "??";
    }

    return dateService;
  })

  .factory('RESTCpInstance', function($resource){
    return $resource('/courtpicker/api/:action', {},
      {
        save: {method:'POST', params:{action:'saveCpInstance'}, isArray:false}
        //getByName: {method:'GET', params:{action:'getCpInstanceByName', name: ''}, isArray:false}
      });
  })

	.factory('RESTCourtCategory', function($resource){
		return $resource('/courtpicker/api/:action', {}, 
		{
			getAll: {method:'GET', params:{action:'getCourtCategories', cpInstanceId: -1}, isArray:true},
			save: {method:'POST', params:{action:'saveCourtCategory'}, isArray:false},
			remove: {method:'POST', params:{action:'deleteCourtCategory', id: -1}, isArray:false}
		});
	})

  .factory('RESTCourt', function($resource){
    return $resource('/courtpicker/api/:action', {},
      {
        getAll: {method:'GET', params:{action:'getCourts', courtCategoryId: -1}, isArray:true},
        save: {method:'POST', params:{action:'saveCourt'}, isArray:false},
        remove: {method:'POST', params:{action:'deleteCourt', id: -1}, isArray:false}
      });
  })

	.factory('RESTSingleRate', function($resource){
		return $resource('/courtpicker/api/:action', {}, 
		{
			getAll: {method:'GET', params:{action:'getSingleRates', courtCategoryId: 1}, isArray:true},
      save: {method:'POST', params:{action:'saveSingleRate'}, isArray:false},
      remove: {method:'POST', params:{action:'deleteSingleRate', id: -1}, isArray:false}
		});
	})

  .factory('RESTSubscription', function($resource){
    return $resource('/courtpicker/api/:action', {},
      {
        getAll: {method:'GET', params:{action:'getSubscriptions', courtCategoryId: 1}, isArray:true},
        getAllByInstance: {method:'GET', params:{action:'getSubscriptionsByInstance', cpInstanceId: 1}, isArray:true},
        save: {method:'POST', params:{action:'saveSubscription'}, isArray:false},
        remove: {method:'POST', params:{action:'deleteSubscription', id: -1}, isArray:false}
      });
  })

  .factory('RESTSubscriptionRate', function($resource){
    return $resource('/courtpicker/api/:action', {},
      {
        getAll: {method:'GET', params:{action:'getSubscriptionRates', subscriptionId: 1}, isArray:true},
        save: {method:'POST', params:{action:'saveSubscriptionRate'}, isArray:false},
        remove: {method:'POST', params:{action:'deleteSubscriptionRate', id: -1}, isArray:false}
      });
  })

  /*
  .factory('RESTSubscriptionRatePeriod', function($resource){
    return $resource('/courtpicker/api/:action', {},
      {
        getAll: {method:'GET', params:{action:'getSubscriptionPeriodRates', courtCategoryId: 1}, isArray:true},
        save: {method:'POST', params:{action:'saveSubscriptionPeriodRate'}, isArray:false},
        remove: {method:'POST', params:{action:'deleteSubscriptionPeriodRate', id: -1}, isArray:false}
      });
  })
  */

  .factory('RESTUserGroup', function($resource){
    return $resource('/courtpicker/api/:action', {},
      {
        getAll: {method:'GET', params:{action:'getUserGroups', cpInstanceId: 1}, isArray:true},
        save: {method:'POST', params:{action:'saveUserGroup'}, isArray:false},
        remove: {method:'POST', params:{action:'deleteUserGroup', id: -1}, isArray:false}
      });
  })

  .factory('RESTUserGroupUser', function($resource){
    return $resource('/courtpicker/api/:action', {},
      {
        getAll: {method:'GET', params:{action:'getUserGroupUser', userGroupId: -1}, isArray:true},
        add: {method:'POST', params:{action:'addUserToUserGroup', userGroupId: -1, userId: -1}, isArray:false},
        remove: {method:'POST', params:{action:'removeUserFromUserGroup', userGroupId: -1, userId: -1}, isArray:false}
      });
  })

  .factory('RESTWebdesign', function($resource){
    return $resource('/courtpicker/api/:action', {},
      {
        get: {method:'GET', params:{action:'getWebdesign', cpInstanceId: 1}, isArray:false},
        save: {method:'POST', params:{action:'saveWebdesign'}, isArray:false}
      });
  })

  .factory('RESTPaymentOption', function($resource){
    return $resource('/courtpicker/api/:action', {},
      {
        getAll: {method:'GET', params:{action:'getPaymentOptions', cpInstanceId: 1}, isArray:true},
        save: {method:'POST', params:{action:'savePaymentOption'}, isArray:false},
        remove: {method:'POST', params:{action:'deletePaymentOption', id: -1}, isArray:false}
      });
  })

	.factory('CpService', function($resource, $http) {
		return {
			createNewInstance: function() {
				return $http({method: 'GET', url: '/courtpicker/api/createNewInstance'});
			},
			getWebdesignCss: function(cpInstanceId) {
				return $http({method: 'GET', url: '/courtpicker/api/getWebdesignCss', params: {'cpInstanceId': cpInstanceId}});
			},
      getWebdesignFile: function(webdesignId, type) {
        return $http({method: 'GET', url: '/courtpicker/api/getWebdesignFile', params: {'webdesignId': webdesignId, 'type': type}});
      },
      registerUser: function(userName, password, email, firstName, lastName, registerInstanceShortName) {
        return $http({method: 'POST', url: '/courtpicker/api/registerUser',
          params: {'userName': userName, 'password': password, 'email': email, 'firstName': firstName, 'lastName': lastName, 'registerInstanceShortName': registerInstanceShortName}});
      },
      registerUserExtended: function(userName, password, email, firstName, lastName, phoneNumber, street, zipCode, city, country, registerInstanceShortName) {
        return $http({method: 'POST', url: '/courtpicker/api/registerUserExtended',
          params: {'userName': userName, 'password': password, 'email': email, 'firstName': firstName, 'lastName': lastName,
                   'phoneNumber': phoneNumber, 'street': street, 'zipCode': zipCode, 'city': city, 'country': country, 'registerInstanceShortName': registerInstanceShortName}});
      },
      activateUser: function(userId, activationCode) {
        return $http({method: 'POST', url: '/courtpicker/api/activateUser',
          params: {'userId': userId, 'activationCode': activationCode}});
      },
      updateUser: function(user) {
        return $http({method: 'POST', url: '/courtpicker/api/updateUser', data: user});
      },
      login: function(username, password) {
        return $http({method: 'POST', url: '/courtpicker/api/login',
                      params: {'username': username, 'password': password}});
      },
      logout: function() {
        return $http({method: 'POST', url: '/courtpicker/api/logout', params: {}});
      },
      getAuthStatus: function(cpInstanceId) {
        return $http({method: 'GET', url: '/courtpicker/api/getAuthStatus',
          params: {'cpInstanceId': cpInstanceId}});
      },
      changeUserPassword: function(userId, oldPassword, newPassword) {
        return $http({method: 'POST', url: '/courtpicker/api/changeUserPassword',
          params: {'userId': userId, 'oldPassword': oldPassword, 'newPassword': newPassword}});
      },
      getAllUserExtract: function() {
        return $http({method: 'GET', url: '/courtpicker/api/getAllUserExtract'});
      },
      getAdminUserExtract: function(cpInstanceId) {
        return $http({method: 'GET', url: '/courtpicker/api/getAdminUserExtract', params: {'cpInstanceId': cpInstanceId}});
      },
      getAuthorities: function(userId, cpInstanceId) {
        return $http({method: 'GET', url: '/courtpicker/api/getAuthorities',
                      params: {'userId': userId, 'cpInstanceId': cpInstanceId}});
      },
      associateUserWithCpInstance: function(cpInstanceId, userId) {
        return $http({method: 'POST', url: '/courtpicker/api/associateUserWithCpInstance',
          params: {'cpInstanceId': cpInstanceId, 'userId': userId}});
      },
      authorizeUser: function(cpInstanceId, userId, authority) {
        return $http({method: 'POST', url: '/courtpicker/api/authorizeUser',
          params: {'cpInstanceId': cpInstanceId, 'userId': userId, 'authority': authority}});
      },
      deAuthorizeUser: function(cpInstanceId, userId, authority) {
        return $http({method: 'POST', url: '/courtpicker/api/deAuthorizeUser',
          params: {'cpInstanceId': cpInstanceId, 'userId': userId, 'authority': authority}});
      },
      forgotPasswordRequest: function(email, firstName, lastName) {
        return $http({method: 'GET', url: '/courtpicker/api/forgotPasswordRequest',
          params: {'email': email, 'firstName': firstName, 'lastName': lastName}});
      },
      getCpInstanceByShortName: function(shortName) {
        return $http({method: 'GET', url: '/courtpicker/api/getCpInstanceByShortName', params: {'shortName': shortName}});
      },
      getReservableTimeSlots: function(courtCategoryId) {
        return $http({method: 'GET', url: '/courtpicker/api/getReservableTimeSlots', params: {'courtCategoryId': courtCategoryId}});
      },
      getWeekUtilization: function(courtCategoryId, date) {
        return $http({method: 'GET', url: '/courtpicker/api/getWeekUtilization', params: {'courtCategoryId': courtCategoryId, 'date': date}});
      },
      getWeekUtilizationForCourt: function(courtId, date) {
        return $http({method: 'GET', url: '/courtpicker/api/getWeekUtilizationForCourt', params: {'courtId': courtId, 'date': date}});
      },
      getCourtUtilization: function(courtIdsCsv, date) {
        return $http({method: 'GET', url: '/courtpicker/api/getCourtUtilization', params: {'courtIdsCsv': courtIdsCsv, 'date': date}});
      },
      getSubscriptionAvailability: function(subscriptionId, bookingUnits) {
        return $http({method: 'GET', url: '/courtpicker/api/getSubscriptionAvailability', params: {'subscriptionId': subscriptionId, 'bookingUnits': bookingUnits}});
      },
      getSingleReservationPrice: function(customerId, courtId, fromDateTime, toDateTime) {
        return $http({method: 'GET', url: '/courtpicker/api/getSingleReservationPrice',
          params: {'customerId': customerId, 'courtId': courtId, 'fromDateTime': fromDateTime, 'toDateTime': toDateTime}});
      },
      getSubscriptionReservationPrice: function(customerId, subscriptionId, fromTime, bookingUnits, weekDay) {
        return $http({method: 'GET', url: '/courtpicker/api/getSubscriptionReservationPrice',
          params: {'customerId': customerId, 'subscriptionId': subscriptionId, 'fromTime': fromTime, 'bookingUnits': bookingUnits, 'weekDay': weekDay}});
      },
      singleReservation: function(customerId, courtId, fromDateTime, toDateTime, comment) {
        return $http({method: 'POST', url: '/courtpicker/api/singleReservation',
          params: {'customerId': customerId, 'courtId': courtId, 'fromDateTime': fromDateTime, 'toDateTime': toDateTime,
                   'comment': comment}});
      },
      singleReservationAdmin: function(customerInputType, customerId, customerName, createUserAccount, createUserAccountEmail,
                                       reservingCustomerId, courtId, fromDateTime, toDateTime, overridePrice, customPrice, comment) {
        return $http({method: 'POST', url: '/courtpicker/api/singleReservationAdmin',
          params: {'customerInputType': customerInputType, 'customerId': customerId, 'customerName': customerName,
            'createUserAccount': createUserAccount, 'createUserAccountEmail': createUserAccountEmail, 'reservingCustomerId': reservingCustomerId, 'courtId': courtId,
            'fromDateTime': fromDateTime, 'toDateTime': toDateTime, 'overridePrice': overridePrice, 'customPrice': customPrice,
            'comment': comment}});
      },
      subscriptionReservation: function(subscriptionId, customerId, courtId, weekDay, startTime, bookingUnits, comment) {
        return $http({method: 'POST', url: '/courtpicker/api/subscriptionReservation',
          params: {'subscriptionId': subscriptionId, 'customerId': customerId, 'courtId': courtId, 'weekDay': weekDay, 'startTime': startTime,
                   'bookingUnits': bookingUnits, 'comment': comment}});
      },
      subscriptionReservationAdmin: function(customerInputType, customerId, customerName, createUserAccount, createUserAccountEmail, subscriptionId,
                                             reservingCustomerId, courtId, weekDay, startTime, bookingUnits, overridePrice, customPrice, comment) {
        return $http({method: 'POST', url: '/courtpicker/api/subscriptionReservationAdmin',
          params: {'customerInputType': customerInputType, 'customerId': customerId, 'customerName': customerName, 'createUserAccount': createUserAccount,
            'createUserAccountEmail': createUserAccountEmail, 'subscriptionId': subscriptionId, 'reservingCustomerId': reservingCustomerId, 'courtId': courtId, 'weekDay': weekDay,
            'startTime': startTime, 'bookingUnits': bookingUnits, 'overridePrice': overridePrice, 'customPrice': customPrice, 'comment': comment}});
      },
      getSingleReservationInfosForCustomer: function(customerId) {
        return $http({method: 'GET', url: '/courtpicker/api/getSingleReservationInfosForCustomer', params: {'customerId': customerId}});
      },
      getSingleReservationInfosForCpInstance: function(cpInstanceId) {
        return $http({method: 'GET', url: '/courtpicker/api/getSingleReservationInfosForCpInstance', params: {'cpInstanceId': cpInstanceId}});
      },
      getSubscriptionReservationInfosForCustomer: function(customerId) {
        return $http({method: 'GET', url: '/courtpicker/api/getSubscriptionReservationInfosForCustomer', params: {'customerId': customerId}});
      },
      getSubscriptionReservationInfosForCpInstance: function(cpInstanceId) {
        return $http({method: 'GET', url: '/courtpicker/api/getSubscriptionReservationInfosForCpInstance', params: {'cpInstanceId': cpInstanceId}});
      },
      cancelSingleReservation: function(reservationId) {
        return $http({method: 'POST', url: '/courtpicker/api/cancelSingleReservation', params: {'reservationId': reservationId}});
      },
      paySingleReservation: function(reservationId, paymentOptionId, overridePrice, customPrice) {
        return $http({method: 'POST', url: '/courtpicker/api/paySingleReservation',
          params: {'reservationId': reservationId, 'paymentOptionId': paymentOptionId, 'overridePrice': overridePrice, 'customPrice': customPrice}});
      },
      cancelSubscriptionReservation: function(reservationId) {
        return $http({method: 'POST', url: '/courtpicker/api/cancelSubscriptionReservation', params: {'reservationId': reservationId}});
      },
      paySubscriptionReservation: function(reservationId, paymentOptionId, overridePrice, customPrice) {
        return $http({method: 'POST', url: '/courtpicker/api/paySubscriptionReservation',
          params: {'reservationId': reservationId, 'paymentOptionId': paymentOptionId, 'overridePrice': overridePrice, 'customPrice': customPrice}});
      },
      getCurrentSubscriptions: function(courtCategoryId) {
        return $http({method: 'GET', url: '/courtpicker/api/getCurrentSubscriptions',
          params: {'courtCategoryId': courtCategoryId}});
      },
      getMonthlyFee: function(cpInstanceId) {
        return $http({method: 'GET', url: '/courtpicker/api/getMonthlyFee', params: {'cpInstanceId': cpInstanceId}});
      }
		};
	})

  .factory('ValidationService', function($resource, $http) {
    return {
      validateUniqueCpShortName: function(shortName, excludeCurrentCpInstanceId) {
        return $http({method: 'GET', url: '/courtpicker/api/validateUniqueCpShortName',
                      params: {'shortName': shortName, 'excludeCurrentCpInstanceId': excludeCurrentCpInstanceId}});
      },
      validateUniqueUserName: function(userName, excludeCurrentUserId) {
        return $http({method: 'GET', url: '/courtpicker/api/validateUniqueUserName',
            params: {'userName': userName, 'excludeCurrentUserId': excludeCurrentUserId}});
      },
      validateUniqueUserEmail: function(userEmail, excludeCurrentUserId) {
        return $http({method: 'GET', url: '/courtpicker/api/validateUniqueUserEmail',
            params: {'userEmail': userEmail, 'excludeCurrentUserId': excludeCurrentUserId}});
      }
    };
  })

  // redirect to error page if any service call throws an exception
  .factory('cpHttpResponseInterceptor',['$q','$location',function($q,$location) {
    return {
      'responseError': function(rejection){
        $location.path('/error');
        return $q.reject(rejection);
      }
    }
  }]);

//	.factory('CpService', function($resource){
//		return $resource('/courtpicker/api/:action', {}, 
//		{
//			createNewInstance: {method:'GET', params:{action:'createNewInstance'}, isArray: false},
//			getWebdesignCss: {method:'GET', params:{action:'getWebdesignCss', cpInstanceId:-1}, headers: {'Accept': 'application/xml'}, isArray: false, responseType: 'text/plain'}
//		});
//	});

//angular.module('courtpickerServices', ['ngResource']).
//	factory('Rate', function($resource){
//		return $resource('/courtpicker/api/:action', {}, 
//		{
//			getAll: {method:'GET', params:{action:'getRates', courtCategoryId: 1}, isArray:true}
//		});
//	});
