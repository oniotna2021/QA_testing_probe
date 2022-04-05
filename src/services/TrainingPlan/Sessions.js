import { axiosInstance } from '../instance';

export const getOneSessions = (uuid) => {
    return axiosInstance.get(`sessions/${uuid}`);
}

export const getSessionsForTrainer = (id, limit = 10, page = 1) => {
    return axiosInstance.get(`sessions/trainer/${id}?limit=${limit}&page=${page}`);
}


export const getSessionsForDailyTraining = (limit = 10, page = 1) => {
    return axiosInstance.get(`sessions/daily-training?limit=${limit}&page=${page}`);
}

export const getSessionsForGoalsTraining = (limit = 10, page = 1) => {
    return axiosInstance.get(`sessions/sessions-by-goals?limit=${limit}&page=${page}`);
}


export const getSessions = () => {
    return axiosInstance.get('sessions');
}

export const createSession = (data) => {
    return axiosInstance.post('sessions', data);
}

export const putSessions = (data, id) => {
    return axiosInstance.put(`sessions/${id}`, data);
}

export const deleteSessions = (id) => {
    return axiosInstance.post(`sessions/delete/${id}`);
}