export default [
  {
    path: "/SpeakSearch",
    component: "./SpeakSearch/index.js"
  },
  {
    path: "/user",
    component: "../layouts/UserLayout",
    // component: './User/Login',
    routes: [
      {
        path: "/user/login",
        component: "./User/Login"
      },
      {
        path: "/user/reset_password",
        component: "./User/ResetPassword"
      }
    ]
  },
  {
    path: "/",
    component: "../layouts/BasicLayout",
    // Routes: ['src/pages/Authorized'],
    // authority: ['admin', 'user'],
    // exact: true,
    routes: [
      { path: "/", redirect: "/home" }, // 没有home页面，先行定死到岗位管理
      {
        path: "/iframe",
        name: "iframe",
        routes: [
          {
            path: "/iframe/approval_apply_manage",
            name: "ac_apply_manage",
            component: "./Ac/AcApplyManage"
          },
          {
            path: "/iframe/approval_model_manage",
            name: "ac_model_manage",
            component: "./Ac/AcModelManage"
          },
          {
            path: "/iframe/approval_process_manage",
            name: "ac_process_manage",
            component: "./Ac/AcProcessManage"
          },
          {
            path: "/iframe/approval_instance_manage",
            name: "ac_instance_manage",
            component: "./Ac/AcInstanceManage"
          },
          {
            path: "/iframe/approval_todo_manage",
            name: "ac_todo_manage",
            component: "./Ac/AcTodoManage"
          },
          {
            path: "/iframe/approval_done_manage",
            name: "ac_done_manage",
            component: "./Ac/AcDoneManage"
          },
          {
            path: "/iframe/approval_historic_list",
            name: "ac_historic_manage",
            component: "./Ac/AcHistoricManage"
          },
          {
            path: "/iframe/ac_node_setting",
            name: "ac_node_setting",
            component: "./Ac/AcNodeSetting"
          }
        ]
      },
      {
        path: "/ac",
        name: "ac",
        routes: [
          {
            path: "/ac/ac_apply_manage",
            name: "ac_apply_manage",
            component: "./Ac/AcApplyManage"
          },
          {
            path: "/ac/ac_model_manage",
            name: "ac_model_manage",
            component: "./Ac/AcModelManage"
          },
          {
            path: "/ac/ac_process_manage",
            name: "ac_process_manage",
            component: "./Ac/AcProcessManage"
          },
          {
            path: "/ac/ac_instance_manage",
            name: "ac_instance_manage",
            component: "./Ac/AcInstanceManage"
          },
          {
            path: "/ac/ac_todo_manage",
            name: "ac_todo_manage",
            component: "./Ac/AcTodoManage"
          },
          {
            path: "/ac/ac_done_manage",
            name: "ac_done_manage",
            component: "./Ac/AcDoneManage"
          },
          {
            path: "/ac/ac_history_list",
            name: "ac_done_manage",
            component: "./Ac/AcHistoricManage"
          },
          {
            path: "/ac/ac_node_setting",
            name: "ac_node_setting",
            component: "./Ac/AcNodeSetting"
          }
        ]
      },
      {
        path: "/sys_notification",
        component: "./SysNotices"
      },

      {
        component: "./404"
      }
    ]
  },
  {
    component: "./404"
  }
];
