import _ from "lodash";
import * as storageUtil from "./storageUtil";

export const initGlobalWindowData = () => {
  const current_tq_territory = storageUtil.get("tq_territory");
  const period = storageUtil.get("period");
  const curretnPeriod = storageUtil.get("curretnPeriod");
  const token = localStorage.getItem("token");

  window.CURRENT_TERRITORY_ID = _.get(current_tq_territory, "id");
  window.PERIOD = period;
  window.TOKEN = token;
  window.CURRENTPERIOD = curretnPeriod;
};

export const cleanGlobalWindowData = () => {
  delete window.CURRENT_TERRITORY_ID;
  delete window.PERIOD;
  delete window.TOKEN;
  delete window.CURRENTPERIOD;
};
