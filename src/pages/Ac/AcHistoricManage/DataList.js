import React from 'react';
import { Table, Modal, Tag } from "antd";
import _ from 'lodash';
import { formatMessage } from "umi-plugin-react/locale";
import Ellipsis from '../../../components/Ellipsis';
import styles from './DataList.less';
import { millsToTime } from "../../../utils";
import AttachmentFieldItem from "../../../components/Attachment/AttachmentFieldItem";

const DataList = ({ onPassItem, onSuspendItem, onDeployItem,  onDeleteItem, onEditItem,selectedRows,data,...tableProps }) => {

  const columns = [
    {
      title: formatMessage({ id: 'table.column.taskName', defaultMessage: '任务名称' }),
      dataIndex: 'name',
      // width: 250,
      // fixed: 'left',
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    },
    /* {
      title: formatMessage({ id: 'table.column.processBelong', defaultMessage: '所属流程' }),
      dataIndex: 'processName',
      // width: 250,
      // fixed: 'left',
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    },
    {
      title: '受托人',
      dataIndex: 'assigneeName',
      // width: 250,
      // fixed: 'left',
      render: (text, record) => {
        if(!_.has(record,'ownerName')){
          return ;
        }
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    },{
      title: '委托人',
      dataIndex: 'ownerName',
      // width: 250,
      // fixed: 'left',
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    },
    {
      title: '流程发起人',
      dataIndex: 'submitterName',
      // width: 200,
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    }, */
   {
     title: formatMessage({ id: 'table.column.assigneeName', defaultMessage: '受托人' }),
      dataIndex: 'assigneeName',
      // width: 200,
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      },
    },
    /* {
      title: '优先级',
      dataIndex: 'priority',
      // width: 150,
      render: (text, record) => {
        const priorityOption =_.find(priorityOptions,{value:text});
        const label = _.get(priorityOption,'label',text);
        const color = _.get(priorityOption,'color');
        return  <Tag color={color} key={`tag-${text}`}>{label}</Tag>
      },
    }, */
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
    },
    {
      title: formatMessage({ id: 'table.column.attachments', defaultMessage: '审批附件' }),
      dataIndex: 'attachments',
      width:250,
      render: (text, record) => {
        // return <Ellipsis className={styles.item} lines={1} tooltip>{_.chain(text).map((it)=>{return it.url}).value()}</Ellipsis>;
       const filedList = _.chain(text).map((it)=>{return it.url}).value();
        if(!_.isEmpty(filedList)){
          return (<AttachmentFieldItem
            value={filedList}
            relationField={{
              max_count: "9",
              file_ext: ["txt", "word", "excel", "ppt", "pdf", "img"],
              max_size: "1047586"
            }}
            onlyView
          />);
        }else{
          return '';
        }

      },
    },
    {
      title: formatMessage({ id: 'table.column.duration', defaultMessage: '耗时' }),
      dataIndex: 'duration',
      // width:200,
      render: (text, record) => {
        return millsToTime(text);
      },
    },{
      title: formatMessage({ id: 'table.column.createTime', defaultMessage: '创建时间' }),
      dataIndex: 'createTime',
      // width:200,
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>;
      },
    },{
      title: formatMessage({ id: 'table.column.doneTime', defaultMessage: '完成时间' }),
      dataIndex: 'endTime',
      // width:200,
      render: (text, record) => {
        return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>;
      },
    },{
      title: formatMessage({ id: 'table.column.status', defaultMessage: '状态' }),
      dataIndex: 'approvalFlowResult',
      width:80,
      render: (text, record) => {
        let label = "";
        let color = "";
        if (record.endTime) {
          color = "blue";
          label = formatMessage({ id: 'table.option.status.disposed', defaultMessage: '已办理' });
        } else {
          label = formatMessage({ id: 'table.option.status.unDisposed', defaultMessage: '待办理' });
        }
        return  <Tag color={color} key={`tag-${text}`}>{label}</Tag>
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
