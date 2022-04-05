import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

// UI
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress'

// ICONS
import ScheduleIcon from '@material-ui/icons/Schedule';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { IconDownload } from 'assets/icons/customize/config';
import { IconButton } from '@material-ui/core';

//SERVICES
import { getMedicalHistory } from 'services/MedicalSoftware/MedicalAnnexes'

// Utils
import { errorToast, mapErrors } from 'utils/misc';

const AppointmentInformation = ({
  day,
  month,
  id_quote,
  hour,
  indicative,
  site,
  branch,
  title,
  name,
  type,
  citaActual,
  status,
  userType
}) => {

  const { enqueueSnackbar } = useSnackbar();
  const [loadingFetch, setLoadingFetch] = useState(false)

  const onSubmitClincalHistory = () => {
    setLoadingFetch(true)
    getMedicalHistory(id_quote).then((blob) => {
        const file = new Blob([blob.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(encodeURI(fileURL));
        setLoadingFetch(false)
    }).catch((err) => {
      enqueueSnackbar(mapErrors(err), errorToast);
    })
}

  return (
    <div className = 'col-12 mb-3' style = {{ backgroundColor: '#F3F3F3', borderRadius: '15px', padding: '17px 40px' }}>

      <div className = 'row d-flex justify-content-start align-items-center flex-wrap' >

        {/* FECHA | HORA */}
        <div className = 'col-3 mb-md-4 mb-lg-3 mb-xl-3 mb-xxl-1 mt-md-4 mt-lg-3 mb-xl-3 mt-xxl-1 d-flex justify-content-center align-items-center' style = {{ backgroundColor: 'rgb(230 136 89 / 30%)', borderRadius: '10px', padding: '10px 15px' }}>

          <div className = 'row d-flex justify-content-center align-items-center flex-nowrap'>
            <div className = 'col-md-4 col-lg-4 d-flex flex-xl-row flex-xxl-column justify-content-center align-items-center'>
              <Typography className="" variant="body2"><b>{ day }</b></Typography>
              <Typography className="" variant="body2">{ month }</Typography>
            </div>

            <div className = 'divider col-md-auto col-1' style = {{ backgroundColor: 'rgba(60, 60, 59, 0.6)', height: '2px', transform: 'rotate(90deg)' }}></div>

            <div className = 'col-md-4 col-lg-4 d-flex flex-xl-row flex-xxl-column justify-content-center align-items-center'>
              <Typography className="ms-1 me-1" variant="p"><b>{ hour}</b></Typography>
              <Typography className="ms-1 me-1" variant="p">{ indicative }</Typography>
            </div>
          </div>
          
        </div>

        {/* PRESENCIAL */}
        <div className = 'col-2 mb-md-4 mb-lg-3 mb-xl-3 mb-xxl-1'>
          <div className = 'row'>
            <div className = 'col-auto d-flex flex-column justify-content-center align-items-start'>
              <Typography className="" variant="body2"><b>{ site }</b></Typography>
              <Typography className="" variant="body2">{ branch }</Typography>
            </div>
          </div>
        </div>

        {/* ESTADO */}
        <div className = 'col-2 mb-md-4 mb-lg-3 mb-xl-3 mb-xxl-1'>
          <div className = 'row'>
            <div className = 'col-auto d-flex flex-column justify-content-center align-items-start'>
              <Typography className="" variant="body2"><b>Estado</b></Typography>
              <Typography className="" variant="body2">{ 
              status === 'started' 
              ? 'Iniciada' : status === 'active' 
              ? 'Creada' : status === 'programada' 
              ? 'Programada' :  status === 'canceled' 
              ? 'Cancelada' : status === 'not_attended' 
              ? 'No atendida' : status === 'system_terminated' 
              ? 'Finalizada por sistema' : status === 'finished' 
              ? 'Finalizada': ''  }
              </Typography>
            </div>
          </div>
        </div>

        {/* PROFESIONAL */}
        <div className = 'col-2 mb-md-4 mb-lg-3 mb-xl-3 mb-xxl-1'>
          <div className = 'row'>
            <div className = 'col-auto d-flex flex-column justify-content-center align-items-start'>
              <Typography className="" variant="p"><b>{ title }</b></Typography>
              <Typography className="" variant="p">{ name }</Typography>
            </div>
          </div>
        </div>

        {/* TAG CITA */}
        <div className = 'col-2 mb-md-4 mb-lg-3 mb-xl-3 mb-xxl-1 d-flex flex-column justify-content-center align-items-center' style = {{ backgroundColor: 'rgb(148 201 122 / 30%)', borderRadius: '10px', padding: '10px 20px' }}>
          <Typography className="" variant="p"><b>{ type }</b></Typography>
        </div>

        {/* ICON */}
        <div className = 'col-1 mb-md-4 mb-lg-3 mb-xl-3 mb-xxl-1 d-flex flex-column justify-content-center align-items-center'>
          {
            status !== 'finished' ? <ScheduleIcon /> : <CheckCircleOutlineIcon />
          }
          {userType === 3 && (status === 'system_terminated' || status === "finished") ? <IconButton onClick={onSubmitClincalHistory} disabled={loadingFetch}>{loadingFetch ? <CircularProgress size={15}/> : <IconDownload /> }</IconButton>:null}
        </div>
      </div>
    </div>
  )
}

export default AppointmentInformation;
