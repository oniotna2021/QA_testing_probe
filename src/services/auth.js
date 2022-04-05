import { axiosInstance, axiosInstanceWebPage } from "./instance";

const loginService = (user, pass) => {
  return new Promise((resolve, reject) => {
    //URL Web
    axiosInstanceWebPage
      .post("/oauth/tokenMyBodyTech", {
        grant_type: "password",
        client_id: process.env.REACT_APP_CLIENT_ID_LOGIN,
        client_secret: process.env.REACT_APP_CLIENT_SECRET_LOGIN,
        username: user,
        password: pass,
      })
      .then(async ({ data, headers }) => {
        if (data && data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          localStorage.setItem(
            "organization_id",
            headers["x-bodytech-organization"]
          );
          localStorage.setItem("brands", headers["x-bodytech-brand"]);

          const brandId = JSON.parse(headers["x-bodytech-brand"])[0].brand_id;
          const companyId = JSON.parse(headers["x-bodytech-brand"])[0]
            .uuid_company;

          localStorage.setItem("brand_id", brandId);
          localStorage.setItem("company_id", companyId);

          //URL MYBT
          const resultProfile = await profileService();
          if (
            resultProfile &&
            resultProfile.data &&
            resultProfile.data.status !== "error"
          ) {
            resultProfile.data.data.companyId = headers["x-bodytech-company"];
            resultProfile.data.data.companyOrganization =
              headers["x-bodytech-organization"];
            resultProfile.data.data.brands = JSON.parse(
              headers["x-bodytech-brand"]
            );
            resultProfile.data.data.brandId = brandId;
            resultProfile.data.data.companyId = companyId;
            resolve(resultProfile.data);
          } else {
            reject("Usuario o contraseña inválida");
          }
        } else {
          reject("Usuario o contraseña inválida");
        }
      })
      .catch((error) => {
        reject("Usuario o contraseña inválida");
      });
  });
};

const profileService = () => {
  return axiosInstance.post("authentication/profile");
};

const signUpService = () => {};

const logoutService = () => {};

const authUsersDW = (id, documentType, brandId = 1) => {
  return axiosInstanceWebPage.get(`getUserDw/${id}/${documentType}/${brandId}`);
};

export {
  loginService,
  signUpService,
  profileService,
  logoutService,
  authUsersDW,
};
