var _APIBaseURL = "https://endlessmedicalapi1.p.rapidapi.com/"

var self = this;

var _SessionIDToken = null; // SessionID

function InitializeSessionIfNecessary()
{
    if (null != _SessionIDToken)
        return;

    var config = {
        async: true,
        crossDomain: true,
        //url: _APIBaseURL + "InitSession",
        method: "GET",
        headers: {
            "x-rapidapi-key": "b5e515e4efmshf7f7cf9142dd41ep17f3ebjsn9d08a632e406",
            "x-rapidapi-host": "endlessmedicalapi1.p.rapidapi.com"
        }
    }; 

    $.ajax(_APIBaseURL + "InitSession", config)
        .then(function(result) {
            console.log(result);
            if (result.status == 'ok') {
                _SessionIDToken = result.SessionID;

                console.log(_SessionIDToken);

            }

        });
}

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

    $.ajax(config)
        .then(function(result) {

            if (result.status == 'ok') {

            }
            else if (result.status == 'error') {

            }

        });

}

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

InitializeSessionIfNecessary();
//SendAcceptTheTermsPassphrase();
//UpdateSymptomValue();
//DisplaySuggestedTests();