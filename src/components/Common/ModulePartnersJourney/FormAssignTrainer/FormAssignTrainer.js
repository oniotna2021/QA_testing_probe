import React, { useState } from "react";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";

// styled
import { useStyles } from "utils/useStyles";
import { CardAfiliate, ButtonAssign } from "./FormAssignTrainer.style";

// ui
import FormControl from "@material-ui/core/FormControl";

// components
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Loading from "components/Shared/Loading/Loading";

// hooks
import { useSearchCoach } from "hooks/useSearchCoach";

// services
import {
  postCarterization,
  putCarterization,
} from "services/VirtualJourney/Afiliates";

// utils
import { successToast, errorToast, mapErrors } from "utils/misc";

const FormAssignTrainer = ({
  dataUser,
  setOpenModal,
  assignCoach,
  reassignCoach,
  setIsCarterization,
  typePlan,
  brandId,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  // hook searchCoach
  const [setTerm, options, searchAll, isLoading] = useSearchCoach({
    typePlan,
    brandId,
  });

  // error
  const [error, setError] = useState(false);

  // capture coach user_id
  const [captureCoachId, setCaptureCoachId] = useState(null);
  const [loaderCarterization, setLoaderCarterization] = useState(false);

  // Functions Carterization
  const handleCarterization = (value) => {
    if (value) {
      setLoaderCarterization(true);
      postCarterization({
        members_id: dataUser.member_id,
        users_id: Number(value._source.user_id),
      })
        .then(({ data }) => {
          if (data && data.status === "success" && data.data) {
            enqueueSnackbar(data.message, successToast);
            setIsCarterization((prev) => !prev);
          } else if (data.status === "error") {
            setError(true);
            enqueueSnackbar(mapErrors(data), errorToast);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setLoaderCarterization(false);
          if (error) {
            setOpenModal(true);
          } else {
            setOpenModal(false);
          }
        });
    }
  };

  const handleRecarterization = (value) => {
    if (value) {
      setLoaderCarterization(true);
      putCarterization({
        users_id: Number(value._source.user_id),
        members_id: dataUser.member_id,
      })
        .then(({ data }) => {
          if (data && data.status === "success" && data.data) {
            enqueueSnackbar(data.message, successToast);
            setIsCarterization((prev) => !prev);
          } else if (data.status === "error") {
            enqueueSnackbar(mapErrors(data), errorToast);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setLoaderCarterization(false);
          setOpenModal(false);
        });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <CardAfiliate>
            <div className="CardAfiliate-content">
              <p className="CardAfiliate-title">Usuarios</p>
              <div className="d-flex">
                <p>{dataUser.member_name}</p>
              </div>
            </div>
          </CardAfiliate>
          {assignCoach && <p>Selecciona el entrenador al que asignaras</p>}
          {reassignCoach && (
            <p>Selecciona el entrenador al que harás el traslado</p>
          )}
          <FormControl variant="outlined" className="my-2">
            <Autocomplete
              options={options}
              className={classes.listItem}
              placeholder={"Entrenadores disponibles"}
              defaultValue={{
                _source: {
                  first_name: dataUser.coach_name ?? "",
                  last_name: "",
                },
              }}
              getOptionLabel={(option) =>
                `${option._source.first_name + " " + option._source.last_name}`
              }
              onChange={(e, newValue) => {
                setCaptureCoachId(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => {
                    setTerm(e.target.value);
                  }}
                  label={"Entrenadores disponibles"}
                  variant="outlined"
                />
              )}
            />
          </FormControl>
          <div className="d-flex justify-content-between my-4">
            <Button
              style={{ width: "180px" }}
              onClick={() => setOpenModal(false)}
            >
              Cancelar
            </Button>
            {assignCoach && (
              <ButtonAssign onClick={() => handleCarterization(captureCoachId)}>
                {loaderCarterization ? (
                  <Loading />
                ) : (
                  <p style={{ margin: 0 }}>Asignar</p>
                )}
              </ButtonAssign>
            )}
            {reassignCoach && (
              <ButtonAssign
                onClick={() => handleRecarterization(captureCoachId)}
              >
                {loaderCarterization ? (
                  <Loading />
                ) : (
                  <p style={{ margin: 0 }}>Reasignar</p>
                )}
              </ButtonAssign>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  brandId: auth.brandId,
});

export default connect(mapStateToProps)(FormAssignTrainer);
