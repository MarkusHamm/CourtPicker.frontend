'use strict';

/* Controllers */

angular.module('myApp.controllers', ['myApp.services', 'ngCookies', 'ui.bootstrap'])

  /* --------------------- CONFIGURATOR ----------------------- */

  .controller('ConfigureCourtsController', ['$scope', 'RESTCourtCategory', 'RESTCourt', 'RESTCpInstance', '$rootScope', function($scope, RESTCourtCategory, RESTCourt, RESTCpInstance, $rootScope) {
    // TODO: (maybe in REST-stuff) check backend status

    $scope.courtCategories = [];
    $scope.formCourtCategory = null;
    $scope.selectedCourtCategory = null;
    $scope.displayCourtCategoryForm = false;

    $scope.courts = [];
    $scope.formCourt = null;
    $scope.displayCourtForm = false;
    
    $scope.selectCourtCategory = function(courtCategory) {
      $scope.selectedCourtCategory = courtCategory;
      $scope.courts = RESTCourt.getAll({courtCategoryId: courtCategory.id});
    };

    $scope.isCourtCategorySelected = function(courtCategory) {
      if (courtCategory == $scope.selectedCourtCategory) {
        return true;
      }
      return false;
    }
    
    $scope.showCourtCategoryForm = function(courtCategory) {
      if (courtCategory == null) {
        $scope.formCourtCategory = createNewCourtCategory();
      }
      else {
        $scope.formCourtCategory = angular.copy(courtCategory);
        $scope.courtCategoryUnderEdit = courtCategory;
      }
      $scope.displayCourtCategoryForm = true;
    };

    $scope.hideCourtCategoryForm = function() {
      $scope.displayCourtCategoryForm = false;
    };

    $scope.saveCourtCategory = function() {
      var isAdd = ($scope.formCourtCategory.id == null);

      $scope.formCourtCategory = RESTCourtCategory.save($scope.formCourtCategory);
      $scope.displayCourtCategoryForm = false;

      // new
      if (isAdd) {
        $scope.courtCategories.push($scope.formCourtCategory);
      }
      // edit existing
      else {
        angular.copy($scope.formCourtCategory, $scope.courtCategoryUnderEdit);
      }
    };
    
    $scope.deleteCourtCategory = function(courtCategory) {
      RESTCourtCategory.remove({id: courtCategory.id}, '');
      var removeIndex = $scope.courtCategories.indexOf(courtCategory);
      $scope.courtCategories.splice(removeIndex, 1);

      if ($scope.selectedCourtCategory == courtCategory) {
        $scope.selectedCourtCategory = null;
        $scope.courts = [];
      }
    };
    
    $scope.getAllCourtCategories = function() {
      $scope.courtCategories = RESTCourtCategory.getAll({cpInstanceId: $rootScope.cpInstance.id});
    };

    $scope.showCourtForm = function(court) {
      if (court == null) {
        $scope.formCourt = createNewCourt();
      }
      else {
        $scope.formCourt = angular.copy(court);
        $scope.courtUnderEdit = court;
      }
      $scope.displayCourtForm = true;
    };

    $scope.saveCourt = function() {
      var isAdd = ($scope.formCourt.id == null);

      $scope.formCourt = RESTCourt.save($scope.formCourt);
      $scope.displayCourtForm = false;

      // new
      if (isAdd) {
        $scope.courts.push($scope.formCourt);
      }
      // edit existing
      else {
        angular.copy($scope.formCourt, $scope.courtUnderEdit);
      }
    };

    $scope.hideCourtForm = function() {
      $scope.displayCourtForm = false;
    }

    $scope.deleteCourt = function(court) {
      RESTCourt.remove({id: court.id}, '');
      var removeIndex = $scope.courts.indexOf(court);
      $scope.courts.splice(removeIndex, 1);
    };

    $scope.saveCpInstanceIfInputValid = function() {
      if ($scope.formInstance.$valid) {
        $rootScope.cpInstance = RESTCpInstance.save($rootScope.cpInstance);
      }
    }

    var createNewCourtCategory = function() {
      var nextOrderNr = 0;
      for (var i = 0; i < $scope.courtCategories.length; i++) {
        var cc = $scope.courtCategories[i];
        if (cc.orderNr > nextOrderNr) {
          nextOrderNr = cc.orderNr;
        }
      }
      nextOrderNr++;

      return {
        id: null,
        cpInstanceId: $rootScope.cpInstance.id,
        name: '',
        orderNr: nextOrderNr,
        bookableFromTime: '06:00',
        bookableToTime: '23:00',
        bookingUnit: 60
      };
    };

    var createNewCourt = function() {
      var nextOrderNr = 0;
      for (var i = 0; i < $scope.courts.length; i++) {
        var c = $scope.courts[i];
        if (c.orderNr > nextOrderNr) {
          nextOrderNr = c.orderNr;
        }
      }
      nextOrderNr++;

      return {
        id: null,
        courtCategoryId: $scope.selectedCourtCategory.id,
        name: '',
        orderNr: nextOrderNr
      };
    }

    $scope.getAllCourtCategories();
  }])

  .controller('ConfigureRatesController', ['$scope', 'RESTCourtCategory', 'RESTRate', 'RESTUserGroup',
    'RESTSubscriptionRatePeriod', '$rootScope', function($scope, RESTCourtCategory, RESTRate, RESTUserGroup,
                                                         RESTSubscriptionRatePeriod, $rootScope) {
    $scope.courtCategories = [];
    $scope.selectedCourtCategory = null;
    // can be either 'RATE' or 'SUBSCRIPTIONRATEPERIOD'
    $scope.selectedRateType = 'RATE';

    $scope.rates = [];
    $scope.subscriptionRatesPeriod = [];

    $scope.userGroups = [];

    $scope.formRate = null;
    $scope.formSubscriptionRatePeriod = null;
    $scope.displayRateForm = false;
    $scope.displaySubscriptionRatePeriodForm = false;

    $scope.selectTypeRate = function() {
      $scope.selectedRateType = 'RATE';
      $scope.rates = RESTRate.getAll({courtCategoryId: $scope.selectedCourtCategory.id});
      $scope.subscriptionRatesPeriod = [];
    }

    $scope.selectTypeSubscriptionRatePeriod = function() {
      $scope.selectedRateType = 'SUBSCRIPTIONRATEPERIOD';
      $scope.subscriptionRatesPeriod = RESTSubscriptionRatePeriod.getAll({courtCategoryId: $scope.selectedCourtCategory.id});
      $scope.rates = [];
    }

    $scope.selectCourtCategory = function(courtCategory) {
      $scope.selectedCourtCategory = courtCategory;
      switch($scope.selectedRateType) {
        case 'SUBSCRIPTIONRATEPERIOD': $scope.selectTypeSubscriptionRatePeriod(); break;
        //case 'SUBSCRIPTIONRATEQUANTITY': $scope.selectTypeSubscriptionRateQuantity(); break;
        default: $scope.selectTypeRate();
      }
    }

    // -- rate --

    $scope.showRateForm = function(rate) {
      if (rate == null) {
        $scope.formRate = createNewRate();
      }
      else {
        $scope.formRate = angular.copy(rate);
        $scope.rateUnderEdit = rate;
      }
      $scope.displayRateForm = true;
    }

    $scope.saveRate = function(rate) {
      var isAdd = ($scope.formRate.id == null);

      $scope.formRate = RESTRate.save($scope.formRate);
      $scope.displayRateForm = false;

      // new
      if (isAdd) {
        $scope.rates.push($scope.formRate);
      }
      // edit existing
      else {
        angular.copy($scope.formRate, $scope.rateUnderEdit);
      }
    }

    $scope.deleteRate = function(rate) {
      RESTRate.remove({id: rate.id}, '');
      var removeIndex = $scope.rates.indexOf(rate);
      $scope.rates.splice(removeIndex, 1);
    };

    $scope.hideRateForm = function() {
      $scope.displayRateForm = false;
    }

    var createNewRate = function() {
      return {
        id: null,
        courtCategoryId: $scope.selectedCourtCategory.id,
        name: '',
        price: '',
        constrainDate: false,
        constrainTime: false,
        constrainWeekDay: false,
        constrainUserGroup: false,
        cDateFrom: '',
        cDateTo: '',
        cTimeFrom: '',
        cTimeTo: '',
        cMon: false,
        cTue: false,
        cWed: false,
        cThu: false,
        cFri: false,
        cSat: false,
        cSun: false,
        cUserGroupIds: [],
        active: true,
        orderNr: 1
      }
    }

    $scope.addUserGroupToRate = function(userGroup) {
      if($scope.formRate.cUserGroupIds.indexOf(userGroup.id) == -1) {
        $scope.formRate.cUserGroupIds.push(userGroup.id);
      }
    }

    $scope.removeUserGroupFromRate = function(id) {
      var removeIndex = $scope.formRate.cUserGroupIds.indexOf(id);
      if(removeIndex != -1) {
        $scope.formRate.cUserGroupIds.splice(removeIndex, 1);
      }
    }

    $scope.clickRateConstrainDate = function() {
      if (!$scope.formRate.constrainDate) {
        $scope.formRate.cDateFrom = '';
        $scope.formRate.cDateTo = '';
      }
    }

    $scope.clickRateConstrainTime = function() {
      if (!$scope.formRate.constrainTime) {
        $scope.formRate.cTimeFrom = '';
        $scope.formRate.cTimeTo = '';
      }
    }

    $scope.clickRateConstrainWeekDay = function() {
      if (!$scope.formRate.constrainWeekDay) {
        $scope.formRate.cMon = false;
        $scope.formRate.cTue = false;
        $scope.formRate.cWed = false;
        $scope.formRate.cThu = false;
        $scope.formRate.cFri = false;
        $scope.formRate.cSat = false;
        $scope.formRate.cSun = false;
      }
    }

    $scope.clickRateConstrainUserGroup = function() {
      if (!$scope.formRate.constrainUserGroup) {
        $scope.formRate.cUserGroupIds = [];
      }
    }

    // -- subscriptionrate period --

    $scope.showSubscriptionRatePeriodForm = function(rate) {
      if (rate == null) {
        $scope.formSubscriptionRatePeriod = createNewSubscriptionRatePeriod();
      }
      else {
        $scope.formSubscriptionRatePeriod = angular.copy(rate);
        $scope.subscriptionRatePeriodUnderEdit = rate;
      }
      $scope.displaySubscriptionRatePeriodForm = true;
    }

    $scope.saveSubscriptionRatePeriod = function(rate) {
      var isAdd = ($scope.formSubscriptionRatePeriod.id == null);

      $scope.formRate = RESTSubscriptionRatePeriod.save($scope.formSubscriptionRatePeriod);
      $scope.displaySubscriptionRatePeriodForm = false;

      // new
      if (isAdd) {
        $scope.subscriptionRatesPeriod.push($scope.formSubscriptionRatePeriod);
      }
      // edit existing
      else {
        angular.copy($scope.formSubscriptionRatePeriod, $scope.subscriptionRatePeriodUnderEdit);
      }
    }

    $scope.deleteSubscriptionRatePeriod = function(rate) {
      RESTSubscriptionRatePeriod.remove({id: rate.id}, '');
      var removeIndex = $scope.subscriptionRatesPeriod.indexOf(rate);
      $scope.subscriptionRatesPeriod.splice(removeIndex, 1);
    };

    $scope.hideSubscriptionRatePeriodForm = function() {
      $scope.displaySubscriptionRatePeriodForm = false;
    }

    var createNewSubscriptionRatePeriod = function() {
      return {
        id: null,
        courtCategoryId: $scope.selectedCourtCategory.id,
        name: '',
        periodStart: '',
        periodEnd: '',
        price: '',
        constrainTime: false,
        constrainWeekDay: false,
        constrainUserGroup: false,
        cTimeFrom: '',
        cTimeTo: '',
        cMon: false,
        cTue: false,
        cWed: false,
        cThu: false,
        cFri: false,
        cSat: false,
        cSun: false,
        cUserGroupIds: [],
        active: true,
        orderNr: 1
      }
    }

    $scope.addUserGroupToSubscriptionRatePeriod = function(userGroup) {
      if($scope.formSubscriptionRatePeriod.cUserGroupIds.indexOf(userGroup.id) == -1) {
        $scope.formSubscriptionRatePeriod.cUserGroupIds.push(userGroup.id);
      }
    }

    $scope.removeUserGroupFromSubscriptionRatePeriod = function(id) {
      var removeIndex = $scope.formSubscriptionRatePeriod.cUserGroupIds.indexOf(id);
      if(removeIndex != -1) {
        $scope.formSubscriptionRatePeriod.cUserGroupIds.splice(removeIndex, 1);
      }
    }

    // -- init --

    $scope.getUserGroupName = function(id) {
      for (var i = 0; i < $scope.userGroups.length; i++) {
        var userGroup = $scope.userGroups[i] ;
        if (userGroup.id == id) {
          return userGroup.name;
        }
      }
      return 'UNKNOWN';
    }

    var init = function() {
      $scope.courtCategories = RESTCourtCategory.getAll({cpInstanceId: $rootScope.cpInstance.id}, function(){
        $scope.initVariables($scope.courtCategories);
      });
      // FIXME
      $scope.userGroups = RESTUserGroup.getAll({cpInstanceId: 1/*$rootScope.cpInstance.id*/});
    }

    $scope.initVariables = function(courtCategories) {
      if (courtCategories.length == 0) {
        $scope.selectedCourtCategory = null;
        $scope.selectedRateType = null;
      }
      else {
        $scope.selectedCourtCategory = $scope.courtCategories[0];
        $scope.selectTypeRate();
      }
    }

    init();
  }])

  .controller('ConfigureDesignController', ['$scope', '$rootScope', '$timeout', 'RESTWebdesign', 'CpService', '$window', function($scope, $rootScope, $timeout, RESTWebdesign, CpService, $window) {
    $scope.webdesign = {};

    $scope.callRestrictorActive = false;
    $scope.callRestrictorFollowUp = false;
    $scope.iFrameLoadedTheFirstTime = true;

    $scope.previewWindowUrl = 'http://mycourtpicker.com/app/cp.html?uid=xx#/courtpicker?name=' + $rootScope.cpInstance.shortName;

    $scope.submitWebdesignIfValid = function() {
      if (!$scope.designHeaderForm.$valid || !$scope.designBasicsForm.$valid || !$scope.designControlsForm.$valid || !$scope.designContentForm.$valid) {
        return;
      }

      if (!$scope.callRestrictorActive) {
        $scope.callRestrictorActive = true;
        $scope.callRestrictorFollowUp = false;

        var webdesignCopy = angular.copy($scope.webdesign);
        removeHashPrefixFromColorFields(webdesignCopy);

        var tmpWebdesign = RESTWebdesign.save(webdesignCopy, function() {
          prefixColorFieldsWithHash(tmpWebdesign);
          $scope.webdesign = tmpWebdesign;

          CpService.getWebdesignCss($rootScope.cpInstance.id).then(function(result) {
            $rootScope.cpInstanceStyle.css = result.data;
            setPreviewWindowCss(result.data);
          });
        });

        $timeout(function() {
          $scope.callRestrictorActive = false;
          if ($scope.callRestrictorFollowUp) {
            $scope.submitWebdesignIfValid();
          }
        }, 1000);
      }
      else {
        $scope.callRestrictorFollowUp = true;
      }
    }

    $window.fileUploadDone = function(){
      if ($scope.iFrameLoadedTheFirstTime) {
        $scope.iFrameLoadedTheFirstTime = false;
        return;
      }

      CpService.getWebdesignFile($scope.webdesign.id, 'logo').then(function(result) {
        $scope.cpInstanceStyle.images['logo'] = result.data;
        setPreviewWindowLogo(result.data);
      });
    }

    var setPreviewWindowCss = function(cssString) {
      document.getElementById('designpreview').contentWindow.document.getElementById('cpInstanceStyle').innerHTML = cssString;
    }

    var setPreviewWindowLogo = function(logoData) {
      document.getElementById('designpreview').contentWindow.document.getElementById('imageLogo').src = 'data:image/gif;base64,' + logoData;
    }

    var init = function() {
      $scope.webdesign = RESTWebdesign.get({cpInstanceId: $rootScope.cpInstance.id}, function() {
        prefixColorFieldsWithHash($scope.webdesign);
      });
    }

    var prefixColorFieldsWithHash = function(webdesign) {
      webdesign.backgroundColor = '#' + webdesign.backgroundColor;
      webdesign.headerColor = '#' + webdesign.headerColor;
      webdesign.headerBackgroundColor = '#' + webdesign.headerBackgroundColor;
      webdesign.controlsColor = '#' + webdesign.controlsColor;
      webdesign.controlsTextColor = '#' + webdesign.controlsTextColor;
      webdesign.contentColor = '#' + webdesign.contentColor;
      webdesign.contentBackgroundColor = '#' + webdesign.contentBackgroundColor;
      webdesign.ctSelectColor = '#' + webdesign.ctSelectColor;
      webdesign.ctSelectBackgroundColor = '#' + webdesign.ctSelectBackgroundColor;
      webdesign.ctSelectFocusColor = '#' + webdesign.ctSelectFocusColor;
      webdesign.linkColor = '#' + webdesign.linkColor;
      webdesign.reservableHourColor = '#' + webdesign.reservableHourColor;
      webdesign.nonReservableHourColor = '#' + webdesign.nonReservableHourColor;
      webdesign.footerColor = '#' + webdesign.footerColor;
    }

    var removeHashPrefixFromColorFields = function(webdesign) {
      if (webdesign.backgroundColor.charAt(0) == '#') { webdesign.backgroundColor = webdesign.backgroundColor.substr(1); }
      if (webdesign.headerColor.charAt(0) == '#') { webdesign.headerColor = webdesign.headerColor.substr(1); }
      if (webdesign.headerBackgroundColor.charAt(0) == '#') { webdesign.headerBackgroundColor = webdesign.headerBackgroundColor.substr(1); }
      if (webdesign.controlsColor.charAt(0) == '#') { webdesign.controlsColor = webdesign.controlsColor.substr(1); }
      if (webdesign.controlsTextColor.charAt(0) == '#') { webdesign.controlsTextColor = webdesign.controlsTextColor.substr(1); }
      if (webdesign.contentColor.charAt(0) == '#') { webdesign.contentColor = webdesign.contentColor.substr(1); }
      if (webdesign.contentBackgroundColor.charAt(0) == '#') { webdesign.contentBackgroundColor = webdesign.contentBackgroundColor.substr(1); }
      if (webdesign.ctSelectColor.charAt(0) == '#') { webdesign.ctSelectColor = webdesign.ctSelectColor.substr(1); }
      if (webdesign.ctSelectBackgroundColor.charAt(0) == '#') { webdesign.ctSelectBackgroundColor = webdesign.ctSelectBackgroundColor.substr(1); }
      if (webdesign.ctSelectFocusColor.charAt(0) == '#') { webdesign.ctSelectFocusColor = webdesign.ctSelectFocusColor.substr(1); }
      if (webdesign.linkColor.charAt(0) == '#') { webdesign.linkColor = webdesign.linkColor.substr(1); }
      if (webdesign.reservableHourColor.charAt(0) == '#') { webdesign.reservableHourColor = webdesign.reservableHourColor.substr(1); }
      if (webdesign.nonReservableHourColor.charAt(0) == '#') { webdesign.nonReservableHourColor = webdesign.nonReservableHourColor.substr(1); }
      if (webdesign.footerColor.charAt(0) == '#') { webdesign.footerColor = webdesign.footerColor.substr(1); }
    }

    init();
  }])

  .controller('ConfigureRegistrationController', ['$scope', '$rootScope', '$location', 'CpService', function($scope, $rootScope, $location, CpService) {
    $scope.registrationTypes = { NEWUSER: 0, EXISTINGUSER: 1 };
    $scope.registrationType = $scope.registrationTypes.NEWUSER;
    $scope.formExistingUser = {};
    $scope.formNewUser = {};
    $scope.errorMessageNewUser = '';
    $scope.errorMessageExistingUser = '';

    $scope.isNextButtonEnabled = function() {
      if ($scope.registrationType == $scope.registrationTypes.NEWUSER &&
          $scope.newUserForm.$valid ||
          $scope.registrationType == $scope.registrationTypes.EXISTINGUSER &&
          $scope.existingUserForm.$valid) {
          return true;
      }
      return false;
    }

    $scope.processRegistration = function() {
      if ($scope.registrationType == $scope.registrationTypes.EXISTINGUSER) {
        CpService.getUserByCredentials($scope.formExistingUser.userName, $scope.formExistingUser.password).then(function(response) {
          if (response.data == null || response.data == '') {
            $scope.errorMessageExistingUser = 'Ungültige Login Daten';
          }
          else {
            var user = response.data;
            CpService.associateUserWithCpInstance($rootScope.cpInstance.id, user.id).then(function(resp) {
              $location.path('/courtpicker');
            })
          }
        });
      }
      else {
        CpService.registerUser($scope.formNewUser.userName, $scope.formNewUser.password, $scope.formNewUser.email,
          $scope.formNewUser.firstName, $scope.formNewUser.lastName).then(function(response) {
            var user = response.data;
            CpService.associateUserWithCpInstance($rootScope.cpInstance.id, user.id).then(function(resp) {
              $location.path('/courtpicker');
            })
          },
          function(error) {
            $scope.errorMessageNewUser = 'Fehler beim anlegen des Benutzers';
          })
      }
    }

    $scope.showPriceTable = function() {
      $('#priceTableModal').modal('show');
    }

    var init = function() {
      CpService.getMonthlyFee($rootScope.cpInstance.id).then(function(response) {
        $scope.monthlyFee = response.data;
      })
    }

    init();
  }])

  /* ------------------------ COURTPICKER ----------------------- */

  .controller('HeaderController', ['$scope', '$rootScope', 'UserService', 'CpService', 'LoginService', '$timeout', function($scope, $rootScope, UserService, CpService, LoginService, $timeout) {
    $scope.userInfo = UserService;

    $scope.displayLoginForm = false;
    $scope.displayForgotPasswordForm = false;
    $scope.displayForgotPasswordRequestStatus = false;

    $scope.loginForm = {username: '', password: ''};
    $scope.registerForm = {};
    $scope.forgotPasswordForm = {firstname: '', lastname: '', email: ''};
    $scope.forgotPasswordRequestStatus = '';

    $scope.showLoginForm = function() {
      $scope.displayLoginForm = true;
    }

    $scope.showRegisterForm = function() {
      $scope.registerForm = createEmptyRegisterForm();
      $('#registerModal').modal('show');
    }

    $scope.showForgotPasswordForm = function() {
      $scope.resetLoginForm();
      $scope.displayForgotPasswordForm = true;
    }

    $scope.showForgotPasswordRequestStatus = function(message) {
      $scope.forgotPasswordRequestStatus = message;
      $scope.displayForgotPasswordRequestStatus = true;
    }

    $scope.resetLoginForm = function() {
      $scope.displayLoginForm = false;
      $scope.loginForm = {username: '', password: ''};
    }

    $scope.resetRegisterForm = function() {
      $scope.registerForm = createEmptyRegisterForm();
    }

    $scope.resetForgotPasswordForm = function() {
      $scope.displayForgotPasswordForm = false;
      $scope.forgotPasswordForm = {firstname: '', lastname: '', email: ''};
      $scope.displayForgotPasswordRequestStatus = false;
      $scope.forgotPasswordRequestStatus = '';
    }
    /*
    $scope.resetForgotPasswordRequestStatus = function() {
      $scope.displayForgotPasswordRequestStatus = false;
      $scope.forgotPasswordRequestStatus = '';
    }
    */

    $scope.login = function() {
      LoginService.login($scope.loginForm.username, $scope.loginForm.password).then(function(success) {
        $scope.resetLoginForm();
      });
    }

    $scope.logout = function() {
      LoginService.logout();
    }

    $scope.register = function() {
      LoginService.register($scope.registerForm);
      $('#registerModal').modal('hide');
      $scope.registrationForm.$setPristine();
    }

    $scope.forgotPasswordRequest = function() {
      CpService.forgotPasswordRequest($scope.forgotPasswordForm.email, $scope.forgotPasswordForm.firstname, $scope.forgotPasswordForm.lastname).then(function(result) {
        if (result.data == 'true') {
          $scope.showForgotPasswordRequestStatus('Ein Email mit weiteren Instruktionen wurde an Sie verschickt!');
        }
        else {
          $scope.showForgotPasswordRequestStatus('Es wurde kein Benutzer mit den eingegebenen Daten gefunden');
        }
      });
    }

    var createEmptyRegisterForm = function() {
      return {
        userName: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        street: '',
        zipCode: '',
        city: '',
        country: '',
        handyNumber: '',
        phoneNumber: '',
        birthday: null
      };
    }
  }])

  .controller('ActivateUserController', ['$scope', '$rootScope', 'CpService', '$location', function($scope, $rootScope, CpService, $location) {
    $scope.msg = 'Bitte warten - aktivierung wird durchgeführt';

    var init = function() {
      var userId = $location.$$search.userId;
      var activationCode = $location.$$search.activationCode;


      console.log(userId);
      console.log(activationCode);

      CpService.activateUser(userId, activationCode).then(function(result) {
        if (result.data == 'true') {
          $scope.msg = 'Ihr Benutzer wurde erfolgreich aktiviert';
        }
        else {
          $scope.msg = 'Benutzer konnte nicht aktiviert werden';
        }
      }, function(error) {
        $scope.msg = 'Benutzer konnte nicht aktiviert werden';
      });
    }

    init();
  }])

  .controller('ReservationController', ['$scope', '$rootScope', 'RESTCourtCategory', 'RESTCourt', 'CpService', 'DateService', 'UserService', 'UtilService', function($scope, $rootScope, RESTCourtCategory, RESTCourt, CpService, DateService, UserService, UtilService) {
    $scope.viewTypes = { WEEKVIEW: 0, COURTVIEW: 1};
    $scope.dateService = DateService;
    $scope.userInfo = UserService;

    $scope.users = [];
    $scope.courtCategories = [];
    $scope.courts = [];
    $scope.weekViewSelectedCourt = null;
    $scope.courtViewSelectedCourts = [];
    $scope.selectedCourtCategory = null;
    $scope.timeSlots = [];
    $scope.utilizations = [];
    $scope.selectedView = $scope.viewTypes.WEEKVIEW;
    $scope.selectedDate = DateService.formatAsDateString(new Date());

    // reservation modal
    $scope.scopeTimeSlots = [];
    $scope.scopeDate = null;
    $scope.selectedTimeSlots = [];
    $scope.freeCourts = [];
    $scope.freeCourtSelected = null;
    $scope.calculatedReservationPrice = null;
    $scope.reservationPrice = null;
    $scope.overrideReservationPrice = false;
    $scope.reservationCustomerId = null;
    $scope.reservationCustomerName = '';
    $scope.reservationCustomerSelected = false;
    $scope.createReservationCustomer = false;
    $scope.createReservationCustomerEmail = '';
    $scope.comment = '';

    $scope.selectWeekViewCourt = function() {
      $scope.loadUtilization();
    }

    $scope.toggleCourtViewCourtSelection = function(court) {
      var elementIndex = $scope.courtViewSelectedCourts.indexOf(court);
      if (elementIndex == -1) {
        $scope.courtViewSelectedCourts.push(court);
        $scope.loadUtilization();
      }
      else {
        $scope.courtViewSelectedCourts.splice(elementIndex, 1);
        $scope.loadUtilization();
      }
    }

    $scope.isCourtSelectedInCourtView = function(court) {
      if ($scope.courtViewSelectedCourts.indexOf(court) == -1) {
        return false;
      }
      return true;
    }

    $scope.clickTimeSlot = function(timeSlot, timeSlots, dateString) {
      if (!timeSlot.occupied && !timeSlot.isPast && UserService.isLoggedIn) {
        $scope.selectedTimeSlots = [];
        $scope.selectedTimeSlots[0] = timeSlot;
        $scope.scopeTimeSlots = timeSlots;
        $scope.scopeDate = dateString;
        $scope.calculatedReservationPrice = null;
        $scope.reservationPrice = null;
        $scope.overrideReservationPrice = false;
        $scope.freeCourtSelected = null;
        $scope.reservationCustomerId = null;
        $scope.reservationCustomerName = '';
        $scope.reservationCustomerSelected = false;
        $scope.createReservationCustomer = false;
        $scope.createReservationCustomerEmail = '';
        $scope.comment = '';

        updateFreeCourts();
        updateReservationPrice();

        $('#reservationModal').modal('show');
      }
    }

    $scope.selectReservationCustomer = function() {
      $scope.reservationCustomerId = $scope.reservationCustomerName.id;
      $scope.reservationCustomerSelected = true;
      $scope.createReservationCustomer = false;
      $scope.createReservationCustomerEmail = '';
    }

    $scope.deselectReservationCustomer = function() {
      $scope.reservationCustomerId = null;
      $scope.reservationCustomerName = '';
      $scope.reservationCustomerSelected = false;
    }

    /*
    $scope.oneThirdReserved = function(timeSlot) {
      if (timeSlot.occupied) {
        return false;
      }

      var numberOfCourts = $scope.courts.length;
      if (numberOfCourts == 0) {
        return false;
      }

      var freeCourtPercentage = timeSlot.freeCourtIds.length / numberOfCourts;
      console.log (timeSlot.fromTime);
      console.log (timeSlot.toTime);
      console.log(freeCourtPercentage);

      if (freeCourtPercentage <= (2/3) && !(freeCourtPercentage <= (1/3))) {
        return true;
      }

      return false;
    }

    $scope.twoThirdReserved = function(timeSlot) {
      if (timeSlot.occupied) {
        return false;
      }

      var numberOfCourts = $scope.courts.length;
      if (numberOfCourts == 0) {
        return false;
      }

      var freeCourtPercentage = timeSlot.freeCourtIds.length / numberOfCourts;
      if (freeCourtPercentage <= (1/3)) {
        return true;
      }

      return false;
    }
    */

    $scope.makeSingleReservation = function() {
      if (UserService.hasAuthority("ADMIN")) {
        var customerInputType = $scope.reservationCustomerId == null ? "NAME" : "ID";
        var reservingUser = getUser($scope.reservationCustomerId);
        CpService.singleReservationAdmin(customerInputType, $scope.reservationCustomerId, $scope.reservationCustomerName,
          $scope.createReservationCustomer, $scope.createReservationCustomerEmail, UserService.loggedInUser.id,
          $scope.freeCourtSelected.id,
          $scope.scopeDate + ' ' + $scope.selectedTimeSlots[0].fromTime,
          $scope.scopeDate + ' ' + $scope.selectedTimeSlots[$scope.selectedTimeSlots.length-1].toTime,
          $scope.overrideReservationPrice, $scope.reservationPrice,
          reservingUser.firstName + ' ' + reservingUser.lastName, $scope.comment
        ).then(processSingleReservationResult);
      }
      else {
        var reservingUser = getUser(UserService.loggedInUser.id);
        CpService.singleReservation(UserService.loggedInUser.id, $scope.freeCourtSelected.id,
          $scope.scopeDate + ' ' + $scope.selectedTimeSlots[0].fromTime,
          $scope.scopeDate + ' ' + $scope.selectedTimeSlots[$scope.selectedTimeSlots.length-1].toTime,
          reservingUser.firstName + ' ' + reservingUser.lastName, $scope.comment
        ).then(processSingleReservationResult);
      }
    }

    var getUser = function(id) {
      for (var i=0; i<$scope.users.length; i++) {
        if ($scope.users[i].id == id) {
          return $scope.users[i];
        }
      }
      return null;
    }

    var processSingleReservationResult = function(result) {
      if (result.data != 'false') {
        $scope.loadUtilization(); // reload
        $('#reservationModal').modal('hide');
      }
      else {
        alert('Die gewählte Stunde wurde bereits reserviert')
        $scope.loadUtilization();
        $('#reservationModal').modal('hide');
      }
    }

    $scope.selectFreeCourt = function(court) {
      $scope.freeCourtSelected = court;
      updateReservationPrice();
    }

    $scope.setFromTimeEarlier = function() {
      var previousSlot = UtilService.getPreviousArrayElement($scope.scopeTimeSlots, $scope.selectedTimeSlots[0]);
      if (previousSlot != null) {
        $scope.selectedTimeSlots.unshift(previousSlot);
      }

      var numberOfSlotsToDeselect = $scope.selectedTimeSlots.length - $scope.selectedTimeSlots[0].maxSlots;
      for (var i=0; i<numberOfSlotsToDeselect; i++) {
        $scope.selectedTimeSlots.pop();
      }

      updateFreeCourts();
      updateReservationPrice();
    }

    $scope.setFromTimeLater = function() {
      var nextSlot = UtilService.getNextArrayElement($scope.scopeTimeSlots, $scope.selectedTimeSlots[0]);
      if (nextSlot != null) {
        if ($scope.selectedTimeSlots.length > 1) {
          $scope.selectedTimeSlots.shift();
        }
        else {
          $scope.selectedTimeSlots[0] = nextSlot;
        }
      }

      updateFreeCourts();
      updateReservationPrice();
    }

    $scope.setToTimeEarlier = function() {
      if ($scope.selectedTimeSlots.length > 1) {
        $scope.selectedTimeSlots.pop();
      }

      updateFreeCourts();
      updateReservationPrice();
    }

    $scope.setToTimeLater = function() {
      var nextSlot = UtilService.getNextArrayElement($scope.scopeTimeSlots, $scope.selectedTimeSlots[$scope.selectedTimeSlots.length-1]);
      if (nextSlot != null && $scope.selectedTimeSlots[0].maxSlots > $scope.selectedTimeSlots.length) {
        $scope.selectedTimeSlots.push(nextSlot);
      }

      updateFreeCourts();
      updateReservationPrice();
    }

    $scope.fromTimeEarlierButtonEnabled = function() {
      var previousSlot = UtilService.getPreviousArrayElement($scope.scopeTimeSlots, $scope.selectedTimeSlots[0]);
      if (previousSlot != null && !DateService.isBeforeNow($scope.scopeDate + ' ' + previousSlot.fromTime)) {
        return true;
      }
      return false;
    }

    $scope.fromTimeLaterButtonEnabled = function() {
      if (UtilService.getNextArrayElement($scope.scopeTimeSlots, $scope.selectedTimeSlots[0]) != null) {
        return true;
      }
      return false;
    }

    $scope.toTimeEarlierButtonEnabled = function() {
      if ($scope.selectedTimeSlots.length > 1) {
        return true;
      }
      return false;
    }

    $scope.toTimeLaterButtonEnabled = function() {
      var nextSlot = UtilService.getNextArrayElement($scope.scopeTimeSlots, $scope.selectedTimeSlots[$scope.selectedTimeSlots.length-1]);
      if (nextSlot != null && $scope.selectedTimeSlots[0].maxSlots > $scope.selectedTimeSlots.length) {
        return true;
      }
      return false;
    }

    $scope.getMaxFreeHours = function(freeCourt) {
      var maxFreeSlots = $scope.selectedTimeSlots[0].maxSlotsPerCourt[freeCourt.id];
      var minutesPerSlot = $scope.selectedCourtCategory.bookingUnit;
      var maxFreeMinutes = maxFreeSlots * minutesPerSlot;
      var maxFreeHours = maxFreeMinutes / 60;
      return maxFreeHours;
    }

    $scope.changeReservationPriceOverride = function() {
      $scope.reservationPrice = $scope.calculatedReservationPrice;
    }

    var updateFreeCourts = function() {
      $scope.freeCourts = calculateFreeCourts($scope.selectedTimeSlots);
      updateFreeCourtSelected();
    }

    var calculateFreeCourts = function(timeSlots) {
      var freeCourtIdsArrayList = [];
      for (var i=0; i<timeSlots.length; i++) {
        freeCourtIdsArrayList[i] = timeSlots[i].freeCourtIds;
      }

      var selectionFreeCourtIds = UtilService.intersectArrays(freeCourtIdsArrayList);

      // ids to courts
      var result = [];
      for (var i=0; i<selectionFreeCourtIds.length; i++) {
        result[i] = UtilService.getObjectById(selectionFreeCourtIds[i], $scope.courts);
      }

      return result;
    }

    var updateFreeCourtSelected = function() {
      if (($scope.freeCourtSelected == null || $scope.freeCourts.indexOf($scope.freeCourtSelected) == -1)
           && $scope.freeCourts.length > 0) {
        $scope.freeCourtSelected = $scope.freeCourts[0];
      }
    }

    var getNextTimeSlot = function(timeSlot) {
      return UtilService.getNextArrayElement($scope.scopeTimeSlots, timeSlot);
    }

    var getPreviousTimeSlot = function(timeSlot) {
      return UtilService.getPreviousArrayElement($scope.scopeTimeSlots, timeSlot);
    }

    var updateReservationPrice = function() {
      CpService.getSingleReservationPrice(UserService.loggedInUser.id, $scope.freeCourtSelected.id,
        $scope.scopeDate + ' ' + $scope.selectedTimeSlots[0].fromTime,
        $scope.scopeDate + ' ' + $scope.selectedTimeSlots[$scope.selectedTimeSlots.length-1].toTime)
        .then(function(result) {
        $scope.calculatedReservationPrice = result.data;
        if (!$scope.overrideReservationPrice) {
          $scope.reservationPrice = $scope.calculatedReservationPrice;
        }
      });
    }

    // ----------------------------

    $scope.selectCourtCategory = function(courtCategory) {
      $scope.selectedCourtCategory = courtCategory;
      $scope.weekViewSelectedCourt = null;
      $scope.courtViewSelectedCourts = [];
      CpService.getReservableTimeSlots(courtCategory.id).then(function(result) {
        $scope.timeSlots = result.data;
      });
      $scope.courts = RESTCourt.getAll({courtCategoryId: courtCategory.id});
      $scope.loadUtilization();
    }

    $scope.nextDate = function() {
      if (!DateService.isValidDateString($scope.selectedDate)) {
        return;
      }

      if ($scope.selectedView == $scope.viewTypes.WEEKVIEW) {
        var date = DateService.parseDateString($scope.selectedDate);
        date.setDate(date.getDate() + 7);
        $scope.selectedDate = DateService.formatAsDateString(date);
      }
      if ($scope.selectedView == $scope.viewTypes.COURTVIEW) {
        var date = DateService.parseDateString($scope.selectedDate);
        date.setDate(date.getDate() + 1);
        $scope.selectedDate = DateService.formatAsDateString(date);
      }
      $scope.loadUtilization();
    }

    $scope.previousDate = function() {
      if (!DateService.isValidDateString($scope.selectedDate)) {
        return;
      }

      if ($scope.selectedView == $scope.viewTypes.WEEKVIEW) {
        var date = DateService.parseDateString($scope.selectedDate);
        date.setDate(date.getDate() - 7);
        $scope.selectedDate = DateService.formatAsDateString(date);
      }
      if ($scope.selectedView == $scope.viewTypes.COURTVIEW) {
        var date = DateService.parseDateString($scope.selectedDate);
        date.setDate(date.getDate() - 1);
        $scope.selectedDate = DateService.formatAsDateString(date);
      }
      $scope.loadUtilization();
    }

    $scope.loadUtilization = function() {
      if (DateService.isValidDateString($scope.selectedDate)) {
        if ($scope.selectedView == $scope.viewTypes.WEEKVIEW) {
          if ($scope.weekViewSelectedCourt == null) {
            CpService.getWeekUtilization($scope.selectedCourtCategory.id, $scope.selectedDate).then(function(result) {
              $scope.utilizations = result.data;
            });
          }
          else {
            CpService.getWeekUtilizationForCourt($scope.weekViewSelectedCourt.id, $scope.selectedDate).then(function(result) {
              $scope.utilizations = result.data;
            });
          }
        }
        if ($scope.selectedView == $scope.viewTypes.COURTVIEW) {
          var idsCsv = '';
          for (var i=0; i<$scope.courtViewSelectedCourts.length; i++) {
            var prefix = i>0 ? ',':'';
            idsCsv += prefix + $scope.courtViewSelectedCourts[i].id;
          }
          CpService.getCourtUtilization(idsCsv, $scope.selectedDate).then(function(result) {
            $scope.utilizations = result.data;
          });
        }
      }
    }

    var init = function() {
      $scope.courtCategories = RESTCourtCategory.getAll({cpInstanceId: $rootScope.cpInstance.id}, function() {
        if ($scope.courtCategories.length > 0) {
          $scope.selectCourtCategory($scope.courtCategories[0]);
        }
      });
      CpService.getAllUserExtract().then(function(result) {
        $scope.users = result.data;
      });
    }

    init();
  }])

  .controller('CustomerReservationsController', ['$scope', '$rootScope', 'CpService', 'UserService', 'DateService', function($scope, $rootScope, CpService, UserService, DateService) {
    $scope.dateService = DateService;
    $scope.selectedReservation = null;
    $scope.allReservations = [];
    $scope.reservations = [];
    $scope.usedInstances = [];
    $scope.filterInstance = null;
    $scope.filterDateFrom = '';
    $scope.filterDateTo = '';

    $scope.openCancelReservationDialog = function(res) {
      $scope.selectedReservation = res;
      $('#cancelModal').modal('show');
    }

    $scope.cancelSelectedReservation = function() {
      CpService.cancelSingleReservation($scope.selectedReservation.id).then(function(result) {
        var elementIndex = $scope.reservations.indexOf($scope.selectedReservation);
        $scope.reservations.splice(elementIndex, 1);
      });
      $('#cancelModal').modal('hide');
    }

    $scope.cancelReservation = function(res) {
      CpService.cancelSingleReservation(res.id).then(function(result) {
        var elementIndex = $scope.reservations.indexOf(res);
        $scope.reservations.splice(elementIndex, 1);
      });
    }

    $scope.resetFilterDateFrom = function() {
      $scope.filterDateFrom = '';
      $scope.applyFilter();
    }

    $scope.resetFilterDateTo = function() {
      $scope.filterDateTo = '';
      $scope.applyFilter();
    }

    $scope.applyFilter = function() {
      $scope.reservations = [];
      for (var i=0; i<$scope.allReservations.length; i++) {
        var res = $scope.allReservations[i];
        if (doesReservationMatchInstanceFilter(res, $scope.filterInstance) &&
            doesReservationMatchDateFilter(res, $scope.filterDateFrom, $scope.filterDateTo)) {
          $scope.reservations.push(res);
        }
      }
    }

    var doesReservationMatchInstanceFilter = function(reservation, filterInstance) {
      if (filterInstance == null || reservation.instanceId == filterInstance.id) {
        return true;
      }

      return false;
    }

    var doesReservationMatchDateFilter = function(reservation, dateFrom, dateTo) {
      if (dateFrom.length == 0 && dateTo.length == 0) {
        return true;
      }

      // only from date set
      if (dateTo.length == 0) {
        var filterDateFrom = $scope.dateService.parseDateTimeString(dateFrom + ' 00:00');
        var reservationDate = new Date(reservation.toDate);
        if (reservationDate >= filterDateFrom) {
          return true;
        }
        return false;
      }
      // only to date set
      if (dateFrom.length == 0) {
        var filterDateTo = $scope.dateService.parseDateTimeString(dateTo + ' 23:59');
        var reservationDate = new Date(reservation.fromDate);
        if (reservationDate <= filterDateTo) {
          return true;
        }
        return false;
      }
      // both dates set
      var filterDateFrom = $scope.dateService.parseDateTimeString(dateFrom + ' 00:00');
      var filterDateTo = $scope.dateService.parseDateTimeString(dateTo + ' 23:59');
      var reservationDateFrom = new Date(reservation.fromDate);
      var reservationDateTo = new Date(reservation.toDate);
      if (reservationDateTo >= filterDateFrom && reservationDateFrom <= filterDateTo) {
        return true;
      }

      return false;
    }

    var init = function() {
      CpService.getSingleReservationInfosForCustomer(UserService.loggedInUser.id).then(function(result) {
        $scope.allReservations = result.data;
        $scope.reservations = $scope.allReservations
        identifyUsedInstances($scope.reservations);
      });
    }

    var identifyUsedInstances = function(reservations) {
      var addedInstanceIds = [];

      for (var i=0; i<reservations.length; i++) {
        var res = reservations[i];
        if (addedInstanceIds.indexOf(res.instanceId) == -1) {
          $scope.usedInstances.push({id: res.instanceId, name: res.instanceName});
          addedInstanceIds.push(res.instanceId);
        }
      }
    }

    init();
  }])

  .controller('AdminReservationsController', ['$scope', '$rootScope', 'CpService', 'RESTCourtCategory', 'RESTCourt', 'RESTPaymentOption', 'DateService', function($scope, $rootScope, CpService, RESTCourtCategory, RESTCourt, RESTPaymentOption, DateService) {
    $scope.dateService = DateService;

    $scope.allReservations = [];
    $scope.reservations = [];
    $scope.selectedReservation = null;
    $scope.courtCategories = [];
    $scope.courts = [];

    $scope.filterCourtCategory = null;
    $scope.filterCourt = null;
    $scope.filterDateFrom = '';
    $scope.filterDateTo = '';
    $scope.filterCustomer = '';
    $scope.filterComment = '';
    $scope.filterPaid = '';

    $scope.paymentOptions = [];
    $scope.overridePrice = false;
    $scope.customPrice = 0;
    $scope.selectedPaymentOptionId = -1;

    $scope.openCancelReservationDialog = function(res) {
      $scope.selectedReservation = res;
      $('#cancelModal').modal('show');
    }

    $scope.openPayReservationDialog = function(res) {
      $scope.selectedReservation = res;
      $scope.overridePrice = false;
      $scope.customPrice = res.price;
      $scope.selectedPaymentOptionId = $scope.paymentOptions[0].id;
      $('#payModal').modal('show');
    }

    $scope.cancelSelectedReservation = function() {
      CpService.cancelSingleReservation($scope.selectedReservation.id).then(function(result) {
        var elementIndex = $scope.reservations.indexOf($scope.selectedReservation);
        $scope.reservations.splice(elementIndex, 1);
      });
      $('#cancelModal').modal('hide');
    }

    $scope.paySelectedReservation = function() {
      CpService.paySingleReservation($scope.selectedReservation.id, $scope.selectedPaymentOptionId, $scope.overridePrice, $scope.customPrice).then(function(result) {
        $scope.selectedReservation.paid = true;
        $scope.selectedReservation.paymentDate = new Date().getTime();
        $scope.selectedReservation.paymentOptionId = $scope.selectedPaymentOptionId;
        if ($scope.overridePrice) {
          $scope.selectedReservation.price = $scope.customPrice;
        }
      });
      $('#payModal').modal('hide');
    }

    $scope.changeOverridePrice = function() {
      $scope.customPrice = $scope.selectedReservation.price;
    }

    $scope.selectCourtCategory = function() {
      if ($scope.filterCourtCategory == null) {
        $scope.courts = [];
      }
      else {
        $scope.courts = RESTCourt.getAll({courtCategoryId: $scope.filterCourtCategory.id});
      }

      $scope.filterCourt = null;
      $scope.applyFilter();
    }

    $scope.resetFilterDateFrom = function() {
      $scope.filterDateFrom = '';
      $scope.applyFilter();
    }

    $scope.resetFilterDateTo = function() {
      $scope.filterDateTo = '';
      $scope.applyFilter();
    }

    $scope.applyFilter = function() {
      $scope.reservations = [];
      for (var i=0; i<$scope.allReservations.length; i++) {
        var res = $scope.allReservations[i];
        if (doesReservationMatchCourtCategoryFilter(res, $scope.filterCourtCategory) &&
            doesReservationMatchCourtFilter(res, $scope.filterCourt) &&
            doesReservationMatchDateFilter(res, $scope.filterDateFrom, $scope.filterDateTo) &&
            doesReservationMatchCustomerFilter(res, $scope.filterCustomer) &&
            doesReservationMatchCommentFilter(res, $scope.filterComment) &&
            doesReservationMatchPaidFilter(res, $scope.filterPaid)) {
          $scope.reservations.push(res);
        }
      }
    }

    var doesReservationMatchCourtCategoryFilter = function(reservation, filterCourtCategory) {
      if (filterCourtCategory == null || reservation.courtCategoryId == filterCourtCategory.id) {
        return true;
      }
      return false;
    }

    var doesReservationMatchCourtFilter = function(reservation, filterCourt) {
      if (filterCourt == null || reservation.courtId == filterCourt.id) {
        return true;
      }
      return false;
    }

    var doesReservationMatchDateFilter = function(reservation, dateFrom, dateTo) {
      if (dateFrom.length == 0 && dateTo.length == 0) {
        return true;
      }

      // only from date set
      if (dateTo.length == 0) {
        var filterDateFrom = $scope.dateService.parseDateTimeString(dateFrom + ' 00:00');
        var reservationDate = new Date(reservation.toDate);
        if (reservationDate >= filterDateFrom) {
          return true;
        }
        return false;
      }
      // only to date set
      if (dateFrom.length == 0) {
        var filterDateTo = $scope.dateService.parseDateTimeString(dateTo + ' 23:59');
        var reservationDate = new Date(reservation.fromDate);
        if (reservationDate <= filterDateTo) {
          return true;
        }
        return false;
      }
      // both dates set
      var filterDateFrom = $scope.dateService.parseDateTimeString(dateFrom + ' 00:00');
      var filterDateTo = $scope.dateService.parseDateTimeString(dateTo + ' 23:59');
      var reservationDateFrom = new Date(reservation.fromDate);
      var reservationDateTo = new Date(reservation.toDate);
      if (reservationDateTo >= filterDateFrom && reservationDateFrom <= filterDateTo) {
        return true;
      }

      return false;
    }

    var doesReservationMatchCustomerFilter = function(reservation, filterCustomer) {
      if (filterCustomer.length==0) {
        return true;
      }
      var customerStr = reservation.customerFirstName + ' ' + reservation.customerLastName + ' (' + reservation.customerUserName + ')';
      if (customerStr.toUpperCase().indexOf(filterCustomer.toUpperCase()) > -1) {
        return true;
      }
      return false;
    }

    var doesReservationMatchCommentFilter = function(reservation, filterComment) {
      if (filterComment.length == 0) {
        return true;
      }
      if (reservation.comment.toUpperCase().indexOf(filterComment.toUpperCase()) > -1) {
        return true;
      }
      return false;
    }

    var doesReservationMatchPaidFilter = function(reservation, filterPaid) {
      if (filterPaid.length == 0) {
        return true;
      }
      if (filterPaid == 'YES' && reservation.paid || filterPaid == 'NO' && !reservation.paid) {
        return true;
      }
      return false;
    }

    var init = function() {
      CpService.getSingleReservationInfosForCpInstance($rootScope.cpInstance.id).then(function(result) {
        $scope.allReservations = result.data;
        $scope.reservations = $scope.allReservations
      });
      $scope.courtCategories = RESTCourtCategory.getAll({cpInstanceId: $rootScope.cpInstance.id});
      $scope.paymentOptions = RESTPaymentOption.getAll({cpInstanceId: $rootScope.cpInstance.id});
    }

    init();
  }])

  .controller('AdminPaymentOptionsController', ['$scope', 'RESTPaymentOption', '$rootScope', function($scope, RESTPaymentOption, $rootScope) {
    $scope.paymentOptions = [];
    $scope.formPaymentOption = null;
    $scope.paymentOptionUnderEdit = null;
    $scope.displayPaymentOptionForm = false;

    $scope.showPaymentOptionForm = function(paymentOption) {
      if (paymentOption == null) {
        $scope.formPaymentOption = createNewPaymentOption();
      }
      else {
        $scope.formPaymentOption = angular.copy(paymentOption);
        $scope.paymentOptionUnderEdit = paymentOption;
      }
      $scope.displayPaymentOptionForm = true;
    }

    $scope.savePaymentOption = function() {
      var isAdd = ($scope.formPaymentOption.id == null);

      $scope.formPaymentOption = RESTPaymentOption.save($scope.formPaymentOption);
      $scope.displayPaymentOptionForm = false;

      // new
      if (isAdd) {
        $scope.paymentOptions.push($scope.formPaymentOption);
      }
      // edit existing
      else {
        angular.copy($scope.formPaymentOption, $scope.paymentOptionUnderEdit);
      }
    }

    $scope.hidePaymentOptionForm = function() {
      $scope.displayPaymentOptionForm = false;
    }

    $scope.deletePaymentOption = function(paymentOption) {
      RESTPaymentOption.remove({id: paymentOption.id}, '');
      var removeIndex = $scope.paymentOptions.indexOf(paymentOption);
      $scope.paymentOptions.splice(removeIndex, 1);
    }

    var createNewPaymentOption = function() {
      return {
        id: null,
        cpInstanceId: $rootScope.cpInstance.id,
        name: '',
        active: true,
        deleted: false
      };
    }

    var init = function() {
      $scope.paymentOptions = RESTPaymentOption.getAll({cpInstanceId: $rootScope.cpInstance.id});
    }

    init();
  }])

  .controller('AdminUserGroupsController', ['$scope', 'RESTUserGroup', 'RESTUserGroupUser', 'CpService', 'UtilService', '$rootScope', function($scope, RESTUserGroup, RESTUserGroupUser, CpService, UtilService, $rootScope) {
    $scope.userGroups = [];
    $scope.formUserGroup = null;
    $scope.selectedUserGroup = null;
    $scope.displayUserGroupForm = false;

    $scope.allUser = [];
    $scope.userGroupUser = [];

    $scope.selectUserGroup = function(userGroup) {
      $scope.selectedUserGroup = userGroup;
      $scope.userGroupUser = RESTUserGroupUser.getAll({userGroupId: userGroup.id});
    };

    $scope.isUserGroupSelected = function(userGroup) {
      if (userGroup == $scope.selectedUserGroup) {
        return true;
      }
      return false;
    }

    $scope.showUserGroupForm = function(userGroup) {
      if (userGroup == null) {
        $scope.formUserGroup = createNewUserGroup();
      }
      else {
        $scope.formUserGroup = angular.copy(userGroup);
        $scope.userGroupUnderEdit = userGroup;
      }
      $scope.displayUserGroupForm = true;
    };

    $scope.hideUserGroupForm = function() {
      $scope.displayUserGroupForm = false;
    };

    $scope.saveUserGroup = function() {
      var isAdd = ($scope.formUserGroup.id == null);

      $scope.formUserGroup = RESTUserGroup.save($scope.formUserGroup);
      $scope.displayUserGroupForm = false;

      // new
      if (isAdd) {
        $scope.userGroups.push($scope.formUserGroup);
      }
      // edit existing
      else {
        angular.copy($scope.formUserGroup, $scope.userGroupUnderEdit);
      }
    };

    $scope.deleteUserGroup = function(userGroup) {
      RESTUserGroup.remove({id: userGroup.id}, '');
      var removeIndex = $scope.userGroups.indexOf(userGroup);
      $scope.userGroups.splice(removeIndex, 1);

      if ($scope.selectedUserGroup == userGroup) {
        $scope.selectedUserGroup = null;
        $scope.userGroupUser = [];
      }
    };

    var createNewUserGroup = function() {
      return {
        id: null,
        cpInstanceId: $rootScope.cpInstance.id,
        name: ''
      };
    };

    $scope.getAllUserGroups = function() {
      $scope.userGroups = RESTUserGroup.getAll({cpInstanceId: $rootScope.cpInstance.id});
    };


    $scope.getAllUser = function () {
      CpService.getAllUserExtract().then(function(result) {
        $scope.allUser = result.data;
      })
    };

    $scope.addUserToUserGroup = function(user) {
      RESTUserGroupUser.add({userGroupId: $scope.selectedUserGroup.id, userId: user.id},'', function() {
        $scope.userGroupUser.push(user);
      });
    }

    $scope.removeUserFromUserGroup = function(user) {
      RESTUserGroupUser.remove({userGroupId: $scope.selectedUserGroup.id, userId: user.id}, '', function() {
        var removeIndex = $scope.userGroupUser.indexOf(user);
        $scope.userGroupUser.splice(removeIndex, 1);
      });
    }

    $scope.isUserInSelectedUserGroup = function(user) {
      if (UtilService.getObjectById(user.id, $scope.userGroupUser) != null) {
        return true;
      }
      return false;
    }

    var init = function() {
      $scope.getAllUserGroups();
      $scope.getAllUser()
    }

    init();
  }]);
