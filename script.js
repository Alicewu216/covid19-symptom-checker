$(document).ready(function () {
  var queryURL = "http://api.endlessmedical.com/v1/dx/";

  var symptom = [];

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

    $(".button.submit-btn.is-info").on("click", function() {
        console.log("analyze clicked");
        updateFeature();
        analyze();
    });

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
            
            deleteFeature();
            getSuggestedTests();
            getSuggestedSpecializations();
            getSuggestedFeatures_PatientProvided();
            getSuggestedFeatures_PhysicianProvided();
            getSuggestedFeatures_Tests();
            
            //loadSymptoms();
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
    for (var k = 0; k < symptom.length; k++) {
        $.ajax({
            url: queryURL + "UpdateFeature?" + "SessionID=" + sessionID + "&name=" + symptom[k].name + "&value=" + symptom[k].value,
            method: "POST"
        })
        .then(function (response) {
            console.log("This is a console log for updateFeature: ");
            console.log(response);
            /*
            if (result.data.status == 'ok') {
            setTimeout( DisplaySuggestedTests(), 1000 ); // 10.08.2019
            }
            else if (result.data.status == 'error') {

            }
            */
        });
    }
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

}


function getSuggestedTests () {

    $.ajax({
        url: queryURL + "GetSuggestedTests?SessionID=" + sessionID + "&TopDiseasesToTake=10",
        method: "GET"
    })
    .then(function(response){
        console.log("This is a console log for getSuggestedTests: ");
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

    $.getJSON( "../Assests/SymptomsOutput.json", function( json ) {
        console.log( json );
       });
}


});



