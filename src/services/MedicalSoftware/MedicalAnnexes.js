import { axiosInstance } from '../instance';

export const postMedicalAnnexes = (data) => {
    return axiosInstance.post('medicalAnnex', data, {
        headers: {
            'Content-Type': 'application/pdf'
        }, responseType: 'blob'
    })
}

export const getMedicalHistory = (id_quote) => {
    return axiosInstance.get(`medicalHistory/quote/${id_quote}`, {
        headers: {
            'Content-Type': 'application/pdf'
        }, responseType: 'blob'
    })
}

