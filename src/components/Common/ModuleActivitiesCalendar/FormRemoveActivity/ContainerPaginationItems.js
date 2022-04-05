import React from "react";

// UI
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
    flexGrow: 1,
    background: "none",
  },
});

const DotsMobileStepper = ({ setActiveStep, activeStep, totalItems }) => {
  const classes = useStyles();
  const theme = useTheme();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <MobileStepper
      variant="dots"
      steps={totalItems}
      position="static"
      activeStep={activeStep}
      className={classes.root}
      nextButton={
        <Button
          size="small"
          onClick={handleNext}
          disabled={activeStep === totalItems - 1}
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </Button>
      }
      backButton={
        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </Button>
      }
    />
  );
};

const ContainerPaginationItems = ({ schedules, children }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = schedules.length;

  return (
    <>
      <div className="d-flex justify-content-center mb-1">
        {children({ schedulesPag: [schedules[activeStep]] })}
      </div>
      <DotsMobileStepper
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        totalItems={maxSteps}
      />
    </>
  );
};

export default ContainerPaginationItems;
