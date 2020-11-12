$(document).ready(function () {
  var queryURL = "http://api.endlessmedical.com/v1/dx/";

  var symptom = [{ name: "Chills", value: "Yes" }];

  var topDiseasesResult = [];
  var variableImportancesResult = [];

  $(".input")

  $(".field.is-grouped.is-grouped-multiline").on("click", ".button", function (
    event
  ) {
    var nameUser = $(event.target).prop("name");
    var valueUser = $(event.target).attr("namedata");
    if ($(event.target).hasClass("is-danger")) {
      $(event.target).removeClass("is-danger");
      for (var j = 0; j < symptom.length; j++) {
        if (symptom[j].name == nameUser) {
          symptom.splice(j, 1);
          console.log(symptom);
        }
      }
    } else {
      $(event.target).addClass("is-danger");

      symptom.push({ name: nameUser, value: valueUser });
      console.log(symptom);
    }
  });

  function getFeatures() {
    $.ajax({
      url: queryURL + "GetFeatures",
      method: "GET",
    }).then(function (response) {
      console.log(response);
    });
  }

  function getOutcomes() {
    $.ajax({
      url: queryURL + "GetOutcomes",
      method: "GET",
    }).then(function (response) {
      console.log(response);
    });
  }

  var sessionID = null; // SessionID

  function InitializeSessionIfNecessary() {
    if (null != sessionID) return;

    $.ajax({
      url: queryURL + "InitSession",
      method: "GET",
    }).then(function (response) {
      if (response.status == "ok") {
        console.log(response);
        var sessionID = response.SessionID;
        console.log(sessionID);

        termsOfAgreement(sessionID);
        getOutcomes();
        getFeatures();
      }
    });
  }

  InitializeSessionIfNecessary();

  function termsOfAgreement(sessionID) {
    var strPassphrase =
      "I have read, understood and I accept and agree to comply with the Terms of Use of EndlessMedicalAPI and Endless Medical services. The Terms of Use are available on endlessmedical.com";

    $.ajax({
      url:
        queryURL +
        "AcceptTermsOfUse?" +
        "SessionID=" +
        sessionID +
        "&passphrase=" +
        strPassphrase,
      method: "POST",
    }).then(function (response) {
      console.log(response);
    });
  }

  /*
    function updateFeature(){

        $.ajax({
        url: queryURL + "UpdateFeature?" + "SessionID=" + sessionID + "&name=" + symptom[0].name + "&value=" + symptom[0].value,
        method: "POST"
        })
        .then(function (response) {
        console.log(response);
        /*
        if (result.data.status == 'ok') {
            setTimeout( DisplaySuggestedTests(), 1000 ); // 10.08.2019
        }
        else if (result.data.status == 'error') {

        }
        
        });
    }

    $(".button").on("click", function(){

        updateFeature();

        });*/

  /*
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
                topDiseasesResult = result.data.Diseases;
                variableImportancesResult = result.data.VariableImportances;
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
