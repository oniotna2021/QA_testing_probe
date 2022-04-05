import { axiosInstance } from '../instance';

export const getOneExercises = (id) => {
    return axiosInstance.get(`exercises/${id}`);
}

export const getExercises = (limit, page) => {
    return axiosInstance.get(`exercises?limit=${limit}&page=${page}`);
}



export const postExercises = (data) => {
    return axiosInstance.post('exercises', data);
}

export const putExercises = (id, data) => {
    return axiosInstance.put(`exercises/${id}`, data);
}

export const deleteExercises = (id) => {
    return axiosInstance.post(`exercises/delete/${id}`);
}