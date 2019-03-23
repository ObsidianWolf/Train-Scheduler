
// Initialize Firebase
var config = {
  apiKey: "AIzaSyC_0-DyM10ZKeA58q-08hB2OMOyJMO5bFY",
  authDomain: "train-schedule-ae737.firebaseapp.com",
  databaseURL: "https://train-schedule-ae737.firebaseio.com",
  projectId: "train-schedule-ae737",
  storageBucket: "train-schedule-ae737.appspot.com",
  messagingSenderId: "972699700156"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#myForm").on("submit", function (event) {

  event.preventDefault();

  database.ref().push({
    trainName: $("#trainName").val().trim(),
    destination: $("#destination").val().trim(),
    firstTrainTime: $("#firstTrainTime").val().trim(),
    frequencyMin: $("#frequencyMin").val().trim()
  });

  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTrainTime").val("");
  $("#frequencyMin").val("");

});

  database.ref().on("child_added", function (snapshot) {
    //if user hasn't filled out info and tries to pass it
    if (!snapshot.val()) return;

    var train = snapshot.val();

    tableRowData(train);

    console.log(train);

  });


function tableRowData(train) {

  var frequencyMin = train.frequencyMin;

  var firstTrainTime = train.firstTrainTime;

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
  // console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm a"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  // console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % frequencyMin;
  // console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = frequencyMin - tRemainder;
  // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm a"));

  // Create the new row
  let newRow = $("<tr>").append(
    $("<td>").text(train.trainName), // Train Name
    $("<td>").text(train.destination), // Destination
    $("<td>").text(train.frequencyMin), // Frequency
    $("<td>").text(nextTrain.format("hh:mm a")), // Next Arrival
    $("<td>").text(tMinutesTillTrain), // Arrives in x minutes

  );

  $("#trainTable").append(newRow);
}
