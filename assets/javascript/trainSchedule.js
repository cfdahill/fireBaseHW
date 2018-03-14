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

$(document).ready(function(){
    $("#submit").click(function(event){
        event.preventDefault();
        name = $("#name").val().trim();
        destination = $("#dest").val().trim();
        frequency = parseInt($("#freq").val().trim());
        firstArrival = $("#arri").val().trim();

        database.ref().push({
            name : name,
            destination : destination,
            frequency : frequency,
            firstArrival : firstArrival,
            dateAdded : firebase.database.ServerValue.TIMESTAMP
        });
    });

    database.ref().on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val().name);
        console.log(childSnapshot.val().destination);
        console.log(childSnapshot.val().frequency);
        console.log(childSnapshot.val().firstArrival);
        console.log(childSnapshot.val().dateAdded);
    
        $("#schedule").append(tr);
        tr.append(td.html(childSnapshot.val().name));
        //tr.append(td.html(childSnapshot.val().destination));
        //.td.html(childSnapshot.val().destination).td.html(childSnapshot.val().frequency).td.html("minutes").td.html(childSnapshot.val().frequency));

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