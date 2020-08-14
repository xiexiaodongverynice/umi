import lodash from 'lodash';
import { message } from "antd";
import * as recordService from '../../../services/app';


export default {
  namespace: 'acNodeSettingManage',

  state: {
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      pageSize: 5,
      total: null,
    },
    loading: false,
    currentItem: {},
    modalVisible: false,
    designOnLineModalVisible: false,
    modalType: 'create',
    approvalOperationModalVisible:false,
    approvalOperationModalType:"",
    object_describe_api_name: 'xxx',
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(recordService.fetchAcNodeList, payload);
      yield put({
        type: 'querySuccess',
        payload: {
          recordList: lodash.get(response, 'resultData.result', []),
          pagination: {
            // current: Number(payload.dealData.pageNo) || 1,
            // pageSize: Number(payload.dealData.pageSize) || 10,
            // total: lodash.get(response, 'resultData.resultCount', []),
          },
        },
      });
      if (callback) {
        callback();
      }
    },

    * save({ payload, callback }, { call, put }) {
      const data = yield call(recordService.saveAcNodeSetting, payload);
      if (data.success) {
        message.success(data.msg);
        // yield put({ type: 'hideModal' });
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
