import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

//UI
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import { useTheme } from "@material-ui/core/styles";

//UTILS
import { useStyles } from "utils/useStyles";
import { defaultBrands } from "utils/misc";

//COMPONENTS
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import ItemMedicalSuggestionByUser from "pages/TrainingsConfigPage/ItemMedicalSuggestionbyUser";
import FormStartAppointment from "components/Shared/FormAppointment/FormStartAppointment";
import ItemNutritionalSuggestions from "../ItemNutritionalSuggestions/ItemNutritionalSuggestions";
import FormTrainingPlan from "../FormAppointment/FormTrainingPlan";
import FormReservationTrainer from "components/Common/ManageDetailAfiliate/FormReservationTrainer/FormReservationTrainer";

//REDUX
import { bindActionCreators } from "redux";
import { setNutrition } from "modules/nutrition";

//icons
import {
  IconMedical,
  IconForce,
  IconRecipes,
  IconProfile,
} from "assets/icons/customize/config";

const ItemUserList = ({
  data,
  userId,
  venueId,
  userNameRole,
  key,
  setNutrition,
  userType,
  userProfileId,
  availableBrands,
}) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const [openAppointment, setOpenAppointment] = useState(false);
  const [openAssignTrainer, setOpenAssignTrainer] = useState(false);
  const [openNutrition, setOpenNutrition] = useState(false);

  const userDocument = data.id ? data.id : data.user_id;

  const openModal = () => {
    setIsOpen(true);
  };

  const handleOpenAppointment = (e) => {
    e.stopPropagation();
    setOpenAppointment(true);
  };
  return (
    <div key={key}>
      <Accordion style={{ marginBottom: 10 }}>
        <AccordionSummary>
          <div className="row m-0">
            <div className="col-12 d-flex justify-content-between align-items-center p-0">
              <Avatar className="me-2"></Avatar>
              <Typography className="me-3" variant="p" style={{ width: 140 }}>
                {data.first_name} {data.last_name}{" "}
              </Typography>
              <Typography className="me-2" variant="p" >
                {data.document_external_code
                  ? data.document_external_code
                  : "CC"}
              </Typography>
              <Typography className="me-2" variant="p" >
                {data.document_number}
              </Typography>
              <Typography className="me-2" variant="p" >
                {data.email}
              </Typography>
              <Typography className="me-2" variant="p" >
                {data.brand_name
                  ? data.brand_name
                  : `${defaultBrands[data.brand_id]}`}
              </Typography>
              {userType === 3 && (
                <Button
                  className={`${classes.boxItem} me-2`}
                  onClick={handleOpenAppointment}
                >
                  Iniciar{" "}
                </Button>
              )}
              <Link
                style={{ textDecoration: "none", marginLeft: 30 }}
                to={`/detail-afiliate/${userDocument}`}
              >
                <IconButton
                  style={{ margin: 0 }}
                  className={classes.iconButton}
                  edge="end"
                  aria-label="add"
                >
                  <ArrowForwardIosIcon style={{ fontSize: 15 }} />
                </IconButton>
              </Link>
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="row">
            {/* Calendario Reserva Entrenador
            <div className="mx-5">
              <FormReservationTrainer />
            </div> */}
            <div className="col-12 d-flex justify-content-end">
              {(userNameRole === "Nutricionista" || userProfileId === 2) && (
                <Button
                  onClick={() => setOpenNutrition(true)}
                  className={classes.boxButton}
                  startIcon={<IconMedical color={theme.palette.black.main} />}
                >
                  <Typography variant="body2">His. Nutricional</Typography>
                </Button>
              )}
              {userNameRole === "Nutricionista" ||
              userProfileId === 2 ||
              userProfileId === 21 ||
              userProfileId === 26 ? (
                <Button
                  style={{ marginLeft: 40 }}
                  component={Link}
                  to={`/nutrition/${userDocument}`}
                  className={classes.boxButton}
                  onClick={() => setNutrition({})}
                  startIcon={<IconRecipes color={theme.palette.black.main} />}
                >
                  <Typography style={{ fontSize: 12 }}>
                    Crear plan nutricional
                  </Typography>
                </Button>
              ) : null}
              {(userType === 6 || userType === 14) && (
                <Button
                  className={classes.boxButton}
                  onClick={() => setOpenAssignTrainer(true)}
                  startIcon={<IconProfile color={theme.palette.black.main} />}
                >
                  <Typography variant="body2">Asignar Entrenador</Typography>
                </Button>
              )}
              <Button
                style={{ marginLeft: 40 }}
                onClick={openModal}
                className={classes.boxButton}
                startIcon={<IconMedical color={theme.palette.black.main} />}
              >
                <Typography variant="body2">Pres. Ejercicio</Typography>
              </Button>
              <Button
                style={{ marginLeft: 40 }}
                component={Link}
                to={`/create-plan-training-for-afiliate/${data.document_number}`}
                className={classes.boxButton}
                startIcon={<IconForce color={theme.palette.black.main} />}
              >
                <Typography variant="body2" style={{ textAlign: "center" }}>
                  Crear programa de Entrenamiento
                </Typography>
              </Button>
            </div>
          </div>
        </AccordionDetails>
        <ShardComponentModal
          fullWidth
          width="md"
          body={
            <ItemNutritionalSuggestions
              userDocument={data.document_number}
              setIsOpen={setOpenNutrition}
              userName={`${data.first_name} ${data.last_name}`}
              userId={data.id ? data.id : data.user_id}
            />
          }
          isOpen={openNutrition}
        />
        <ShardComponentModal
          body={
            <ItemMedicalSuggestionByUser
              userName={`${data.first_name} ${data.last_name}`}
              userDocument={data.document_number}
              idAfiliate={data.id ? data.id : data.user_id}
              setIsOpen={setIsOpen}
            />
          }
          isOpen={isOpen}
        />
        <ShardComponentModal
          handleClose={() => setOpenAssignTrainer(false)}
          body={
            <FormTrainingPlan
              user_id={data.id ? data.id : data.user_id}
              reload={""}
              setReload={""}
              isFormModal={true}
              setOpenAssignTrainer={setOpenAssignTrainer}
            />
          }
          isOpen={openAssignTrainer}
        />
        <ShardComponentModal
          fullWidth
          width="sm"
          body={
            <FormStartAppointment
              user_id={data.user_id}
              medical_id={userId}
              userName={`${data.first_name} ${data.last_name}`}
              userDocument={data.document_number}
              idAfiliate={data.id ? data.id : data.user_id}
              setIsOpen={setOpenAppointment}
              venueId={venueId}
            />
          }
          isOpen={openAppointment}
        />
      </Accordion>
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  isLoggingIn: auth.isLoggingIn,
  userNameRole: auth.userNameRole,
  userType: auth.userType,
  userProfileId: auth.userProfileId,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setNutrition }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ItemUserList);
