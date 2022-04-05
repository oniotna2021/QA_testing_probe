import React from "react";

//Logos
import {
  LogoDefault,
  LogoTrainingFull,
  LogoTrainingMin,
  LogoMedicalMin,
  LogoMedicalFull,
  LogoCounterMin,
  LogoComercialFull,
  LogoComercialMin,
} from "assets/icons/logos/config";

const LogoDynamic = ({ userType, openDrawerPrimary }) => {
  switch (userType) {
    case 4:
    case 5:
      return !openDrawerPrimary ? <LogoTrainingMin /> : <LogoTrainingFull />;
    case 2:
    case 3:
    case 7:
    case 8:
    case 9:
    case 10:
    case 15:
      return !openDrawerPrimary ? <LogoMedicalMin /> : <LogoMedicalFull />;
    case 6:
    case 14:
      return <LogoCounterMin />;
    case 16:
      return !openDrawerPrimary ? <LogoComercialMin /> : <LogoComercialFull />;
    case 25:
      return <LogoDefault color="#007771" />;
    case 29:
      return <LogoDefault color="#007771" />;
    case 30:
      return <LogoDefault color="#007771" />;
    default:
      return <LogoDefault />;
  }
};

export default LogoDynamic;
