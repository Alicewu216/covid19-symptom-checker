$(document).ready(function(){

    baseURL ="https://endlessmedicalapi1.p.rapidapi.com/";

    var initSessionID = baseURL + "InitSession";
    
    topDiseasesResult = [];
    variableImportancesResult = [];

    function getFeatures() {
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": baseURL + "GetFeatures",
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "b5e515e4efmshf7f7cf9142dd41ep17f3ebjsn9d08a632e406",
                "x-rapidapi-host": "endlessmedicalapi1.p.rapidapi.com"
            }
        };
        
        $.ajax(settings).then(function (response) {
            console.log(response);
        });
    }

    function getOutcomes () {
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": baseURL + "GetOutcomes",
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "b5e515e4efmshf7f7cf9142dd41ep17f3ebjsn9d08a632e406",
                "x-rapidapi-host": "endlessmedicalapi1.p.rapidapi.com"
            }
        };
        
        $.ajax(settings).done(function (response) {
            console.log(response);
        });
    }

    var sessionID = null; // SessionID

    function InitializeSessionIfNecessary()
    {
        if (null != sessionID)
            return;


            $.ajax({
                async: true,
                crossDomain: true,
                url: initSessionID,
                method: "GET",
                headers: {
                    "x-rapidapi-key": "b5e515e4efmshf7f7cf9142dd41ep17f3ebjsn9d08a632e406",
                    "x-rapidapi-host": "endlessmedicalapi1.p.rapidapi.com"
                }
            }).then(function(response){
                if (response.status == 'ok'){
                //console.log(response);
                var sessionID = response.SessionID;
                console.log(sessionID);
        
                //termsOfAgreement(sessionID);
                analyze(sessionID);
                getOutcomes();
                getFeatures();
                }
            });
        
    }
    
    InitializeSessionIfNecessary();

    
    function updateFeature(symptom){
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://endlessmedicalapi1.p.rapidapi.com/UpdateFeature?SessionID=" + sessionID + "&name=" + symptom.name + "&value=" + symptom.value,
            "method": "POST",
            "headers": {
                "x-rapidapi-key": "b5e515e4efmshf7f7cf9142dd41ep17f3ebjsn9d08a632e406",
                "x-rapidapi-host": "endlessmedicalapi1.p.rapidapi.com"
            }
        };
        
        $.ajax(settings).done(function (response) {
            console.log(response);
            if (result.data.status == 'ok') {
                setTimeout( DisplaySuggestedTests(), 1000 ); // 10.08.2019
            }
            else if (result.data.status == 'error') {

            }
        });
    }

    function DeleteSymptom(symptom)
    {
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://endlessmedicalapi1.p.rapidapi.com/DeleteFeature",
            "method": "POST",
            "headers": {
                "x-rapidapi-key": "b5e515e4efmshf7f7cf9142dd41ep17f3ebjsn9d08a632e406",
                "x-rapidapi-host": "endlessmedicalapi1.p.rapidapi.com"
            }
        };
        
        $.ajax(settings).done(function (response) {
            console.log(response);
        });
    }

    function analyze(symptom) {
        var analyze = baseURL + "/Analyze?SessionID=" + sessionID;
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": analyze,
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "b5e515e4efmshf7f7cf9142dd41ep17f3ebjsn9d08a632e406",
                "x-rapidapi-host": "endlessmedicalapi1.p.rapidapi.com"
            }
        };
        
        $.ajax(settings).done(function (response) {
            console.log(response);
            if (result.data.status == 'ok') {
                self.TopDiseasesResult = result.data.Diseases;
                self.VariableImportancesResult = result.data.VariableImportances;
            }
            else if (result.data.status == 'error') {

            }

            document.getElementById('ifDetails').contentDocument.body.innerHTML = JSON.stringify( result.data );
        });
    }
    

    /*
    function termsOfAgreement(sessionID) {
        var acceptTerms = baseURL + "AcceptTermsOfUse?SessionID=" + sessionID + "&passphrase=I%20have%20read%2C%20understood%20and%20I%20accept%20and%20agree%20to%20comply%20with%20the%20Terms%20of%20Use%20of%20EndlessMedicalAPI%20and%20Endless%20Medical%20services.%20The%20Terms%20of%20Use%20are%20available%20on%20endlessmedical.com"
        console.log(acceptTerms);
        $.ajax({
            async: true,
            crossDomain: true,
            url: acceptTerms,
            method: "POST",
            success: function(data){
                alert(data);
            }
        })
    };
    */



    });




    /* Age, Chills, HistoryFever, */