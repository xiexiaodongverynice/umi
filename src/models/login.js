import { parse, stringify } from "qs";
import _ from "lodash";
import { routerRedux } from "dva/router";
import { message } from "antd/lib/index";
import { formatMessage } from "umi/locale";
import * as loginService from "../services/login";
import authUtil from "../utils/authUtil";
import { setPermission } from "../utils/permission";
import * as storageUtil from "@/utils/storageUtil";
import { cleanGlobalWindowData } from "@/utils/windowUtil";

export function getPageQuery() {
  return parse(window.location.href.split("?")[1]);
}
const Model = {
  namespace: "login",
  state: {
    status: undefined,
    errMessage: "",
    loginLoading: false
  },
  effects: {
    *login({ payload, callBack }, { call, put }) {
      const data = yield call(loginService.login, payload);
      if (data.success) {
        // storageUtil.set("period", "2019Q3");
        localStorage.setItem("token", data.token);
        storageUtil.set("loginName", payload.loginName);
        storageUtil.set("userId", _.get(data.resultData, "userId"));
        storageUtil.set("user_info", _.get(data.resultData, "user_info"));
        setPermission(data.resultData.permission);
        // yield put({
        //   type: "initializeLoginData",
        //   payload: data.resultData
        // });
        yield put({
          type: 'global/initSystemData',
          payload: {
            isRedirectHome: true,
          },
        });
        message.success(formatMessage({ id: "app.login success" }));
        if (callBack) callBack();
        yield put({ type: "showMessage", message: "" });
      } else {
        yield put({ type: "showMessage", message: data });
      }
    },

    *loginWithToken({ payload, callBack }, { call, put }) {
      const data = yield call(loginService.loginWithToken, {});
      if (data.success) {
        // storageUtil.set("period", "2019Q3");
        storageUtil.set("userId", _.get(data.resultData, "userId"));
        storageUtil.set(
          "loginName",
          _.get(data.resultData, "user_info.account")
        );
        storageUtil.set("user_info", _.get(data.resultData, "user_info"));
        setPermission(data.resultData.permission);
        yield put({
          type: 'global/initSystemData',
          payload: {
            isRedirectHome: false,
          },
        });
        if (callBack) callBack();
      }
    },


    *loginAs({ payload, callBack }, { call, put }) {
      const data = yield call(loginService.loginAs, payload);
      if (data.success) {
        yield put({ type: "showLoginLoading" });
        message.success(formatMessage({ id: "app.login success" }));
        localStorage.setItem("token", data.token);
        localStorage.setItem("loginName", payload.loginName);
        localStorage.setItem("userId", _.get(data.resultData, "userId"));
        if (callBack) callBack();
        yield put({ type: "showMessage", message: "" });
        yield put(
          routerRedux.replace({
            pathname: "/"
          })
        );
      } else {
        yield put({ type: "showMessage", message: data });
      }
    },

    *logout({}, { put }) {
      const { redirect } = getPageQuery(); // redirect
      authUtil.cleanAllStorageButExclude();
      if (window.location.pathname !== "/user/login" && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: "/user/login",
            search: stringify({
              redirect: window.location.href
            })
          })
        );
        cleanGlobalWindowData();
      }
    }
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      return { ...state, status: payload.status };
    },
    showMessage(state, data) {
      return {
        ...state,
        errMessage: data.message
      };
    },
    changeLoginLoading(state, { payload }) {
      return { ...state, loginLoading: payload.loginLoading };
    }
  }
};
export default Model;
