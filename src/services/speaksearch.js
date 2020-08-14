/**
 * I18n module
 * @flow
 */

import config from "../utils/config";
import request from "../utils/request";

const {
  tmURL,
  api: { tm }
} = config;

export function query(payload) {
  const { path, method = "post" } = tm.query;
  const url = `${tmURL}${path}`;
  return request(url, {
    method,
    data: payload
  });
}
export function fetchCustomObjectDescribe(payload) {
  const { path, method = "get" } = tm.fetchCustomObjectDescribe;
  const url = `${tmURL}${path}`;
  return request(url, {
    method,
    data: { includeFields: true }
  });
}
