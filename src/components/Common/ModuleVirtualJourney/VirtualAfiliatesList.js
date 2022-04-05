import React, { useState } from "react";
import { connect } from "react-redux";

// UI
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { useTheme } from "@material-ui/core/styles";

// components
import AfiliateCard from "./Cards/AfiliateCard";
import Loading from "components/Shared/Loading/Loading";
import ButtonConsultDeporwinUser from "components/Shared/ButtonConsultDeporwinUser/ButtonConsultDeporwinUser";

// hooks
import useCheckWithDeporwin from "hooks/useCheckWithDeporwin";
import { useGetAfiliatesList } from "hooks/CachedServices/VirtualJourney/Afiliates";

// utils
import { useStyles } from "utils/useStyles";
import { Autocomplete } from "@material-ui/lab";

// translate
import { useTranslation } from "react-i18next";

// services
import { searchAfiliatesService } from "services/affiliates";

const listTypesQuotes = [
  // {
  //   name: "Bienvenida My coach",
  //   id: 6,
  // },
  {
    name: "Seguimiento My coach",
    id: 7,
  },
  {
    name: "Cierre my coach",
    id: 8,
  },
  // {
  //   name: "Bienvenida nutrición",
  //   id: 9,
  // },
  {
    name: "Seguimiento My coach nutrición",
    id: 10,
  },
  {
    name: "Cierre my coach nutrición",
    id: 11,
  },
];

const VirtualAfiliatesList = ({ brandId, listTypeDocuments }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [selectedQuoteType, setSelectedQuoteType] = useState([]);
  const [userPlan, setUserPlan] = useState(2);
  const theme = useTheme();

  // search by document state
  const [documentUser, setDocumentUser] = useState();
  const [data, setData] = useState([]);

  // check user with deporwin
  const [typeDocument, setTypeDocument] = useState(
    listTypeDocuments ? listTypeDocuments[0]?.id : 0
  );
  const {
    errorUserNotFound,
    setErrorUserNotFound,
    errorUser,
    loadingFetchingUserDW,
    handleAuthDW,
    setErrorUser,
  } = useCheckWithDeporwin(brandId);

  const { swrData, isLoading } = useGetAfiliatesList(
    userPlan,
    selectedQuoteType
  );

  const handlePlanChange = (event, newAlignment) => {
    setUserPlan(newAlignment);
  };

  // get user data
  const setFilterValue = (value) => {
    if (value.length === 0) {
      setDocumentUser("");
      setErrorUser("");
      setErrorUserNotFound(false);
      setData([]);
      return;
    }

    setData([]);
    setDocumentUser(value);

    searchAfiliatesService(value)
      .then(({ data }) => {
        if (data && data.data) {
          if (data?.data?.length > 0) {
            setErrorUser("");
            setErrorUserNotFound(false);
            setData(data.data);
            return;
          }
          setErrorUserNotFound(true);
          setErrorUser("Usuario no encontrado");
        }
      })
      .catch((err) => {
        setErrorUserNotFound(true);
        setErrorUser("Usuario no encontrado");
      });
  };

  const handleClickCheckDeporwin = () => {
    const callBack = (data) => {
      setData([data]);
      setErrorUserNotFound(false);
    };
    handleAuthDW(documentUser, typeDocument, callBack);
  };

  return (
    <div className="container">
      <Typography variant="h5" className="mb-3">
        {t("Affiliates.Title")}
      </Typography>
      <div>
        <Autocomplete
          onChange={(_, data) => {
            setSelectedQuoteType(data);
          }}
          multiple={true}
          style={{ width: 250, maxWidth: 300, marginBottom: 20 }}
          options={listTypesQuotes}
          getOptionLabel={(option) => option?.name}
          renderOption={(option) => (
            <React.Fragment>
              <Typography variant="body2">{option?.name}</Typography>
            </React.Fragment>
          )}
          renderInput={(params) => (
            <TextField {...params} label={"Tipo de cita"} variant="outlined" />
          )}
        />

        <div className="d-flex justify-content-between mb-5">
          <ToggleButtonGroup
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
            exclusive
            value={userPlan}
            onChange={handlePlanChange}
          >
            <ToggleButton
              className={classes.grayButtonJourney}
              value={2}
              style={{
                borderRadius: 10,
                border: "solid .1px #F3F3F3",
                maxHeight: 40,
              }}
            >
              <div className="d-flex">
                <Typography className="me-2" style={{ fontSize: 13 }}>
                  <b>{t("Affiliates.Number")}</b>
                </Typography>
                <Typography style={{ fontSize: 13 }}>
                  {swrData?.n_affiliates}
                </Typography>
              </div>
            </ToggleButton>

            <ToggleButton
              className={classes.grayButtonJourney}
              value={1}
              style={{
                borderRadius: 10,
                border: "solid .1px #F3F3F3",
                maxHeight: 40,
              }}
            >
              <div className="d-flex">
                <Typography className="me-2" style={{ fontSize: 13 }}>
                  <b>{t("Affiliates.WithPlan")}</b>
                </Typography>
                <Typography style={{ fontSize: 13 }}>
                  {swrData?.with_plan}
                </Typography>
              </div>
            </ToggleButton>

            <ToggleButton
              className={classes.grayButtonJourney}
              value={0}
              style={{
                borderRadius: 10,
                border: "solid .1px #F3F3F3",
                maxHeight: 40,
              }}
            >
              <div className="d-flex">
                <Typography className="me-2" style={{ fontSize: 13 }}>
                  <b>{t("Affiliates.WithoutPlan")}</b>
                </Typography>
                <Typography style={{ fontSize: 13 }}>
                  {swrData?.no_plan}
                </Typography>
              </div>
            </ToggleButton>
          </ToggleButtonGroup>
          <div>
            <div className="me-3 d-flex mb-2">
              {errorUserNotFound && (
                <FormControl
                  variant="outlined"
                  className="me-2"
                  style={{ width: 100 }}
                >
                  <InputLabel id="select_type_document">
                    {t("FormAppointmentByMedical.InputType")}
                  </InputLabel>
                  <Select
                    labelId="select_type_document"
                    label={t("FormAppointmentByMedical.InputType")}
                    defaultValue={10}
                    onChange={(e) => {
                      setTypeDocument(e.target.value);
                    }}
                    value={typeDocument}
                  >
                    {listTypeDocuments &&
                      listTypeDocuments.map((res) => (
                        <MenuItem key={res.id} value={res.id}>
                          {res.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}

              <TextField
                label={t("VirtualAfiliateList.DocumentNumber")}
                variant="outlined"
                style={{ width: 150, marginRight: 20 }}
                onChange={(e) => {
                  setFilterValue(e.target.value);
                }}
              />

              <ButtonConsultDeporwinUser
                styles={{ height: 58, width: 100 }}
                errorUserNotFound={errorUserNotFound}
                handleClick={handleClickCheckDeporwin}
                loading={loadingFetchingUserDW}
                bgColor={theme.palette.secondary.light}
              />
            </div>
            <span>{errorUser}</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {data.length > 0
            ? data?.map((user) => (
                <AfiliateCard
                  key={user.user_id}
                  {...user}
                  isFromDocumentSearch
                  isFrom360
                />
              ))
            : swrData?.items?.map((user) => (
                <AfiliateCard key={user.user_id} {...user} isFrom360 />
              ))}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ auth, global }) => ({
  brandId: auth.brandId,
  listTypeDocuments: global.typesDocuments,
});

export default connect(mapStateToProps)(VirtualAfiliatesList);
