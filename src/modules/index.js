import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import auth from "./auth";
import common from "./common";
import sessions from "./sessions";
import trainingPlan from "./trainingPlan";
import nutrition from "./nutrition";
import quotations from "./quotations";
import promotions from "./promotions";
import global from "./global";
import medical from "./medical";
import virtualJourney from "./virtualJourney";

const CombineReducers = (history) =>
  combineReducers({
    router: connectRouter(history),
    auth,
    sessions,
    trainingPlan,
    common,
    nutrition,
    quotations,
    promotions,
    global,
    medical,
    virtualJourney,
  });

export default CombineReducers;
