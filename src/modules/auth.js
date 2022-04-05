import { Cookies } from "react-cookie";
import { loginService, signUpService, profileService } from "../services/auth";

export const LOGIN_STATE_TOGGLE = "auth/LOGIN_STATE_TOGGLE";
export const LOGIN = "auth/LOGIN";
export const SIGN_UP_STATE_TOGGLE = "auth/SIGN_UP_STATE_TOGGLE";
export const SIGN_UP = "auth/SIGN_UP";
export const LOGOUT = "auth/LOGOUT";
export const SAVE_SIGNUP = "auth/SAVE_SIGNUP";
export const CHANGE_VENUE_PROFILE = "auth/CHANGE_VENUE_PROFILE";
export const CHANGE_CHECK_IS_VIRTUAL = "auth/CHANGE_CHECK_IS_VIRTUAL";
export const CHANGE_CHECK_IS_NOT_VIRTUAL = "auth/CHANGE_CHECK_IS_NOT_VIRTUAL";
export const GET_INFORMATION_USER = "auth/GET_INFORMATION_USER";
export const SET_DEFAULT_VENUE = "auth/SET_DEFAULT_VENUE";
export const SET_VENUES_USER = "auth/SET_VENUES_USER";
export const SET_BRAND_USER = "auth/SET_BRAND_USER";
export const SET_SHOULD_IS_VIRTUAL = "auth/SET_SHOULD_IS_VIRTUAL";
export const SET_COUNTRY_ID = "auth/SET_COUNTRY_ID";

const cookies = new Cookies();
const currentUser = cookies.get("user") || {};
const currentVenueUser = localStorage.getItem("venueUser")
  ? JSON.parse(localStorage.getItem("venueUser"))
  : 0;
const currentBrandId = localStorage.getItem("brand_id") || 1;
const currentCompanyId = localStorage.getItem("company_id") || 1;

const initialState = {
  isUserAuthenticated:
    cookies.get("user") && currentUser.organizationDefaultId ? true : false,
  isLoggingIn: false,
  isSigningUp: false,
  shouldIsVirtual: false,
  userEmail: currentUser.userEmail,
  userType: currentUser.userType ? currentUser.userType : 0,
  userNameRole: currentUser.userNameRole,
  userId: currentUser.userId,
  userProfileName: currentUser.userProfileName,
  userProfileId: currentUser.userProfileId,
  userStar: currentUser.userStar,
  availableBrands:
    localStorage.getItem("brands") &&
    localStorage.getItem("brands") !== "undefined"
      ? JSON.parse(localStorage.getItem("brands"))
      : [],
  venuesProfile:
    localStorage.getItem("venuesProfile") &&
    localStorage.getItem("venuesProfile") !== "undefined"
      ? JSON.parse(localStorage.getItem("venuesProfile"))
      : [],
  companyId: currentCompanyId,
  brandId: currentBrandId,
  companyDefaultId: currentUser.companyDefaultId || 1,
  companyBrandId: currentUser.companyBrandId || 1,
  organizationDefaultId: currentUser.organizationDefaultId,
  venueNameDefaultProfile:
    currentVenueUser.venueNameDefaultProfile ||
    currentUser.venueNameDefaultProfile,
  venueIdDefaultProfile: currentVenueUser.venueIdDefaultProfile,
  venueCityNameDefault: currentVenueUser.venueCityNameDefault,
  venueCityIdDefault: currentVenueUser.venueCityIdDefault,
  venueCountryIdDefault: currentVenueUser.venueCountryIdDefault,
  isVirtual: localStorage.getItem("is_virtual")
    ? Number(localStorage.getItem("is_virtual"))
    : 0,
  permissions: [],
  signUpData: {
    email: "",
    password: "",
    store: "",
  },
};

