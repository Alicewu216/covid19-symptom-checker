'use strict';

function isEmpty(value) {
    return angular.isUndefined(value) || value === '' || value === null || value !== value;
}

//var _APIBaseURL = ""; // 'http://api.endlessmedical.com/v1/dx/';
var _APIBaseURL = window.location.protocol + '//api.endlessmedical.com/v1/dx/';

// Declare app level module which depends on viewSurvey, and components
angular.module('myApp', [
  //'ngRoute',
  //'ui.bootstrap',
  'ui', // potrzebny do filtra unique, 29.07.2017
  'ngMaterial'
])
    .controller('AppController'
    , ['$scope', '$http', '$timeout', '$interval', '$q', '$log', '$mdDialog', '$mdSidenav', '$mdToast'
        , function($scope, $http, $timeout, $interval, $q, $log, $mdDialog, $mdSidenav, $mdToast ) {
        
        var self = this;

        $scope.ctrl2 = {};
        self.usersymptoms = []; // na poczatek pusta lista, potem z child-controllera (RightSideNav) bedzie uzueplniana
        self.TopDiseasesResult = [];
        self.VariableImportancesResult = [];
        self.bUseDefaultValues = null;
        // uzupelniane w DisplaySuggestedTests() :
        self.last_suggested_tests = [];

        self.fnObjKeys = function (obj) { return Object.keys(obj); }
        self.fnObjValues = function (obj) { return Object.values(obj); }

        self.simulateQuery = false;
        
        self.querySearch   = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange   = searchTextChange;

        self.dictCategoryColor = {};
        self.dictCategoryColor["Constitutional and vital signs exam"] = "#cceeff";
        self.dictCategoryColor["Constitutional & General ROS"] = "#aaeeff";
        self.dictCategoryColor["HEENT ROS"] = "#dd77ee";
        self.dictCategoryColor["Genitourinary ROS"] = "#aa88ff";
        self.dictCategoryColor["Gastrointestinal ROS"] = "#DD5577";
        self.dictCategoryColor["Cardiovascular ROS"] = "#22ee88";
        self.dictCategoryColor["Respiratory ROS"] = "eedd33";
        self.dictCategoryColor["Skin ROS"] = "orange";


        $scope.fn_Load = function () {
            //$log.info('in fn_Load');
            InitializeSessionIfNecessary();
        };

        // normally Object is a part of window/global and is not visible to angular, thus this:
        self.UtilFuncs = {
                keys : Object.keys,
                values : Object.values
            };

        $scope.toggleRight = buildToggler('rightSidenav');
        self.toggleRight = $scope.toggleRight;
        self.bRightPaneAlreadyOpened = false;

        function buildToggler(navID) {
            return function() {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        //$log.debug("toggle " + navID + " is done");
                    });
            }
        }

        $scope.fnTestEditSymptom = function(symptom_idx) {
            $mdSidenav('rightSidenav').open();

            self.ctrl2.selectedItemChange(self.usersymptoms[symptom_idx]);
        }

        $scope.fnDeleteSymptom = function(symptom_idx){
            var removed_symptom = self.usersymptoms.splice(symptom_idx, 1)[0];

            // zmien wszystkie .listSymptomsIndex z indexem po usunietym symptomie na listSymptomsIndex-1
            for (var i = symptom_idx; i < self.usersymptoms.length; i++)
            {
                self.usersymptoms[i].listSymptomsIndex -= 1;
            }

            // wysylamy message na serwer ze symptom usuniety
            DeleteSymptom(removed_symptom);
        }

        /**
         * Search for states... use $timeout to simulate
         * remote dataservice call.
         */
        function querySearch (query) {
            var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
                deferred;
            if (self.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }
        function searchTextChange(text) {
            //$log.info('Text changed to ' + text);
        };
        function selectedItemChange(item) {
            //$log.info('Item changed to ' + JSON.stringify(item));

            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Item changed')
                    .content('Item changed to ' + JSON.stringify(item) )
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
                    //.targetEvent(ev)
            );
        };

        self.bTermsAccepted = false;

        function AcceptTheTermsController($scope, $mdDialog, MyMainController) {
            $scope.fnAccept = function() {
                $mdDialog.hide();

                MyMainController.SendAcceptTheTermsPassphrase();
                
                //$scope.$parent.bTermsAccepted = true;
                MyMainController.bTermsAccepted = true;

                // wlaczamy panel Symptoms
                //setTimeout(function() { MyMainController.toggleRight(); }, 1800);

                // TODO - zamiast ustawic zmiennej wyslij na serwer ze AcceptTerms i wtedy z .then() ustaw bTermsAccepted = true
            };

            $scope.fnDecline = function() {
                $mdDialog.cancel();
            };
        }

        $scope.showAcceptTerms = function(ev) {
            // ?? http://stackoverflow.com/questions/31240772/passing-data-to-mddialog

            var confirm = $mdDialog.confirm({
                // locals:{dataToPass: _dataToPass}, //here where we pass our data
                // locals: {
                //    callback: $scope.yourFunction // create the function  $scope.yourFunction = function (yourVariable) {
                //},
                // controllerAs: ...
                controller: AcceptTheTermsController,
                templateUrl: 'dialogAcceptTerms.tmpl.html',
                resolve: {
                    MyMainController: function() {return self;}
                },
                parent: angular.element(document.body),
                //escapeToClose: true,
                //parent(angular.element(document.querySelector('#popupContainer')))
                targetEvent: ev
            });

            $mdDialog.show(confirm)
            .then(function(answer) {
                // alert("confirmed: " + answer);
            });
        };

        var originatorEv;
        this.openMenu = function ($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        this.closeMenu = function ()
        {
            $mdMenu.hide();
        };
        
        // Create filter function for a query string
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };
        }

        // I toggle between the two different subviews.
        $scope.toggleSubview = function() {
            if ( $scope.subview === "before" ) {
                $scope.subview = "after";
            } else {
                $scope.subview = "before";
            }
        };


        var _SessionIDToken = null; // SessionID

        function InitializeSessionIfNecessary()
        {
            if (null != _SessionIDToken)
                return;

            var config = {
                headers: {
                    //'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
                    //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                    'Accept': 'application/json'
                }
            }; 

            $http.get(_APIBaseURL + "InitSession", config)
                .then(function(result) {
                    if (result.data.status == 'ok') {
                        _SessionIDToken = result.data.SessionID;

                        // pobranie wartosci UseDefaultValues
                        $http.get(_APIBaseURL + "GetUseDefaultValues?SessionID=" + _SessionIDToken)
                            .then(function(result) {
                                if (result.data.status == 'ok')
                                    self.bUseDefaultValues = result.data.value;
                            }, function(error) {
                                $log.info('error while fetching UseDefaultValues: ', error);
                            });

                        $scope.showAcceptTerms();
                    }

                    DisplayAPIResponse(result);

                }, function(error) {
                    $log.info("error while querying API: " + error);
                });
        }


        self.SendAcceptTheTermsPassphrase = SendAcceptTheTermsPassphrase;

        function SendAcceptTheTermsPassphrase()
        {
            var strPassphrase = "I have read, understood and I accept and agree to comply with the Terms of Use of EndlessMedicalAPI and Endless Medical services. The Terms of Use are available on endlessmedical.com";

            var config = {
                method: 'POST',
                url: _APIBaseURL + "AcceptTermsOfUse?" + "SessionID=" + _SessionIDToken + "&passphrase=" + strPassphrase,
                headers: {
                    //'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
                    //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                    // 'Content-Type': 'text/plain;charset=UTF-8' //'application/x-www-form-urlencoded'
                    'Content-Type': 'text/json;charset=UTF-8',
                    'Accept': 'application/json'
                },
            };

            $http(config)
                .then(function(result) {

                    if (result.data.status == 'ok') {
                        // ...
                    }
                    else if (result.data.status == 'error') {

                    }

                    DisplayAPIResponse(result);

                }, function(error) {
                    $log.info("error while querying API: " + error);
                });

        }

        // do updatowania symptomow z RightSideNavCtrl:
        self.UpdateSymptomValue = UpdateSymptomValue;

        function UpdateSymptomValue(symptom)
        {
            var config = {
                method: 'POST',
                url: _APIBaseURL + "UpdateFeature?" + "SessionID=" + _SessionIDToken + "&name=" + symptom.name + "&value=" + symptom.value,
                headers: {
                    //'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
                    //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                    // 'Content-Type': 'text/plain;charset=UTF-8' //'application/x-www-form-urlencoded'
                    'Content-Type': 'text/json;charset=UTF-8',
                    'Accept': 'application/json'
                },
            };

            $http(config)
                .then(function(result) {

                    if (result.data.status == 'ok') {
                        setTimeout( DisplaySuggestedTests(), 1000 ); // 10.08.2019
                    }
                    else if (result.data.status == 'error') {

                    }

                    DisplayAPIResponse(result);

                }, function(error) {
                    $log.info("error while querying API: " + error);
                });

        }

        self.DoGetSuggestedFeatures_PatientProvided = DoGetSuggestedFeatures_PatientProvided;

        function DoGetSuggestedFeatures_PatientProvided()
        {
            return $http({
                method: 'GET',
                url: _APIBaseURL + "GetSuggestedFeatures_PatientProvided?SessionID=" + _SessionIDToken,
                headers: { 'Accept': 'application/json' }
            }); 
        }

        self.DoGetSuggestedFeatures_PhysicianProvided = DoGetSuggestedFeatures_PhysicianProvided;

        function DoGetSuggestedFeatures_PhysicianProvided()
        {
            return $http({
                method: 'GET',
                url: _APIBaseURL + "GetSuggestedFeatures_PhysicianProvided?SessionID=" + _SessionIDToken,
                headers: { 'Accept': 'application/json' }
            }); 
        }

        self.DoGetSuggestedFeatures_Tests = DoGetSuggestedFeatures_Tests;

        function DoGetSuggestedFeatures_Tests()
        {
            return $http({
                method: 'GET',
                url: _APIBaseURL + "GetSuggestedFeatures_Tests?SessionID=" + _SessionIDToken,
                headers: { 'Accept': 'application/json' }
            }); 
        }

        self.DoGetSuggestedSpecializations = DoGetSuggestedSpecializations;

        function DoGetSuggestedSpecializations()
        {
            return $http({
                method: 'GET',
                url: _APIBaseURL + "GetSuggestedSpecializations?SessionID=" + _SessionIDToken,
                headers: { 'Accept': 'application/json' }
            }); 
        }

        self.DisplaySuggestedTests = DisplaySuggestedTests;

        function DisplaySuggestedTests()
        {
            var config = {
                method: 'GET',
                url: _APIBaseURL + "GetSuggestedTests?SessionID=" + _SessionIDToken,
                headers: {
                    //'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
                    //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                    // 'Content-Type': 'text/plain;charset=UTF-8' //'application/x-www-form-urlencoded'
                    'Accept': 'application/json'
                },
            };

            $http(config)
                .then(function(result) {
                    if (result.data.status == 'ok') {

                        self.last_suggested_tests = result.data.Tests;

                        $scope.$parent.suggested_tests_toast_data = result.data.Tests;
                        $scope.$parent.fnObjKeys = self.fnObjKeys;
                        $scope.$parent.fnObjValues = self.fnObjValues;

                        $mdToast.show({
                            capsule     : true,
                            hideDelay   : 5000,
                            position    : 'bottom right',
                            templateUrl : 'toast-template-tests.html',
                            //locals: {
                            //    data: result
                            //}
                          });
                    }
                    else if (result.data.status == 'error') {

                    }

                }, function(error) {
                    $log.info("error while querying API: " + error);
                });

        }


        function DeleteSymptom(symptom)
        {
            var config = {
                method: 'POST',
                url: _APIBaseURL + "DeleteFeature?SessionID=" + _SessionIDToken + "&name=" + symptom.name,
                headers: {
                    //'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
                    //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                    // 'Content-Type': 'text/plain;charset=UTF-8' //'application/x-www-form-urlencoded'
                    'Accept': 'application/json'
                },
                //data: '{"type": "DeleteSymptom", "SessionID": "' + _SessionIDToken + '", "data": {"' + symptom.name + '":"' + symptom.value + '"}}'
            };

            $http(config)
                .then(function(result) {

                    if (result.data.status == 'ok') {

                    }
                    else if (result.data.status == 'error') {

                    }

                    DisplayAPIResponse(result);

                }, function(error) {
                    console.log('error fetching http: ', error);
                    alert("error fetchin httppp");
                });

        }

        self.DoAnalyze2 = DoAnalyze2;

        function DoAnalyze2(symptom)
        {
            var config = {
                method: 'GET',
                url: _APIBaseURL + "Analyze?SessionID=" + _SessionIDToken,
                headers: {
                    //'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
                    //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                    // 'Content-Type': 'text/plain;charset=UTF-8' //'application/x-www-form-urlencoded'
                    'Accept': 'application/json'
                },
                //data: '{"type": "Analyze", "SessionID": "' + _SessionIDToken + '"}'
            };

            $http(config)
                .then(function(result) {

                    if (result.data.status == 'ok') {
                        self.TopDiseasesResult = result.data.Diseases;
                        self.VariableImportancesResult = result.data.VariableImportances;
                    }
                    else if (result.data.status == 'error') {

                    }

                    document.getElementById('ifDetails').contentDocument.body.innerHTML = JSON.stringify( result.data );

                    // in Analyze this is required if diseases are displayed as collapsible with variable importances
                    $timeout(function() {
                        $scope.$evalAsync(function() { window.UpdateCollapsible(); } );
                        }, 100);
                    
                    DisplayAPIResponse(result);
                }, function(error) {
                    console.log('error fetching http: ', error);
                    alert("error fetchin httppp");
                });
        }


        function SuggestedNextStepsController($scope, $mdDialog, MyMainController) {

            var self = this;

            // run at initialization, returns promise !!
            var SuggestedFeatures_PatientProvided = null;
            var SuggestedFeatures_PhysicianProvided = null;
            var SuggestedFeatures_Tests = null;
            var SuggestedSpecializations = null;

            function initialize() {
                MyMainController.DoGetSuggestedFeatures_PatientProvided()
                    .then(function (result) { self.SuggestedFeatures_PatientProvided = result; });

                MyMainController.DoGetSuggestedFeatures_PhysicianProvided()
                    .then(function (result) { self.SuggestedFeatures_PhysicianProvided = result; });

                MyMainController.DoGetSuggestedFeatures_Tests()
                    .then(function (result) { self.SuggestedFeatures_Tests = result; });

                MyMainController.DoGetSuggestedSpecializations()
                    .then(function (result) { self.SuggestedSpecializations = result; });
            }

            initialize();

            $scope.fnClose = function() {
                $mdDialog.hide(); // show-hide, confirm-cancel
                $mdDialog.hide(); // second time to close b/c of focus issue
            };
        }

        self.DisplaySuggestedNextStepsDialog = DisplaySuggestedNextStepsDialog;

        function DisplaySuggestedNextStepsDialog(symptom)
        {
            var dlgNextSteps = $mdDialog.show({
                // locals:{dataToPass: _dataToPass}, //here where we pass our data
                // locals: {
                //    callback: $scope.yourFunction // create the function  $scope.yourFunction = function (yourVariable) {
                //},
                // controllerAs: ...
                controller: SuggestedNextStepsController,
                controllerAs: 'ctrlNextSteps',
                templateUrl: 'dialogSuggestedNextSteps.tmpl.html',
                resolve: {
                    MyMainController: function() {return self;}
                },
                parent: angular.element(document.body),
                //escapeToClose: true,
                //parent(angular.element(document.querySelector('#popupContainer')))
                // ??? targetEvent: ev
                bindToController: true,
                clickOutsideToClose: true,
                escapeToClose: true
            });

            $mdDialog.show(dlgNextSteps)
                .then(function(answer) {
                    // alert("confirmed: " + answer);
                });
        }

        $scope.fnSetUseDefaultValues = function() {
            //console.log('in fnSetUseDefaultValues: ' + self.bUseDefaultValues);

            var config = {
                headers: {
                //'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
                //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                'Accept': 'application/json'
                }
            };

            // ustawienie wartosci UseDefaultValues
            $http.post(_APIBaseURL + "SetUseDefaultValues?SessionID=" + _SessionIDToken + "&value=" + self.bUseDefaultValues, "", config)
            .then(function(result) {
                //console.log("SetUseDefaultValues returned: " + JSON.stringify(result) );
            }, function(error) {
                console.log('error while setting UseDefaultValues: ', error);
            });

        };

        self.DisplayAPIResponse = DisplayAPIResponse;

        function DisplayAPIResponse(result)
        {
            $mdToast.show(
                $mdToast.simple()
                    .textContent("Received Http Response: " + JSON.stringify( result.data ) )
                    .position( 'bottom right')
                    .hideDelay(5000)
            );
        }
        
    }])
    .controller('RightSideNavCtrl', function ($scope, $timeout, $mdSidenav, $log, $http) {

        var self = this;
        $scope.$parent.ctrl.ctrl2 = this;

        $scope.close = function () {
            $mdSidenav('rightSidenav').close()
                .then(function () {
                    //$log.debug("close RIGHT is done");
                });
            
            self.selectedItem = null;
            self.searchText = null;
            self.selectedItemCopy = null;
        };

        $scope.AddSymptom = function () {
            if (self.selectedItemCopy.bIsCreated == true)
            {
                // tryb edycji
                //$scope.$parent.ctrl.usersymptoms[self.selectedItemCopy.listSymptomsIndex] = self.selectedItemCopy;
                // gdy podmieniamy caly obiekt to angular przebudowuje caly DOM i collapsible ma problem
                // jak tylko zmieniamy .value, to dobrze aktualizuje wartosc i nie przebudowuje calego DOM !!!:
                $scope.$parent.ctrl.usersymptoms[self.selectedItemCopy.listSymptomsIndex].value = self.selectedItemCopy.value;
            }
            else {
                // sprawdzamy czy juz przypadkiem taki symptom nie istnieje:
                var iArrLen = $scope.$parent.ctrl.usersymptoms.length, kk;
                var bItemAlreadyFound = false;

                for (kk = 0; kk < iArrLen; kk++)
                {
                    if ($scope.$parent.ctrl.usersymptoms[kk].name == self.selectedItemCopy.name)
                    {
                        self.selectedItemCopy.listSymptomsIndex = kk;
                        self.selectedItemCopy.bIsCreated = true;
                        $scope.$parent.ctrl.usersymptoms[kk] = self.selectedItemCopy;
                        bItemAlreadyFound = true;
                    }
                }

                if (false == bItemAlreadyFound) {
                    // tryb dodania nowego elementu
                    self.selectedItemCopy.bIsCreated = true; // znacznik ze juz ten item istnieje
                    self.selectedItemCopy.listSymptomsIndex = $scope.$parent.ctrl.usersymptoms.length;

                    $scope.$parent.ctrl.usersymptoms.push(self.selectedItemCopy);
                }
            }

            // update symptom on the server through parent controller
            try {
                $scope.$parent.ctrl.UpdateSymptomValue( angular.copy(self.selectedItemCopy) );
            }
            catch (e)
            {
                console.log('exception while updating symptom value: ' + e.message);
            }

            self.selectedItem = null;
            self.searchText = null;
            self.selectedItemCopy = null;

            // $('.collapsible').collapsible();
            //window.UpdateCollapsible();

            //$scope.$evalAsync(function() { window.UpdateCollapsible(); } );
            // dopiero timeout + $evalAsync dziala!!!
            // sam $evalAsync powoduje ze w funkcji collapsible() nie znajduje var $panel_headers = $(this).find('> li > .collapsible-header');
            // .length == 0 wtedy, dopiero z $timeout dziala
            $timeout(function() {
                $scope.$evalAsync(function() { window.UpdateCollapsible(); } );
                }, 100);

        };

        $scope.testfun = function() {alert('test');}

        // http://codepen.io/adnan-i/pen/gLtap

        self.symptoms = loadSymptoms();
        // self.diseases == undefined .. dlatego laduje drugi raz ??

        function loadSymptoms() {
            //return [];
            //return $http.get('SymptomsOutput.json') //'symptoms.json')
            return $http.get('../SymptomsOutput.json') //'symptoms.json')
                .then(function (res) {
                    //$scope.todos = res.data;
                    //self.diseases = res.data;
                    //$scope.diseases = self.diseases;
                    //$log.debug('jsonrecv: ' + JSON.stringify(res.data));

                    return res.data;
                });
        };

        self.querySearchSymptoms  = querySearchSymptoms;
        self.selectedItemChange = selectedItemChange;
        self.selectedItemCopy = null;
        self.searchTextChange   = searchTextChange;

        function querySearchSymptoms (query) {
            /*
            // tryb z zewnetrzengo URL-a:
            //return $http.get('http://datamining.solutions/remoteAutoCompleteDiseases.php?q=' + query).then(function(response){
            return $http.get('http://vps209117.ovh.net/LukiApp/remoteAutoCompleteDiseases.php?q=' + query).then(function(response){
                return response.data; // usually response.data
            });
            */

            //*
            //var results = query ? self.diseases.filter( createFilterFor(query) ) : self.diseases,
            //    deferred;
            // najpierw konwertujemy do javascript Array:
            var arrSymptoms = self.symptoms.$$state.value;//Object.keys(self.diseases).map(function(k) { return self.diseases[k] })[0];
            var results = query ? arrSymptoms.filter( createFilterFor(query) ) : arrSymptoms; //,
                //deferred;
            // $scope.$parent.ctrl.usersymptoms.findIndex(elem => elem.name == item.name)

            // var aaa = $scope.$parent.ctrl.last_suggested_tests;

            //*/

            /*if (self.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }*/
            return results;
        };
        function searchTextChange(text) {
            //$log.info('Text changed to ' + text);
        };
        function selectedItemChange(item) {
            $log.info('Item changed to ' + JSON.stringify(item));

            //if (-item.bIsCreated == true) // zmien nazwe buttona na Edit
            // else - na Add Disease

            self.selectedItemCopy = angular.copy(item);

            // ustawianie default value:
            if (null != self.selectedItemCopy && null == self.selectedItemCopy.value)
                self.selectedItemCopy.value = self.selectedItemCopy.default;
        };

        // Create filter function for a query string
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            // symptom odpowiada tu typowi z symptoms.json
            return function filterFn(symptom) {
                //return (angular.lowercase(symptom.text).indexOf(lowercaseQuery) >= 0); // === 0);

                return (
                    angular.lowercase(symptom.text).indexOf(lowercaseQuery) >= 0
                    || ( symptom.alias && angular.lowercase(symptom.alias).indexOf(lowercaseQuery) >= 0 )
                    || ( symptom.choices
                        && symptom.choices.some( function(elem, idx) {
                                return elem.humanlang && angular.lowercase(elem.humanlang).indexOf(lowercaseQuery) >= 0
                            } )
                        )
                    );
               
            };
        };

    })
    .directive('ngRightClick', function($parse) {
        return function(scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function(event) {
                scope.$apply(function() {
                    event.preventDefault();
                    fn(scope, {$event:event});
                });
            });
        };
    })
    .directive('ngMin', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attr, ctrl) {
                scope.$watch(attr.ngMin, function () {
                    ctrl.$setViewValue(ctrl.$viewValue);
                });
                var minValidator = function (value) {
                    var min = scope.$eval(attr.ngMin) || 0;
                    if (!isEmpty(value) && value < min) {
                        ctrl.$setValidity('ngMin', false);
                        return undefined;
                    } else {
                        ctrl.$setValidity('ngMin', true);
                        return value;
                    }
                };

                ctrl.$parsers.push(minValidator);
                ctrl.$formatters.push(minValidator);
            }
        };
    })
    .directive('ngMax', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attr, ctrl) {
                scope.$watch(attr.ngMax, function () {
                    ctrl.$setViewValue(ctrl.$viewValue);
                });
                var maxValidator = function (value) {
                    var max = scope.$eval(attr.ngMax) || Infinity;
                    if (!isEmpty(value) && value > max) {
                        ctrl.$setValidity('ngMax', false);
                        return undefined;
                    } else {
                        ctrl.$setValidity('ngMax', true);
                        return value;
                    }
                };

                ctrl.$parsers.push(maxValidator);
                ctrl.$formatters.push(maxValidator);
            }
        };
    })
;
