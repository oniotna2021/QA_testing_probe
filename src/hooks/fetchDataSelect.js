import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';

//Services
import { getTrainingElements } from 'services/TrainingPlan/TrainingElements';
import { getTrainingLevels } from 'services/TrainingPlan/TrainingLevels';
import { getMedicalConditions } from 'services/TrainingPlan/MedicalConditions';
import { getObjectives } from 'services/TrainingPlan/Objectives';
import { getTrainingPlaces } from 'services/TrainingPlan/TrainingPlaces';
import { getTrainingSteps } from 'services/TrainingPlan/TrainingSteps';
import { errorToast, mapErrors } from 'utils/misc';

export function useFecthDataRecursibe() {
    const { enqueueSnackbar } = useSnackbar();
    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        async function getData() {
            await Promise.all([getTrainingElements(), getTrainingLevels(), getMedicalConditions(), getObjectives(), getTrainingPlaces(), getTrainingSteps()])
                .then((response) => {
                    setDataSource(response.map(x => {
                        return { data: x.data.data.items }
                    }))
                }).catch((err) => {
                    enqueueSnackbar(mapErrors(err), errorToast);
                })
        }
        getData();
    }, [enqueueSnackbar])

    return dataSource
}