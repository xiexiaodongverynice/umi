import Authorized from "@/utils/Authorized";
import { menu } from "../defaultSettings";
import { getMenuData } from "../../config/menu";

const { check } = Authorized;

export default {
  namespace: "menu",

  state: {
    menuData: [],
    routerData: [],
    breadcrumbNameMap: {}
  },

  effects: {
    *getMenuData({ payload }, { call, put }) {
      const menuData = getMenuData();
      yield put({
        type: "save",
        payload: { menuData }
      });
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload
      };
    }
  }
};
