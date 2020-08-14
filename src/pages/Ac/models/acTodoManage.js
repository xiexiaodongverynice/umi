import lodash from 'lodash';
import { message } from "antd";
import * as recordService from '../../../services/app';


export default {
  namespace: 'acTodoManage',

  state: {
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      pageSize: 5,
      total: null,
    },
    loading: true,
    currentItem: {},
    modalVisible: false,
    designOnLineModalVisible: false,
    modalType: 'create',
    approvalOperationModalVisible:false,
    approvalOperationModalType:"",
    object_describe_api_name: 'data_worksheet_warehouse',
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(recordService.queryAcTodoList, payload);
      yield put({
        type: 'querySuccess',
        payload: {
          recordList: lodash.get(response, 'resultData.result', []),
          pagination: {
            current: Number(payload.dealData.pageNo) || 1,
            pageSize: Number(payload.dealData.pageSize) || 10,
            total: lodash.get(response, 'resultData.resultCount', []),
          },
        },
      });
      if (callback) {
        callback();
      }
    },

    * pass({ payload, callback }, { call, put }) {
      const data = yield call(recordService.taskPass, payload);
      if (data.success) {
        message.success('【审批通过】操作成功');
        if (callback) callback();
      }
    },
    * reject({ payload, callback }, { call, put }) {
      const data = yield call(recordService.taskReject, payload);
      if (data.success) {
        message.success('【审批拒绝】操作成功');
        if (callback) callback();
      }
    },
    * addExecution({ payload, callback }, { call, put }) {
      const data = yield call(recordService.taskAddExecution, payload);
      if (data.success) {
        message.success('【审批加签】操作成功');
        if (callback) callback();
      }
    },
    * delegate({ payload, callback }, { call, put }) {
      const data = yield call(recordService.taskDelegate, payload);
      if (data.success) {
        message.success('【审批委托】操作成功');
        if (callback) callback();
      }
    },
    * back({ payload, callback }, { call, put }) {
      // const data = yield call(recordService.taskBack, payload);
      // if (data.success) {
      //   message.success('【审批驳回】操作成功');
        message.warn('【审批驳回】暂未开放');
      //   if (callback) callback();
      // }
    },

  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload };
    },

    hideModal(state,{payload}) {
      return { ...state, ...payload};
    },


    querySuccess(state, action) {
      const { recordList, pagination } = action.payload;
      return {
        ...state,
        list: recordList,
        pagination: {
          ...state.pagination,
          ...pagination,
        } };
    },
  },
};
