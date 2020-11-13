$(document).ready(function () {
  var queryURL = "https://api.endlessmedical.com/v1/dx/";

  var symptom = [];

  $(".button.save-age.is-info").on("click", function () {
    var ageUser = $("#user-input").val();
    symptom.push({ name: "Age", value: ageUser });
  });

  $(".field.is-grouped.is-grouped-multiline").on("click", ".button", function (
    event
  ) {
    var nameUser = $(event.target).prop("name");
    var valueUser = $(event.target).attr("namedata");
    if ($(event.target).hasClass("is-danger")) {
      $(event.target).removeClass("is-danger");
      for (var j = 0; j < symptom.length; j++) {
        if (symptom[j].name == nameUser) {
          deleteFeature();
          symptom.splice(j, 1);
          console.log(symptom);
        }
      }
    } else {
      $(event.target).addClass("is-danger");
      symptom.push({ name: nameUser, value: valueUser });
      //updateFeature();
    //   console.log(symptom);
    }
  });

  $(".button.submit-btn.is-info").on("click", function () {
    console.log("analyze clicked");
    updateFeature();
    analyze();
  });

  function getFeatures() {
    $.ajax({
      url: queryURL + "GetFeatures",
      method: "GET",
    }).then(function (response) {
      console.log("This is a console log for getFeatures: ");
      console.log(response);
    });
  }

  getFeatures();

  function getOutcomes() {
    $.ajax({
      url: queryURL + "GetOutcomes",
      method: "GET",
    }).then(function (response) {
      console.log("This is a console log for getOutcomes: ");
      console.log(response);
    });
  }

  getOutcomes();

  var sessionID = null; // SessionID
  //var useDefaultValues = null;

  function InitializeSessionIfNecessary() {
    if (null != sessionID) return;

    $.ajax({
      url: queryURL + "InitSession",
      method: "GET",
    }).then(function (response) {
      if (response.status == "ok") {
        // Response for InitSession is console logged here.
        console.log(response);
        //Session ID is stored here.
        sessionID = response.SessionID;
        //Session ID is console logged here.
        console.log("This is the session ID: " + sessionID);
      }
      termsOfAgreement(sessionID);
      getUseDefaultValues();
      setUseDefaultValues();

      getSuggestedTests();
      getSuggestedSpecializations();
      getSuggestedFeatures_PatientProvided();
      getSuggestedFeatures_PhysicianProvided();
      getSuggestedFeatures_Tests();

      //loadSymptoms();
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
      console.log("This is a console log for termsOfAgreement: ");
      console.log(response);
    });
  }

  function getUseDefaultValues() {
    //AJAX call for the default values
    $.ajax({
      url: queryURL + "GetUseDefaultValues?SessionID=" + sessionID,
      method: "GET",
    }).then(function (response) {
      if (response.status == "ok")
        console.log("AJAX resonse for getUseDefaultValues: ");
      console.log(response);
    });
  }

  function setUseDefaultValues() {
    $.ajax({
      url:
        queryURL + "SetUseDefaultValues?SessionID=" + sessionID + "&value=true",
      method: "POST",
    }).then(function (response) {
      console.log("This is a console log for setUseDefaultValues: ");
      console.log(response);
    });
  }

  function updateFeature() {
    for (var k = 0; k < symptom.length; k++) {
      $.ajax({
        url:
          queryURL +
          "UpdateFeature?" +
          "SessionID=" +
          sessionID +
          "&name=" +
          symptom[k].name +
          "&value=" +
          symptom[k].value,
        method: "POST",
      }).then(function (response) {
        console.log("This is a console log for updateFeature: ");
        console.log(response);
      });
    }
  }

  function deleteFeature() {
    $.ajax({
      url:
        queryURL +
        "DeleteFeature?" +
        "SessionID=" +
        sessionID +
        "&name=" +
        symptom[0].name,
      method: "POST",
    }).then(function (response) {
      if (response.status == "ok") {
        console.log("This is a console log for deleteFeature: ");
        console.log(response);
      } else if (response.status) {
        console.log("deleteFeature Error");
      }
    });
  }

  function getSuggestedTests() {
    $.ajax({
      url:
        queryURL +
        "GetSuggestedTests?SessionID=" +
        sessionID +
        "&TopDiseasesToTake=10",
      method: "GET",
    }).then(function (response) {
      console.log("This is a console log for getSuggestedTests: ");
      console.log(response);
    });
  }

  function getSuggestedSpecializations() {
    $.ajax({
      url:
        queryURL +
        "GetSuggestedSpecializations?SessionID=" +
        sessionID +
        "&NumberOfResults=10",
      method: "GET",
    }).then(function (response) {
      console.log("This is a console log for getSuggestedSpecializations: ");
      console.log(response);
    });
  }

  function getSuggestedFeatures_PatientProvided() {
    $.ajax({
      url:
        queryURL +
        "GetSuggestedFeatures_PatientProvided?SessionID=" +
        sessionID +
        "&TopDiseasesToTake=10",
      method: "GET",
    }).then(function (response) {
      console.log(
        "This is a console log for getSuggestedFeatures_PatientProvided: "
      );
      console.log(response);
    });
  }

  function getSuggestedFeatures_PhysicianProvided() {
    $.ajax({
      url:
        queryURL +
        "GetSuggestedFeatures_PhysicianProvided?SessionID=" +
        sessionID +
        "&TopDiseasesToTake=10",
      method: "GET",
    }).then(function (response) {
      console.log(
        "This is a console log for getSuggestedFeatures_PhysicianProvided: "
      );
      console.log(response);
    });
  }

  function getSuggestedFeatures_Tests() {
    $.ajax({
      url:
        queryURL +
        "GetSuggestedFeatures_Tests?SessionID=" +
        sessionID +
        "&TopDiseasesToTake=10",
      method: "GET",
    }).then(function (response) {
      console.log("This is a console log for getSuggestedFeatures_Tests: ");
      console.log(response);
    });
  }

  function analyze() {
    var topDiseasesResult = [];
    var variableImportancesResult = [];
    $.ajax({
      url: queryURL + "Analyze?SessionID=" + sessionID + "&NumberOfResults=10",
      method: "GET",
    }).then(function (response) {
      console.log("This is a console log for the analyze function: ");
      console.log(response);

      //console.log(response.Diseases);

      if (response.status == "ok") {
        topDiseasesResult = response.Diseases;
        variableImportancesResult = response.VariableImportances;
      }
      displayResult(topDiseasesResult);
      $(".columns.hide").removeClass("hide");
    });
  }

  function loadSymptoms() {
    $.getJSON("../Assests/SymptomsOutput.json", function (json) {
      console.log(json);
    });
  }

  function displayResult(topDiseasesResult) {
    $("#display-div").empty();
    console.log(topDiseasesResult);
    console.log(topDiseasesResult[0]);
    console.log(Object.keys(topDiseasesResult[0]));
    console.log(Object.values(topDiseasesResult[0]));
    for (i = 0; i < topDiseasesResult.length; i++) {
      var diseaseName = Object.keys(topDiseasesResult[i]);
      var diseasePercentage = Object.values(topDiseasesResult[i]);
      var a = $("<p>");
      a.text(
        diseaseName +
          " " +
          Math.round(100 * (diseasePercentage * 100)) / 100 +
          "%"
      );
      $("#display-div").append(a);
      var b = $("<progress>");
      b.addClass("progress");
      if (i<3) {
        b.addClass("is-warning");
      }
      if(diseaseName == "Coronavirus disease 2019 (Covid-19)") {
        b.addClass("is-danger");
      }
      b.attr("value", diseasePercentage * 100);
      b.attr("max", "100");
      $("#display-div").append(b);
    }
  }

/////////////////////////////////////////////
// Corona Virus Tracker API
// var country = userCountry;
// var state = userState;
// var city = userCity;


var keyAPI = "c7562f9c67ea28ae57a80982afbcae18d7659581b6459db880076318";
var cityArr = [];

function getIP () {
    $.ajax({
        url: "https://api.ipdata.co?api-key=" + keyAPI,
        method: "GET"
    })
    .then(function(response){
        console.log(response);

        var userCountry = response.country_code;
        var userState = response.region;
        var userCity = response.city;

        console.log(userCountry);
        console.log(userState);
        console.log(userCity);
         
        getRegionStats(userState, userCity);

        
    })
}

getIP ();

function getRegionStats (userState, userCity) {
 console.log(userCity);
    $.ajax({
        url: "https://api.quarantine.country/api/v1/summary/region?region=" + userState + "&sub_areas=1",
        method: "GET"
    })
    .then(function(response){
        console.log(response);

        cityArr = response.data.regions;
        console.log(cityArr);
        var tempValue = Object.values(cityArr);
        for (i = 0; i < tempValue.length; i++) {
          
          // console.log(tempValue[i].name);
          // console.log(userCity);
          if (tempValue[i].name == userCity) {
            console.log("this is the place");
            $("#city-name-prompt").text("Current Location: ");
            $("#city-name-data").text(tempValue[i].name);
            $("#total-cases-prompt").text("Total Positive Cases: ");
            $("#total-cases-data").text(tempValue[i].total_cases);
            $("#total-death-prompt").text("Total Death Number: ");
            $("#total-death-data").text(tempValue[i].deaths);
            $("#tested-number-prompt").text("Total Tested Number: ");
            $("#tested-number-data").text(tempValue[i].tested);
          }
        }
        // console.log(tempValue[0].name);
        // console.log(tempValue[0].total_cases);
        //  console.log(tempObj);
        //  for (i=0; i< tempObj.length; i++) {
        //    var tempCity = 
        //    var cityName = cityArr.tempCity;
        //    console.log(cityName);
        //  }
         //var updateArr = [];
        //  for (i = 0; i< tempObj.length; i++) {
        //    var tempVal = tempObj[i];
        //    tempVal = tempVal.replace("_"," ");
        //    updateArr.push(tempVal);
        //  }
         //console.log(updateArr);


        for(var h = 0; h < cityArr.length; h++ ){
            if (userCity == cityArr[h]) {
                console.log(cityArr[h]);
            }
        }
    })
}

});
