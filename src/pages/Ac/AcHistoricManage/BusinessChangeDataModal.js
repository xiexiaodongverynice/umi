import React, { Fragment, PureComponent } from "react";
import _ from 'lodash';
import moment from "moment";
import { formatMessage } from "umi-plugin-react/locale";
import { Form, Input, Modal, Select, Table, Tag } from "antd";
import Ellipsis from "../../../components/Ellipsis";
import styles from "../AcTodoManage/DataList.less";
import {statusOptions,approvalResultOptions} from "../../../utils/acStatusOptions";

export default class modal  extends PureComponent {

  state={
    selectedRowKey:null
  };

  handleOk = () => {
    const { onOk } = this.props;
    const { selectedRowKey } = this.state;
    onOk(selectedRowKey);
  };

  render() {
    const { businessList=[], item,...modalProps } = this.props;
    const { selectedRowKey } = this.state;
    const modalOpts = {
      ...modalProps,
      onOk: this.handleOk,
    };
    const rowSelection = {
      type: "radio",
      selectedRowKeys:[selectedRowKey||item],
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(
        //   `selectedRowKeys: ${selectedRowKeys}`,
        //   "selectedRows: ",
        //   selectedRows
        // );
        this.setState({selectedRowKey:`${selectedRowKeys}`})
      }
    }
    const columns = [
      // {
      //   title: formatMessage({ id: 'table.column.id', defaultMessage: 'ID' }),
      //   dataIndex: "id",
      //   render: text => <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      // },
      {
        title: formatMessage({ id: 'table.column.processName', defaultMessage: '流程名称' }),
        dataIndex: "title",
        width: 200,
        render: text => <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
      {
        title: formatMessage({ id: 'table.column.processBelong', defaultMessage: '所属流程' }),
        dataIndex: "processName",
        width: 150,
        render: text => <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
      {
        title: formatMessage({ id: 'table.column.status', defaultMessage: '状态' }),
        dataIndex: 'status',
        width:80,
        render: (text, record) => {
          const option =_.find(statusOptions,{value:text});
          const label = formatMessage({id:_.get(option,'label')});
          const color = _.get(option,'color');
          return  <Tag color={color} key={`tag-${text}`}>{label}</Tag>
        },
      },
      {
        title: formatMessage({ id: 'table.column.approvalFlowResult', defaultMessage: '审批结果' }),
        dataIndex: 'approvalFlowResult',
        width:80,
        render: (text, record) => {
          const option =_.find(approvalResultOptions,{value:text});
          const label = formatMessage({id:_.get(option,'label')});
          const color = _.get(option,'color');
          return  <Tag color={color} key={`tag-${text}`}>{label}</Tag>
        },
      },
      {
        title: formatMessage({ id: 'table.column.applyTime', defaultMessage: '申请时间' }),
        width: 200,
        dataIndex: "applyTime",
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss')
        },
      },
    ];
    return (
      <Modal {...modalOpts}>
        <Table
          rowKey={(record) => record.id.toString()}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={businessList}
          pagination={false}
          scroll={{ y: 270 }}
        />
      </Modal>
    );
  }
}
