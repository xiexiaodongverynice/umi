import lodash from 'lodash';
import moment from 'moment';
// import { routerRedux } from "dva/router";
import { Button, notification } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import { queryRecordList,batchQueryRecordList,updateRecord,batchUpdateRecords } from "@/services/recordService";
import * as storageUtil from '../utils/storageUtil';
import consoleUtil from "../utils/consoleUtil";
import * as localeService from "../services/localeService";
import * as localeUtil from "../utils/localeUtil";

const {socket} = window;

const GlobalModel = {
  namespace: "global",
  state: {
    collapsed: false,
    notices: [],
    todoList:[],
    doneList:[],
    isShowTerritoryTree: false,
    isShowRevisionHistory: false,
    renderPageTitle: "",
    revisionHistoryCollapsed: false,
    territoryTreeCollapsed: false,
    layoutData: {},
    initLoading:false,
  },
  effects: {
    // 初始化系统数据，国际化这块不需要单独初始化
    *initSystemData({ payload, callBack }, { call, put }) {
      // yield put({ type: 'showInitLoading' });

      consoleUtil.log('start initSystemData===>');

      consoleUtil.log('start loadDefaultLanguage.');

      // const [defaultLanguageData, crmIntlData] = [
      //   yield call(localeService.loadDefaultLanguage, {}),
      //   yield call(localeService.loadAllLocales, {}),
      // ];

      // consoleUtil.log(defaultLanguageData, crmIntlData);
      // const defaultLanguageData = yield call(localeService.loadDefaultLanguage, {});
      // // const crmIntlData = yield call(localeService.loadCrmIntl, {});


      // if (defaultLanguageData.success) {
      //   const result = lodash.get(defaultLanguageData, 'resultData');
      //   if (!lodash.isEmpty(result)) {
      //     // lodash.set(result, 'value', 'en_US');
      //     localeUtil.changeLocale(lodash.get(result, 'value'));
      //   }
      // }
      // consoleUtil.log('end loadDefaultLanguage.');

      // consoleUtil.log('start loadIntl.');
      // if (crmIntlData.success) {
      //   const result = lodash.get(crmIntlData, 'resultData');
      //   localeUtil.setIntlSetting(result);
      // }
      // consoleUtil.log('end loadIntl.');

      consoleUtil.log('end initSystemData===>');

      // yield put({ type: 'hideInitLoading' });
      consoleUtil.log('initSystemData success ,ready to go home');
      const { isRedirectHome = true,loginType } = payload || {};
      if (isRedirectHome) {
      //   yield put(routerRedux.push('/home'));
      //   router.push('/home')
        window.location.href='/'
      }else{
        // window.location.reload();
      }
    },

    *fetchNotices(_, { call, put, select }) {
      const dealData = [
        {
          "criterias": [
            {
              "field": "owner",
              "operator": "in",
              "value": [
                storageUtil.get('userId')
              ]
            },
            {
              "field": "status",
              "operator": "==",
              "value": [
                0
              ]
            }
          ],
          needRelationQuery: false,
          joiner: "and",
          objectApiName: "alert",
          orders:[{
            field:'status',
            sorting:'asc'
          },{
            field:'create_time',
            sorting:'desc'
          }],
          pageNo: 1,
          pageSize: 10,
        },
        {
          "criterias": [
            {
              "field": "owner",
              "operator": "in",
              "value": [
                storageUtil.get('userId')
              ]
            },
            {
              "field": "status",
              "operator": "==",
              "value": [
                'todo'
              ]
            }
          ],
          needRelationQuery: false,
          joiner: "and",
          objectApiName: "fc_todo",
          orders:[{
            field:'create_time',
            sorting:'desc'
          }],
          pageNo: 1,
          pageSize: 10,

        },
      ];
      const response = yield call(batchQueryRecordList,{dealData});
      const noticesResult = lodash.get(response,'resultData.batch_result.0.result',[]);
      const todoListResult = lodash.get(response,'resultData.batch_result.1.result',[]);
      const noticeCount = lodash.get(response,'resultData.batch_result.0.resultCount',0);
      const todoCount = lodash.get(response,'resultData.batch_result.1.resultCount',0);

      const data = [];
      lodash.forEach(noticesResult,(item)=>{
        data.push({
          id: item.id,
          title: item.name,
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          datetime: moment(item.create_time),
          type: 'notification',
          read: !lodash.isEqual(item.status,'0'),
          version: item.version,
          content: item.content
        })
      });
      lodash.forEach(todoListResult,(item)=>{
        data.push({
          id: item.id,
          title: item.name,
          description: item.description,
          extra: item.task_type,
          status: item.task_type,
          type: 'event',
          read: !lodash.isEqual(item.status,'todo'),
          version: item.version,
        })
      });

      yield put({
        type: "saveNotices",
        payload: {
          notices:data,
          unreadNoticeCount:noticeCount,
          unreadTodoCount:todoCount,
        }
      });
      yield put({
        type: "user/changeNotifyCount",
        payload: {
          // totalCount: noticeCount+todoCount,// 无用
          unreadCount:noticeCount+todoCount,
        }
      });
    },

    *clearNotices({ payload,callback }, { call, put, select }) {
      const response = yield call(batchUpdateRecords,payload);
      if(response.success){
        yield put({
          type: "fetchNotices",
          payload: {}
        });
        if(callback)callback();
      }
    },

    *changeNoticeReadState({ payload,callback }, { call, put, select }) {
      const response = yield call(updateRecord,payload);

      if(response.success){
        yield put({
          type: "fetchNotices",
          payload: {
            // totalCount: notices.length,
            // unreadCount// notices.filter(item => !item.read).length
          }
        });
        if(callback)callback()
      }

    },

    *fetchTodoList({payload,callback}, { call, put, select }) {
      const {type,loadMore=false}=payload;
      const response = yield call(queryRecordList,payload);

      if(response.success){
        const todoListResult = lodash.get(response,'resultData.result',[]);
        // const resultCount = lodash.get(response,'resultData.resultCount');
        const pageCount = lodash.get(response,'resultData.pageCount');
        const data = [];
        lodash.forEach(todoListResult,(item)=>{
          // TODO 这里需要写活了才行，但是又没有走布局，该咋办，万能setting？
          data.push({
            id: item.id,
            title: item.name,
            description: item.description,
            extra: item.task_type,
            status: item.task_type,
            read: !lodash.isEqual(item.status,'todo'),
            type,
            version: item.version,
          })
        });
        let todoList = yield select(state => state.global.todoList);
        let doneList = yield select(state => state.global.doneList);
        if(!loadMore){
          todoList=[];
          doneList=[];
        }
        if(type==='todo'){
          yield put({
            type: "saveTodoList",
            payload: {
              todoList:[...todoList,...data,]
            }
          });
        } else if (type==='done'){
          yield put({
            type: "saveDoneList",
            payload: {
              doneList:[...doneList,...data,],
            }
          });
        }
        if(callback)callback(pageCount)
      }

      // yield put({
      //   type: "user/changeNotifyCount",
      //   payload: {
      //     // totalCount: noticeCount+todoCount,// 无用
      //     unreadCount:noticeCount+todoCount,
      //   }
      // });
    },

    * socket({ dispatch }, { select }) {
      socket.on('connect', function(){
        console.log('ws--connection')
      });
      socket.emit('register', 'hello!');

      socket.on('c_notify',function(msg){
        console.log('msg_update return==>',msg)
        if(msg){
          const key = `open${Date.now()}`;
          const btn = (
            <Button
              type="primary"
              onClick={() => {
                notification.close(key);
              }}
            >
              {formatMessage({
                id: "ok"
              })}
            </Button>
          );
          notification.open({
            message: formatMessage({
              id: "component.globalHeader.notification-updated"
            }),
            // description: '',
            btn,
            key,
            onClose: async () => {}
          });
        }
        dispatch({
          type: "global/fetchNotices"
        });
      })
      socket.on('c_leave',function(msg){
        console.log('c_leave return==>',msg)
      })
    }

  },
  reducers: {
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true
      },
      { payload }
    ) {
      return { ...state, ...payload };
    },

    saveNotices(state, { payload }) {
      const { notices, unreadNoticeCount, unreadTodoCount,} = payload;
      return {
        collapsed: false,
        ...state,
        notices,
        unreadNoticeCount,
        unreadTodoCount
      };
    },
    saveTodoList(state, { payload }) {
      const { todoList,} = payload;
      return {
        collapsed: false,
        ...state,
        todoList,
      };
    },
    saveDoneList(state, { payload }) {
      const { doneList,} = payload;
      return {
        collapsed: false,
        ...state,
        doneList,
      };
    },

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true
      },
      { payload }
    ) {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter(item => item.type !== payload)
      };
    },
    showInitLoading(state) {
      return {
        ...state,
        initLoading: true,
      };
    },
    hideInitLoading(state) {
      return {
        ...state,
        initLoading: false,
      };
    },
  },
  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }) => {
        if (typeof window.ga !== "undefined") {
          window.ga("send", "pageview", pathname + search);
        }
      });
    },
    socket({ dispatch }) {
      if(socket){
        dispatch({
          type: 'socket',
          dispatch,
        });
      }

    }
  }
};
export default GlobalModel;
