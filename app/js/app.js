'use strict';

var initialResolve = {'initialResolveDone': ['$rootScope', function($rootScope) { return $rootScope.initialResolveDone; }] };

// Declare app level module which depends on filters, and services
angular.module('courtpickerApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'ngRoute'])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider.when('/courtpicker', {templateUrl: 'partials/courtpicker.html', resolve: initialResolve, requiresInstance: true, title: 'Courtpicker', includeStyle: 'includes/stylesCourtpicker.html'});
    $routeProvider.when('/activateUser', {templateUrl: 'partials/activateUser.html', resolve: initialResolve, requiresInstance: false, title: 'Courtpicker', includeStyle: 'includes/stylesBootstrap.html'});
    $routeProvider.when('/configureRates', {templateUrl: 'partials/configureRates.html', resolve: initialResolve, requiresInstance: true, title: 'Courtpicker Configurator', includeStyle: 'includes/stylesBootstrap.html'});
    $routeProvider.when('/configureCourts', {templateUrl: 'partials/configureCourts.html', resolve: initialResolve, requiresInstance: true, title: 'Courtpicker Configurator', includeStyle: 'includes/stylesBootstrap.html'});
    $routeProvider.when('/configureDesign', {templateUrl: 'partials/configureDesign.html', resolve: initialResolve, requiresInstance: true, title: 'Courtpicker Configurator', includeStyle: 'includes/stylesBootstrap.html'});
    $routeProvider.when('/configureRegistration', {templateUrl: 'partials/configureRegistration.html', resolve: initialResolve, requiresInstance: true, title: 'Courtpicker Configurator', includeStyle: 'includes/stylesBootstrap.html'});
    $routeProvider.when('/adminReservations', {templateUrl: 'partials/adminReservations.html', resolve: initialResolve, requiresInstance: true, title: 'Courtpicker Admin Area', includeStyle: 'includes/stylesBootstrap.html'});
    $routeProvider.when('/adminSubReservations', {templateUrl: 'partials/adminSubReservations.html', resolve: initialResolve, requiresInstance: true, title: 'Courtpicker Admin Area', includeStyle: 'includes/stylesBootstrap.html'});
    $routeProvider.when('/adminUserGroups', {templateUrl: 'partials/adminUserGroups.html', resolve: initialResolve, requiresInstance: true, title: 'Courtpicker Admin Area', includeStyle: 'includes/stylesBootstrap.html'});
    $routeProvider.when('/adminRates', {templateUrl: 'partials/adminRates.html', resolve: initialResolve, requiresInstance: true, title: 'Courtpicker Admin Area', includeStyle: 'includes/stylesBootstrap.html'});
    $routeProvider.when('/adminDesign', {templateUrl: 'partials/adminDesign.html', resolve: initialResolve, requiresInstance: true, title: 'Courtpicker Admin Area', includeStyle: 'includes/stylesBootstrap.html'});
    $routeProvider.when('/adminCourts', {templateUrl: 'partials/adminCourts.html', resolve: initialResolve, requiresInstance: true, title: 'Courtpicker Admin Area', includeStyle: 'includes/stylesBootstrap.html'});
    $routeProvider.when('/adminSettings', {templateUrl: 'partials/adminSettings.html', resolve: initialResolve, requiresInstance: true, title: 'Courtpicker Admin Area', includeStyle: 'includes/stylesBootstrap.html'});
    $routeProvider.when('/adminPaymentOptions', {templateUrl: 'partials/adminPaymentOptions.html', resolve: initialResolve, requiresInstance: true, title: 'Courtpicker Admin Area', includeStyle: 'includes/stylesBootstrap.html'});
    $routeProvider.when('/adminPermissions', {templateUrl: 'partials/adminPermissions.html', resolve: initialResolve, requiresInstance: true, title: 'Courtpicker Admin Area', includeStyle: 'includes/stylesBootstrap.html'});
    $routeProvider.when('/customerReservations', {templateUrl: 'partials/customerReservations.html', resolve: initialResolve, requiresInstance: true, title: 'Courtpicker Customer Area', includeStyle: 'includes/stylesBootstrap.html'});
    $routeProvider.when('/customerSubReservations', {templateUrl: 'partials/customerSubReservations.html', resolve: initialResolve, requiresInstance: true, title: 'Courtpicker Customer Area', includeStyle: 'includes/stylesBootstrap.html'});
    $routeProvider.when('/customerUserData', {templateUrl: 'partials/customerUserData.html', resolve: initialResolve, requiresInstance: true, title: 'Courtpicker Customer Area', includeStyle: 'includes/stylesBootstrap.html'});
    $routeProvider.when('/error', {templateUrl: 'partials/error.html', requiresInstance: false, title: 'Courtpicker Error', includeStyle: 'includes/stylesCourtpicker.html'});
    $routeProvider.when('/errorInstance', {templateUrl: 'partials/errorInstance.html', requiresInstance: false, title: 'Courtpicker Instance not found', includeStyle: 'includes/stylesCourtpicker.html'});
    $routeProvider.otherwise({redirectTo: '/courtpicker'});

    // redirect to error page if any service call throws an exception
    $httpProvider.interceptors.push('cpHttpResponseInterceptor');
  }])
  
  .run(['$rootScope', 'CpService', 'RESTWebdesign', '$http', '$location', '$q', '$timeout', function($rootScope, CpService, RESTWebdesign, $http, $location, $q, $timeout) {
    var nameParamRegex = /^https?:\/\/[a-zA-Z0-9\-\.]+\/([a-zA-Z0-9]+)\/?.*$/;
    var url = $location.absUrl();
    var nameParam = url.replace(nameParamRegex, "$1");

    // resolve for application to run
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      var deferred = $q.defer();

      if (next.requiresInstance) {
        $q.when($rootScope.cpInstance).then(function(value) {
          if ($rootScope.cpInstance == null) {
            deferred.reject("page requires an instance");
          }
          else {
            deferred.resolve('true');
          }
        });
      }
      else {
        deferred.resolve('true');
      }

      $rootScope.initialResolveDone = deferred.promise;
    });

    // routing success
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
      $rootScope.title = current.title;
      $rootScope.includeStyle = current.includeStyle;

      if (current.includeStyle) {
        $rootScope.applyInstanceStyle = current.includeStyle.toLocaleLowerCase().indexOf('stylescourtpicker') > -1;
      }
    });

    // routing error
    $rootScope.$on('$routeChangeError', function (event, current, previous) {
      $location.path('/errorInstance');
    });

    // prevent "page flickering" which is caused by ng-include (whose content is loaded asynchronously after the other page content is already in place)
    $rootScope.$on('$includeContentRequested', function(event) {
      if ($rootScope.ngIncludesOpen == null) {
        $rootScope.ngIncludesOpen = 1;
      }
      else {
        $rootScope.ngIncludesOpen++;
      }
    });
    $rootScope.$on('$includeContentLoaded', function(event) {
      $rootScope.ngIncludesOpen--;
    });

    $http.defaults.headers.common['Accept'] = 'text/plain,application/json';

    // create new instance or get-by-shortname
    if (nameParam != null && nameParam.toLowerCase() == 'createnew') {
      $rootScope.cpInstance = CpService.createNewInstance().then(function(result) {
        $rootScope.cpInstance = result.data;
      });
    }
    else if (nameParam) {
      $rootScope.cpInstance = CpService.getCpInstanceByShortName(nameParam).then(function(result) {
        if (result.data != null && result.data != '') {
          $rootScope.cpInstance = result.data;
        }
        else {
          $rootScope.cpInstance = null;
        }
      });
    }
    else {
      $rootScope.cpInstance = null;
    }

    // load cp styling
    $q.when($rootScope.cpInstance).then(function() {
      if ($rootScope.cpInstance) {
        $rootScope.cpInstanceStyle = { css: '', images: [] };

        // load css
        CpService.getWebdesignCss($rootScope.cpInstance.id).then(function(result) {
            $rootScope.cpInstanceStyle.css = result.data;
        })

        // load images
        var webdesign = RESTWebdesign.get({cpInstanceId: $rootScope.cpInstance.id}, function() {
          CpService.getWebdesignFile(webdesign.id, 'logo').then(function(result) {
            $rootScope.cpInstanceStyle.images['logo'] = result.data;
          })
        });
      }
    });
  }]);

/*
// Declare app level module which depends on filters, and services
angular.module('courtpickerApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/reservation', {templateUrl: 'partials/cpReservation.html', controller: 'ReservationController', resolve: initialResolve});
    $routeProvider.otherwise({redirectTo: '/reservation'});
  }])

  .run(['$rootScope', 'CpService', '$http', '$location', function($rootScope, CpService, $http, $location) {
    $http.defaults.headers.common['Accept'] = 'text/plain,application/json';

    var name = $location.$$search.name;

    $rootScope.cpInstance = CpService.getCpInstanceByName(name).then(function(result) {
      if (result.data != null && result.data != '') {
        $rootScope.cpInstance = result.data;
        CpService.getWebdesignCss($rootScope.cpInstance.id).then(function(result) {
          $rootScope.cpCss = result.data;
        });
      }
      else {
        $rootScope.cpInstance = null;
      }
    });
  }]);
*/