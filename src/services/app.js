import _ from "lodash";
import config from "../utils/config";
import request from "../utils/request";
// import * as criteriaUtil from "../utils/criteriaUtil";
// import searchUtil from "../utils/searchUtil";
// import consoleUtil from "../utils/consoleUtil";

const { baseURL,tmURL, api } = config;
const { ac,tm } = api;

// //////////MODEL/////////////
// const pathname = yield select(state => state.routing.location.pathname);
export function queryAcModelList(payload) {
  const { path ,method = "post" } = ac.model.list;
  const url = `${baseURL}${path}`;

  const { dealData } = payload;

  return request(url, {
    method,
    data: dealData
  });
}

export function create(payload) {
  const { path ,method = "post" } = ac.model.create;
  const url = `${baseURL}${path}`;

  const { dealData } = payload;

  return request(url, {
    method,
    data: dealData
  });
}
export function deployRecord(payload) {
  const { path ,method = "post" } = ac.model.deploy;
  const url = _.replace(`${baseURL}${path}`,'{modelId}',payload.id);

  const { dealData } = payload;

  return request(url, {
    method,
    data: dealData
  });
}

export function deleteModel(payload) {
  const { path ,method = "delete" } = ac.model.delete;
  const url = _.replace(`${baseURL}${path}`,'{modelId}',payload.id);

  const { dealData } = payload;

  return request(url, {
    method,
    data: dealData
  });
}

// ///////////////////PROCESS///////////////

export function queryAcProcessList(payload) {
  const { path ,method = "post" } = ac.process.list;
  const url = `${baseURL}${path}`;
  const { dealData } = payload;
  return request(url, {
    method,
    data: dealData
  });
}
// 激活流程
export function activateProcess(payload) {
  const {processId} = payload;
  const { path ,method = "put" } = ac.process.activate;
  const url = `${baseURL}${path}`.replace("{processId}",processId);
  return request(url, {
    method,
    data: {}
  });
}
// 挂起流程
export function suspendProcess(payload) {
  const {processId} = payload;
  const { path ,method = "put" } = ac.process.suspend;
  const url = `${baseURL}${path}`.replace("{processId}",processId);
  return request(url, {
    method,
    data: {}
  });
}
export function updateProcessRecord(payload) {
  const { path ,method = "put" } = ac.process.update;
  const url = _.replace(`${baseURL}${path}`,'{processId}',payload.dealData.id);
  const { dealData } = payload;
  return request(url, {
    method,
    data: dealData
  });
}

export function deleteProcess(payload) {
  const { path ,method = "delete" } = ac.process.delete;
  const url = _.replace(`${baseURL}${path}`,'{processId}',payload.id);
  const { dealData } = payload;
  return request(url, {
    method,
    data: dealData
  });
}

// 流程节点设置-节点列表获取
export function fetchAcNodeList(payload) {
  const { path ,method = "get" } = ac.process.node.list;
  const url = _.replace(`${baseURL}${path}`,'{processId}',payload.id);
  const { dealData } = payload;
  return request(url, {
    method,
    data: dealData
  });
}
// 流程节点设置-节点保存
export function saveAcNodeSetting(payload) {
  const { path ,method = "post" } = ac.process.node.save;
  const url = _.replace(_.replace(`${baseURL}${path}`,'{processId}',payload.id),'{nodeId}',payload.nodeId);
  const { dealData } = payload;
  return request(url, {
    method,
    data: dealData
  });
}

// 流程转成模型
export function convertToModel(payload) {
  const { path ,method = "post" } = ac.process.convertToModel;
  const url = _.replace(`${baseURL}${path}`,'{processId}',payload.id);

  const { dealData } = payload;

  return request(url, {
    method,
    data: dealData
  });
}

// ///////////////////流程实例///////////////
export function queryAcInstanceList(payload) {
  const { path ,method = "post" } = ac.instance.list;
  const url = `${baseURL}${path}`;
  const { dealData } = payload;
  return request(url, {
    method,
    data: dealData
  });
}
// 激活流程
export function activateProcessInstance(payload) {
  const {processId} = payload;
  const { path ,method = "put" } = ac.instance.activate;
  const url = `${baseURL}${path}`.replace("{processId}",processId);
  return request(url, {
    method,
    data: {}
  });
}
// 挂起流程
export function suspendProcessInstance(payload) {
  const {processId} = payload;
  const { path ,method = "put" } = ac.instance.suspend;
  const url = `${baseURL}${path}`.replace("{processId}",processId);
  return request(url, {
    method,
    data: {}
  });
}

export function deleteProcessInstance(payload) {
  const { path ,method = "delete" } = ac.instance.delete;
  const url = _.replace(`${baseURL}${path}`,'{instanceId}',payload.id);
  const { dealData } = payload;
  return request(url, {
    method,
    data: dealData
  });
}

// ///////////////////任务管理///////////////
export function queryAcTodoList(payload) {
  const { path ,method = "post" } = ac.task.list.todo;
  const url = `${baseURL}${path}`;
  const { dealData } = payload;
  return request(url, {
    method,
    data: dealData
  });
}
export function queryAcDoneList(payload) {
  const { path ,method = "post" } = ac.task.list.done;
  const url = `${baseURL}${path}`;
  const { dealData } = payload;
  return request(url, {
    method,
    data: dealData
  });
}
export function taskPass(payload) {
  const { path ,method = "post" } = ac.task.pass;
  const url = `${baseURL}${path}`;
  const { dealData } = payload;
  return request(url, {
    method,
    data: dealData
  });
}

export function taskReject(payload) {
  const { path ,method = "post" } = ac.task.reject;
  const url = `${baseURL}${path}`;
  const { dealData } = payload;
  return request(url, {
    method,
    data: dealData
  });
}
export function taskAddExecution(payload) {
  const { path ,method = "post" } = ac.task.addExecution;
  const url = `${baseURL}${path}`;
  const { dealData } = payload;
  return request(url, {
    method,
    data: dealData
  });
}
export function taskDelegate(payload) {
  const { path ,method = "post" } = ac.task.delegate;
  const url = `${baseURL}${path}`;
  const { dealData } = payload;
  return request(url, {
    method,
    data: dealData
  });
}
export function taskBack(payload) {
  const { path ,method = "post" } = ac.task.back;
  const url = `${baseURL}${path}`;
  const { dealData } = payload;
  return request(url, {
    method,
    data: dealData
  });
}
// //////////////////我的申请//////////////
export function queryAcApplyList(payload) {
  const { path ,method = "post" } = ac.business.list;
  const url = `${baseURL}${path}`;
  const { dealData } = payload;
  return request(url, {
    method,
    data: dealData
  });
}
export function processCancel(payload) {
  const { path ,method = "post" } = ac.business.cancel;
  const url = `${baseURL}${path}`;
  const { dealData } = payload;
  return request(url, {
    method,
    data: dealData
  });
}
export function processRestart(payload) {
  const { path ,method = "post" } = ac.business.restart;
  const url = `${baseURL}${path}`;
  const { dealData } = payload;
  return request(url, {
    method,
    data: dealData
  });
}
// ///////////////////审批历史////////////////

export function fetchAcHistoricList(payload) {
  const { path ,method = "post" } = ac.historic.list;
  const url = `${baseURL}${path}`;
  const { dealData } = payload;
  return request(url, {
    method,
    data: dealData
  });
}


export function fetchCategoryList(payload) {
  const { path ,method = "get" } = tm.setting;
  const url = `${tmURL}${path}`;
  // const { dealData } = payload;
  return request(url, {
    method,
    data: {}
  });
}
