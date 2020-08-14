import lodash from 'lodash';
import { message } from "antd";
import * as recordService from '../../../services/app';


export default {
  namespace: 'acHistoricManage',

  state: {
    instanceHistoricList: [],
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
      const response = yield call(recordService.fetchAcHistoricList, payload);
      yield put({
        type: 'querySuccess',
        payload: {
          recordList: lodash.get(response, 'resultData.result', []),
          instanceHistoricList: lodash.get(response, 'resultData.instanceHistoricList', []),
          businessList: lodash.get(response, 'resultData.businessList', []),
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
  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload };
    },

    hideModal(state,{payload}) {
      return { ...state, ...payload};
    },


    querySuccess(state, action) {
      const { recordList,businessList,instanceHistoricList, pagination } = action.payload;
      return {
        ...state,
        businessList,
        instanceHistoricList,
        list: recordList,
        pagination: {
          ...state.pagination,
          ...pagination,
        } };
    },
  },
};