const authModule = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_STATE_TOGGLE:
      return {
        ...state,
        ...action.payload,
        isLoggingIn: !state.isLoggingIn,
      };

    case LOGIN:
      return {
        ...state,
        ...action.payload,
        isUserAuthenticated: true,
        isLoggingIn: false,
      };

    case SIGN_UP_STATE_TOGGLE:
      return {
        ...state,
        isSigningUp: !state.isSigningUp,
        ...action.payload,
      };

    case LOGOUT:
      return {
        ...state,
        ...action.payload,
        isUserAuthenticated: false,
        userEmail: null,
        userType: 0,
        userId: null,
        storeId: null,
      };

    case SAVE_SIGNUP:
      return {
        ...state,
        signUpData: action.payload,
      };

    case CHANGE_VENUE_PROFILE:
      return {
        ...state,
        ...action.payload,
      };

    case GET_INFORMATION_USER:
      return {
        ...state,
        permissions: action.payload,
      };

    case SET_DEFAULT_VENUE:
      return {
        ...state,
        ...action.payload,
      };

    case SET_VENUES_USER:
      return {
        ...state,
        venuesProfile: action.payload,
      };

    case SET_BRAND_USER:
      return {
        ...state,
        ...action.payload,
      };

    case CHANGE_CHECK_IS_VIRTUAL:
      return {
        ...state,
        isVirtual: 1,
        ...action.payload,
      };

    case CHANGE_CHECK_IS_NOT_VIRTUAL:
      return {
        ...state,
        isVirtual: 0,
        ...action.payload,
      };

    case SET_SHOULD_IS_VIRTUAL:
      return {
        ...state,
        shouldIsVirtual: action.payload,
      };

    case SET_COUNTRY_ID: {
      return {
        ...state,
        venueCountryIdDefault: action.payload,
      };
    }

    default:
      return state;
  }
};

/**
 * Calls the loginService and executes the given callback
 * @param {string} email user email
 * @param {string} pass user password
 * @param {function} onLogin callback to run after login success
 * @param {function} onError callback to run after login error
 */
export const logIn = (email, pass, onLogin, onError) => {
  return (dispatch) => {
    dispatch({ type: LOGIN_STATE_TOGGLE });
    loginService(email, pass)
      .then(({ data }) => {
        let venueUser = {
          venueCityNameDefault:
            data.venues && data.venues.length !== 0
              ? data.venues[0].city_name
              : "",
          venueCityIdDefault:
            data.venues && data.venues.length !== 0
              ? data.venues[0].city_id
              : 0,
          venueNameDefaultProfile:
            data.venues && data.venues.length !== 0 ? data.venues[0].name : "",
          venueIdDefaultProfile:
            data.venues && data.venues?.length !== 0 ? data.venues[0].id : null,
          venueCountryIdDefault:
            data.venues && data.venues?.length !== 0
              ? data.venues[0].country_id
              : 1,
        };

        if (data.is_virtual === true) {
          venueUser = {
            ...venueUser,
            venueCityIdDefault: null,
            venueCityNameDefault: null,
            // venueCountryIdDefault: null,
            venueIdDefaultProfile: null,
            venueNameDefaultProfile: null,
          };
        }

        const user = {
          userEmail: data.email,
          userType: data.is_medical ? 3 : Number(data.role_id),
          userId: data.id,
          userNameRole: data.role_name,
          userProfileName: data.first_name,
          userProfileId: data.role_id,
          userStar: data.ranking,
          companyDefaultId: data.companyId,
          organizationDefaultId: data.companyOrganization,
          availableBrands: data.brands,
          brandId: data.brandId,
          companyId: data.companyId,
          shouldIsVirtual: data.is_virtual,
          isVirtual: data.is_virtual === true ? 1 : 0,
          ...venueUser,
        };

        const venuesFilter =
          data && data.venues && data.venues.length > 0 ? data.venues : [];

        localStorage.setItem("venueUser", JSON.stringify(venueUser));
        localStorage.setItem("venuesProfile", JSON.stringify(venuesFilter));
        localStorage.setItem(
          "theme_user",
          JSON.stringify(Number(data.role_id))
        );
        localStorage.setItem("is_virtual", data.is_virtual === true ? 1 : 0);
        cookies.set("user", user, { path: "/" });
        onLogin();
        dispatch({
          type: LOGIN,
          payload: {
            ...user,
            venuesProfile: venuesFilter,
            permissions:
              data.permissions && data.permissions.length === 0
                ? []
                : data.permissions && data.permissions.module_groups
                ? data.permissions.module_groups
                : [],
          },
        });
        dispatch({ type: SIGN_UP_STATE_TOGGLE, isSigningUp: false });
      })
      .catch((err) => {
        onError(err);
        dispatch({ type: LOGIN_STATE_TOGGLE });
      });
  };
};

