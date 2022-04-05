import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";

//COMPONENTS
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

//UI
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

//SERVICES
import {
  startQuote,
  initClinicalHistoryForced,
} from "services/MedicalSoftware/Quotes";
import { getTypeAppointmentByMedical } from "services/MedicalSoftware/MedicalProfesional";
import { getAllArgumentForce } from "services/MedicalSoftware/ArgumentForce";

//misc
import { errorToast, mapErrors } from "utils/misc";
import { format } from "date-fns";

const FormStartAppointment = ({
  setIsOpen,
  userDocument,
  venueIdDefaultProfile,
  medical_id,
  user_id,
}) => {
  let currentDate = format(new Date(), "yyyy-MM-dd");
  const { t } = useTranslation();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const optionsModality = [
    { id: 2, name: "Presencial" },
    { id: 1, name: "Virtual" },
  ];

  const [reasons, setReasons] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [dataTypeAppointment, setDataTypeAppointment] = useState([]);

  useEffect(() => {
    getAllArgumentForce().then(({ data }) => {
      if (data && data.status === "success") {
        setReasons(data?.data?.items);
      } else {
        setReasons([]);
      }
    });
    getTypeAppointmentByMedical(medical_id).then(({ data }) => {
      if (data.status === "success" && data.data && data.data.length > 0) {
        setDataTypeAppointment(data.data[0]);
      } else {
        setDataTypeAppointment([]);
      }
    });
  }, [medical_id]);

  const onInitHistory = (value) => {
    setLoadingFetch(true);
    let dataSubmit = {
      user_id: user_id,
      document_number_user: userDocument,
      type_quote: value.type_quote,
      modality: value.modality,
      medical_professional_id: medical_id,
      id_venue: venueIdDefaultProfile,
      date: currentDate,
      id_argument: value.id_argument,
    };
    initClinicalHistoryForced(dataSubmit)
      .then(({ data }) => {
        if (data && data.status === "success") {
          let dataStart = {
            medical_professional_id: medical_id,
            quote_id: Number(data.data.id),
            type_quote: data.data.type_quote,
            user_id: data.data.user_id,
            modality: data.data.modality,
          };
          startQuote(dataStart)
            .then(({ data }) => {
              if (data && data.status === "success") {
                history.push(
                  `/clinic-history/${Number(dataStart.quote_id)}/${
                    dataStart.type_quote
                  }/${dataStart.medical_professional_id}/${dataStart.user_id}/${
                    dataStart.modality
                  }`
                );
              } else {
                enqueueSnackbar(mapErrors(data), errorToast);
                setLoadingFetch(false);
              }
              setLoadingFetch(false);
            })
            .catch((err) => {
              enqueueSnackbar(mapErrors(err), errorToast);
            });
        } else {
          enqueueSnackbar(
            data.message[0].message ? data.message[0].message : data.message,
            errorToast
          );
          setLoadingFetch(false);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Typography variant="h6">{t("Affiliates.StartAppointment")}</Typography>
        <div style={{ marginRight: "12px" }}>
          <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
        </div>
      </div>
      <div className="row">
        <form onSubmit={handleSubmit(onInitHistory)}>
          <div className="col-12">
            <Controller
              rules={{ required: true }}
              control={control}
              name="type_quote"
              render={({ field }) => (
                <FormControl variant="outlined">
                  <InputLabel id="select_tipo_cita">Tipo de cita</InputLabel>
                  <Select
                    labelid="select_tipo_cita"
                    label="Tipo de cita"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  >
                    {dataTypeAppointment.appointment_tipes &&
                      dataTypeAppointment.appointment_tipes.map((res) => (
                        <MenuItem
                          key={res.name_appointment_type_id}
                          value={res.appointment_type_id}
                        >
                          {res.name_appointment_type_id}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
          <div className="col-12 mt-3">
            <Controller
              rules={{ required: true }}
              control={control}
              name="modality"
              render={({ field }) => (
                <FormControl variant="outlined">
                  <InputLabel id="select_modalidad">Modalidad</InputLabel>
                  <Select
                    labelId="select_modalidad"
                    label="Modalidad"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  >
                    {optionsModality.map((res) => (
                      <MenuItem key={res.name} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            {errors.modality && (
              <FormHelperText error>Campo requerido</FormHelperText>
            )}
          </div>
          <div className="col-12 mt-3">
            <Controller
              rules={{ required: true }}
              control={control}
              name="id_argument"
              render={({ field }) => (
                <FormControl variant="outlined">
                  <InputLabel id="select_hora">
                    Motivo de inicio de HC
                  </InputLabel>
                  <Select
                    labelId="select_hora"
                    label="Motivo de inicio de HC"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    {...field}
                  >
                    {reasons?.map((reason, idx) => (
                      <MenuItem key={idx} value={reason.id}>
                        {reason.description}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            {errors.hour && (
              <FormHelperText error>Campo requerido</FormHelperText>
            )}
          </div>
          <div className="d-flex justify-content-end mt-3">
            <ButtonSave text="Iniciar" loader={loadingFetch} />
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  venueIdDefaultProfile: auth.venueIdDefaultProfile,
  userId: auth.userId,
});

export default connect(mapStateToProps)(FormStartAppointment);
