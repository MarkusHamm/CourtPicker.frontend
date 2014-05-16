'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  beforeEach(module('myApp.controllers'));

  it('should ....', inject(function() {
    //spec body hello
  }));

  it('should ....', inject(function() {
    //spec body
  }));
  
  describe('ConfigureCourtsController', function() {
    var ctrl;
    var scope;
    var mockRESTCourtCategory = {
      getAll: function() {
        return [{id: 1, cpInstanceId: 1, orderNr: 1, name: 'tennis'},
          {id: 2, cpInstanceId: 1, orderNr: 2, name: 'fussball'},
          {id: 3, cpInstanceId: 1, orderNr: 3, name: 'squash'}];
      },
      save: function(courtCategory) {
        courtCategory.id = 100;
        return courtCategory;
      },
      remove: function() { }
    };
    var mockRESTCourt = {
      getAll: function() {
        return [{id: 1, courtNumber: 1, courtName: 'court1', indoorCourt:0, bookable: 1, courtCategoryId:5},
          {id: 2, courtNumber: 2, courtName: 'court2', indoorCourt:1, bookable: 0, courtCategoryId:5},
          {id: 3, courtNumber: 3, courtName: 'court3', indoorCourt:1, bookable: 1, courtCategoryId:5}];
      },
      save: function(court) {
        court.id = 100;
        return court;
      },
      remove: function() { }
    };

    beforeEach(inject(function($rootScope, $controller) {
      $rootScope.cpInstance = {id: 1};
      scope = $rootScope.$new();
      ctrl = $controller('ConfigureCourtsController', {
        $scope: scope,
        RESTCourtCategory: mockRESTCourtCategory,
        RESTCourt: mockRESTCourt,
        $rootScope: $rootScope
      });
    }));

    // ----- CourtCategories -----

    it('should load courtCategories at instantiation', inject(function() {
      expect(scope.courtCategories.length).toBe(3);
    }));

    it('should construct a correct new courtCategory at calling showCourtCategoryForm without parameter', inject(function() {
      scope.showCourtCategoryForm();
      expect(scope.formCourtCategory).toEqual({
        id: null,
        cpInstanceId: 1,
        name: '',
        orderNr: 4,
        bookableFromTime: '06:00',
        bookableToTime: '23:00',
        bookingUnit: 60
      });
    }));

    it('should construct a correct new courtCategory at calling showCourtCategoryForm without parameter - ' +
      'even if courtCategories list is empty', inject(function() {
      scope.courtCategories = [];
      scope.showCourtCategoryForm();
      expect(scope.formCourtCategory).toEqual({
        id: null,
        cpInstanceId: 1,
        name: '',
        orderNr: 1,
        bookableFromTime: '06:00',
        bookableToTime: '23:00',
        bookingUnit: 60
      });
    }));

    it('should use the passed courtCategory at calling showCourtCategoryForm with parameter', inject(function() {
      var wantedCC = scope.courtCategories[1];
      scope.showCourtCategoryForm(wantedCC);
      expect(scope.formCourtCategory).toEqual(wantedCC);
    }));

    it('should add a new courtCategory at add and save', inject(function() {
      spyOn(mockRESTCourtCategory, 'save').andCallThrough();

      scope.showCourtCategoryForm();
      expect(scope.displayCourtCategoryForm).toBeTruthy();

      scope.formCourtCategory.name = 'snooker';
      scope.saveCourtCategory();
      expect(scope.displayCourtCategoryForm).toBeFalsy();

      expect(mockRESTCourtCategory.save).toHaveBeenCalledWith(scope.formCourtCategory);
      expect(scope.courtCategories.length).toBe(4);
      expect(scope.courtCategories[scope.courtCategories.length - 1]).toEqual(scope.formCourtCategory);
    }));

    it('should update an existing courtCategory at update and save', inject(function() {
      spyOn(mockRESTCourtCategory, 'save').andCallThrough();

      var ccToUpdate = scope.courtCategories[1];
      scope.showCourtCategoryForm(ccToUpdate);
      expect(scope.displayCourtCategoryForm).toBeTruthy();

      scope.formCourtCategory.name = 'snooker';
      scope.saveCourtCategory();
      expect(scope.displayCourtCategoryForm).toBeFalsy();

      expect(mockRESTCourtCategory.save).toHaveBeenCalledWith(scope.formCourtCategory);
      expect(scope.courtCategories.length).toBe(3);
      expect(scope.courtCategories[1]).toEqual(scope.formCourtCategory);
    }));

    it('should not update an existing courtCategory in view without clicking save', inject(function() {
      var ccToUpdate = scope.courtCategories[1];
      var originCCName = ccToUpdate.name;

      scope.showCourtCategoryForm(ccToUpdate);
      expect(scope.displayCourtCategoryForm).toBeTruthy();

      scope.formCourtCategory.name = 'snooker';
      scope.hideCourtCategoryForm();
      expect(scope.displayCourtCategoryForm).toBeFalsy();

      expect(scope.courtCategories.length).toBe(3);
      expect(scope.courtCategories[1].name).toBe(originCCName);
    }));

    it('should delete an existing courtCategory at delete', inject(function() {
      spyOn(mockRESTCourtCategory, 'remove').andCallThrough();

      var ccAtPos1 = scope.courtCategories[0];
      var ccToDelete = scope.courtCategories[1];
      var ccAtPos3 = scope.courtCategories[2];
      scope.deleteCourtCategory(ccToDelete);

      expect(mockRESTCourtCategory.remove).toHaveBeenCalledWith({id: ccToDelete.id}, '');
      expect(scope.courtCategories.length).toBe(2);
      expect(scope.courtCategories[0]).toEqual(ccAtPos1);
      expect(scope.courtCategories[1]).toEqual(ccAtPos3);
    }));

    it('should reset selectedItem property when the current selected item is deleted', function() {
      var ccToDelete = scope.courtCategories[1];
      scope.selectCourtCategory(ccToDelete);
      expect(scope.selectedCourtCategory).toEqual(ccToDelete);

      scope.deleteCourtCategory(ccToDelete);
      expect(scope.selectedCourtCategory).toBeNull();
    });

    it('should highlight no courtCategory item if no courtCategory is set', function() {
      expect(scope.isCourtCategorySelected(scope.courtCategories[0])).toBeFalsy();
      expect(scope.isCourtCategorySelected(scope.courtCategories[1])).toBeFalsy();
      expect(scope.isCourtCategorySelected(scope.courtCategories[2])).toBeFalsy();
    });

    it('should highlight only the selected courtCategory item and this even after an update of it', function() {
      scope.selectCourtCategory(scope.courtCategories[1]);
      expect(scope.isCourtCategorySelected(scope.courtCategories[0])).toBeFalsy();
      expect(scope.isCourtCategorySelected(scope.courtCategories[1])).toBeTruthy();
      expect(scope.isCourtCategorySelected(scope.courtCategories[2])).toBeFalsy();

      // update selected item
      scope.showCourtCategoryForm(scope.courtCategories[1]);
      scope.formCourtCategory.name = 'snooker';
      scope.saveCourtCategory();

      expect(scope.isCourtCategorySelected(scope.courtCategories[0])).toBeFalsy();
      expect(scope.isCourtCategorySelected(scope.courtCategories[1])).toBeTruthy();
      expect(scope.isCourtCategorySelected(scope.courtCategories[2])).toBeFalsy();
    });

    // ----- Courts -----

    it('should load courts at selecting a courtCategory', function() {
      spyOn(mockRESTCourt, 'getAll').andCallThrough();

      var selectedCourtCategory = scope.courtCategories[1];
      scope.selectCourtCategory(selectedCourtCategory);

      expect(mockRESTCourt.getAll).toHaveBeenCalledWith({courtCategoryId: selectedCourtCategory.id});
      expect(scope.courts.length).toBe(3);
    });

    it('should show empty court form at creating a new court', function() {
      var selectedCourtCategory = scope.courtCategories[1];
      scope.selectCourtCategory(selectedCourtCategory);

      scope.showCourtForm();
      expect(scope.formCourt).toEqual({
        id: null,
        name: '',
        courtCategoryId: selectedCourtCategory.id,
        orderNr: 1
      });
    });

    it('should show filled court form at editing any existing court', function() {
      var selectedCourtCategory = scope.courtCategories[1];
      scope.selectCourtCategory(selectedCourtCategory);

      var selectedCourt = scope.courts[1];
      scope.showCourtForm(selectedCourt);
      expect(scope.formCourt).toEqual(selectedCourt);
    });

    it('should create a court at -add court- and save', function() {
      spyOn(mockRESTCourt, 'save').andCallThrough();

      var selectedCourtCategory = scope.courtCategories[1];
      scope.selectCourtCategory(selectedCourtCategory);

      scope.showCourtForm();
      expect(scope.displayCourtForm).toBeTruthy();

      scope.formCourt.courtName = 'mycourt1';
      scope.formCourt.indoorCourt = 1;
      scope.saveCourt();
      expect(scope.displayCourtForm).toBeFalsy();

      expect(mockRESTCourt.save).toHaveBeenCalledWith(scope.formCourt);
      expect(scope.courts.length).toBe(4);
      expect(scope.courts[scope.courts.length - 1].id).toBe(100);
    });

    it('should update a court at -edit court- and save', function() {
      spyOn(mockRESTCourt, 'save').andCallThrough();

      var selectedCourtCategory = scope.courtCategories[1];
      scope.selectCourtCategory(selectedCourtCategory);

      var editCourt = scope.courts[1];
      scope.showCourtForm(editCourt);
      scope.formCourt.courtName = 'newname';
      scope.formCourt.indoorCourt = 0;
      scope.saveCourt();

      expect(mockRESTCourt.save).toHaveBeenCalledWith(scope.formCourt);
      expect(scope.courts.length).toBe(3);
      expect(editCourt.courtName).toBe('newname');
      expect(editCourt.indoorCourt).toBe(0);
    });

    it('should not create or update courts at court form cancel button', function() {
      spyOn(mockRESTCourt, 'save').andCallThrough();

      var selectedCourtCategory = scope.courtCategories[1];
      scope.selectCourtCategory(selectedCourtCategory);

      var editCourt = scope.courts[1];
      var originalName = editCourt.courtName;

      scope.showCourtForm(editCourt);
      scope.formCourt.courtName = 'newname';
      scope.hideCourtForm();

      expect(mockRESTCourt.save.calls.length).toEqual(0);
      expect(scope.courts[1].courtName).toEqual(originalName);
    });

    it('should delete a court at clicking delete', function() {
      spyOn(mockRESTCourt, 'remove').andCallThrough();

      var selectedCourtCategory = scope.courtCategories[1];
      scope.selectCourtCategory(selectedCourtCategory);

      var courtAtPos1 = scope.courts[0];
      var courtAtPos2 = scope.courts[1];
      var courtAtPos3 = scope.courts[2];

      scope.deleteCourt(courtAtPos2);

      expect(mockRESTCourt.remove).toHaveBeenCalledWith({id: courtAtPos2.id}, '');
      expect(scope.courts.length).toBe(2);
      expect(scope.courts[0]).toEqual(courtAtPos1);
      expect(scope.courts[1]).toEqual(courtAtPos3);
    });

    it('should clear court list at deleting selected courtCategory', function() {
      var ccToDelete = scope.courtCategories[1];
      scope.selectCourtCategory(ccToDelete);
      expect(scope.courts.length).toEqual(3);

      scope.deleteCourtCategory(ccToDelete);
      expect(scope.courts.length).toEqual(0);
    });
  });

  // ----- Rates -----

  describe('ConfigureRatesController', function() {
    var ctrl, scope, mockRESTCourtCategory, mockRESTRate, mockRESTSubscriptionRatePeriod, mockRESTUserGroup;

    var createMocks = function() {
      mockRESTCourtCategory = jasmine.createSpyObj('mockRESTCourtCategory', ['getAll', 'save', 'remove']);
      mockRESTRate = jasmine.createSpyObj('mockRESTRate', ['getAll', 'save', 'remove']);
      mockRESTSubscriptionRatePeriod = jasmine.createSpyObj('mockRESTSubscriptionRatePeriod', ['getAll', 'save', 'remove']);
      mockRESTUserGroup = jasmine.createSpyObj('mockRESTUserGroup', ['getAll', 'save', 'remove']);
    }

    var createController = function() {
      inject(function($rootScope, $controller) {
        $rootScope.cpInstance = {id: 1};
        scope = $rootScope.$new();
        ctrl = $controller('ConfigureRatesController', {
          $scope: scope,
          RESTCourtCategory: mockRESTCourtCategory,
          RESTRate: mockRESTRate,
          RESTUserGroup: mockRESTUserGroup,
          RESTSubscriptionRatePeriod: mockRESTSubscriptionRatePeriod,
          $rootScope: $rootScope
        });
      });
    }

    it('should fetch court categories at init and no selection when no court category is present', function() {
      createMocks();
      mockRESTCourtCategory.getAll.andReturn([]);

      createController();
      scope.initVariables([]);

      expect(scope.selectedCourtCategory).toBeNull;
      expect(scope.selectedRateType).toBeNull();
    });

    it('should fetch court categories at init + fetch and show rates of first court category', function() {
      createMocks();
      var courtCategories = [{id: 1, name: 'tennis'}, {id: 2, name: 'fußball'}];
      var rates =  [{id: 1, name: 'standard rate', price: 10}, {id: 2, name: 'cheap rate', price: 8}];
      var userGroups = [{id: 1, name: 'students'}, {id: 2, name: 'teenies'}];
      mockRESTCourtCategory.getAll.andReturn(courtCategories);
      mockRESTRate.getAll.andReturn(rates);
      mockRESTUserGroup.getAll.andReturn(userGroups);

      createController();
      scope.initVariables(courtCategories);

      expect(scope.selectedCourtCategory).toBe(courtCategories[0]);
      expect(scope.selectedRateType).toBe('RATE');
      expect(scope.rates).toBe(rates);
      expect(scope.userGroups).toBe(userGroups);
    });

    it('should fetch and show rates of new court category when changed', function() {
      createMocks();
      var courtCategories = [{id: 1, name: 'tennis'}, {id: 2, name: 'fußball'}];
      var rates =  [{id: 1, name: 'standard rate', price: 10}, {id: 2, name: 'cheap rate', price: 8}];
      mockRESTCourtCategory.getAll.andReturn(courtCategories);
      mockRESTRate.getAll.andReturn(rates);

      createController();
      scope.initVariables(courtCategories);
      scope.selectCourtCategory(courtCategories[1]);

      expect(scope.selectedCourtCategory).toBe(courtCategories[1]);
      expect(scope.selectedRateType).toBe('RATE');
      expect(mockRESTRate.getAll).toHaveBeenCalledWith({courtCategoryId: 2});
      expect(scope.rates).toBe(rates);
    });

    it('should fetch and show right rate-type when rate-type is changed', function() {
      createMocks();
      var courtCategories = [{id: 1, name: 'tennis'}, {id: 2, name: 'fußball'}];
      var rates =  [{id: 1, name: 'standard rate', price: 10}, {id: 2, name: 'cheap rate', price: 8}];
      mockRESTCourtCategory.getAll.andReturn(courtCategories);
      mockRESTRate.getAll.andReturn(rates);

      createController();
      scope.initVariables(courtCategories);
      scope.selectTypeRate();
      scope.selectTypeSubscriptionRatePeriod();

      expect(scope.selectedCourtCategory).toBe(courtCategories[0]);
      expect(scope.selectedRateType).toBe('SUBSCRIPTIONRATEPERIOD');
      expect(mockRESTRate.getAll.callCount).toBe(2);
      expect(mockRESTSubscriptionRatePeriod.getAll.callCount).toBe(1);
    });

    it('should populate rate form with a new rate when showRateForm is called with null parameter', function() {
      createMocks();
      mockRESTCourtCategory.getAll.andReturn([{id: 1, name: 'tennis'}]);
      mockRESTRate.getAll.andReturn([]);

      createController();
      scope.initVariables([{id: 1, name: 'tennis'}]);
      scope.showRateForm(null);

      expect(scope.displayRateForm).toBeTruthy();
      expect(scope.formRate.id).toBeNull();
      expect(scope.formRate.name).toBe('');
      expect(scope.formRate.cUserGroupIds.length).toBe(0);
    });

    it('addUserGroupToRate adds group to rate if not yet present', function() {
      createMocks();
      createController();

      scope.formRate = {};
      scope.formRate.cUserGroupIds = [1,2];
      scope.addUserGroupToRate({id: 3, name:'label'});

      expect(scope.formRate.cUserGroupIds).toEqual([1,2,3]);
    });

    it('addUserGroupToRate adds group not to rate if yet present', function() {
      createMocks();
      createController();

      scope.formRate = {};
      scope.formRate.cUserGroupIds = [1,2];
      scope.addUserGroupToRate({id: 2, name:'label'});

      expect(scope.formRate.cUserGroupIds).toEqual([1,2]);
    });

    it('removeUserGroupFromRate removes group to rate if present', function() {
      createMocks();
      createController();

      scope.formRate = {};
      scope.formRate.cUserGroupIds = [1,2,3];
      scope.removeUserGroupFromRate(2);

      expect(scope.formRate.cUserGroupIds).toEqual([1,3]);
    });

    it('removeUserGroupFromRate removes group not to rate if not present', function() {
      createMocks();
      createController();

      scope.formRate = {};
      scope.formRate.cUserGroupIds = [1,3];
      scope.removeUserGroupFromRate(2);

      expect(scope.formRate.cUserGroupIds).toEqual([1,3]);
    });

    it('getUserGroupName return correct name if id present', function() {
      createMocks();
      createController();

      scope.userGroups = [{id: 1, name: 'tennis'}, {id: 2, name: 'tischtennis'}];
      var result = scope.getUserGroupName(2);

      expect(result).toEqual("tischtennis");
    });

    it('getUserGroupName returns UNKNOWN if id not present', function() {
      createMocks();
      createController();

      scope.userGroups = [];
      var result = scope.getUserGroupName(2);

      expect(result).toEqual("UNKNOWN");
    });

  });

});
