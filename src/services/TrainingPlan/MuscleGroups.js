import { axiosInstance } from '../instance';

export const getOneMuscleGroups = (id) => {
    return axiosInstance.get(`musclegroups/${id}`);
}

export const getMuscleGroups = (limit = 20, page = 1) => {
    return axiosInstance.get(`musclegroups?limit=${limit}&page=${page}`);
}

export const postMuscleGroups = (data) => {
    return axiosInstance.post('musclegroups', data);
}

export const putMuscleGroups = (data, id) => {
    return axiosInstance.put(`musclegroups/${id}`, data);
}

export const deleteMuscleGroups = (id) => {
    return axiosInstance.post(`musclegroups/delete/${id}`);
}

export const orderListMuscleGroups = (data) => {
    return axiosInstance.put(`musclegroups/order`, data);
}