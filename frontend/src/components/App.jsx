import * as React from "react";

import { withStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import TextField from "@material-ui/core/TextField";

import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import axios from "axios";

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  appBar: {
    marginBottom: 20
  }
};

// Configure Firebase.
var config = {
  apiKey: "yourkey",
  authDomain: "yourdomain",
  databaseURL: "yoururl",
  projectId: "yourid",
  storageBucket: "",
  messagingSenderId: "yourid"
};
firebase.initializeApp(config);

const uiConfig = {
  // popup flow instead
  signInFlow: "popup",
  // only email address sign up
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      notes: [],
      newNoteText: "",
      user: null
    };
  }

  // update local state and send out an update to the api
  saveNewNote(noteText) {
    this.setState({
      notes: [...this.state.notes, noteText],
      newNoteText: ""
    });

    // normally you'd want to be more careful, but these notes aren't super important
    axios.post(
      "/notes",
      { noteText },
      { headers: { "Content-Type": "application/json" } }
    );
  }

  componentDidMount() {
    // registering an event handler to recognize when we've logged in
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        loggedIn: !!user,
        user: user
      });
    });
    // get notes
    axios.get("/notes").then(serverNotes => {
      console.log(serverNotes);
      this.setState({ notes: serverNotes.data.map(s => s.noteText) });
    });
  }

  render(props) {
    console.log(this.state);
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="title"
              color="inherit"
              className={classes.grow}
            >
              Fireside Notes
            </Typography>
            {this.state.loggedIn && (
              <Button
                color="inherit"
                onClick={() => {
                  firebase.auth().signOut();
                  window.location.reload();
                }}
              >
                Log Out
              </Button>
            )}
          </Toolbar>
        </AppBar>
        {this.state.loggedIn ? (
          <div>
            <TextField
              id="new-note"
              label="New Note"
              style={{ margin: 8 }}
              placeholder="Go ahead and type a note"
              fullWidth
              margin="normal"
              variant="outlined"
              value={this.state.newNoteText}
              onChange={event => {
                console.log(event);
                this.setState({ newNoteText: event.target.value });
              }}
              InputLabelProps={{
                shrink: true
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.saveNewNote(this.state.newNoteText)}
            >
              Save Note
            </Button>
            {this.state.notes.map(note => (
              <TextField
                value={note}
                fullWidth
                margin="normal"
                variant="outlined"
                InputProps={{
                  readOnly: true
                }}
              />
            ))}
          </div>
        ) : (
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(App);
