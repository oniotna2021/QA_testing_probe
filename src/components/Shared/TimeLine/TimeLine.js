import React, { useState } from "react";

//UI
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import Typography from "@material-ui/core/Typography";
import { IconTraining } from "assets/icons/customize/config";
import Button from "@material-ui/core/Button";
import { useTheme } from "@material-ui/core/styles";

//UTILS
import { useStyles } from "utils/useStyles";

//COMPONENTS
import ItemPhysical from "components/Shared/ItemPhysical/ItemPhysical";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import ItemMedicalSuggestionByUser from "pages/TrainingsConfigPage/ItemMedicalSuggestionbyUser";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

//services
import { downloadPDFHistoryVitale } from "services/MedicalSoftware/ActivityObservations";
import { Tooltip } from "@material-ui/core";

const TimeLine = ({
  time,
  text,
  item,
  isPhysical = false,
  dataPhysical,
  isSuggestion = false,
  idSuggestion = false,
  isObservation = false,
  isReason = false,
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [openSuggestion, setOpenSuggestion] = useState(false);
  const [loadFetch, setLoadFetch] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleOpenSuggestion = () => {
    setOpenSuggestion(true);
  };

  const downloadPDFVitale = () => {
    setLoadFetch(true);
    downloadPDFHistoryVitale(item?.user_id, item?.id)
      .then((blob) => {
        const file = new Blob([blob.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(encodeURI(fileURL));
        setLoadFetch(false);
      })
      .catch(({ err }) => {
        console.log(err);
        setLoadFetch(false);
      });
  };

  return (
    <React.Fragment>
      <Timeline align="left" style={{ margin: 0, padding: 0, width: "40%" }}>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <div
              className={
                isSuggestion
                  ? classes.itemHistoryActivitySuggestion
                  : classes.itemHistoryActivity
              }
            >
              <div className="d-flex flex-column">
                <Typography
                  style={{ fontWeight: "bold", fontSize: "12px" }}
                >{`${time}`}</Typography>
                <Typography
                  variant="body2"
                  style={
                    isSuggestion
                      ? { width: "100%" }
                      : { textAlign: "justify", width: "550px" }
                  }
                >
                  {isSuggestion ? (
                    `${text}`
                  ) : isPhysical ? (
                    text
                  ) : isReason ? (
                    text
                  ) : isObservation ? (
                    item?.is_migrated_vytale === 1 ? (
                      <div
                        style={{
                          width: "100%",
                          height: "150px",
                          overflowY: "scroll",
                        }}
                        dangerouslySetInnerHTML={{ __html: text }}
                      ></div>
                    ) : (
                      <Tooltip title={item.observation}>
                        <Typography variant="body2" noWrap>
                          {item.observation}
                        </Typography>
                      </Tooltip>
                    )
                  ) : null}
                </Typography>
                {isSuggestion ? (
                  <div className="d-flex justify-content-end  ">
                    <Button onClick={handleOpenSuggestion}>
                      <IconTraining color={theme.palette.black.main} />
                      <Typography variant="body2">Ver ficha</Typography>
                    </Button>
                  </div>
                ) : isObservation && item.is_migrated_vytale === 1 ? (
                  <div className="d-flex justify-content-end mt-3">
                    <ButtonSave
                      typeButton="button"
                      onClick={downloadPDFVitale}
                      text={"PDF"}
                      loader={loadFetch}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
      {isPhysical ? (
        <div className="d-flex justify-content-end" style={{ width: "650px" }}>
          <Button onClick={handleOpen}>
            <IconTraining color={theme.palette.black.main} />
            <Typography variant="body2">Ver ficha</Typography>
          </Button>
        </div>
      ) : null}
      <ShardComponentModal
        body={<ItemPhysical setIsOpen={setIsOpen} data={dataPhysical} />}
        isOpen={isOpen}
      />
      <ShardComponentModal
        body={
          <ItemMedicalSuggestionByUser
            setIsOpen={setOpenSuggestion}
            isDetail={true}
            idSuggestion={idSuggestion}
          />
        }
        isOpen={openSuggestion}
      />
    </React.Fragment>
  );
};

export default TimeLine;
