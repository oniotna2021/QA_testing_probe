import { axiosInstance } from "services/instance";

export const getListRecipes = () =>{
    return axiosInstance.get('recipes')
}

export const putRecipe = (id, data) => {
    return axiosInstance.put(`recipes/uuid/${id}`, data)
}

export const postRecipe = (data) => {
    return axiosInstance.post('recipes', data)
}

export const deleteRecipe = (id) => {
    return axiosInstance.post(`recipes/delete/${id}`)
}

export const getRecipeById = (id) => {
    return axiosInstance.get(`recipes/uuid/${id}`)
}
