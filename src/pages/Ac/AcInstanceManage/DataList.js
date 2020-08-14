import React, { PureComponent, Fragment } from 'react';
import router from "umi/router";
import { Table, Modal, message, Button, Icon, Badge } from "antd";
import _ from 'lodash';
import { formatMessage } from "umi-plugin-react/locale";
import moment from 'moment';
import Ellipsis from '../../../components/Ellipsis';
import styles from './DataList.less';

const {confirm} = Modal;

const DataList = ({ onActivateItem, onSuspendItem, onDeployItem,  onDeleteItem, onEditItem, onImageView, selectedRows,data,...tableProps }) => {

  const handleDelete = (record,e)=>{
    onDeleteItem(record);
  };
  const handleViewApprovalDetail = (record,e)=>{
    router.push({
      pathname: window.IFRAME?'/iframe/approval_historic_list':'/ac/ac_history_list',
      query: {
        id:record.businessKey
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
  // 激活流程
  const handleActivateWorkFlow = (record,e)=>{
    confirm({
      title: '确认激活该流程?',
      onOk() {
        onActivateItem(record);
      },
    });

  };
  // 挂起流程
  const handleSuspendWorkFlow = (record,e)=>{
    confirm({
      title: '确认挂起该流程?',
      onOk() {
        onSuspendItem(record);
      },
    });
  };

  const columns = [
    {
      title: '流程实例ID',
      dataIndex: 'id',
      // width: 110,
      // fixed: 'left',
    },
    {
      title: formatMessage({ id: 'table.column.businessTitle', defaultMessage: '流程名称' }),
      dataIndex: 'name',
      // width: 250,
      // fixed: 'left',
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    },{
      title: '标识Key',
      dataIndex: 'key',
      // width: 150,
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    },{
      title: '版本',
      // width:80,
      dataIndex: 'version',
      render: (text, record) => {
          return <Ellipsis className={styles.item} lines={1} tooltip>{`v.${text}`}</Ellipsis>
      },
    },{
      title: formatMessage({ id: 'table.column.status', defaultMessage: '状态' }),
      dataIndex: 'isSuspended',
      width:80,
      render: (text, record) => {
        return text?<Badge status="warning" text="挂起" />:<Badge status="success" text="激活" />;
      },
    },{
      title: '申请人',
      dataIndex: 'submitterName',
      width: 100,
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    },{
      title: '当前环节',
      dataIndex: 'currTaskName',
      // width:200,
      render: (text, record) => {
        // return <Ellipsis className={styles.item} lines={1} tooltip>{_.toString(text)}</Ellipsis>
        return <span style={{cursor:'pointer'}} onClick={()=>{onImageView(record)}}>
          <Ellipsis className={styles.item} lines={1} tooltip>
            {text}
          </Ellipsis>
        </span>
      },
    }, {
      title: formatMessage({ id: 'table.column.operation', defaultMessage: '操作' }),
      key: 'operation',
      width: 350,
      // fixed: 'right',
      render: (text, record) => (
        <Fragment>
          {!_.get(record,'isSuspended') && false &&
          <Button size='small' onClick={() => handleSuspendWorkFlow(record)} style={{ marginRight: '2px',borderColor:"rgb(252,135,10)", backgroundColor:"rgb(252,135,10)",color:"white" }}>
            <Icon type="pause" /> 挂起 {_.get(record,'isSuspended')}
          </Button>
          }
          {
            _.get(record,'isSuspended')&& false &&
            <Button size='small' onClick={() => handleActivateWorkFlow(record)} style={{ marginRight: '2px',borderColor:"rgb(32,181,88)", backgroundColor:"rgb(32,181,88)",color:"white" }}>
              <Icon type="play-circle" />激活 {_.get(record,'isSuspended')}
            </Button>
          }

          <Button type="primary" onClick={() => handleViewApprovalDetail(record)} size='small' style={{ marginRight: '2px' }}>审批详情</Button>
          <Button size='small' onClick={() => handleRefRecordDetail(record)} style={{ marginRight: '2px' }}>表单数据</Button>
          <Button size='small' type="danger" onClick={() => handleDelete(record)} style={{borderColor:"red", backgroundColor:"red",color:"white" }}>删除</Button>
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
