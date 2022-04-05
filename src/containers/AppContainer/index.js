import React, { useLayoutEffect, useState } from "react";

// redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getProfileInformation } from "modules/auth";

// components
import AppContainer from "./AppContainer";
import Loading from "components/Shared/Loading/Loading";

// HOCS
import Router from "router/Router";

// hooks
import { useGetInitialGlobalInfo } from "hooks/useGetInitialGlobalInfo";

const IndexAppContainer = ({ permissions, getProfileInformation, routes }) => {
  const [loading, setLoading] = useState(true);
  const [fetchingGeneralInfo] = useGetInitialGlobalInfo();

  useLayoutEffect(() => {
    const getUserProfileFunc = () => {
      const onFinish = () => {
        setLoading(false);
      };
      getProfileInformation(onFinish);
    };

    if (permissions.length === 0) {
      getUserProfileFunc();
    } else {
      setLoading(false);
    }
  }, [getProfileInformation, permissions]);

  return loading || permissions.length === 0 || fetchingGeneralInfo ? (
    <div style={{ marginTop: "400px" }}>
      <Loading />
    </div>
  ) : (
    permissions.length > 0 && (
      <AppContainer routes={routes}>
        <Router routes={routes} />
      </AppContainer>
    )
  );
};

const mapStateToProps = ({ auth }) => ({
  isUserAuthenticated: auth.isUserAuthenticated,
  permissions: auth.permissions,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getProfileInformation,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(IndexAppContainer);
