import React, { Fragment, PureComponent } from "react";
import _ from 'lodash';
import moment from "moment";
import { formatMessage } from "umi-plugin-react/locale";
import { Form, Input, Modal, Select, Table } from "antd";
import Ellipsis from "../../../components/Ellipsis";
import styles from "../AcTodoManage/DataList.less";

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
    const { instanceHistoricList=[], item,...modalProps } = this.props;
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
      //   title: "流程ID",
      //   dataIndex: "procInstId",
      //   // width: 200,
      //   // render: text => <a>{text}</a>
      // },
      {
        title: formatMessage({ id: 'table.column.startTime'}),
        width: 200,
        dataIndex: "startTime",
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss')
        },
      }, {
        title: formatMessage({ id: 'table.column.endTime'}),
        width: 200,
        dataIndex: "endTime",
        render: (text, record) => {
          return text?moment(text).format('YYYY-MM-DD HH:mm:ss'):'';
        },
      },
      {
        title: formatMessage({ id: 'table.column.finishReason'}),
        dataIndex: "deleteReason",
        // width: 150,
        render: (text, record) => {
          return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
        },
      },
    ];
    return (
      <Modal {...modalOpts}>
        <Table
          rowKey={(record) => _.get(record, 'procInstId', '')}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={instanceHistoricList}
          pagination={false}
          scroll={{ y: 270 }}
        />
      </Modal>
    );
  }
}
