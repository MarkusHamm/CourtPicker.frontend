'use strict';

/* Directives */


angular.module('myApp.directives', []).

  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])

  .directive('stopEvent', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.bind(attr.stopEvent, function (e) {
          e.stopPropagation();
        });
      }
    }
  })

  .directive('myFocusOn', function($timeout) {
    return {
      link: function(scope, element, attrs) {
        scope.$watch(attrs.myFocusOn, function(value) {
          if(value === true) {
            $timeout(function() {
              element[0].focus();
              // set only for testability (focus cannot be checked programmatically)
              element[0].alt = 'focused';
            });
          }
        });
      }
    };
  })

  .directive('myPwMatch', function($timeout) {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var checker = function () {
          //get the value of the first password
          var e1 = scope.$eval(attrs.ngModel);
          //get the value of the other password
          var e2 = scope.$eval(attrs.passwordMatch);
          return e1 == e2;
        };
        scope.$watch(checker, function (n) {
          //set the form control to valid if both
          //passwords are the same, else invalid
          ctrl.$setValidity("pwmatch", n);
        });
      }
    }
  })

  .directive('myDatepicker', function() {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        var datepicker = element.datepicker();
        datepicker.on('changeDate', function(newDate) {
          scope.$apply(function() {
            ngModel.$setViewValue(element.val());
            datepicker.datepicker('hide');
          });
        });
        datepicker.on('show', function(ev) {
          datepicker.datepicker('update', ngModel.$modelValue);
        });
        return datepicker;
      }
    };
  })

  /*
  .directive('myDatepickerJquery', function() {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        var datepicker = element.datepicker({
          dateFormat: 'dd.mm.yy',
          onSelect: function(date) {
            scope.$apply(function() {
              ngModel.$setViewValue(date);
            })
          }
        });
        return datepicker;
      }
    };
  })
  */

  .directive('myTimepicker', function() {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        var timepicker = element.timepicker();
        timepicker.on('changeTime.timepicker', function() {
          scope.$apply(function() {
            ngModel.$setViewValue(element.val());
          });
        });
        timepicker.on('show.timepicker', function() {
          scope.$apply(function(ev) {
            timepicker.timepicker('setTime', ngModel.$modelValue);
          });
        });
        return timepicker;
      }
    };
  })

  .directive('myColorpicker', function() {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        var cp = element.colorpicker();
        cp.on('changeColor', function() {
          scope.$apply(function() {
            ngModel.$setViewValue(element.val());
          });
        });
        cp.on('showPicker', function(ev) {
          if (ngModel.$modelValue) {
            ev.color.setColor(ngModel.$modelValue);
            cp.colorpicker('update');
          }
        });
        return cp;
      }
    };
  })

  .directive('myValidateUniqueCpShortname', function(ValidationService, $rootScope) {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        element.on('keyup', function(evt) {
          scope.$apply(function() {
            var shortName = element.val();
            if (shortName == '') {
              ngModel.$setValidity('unique', true);
            }
            else {
              ValidationService.validateUniqueCpShortName(shortName, $rootScope.cpInstance.id).then(function(result) {
                if (result.data == 'VALID') {
                  ngModel.$setValidity('unique', true);
                }
                else {
                  ngModel.$setValidity('unique', false);
                }
              });
            }
          })
        });
      }
    };
  })

  .directive('myValidateUniqueUserName', function(ValidationService, UserService) {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        element.on('keyup', function(evt) {
          scope.$apply(function() {
            var userName = element.val();
            if (userName == '') {
              ngModel.$setValidity('unique', true);
            }
            else {
              var serviceCallback = function(result) {
                if (result.data == 'VALID') {
                  ngModel.$setValidity('unique', true);
                }
                else {
                  ngModel.$setValidity('unique', false);
                }
              }

              if (UserService.isLoggedIn) {
                ValidationService.validateUniqueUserName(userName, UserService.loggedInUser.id).then(serviceCallback);
              }
              else {
                ValidationService.validateUniqueUserName(userName).then(serviceCallback);
              }
            }
          })
        });
      }
    };
  })

  .directive('myValidateUniqueUserEmail', function(ValidationService, UserService) {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        element.on('keyup', function(evt) {
          scope.$apply(function() {
            var userEmail = element.val();
            if (userEmail == '') {
              ngModel.$setValidity('unique', true);
            }
            else {
              var serviceCallback = function(result) {
                if (result.data == 'VALID') {
                  ngModel.$setValidity('unique', true);
                }
                else {
                  ngModel.$setValidity('unique', false);
                }
              }

              if (UserService.isLoggedIn) {
                ValidationService.validateUniqueUserEmail(userEmail, UserService.loggedInUser.id).then(serviceCallback);
              }
              else {
                ValidationService.validateUniqueUserEmail(userEmail).then(serviceCallback);
              }
            }
          })
        });
      }
    };
  })

  .directive('myOnBlur', function(ValidationService) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.on('blur', function() {
          scope.$apply(attrs.myOnBlur);
        });
      }
    };
  });