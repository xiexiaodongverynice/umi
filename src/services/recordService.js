import _ from "lodash";
import config, { ssoURL } from "../utils/config";
import request from "../utils/request";
// import * as criteriaUtil from "../utils/criteriaUtil";
import { processCriterias } from '../utils/criteriaUtil';
import searchUtil from "../utils/searchUtil";
// import consoleUtil from "../utils/consoleUtil";

const { tmURL, api } = config;
const { tm } = api;

export function queryRecordList(payload) {
  // notification.open('info', '通知', '今天晚上19:00～22:00点进行系统升级，请提前做好数据保存工作，给您带来的不变，敬请原谅，谢谢配合。',true,null)
  const { path ,method = "post" } = tm.query;
  const url = `${tmURL}${path}`;
  const { dealData } = payload;
  const { criterias, approvalCriterias } = dealData;
  let data = { ...dealData, criterias: processCriterias(criterias) };
  if (approvalCriterias) {
    data = { ...data, approvalCriterias: processCriterias(approvalCriterias) };
  }
  return request(url, {
    method,
    data
  });
}


export function updateRecord(payload) {
  const { path ,method = "post" } = tm.updateRecord;
  const url = _.replace(`${tmURL}${path}`,'{api_name}',payload.object_api_name).replace("{id}", payload.dealData.id);
  return request(url, {
    method,
    data:payload.dealData
  });
}

export function batchUpdateRecords(payload) {
  const { path ,method = "put" } = tm.batchUpdateRecord;
  const url = _.replace(`${tmURL}${path}`,'{api_name}',payload.object_api_name);
  return request(url, {
    method,
    data:payload.dealData
  });
}

export function batchQueryRecordList(payload) {
  const { path ,method = "post" } = tm.batchQuery;
  const url = `${tmURL}${path}`;
  return request(url, {
    method,
    data:payload.dealData
  });
}
