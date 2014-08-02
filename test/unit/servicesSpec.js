'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  beforeEach(module('myApp.services'));

//  describe('version', function() {
//    it('should return current version', inject(function(version) {
//      expect(version).toEqual('0.1');
//    }));
//  });
  
  describe('RESTCourtCategory', function() {
    var httpBackend, service;
  
    beforeEach(function (){  
      inject(function($httpBackend, RESTCourtCategory) {
        httpBackend = $httpBackend;      
        service = RESTCourtCategory;
      });
    });
      
    it('getAll calls correct URL and responds correct', function() {
      var arrayResponse = [{data: 'datat1'},{data: 'data2'}];
      httpBackend.expectGET('/tck-roger/api/getCourtCategories?cpInstanceId=55').respond(angular.toJson(arrayResponse));
      
      var result = service.getAll({cpInstanceId: 55});
      httpBackend.flush();      
      expect(angular.equals(result, arrayResponse)).toBeTruthy();
    });
    
    it('save calls correct URL and responds correct', function() {
      var inputObj = {data: 'datavalue'};
      var outputObj = {id: 1, data: 'datavalue'};
      httpBackend.expectPOST('/tck-roger/api/saveCourtCategory', angular.toJson(inputObj)).respond(angular.toJson(outputObj));
      
      var result = service.save(inputObj);
      httpBackend.flush();      
      expect(angular.equals(result, outputObj)).toBeTruthy();
    });

    it('remove calls correct URL and responds correct', function() {
      httpBackend.expectPOST('/tck-roger/api/deleteCourtCategory?id=5').respond('');
      
      service.remove({id:5}, '');
      httpBackend.flush();      
    });
  });

  describe('RESTCourt', function() {
    var httpBackend, service;

    beforeEach(function (){
      inject(function($httpBackend, RESTCourt) {
        httpBackend = $httpBackend;
        service = RESTCourt;
      });
    });

    it('getAll calls correct URL and responds correct', function() {
      var arrayResponse = [{data: 'datat1'},{data: 'data2'}];
      httpBackend.expectGET('/tck-roger/api/getCourts?courtCategoryId=55').respond(angular.toJson(arrayResponse));

      var result = service.getAll({courtCategoryId: 55});
      httpBackend.flush();
      expect(angular.equals(result, arrayResponse)).toBeTruthy();
    });

    it('save calls correct URL and responds correct', function() {
      var inputObj = {data: 'datavalue'};
      var outputObj = {id: 1, data: 'datavalue'};
      httpBackend.expectPOST('/tck-roger/api/saveCourt', angular.toJson(inputObj)).respond(angular.toJson(outputObj));

      var result = service.save(inputObj);
      httpBackend.flush();
      expect(angular.equals(result, outputObj)).toBeTruthy();
    });

    it('remove calls correct URL and responds correct', function() {
      httpBackend.expectPOST('/tck-roger/api/deleteCourt?id=5').respond('');

      service.remove({id:5}, '');
      httpBackend.flush();
    });
  });

  /*
  describe('RESTRate', function() {
    var httpBackend, service;

    beforeEach(function (){
      inject(function($httpBackend, RESTRate) {
        httpBackend = $httpBackend;
        service = RESTRate;
      });
    });

    it('getAll calls correct URL and responds correct', function() {
      var arrayResponse = [{data: 'datat1'},{data: 'data2'}];
      httpBackend.expectGET('/tck-roger/api/getRates?courtCategoryId=55').respond(angular.toJson(arrayResponse));

      var result = service.getAll({courtCategoryId: 55});
      httpBackend.flush();
      expect(angular.equals(result, arrayResponse)).toBeTruthy();
    });

    it('save calls correct URL and responds correct', function() {
      var inputObj = {data: 'datavalue'};
      var outputObj = {id: 1, data: 'datavalue'};
      httpBackend.expectPOST('/tck-roger/api/saveRate', angular.toJson(inputObj)).respond(angular.toJson(outputObj));

      var result = service.save(inputObj);
      httpBackend.flush();
      expect(angular.equals(result, outputObj)).toBeTruthy();
    });

    it('remove calls correct URL and responds correct', function() {
      httpBackend.expectPOST('/tck-roger/api/deleteRate?id=5').respond('');

      service.remove({id:5}, '');
      httpBackend.flush();
    });
  });
  */

  describe('RESTUserGroup', function() {
    var httpBackend, service;

    beforeEach(function (){
      inject(function($httpBackend, RESTUserGroup) {
        httpBackend = $httpBackend;
        service = RESTUserGroup;
      });
    });

    it('getAll calls correct URL and responds correct', function() {
      var arrayResponse = [{data: 'datat1'},{data: 'data2'}];
      httpBackend.expectGET('/tck-roger/api/getUserGroups?cpInstanceId=55').respond(angular.toJson(arrayResponse));

      var result = service.getAll({cpInstanceId: 55});
      httpBackend.flush();
      expect(angular.equals(result, arrayResponse)).toBeTruthy();
    });

    it('save calls correct URL and responds correct', function() {
      var inputObj = {data: 'datavalue'};
      var outputObj = {id: 1, data: 'datavalue'};
      httpBackend.expectPOST('/tck-roger/api/saveUserGroup', angular.toJson(inputObj)).respond(angular.toJson(outputObj));

      var result = service.save(inputObj);
      httpBackend.flush();
      expect(angular.equals(result, outputObj)).toBeTruthy();
    });

    it('remove calls correct URL and responds correct', function() {
      httpBackend.expectPOST('/tck-roger/api/deleteUserGroup?id=5').respond('');

      service.remove({id:5}, '');
      httpBackend.flush();
    });
  });

  /*
  describe('RESTSubscriptionRatePeriod', function() {
    var httpBackend, service;

    beforeEach(function (){
      inject(function($httpBackend, RESTSubscriptionRatePeriod) {
        httpBackend = $httpBackend;
        service = RESTSubscriptionRatePeriod;
      });
    });

    it('getAll calls correct URL and responds correct', function() {
      var arrayResponse = [{data: 'datat1'},{data: 'data2'}];
      httpBackend.expectGET('/tck-roger/api/getSubscriptionPeriodRates?courtCategoryId=55').respond(angular.toJson(arrayResponse));

      var result = service.getAll({courtCategoryId: 55});
      httpBackend.flush();
      expect(angular.equals(result, arrayResponse)).toBeTruthy();
    });

    it('save calls correct URL and responds correct', function() {
      var inputObj = {data: 'datavalue'};
      var outputObj = {id: 1, data: 'datavalue'};
      httpBackend.expectPOST('/tck-roger/api/saveSubscriptionPeriodRate', angular.toJson(inputObj)).respond(angular.toJson(outputObj));

      var result = service.save(inputObj);
      httpBackend.flush();
      expect(angular.equals(result, outputObj)).toBeTruthy();
    });

    it('remove calls correct URL and responds correct', function() {
      httpBackend.expectPOST('/tck-roger/api/deleteSubscriptionPeriodRate?id=5').respond('');

      service.remove({id:5}, '');
      httpBackend.flush();
    });
  });
  */

  describe('RESTCpInstance', function() {
    var httpBackend, service;

    beforeEach(function (){
      inject(function($httpBackend, RESTCpInstance) {
        httpBackend = $httpBackend;
        service = RESTCpInstance;
      });
    });

    it('save calls correct URL and responds correct', function() {
      var inputObj = {data: 'datavalue'};
      var outputObj = {id: 1, data: 'datavalue'};
      httpBackend.expectPOST('/tck-roger/api/saveCpInstance', angular.toJson(inputObj)).respond(angular.toJson(outputObj));

      var result = service.save(inputObj);
      httpBackend.flush();
      expect(angular.equals(result, outputObj)).toBeTruthy();
    });
  });

  /*
  describe('UserService', function() {
    it('UserInfo should reflect changes at all injection points', function() {
      var userInfo1, userInfo2;

      inject(function(UserService) {
        userInfo1 = UserService;
      });
      inject(function(UserService) {
        userInfo2 = UserService;
      });

      userInfo2.isLoggedIn = true;
      userInfo2.loggedInUser = 'markus';

      expect(userInfo1.isLoggedIn).toEqual(userInfo2.isLoggedIn);
      expect(userInfo1.loggedInUser).toEqual(userInfo2.loggedInUser);
    });
  });
  */

  describe('RESTWebdesign', function() {
    var httpBackend, service;

    beforeEach(function (){
      inject(function($httpBackend, RESTWebdesign) {
        httpBackend = $httpBackend;
        service = RESTWebdesign;
      });
    });

    it('get calls correct URL and responds correct', function() {
      var response = {data: 'datat1'};
      httpBackend.expectGET('/tck-roger/api/getWebdesign?cpInstanceId=55').respond(angular.toJson(response));

      var result = service.get({cpInstanceId: 55});
      httpBackend.flush();
      expect(angular.equals(result, response)).toBeTruthy();
    });

    it('save calls correct URL and responds correct', function() {
      var inputObj = {data: 'datavalue'};
      var outputObj = {id: 1, data: 'datavalue'};
      httpBackend.expectPOST('/tck-roger/api/saveWebdesign', angular.toJson(inputObj)).respond(angular.toJson(outputObj));

      var result = service.save(inputObj);
      httpBackend.flush();
      expect(angular.equals(result, outputObj)).toBeTruthy();
    });
  });

  describe('DateService', function() {
    var dateService;
    beforeEach(function (){
      inject(function(DateService) {
        dateService = DateService;
      });
    });

    var padStr = function(i) {
      return (i < 10) ? "0" + i : "" + i;
    }

    it('parseDateTimeString throws exception on null input', function() {
      expect(function(){dateService.parseDateTimeString(null)}).toThrow();
    });

    it('parseDateTimeString throws exception on invalid input', function() {
      expect(function(){dateService.parseDateTimeString('01.01.2014 aaaa')}).toThrow();
    });

    it('parseDateTimeString parses correct on valid input', function() {
      var resultDate = dateService.parseDateTimeString('01.01.2014 15:00');
      var expectedDate = new Date(2014,0,1,15,0,0);
      expect(resultDate).toEqual(expectedDate);
    });

    it('parseDateString throws exception on null input', function() {
      expect(function(){dateService.parseDateString(null)}).toThrow();
    });

    it('parseDateString throws exception on invalid input', function() {
      expect(function(){dateService.parseDateString('01.01.2014a')}).toThrow();
    });

    it('parseDateString parses correct on valid input', function() {
      var resultDate = dateService.parseDateString('05.05.2014');
      var expectedDate = new Date(2014,4,5);
      expect(resultDate).toEqual(expectedDate);
    });

    it('isBeforeNow returns true if passed date is in the past', function() {
      var result = dateService.isBeforeNow('01.01.2000 16:00');
      expect(result).toBeTruthy();
    });

    it('isBeforeNow returns false if passed date is in the future', function() {
      var result = dateService.isBeforeNow('01.01.2200 18:00');
      expect(result).toBeFalsy();
    });

    it('isBeforeNowDate returns true if passed date is in the past', function() {
      var currentDate = new Date();
      var pastDate = new Date(currentDate.getTime() - 60000);
      var result = dateService.isBeforeNowDate(pastDate);
      expect(result).toBeTruthy();
    });

    it('isBeforeNowDate date returns false if passed date is in the future', function() {
      var currentDate = new Date();
      var futureDate = new Date(currentDate.getTime() + 60000);
      var result = dateService.isBeforeNowDate(futureDate);
      expect(result).toBeFalsy();
    });

    it('isBeforeNowTimeStamp returns true if passed date is in the past', function() {
      var currentDate = new Date();
      var result = dateService.isBeforeNowTimeStamp(currentDate.getTime() - 60000);
      expect(result).toBeTruthy();
    });

    it('isBeforeNowTimestamp returns false if passed date is in the future', function() {
      var currentDate = new Date();
      var result = dateService.isBeforeNowTimeStamp(currentDate.getTime() + 60000);
      expect(result).toBeFalsy();
    });

    it('isCurrentDate returns false if passed date is not the current one', function() {
      var result = dateService.isCurrentDate('01.01.2000');
      expect(result).toBeFalsy();
    });

    it('isCurrentDate returns true if passed date is current date', function() {
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var day = now.getDate();

      var result = dateService.isCurrentDate(padStr(day) + '.' + padStr(month) + '.' + padStr(year));
      expect(result).toBeTruthy();
    });

    it('isValidDateString returns false if string is null', function() {
      var result = dateService.isValidDateString(null);
      expect(result).toBeFalsy();
    });

    it('isValidDateString returns false if string has invalid length', function() {
      var result = dateService.isValidDateString('01.01.200');
      expect(result).toBeFalsy();
    });

    it('isValidDateString returns false if it does not consist out of 3 parts', function() {
      var result = dateService.isValidDateString('01.0120000');
      expect(result).toBeFalsy();
    });

    it('isValidDateString returns false if it contains invalid parts', function() {
      var result = dateService.isValidDateString('40.15.1000');
      expect(result).toBeFalsy();
    });

    it('isValidDateString returns false if it contains characters', function() {
      var result = dateService.isValidDateString('aa.15.1000');
      expect(result).toBeFalsy();
    });

    it('isValidDateString returns true if a valid string is given', function() {
      var result = dateService.isValidDateString('12.05.2001');
      expect(result).toBeTruthy();
    });

    it('formatAsDateString throws exception if null is passed', function() {
      expect(function(){dateService.formatAsDateString(null)}).toThrow();
    });

    it('formatAsDateString throws exception if no date object is passed', function() {
      expect(function(){dateService.formatAsDateString("nodate")}).toThrow();
    });

    it('formatAsDateString returns correct result if date object is passed', function() {
      var date = new Date(2014,4,5);
      var result = dateService.formatAsDateString(date);
      expect(result).toEqual("05.05.2014");
    });

    it('formatAsDateTimeString throws exception if null is passed', function() {
      expect(function(){dateService.formatAsDateTimeString(null)}).toThrow();
    });

    it('formatAsDateTimeString throws exception if no date object is passed', function() {
      expect(function(){dateService.formatAsDateTimeString("nodate")}).toThrow();
    });

    it('formatAsDateTimeString returns correct result if date object is passed', function() {
      var date = new Date(2014,4,5,9,9,9);
      var result = dateService.formatAsDateTimeString(date);
      expect(result).toEqual("05.05.2014 09:09");
    });

    it('formatAsDateTimeString returns correct result if date object is passed', function() {
      var date = new Date(2014,4,5,9,9,9);
      var result = dateService.formatAsDateTimeString(date);
      expect(result).toEqual("05.05.2014 09:09");
    });

    it('formatAsTimeSpanString throws exception if null is passed', function() {
      expect(function(){dateService.formatAsTimeSpanString(null, null)}).toThrow();
    });

    it('formatAsTimeSpanString returns correct if input is valid', function() {
      var fromTS = 1391947200000;
      var toTS = 1391950800000;
      var result = dateService.formatAsTimeSpanString(fromTS, toTS);
      expect(result).toEqual("09.02.2014 13:00 - 14:00");
    });
  });

});
