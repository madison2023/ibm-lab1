import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { Tooltip } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { CategoryColors } from "../style/colors";

// STYLING

// Allow the tooltips to look a little different from default
const useStylesBootstrap = makeStyles((theme) => ({
  arrow: {
    color: "#00bcd4",
  },
  tooltip: {
    backgroundColor: "#00bcd4",
    fontSize: "1rem",
    color: "black",
    fontWeight: "bold",
  },
}));

// Generate circular progress components for each category
// Color coding is implemented using the `color.js` file
function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        size="6rem"
        variant="determinate"
        {...props}
        style={{ color: CategoryColors[props.category] }}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          style={{ color: "white" }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function ProgressTooltip(props) {
  const classes = useStylesBootstrap();
  return <Tooltip arrow classes={classes} {...props} />;
}

var StyledLinearProgressBars = {};

// Generate linear progress components for each category
// Color coding is also implemented using the `color.js` file
for (let color in CategoryColors) {
  let colorName = color.charAt(0).toUpperCase() + color.slice(1);
  StyledLinearProgressBars[colorName] = withStyles({
    root: {
      "& .MuiLinearProgress-colorPrimary": {
        backgroundColor: CategoryColors[color],
      },
      "& .MuiLinearProgress-barColorPrimary": {
        backgroundColor: CategoryColors[color],
      },
      "& .MuiLinearProgress-dashedColorPrimary": {
        backgroundImage: "radial-gradient(#fff 5%, transparent 30%)",
      },
    },
  })(LinearProgress);
}

const CategoryLabel = withStyles({
  root: {
    color: "white",
    textAlign: "left",
  },
})(Typography);

// EXPORT
export default function StatusBar(props) {
  // The copy of allEntries that we get is from `MainGrid.js`, the true and only copy
  const allEntries = props.listOfEntries;

  // Logic for calculating progress bar values

  var WorkTotal = 0;
  var SchoolTotal = 0;
  var SelfCareTotal = 0;
  var OtherTotal = 0;
  var SocialTotal = 0;
  var ChoresTotal = 0;

  allEntries.forEach((entry) => {
    if (entry.category === "work") WorkTotal++;
    if (entry.category === "school") SchoolTotal++;
    if (entry.category === "self-care") SelfCareTotal++;
    if (entry.category === "other") OtherTotal++;
    if (entry.category === "social") SocialTotal++;
    if (entry.category === "chores") ChoresTotal++;
  });

  const AllTotal =
    WorkTotal +
    SchoolTotal +
    SelfCareTotal +
    OtherTotal +
    SocialTotal +
    ChoresTotal;

  var WorkDone = 0;
  var SchoolDone = 0;
  var SelfCareDone = 0;
  var OtherDone = 0;
  var SocialDone = 0;
  var ChoresDone = 0;

  allEntries.forEach((entry) => {
    if (entry.done === true && entry.category === "work") WorkDone++;
    if (entry.done === true && entry.category === "school") SchoolDone++;
    if (entry.done === true && entry.category === "self-care") SelfCareDone++;
    if (entry.done === true && entry.category === "other") OtherDone++;
    if (entry.done === true && entry.category === "social") SocialDone++;
    if (entry.done === true && entry.category === "chores") ChoresDone++;
  });

  var WorkProgress = 0;
  var SchoolProgress = 0;
  var SelfCareProgress = 0;
  var OtherProgress = 0;
  var SocialProgress = 0;
  var ChoresProgress = 0;

  if (WorkTotal !== 0) WorkProgress = (WorkDone / WorkTotal) * 100;

  if (SchoolTotal !== 0) SchoolProgress = (SchoolDone / SchoolTotal) * 100;

  if (SelfCareTotal !== 0)
    SelfCareProgress = (SelfCareDone / SelfCareTotal) * 100;

  if (OtherTotal !== 0) OtherProgress = (OtherDone / OtherTotal) * 100;

  if (SocialTotal !== 0) SocialProgress = (SocialDone / SocialTotal) * 100;

  if (ChoresTotal !== 0) ChoresProgress = (ChoresDone / ChoresTotal) * 100;

  const getDistributionPercentage = (base) => {
    if (AllTotal === 0) return 0;
    let percentage = (base / AllTotal) * 100;
    return percentage;
  };

  // This uses circular progress components to make it easier for users to
  // see which categories they tend to focus on the most (theoretically)
  // *note that this section does not take into account completion statuses
  function InsightsCard() {
    return (
      <>
        <Typography
          style={{ fontWeight: "bold", marginTop: "2rem" }}
          variant="h5"
        >
          Category Distribution
        </Typography>

        <br />
        <Grid container spacing={3} backgroundColor="blue">
          <Grid item xs={0}></Grid>
          <Grid item xs={0}>
            <CircularProgressWithLabel
              variant="determinate"
              value={getDistributionPercentage(WorkTotal)}
              category="work"
            />
            <CircularProgressWithLabel
              variant="determinate"
              value={getDistributionPercentage(SchoolTotal)}
              category="school"
            />
            <CircularProgressWithLabel
              variant="determinate"
              value={getDistributionPercentage(SelfCareTotal)}
              category="self-care"
            />
            <CircularProgressWithLabel
              variant="determinate"
              value={getDistributionPercentage(SocialTotal)}
              category="social"
            />
            <CircularProgressWithLabel
              variant="determinate"
              value={getDistributionPercentage(ChoresTotal)}
              category="chores"
            />
            <CircularProgressWithLabel
              variant="determinate"
              value={getDistributionPercentage(OtherTotal)}
              category="other"
            />
          </Grid>
        </Grid>
        <br />
      </>
    );
  }

  return (
    <div>
      <Typography
        style={{ fontWeight: "bold", padding: 0, marginTop: "1rem" }}
        variant="h5"
      >
        Task Completion by Category
      </Typography>
      <ProgressTooltip title={WorkDone + "/" + WorkTotal} placement="left">
        <Box m={3}>
          <CategoryLabel variant="h6" component="h2" gutterBottom>
            Work
          </CategoryLabel>
          <StyledLinearProgressBars.Work
            value={WorkProgress}
            variant={"buffer"}
            valueBuffer={0}
          />
        </Box>
      </ProgressTooltip>
      <ProgressTooltip title={SchoolDone + "/" + SchoolTotal} placement="left">
        <Box m={3}>
          <CategoryLabel
            variant="h6"
            component="h2"
            gutterBottom
            color="textSecondary"
          >
            School
          </CategoryLabel>
          <StyledLinearProgressBars.School
            value={SchoolProgress}
            variant={"buffer"}
            valueBuffer={0}
          />
        </Box>
      </ProgressTooltip>
      <ProgressTooltip
        title={SelfCareDone + "/" + SelfCareTotal}
        placement="left"
      >
        <Box m={3}>
          <CategoryLabel
            variant="h6"
            component="h2"
            gutterBottom
            color="Primary"
          >
            Self Care
          </CategoryLabel>
          <StyledLinearProgressBars.Selfcare
            value={SelfCareProgress}
            variant={"buffer"}
            valueBuffer={0}
          />
        </Box>
      </ProgressTooltip>
      <ProgressTooltip title={SocialDone + "/" + SocialTotal} placement="left">
        <Box m={3}>
          <CategoryLabel variant="h6" component="h2" gutterBottom>
            Social
          </CategoryLabel>
          <StyledLinearProgressBars.Social
            value={SocialProgress}
            variant={"buffer"}
            valueBuffer={0}
          />
        </Box>
      </ProgressTooltip>
      <ProgressTooltip title={ChoresDone + "/" + ChoresTotal} placement="left">
        <Box m={3}>
          <CategoryLabel variant="h6" component="h2" gutterBottom>
            Chores
          </CategoryLabel>
          <StyledLinearProgressBars.Chores
            value={ChoresProgress}
            variant={"buffer"}
            valueBuffer={0}
          />
        </Box>
      </ProgressTooltip>
      <ProgressTooltip title={OtherDone + "/" + OtherTotal} placement="left">
        <Box m={3}>
          <CategoryLabel variant="h6" component="h2" gutterBottom>
            Other
          </CategoryLabel>
          <StyledLinearProgressBars.Other
            value={OtherProgress}
            variant={"buffer"}
            valueBuffer={0}
          />
        </Box>
      </ProgressTooltip>
      <InsightsCard />
    </div>
  );
}
