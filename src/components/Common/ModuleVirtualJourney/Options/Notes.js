import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";

// UI
import { Card, TextField, Typography } from "@material-ui/core";

// components
import Loading from "components/Shared/Loading/Loading";

// utils
import { successToast, errorToast, mapErrors } from "utils/misc";

// services
import { postNote } from "services/VirtualJourney/Notes";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import { getFormPDF } from "services/VirtualJourney/getFormPDF";

// hooks
import { useGetNotes } from "hooks/CachedServices/VirtualJourney/getNotes";

import { IconDownloadForm } from "assets/icons/customize/config";
import CustomizedProgressBars from "components/Shared/CustomizedProgressBars/CustomizedProgressBars";

const Notes = ({ isFrom360 }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { user_id, quote_id } = useParams();

  const [textNote, setTextNote] = useState();
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { swrData, isLoading, refreshData } = useGetNotes(user_id, quote_id);

  const handleNote = () => {
    setIsLoadingPost(true);
    const payload = {
      quote_id: quote_id,
      user_id: user_id,
      note: textNote,
    };

    postNote(payload)
      .then(({ data }) => {
        if (data.status === "success") {
          enqueueSnackbar("Guardado correctamente", successToast);
          refreshData();
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => enqueueSnackbar(mapErrors(err), errorToast))
      .finally(() => {
        setTextNote("");
        setIsLoadingPost(false);
      });
  };

  const donwloadPDF = () => {
    setIsDownloading(true);
    getFormPDF(quote_id)
      .then((blob) => {
        const file = new Blob([blob.data], {
          type: "application/pdf",
        });
        const fileURL = URL.createObjectURL(file);
        window.open(encodeURI(fileURL));
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      })
      .finally(() => setIsDownloading(false));
  };

  return (
    <>
      <div className="mb-3">{isDownloading && <CustomizedProgressBars />}</div>

      <div>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {!isFrom360 && (
              <>
                <TextField
                  className="mb-3"
                  multiline
                  rows={5}
                  value={textNote}
                  variant="outlined"
                  label={"Notas del Coach"}
                  onChange={(e) => setTextNote(e.target.value)}
                />
                <div className="d-flex justify-content-end">
                  <ButtonSave
                    text={t("Btn.save")}
                    loader={isLoadingPost}
                    onClick={handleNote}
                  />
                </div>
              </>
            )}

            <Typography variant="body1" className="mb-3">
              <b>{t("Notes.ModuleVirtualJourneyHistoryNotes")}</b>
            </Typography>

            {swrData.length > 0 ? (
              swrData?.map((note) => (
                <>
                  <Card
                    key={note.id}
                    style={{
                      backgroundColor: "#ECECEB",
                      padding: 20,
                      marginBottom: 10,
                    }}
                  >
                    <div className="d-flex justify-content-between mb-3">
                      <div>
                        <Typography>
                          <b>
                            {t("Notes.ModuleVirtualJourneyCoach")}{" "}
                            {note.coach_name}
                          </b>
                        </Typography>
                        <Typography variant="caption">
                          {note.appointment_type}
                        </Typography>
                      </div>

                      <Typography variant="caption">
                        {note.appointment_date_format}
                      </Typography>
                    </div>
                    <Typography variant="body1">{note.note}</Typography>
                  </Card>
                  {note.appointment_type_id !== 7 &&
                    note.appointment_type_id !== 10 && (
                      <div
                        onClick={donwloadPDF}
                        style={{
                          cursor: "pointer",
                          padding: "5px 10px 10px 10px",
                        }}
                        className="d-flex justify-content-end align-items-center"
                      >
                        <IconDownloadForm />
                        <Typography className="ms-2" variant="body2">
                          {t("Notes.ModuleVirtualJourneySeeForm")}
                        </Typography>
                      </div>
                    )}
                </>
              ))
            ) : (
              <div className="d-flex justify-content-center">
                <span style={{ color: "gray" }}>
                  {t("Notes.ModuleVirtualJourneyNotNotes")}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Notes;
