//get document ready
$(document).ready(function () {
  var queryURL = "https://api.endlessmedical.com/v1/dx/";
  //empty symptom array to get final selected symptom for API update
  var symptom = [];
  //when click save button, save user age input as an object to symptom array
  $(".button.save-age.is-info").on("click", function () {
    var ageUser = $("#user-input").val();
    symptom.push({ name: "Age", value: ageUser });
  });
  //event listener for each symptom button
  $(".field.is-grouped.is-grouped-multiline").on("click", ".button", function (
    event
  ) {
    var nameUser = $(event.target).prop("name");
    var valueUser = $(event.target).attr("namedata");
    //unslect symptom if user un-slected by clicking again
    if ($(event.target).hasClass("is-danger")) {
      $(event.target).removeClass("is-danger");
      for (var j = 0; j < symptom.length; j++) {
        if (symptom[j].name == nameUser) {
          //delete from API
          deleteFeature();
          //delete obejct from symptom array
          symptom.splice(j, 1);
          console.log(symptom);
        }
      }
      //store symptom as object to symptom array if user click each symtomp
    } else {
      $(event.target).addClass("is-danger");
      symptom.push({ name: nameUser, value: valueUser });
    }
  });
  //update final symptom array to API and start analyzation unpon clicking Analyze button
  $(".button.submit-btn.is-info").on("click", function () {
    console.log("analyze clicked");
    updateFeature();
    analyze();
  });
  //function for grabbing data of possible diagnosis from API
  function getFeatures() {
    $.ajax({
      url: queryURL + "GetFeatures",
      method: "GET",
    }).then(function (response) {
      console.log("This is a console log for getFeatures: ");
      console.log(response);
    });
  }
  //calling getFeatures fucntion
  getFeatures();
  //function for grabbing data of possible symptom name from API
  function getOutcomes() {
    $.ajax({
      url: queryURL + "GetOutcomes",
      method: "GET",
    }).then(function (response) {
      console.log("This is a console log for getOutcomes: ");
      console.log(response);
    });
  }
  //calling getOutcomes unction
  getOutcomes();
  // SessionID defualt as null
  var sessionID = null;
  //fucntion that initialized API by generating a new Session ID
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
      //necessary function call to ensure API's operation
      termsOfAgreement(sessionID);
      getUseDefaultValues();
      setUseDefaultValues();
      getSuggestedTests();
      getSuggestedSpecializations();
      getSuggestedFeatures_PatientProvided();
      getSuggestedFeatures_PhysicianProvided();
      getSuggestedFeatures_Tests();
    });
  }
  //calling intializeSessionIfNecessary function
  InitializeSessionIfNecessary();
  //function to gree to term of use for each sessionID
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
  //function for getting user default values
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
  //function for setting user's default values
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
  //function that takes information from the fianl symtomp array and update API
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
  //function that delete unselected symptoms from API
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
  //function for getting test suggestiong
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
  //funciton for getting specialist suggestion
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
  //analyze based on symtopms updated to the API
  function analyze() {
    var topDiseasesResult = [];
    var variableImportancesResult = [];
    //ajax call for analyzing 
    $.ajax({
      url: queryURL + "Analyze?SessionID=" + sessionID + "&NumberOfResults=10",
      method: "GET",
    }).then(function (response) {
      console.log("This is a console log for the analyze function: ");
      console.log(response);
      if (response.status == "ok") {
        topDiseasesResult = response.Diseases;
        variableImportancesResult = response.VariableImportances;
      }
      //display progress bar by adding to html dynamically
      displayResult(topDiseasesResult);
      //disply bottom div with cards
      $(".columns.hide").removeClass("hide");
    });
  }
  //function that displays possible diagnosis 
  function displayResult(topDiseasesResult) {
    //empty dispay div to prevent display from previous analysis
    $("#display-div").empty();
    console.log(topDiseasesResult);
    console.log(topDiseasesResult[0]);
    console.log(Object.keys(topDiseasesResult[0]));
    console.log(Object.values(topDiseasesResult[0]));
    //creat progress bar for each dieseases
    for (i = 0; i < topDiseasesResult.length; i++) {
      var diseaseName = Object.keys(topDiseasesResult[i]);
      var diseasePercentage = Object.values(topDiseasesResult[i]);
      var a = $("<p>");
      //displaying name and percentage of each diagnosis
      a.text(
        diseaseName +
          " " +
          Math.round(100 * (diseasePercentage * 100)) / 100 +
          "%"
      );
      $("#display-div").append(a);
      //displying progress bar for each diagnosis
      var b = $("<progress>");
      b.addClass("progress");
      //make top three possible diagnosis's progress bar yellow
      if (i < 3) {
        b.addClass("is-warning");
      }
      //make COVID-19's progress bar red is it's a possible outcome
      if (diseaseName == "Coronavirus disease 2019 (Covid-19)") {
        b.addClass("is-danger");
      }
      b.attr("value", diseasePercentage * 100);
      b.attr("max", "100");
      $("#display-div").append(b);
    }
  }

  //API key for seccond API that gets user IP address
  var keyAPI = "c7562f9c67ea28ae57a80982afbcae18d7659581b6459db880076318";
  var cityArr = [];
  //function that gets user IP, country, state, and city info
  function getIP() {
    $.ajax({
      url: "https://api.ipdata.co?api-key=" + keyAPI,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      var userCountry = response.country_code;
      var userState = response.region;
      var userCity = response.city;

      console.log(userCountry);
      console.log(userState);
      console.log(userCity);
      //call getRegionStats function to get local COVID-19 info for user's current location
      getRegionStats(userState, userCity);
    });
  }
  //call getIP function
  getIP();
  //function that use third API to get COVID-19 related data from given state and city
  function getRegionStats(userState, userCity) {
    console.log(userCity);
    //ajx call to get info
    $.ajax({
      url:
        "https://api.quarantine.country/api/v1/summary/region?region=" +
        userState +
        "&sub_areas=1",
      method: "GET",
    }).then(function (response) {
      console.log(response);

      cityArr = response.data.regions;
      console.log(cityArr);
      var tempValue = Object.values(cityArr);
      //find current city data and disply location, positive cases, death number, tested number as a card on the bottom of the page
      for (i = 0; i < tempValue.length; i++) {
        if (tempValue[i].name == userCity) {
          console.log("this is the place");
          //display info on cards
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
    });
  }
});
