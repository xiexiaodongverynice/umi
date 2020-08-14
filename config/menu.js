import _ from "lodash";
import * as storageUtil from "@/utils/storageUtil";

export const menuData = [
  // {
  //   name: 'Home', // 页面名称，会展示在菜单栏中
  //   path: '/', // 匹配的路由
  //   icon: 'home', // 页面图标，会展示在菜单栏中,
  // },
  // {
  //   name: 'Home', // 页面名称，会展示在菜单栏中
  //   path: 'home', // 匹配的路由
  //   icon: 'home', // 页面图标，会展示在菜单栏中,
  // },
  {
    apiName:'ac_apply_manage',
    name: "我的申请",// 实际菜单路径，[……parent_path+current_path]
    path: "/ac/ac_apply_manage"
    //authority: ['tq_menu_ac_process_manage'],
  },
  {
    apiName:'ac_todo_manage',
    name: "我的待办",// 实际菜单路径，[……parent_path+current_path]
    path: "/ac/ac_todo_manage"
    //authority: ['tq_menu_ac_process_manage'],
  },
  {
    apiName:'ac_done_manage',
    name: "我的已办",// 实际菜单路径，[……parent_path+current_path]
    path: "/ac/ac_done_manage"
    //authority: ['tq_menu_ac_process_manage'],
  },
  {
    apiName:'ac_instance_manage',
    name: "实例管理",// 实际菜单路径，[……parent_path+current_path]
    path: "/ac/ac_instance_manage"
    //authority: ['tq_menu_ac_process_manage'],
  },
  {
    apiName:'ac_process_manage',
    name: "流程管理",// 实际菜单路径，[……parent_path+current_path]
    path: "/ac/ac_process_manage"
    //authority: ['tq_menu_ac_process_manage'],
  },
  {
    apiName:'ac_model_manage',
    name: "模版管理",
    path: "/ac/ac_model_manage"
    //authority: ['tq_menu_ac_model_manage'],
  },
  {
    apiName:'ac_category_manage',
    name: "流程分类管理",
    hideInMenu: true,// 隐藏菜单
    path: "/ac/ac_category_manage"
    //authority: ['tq_menu_ac_category_manage'],
  }

  // {
  //     name: '工作流程',
  //     path: '/ac',
  //     //authority: ['tq_menu_ac'],
  //     children:[
  //
  //       {
  //         name: '流程管理',// 实际菜单路径，[……parent_path+current_path]
  //         path: '/ac_process_manage',
  //         //authority: ['tq_menu_ac_process_manage'],
  //       },
  //       {
  //         name: '模版管理',
  //         path: '/ac_model_manage',
  //         //authority: ['tq_menu_ac_model_manage'],
  //       },
  //       {
  //         name: '流程分类管理',
  //         hideInMenu: true,// 隐藏菜单
  //         path: '/ac_category_manage',
  //         //authority: ['tq_menu_ac_category_manage'],
  //       },
  //     ]
  // },
  // {
  //   name: '规则报告',
  //   // icon: 'database',
  //   path: '/dashboard/rule_report',
  //   alias: 'rule_report', // 外部引用路径
  //   authority: ['tq_menu_rule_report']
  // },
];

function hasPermissionMenu(data) {
  const userPermission = storageUtil.get("userPermission");
  const newData = [];
  data.map((item) => {
    if (!_.isEmpty(item.authority)) {
      const menuTerritoryAdmin = _.get(userPermission, `function.${item.authority[0]}`);
      if (menuTerritoryAdmin == "2") {
        newData.push(item);
      }
    } else {
      newData.push(item);
    }
  });
  return newData;
}

function formatter(data, parentPath = "", parentAuthority) {
  const newData = hasPermissionMenu(data);
  return newData.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }

    const locale = `menu.${item.apiName}`;

    const result = {
      ...item,
      name:item.name,
      path,
      authority: item.authority || parentAuthority
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

function isUrl(path) {
  return reg.test(path);
}

export const getMenuData = () => formatter(menuData);
