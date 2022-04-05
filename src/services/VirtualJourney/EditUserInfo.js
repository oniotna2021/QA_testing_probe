import { axiosInstance } from "../instance";

export const editUserInfo = (data) => {
  return axiosInstance.post(
    `authentication/userClient/update/${data.user_id}`,
    data.payload
  );
};
