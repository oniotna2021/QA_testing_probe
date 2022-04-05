import { axiosInstance } from '../instance';

export const postImageRecipe = (data) => {
    return axiosInstance.post('image-recipe', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}