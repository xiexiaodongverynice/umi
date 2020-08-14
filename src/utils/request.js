import fetch from "dva/fetch";
import _ from "lodash";
import { notification } from "antd";
import router from "umi/router";
import * as storageUtil from "@/utils/storageUtil";
import { getLocale } from 'umi/locale';
import searchUtil from "./searchUtil";

const codeMessage = {
  200: "服务器成功返回请求的数据",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器",
  502: "网关错误",
  503: "服务不可用，服务器暂时过载或维护",
  504: "网关超时"
};
function parseJSON(response) {
  return response.json();
}
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    key: `请求错误 ${response.status}: ${response.url}`,
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}
function checkCode(response) {
  const { head, body } = response;
  const { code, msg, token } = head;
  if (code === 200) {
    return { status: "ok", success: true, msg, token, resultData: body };
  }
  const errortext = msg; // codeMessage[code] || msg;
  notification.error({
    key: `请求错误 ${code}`,
    message: `请求错误 ${code}`,
    description: errortext
  });
  const error = new Error(errortext);
  error.name = code;
  error.response = response;
  error.status = "error";
  error.success = false;
  error.message = msg;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param urlT
 * @param  {object} [options] The options we want to pass to "fetch"
 * @param fetchType
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(urlT, options, fetchType = "CORS") {
  let url = urlT;
  const { method = "get", data } = options;
  const token = localStorage.getItem("token");
  if (_.isEmpty(token)&&_.toUpper(fetchType)!=='NOTOKEN') {
    router.push("/user/login");
    return;
  }
  const defaultBodyOptions = {
    head: {
      token
    }
  };
  const newBodyOptions = { ...defaultBodyOptions, body: data };
  const locale = getLocale();

  const defaultOptions = {
    credentials: "include",
    timeout: 2000,
    headers:{
      'Accept-Language': locale
    },
  };
  const newOptions = { ...defaultOptions, ...options };
  if (_.toUpper(method) === "POST" || _.toUpper(method) === "PUT") {
    newOptions.headers = {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
      mode: "cors",
      // period: window.PERIOD || storageUtil.get("period"),
      ...newOptions.headers
    };
    if (_.toUpper(fetchType) === "NOTOKEN") {
      newOptions.body = JSON.stringify(data);
    } else {
      newOptions.body = JSON.stringify(newBodyOptions);
    }
  } else if (_.toUpper(method) === "DELETE" || _.toUpper(method) === "GET") {
    // newOptions.headers = {
    //   period: window.PERIOD || storageUtil.get("period")
    // };
    const searchParam = searchUtil.stringify({ ...data, token });
    if (url.indexOf("?") >= 0) {
      url = `${url}${searchParam}`;
    } else {
      url = `${url}?${searchParam}`;
    }

    newOptions.body = JSON.stringify(newOptions.body);
  }
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(parseJSON)
    .then(checkCode)
    .catch(e => {
      // const { dispatch } = store;
      const status = e.name;
      if (status === "TypeError") {
        // notification.error({
        //   message: '请求错误',
        //   description: e.message,
        // });
        // message.error(e.message);
        return e.message;
      }
      return e.message;
    });
}
