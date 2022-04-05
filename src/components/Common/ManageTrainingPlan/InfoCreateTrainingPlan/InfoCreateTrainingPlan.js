import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';

//UI
import DatePicker from 'components/Shared/DatePicker/DatePicker';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import FormControl from "@material-ui/core/FormControl";

//Internal dependencies
import { successToast } from 'utils/misc';

//Services
import { createTrainingPlan } from 'services/TrainingPlan/TrainingPlanCrud';

// Utils
import { errorToast, mapErrors } from 'utils/misc';

const InfoCreateTrainingPlan = ({ info, onClose, userId }) => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory()

    const { handleSubmit, control, formState: { errors } } = useForm();
    const [loadingFetchForm, setLoadingFetchForm] = useState(false);
    const [messageError, setMessageError] = useState('');

    const onSubmit = (data) => {
        setLoadingFetchForm(true);
        setMessageError('');
        const dataSource = {
            ...data,
            start_date: format(data.start_date_plan, 'yyyy-MM-dd'),
            end_date_plan: format(data.end_date_plan, 'yyyy-MM-dd'),
            user_id: info.dataInfoForSessionCreate.user.user_id,
            trainers_id: userId, //IMPORTANTE ACTUALIZAR ID ENTRENADOR
            training_days: info.dataInfoForSessionCreate.training_days.map(x => { return { id: x } }),
            number_sessions: info.dataInfoForSessionCreate.numberSessions,
            sessions: info.dataSessionsSelection.map(x => { return { id: x.id } })
        }
        createTrainingPlan(dataSource).then(({ data }) => {
            setLoadingFetchForm(false);
            if (data && data.status === "success") {
                onClose();
                enqueueSnackbar(data.message, successToast);
                history.push('/manage-training/plans-training')
            } else {
                setMessageError(data.message[0].message);
            }
        }).catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
        })
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">

                {/*<div className="col-12 mb-4">
                    <Controller
                        render={({ field }) =>s
                            <TextField {...field}
                                id="outlined-name-planTraininig"
                                label={t('TrainingPlan.nameCreate')}
                                variant="outlined" />
                        }
                        control={control}
                        defaultValue=""
                        error={errors.name ? true : false}
                        name="name"
                        rules={{ required: true }}
                    />
                    </div>*/}

                <div className="col-12 mb-3">
                    <Controller
                        render={({ field }) =>
                            <FormControl>
                                <DatePicker
                                    {...field}
                                    id="outlined-name-planTraininig"
                                    placeholder={t('TrainingPlan.dateInitPlanTraining')}
                                    onChange={(data) => field.onChange(data)}
                                />
                            </FormControl>
                        }
                        control={control}
                        defaultValue={null}
                        error={errors.start_date_plan ? true : false}
                        name="start_date_plan"
                        rules={{ required: true }}
                    />
                    <Controller
                        render={({ field }) =>
                            <FormControl>
                                <DatePicker
                                    {...field}
                                    id="outlined-name-planTraininig"
                                    placeholder={t('TrainingPlan.dateEndPlanTraining')}
                                    onChange={(data) => field.onChange(data)}
                                    className='mt-3'
                                />
                            </FormControl>
                        }
                        control={control}
                        defaultValue={null}
                        error={errors.end_date_plan ? true : false}
                        name="end_date_plan"
                        rules={{ required: true }}
                    />
                </div>

                {messageError && <Alert severity="error">{messageError}</Alert>}

                <div className="col-12 mb-2">
                    <div className="d-flex justify-content-end mt-4">
                        <Button disabled={loadingFetchForm} type="submit" color="primary" variant="contained">
                            {loadingFetchForm ?
                                <CircularProgress
                                    size={30}
                                    color="secondary" /> :
                                t('TrainingPlan.btnTitleCreate')
                            }</Button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default InfoCreateTrainingPlan
