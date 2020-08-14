import React, { PureComponent, Fragment } from 'react';
import { Table, Modal, message, Button, Icon, Badge, Tag, Form, Input } from "antd";
import _ from 'lodash';
import { formatMessage } from "umi-plugin-react/locale";
import moment from 'moment';
import router from "umi/router";
import Ellipsis from '../../../components/Ellipsis';
import styles from './DataList.less';
import {statusOptions,approvalResultOptions} from "../../../utils/acStatusOptions";

const {confirm} = Modal;
const {TextArea} = Input;

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

const DataList = ({ onCancelItem, onReStartItem,onImageView, selectedRows,data,iframe,...tableProps }) => {

  const handleCancel = (record,e)=>{
    onCancelItem(record);
  };
  const handleReApply = (record,e)=>{
    confirm({
      title: `${formatMessage({id:'table.pageTitle.confirm_restart'})}`,
      content: record.title,
      onOk() {
        onReStartItem(record);
      },
    });
  };

  const handleViewApprovalDetail = (record,e)=>{
    router.push({
      pathname: window.IFRAME?'/iframe/approval_historic_list':'/ac/ac_history_list',
      query: {
        id:record.id
      },
    });
  };

  const handleRefRecordDetail = (record,e)=>{
    if(!_.has(record,'detail_url')){
      message.error(formatMessage(({id:'table.message.not_found_form_detail_url'})))
    }else{
      const url = _.isBoolean(window.SSL)?_.replace(record.detail_url,`http${window.SSL?'':'s'}:`,`http${window.SSL?'s':''}:`):record.detail_url;
      window.open( url,"_target");
    }
  };

  const columns = [
    {
      title: formatMessage({ id: 'table.column.businessTitle', defaultMessage: '流程名称' }),
      dataIndex: 'title',
      // width: 250,
      // fixed: 'left',
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    },
    {
      title: formatMessage({ id: 'table.column.processBelong', defaultMessage: '所属流程' }),
      dataIndex: 'process_name',
      // width: 150,
      // fixed: 'left',
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    },{
      title: formatMessage({ id: 'table.column.currentNode', defaultMessage: '当前节点' }),
      dataIndex: 'curr_task_name',
      // width: 250,
      // fixed: 'left',
      render: (text, record) => {
        // return <Ellipsis className={styles.item} lines={1} tooltip>{_.toString(text)}</Ellipsis>
        return <span style={{cursor:'pointer'}} onClick={()=>{onImageView(record)}}>
          <Ellipsis className={styles.item} length={20} tooltip>
            {text}
          </Ellipsis>
        </span>
      },
    },
    {
      title: formatMessage({ id: 'table.column.status', defaultMessage: '状态' }),
      dataIndex: 'status',
      // width:80,
      render: (text, record) => {
        const option =_.find(statusOptions,{value:text});
        const label = formatMessage({id:_.get(option,'label')});
        const color = _.get(option,'color');
        return  <Tag color={color} key={`tag-${text}`}>{label}</Tag>
      },
    },{
      title: formatMessage({ id: 'table.column.approvalFlowResult', defaultMessage: '审批结果' }),
      dataIndex: 'approval_flow_result',
      // width:80,
      render: (text, record) => {
        const option =_.find(approvalResultOptions,{value:text});
        const label = formatMessage({id:_.get(option,'label')});
        const color = _.get(option,'color');
        return  <Tag color={color} key={`tag-${text}`}>{label}</Tag>
      },
    },{
      title: formatMessage({ id: 'table.column.applyTime', defaultMessage: '申请时间' }),
      dataIndex: 'apply_time',
      // width:200,
      render: (text, record) => {
        if (text) { return moment(text).format('YYYY-MM-DD HH:mm:ss'); }
      },
    },
    // {
    //   title: formatMessage({ id: 'table.column.createTime', defaultMessage: '创建时间' }),
    //   dataIndex: 'create_time',
    //   // width:200,
    //   render: (text, record) => {
    //     if (text) { return moment(text).format('YYYY-MM-DD HH:mm:ss'); }
    //   },
    // },
    {
      title: formatMessage({ id: 'table.column.operation', defaultMessage: '操作' }),
      key: 'operation',
      width: 245,
      className:(_.size(_.get(window.LAYOUT,'button',{})) === 4 && !_.has(_.invert(_.get(window.LAYOUT,'button',{})),'true')) ?'tableColumnNoShow':'',
      // fixed: 'right',
      render: (text, record) => {
        return <Fragment>
          {_.get(window.LAYOUT,'button.formData',true) && <Button type="primary" size='small' onClick={() => handleRefRecordDetail(record)} style={{ marginRight: '2px' }}>{formatMessage({ id: 'table.button.formData', defaultMessage: '表单数据' })}</Button>}
          {_.get(window.LAYOUT,'button.approvalHistory',true) && <Button onClick={() => handleViewApprovalDetail(record)} size='small' style={{ marginRight: '2px',borderColor:"rgb(40,167,242)", backgroundColor:"rgb(40,167,242)",color:"white" }}>{formatMessage({ id: 'table.button.approvalHistory', defaultMessage: '审批历史' })}</Button>}
          {
            (record.approval_flow_result==1&&record.status==1)
            &&
            _.get(window.LAYOUT,'button.cancel',true)
            &&
            <Button type="primary" size='small' onClick={() => handleCancel(record)} style={{ marginRight: '2px',borderColor:"rgb(252,135,10)", backgroundColor:"rgb(252,135,10)",color:"white" }}>{formatMessage({ id: 'table.button.cancel', defaultMessage: '撤回申请' })}</Button>
          }
          {
            (record.approval_flow_result==0)
            &&
            _.get(window.LAYOUT,'button.restart',true)
            &&
            <Button type="primary" size='small' onClick={() => handleReApply(record)} style={{ borderColor:"#3CB371", backgroundColor:"#3CB371",color:"white" }}>{formatMessage({ id: 'table.button.restart', defaultMessage: '重新申请' })}</Button>
          }
        </Fragment>
      }
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
