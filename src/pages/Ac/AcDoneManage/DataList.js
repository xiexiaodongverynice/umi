import React, { PureComponent, Fragment } from 'react';
import router from "umi/router";
import { Table, Modal, message, Button, Icon, Badge, Tag } from "antd";
import _ from 'lodash';
import { formatMessage } from "umi-plugin-react/locale";
import Ellipsis from '../../../components/Ellipsis';
import styles from './DataList.less';
import { millsToTime } from "../../../utils";

const DataList = ({ onPassItem, onSuspendItem, onDeployItem,  onDeleteItem, onEditItem,selectedRows,data,...tableProps }) => {

  const handlePass = (record,e)=>{
    onPassItem(record)
  };

  const handleViewApprovalDetail = (record,e)=>{
    router.push({
      pathname: window.IFRAME?'/iframe/approval_historic_list':'/ac/ac_history_list',
      query: {
        id:record.businessKey,
        procInstId:record.procInstId,
      },
    });
  };
  const handleRefRecordDetail = (record,e)=>{
    if(!_.has(record,'detailUrl')){
      message.error(formatMessage(({id:'table.message.not_found_form_detail_url'})))
    }else{
      const url = _.isBoolean(window.SSL)?_.replace(record.detailUrl,`http${window.SSL?'':'s'}:`,`http${window.SSL?'s':''}:`):record.detailUrl;
      window.open( url,"_target");
    }
  };


  const columns = [
    {
      title: formatMessage({ id: 'table.column.businessTitle', defaultMessage: '流程名称' }),
      dataIndex: 'businessTitle',
      // width: 250,
      // fixed: 'left',
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    },
    {
      title: formatMessage({ id: 'table.column.processBelong', defaultMessage: '所属流程' }),
      dataIndex: 'processName',
      // width: 250,
      // fixed: 'left',
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    },{
      title: formatMessage({ id: 'table.column.assigneeName', defaultMessage: '受托人' }),
      dataIndex: 'assigneeName',
      // width: 250,
      // fixed: 'left',
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    },{
      title: formatMessage({ id: 'table.column.ownerName', defaultMessage: '委托人' }),
      dataIndex: 'ownerName',
      // width: 250,
      // fixed: 'left',
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    },
    {
      title: formatMessage({ id: 'table.column.submitterName', defaultMessage: '流程发起人' }),
      dataIndex: 'submitterName',
      // width: 200,
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    },
    // {
    //   title: '优先级',
    //   dataIndex: 'priority',
    //   // width: 150,
    //   render: (text, record) => {
    //     const priorityOption =_.find(priorityOptions,{value:text});
    //     const label = _.get(priorityOption,'label',text);
    //     const color = _.get(priorityOption,'color');
    //     return  <Tag color={color} key={`tag-${text}`}>{label}</Tag>
    //   },
    // },
    // {
    //   title: 'approvalFlowResult',
    //   dataIndex: 'approvalFlowResult',
    //   // width:80,
    //   // render: (text, record) => {
    //   //   return text;
    //   // },
    // },
    {
      title: formatMessage({ id: 'table.column.operation', defaultMessage: '审批操作' }),
      dataIndex: 'deleteReason',
      // width:80,
      render: (text, record) => {
        return text;
      },
    },{
      title: formatMessage({ id: 'table.column.comment', defaultMessage: '审批意见' }),
      dataIndex: 'comment',
      // width:80,
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>;
      },
    },{
      title: formatMessage({ id: 'table.column.duration', defaultMessage: '耗时' }),
      dataIndex: 'duration',
      // width:200,
      render: (text, record) => {
        return millsToTime(text);
      },
    },{
      title: formatMessage({ id: 'table.column.endTime', defaultMessage: '审批时间' }),
      dataIndex: 'endTime',
      // width:200,
    }, {
      title: formatMessage({ id: 'table.column.operation', defaultMessage: '操作' }),
      key: 'operation',
      // width: 350,
      // fixed: 'right',
      render: (text, record) => (
        <Fragment>
          <Button type="primary" size='small' onClick={() => handleRefRecordDetail(record)} style={{ marginRight: '2px' }}>{formatMessage({ id: 'table.button.formData', defaultMessage: '表单数据' })}</Button>
          <Button onClick={() => handleViewApprovalDetail(record)} size='small'>{formatMessage({ id: 'table.button.approvalHistory', defaultMessage: '审批历史' })}</Button>
        </Fragment>
      ),
    },
  ];

  return (
    <div>
      <Table
        {...tableProps}
        bordered
        // scroll={{ x: 1150, y: 300 }}
        columns={columns}
        className={styles.table}
        rowKey={(record) => _.get(record, 'id', '')}
        // expandedRowRender={(record) => <Ellipsis style={{ margin: 0 }} lines={8} tooltip>{ _.get(record,'description')}</Ellipsis>}
      />

    </div>
  );
};

export default DataList;