/**
 * Logs the use in withou the api call
 */
export const logInDirectly = () => (dispatch) => {
  dispatch({ type: LOGIN });
};

/**
 * Creates a new user and then logs the new user in
 * @param {Object} signUpData sign up forms data
 */
export const signUp = (signUpData, onSignUp, onError) => {
  return (dispatch) => {
    dispatch({ type: SIGN_UP_STATE_TOGGLE });

    signUpService(signUpData)
      .then((res) => {
        if (res.data.error_code === 202) {
          onError("");
          dispatch({ type: SIGN_UP_STATE_TOGGLE });
        }
        if (res.status === 200) {
          onSignUp(
            signUpData.email,
            signUpData.password,
            () => false,
            () => false
          );
        }
      })
      .catch((err) => {
        onError(err);
        dispatch({ type: SIGN_UP_STATE_TOGGLE });
      });
  };
};

/**
 * Deletes the token cookie and logs out the user
 */
export const logOut = () => (dispatch) => {
  cookies.remove("user", { path: "/" });
  localStorage.clear();
  dispatch({
    type: LOGOUT,
  });
};

/**
 * Logs the use in withou the api call
 */
export const getProfileInformation =
  (onFinish, isToFetchVenue = false) =>
  (dispatch) => {
    profileService()
      .then(({ data }) => {
        if (data.data && data.data.permissions) {
          if (isToFetchVenue) {
            const venuesInf = data?.data?.venues ? data?.data?.venues : [];

            let venueUser = {
              venueCityNameDefault: venuesInf[0]?.city_name || null,
              venueCityIdDefault: venuesInf[0]?.city_id || null,
              venueNameDefaultProfile: venuesInf[0]?.name || null,
              venueIdDefaultProfile: venuesInf[0]?.id || null,
              venueCountryIdDefault: venuesInf[0]?.country_id || 1,
            };

            localStorage.setItem("venueUser", JSON.stringify(venueUser));

            dispatch({
              type: SET_DEFAULT_VENUE,
              payload: venueUser,
            });

            dispatch({
              type: SET_VENUES_USER,
              payload: venuesInf,
            });

            return;
          }

          localStorage.setItem("is_virtual", data.data.is_virtual ? 1 : 0);
          const permissionInf =
            data?.data &&
            data?.data?.permissions &&
            data?.data?.permissions.length === 0
              ? []
              : data?.data?.permissions.module_groups;
          const venuesInf =
            data?.data && data?.data?.venues && data?.data?.venues?.length === 0
              ? []
              : data?.data?.venues;

          if (permissionInf.length > 0) {
            dispatch({
              type: SET_SHOULD_IS_VIRTUAL,
              payload: data?.data?.is_virtual,
            });
            dispatch({
              type: GET_INFORMATION_USER,
              payload: permissionInf,
            });
            dispatch({
              type: SET_VENUES_USER,
              payload: venuesInf,
            });
            onFinish();
            return;
          }
        }
        cookies.remove("user", { path: "/" });
        localStorage.clear();
        dispatch({
          type: LOGOUT,
        });
        onFinish();
      })
      .catch((err) => {
        cookies.remove("user", { path: "/" });
        // localSts
        localStorage.clear();
        dispatch({
          type: LOGOUT,
        });
        onFinish();
      });
  };

