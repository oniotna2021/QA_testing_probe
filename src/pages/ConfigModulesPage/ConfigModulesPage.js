import React from "react";
//UI
import { useTheme } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import { Link } from "react-router-dom";

//Components
import TitlePage from "components/Shared/TitlePage/TitlePage";
import TitleCardIcon from "components/Shared/TitleCardIcon/TitleCardIcon";

//Icons
import { IconConfig, IconHeart } from "assets/icons/customize/config";

// HOCS
import ActionWithPermissions from "hocs/ActionWithPermissions";

const ConfigModulesPage = ({ routes }) => {
  const theme = useTheme();

  const optionsConfig = [
    {
      title: "Plan de Entrenamiento",
      icon: (
        <IconConfig
          color={theme.palette.primary.light}
          width="30"
          height="30"
        />
      ),
      path: "/config-training-plan",
      isPublic: false,
    },
    {
      title: "Historial Clinico",
      icon: (
        <IconHeart color={theme.palette.primary.light} width="30" height="28" />
      ),
      path: "/config-clinic-history",
      isPublic: false,
    },
    // {
    //   title: "Módulo Medico",
    //   icon: (
    //     <IconMedic color={theme.palette.primary.light} width="30" height="30" />
    //   ),
    //   items: [],
    //   path: "/config-users",
    // isPublic: false,
    // },
    {
      title: "Journey",
      icon: (
        <IconConfig
          color={theme.palette.primary.light}
          width="30"
          height="30"
        />
      ),
      path: "/config-journey",
      isPublic: false,
    },
    {
      title: "Módulos",
      icon: (
        <IconConfig
          color={theme.palette.primary.light}
          width="30"
          height="30"
        />
      ),
      path: "/config-modules",
      isPublic: false,
    },
    {
      title: "Tickets",
      icon: (
        <IconConfig
          color={theme.palette.primary.light}
          width="30"
          height="30"
        />
      ),
      path: "/config-tickets",
      isPublic: false,
    },
  ];

  return (
    <React.Fragment>
      <div className="container">
        <TitlePage title={"Configuración"} />
        <div className="row mt-4 gx-3">
          {optionsConfig.map((optionItem, idx) => (
            <ActionWithPermissions
              permissions={routes}
              path={optionItem.path}
              isPublic={optionItem.isPublic}
              key={idx}
            >
              <div
                key={idx}
                className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3 mb-3"
              >
                <Link
                  to={optionItem.path}
                  key={optionItem.path}
                  style={{ textDecoration: "none" }}
                >
                  <Card className="p-3 cardRoundIcon d-flex flex-column justify-content-center align-items-center">
                    <CardHeader
                      className="pb-1 pt-1"
                      title={
                        <TitleCardIcon
                          icon={optionItem.icon}
                          title={optionItem.title}
                        />
                      }
                    ></CardHeader>
                    <CardContent className="pb-1">
                      <Typography align="center" variant="h5">
                        {optionItem.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </ActionWithPermissions>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default ConfigModulesPage;
