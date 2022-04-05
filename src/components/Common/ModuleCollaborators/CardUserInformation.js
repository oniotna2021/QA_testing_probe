import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@material-ui/core/styles";
import { connect } from "react-redux";

// UI
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import {
  IconProfile,
  IconMenuCollaborators,
  IconEditItem,
  IconDiaryGeneral,
} from "assets/icons/customize/config";

// Components
import ScheduleVenue from "components/Shared/ScheduleVenue/ScheduleVenue";
import FormAddScheldule from "components/Common/ModuleCollaborators/FormEditScheduleCollaborator";
import ReusableAccordion from "components/Shared/ReusableAccordion/ReusableAccordion";

// Utils
import { useStyles } from "utils/useStyles";

import { ShardComponentModal } from "components/Shared/Modal/Modal";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "xs",
};

const CardUserInformation = ({
  dataUser,
  setFetchReload,
  idVenue,
  setReloadDataUser,
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [unmoundSchedule, setUnmountSchedule] = useState(true);

  const checkVariable = (value) => (value ? value : "----");

  return (
    <>
      <div>
        <div className={classes.cardDetailCollaborator}>
          <div className="d-flex justify-content-between">
            <div className="d-flex justify-content-between align-items-center">
              <div className="me-4">
                <IconProfile color={theme.palette.primary.light} />
              </div>

              <div>
                <Typography className={classes.textBold} variant="body1">
                  {t("DetailCollaborator.LabelIdentification")}
                </Typography>
              </div>
            </div>

            {/* <div>
                            <IconButton variant="outlined" size="medium" onClick={() => console.log("it works")}>
                                <IconEditItem color="#3C3C3B" width="25" height="25" />
                            </IconButton>
                        </div> */}
          </div>

          <div className="mt-4">
            <div className="row">
              <div className="col-6">
                <Typography variant="body2">
                  {t("DetailCollaborator.LabelName")}
                </Typography>
              </div>
              <div className="col-6">
                <Typography variant="body2">
                  {checkVariable(dataUser?.first_name)}
                </Typography>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-6">
                <Typography variant="body2">
                  {t("DetailAfiliate.LabelLastName")}
                </Typography>
              </div>
              <div className="col-6">
                <Typography variant="body2">
                  {checkVariable(dataUser?.last_name)}
                </Typography>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-6">
                <Typography variant="body2">
                  {t("FormProfessional.InputDocumentNumber")}
                </Typography>
              </div>
              <div className="col-6">
                <Typography variant="body2">
                  {checkVariable(dataUser?.document_number)}
                </Typography>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-6">
                <Typography variant="body2">
                  {t("DetailCollaborator.LabelBirthday")}
                </Typography>
              </div>
              <div className="col-6">
                <Typography variant="body2">
                  {checkVariable(dataUser?.birthdate)}
                </Typography>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-6">
                <Typography variant="body2">
                  {t("DetailCollaborator.LabelCellPhone")}
                </Typography>
              </div>
              <div className="col-6">
                <Typography variant="body2">
                  {checkVariable(dataUser?.phone_number)}
                </Typography>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-6">
                <Typography variant="body2">
                  {t("DetailVenue.Address")}
                </Typography>
              </div>
              <div className="col-6">
                <Typography variant="body2">
                  {checkVariable(dataUser?.address)}
                </Typography>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-6">
                <Typography variant="body2">
                  {t("ListProfessional.Email")}
                </Typography>
              </div>
              <div className="col-6">
                <Typography className={classes.textWrap} variant="body2">
                  {checkVariable(dataUser?.email)}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        <ReusableAccordion
          id={"1"}
          className={`mt-4`}
          BoxTitleCard={
            <div className="my-2 px-2 d-flex justify-content-between">
              <div className="d-flex justify-content-between align-items-center">
                <div className="me-4">
                  <IconMenuCollaborators color={theme.palette.primary.light} />
                </div>

                <div>
                  <Typography className={classes.textBold} variant="body1">
                    {t("DetailCollaborator.LabelPersonalInfo")}
                  </Typography>
                </div>
              </div>

              {/* <div>
                            <IconButton variant="outlined" size="medium" onClick={() => console.log("it works")}>
                                <IconEditItem color="#3C3C3B" width="25" height="25" />
                            </IconButton>
                        </div> */}
            </div>
          }
        >
          <div>
            <div className="row">
              <div className="col-6">
                <Typography variant="body2">
                  {t("DetailCollaborator.LabelArea")}
                </Typography>
              </div>
              <div className="col-6">
                <Typography variant="body2">
                  {checkVariable(dataUser?.area)}
                </Typography>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-6">
                <Typography variant="body2">
                  {t("DetailCollaborator.LabelRol")}
                </Typography>
              </div>
              <div className="col-6">
                <Typography variant="body2">
                  {checkVariable(dataUser?.profile_name)}
                </Typography>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-6">
                <Typography variant="body2">
                  {t("DetailCollaborator.LabelTypeContract")}
                </Typography>
              </div>
              <div className="col-6">
                <Typography variant="body2">
                  {checkVariable(dataUser?.type_contract_name)}
                </Typography>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-6">
                <Typography variant="body2">
                  {t("DetailCollaborator.LabelValue")}
                </Typography>
              </div>
              <div className="col-6">
                <Typography variant="body2">
                  {checkVariable(dataUser?.value)}
                </Typography>
              </div>
            </div>
          </div>
        </ReusableAccordion>

        <div className={`mt-4 ${classes.cardDetailCollaborator}`}>
          <div className="d-flex justify-content-between">
            <div className="d-flex justify-content-between align-items-center">
              <div className="me-4">
                <IconDiaryGeneral color={theme.palette.primary.light} />
              </div>

              <div>
                <Typography className={classes.textBold} variant="body1">
                  {t("DetailCollaborator.LabelScheduleCollaborator")}
                </Typography>
              </div>
            </div>

            <div>
              <IconButton
                variant="outlined"
                size="medium"
                onClick={() => setIsOpen(true)}
              >
                <IconEditItem
                  color={theme.palette.primary.light}
                  width="25"
                  height="25"
                />
              </IconButton>
            </div>
          </div>

          <div className="mt-1">
            {unmoundSchedule && Object.keys(dataUser).length > 0 && (
              <ScheduleVenue
                idVenue={idVenue}
                isUser={true}
                idUser={dataUser?.id}
                scheduleVirtual={dataUser?.schedule_virtual}
                isView={true}
              />
            )}
          </div>
        </div>
      </div>

      <ShardComponentModal
        {...modalProps}
        body={
          <FormAddScheldule
            setUnmountSchedule={setUnmountSchedule}
            setLoad={setFetchReload}
            idUser={dataUser?.id}
            scheduleVirtual={dataUser?.schedule_virtual}
            currentVenueId={idVenue}
            isEdit={true}
            setIsOpen={setIsOpen}
            setReloadDataUser={setReloadDataUser}
          />
        }
        isOpen={isOpen}
      />
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  idVenue: auth.venueIdDefaultProfile,
});

export default connect(mapStateToProps)(CardUserInformation);
