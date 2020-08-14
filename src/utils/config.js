const tmAddress = "https://stg-tm.crmpower.cn";
/**
 * 和黄讲者查询外链接页面在pages/SpeakSearch下
 * 部署在oss静态页面下uat环境http://fcstatic.crmpower.cn/shpl_uat/index.html#/SpeakSearch
 *   stg环境 http://fcstatic.crmpower.cn/shpl/stage/index.html#/SpeakSearch
 *
 */
// const tmAddress = 'http://sf.shpl.com.cn:8010/fc-crm-tenant-management-application' 和黄讲着查询uat地址
const baseAddress = "https://stg-workflow-backend.territorypower.cn";
const getQueryString = name => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, "i");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};
const token = getQueryString("token");
localStorage.setItem("token", token);
module.exports = {
  deployEnvironment,
  basePathPrefix: "", // 这个是统一前缀功能，千万不要有最后的斜杠
  name: "WorkFlow",
  footerText: "ForceClouds software Co. Ltd",
  beiAnText: "京ICP备17004747号-2 ",
  version: "V1.0",
  tmURL: tmAddress,
  baseURL: baseAddress,
  ssoURL: ssoAddress,
  FS: fsAddress,
  PDF: pdfAddress,
  previewURL: previewAddress,
  DOMAIN_DEFAULT_DEBUG: ["localhost"],
  apiPrefix: "/api/v1",
  api: {
    tm: {
      query: {
        method: "post",
        path: "/rest/data_record/query" // post
      },
      fetchCustomObjectDescribe: {
        method: "get",
        path: "/rest/metadata/object_describe/all" // post
      },
      batchQuery: {
        method: "post",
        path: "/rest/data_record/batch_query" // post
      },
      updateRecord: {
        method: "put",
        path: "/rest/data_record/{api_name}/{id}" // post
      },
      batchUpdateRecord: {
        method: "put",
        path: "/rest/data_record/ubatch/{api_name}" // post
      },
      setting: {
        method: "get",
        path: "/rest/metadata/setting/workflow_category"
      },
      queryLocales: {
        method: "get",
        path: "/rest/metadata/translation/language/all"
      },
      defaultLanguage: {
        method: "get",
        path: "/rest/metadata/setting/default_language"
      }
    },
    ac: {
      // baseURL:tqAddress,
      model: {
        list: {
          path: "/rest/ac/model/list",
          method: "post"
        },
        create: {
          path: "/rest/ac/model/create",
          method: "post"
        },
        update: {
          path: "/rest/ac/model/{modelId}",
          method: "put"
        },
        detail: {
          path: "/rest/ac/model/{modelId}",
          method: "get"
        },
        delete: {
          path: "/rest/ac/model/{modelId}",
          method: "delete"
        },
        deploy: {
          path: "/rest/ac/model/{modelId}/deploy",
          method: "post"
        },
        designJson: {
          path: "/rest/ac/model/{modelId}/json",
          method: "post"
        },
        downLoadXML: {
          path: "/rest/ac/model/{modelId}/downLoad/xml",
          method: "post"
        }
      },
      process: {
        list: {
          path: "/rest/ac/process/list",
          method: "post"
        },
        activate: {
          path: "/rest/ac/process/{processId}/status/activate",
          method: "put"
        },
        suspend: {
          path: "/rest/ac/process/{processId}/status/suspend",
          method: "put"
        },
        update: {
          path: "/rest/ac/process/{processId}",
          method: "put"
        },
        delete: {
          path: "/rest/ac/process/{processId}",
          method: "delete"
        },
        image: {
          path: "/rest/ac/process/{procDefId}/export/image",
          method: "get"
        },
        xml: {
          path: "/rest/ac/process/{procDefId}/export/xml",
          method: "get"
        },
        node: {
          list: {
            path: "/rest/ac/process/{processId}/node/list",
            method: "get"
          },
          save: {
            path: "/rest/ac/process/{processId}/node/{nodeId}",
            method: "post"
          }
        },
        deploy: {
          path: "/rest/ac/process/deploy"
        },
        convertToModel: {
          path: "/rest/ac/process/convertToModel/{processId}",
          method: "post"
        }
      },
      instance: {
        list: {
          path: "/rest/ac/instance/list",
          method: "post"
        },
        activate: {
          path: "/rest/ac/instance/{processId}/status/activate",
          method: "put"
        },
        suspend: {
          path: "/rest/ac/instance/{processId}/status/suspend",
          method: "put"
        },
        delete: {
          path: "/rest/ac/instance/{instanceId}",
          method: "delete"
        },
        image: {
          path: "/rest/ac/instance/{procInstId}/export/image",
          method: "get"
        }
      },
      task: {
        list: {
          todo: {
            // 待办
            path: "/rest/ac/task/list/todo",
            method: "post"
          },
          done: {
            // 已经完成
            path: "/rest/ac/task/list/done",
            method: "post"
          }
        },
        pass: {
          // 通过
          path: "/rest/ac/task/pass",
          method: "post"
        },
        back: {
          // 驳回
          path: "/rest/ac/task/back",
          method: "post"
        },
        reject: {
          // 拒绝
          path: "/rest/ac/task/reject",
          method: "post"
        },
        addExecution: {
          // 加签
          path: "/rest/ac/task/addExecution",
          method: "post"
        },
        delegate: {
          // 委托
          path: "/rest/ac/task/delegate",
          method: "post"
        },
        callback: {
          // 取回
          path: "/rest/ac/task/callback",
          method: "post"
        }
      },
      business: {
        list: {
          path: "/rest/ac/business/list",
          method: "post"
        },
        cancel: {
          path: "/rest/ac/business/cancel",
          method: "post"
        },
        restart: {
          path: "/rest/ac/business/restart",
          method: "post"
        }
      },
      historic: {
        list: {
          path: "/rest/ac/historic/list",
          method: "post"
        }
      }
    }
  }
};
