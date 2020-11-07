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

/*
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
            "x-rapidapi-key": "b5e515e4efmshf7f7cf9142dd41ep17f3ebjsn9d08a632e406",
            "x-rapidapi-host": "endlessmedicalapi1.p.rapidapi com",
            'Content-Type': 'text/json;charset=UTF-8',
            'Accept': 'application/json'
        },
    };

        $.ajax(config).done(function (response) {
            console.log(response);
        });
    };
*/

// self.UpdateSymptomValue = UpdateSymptomValue;

// function UpdateSymptomValue(symptom)
// {
//     var config = {
//         method: 'POST',
//         url: _APIBaseURL + "UpdateFeature?" + "SessionID=" + _SessionIDToken + "&name=" + symptom.name + "&value=" + symptom.value,
//         headers: {
//             //'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
//             //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
//             // 'Content-Type': 'text/plain;charset=UTF-8' //'application/x-www-form-urlencoded'
//             'Content-Type': 'text/json;charset=UTF-8',
//             'Accept': 'application/json'
//         },
//     };

//     $.ajax(config)
//         .then(function(result) {

            
//             // if (result.status == 'ok') {
//             //     setTimeout( DisplaySuggestedTests(), 1000 ); // 10.08.2019
//             // }
//             // else if (result.status == 'error') {

//             // }

//         });

// }

function DisplaySuggestedTests(_SessionIDToken)
{
    var config = {
        method: 'GET',
        url: _APIBaseURL + "GetSuggestedTests?SessionID=" + _SessionIDToken,
        headers: {
            //'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
            //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
            // 'Content-Type': 'text/plain;charset=UTF-8' //'application/x-www-form-urlencoded'
            "x-rapidapi-key": "b5e515e4efmshf7f7cf9142dd41ep17f3ebjsn9d08a632e406",
            "x-rapidapi-host": "endlessmedicalapi1.p.rapidapi.com",
            'Accept': 'application/json'
        },
    };

    $.ajax(config)
        .then(function(result) {

            console.log(result.data.status);

            //if (result.data.status == 'ok') {

                // self.last_suggested_tests = result.data.Tests;

                // $scope.$parent.suggested_tests_toast_data = result.data.Tests;
                // $scope.$parent.fnObjKeys = self.fnObjKeys;
                // $scope.$parent.fnObjValues = self.fnObjValues;

                // $mdToast.show({
                //     capsule     : true,
                //     hideDelay   : 5000,
                //     position    : 'bottom right',
                //     templateUrl : 'toast-template-tests.html',
                    //locals: {
                    //    data: result
                    //}
                  //});
            // }
            // else if (result.data.status == 'error') {

            // }
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


InitializeSessionIfNecessary();
//SendAcceptTheTermsPassphrase();
//UpdateSymptomValue();
DisplaySuggestedTests();