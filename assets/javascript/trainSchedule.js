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
var tableHeader = "<tr><th>Train</th><th>Destination</th><th>Time of Next Arrival</th><th>Minutes Away</th><th>Frequency (in minutes)</th><th>First Arrival</th></tr>";
var timeTillNext;
var minutesTillNext;

$(document).ready(function () {
    //nextArrival will determine when the next arrival will be in terms of the time and minutes away
    function nextArrival(start, frequency) {
        var first = moment(start, "HH:mm a").format();
        var currentTime = moment().format();
        var timeSince = moment().diff(moment(first), "minutes"); //time between now and first train
        minutesTillNext = frequency - (timeSince % frequency);
        timeTillNext = moment().add(minutesTillNext, "minutes").format("h:mm a");
    }

    //makeRow takes the train information and puts it all into a row for the schedule table
    function makeRow(child) {
        $("#schedule").append("<tr data-train: '" + child.name + "'><td>" + child.name + "</td><td>" + child.destination + "</td><td>" + timeTillNext + "</td><td>" + minutesTillNext + "</td><td>" + child.frequency + "</td><td>" + child.firstArrival + "</td></tr>");
        /* put <td><button type='submit' class='remove'>remove</button></td> in the above line once able to remove info from firebase
        $(".remove").click(remove); */
    }

    //Lets user put in new train information
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

    //Delete train data from firebase and table:        
 /*   function remove(event) {
        event.preventDefault();
        var row = $(this).closest('tr');
        row.remove();
        //var rowId = row.attr('data-train');  
        database.ref().child("name").remove();
    }; */

    //Puts all of the trains information into the table
    function trainSchedule() {
        $("#schedule").empty();  //empties the table of previous information (needed for refreshing data)
        $("#schedule").append(tableHeader); //adds the header of the table back
        console.log("updated");
        database.ref().on("child_added", function (childSnapshot) {
            var child = childSnapshot.val();

            nextArrival(child.firstArrival, child.frequency);  //does the calculations needed to get next arrival information
            makeRow(child);  //puts all of the information for a train into a row
        });
    }
    trainSchedule(); //runs on load up
    setInterval(trainSchedule, 60000);  //refreshes every minute
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