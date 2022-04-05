import { axiosInstanceGeneralConfig } from '../instance';

export const getActivityCategoryById = (id) => {
    return axiosInstanceGeneralConfig.get(`type-activity/uuid/${id}`);
}

export const getAllActivityCategory = () => {
    return axiosInstanceGeneralConfig.get('type-activity/all')
}

export const getActivityCategoryPagination = (limit, page) => {
    return axiosInstanceGeneralConfig.get(`activity?limit=${limit}&page=${page}`)
}

export const postActivityCategory = (data) => {
    return axiosInstanceGeneralConfig.post('type-activity', data)
}

export const putActivityCategory = (data, id) => {
    return axiosInstanceGeneralConfig.put(`type-activity/uuid/${id}`, data)
}

export const deleteActivityCategory = (id) => {
    return axiosInstanceGeneralConfig.delete(`type-activity/uuid/${id}`)
}