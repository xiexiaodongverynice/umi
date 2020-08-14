import lodash from 'lodash';
import { message } from "antd";
import * as recordService from '../../../services/app';


export default {
  namespace: 'acProcessManage',

  state: {
    categoryList:{},
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
    deployModalVisible: false,
    modalType: 'create',
    object_describe_api_name: 'data_worksheet_warehouse',
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(recordService.queryAcProcessList, payload);
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
    *fetchCategory({ payload, callback }, { call, put }) {
      const response = yield call(recordService.fetchCategoryList, payload);
      const categoryList = JSON.parse(lodash.get(response, 'resultData.value', '{}'));
      yield put({
        type: 'queryCategoryListSuccess',
        payload: {
          categoryList,
        },
      });
      if (callback) {
        callback();
      }
    },

    * activate({ payload, callback }, { call, put }) {
      const data = yield call(recordService.activateProcess, payload);
      if (data.success) {
        message.success('激活成功');
        if (callback) callback();
      }
    },
    * suspend({ payload, callback }, { call, put }) {
      const data = yield call(recordService.suspendProcess, payload);
      if (data.success) {
        message.success('挂起成功');
        if (callback) callback();
      }
    },
    * update({ payload, callback }, { call, put }) {
      const data = yield call(recordService.updateProcessRecord, payload);
      if (data.success) {
        message.success(data.msg);
        yield put({ type: 'hideModal' });
        if (callback) callback();
      }
    },
    * delete({ payload, callback }, { call, put }) {
      const data = yield call(recordService.deleteProcess, payload);
      if (data.success) {
        message.success(data.msg);
        if (callback) callback();
      }
    },
    * deploy({ payload, callback }, { call, put }) {
      const data = yield call(recordService.deployRecord, payload);
      if (data.success) {
        message.success(data.msg);
        if (callback) callback();
      }
    },
    * convertToModel({ payload, callback }, { call, put }) {
      const data = yield call(recordService.convertToModel, payload);
      if (data.success) {
        message.success(data.msg);
        if (callback) callback();
      }
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
      const {recordList, pagination } = action.payload;
      return {
        ...state,
        list: recordList,
        pagination: {
          ...state.pagination,
          ...pagination,
        } };
    },
    queryCategoryListSuccess(state, action) {
      const { categoryList={}} = action.payload;
      return {
        ...state,
        categoryList
      };
    },
  },
};
