import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import MainBox from "./MainBox";
import StatusBar from "./StatusBar";

// STYLING
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "114rem",
    height: "50rem",
    marginTop: "2rem",
    margin: "auto",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    height: "50rem",
    color: theme.palette.text.secondary,
    backgroundColor: "#264653",
    borderRadius: "0rem",
    overflow: "hidden",
  },
  greeting: {
    paddingBottom: "1rem",
  },
}));

let curId = 0; // Each new instantiated Task increments curId by one
// Task constructor allows us to easily add new tasks to `allEntries` state
class Task {
  constructor(title = "Do homework", category, isDone) {
    if (category === "" || category === undefined) {
      category = "other";
    }

    this.title = title;
    this.category = category;
    this.id = curId;
    this.done = isDone;

    let newDate = new Date();
    this.date = newDate;

    curId = curId + 1;
  }
}

// EXPORT
export default function MainGrid() {
  const classes = useStyles();

  // The one source of truth for to-do list entries (passed throughout app with props)
  const [allEntries, setAllEntries] = useState([
    new Task("Add your first task", "other", false),
  ]);

  const [lastAction, setLastAction] = useState("");

  const handleAdd = (obj) => {
    if (lastAction !== "add") setLastAction("add");
    var newState = [];

    // Copy old entries over
    allEntries.forEach((_value) => {
      newState.push(_value);
    });

    // Push new entry obj
    newState.push(new Task(obj.title, obj.category, false));

    // Update state
    setAllEntries(newState);
  };

  const handleDelete = (id) => {
    // Delete entry with matching id
    if (lastAction !== "delete") setLastAction("delete");
    setAllEntries((entries) => entries.filter((entry) => entry.id !== id));
  };

  const handleToggle = (value) => () => {
    if (lastAction !== "toggle") setLastAction("toggle");
    var newState = [];

    // Toggle `done` property of entry with matching id
    allEntries.forEach((_value) => {
      if (_value.id === value.id) {
        _value.done = !_value.done;
      }
      newState.push(_value);
    });
    setAllEntries(newState);
  };

  const handleEdit = (obj) => {
    if (lastAction !== "edit") setLastAction("edit");
    var duplicateFound = false;

    // Still enforce the `no duplicate entries` rule here
    allEntries.forEach((_value) => {
      if (_value.title.toLowerCase() === obj.title.toLowerCase()) {
        duplicateFound = true;
      }
    });

    if (duplicateFound === false) {
      var newState = [];
      allEntries.forEach((_value) => {
        // Modify category and title as needed if id matches
        if (_value.id === obj.id) {
          if (obj.category !== "") {
            _value.category = obj.category;
          }
          if (obj.title !== "") {
            _value.title = obj.title;
          }
        }
        newState.push(_value);
      });
      setAllEntries(newState);
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {/* This one's the big box that will contain our to-do list! */}
        <Grid item xs>
          <Paper className={classes.paper}>
            {/* This component is what actually renders each to-do list item 
            Many functions are passed as props - perhaps there may be a better way to do this? */}
            <MainBox
              listOfEntries={allEntries}
              remotelyHandleEdit={handleEdit}
              remotelyHandleToggle={handleToggle}
              remotelyHandleAdd={handleAdd}
              remotelyHandleDelete={handleDelete}
              addedNewEntry={lastAction === "add" ? true : false}
            />
          </Paper>
        </Grid>
        {/* Smaller box on the right, set aside for additional features */}
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <StatusBar listOfEntries={allEntries} />
            {/* We need the list of entries inside StatusBar too, so we're passing it as props */}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
