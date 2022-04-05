import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';

//Services
import { getDailyFood } from 'services/MedicalSoftware/DailyFood';
import { getNutritionGoals } from 'services/MedicalSoftware/NutritionGoals';
import { getTypeAlimentation } from 'services/MedicalSoftware/TypeAlimentation';

import { errorToast, mapErrors } from 'utils/misc';

export function useFecthDataRecursibeNutricion() {
    const { enqueueSnackbar } = useSnackbar();
    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        async function getData() {
            await Promise.all([getNutritionGoals(), getTypeAlimentation(), getDailyFood()])
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