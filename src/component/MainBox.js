import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import { green } from "@material-ui/core/colors";
import Box from "@material-ui/core/Box";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { pink, cyan } from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";
import React, { useState, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Icon from "@material-ui/core/Icon";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import BasicTextField from "./BasicTextField";
import { Chip } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import FavoriteIcon from "@material-ui/icons/Favorite";
import GroupIcon from "@material-ui/icons/Group";
import SchoolIcon from "@material-ui/icons/School";
import WorkIcon from "@material-ui/icons/Work";
import LocalLaundryServiceIcon from "@material-ui/icons/LocalLaundryService";
import { CategoryColors } from "../style/colors";
import HelpIcon from "@material-ui/icons/Help";
import { InputLabel } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import { Select } from "@material-ui/core";

// Returns appropriate icon based on list item category
function getCategoryIcon(value) {
  if (value.category === "chores") {
    return (
      <LocalLaundryServiceIcon style={{ color: CategoryColors["chores"] }} />
    );
  } else if (value.category === "school") {
    return <SchoolIcon style={{ color: CategoryColors["school"] }} />;
  } else if (value.category === "self-care") {
    return <FavoriteIcon style={{ color: CategoryColors["self-care"] }} />;
  } else if (value.category === "social") {
    return <GroupIcon style={{ color: CategoryColors["social"] }} />;
  } else if (value.category === "work") {
    return <WorkIcon style={{ color: CategoryColors["work"] }} />;
  } else {
    // other
    return <HelpIcon style={{ color: CategoryColors["other"] }} />;
  }
}

// This overrides the default MUI theme colors
const customTheme = createMuiTheme({
  palette: {
    primary: {
      main: cyan[500],
    },
    secondary: {
      main: pink[500],
    },
  },
});

// STYLING
const useStyles = makeStyles((theme) => ({
  listItem: {
    color: theme.palette.secondary,
  },
  root: {
    backgroundColor: "transparent",
    width: "100%",
    position: "relative",
    height: "100%",
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  fabGreen: {
    color: theme.palette.common.white,
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[600],
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    "aria-controls": `action-tabpanel-${index}`,
  };
}

export default function MainBox(props) {
  const classes = useStyles();
  const theme = useTheme();

  // STATE
  const [value, setValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState(0);

  // Upon re-render, check if it is necessary to scroll to last list entry
  useEffect(() => {
    if (props.addedNewEntry === true) scrollToLastEntry();
  });

  // State was not used for this to prevent re-rendering when user edits text
  var editCategory = "";
  var editTitle = "";

  const dialogHandleOpen = () => {
    editCategory = "";
    editTitle = "";
    setDialogOpen(true);
  };
  const dialogHandleClose = () => {
    setDialogOpen(false);
  };

  var allEntries = props.listOfEntries; // We receive the list of all to-do list entries from MainGrid.js

  const scrollToLastEntry = () => {
    var element = document.getElementById("lastEntry");
    if (element === undefined) return;
    element.scrollIntoView();
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const formatDate = (date) => {
    let period = "AM";
    let hour = date.getHours();
    if (hour === 12) {
      period = "PM";
    } else if (hour > 12) {
      hour = hour - 12;
      period = "PM";
    }

    let month = date.getMonth() + 1;
    let dayOfMonth = date.getDate();

    let minute = date.getMinutes();
    if (minute < 10) {
      minute = "0" + minute;
    }

    return (
      month +
      "/" +
      dayOfMonth +
      "/" +
      date.getYear().toString().substring(1) +
      " " +
      hour +
      ":" +
      minute +
      " " +
      period
    );
  };

  // Allows the user to modify the title and/or the category of a to-do list item
  const DialogPopup = () => {
    return (
      <Dialog
        open={dialogOpen}
        onClose={dialogHandleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit List Entry</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the fields you'd like to change. <br />
            The fields left blank will remain as is.
          </DialogContentText>
          <TextField
            autoFocus
            margin="normal"
            id="edit-title"
            label="Task Name"
            fullWidth
          />
          {/* Same category selection as inside `BasicTextField` */}
          <FormControl>
            <InputLabel>Category</InputLabel>
            <Select
              style={{ width: "10rem" }}
              inputProps={{ id: "edit-category" }}
            >
              <MenuItem value={"chores"}>Chores</MenuItem>
              <MenuItem value={"school"}>School</MenuItem>
              <MenuItem value={"self-care"}>Self-care</MenuItem>
              <MenuItem value={"social"}>Social</MenuItem>
              <MenuItem value={"work"}>Work</MenuItem>
              <MenuItem value={"other"}>Other</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={dialogHandleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              editCategory = document.getElementById("edit-category").value;
              editTitle = document.getElementById("edit-title").value;

              if (editCategory === undefined) editCategory = "";
              if (editTitle === undefined) editTitle = "";

              // Only attempt to update state if user modified any fields
              if (editCategory !== "" || editTitle !== "") {
                props.remotelyHandleEdit({
                  title: editTitle,
                  category: editCategory,
                  id: editId,
                });
              }
              dialogHandleClose();
            }}
            color="secondary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const RenderListComponents = () => {
    var entryCount = 0;

    return (
      <Paper>
        <List
          MenuProps={{ autoFocus: false }}
          dense
          className={classes.root}
          style={{ width: "100%", maxHeight: "36rem", overflowY: "auto" }}
        >
          {allEntries.map((value) => {
            const labelId = `checkbox-list-secondary-label-${value.id}`;
            let isLast = false;
            entryCount += 1;
            if (entryCount === allEntries.length) {
              isLast = true;
            }
            // What appears in each list entry:
            return (
              <ListItem
                id={isLast === true ? "lastEntry" : "entry" + entryCount}
                className={classes.listItem}
                key={value.id}
                disabled={false}
                style={{
                  width: "100%",
                  height: "5rem",
                  // Opacity changes when the item is marked as complete.
                  opacity: value.done === false ? 1 : 0.5,
                }}
              >
                <IconButton
                  aria-label="delete"
                  color="primary"
                  onClick={() => {
                    props.remotelyHandleDelete(value.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>

                {/* Displays an avatar. Maybe we can replace this with an icon later,
                depending on what they categorize the task as? */}
                <ListItemIcon>
                  <Icon>{getCategoryIcon(value)}</Icon>
                </ListItemIcon>

                {/* This would be a great place to display the date and time of list entry creation. 
                It may be referenced `value.creationTime` after implementation. */}
                <Chip
                  label={formatDate(value.date)}
                  color="secondary"
                  style={{
                    marginRight: "1rem",
                    width: "auto",
                  }}
                />

                {/* Displays name (title) of task. */}
                <ListItemText id={labelId} primary={value.title} />

                <IconButton
                  aria-label="edit"
                  color="primary"
                  onClick={() => {
                    setEditId(value.id);
                    dialogHandleOpen();
                  }}
                >
                  <EditIcon />
                </IconButton>

                {/* Checkbox components; shows task status. */}
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    onChange={props.remotelyHandleToggle(value)}
                    checked={value.done !== false}
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
            // End of list entry display ^
          })}
        </List>
      </Paper>
    );
  };

  return (
    <ThemeProvider theme={customTheme}>
      <div className={classes.root}>
        <AppBar style={{ background: "white" }} position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="primary"
            variant="fullWidth"
            aria-label="action tabs example"
          >
            <Tab
              style={{
                backgroundColor: "#264653",
                fontWeight: "bold",
                fontSize: "3rem",
              }}
              label="TO-DO LIST"
              {...a11yProps(0)}
            ></Tab>
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel
            value={value}
            index={0}
            dir={theme.direction}
            style={{ width: "100%" }}
          >
            {/* Contents of tab 1. */}
            <Paper
              style={{
                width: "100%",
                margin: 0,
                padding: 0,
              }}
            >
              {RenderListComponents()}
            </Paper>
            <Paper
              elevation={5}
              style={{
                marginTop: "1rem",
                alignContent: "left",
                justifyContent: "left",
                width: "100%",
                marginLeft: "0rem",
              }}
            >
              <BasicTextField
                listOfEntries={props.listOfEntries}
                remotelyHandleAdd={props.remotelyHandleAdd}
              />
            </Paper>
            <DialogPopup />
          </TabPanel>
        </SwipeableViews>
      </div>
    </ThemeProvider>
  );
}
