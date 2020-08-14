import React, { PureComponent, Fragment } from 'react';
import { Table, Modal, message, Button, Icon } from "antd";
import _ from 'lodash';
import router from "umi/router";
import moment from 'moment';
import { formatMessage } from "umi-plugin-react/locale";
import Ellipsis from '../../../components/Ellipsis';
import styles from './DataList.less';
import urlUtil from "../../../utils/urlUtil";

const {confirm} = Modal;

const DataList = ({onConvertToModel,onActivateItem, onSuspendItem, onDeployItem,  onDeleteItem, onEditItem, onImageView, onXmlDownload,selectedRows,data,...tableProps }) => {

  const handleDelete = (record,e)=>{
    confirm({
      title: '确认删除该条数据?',
      onOk() {
        onDeleteItem(record.id);
      },
    });
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


  // 节点设置
  const handleFlowNodeSetting = (record,e)=>{
    router.push({
      pathname: window.IFRAME?'/iframe/ac_node_setting':'/ac/ac_node_setting',
      query: {
        id:record.process_id
      },
    });
  };

  // 编辑节点
  const handleEdit = (record,e)=>{
    onEditItem(record);
  };

  // 转模型
  const handleTransferModel = (record,e)=>{
    confirm({
      title: '是否将流程转化成模型?',
      onOk() {
        onConvertToModel(record);
      },
    });
  };

  const columns = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    // },
    {
      title: '名称',
      dataIndex: 'name',
      // width: 100,
      // fixed: 'left',
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    },{
      title: '标识Key',
      dataIndex: 'process_key',
      // width: 100,
      // fixed: 'left',
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    }, /* {
      title: '所属分类',
      width:100,
      dataIndex: 'categoryTitle',
      render: (text, record) => {
          return text
      },
    }, */{
      title: '版本',
      width:80,
      dataIndex: 'r_version',
      render: (text, record) => {
          return <Ellipsis className={styles.item} lines={1} tooltip>{`v.${text}`}</Ellipsis>
      },
    },{
      title: formatMessage({ id: 'table.column.status', defaultMessage: '状态' }),
      dataIndex: 'status',
      width:80,
      render: (text, record) => {
        return text
      },
    },{
      title: '流程图片',
      dataIndex: 'diagram_name',
      width:150,
      render: (text, record) => {
        return <span style={{cursor:'pointer'}} onClick={()=>{onImageView(record)}}>
          <Ellipsis className={styles.item} lines={1} tooltip>
            {text}
          </Ellipsis>
        </span>
      },
    },{
      title: '流程XML',
      dataIndex: 'xml_name',
      width:150,
      render: (text, record) => {
        return <span style={{cursor:'pointer'}} onClick={()=>{onXmlDownload(record)}}>
          <Ellipsis className={styles.item} lines={1} tooltip>
            {text}
          </Ellipsis>
        </span>
      },
    },/* {
      title: '表单路由',
      dataIndex: 'route_name',
      width:150,
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    },{
      title: '业务对象',
      dataIndex: 'business_table',
      width:150,
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    }, */
    {
      title: '部署时间',
      dataIndex: 'create_time',
      width:200,
      render: (text, record) => {
        if (text) { return moment(text).format('YYYY-MM-DD HH:mm:ss'); }
      },
    },
   /* {
      title: '更新时间',
      dataIndex: 'update_time',
      width:200,
      render: (text, record) => {
        if (text) { return moment(text).format('YYYY-MM-DD HH:mm:ss'); }
      },
    }, */
    {
      title: formatMessage({ id: 'table.column.operation', defaultMessage: '操作' }),
      key: 'operation',
      width: 350,
      fixed: 'right',
      render: (text, record) => (
        <Fragment>
          {record.status === 1 && false &&
          <Button size='small' onClick={() => handleSuspendWorkFlow(record)} style={{ marginRight: '2px',borderColor:"orange", backgroundColor:"orange",color:"white" }}>
            <Icon type="pause" /> 挂起
          </Button>
          }
          {
            record.status === 0 && false &&
            <Button size='small' onClick={() => handleActivateWorkFlow(record)} style={{ marginRight: '2px',borderColor:"orange", backgroundColor:"orange",color:"white" }}>
              <Icon type="play-circle" />激活
            </Button>
          }


          <Button size='small' onClick={() => handleFlowNodeSetting(record)} style={{ marginRight: '2px',borderColor:"#1890FF",backgroundColor:"#1890FF",color:"white"  }}>节点设置</Button>
          <Button size='small' onClick={() => handleEdit(record)} style={{ marginRight: '2px' }}>编辑</Button>
          <Button size='small' onClick={() => handleTransferModel(record)} style={{ marginRight: '2px' }}>转模型</Button>
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
        // scroll={{ x: 1800, y: 300 }}
        columns={columns}
        className={styles.table}
        rowKey={(record) => _.get(record, 'id', '')}
        // expandedRowRender={(record) => <Ellipsis style={{ margin: 0 }} lines={8} tooltip>{ _.get(record,'description')}</Ellipsis>}
      />

    </div>
  );
};

export default DataList;
