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
<<<<<<< HEAD
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
=======
        
    ];
    

    topDiseasesResult = [];
    variableImportancesResult = [];

    function getFeatures() {
        $.ajax({
            url: queryURL + "GetFeatures",
            method: "GET"
        })

        .then(function(response){
            console.log("This is a console log for getFeatures: ")
            console.log(response);
        });
    };

    getFeatures();

    function getOutcomes () {
        $.ajax({
            url: queryURL + "GetOutcomes",
            method: "GET"
        })

        .then(function(response){
            console.log("This is a console log for getOutcomes: ")
            console.log(response);
        });
    }

    getOutcomes();
   
   

    var sessionID = null; // SessionID
    //var useDefaultValues = null;

    function InitializeSessionIfNecessary()
    {
        if (null != sessionID)
            return;

            $.ajax({
                url: queryURL + "InitSession",
                method: "GET"
            })
            .then(function(response){
                if (response.status == 'ok'){

                // Response for InitSession is console logged here.
                console.log(response);
                //Session ID is stored here.
                sessionID = response.SessionID;
                //Session ID is console logged here.
                console.log("This is the session ID: " + sessionID);
                

                }
                termsOfAgreement(sessionID);
                getUseDefaultValues ();
                setUseDefaultValues();
                updateFeature();
                //deleteFeature();
                getSuggestedTests();
                getSuggestedSpecializations();
                getSuggestedFeatures_PatientProvided();
                getSuggestedFeatures_PhysicianProvided();
                getSuggestedFeatures_Tests();
                analyze();
                loadSymptoms();
            });
        
    };

    InitializeSessionIfNecessary();

    function termsOfAgreement(sessionID) {

        var strPassphrase = "I have read, understood and I accept and agree to comply with the Terms of Use of EndlessMedicalAPI and Endless Medical services. The Terms of Use are available on endlessmedical.com";

        
        $.ajax({
            url: queryURL + "AcceptTermsOfUse?" + "SessionID=" + sessionID + "&passphrase=" + strPassphrase, 
            method: "POST"
        })
        .then(function(response){
            console.log("This is a console log for termsOfAgreement: ")
            console.log(response);
        })
    };

    function getUseDefaultValues () {
        //AJAX call for the default values
        $.ajax({
             url: queryURL + "GetUseDefaultValues?SessionID=" + sessionID,
             method: "GET"
        })
        .then(function(response){
            if (response.status == 'ok')
                console.log("AJAX resonse for getUseDefaultValues: " );
                console.log(response);             
        })

        
    }

    function setUseDefaultValues (){

        $.ajax({
            url: queryURL + "SetUseDefaultValues?SessionID=" + sessionID + "&value=true",
            method: "POST"
        })
        .then(function(response){
            console.log("This is a console log for setUseDefaultValues: ");
            console.log(response);
        })
    }

    function updateFeature(){

        $.ajax({
            url: queryURL + "UpdateFeature?" + "SessionID=" + sessionID + "&name=" + symptom[0].name + "&value=" + symptom[0].value,
            method: "POST"
>>>>>>> b0dacc6e03f76aa3e3c223b70d686f5084005fa8
        })
        .then(function (response) {
            console.log("This is a console log for updateFeature: ");
            console.log(response);
            /*
            if (result.data.status == 'ok') {
            setTimeout( DisplaySuggestedTests(), 1000 ); // 10.08.2019
            }
            else if (result.data.status == 'error') {

<<<<<<< HEAD
        }
        
=======
            }
            */
>>>>>>> b0dacc6e03f76aa3e3c223b70d686f5084005fa8
        });
    }

    function deleteFeature (){

        $.ajax({
            url: queryURL + "DeleteFeature?" + "SessionID=" + sessionID + "&name=" + symptom[0].name,
            method: "POST"
        })
        .then(function(response) {
            if (response.status == 'ok'){
            console.log("This is a console log for deleteFeature: ");
            console.log(response);
            }
            else if (response.status){
                console.log("deleteFeature Error")
            }
        })

<<<<<<< HEAD
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
=======
    }
    

    function getSuggestedTests () {

        $.ajax({
            url: queryURL + "GetSuggestedTests?SessionID=" + sessionID + "&TopDiseasesToTake=10",
            method: "GET"
        })
        .then(function(response){
            console.log("This is a console log for getSuggestedTests: ");
>>>>>>> b0dacc6e03f76aa3e3c223b70d686f5084005fa8
            console.log(response);
        })
    }

    function getSuggestedSpecializations () {

        $.ajax({
            url: queryURL + "GetSuggestedSpecializations?SessionID=" + sessionID + "&NumberOfResults=10",
            method: "GET"
        })
        .then(function(response){
            console.log("This is a console log for getSuggestedSpecializations: ");
            console.log(response);
        })
    }

    function getSuggestedFeatures_PatientProvided () {

        $.ajax({
            url: queryURL + "GetSuggestedFeatures_PatientProvided?SessionID=" + sessionID + "&TopDiseasesToTake=10",
            method: "GET"
        })
        .then(function(response){
            console.log("This is a console log for getSuggestedFeatures_PatientProvided: ");
            console.log(response);
        })
    }

    function getSuggestedFeatures_PhysicianProvided () {

        $.ajax({
            url: queryURL + "GetSuggestedFeatures_PhysicianProvided?SessionID=" + sessionID + "&TopDiseasesToTake=10",
            method: "GET"
        })
        .then(function(response){
            console.log("This is a console log for getSuggestedFeatures_PhysicianProvided: ");
            console.log(response);
        })
    }

    function getSuggestedFeatures_Tests () {

        $.ajax({
            url: queryURL + "GetSuggestedFeatures_Tests?SessionID=" + sessionID + "&TopDiseasesToTake=10",
            method:"GET"
        })
        .then(function(response){
            console.log("This is a console log for getSuggestedFeatures_Tests: ");
            console.log(response);
        })
    }

    function analyze () {

        $.ajax({
            url: queryURL + "Analyze?SessionID=" + sessionID + "NumberOfResults=10",
            method: "GET"
        })
        .then(function(response){
            console.log("This is a console log for the analyze function: ");
            console.log(response);

            if (response.status == 'ok') {
                topDiseasesResult = response.Diseases;
                variableImportancesResult = response.VariableImportances;
            }
        })
    }
    
    function loadSymptoms() {

<<<<<<< HEAD
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
=======
        $.getJSON( "../Assests/SymptomsOutput.json", function( json ) {
            console.log( json );
           });
    }


 });



>>>>>>> b0dacc6e03f76aa3e3c223b70d686f5084005fa8
