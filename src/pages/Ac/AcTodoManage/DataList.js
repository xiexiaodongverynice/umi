import React, { PureComponent, Fragment } from 'react';
import { Table, Modal, message, Button, Icon, Badge, Tag } from "antd";
import _ from 'lodash';
import { formatMessage } from "umi-plugin-react/locale";
import router from "umi/router";
import Ellipsis from '../../../components/Ellipsis';
import styles from './DataList.less';

const {confirm} = Modal;

const DataList = ({ onPassItem, onRejectItem, onBackItem, onAddSignItem, onEntrustItem, selectedRows, data, ...tableProps }) => {

  const handlePass = (record,e)=>{
        onPassItem(record);
  };

  const handleReject = (record,e)=>{
    onRejectItem(record);
  };

  const handleAddSign = (record,e)=>{
    onAddSignItem(record);
  };

  const handleEntrust = (record,e)=>{
    onEntrustItem(record);
  };

  // const handleBack = (record,e)=>{
  //   confirm({
  //     title: `确认驳回该审批：${record.name}`,
  //     onOk() {
  //       onBackItem(record);
  //     },
  //   });
  //
  // };

  const handleViewApprovalHistory = (record,e)=>{
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
    }else {
      const url = _.isBoolean(window.SSL)?_.replace(record.detailUrl,`http${window.SSL?'':'s'}:`,`http${window.SSL?'s':''}:`):record.detailUrl;
      window.open( url,"_target");
    }
  };

  const columns = [
    // {
    //   title: '任务名称',
    //   dataIndex: 'name',
    //   // width: 250,
    //   // fixed: 'left',
    //   render: (text, record) => {
    //     return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
    //   },
    // },
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
    //   title: formatMessage({ id: 'table.column.status', defaultMessage: '状态' }),
    //   dataIndex: 'isSuspended',
    //   // width:80,
    //   render: (text, record) => {
    //     return text?<Badge status="red" text="已挂起" />:<Badge status="success" text="已激活" />;
    //   },
    // },
    {
      title: formatMessage({ id: 'table.column.createTime', defaultMessage: '创建时间' }),
      dataIndex: 'createTime',
      // width:200,
    }, {
      title: formatMessage({ id: 'table.column.operation', defaultMessage: '操作' }),
      key: 'operation',
      className:(_.size(_.get(window.LAYOUT,'button',{})) === 6 && !_.has(_.invert(_.get(window.LAYOUT,'button',{})),'true')) ?'tableColumnNoShow':'',
      // width: 350,
      // fixed: 'right',
      render: (text, record) => {
        const isSuspended = _.get(record,'isSuspended');
        const suspendedTitle = isSuspended?'流程挂起，暂时无法操作':'';
        return (
          <Fragment>
            {_.get(window.LAYOUT,'button.formData',true) && <Button type="primary" size='small' onClick={() => handleRefRecordDetail(record)} style={{ marginRight: '2px', marginTop: '2px' }}>{formatMessage({ id: 'table.button.formData', defaultMessage: '表单数据' })}</Button>}
            {_.get(window.LAYOUT,'button.approvalHistory',true) &&<Button onClick={() => handleViewApprovalHistory(record)} size='small' style={{ marginRight: '2px', marginTop: '2px', borderColor:"rgb(40,167,242)", backgroundColor:"rgb(40,167,242)",color:"white" }}>{formatMessage({ id: 'table.button.approvalHistory', defaultMessage: '审批历史' })}</Button>}
            {_.get(window.LAYOUT,'button.pass',true) && <Button disabled={isSuspended} title={suspendedTitle} type="primary" size='small' onClick={() => handlePass(record)} style={{ marginRight: '2px', marginTop: '2px', borderColor:"rgb(32,181,88)", backgroundColor:"rgb(32,181,88)",color:"white" }}>{formatMessage({ id: 'table.button.pass', defaultMessage: '同意' })}</Button>}
            {_.get(window.LAYOUT,'button.reject',true) && <Button disabled={isSuspended} title={suspendedTitle} type="primary" size='small' onClick={() => handleReject(record)} style={{ marginRight: '2px', marginTop: '2px', borderColor:"rgb(252,135,10)", backgroundColor:"rgb(252,135,10)",color:"white" }}>{formatMessage({ id: 'table.button.reject', defaultMessage: '拒绝' })}</Button>}

            {
              (_.get(record,'node.allowDelegate')&&(!_.has(record,'owner')||record.owner==record.assignee))
              &&
              _.get(window.LAYOUT,'button.delegate',true)
              &&
              <Button disabled={isSuspended} title={suspendedTitle} size='small' onClick={() => handleEntrust(record)} style={{ marginRight: '2px', marginTop: '2px' }}>{formatMessage({ id: 'table.button.delegate', defaultMessage: '委托' })}</Button>
            }
            {
              (_.get(record,'node.allowAddExecution')&&(!_.has(record,'owner')||record.owner==record.assignee))
              &&
              _.get(window.LAYOUT,'button.addExecution',true)
              &&
              <Button disabled={isSuspended} title={suspendedTitle} size='small' onClick={() => handleAddSign(record)} style={{ marginRight: '2px', marginTop: '2px' }}>{formatMessage({ id: 'table.button.addExecution', defaultMessage: '加签' })}</Button>
            }
            {/* <Button type="primary" size='small' onClick={() => handleBack(record)} style={{ marginRight: '2px',borderColor:"rgb(252,135,10)", backgroundColor:"rgb(252,135,10)",color:"white" }}>驳回</Button> */}
          </Fragment>
        );

      },
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
