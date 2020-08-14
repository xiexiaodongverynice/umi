import React, { PureComponent, Fragment } from 'react';
import { Table, Modal, message, Button } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { formatMessage } from "umi-plugin-react/locale";
import Ellipsis from '../../../components/Ellipsis';
import styles from './DataList.less';
import urlUtil from "../../../utils/urlUtil";

const {confirm} = Modal;

const DataList = ({ onDesignItem, onDeployItem,  onDeleteItem, onEditItem,selectedRows,data,...tableProps }) => {

  const handleDesignOnline = (record,e)=>{
    onDesignItem(record);
  };
  const downloadXml=(record)=>{
    const url=urlUtil.downloadAcModelXML(record.id);
    window.open(url);
  }
  const handleDeploy = (record,e)=>{
    confirm({
      title: `确认部署该模版：${record.name}`,
      onOk() {
        onDeployItem(record);
      },
    });
  };

  const handleDelete = (record,e)=>{
    confirm({
      title: '确认删除该条数据?',
      onOk() {
        onDeleteItem(record.id);
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
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    },{
      title: '标识Key',
      dataIndex: 'key',
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    },
    // {
    //   title: '备注描述',
    //   dataIndex: 'description',
    //   render: (text, record) => {
    //     const metaInfo = _.get(record,'metaInfo','{}');
    //     const description = _.get(JSON.parse(metaInfo),'description');
    //    return <Ellipsis className={styles.item} length={30} tooltip>{description}</Ellipsis>
    //   },
    // },
    {
      title: '版本',
      width:80,
      dataIndex: 'revision',
    }, {
      title: formatMessage({ id: 'table.column.createTime', defaultMessage: '创建时间' }),
      dataIndex: 'createTime',
      width:200,
      render: (text, record) => {
        if (text) { return moment(text).format('YYYY-MM-DD HH:mm:ss'); }
      },
    },{
      title: '更新时间',
      dataIndex: 'lastUpdateTime',
      width:200,
      render: (text, record) => {
        if (text) { return moment(text).format('YYYY-MM-DD HH:mm:ss'); }
      },
    }, {
      title: formatMessage({ id: 'table.column.operation', defaultMessage: '操作' }),
      key: 'operation',
      width: 400,
      render: (text, record) => (
        <Fragment>
          <Button type="primary" onClick={() => handleDesignOnline(record)} style={{ marginRight: '2px' }}>在线设计</Button>
          <Button onClick={() => handleDeploy(record)} style={{ marginRight: '2px' }}>部署发布</Button>
          <Button onClick={()=>downloadXml(record)} style={{ marginRight: '2px' }}>导出XML</Button>
          <Button type="danger" onClick={() => handleDelete(record)}>删除</Button>
        </Fragment>
        ),
    },
  ];

  return (
    <div>
      <Table
        {...tableProps}
        bordered
        // size="middle"
        // scroll={{ x: 1200 }}
        columns={columns}
        // simple
        className={styles.table}
        rowKey={(record) => _.get(record, 'id', '')}
        expandedRowRender={(record) => <Ellipsis style={{ margin: 0 }} lines={8} tooltip>{_.get(JSON.parse( _.get(record,'metaInfo','{}')),'description')}</Ellipsis>}
      />

    </div>
  );
};

export default DataList;
