$(document).ready(function(){

    baseURL ="https://endlessmedicalapi1.p.rapidapi.com/";

    var initSessionID = baseURL + "/InitSession";
    
    function getFeatures() {
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://endlessmedicalapi1.p.rapidapi.com/GetFeatures",
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
            "url": "https://endlessmedicalapi1.p.rapidapi.com/GetOutcomes",
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

    function analyze(sessionID) {
        var analyze = baseURL + "/Analyze?SessionID=" + sessionID;
        console.log(analyze);
    }

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
        //console.log(response);
        var sessionID = response.SessionID;
        console.log(sessionID);

        //termsOfAgreement(sessionID);
        analyze(sessionID);
        getOutcomes();
        getFeatures();
    });



    
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
    
    function updateFeature(sessionID){
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://endlessmedicalapi1.p.rapidapi.com/UpdateFeature?SessionID=" + sessionID+ "&name=" + name + "&value=" + age,
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

    });


