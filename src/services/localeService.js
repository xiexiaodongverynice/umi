/**
 * I18n module
 * @flow
 */

import config from '../utils/config';
import request from "../utils/request";

const { tmURL,api:{tm} } = config;

export function loadAllLocales(payload) {
  const { path ,method = "get" } = tm.queryLocales;
  const url = `${tmURL}${path}`;
  return request(url,{
    method,
    data: {},
  });
}
export function loadDefaultLanguage(payload) {
  const { path ,method = "get" } = tm.defaultLanguage;
  const url = `${tmURL}${path}`;
  return request(url,{
    method,
    data: {},
  });
}
