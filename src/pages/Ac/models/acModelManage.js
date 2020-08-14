import lodash from 'lodash';
import { message } from "antd";
import * as recordService from '../../../services/app';

export default {
  namespace: 'acModelManage',

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
    object_describe_api_name: 'data_worksheet_warehouse',
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(recordService.queryAcModelList, payload);
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

    * create({ payload, callback }, { call, put }) {
      const data = yield call(recordService.create, payload);
      if (data.success) {
        message.success(data.msg);
        yield put({ type: 'hideModal' });
        if (callback) callback();
      }
    },
    * update({ payload, callback }, { call, put }) {
      // const data = yield call(recordService.updateRecord, payload);
      // if (data.success) {
      //   message.success('更新成功');
      //   yield put({ type: 'hideModal' });
      //   if (callback) callback();
      // }
    },
    * delete({ payload, callback }, { call, put }) {
      const data = yield call(recordService.deleteModel, payload);
      if (data.success) {
        message.success('删除成功');
        if (callback) callback();
      }
    },
    * deploy({ payload, callback }, { call, put }) {
      const data = yield call(recordService.deployRecord, payload);
      if (data.success) {
        message.success('部署成功');
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
