import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_PUBLIC_API,
});

export const serverInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

export const axiosInstanceWebPage = axios.create({
  baseURL: process.env.REACT_APP_API_AUTH_URL,
});

export const axiosInstanceGeneralConfig = axios.create({
  baseURL: process.env.REACT_APP_API_GENERAL_CONFIG_URL,
});

export const axiosInstanceReservation = axios.create({
  baseURL: process.env.REACT_APP_API_RESERVATIONS_URL,
});

export const axiosInstanceProducts = axios.create({
  baseURL: process.env.REACT_APP_API_PRODUCTS_URL,
});

export const axiosInstancePayments = axios.create({
  baseURL: process.env.REACT_APP_API_PAYMENTS_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const currentUser = localStorage.getItem("access_token") || "";
    if (currentUser) {
      config.headers["Authorization"] = `Bearer ${currentUser}`;
      config.headers["x-bodytech-company"] =
        localStorage.getItem("company_id") ||
        "006629fa-6aae-4c02-b28f-5264387199bb";
      config.headers["x-bodytech-brand"] =
        localStorage.getItem("brand_id") || 1;
      config.headers["x-bodytech-organization"] =
        localStorage.getItem("organization_id");
      config.headers["X-Bodytech-Virtual"] =
        localStorage.getItem("is_virtual") || 0;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstanceWebPage.interceptors.request.use(
  (config) => {
    const currentUser = localStorage.getItem("access_token") || "";
    if (currentUser) {
      config.headers["Authorization"] = `Bearer ${currentUser}`;
      config.headers["x-bodytech-company"] =
        localStorage.getItem("company_id") ||
        "006629fa-6aae-4c02-b28f-5264387199bb";
      config.headers["x-bodytech-brand"] =
        localStorage.getItem("brand_id") || 1;
      config.headers["x-bodytech-organization"] =
        localStorage.getItem("organization_id");
      config.headers["X-Bodytech-Virtual"] =
        localStorage.getItem("is_virtual") || 0;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstanceGeneralConfig.interceptors.request.use(
  (config) => {
    const currentUser = localStorage.getItem("access_token") || "";

    if (currentUser) {
      config.headers["Authorization"] = `Bearer ${currentUser}`;
      config.headers["x-bodytech-company"] =
        localStorage.getItem("company_id") ||
        "006629fa-6aae-4c02-b28f-5264387199bb";
      config.headers["x-bodytech-brand"] =
        localStorage.getItem("brand_id") || 1;
      config.headers["x-bodytech-organization"] =
        localStorage.getItem("organization_id");
      config.headers["X-Bodytech-Virtual"] =
        localStorage.getItem("is_virtual") || 0;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstanceReservation.interceptors.request.use(
  (config) => {
    const currentUser = localStorage.getItem("access_token") || "";

    if (currentUser) {
      config.headers["Authorization"] = `Bearer ${currentUser}`;
      config.headers["x-bodytech-company"] =
        localStorage.getItem("company_id") ||
        "006629fa-6aae-4c02-b28f-5264387199bb";
      config.headers["x-bodytech-brand"] =
        localStorage.getItem("brand_id") || 1;
      config.headers["x-bodytech-organization"] =
        localStorage.getItem("organization_id");
      config.headers["X-Bodytech-Virtual"] =
        localStorage.getItem("is_virtual") || 0;
    }

    if (config.headers["X-Bodytech-Virtual-Option"]) {
      config.headers["X-Bodytech-Virtual"] =
        config.headers["X-Bodytech-Virtual-Option"] || 0;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstanceProducts.interceptors.request.use(
  (config) => {
    const currentUser = localStorage.getItem("access_token") || "";
    if (currentUser) {
      config.headers["Authorization"] = `Bearer ${currentUser}`;
      config.headers["x-bodytech-company"] =
        localStorage.getItem("company_id") ||
        "006629fa-6aae-4c02-b28f-5264387199bb";
      config.headers["x-bodytech-brand"] =
        localStorage.getItem("brand_id") || 1;
      config.headers["x-bodytech-organization"] =
        localStorage.getItem("organization_id");
      config.headers["X-Bodytech-Virtual"] =
        localStorage.getItem("is_virtual") || 0;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstancePayments.interceptors.request.use(
  (config) => {
    const currentUser = localStorage.getItem("access_token") || "";

    if (currentUser) {
      config.headers["Authorization"] = `Bearer ${currentUser}`;
      config.headers["x-bodytech-company"] =
        localStorage.getItem("company_id") ||
        "006629fa-6aae-4c02-b28f-5264387199bb";
      config.headers["x-bodytech-brand"] =
        localStorage.getItem("brand_id") || 1;
      config.headers["x-bodytech-organization"] =
        localStorage.getItem("organization_id");
      config.headers["X-Bodytech-Virtual"] =
        localStorage.getItem("is_virtual") || 0;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstanceWebPage.interceptors.response.use(
  (res) => res,
  (err) => {
    return new Promise((resolve, reject) => {
      const originalReq = err.config;
      if (err.response && err.response.data) {
        const messageStatus = err.response.data?.status;
        if (
          messageStatus === "expired_token" ||
          messageStatus === "invalid_request" ||
          messageStatus === "invalid_token"
        ) {
          let res = fetch(`${process.env.REACT_APP_API_AUTH_URL}oauth/token`, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify({
              grant_type:
                messageStatus === "expired_token"
                  ? "refresh_token"
                  : "client_credentials",
              client_id: process.env.REACT_APP_CLIENT_ID_LOGIN,
              client_secret: process.env.REACT_APP_CLIENT_SECRET_LOGIN,
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              localStorage.setItem("access_token", res.access_token);
              if (res.refresh_token) {
                localStorage.setItem("refresh_token", res.refresh_token);
              }
              originalReq.headers[
                "Authorization"
              ] = `Bearer ${res.access_token}`;
              return axiosInstanceWebPage(originalReq);
            });
          resolve(res);
        }
        reject(err.response.data);
      } else {
        reject(err.response);
      }
    });
  }
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    return new Promise((resolve, reject) => {
      const originalReq = err.config;
      if (err.response && err.response.data) {
        const messageStatus = err.response.data?.status;
        if (
          messageStatus === "expired_token" ||
          messageStatus === "invalid_request" ||
          messageStatus === "invalid_token"
        ) {
          let res = fetch(`${process.env.REACT_APP_API_AUTH_URL}oauth/token`, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify({
              grant_type:
                messageStatus === "expired_token"
                  ? "refresh_token"
                  : "client_credentials",
              client_id: process.env.REACT_APP_CLIENT_ID_LOGIN,
              client_secret: process.env.REACT_APP_CLIENT_SECRET_LOGIN,
              refresh_token: localStorage.getItem("refresh_token"),
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              localStorage.setItem("access_token", res.access_token);
              if (res.refresh_token) {
                localStorage.setItem("refresh_token", res.refresh_token);
              }
              originalReq.headers[
                "Authorization"
              ] = `Bearer ${res.access_token}`;
              return axiosInstance(originalReq);
            });
          resolve(res);
        }
        reject(err.response.data);
      } else {
        reject(err.response);
      }
    });
  }
);

axiosInstanceReservation.interceptors.response.use(
  (res) => res,
  (err) => {
    return new Promise((resolve, reject) => {
      const originalReq = err.config;
      if (err.response && err.response.data) {
        const messageStatus = err.response.data?.status;
        if (
          messageStatus === "expired_token" ||
          messageStatus === "invalid_request" ||
          messageStatus === "invalid_token"
        ) {
          let res = fetch(`${process.env.REACT_APP_API_AUTH_URL}oauth/token`, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify({
              grant_type:
                messageStatus === "expired_token"
                  ? "refresh_token"
                  : "client_credentials",
              client_id: process.env.REACT_APP_CLIENT_ID_LOGIN,
              client_secret: process.env.REACT_APP_CLIENT_SECRET_LOGIN,
              refresh_token: localStorage.getItem("refresh_token"),
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              localStorage.setItem("access_token", res.access_token);
              if (res.refresh_token) {
                localStorage.setItem("refresh_token", res.refresh_token);
              }
              originalReq.headers[
                "Authorization"
              ] = `Bearer ${res.access_token}`;
              return axiosInstance(originalReq);
            });
          resolve(res);
        }
        reject(err.response.data);
      } else {
        reject(err.response);
      }
    });
  }
);

axiosInstanceGeneralConfig.interceptors.response.use(
  (res) => res,
  (err) => {
    return new Promise((resolve, reject) => {
      const originalReq = err.config;
      if (err.response && err.response.data) {
        const messageStatus = err.response.data?.status;
        if (
          messageStatus === "expired_token" ||
          messageStatus === "invalid_request" ||
          messageStatus === "invalid_token"
        ) {
          let res = fetch(`${process.env.REACT_APP_API_AUTH_URL}oauth/token`, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify({
              grant_type:
                messageStatus === "expired_token"
                  ? "refresh_token"
                  : "client_credentials",
              client_id: process.env.REACT_APP_CLIENT_ID_LOGIN,
              client_secret: process.env.REACT_APP_CLIENT_SECRET_LOGIN,
              refresh_token: localStorage.getItem("refresh_token"),
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              localStorage.setItem("access_token", res.access_token);
              if (res.refresh_token) {
                localStorage.setItem("refresh_token", res.refresh_token);
              }
              originalReq.headers[
                "Authorization"
              ] = `Bearer ${res.access_token}`;
              return axiosInstance(originalReq);
            });
          resolve(res);
        }
        reject(err.response.data);
      } else {
        reject(err.response);
      }
    });
  }
);
