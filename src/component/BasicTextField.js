import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { FormControl, InputLabel, MenuItem } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import { Button } from "@material-ui/core";
import { Toolbar } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { SnackbarProvider, useSnackbar } from "notistack";

// STYLING
const useStyles = makeStyles((theme) => ({
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  fabRoot: {},
  catSelect: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  selectLabel: {},
}));

function ActualFields(props) {
  const [currentInput, setCurrentInput] = useState("");
  const [category, setCategory] = React.useState("");
  const { enqueueSnackbar } = useSnackbar();

  // Used for displaying snacks - give user feedback on their actions
  const handleClickVariant = (msg, variant) => {
    let autoHideDuration = 2000;
    if (variant === "info") autoHideDuration = 3000;
    enqueueSnackbar(msg, { variant, autoHideDuration });
  };

  // Select component
  const CategorySelect = () => {
    const classes = useStyles();

    const handleCategoryChange = (event) => {
      setCategory(event.target.value);
    };

    return (
      <FormControl className={classes.catSelect}>
        <InputLabel>Category</InputLabel>
        <Select
          className={classes.selectLabel}
          style={{ width: "20rem" }}
          id="category-selection"
          value={category.toLowerCase()}
          onChange={handleCategoryChange}
        >
          <MenuItem value={"chores"}>Chores</MenuItem>
          <MenuItem value={"school"}>School</MenuItem>
          <MenuItem value={"self-care"}>Self-care</MenuItem>
          <MenuItem value={"social"}>Social</MenuItem>
          <MenuItem value={"work"}>Work</MenuItem>
          <MenuItem value={"other"}>Other</MenuItem>
        </Select>
      </FormControl>
    );
  };

  return (
    <form noValidate autoComplete="off">
      <Toolbar style={{ alignContent: "center" }}>
        <TextField
          data-testid="new-item-input"
          value={currentInput}
          onChange={(e) => {
            setCurrentInput(e.target.value);
          }}
          id="standard-basic"
          label="Task Name"
          color="secondary"
          style={{ width: "45rem" }}
        />
        <CategorySelect />
        <Button
          data-testid="new-item-button"
          color="primary"
          aria-label="add"
          variant="contained"
          style={{ width: "10rem" }}
          startIcon={<AddIcon />}
          onClick={() => {
            setCurrentInput("");
            let isADuplicate = false;
            if (currentInput === "") {
              handleClickVariant(
                "Input may not be empty. Please name your task.",
                "error"
              );
              return;
            }
            props.listOfEntries.map((obj) => {
              if (obj.title.toLowerCase() === currentInput.toLowerCase()) {
                isADuplicate = true;
                handleClickVariant("Duplicate items are not allowed.", "error");
              }
              return {};
            });

            if (isADuplicate === false) {
              if (category !== undefined && category !== "") {
                handleClickVariant(
                  "'" + currentInput + "' was successfully added to your list!",
                  "success"
                );
              } else {
                handleClickVariant(
                  "'" + currentInput + "' was successfully added to your list!",
                  "success"
                );
                handleClickVariant(
                  "We suggest adding a category next time so we can provide you with greater insight.",
                  "info"
                );
              }

              props.remotelyHandleAdd({
                title: currentInput,
                category: category,
              });
            }
          }}
        >
          ADD
        </Button>
      </Toolbar>
    </form>
  );
}

// EXPORT
export default function BasicTextField(props) {
  return (
    <SnackbarProvider maxSnack={3}>
      <ActualFields
        remotelyHandleAdd={props.remotelyHandleAdd}
        listOfEntries={props.listOfEntries}
      />
    </SnackbarProvider>
  );
}
