import React, { useMemo } from "react";

import { ThemeProvider } from "@material-ui/core/styles";

//Redux
import { connect } from "react-redux";

//Colors
import Theme from "utils/themes/Theme";

const CustomThemeProvider = ({ children, userType }) => {
  const nameTheme = useMemo(() => {
    if (typeof userType === "number") {
      switch (userType) {
        case 1:
          return "defaultTheme";
        case 2:
        case 3:
        case 7:
        case 8:
        case 9:
        case 10:
        case 15:
          return "medicalTheme";
        case 4:
        case 5:
          return "trainerTheme";
        case 6:
        case 14:
          return "counterTheme";
        case 16:
          return "ComercialTheme";

        case 25:
          return "VirtualTheme";
        case 29:
          return "VirtualTheme";
        case 30:
          return "VirtualTheme";
        case 37:
          return "defaultTheme";
        case 39:
          return "VirtualTheme";
        default:
          return "defaultTheme";
      }
    }
  }, [userType]);

  return <ThemeProvider theme={Theme[nameTheme]}>{children}</ThemeProvider>;
};

const mapStateToProps = ({ auth }) => ({
  userType: auth.userType,
});

export default connect(mapStateToProps)(CustomThemeProvider);
