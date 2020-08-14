import lodash from 'lodash';
import * as storageUtil from '@/utils/storageUtil';
import { queryCurrent, query as queryUsers } from "@/services/user";

const UserModel = {
  namespace: "user",
  state: {
    currentUser: {}
  },
  effects: {
    *fetch(_, { call, put }) {
      // const response = yield call(queryUsers);
      // yield put({
      //   type: "save",
      //   payload: response
      // });
    },

    *fetchCurrent(_, { call, put }) {
      // const response = yield call(queryCurrent);
      const userInfo = storageUtil.get('user_info');
      yield put({
        type: "saveCurrentUser",
        payload: userInfo
      });
    }
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {}
      },
      action
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount
        }
      };
    }
  }
};
export default UserModel;
