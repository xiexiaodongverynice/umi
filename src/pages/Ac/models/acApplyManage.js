import lodash from 'lodash';
import { message } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import * as recordService from '../../../services/app';


export default {
  namespace: 'acApplyManage',

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
    object_describe_api_name: 't_ac_business',
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(recordService.queryAcApplyList, payload);
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

    *cancel({ payload, callback }, { call, put }) {
      const data = yield call(recordService.processCancel, payload);
      if (data.success) {
        message.success(formatMessage({id:'table.message.operation.success'}));
        if (callback) callback();
      }
    },

    *restart({ payload, callback }, { call, put }) {
      const data = yield call(recordService.processRestart, payload);
      if (data.success) {
        message.success(formatMessage({id:'table.message.operation.success'}));
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
