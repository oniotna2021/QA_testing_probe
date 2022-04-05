import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// date
import format from "date-fns/format";
import addDays from "date-fns/addDays";
import { es } from "date-fns/locale";

// UI
import { Card, Typography } from "@material-ui/core";

// components
import Loading from "../Loading/Loading";

// icons
import { IconDownloadForm } from "assets/icons/customize/config";

// services
import { getLastDateBodyCompositionAnalysis } from "services/VirtualJourney/Afiliates";

const PysycalValuation = () => {
  const savedForm = useSelector((state) => state.virtualJourney.welcomeForm);
  const { user_id } = useParams();
  const [lastRegistration, setLastRegistration] = useState();

  useEffect(() => {
    getLastDateBodyCompositionAnalysis(user_id)
      .then(({ data }) => {
        if (data && data.status === "success" && data.data) {
          setLastRegistration(data.data.substring(0, 10));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user_id, savedForm]);

  return (
    <Card className="my-3">
      <div className="row p-3 m-0">
        <div className="d-flex align-items-center">
          <IconDownloadForm color="#007771" />
          <Typography variant="h6" className="ms-2">
            Valoración física
          </Typography>
        </div>
        <div className="mb-2">
          {lastRegistration ? (
            <Typography style={{ fontWeight: "bold" }} variant="body2">
              Ultimo análisis:{" "}
              {lastRegistration ? (
                <span style={{ fontWeight: "normal" }}>
                  {`${format(
                    addDays(new Date(lastRegistration), 1),
                    "dd LLLL",
                    {
                      locale: es,
                    }
                  )} de ${format(
                    addDays(new Date(lastRegistration), 1),
                    "yyyy"
                  )}`}
                </span>
              ) : (
                <span style={{ fontWeight: "normal" }}>"Sin datos"</span>
              )}
            </Typography>
          ) : null}
        </div>

        {!savedForm ? (
          <div className="my-3">
            <Loading />
          </div>
        ) : (
          <div className="row m-0 mt-2">
            <div className="col-6 p-0">
              <Typography>Peso</Typography>
              <Typography>Estatura</Typography>
              {/* <Typography>ICM</Typography>
              <Typography>IMM</Typography> */}
              <Typography>Grasa</Typography>
              <Typography>Masa muscular</Typography>
              <Typography>Per. Abdominal</Typography>
            </div>
            <div className="col-4 p-0 ps-4 d-flex flex-column align-items-end">
              <Typography>
                {savedForm?.weight ? `${savedForm?.weight} KG` : "sin datos"}
              </Typography>
              <Typography>
                {savedForm?.height ? `${savedForm?.height} cm` : "sin datos"}
              </Typography>
              <Typography>
                {savedForm?.fat_percentage
                  ? `${savedForm?.fat_percentage}%`
                  : "sin datos"}
              </Typography>
              <Typography>
                {savedForm?.muscle_mass_percentage
                  ? `${savedForm?.muscle_mass_percentage}%`
                  : "sin datos"}
              </Typography>
              <Typography>
                {savedForm?.abdominal_perimeter
                  ? `${savedForm?.abdominal_perimeter} cm`
                  : "sin datos"}
              </Typography>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PysycalValuation;
