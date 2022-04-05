import React, { useEffect, useState, useCallback } from "react";
import { useSnackbar } from "notistack";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import CachedIcon from "@material-ui/icons/Cached";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const ServiceWorkerWrapper = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [waitingWorker, setWaitingWorker] = useState({});
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);

  const refreshAction = useCallback(
    (key) => {
      //render the snackbar button
      const updateServiceWorker = () => {
        waitingWorker && waitingWorker.postMessage({ type: "SKIP_WAITING" });
        setNewVersionAvailable(true);
        window.location.reload();
      };

      return (
        <>
          <Button
            style={{ color: "#ffffff" }}
            size="small"
            onClick={updateServiceWorker}
            endIcon={<CachedIcon color="#ffffff" />}
          >
            <Typography color="#ffffff">Refrescar</Typography>
          </Button>
        </>
      );
    },
    [waitingWorker]
  );

  useEffect(() => {
    const onServiceWorkerUpdate = (registration) => {
      setWaitingWorker(registration && registration.waiting);
      setNewVersionAvailable(true);
    };

    if (process.env.NODE_ENV === "production") {
      serviceWorkerRegistration.register({ onUpdate: onServiceWorkerUpdate });
    }

    if (newVersionAvailable) {
      enqueueSnackbar("Una nueva versión fue lanzada", {
        persist: true,
        variant: "warning",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        action: refreshAction,
      });
    }
  }, [enqueueSnackbar, newVersionAvailable, waitingWorker, refreshAction]);

  return children;
};

export default ServiceWorkerWrapper;
