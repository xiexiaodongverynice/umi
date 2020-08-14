import _ from "lodash";
import request from "@/utils/request";
import { ssoURL } from "../utils/config";

const {
  navigator: { userAgent }
} = window;
// const userAgent = window.navigator.userAgent;
const rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
const rFirefox = /(firefox)\/([\w.]+)/;
const rOpera = /(opera).+version\/([\w.]+)/;
const rChrome = /(chrome)\/([\w.]+)/;
const rSafari = /version\/([\w.]+).*(safari)/;

function uaMatch(ua) {
  let match = rMsie.exec(ua);
  if (match != null) {
    return { browser: "IE", version: match[2] || "0" };
  }
  match = rFirefox.exec(ua);
  if (match != null) {
    return { browser: match[1] || "", version: match[2] || "0" };
  }
  match = rOpera.exec(ua);
  if (match != null) {
    return { browser: match[1] || "", version: match[2] || "0" };
  }
  match = rChrome.exec(ua);
  if (match != null) {
    return { browser: match[1] || "", version: match[2] || "0" };
  }
  match = rSafari.exec(ua);
  if (match != null) {
    return { browser: match[2] || "", version: match[1] || "0" };
  }
  if (match != null) {
    return { browser: "", version: "0" };
  }
  return null;
}

export function login(values) {
  const browserMatch = uaMatch(userAgent.toLowerCase());
  _.set(values, "deviceType", "PC");
  _.set(values, "browserType", browserMatch.browser);
  _.set(values, "browserVersion", browserMatch.version);
  return request(
    `${ssoURL}/login`,
    {
      method: "POST",
      data: values
    },
    "NOTOKEN"
  );
}

export function loginWithToken(values) {
  const browserMatch = uaMatch(userAgent.toLowerCase());
  _.set(values, "deviceType", "PC");
  _.set(values, "browserType", browserMatch.browser);
  _.set(values, "browserVersion", browserMatch.version);
  return request(
    `${ssoURL}/loginWithToken`,
    {
      method: "POST",
      data: values,
      headers: { token: window.TOKEN }
    },
    "NOTOKEN"
  );
}

export function loginAs(value) {
  const browserMatch = uaMatch(userAgent.toLowerCase());
  _.set(value, "deviceType", "PC");
  _.set(value, "browserType", browserMatch.browser);
  _.set(value, "browserVersion", browserMatch.version);
  return request(`${ssoURL}/loginAs`, {
    method: "POST",
    data: {
      body: value
    }
  });
}
