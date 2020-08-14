const priorityOptions =[
  {"label": "table.option.priority.general","value":0,"color":'green'},

  {"label": "table.option.priority.important","value":1,"color":'orange'},

  {"label": "table.option.priority.urgency","value":2,"color":'red'},
];

const statusOptions =[// 0草稿默认 1处理中 2结束
  {"label":"table.option.status.draft","value":0,"color":''},

  {"label": "table.option.status.dealing","value":1,"color":'orange'},

  {"label": "table.option.status.finish","value":2,"color":'red'},

  {"label": "table.option.status.canceled","value":3,"color":'pink'}
];

const approvalResultOptions =[// 0未提交默认 1处理中 2通过 3拒绝
  {"label": "table.option.result.unCommitted","value":0,"color":''},

  {"label": "table.option.result.dealing","value":1,"color":'orange'},

  {"label": "table.option.result.pass","value":2,"color":'green'},

  {"label": "table.option.result.reject","value":3,"color":'red'}
];

export {
  priorityOptions,statusOptions,approvalResultOptions
}
