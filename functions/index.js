const functions = require("firebase-functions");
const admin = require("firebase-admin");

// set up the db connection
admin.initializeApp(functions.config().firebase);
var db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.notes = functions.https.onRequest((request, response) => {
  if (request.method === "POST") {
    // grab the note we're saving
    const { noteText } = request.body;

    // grab a reference to the notes collection and save the note
    const notesRef = db.collection("notes");
    notesRef.add({ noteText });

    // return the saved note for good measure
    response.send(noteText);
  } else if (request.method === "GET") {
    // grab a reference to the notes collection
    const notesRef = db.collection("notes");

    // get them all
    notesRef
      .get()
      .then(snapshot => {
        // collecting the notes in an array to send back out
        const notes = [];
        snapshot.forEach(doc => {
          notes.push(doc.data());
        });
        response.send(notes);
      })
      .catch(err => {
        // guess it's borked ¯\_(ツ)_/¯
        console.log("Error getting documents", err);
      });
  }
});
