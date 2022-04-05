import { axiosInstance } from '../instance';

export const createTrainingPlan = (data) => {
    return axiosInstance.post(`training-plans`, data);
}

export const updateTrainingPlan = (uuid, data) => {
    return axiosInstance.post(`training-plans/${uuid}`, data);
}


export const getTrainingsPlansForTrainer = (idTrainer, limit = 20, page = 1) => {
    return axiosInstance.get(`training-plans/pag/trainer/${idTrainer}?limit=${limit}&page=${page}`);
}
