// Initialize Firebase
var config = {
    apiKey: "AIzaSyBD2tmktb3-a9V7dErFIDttdA22bYLgKw4",
    authDomain: "trainschedule-3db28.firebaseapp.com",
    databaseURL: "https://trainschedule-3db28.firebaseio.com",
    projectId: "trainschedule-3db28",
    storageBucket: "trainschedule-3db28.appspot.com",
    messagingSenderId: "11531265695"
};
firebase.initializeApp(config);

var database = firebase.database();

var name = "";
var destination = "";
var frequency = 0; //will be measured in minutes
var firstArrival = "";
var td = $("<td>");
var tr = $("<tr>");

function nextArrival(start, frequency) {
    var first = moment(start, "HH:mm").format();
    var currentTime = moment().format();
    var timeSince = moment().diff(moment(first), "minutes"); //time between now and first train
    var minutesTillNext = timeSince%frequency;
    var timeTillNext = moment().add(minutesTillNext, "minutes").format("h:mm");

    console.log("First train: " +first);
    console.log("Current time: " + currentTime);
    console.log("Minutes since first train: " +timeSince);
    console.log("Minutes till next train: " + minutesTillNext);
    console.log("Time of next train: " + timeTillNext);
}

$(document).ready(function () {
    function makeRow(child) {
        $("#schedule").append(tr);
        tr.attr("data-train", child.name).append("<td>" + child.name + "</td><td>" + child.destination + "</td><td>" + child.frequency + "</td>");
    }

    $("#submit").click(function (event) {
        event.preventDefault();
        name = $("#name").val().trim();
        destination = $("#dest").val().trim();
        frequency = parseInt($("#freq").val().trim());
        firstArrival = $("#arri").val().trim();

        database.ref().push({
            name: name,
            destination: destination,
            frequency: frequency,
            firstArrival: firstArrival,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    });

    database.ref().on("child_added", function (childSnapshot) {
        var child = childSnapshot.val();
        console.log(child.name);
        /*console.log(child.destination);
        console.log(child.frequency);
        console.log(child.firstArrival);
        console.log(child.dateAdded);*/
        makeRow(child);
        nextArrival(child.firstArrival, child.frequency);
    });
});
/*
Need to be able to push the following to fireBase:
    train name, destination, frequency, first arrival of the day
Need to call the above line from fireBase for multiple trains
    Will then need to calculate when next train arrives in terms of time and minutes until arrival
        This will require moment JS and arithmatic
Once everything is working:
    Make the time to arrival update every minute
    Make it so the user can update the train info (I'm assuming from the table)
    Only permit people with github or google accounts access the information
*/