export const fetchDataVenuesProfile = (onError) => (dispatch) => {
  // return;
  profileService()
    .then(({ data }) => {
      if (data.data) {
        const venuesInf = data?.data?.venues ? data?.data?.venues : [];

        let venueUser = {
          venueCityNameDefault: venuesInf[0]?.city_name || null,
          venueCityIdDefault: venuesInf[0]?.city_id || null,
          venueNameDefaultProfile: venuesInf[0]?.name || null,
          venueIdDefaultProfile: venuesInf[0]?.id || null,
          venueCountryIdDefault: venuesInf[0]?.country_id || 1,
        };

        localStorage.setItem("venueUser", JSON.stringify(venueUser));

        dispatch({
          type: SET_DEFAULT_VENUE,
          payload: venueUser,
        });

        dispatch({
          type: SET_VENUES_USER,
          payload: venuesInf,
        });
        return;
      }

      // onError("Este usuario no tiene sedes asignadas a esta marca");
      return;
    })
    .catch((err) => {
      cookies.remove("user", { path: "/" });
      localStorage.clear();
      dispatch({
        type: LOGOUT,
      });
    });
};

/**
 * Saves the signUpForm state in the store
 * @param {Object} payload form data
 */
export const saveSignUpData = (payload) => (dispatch) => {
  dispatch({
    type: SAVE_SIGNUP,
    payload,
  });
};

export const changeVenueDefault = (payload) => (dispatch) => {
  const currentVenueUser = localStorage.getItem("venueUser")
    ? JSON.parse(localStorage.getItem("venueUser"))
    : {};
  const modifyDataUser = { ...currentVenueUser, ...payload };
  localStorage.setItem("venueUser", JSON.stringify(modifyDataUser));

  dispatch({
    type: CHANGE_VENUE_PROFILE,
    payload,
  });
};

export const changeBrandIdDefault = (payload) => (dispatch) => {
  localStorage.setItem("brand_id", payload.id);
  localStorage.setItem("company_id", payload.uuid_company);

  const payloadSend = {
    brandId: payload.id,
    companyId: payload.uuid_company,
  };

  dispatch({
    type: SET_BRAND_USER,
    payload: payloadSend,
  });
};

export const changeCheckIsVirtualUser = (value) => (dispatch) => {
  const venuesProfile = localStorage.getItem("venuesProfile")
    ? JSON.parse(localStorage.getItem("venuesProfile"))
    : [];

  if (value) {
    localStorage.setItem("is_virtual", value ? 1 : 0);
    let venueUser = {
      venueCityNameDefault: null,
      venueCityIdDefault: null,
      venueNameDefaultProfile: null,
      venueIdDefaultProfile: null,
      venueCountryIdDefault: venuesProfile.country_id
        ? venuesProfile[0]?.country_id
        : 1,
    };
    localStorage.setItem("venueUser", JSON.stringify(venueUser));
    dispatch({
      type: CHANGE_CHECK_IS_VIRTUAL,
      payload: venueUser,
    });
    return;
  }
  if (venuesProfile && venuesProfile.length > 0) {
    localStorage.setItem("is_virtual", value ? 1 : 0);
    let venueUser = {
      venueCityNameDefault: venuesProfile[0].city_name,
      venueCityIdDefault: venuesProfile[0].city_id,
      venueNameDefaultProfile: venuesProfile[0].name,
      venueIdDefaultProfile: venuesProfile[0].id,
      venueCountryIdDefault: venuesProfile[0].country_id,
    };
    localStorage.setItem("venueUser", JSON.stringify(venueUser));
    dispatch({
      type: CHANGE_CHECK_IS_NOT_VIRTUAL,
      payload: venueUser,
    });
  }
};

export const changeCountryId = (payload) => (dispatch) => {
  dispatch({
    type: SET_COUNTRY_ID,
    payload,
  });
};

export default authModule;
