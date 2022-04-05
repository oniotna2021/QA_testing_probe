import { axiosInstance } from "services/instance";

export const getNutritionGoals = () => {
    return axiosInstance.get('nutrition-goals')
}

export const postNutritionGoal = (data) => {
    return axiosInstance.post('nutrition-goals', data)
}

export const putNutritionalGoal = (id, data) => {
    return axiosInstance.put(`nutrition-goals/${id}`, data)
}

export const deleteNutritionalGoal = (id) => {
    return axiosInstance.post(`nutrition-goals/delete/${id}`)
}