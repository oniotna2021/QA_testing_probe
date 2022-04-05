import React, { useEffect } from "react";
import { Switch, createMuiTheme } from '@material-ui/core'

// UI
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AddIcon from "@material-ui/icons/Add";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
//ICONS
import { IconEdit } from "assets/icons/customize/config";
import ItemHeaderResumeSession from "components/Common/ModuleSession/ItemContentResumeSession/ItemHeaderResumeSession";
import { Link } from "react-router-dom";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { SortableHandle } from "react-sortable-hoc";
import { SwitchCustom } from '../SwitchCustom/SwitchCustom';
import { ThemeProvider } from '@material-ui/core/styles'
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import styled from '@emotion/styled';
import { withStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  boxItem: {
    width: "100px",
    borderRadius: "10px",
    padding: "5px",
    background: theme.themeColorSoft,
    textAlign: "center",
  },
  iconDelete: {
    color: theme.palette.primary.light,
  },
  root: {
      "& .MuiAccordionSummary-expandIcon.Mui-expanded": {
        transform: "rotate(45deg)",
      }
    }
}));

const DragHandle = SortableHandle(() => (
  <span tabIndex={0}>
    <IconButton variant="outlined" size="small">
      {<DragHandleIcon color="primary" style={{ cursor: "move" }} />}
    </IconButton>
  </span>
));



export const CommonComponentAccordion = ({
  data,
  color = "default",
  form,
  title_no_data = "",
  isDraggable = false,
  key,
  isPermission,
  isDetailPlan,
  isElastic = false,
  titlePermission,
  isReserva = false,
  setExpanded,
  marginSize = 10,
  mb = "mb-1",
  isSession,
  isExercise,
  isInfoSessionCreating,
  expanded,
  isDetail = false,
  onDelete,
  onEditSession,
  permissionsActions,
  isSailAvailable,
  rotateX=false
}) => {
  const classes = useStyles();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
 
  return (
    <div className={`${!isSailAvailable && mb} ${!!rotateX && classes.root}`} style={{ width: "100%", margin: !isSailAvailable ? marginSize : 0 } }>
      <Accordion
        TransitionProps={{ unmountOnExit: true }}
        key={`panel - ${data && data?.role_id
          ? data?.role_id
          : data?.id
            ? data?.id
            : data?.uuid
              ? data?.uuid
              : data?.user_id
                ? data.user_id
                : ""
          }`}
        expanded={
          expanded ===
          `panel${data && data.role_id
            ? data.role_id
            : data && data.id
              ? data.id
              : data && data.uuid
                ? data.uuid
                : ""
          }`
        }
        onChange={handleChange(
          `panel${data && data.role_id
            ? data.role_id
            : data && data.id
              ? data.id
              : data && data.uuid
                ? data.uuid
                : ""
          }`
        )}


      >
        {isReserva ? (
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.box}>
              <Avatar>{`${data?.first_name.charAt(0)}${data?.last_name.charAt(
                0
              )}`}</Avatar>
              <Typography
                variant="p"
                className="mx-5"
                style={{ width: 200 }}
              >{`${data?.first_name} ${data?.last_name}`}</Typography>
              <Typography variant="p" className="mx-5" style={{ width: 50 }}>
                {data?.document_external_code}
              </Typography>
              <Typography variant="p" className="mx-5" style={{ width: 100 }}>
                {data?.document_number}
              </Typography>
              <Typography variant="p" className="mx-5" style={{ width: 200 }}>
                {data?.email}
              </Typography>
              <Button
                component={Link}
                to={`/create-plan-training-for-afiliate/${data?.document_number}`}
                className={classes.boxItem}
              >
                Crear Plan
              </Button>
            </div>
          </AccordionSummary>
        ) : isSession || isExercise ? (
          <AccordionSummary
            expandIcon={
              !onDelete ? (
                <IconButton color={color} variant="outlined" size="small">
                  {data || isDetail ? <ExpandMoreIcon /> : <AddIcon />}
                </IconButton>
              ) : (
                <IconButton color={color} variant="outlined" size="small">
                  {<ExpandMoreIcon />}
                </IconButton>
              )
            }
          >
            <ItemHeaderResumeSession
              data={data}
              isExercise={isExercise}
              onDelete={onDelete}
              isDetailPlan={isDetailPlan}
              permissionsActions={permissionsActions}
            />
          </AccordionSummary>
        ) : isPermission ? (
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{titlePermission}</Typography>
          </AccordionSummary>
        ) : !isSailAvailable ? (
          <AccordionSummary
            style={{
              backgroundColor:
                !data && !isDetail && !expanded
                  ? "#ECECEB"
                  : !!expanded === `panel${data ? data.id : ""}`
                    ? "#FFFFFF"
                    : "",
              borderRadius: '10px',
            }}
            expandIcon={
              !onDelete && (
                <IconButton color={color} variant="outlined" size="small"            >
                  {data || isDetail ? <ExpandMoreIcon /> : <AddIcon />}
                </IconButton>

              )

            }
            id={`panel${data ? data.id : ""}`}

          >
            <div className="d-flex align-items-center ">
              {data && !isDetail && data.id && !isInfoSessionCreating && (
                <Button
                  color="secondary"
                  variant="contained"
                  className="me-5"
                  size="small"
                >
                  {isDraggable ? (
                    <DragHandle />
                  ) : isElastic ? (
                    data.external_code
                  ) : (
                    data.id
                  )}
                </Button>
              )}

              <Typography
                className={classes.heading}
                style={{ width: isInfoSessionCreating ? 145 : "100%" }}
              >
                {data
                  ? data?.name || data?.label || data?.description
                  : title_no_data}
              </Typography>
              {onDelete && (
                <ListItemSecondaryAction style={{ marginRight: 35 }}>
                  <IconButton
                    variant="outlined"
                    size="small"
                    onClick={onDelete}
                  >
                    <CloseIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}

              {onEditSession && (
                <ListItemSecondaryAction style={{ marginRight: 35 }}>
                  <IconButton
                    variant="outlined"
                    style={{ marginTop: 8 }}
                    size="small"
                    onClick={onEditSession}
                  >
                    <IconEdit />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </div>
          </AccordionSummary>
        )
          :
          (
            <div className='row mx-0'>
              <AccordionSummary
              className="px-0"
              style={{ borderBottom: '1px solid #ECECEB'}}
              id={`panel${data ? data.id : ""}`}
            >
              <div className='col-6 px-0 my-auto'>
                <Typography
                  style={{ width: isInfoSessionCreating ? 145 : "100%", fontWeight: 'bold' }}
                >
                  {data
                    ? data?.name || data?.label || data?.description
                    : title_no_data}
                </Typography>
              </div>
              <div className='col-6 px-0 my-auto' style={{textAlign:'end'}}>
                <SwitchCustom
                  checked={expanded}
                  onChange={!setExpanded}
                  name="checkedA"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                </div>

            </AccordionSummary>
            </div>
            
          )

        }
        
        <AccordionDetails className={`${!!isSailAvailable && 'px-0 py-0 pt-3'}`} >
{          !isSailAvailable ? (expanded && <div className="container-fluid p-3" style={{width:'80%'}}>{form}</div>) : <div className="col-12 pb-3"style={{ borderBottom: '1px solid #ECECEB' }}>{form}</div>}        
        </AccordionDetails>

      </Accordion>
    </div>
  );
};
