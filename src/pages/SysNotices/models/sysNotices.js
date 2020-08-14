import lodash from "lodash";
import * as recordService from "../../../services/recordService";

const final_pageSize = 10;
export default {
  namespace: "sysNotices",

  state: {
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: false,
      current: 1,
      pageSize: final_pageSize,
      total: null
    },
    loading: true,
    object_describe_api_name: "alert"
  },

  effects: {

    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(recordService.queryRecordList, payload);
      if (response.success) {
        yield put({
          type: "querySuccess",
          payload: {
            recordList: lodash.get(response, "resultData.result", []),
            pagination: {
              current: Number(payload.dealData.pageNo) || 1,
              pageSize: Number(payload.dealData.pageSize) || final_pageSize,
              total: lodash.get(response, "resultData.resultCount", [])
            }
          }
        });
        if (callback) {
          callback();
        }
      }
    },

  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload };
    },

    hideModal(state, { payload }) {
      return { ...state, ...payload };
    },

    querySuccess(state, action) {
      const { recordList, pagination, record } = action.payload;
      return {
        ...state,
        list: recordList,
        pagination: {
          ...state.pagination,
          ...pagination
        },
        record
      };
    },
  }
  // 路由监听器
};
