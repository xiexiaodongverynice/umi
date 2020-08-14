// workFlowModalForm
import React, { PureComponent, Fragment } from "react";
import _ from "lodash";
import {
  Row,
  Col,
  Button,
  Popover,
  Timeline,
  Form,
  Modal,
  Input,
  Table,
  message
} from "antd/lib/index";
import { formatMessage } from "umi-plugin-react/locale";
import AttachmentFieldItem from "../Attachment/AttachmentFieldItem";
import * as recordService from "../../services/recordService";
import Ellipsis from "../Ellipsis";
import styles from "../../pages/Ac/AcTodoManage/DataList.less";

/**
 * 撤回、同意、拒绝弹窗
 * @params {开始时间戳} start
 *
 */

const { TextArea, Search } = Input;
const FormItem = Form.Item;

class WorkFlowModalForm extends PureComponent {
  state = {
    modalTitle: "",
    fieldLabel: "",
    isRequired: false,
    renderTable: false,
    needMultipleSelect: false,
    selectedRowKeys: [],
    userDataList: [],
    queryDataDeal: {
      joiner: "and",
      criterias: [
        {
          field: "enable",
          operator: "==", //
          value: [true]
        }
      ],
      orderBy: "update_time",
      order: "desc",
      objectApiName: "user_info"
    },
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      pageSize: 5,
      total: null,
      pageSizeOptions: ["5", "10", "15", "20"]
    }
  };

  componentDidMount = () => {
    const { type } = this.props;
    const { pagination } = this.state;
    let modalTitle = "";
    let fieldLabel = "";
    let isRequired = false;
    let renderTable = false;
    let needMultipleSelect = false;

    const dataDeal = {};

    switch (type) {
      case "WITHDRAW":
        fieldLabel = formatMessage({
          id: "table.column.cancelReason",
          defaultMessage: "撤销原因"
        });
        isRequired = _.get(
          window.LAYOUT,
          "operation.cancel.comment.required",
          true
        );
        break;
      case "pass":
        modalTitle = formatMessage({
          id: "table.pageTitle.pass",
          defaultMessage: "审批同意"
        });
        fieldLabel = formatMessage({
          id: "table.column.comment",
          defaultMessage: "审批意见"
        });
        isRequired = _.get(
          window.LAYOUT,
          "operation.pass.comment.required",
          false
        );
        break;
      case "reject":
        modalTitle = formatMessage({
          id: "table.pageTitle.reject",
          defaultMessage: "审批拒绝"
        });
        fieldLabel = formatMessage({
          id: "table.column.comment",
          defaultMessage: "审批意见"
        });
        isRequired = _.get(
          window.LAYOUT,
          "operation.reject.comment.required",
          true
        );
        break;
      case "addExecution":
        modalTitle = formatMessage({
          id: "table.pageTitle.selectAddExecution",
          defaultMessage: "选择加签审批人"
        });
        renderTable = true;
        needMultipleSelect = true;
        // this.setState({ queryDataDeal: dataDeal }, () => {
        this.fetchUserList();
        // });
        break;
      case "delegate":
        modalTitle = formatMessage({
          id: "table.pageTitle.selectDelegate",
          defaultMessage: "选择委托审批人"
        });
        renderTable = true;
        needMultipleSelect = false;
        // this.setState({ queryDataDeal: dataDeal }, () => {
        this.fetchUserList();
        // });
        break;
      default:
        modalTitle = "";
        fieldLabel = "";
    }
    this.setState({
      modalTitle,
      fieldLabel,
      isRequired,
      renderTable,
      needMultipleSelect
    });
  };

  fetchUserList = () => {
    const { pagination, queryDataDeal } = this.state;
    _.set(queryDataDeal, "pageSize", pagination.pageSize);
    _.set(queryDataDeal, "pageNo", pagination.current);

    this.setState({ loading: true });
    this.promise = recordService
      .queryRecordList({ dealData: queryDataDeal })
      .then(response => {
        const resultData = _.get(response, "resultData.result"); // 为什么返回这么多data，醉了……
        this.setState({
          userDataList: resultData,
          loading: false,
          pagination: {
            ...pagination,
            // current: Number(pagination.pageNo) || 1,
            // pageSize: Number(pagination.pageSize) || 10,
            total: _.get(response, "resultData.resultCount", [])
          }
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({ loading: false });
      });
  };

  tableChangeHandle = page => {
    const { pagination } = this.state;
    console.log(page);
    _.set(pagination, "current", page.current);
    _.set(pagination, "pageSize", page.pageSize);
    _.set(pagination, "pageNo", page.current);

    this.setState({ pagination }, () => {
      this.fetchUserList();
    });
  };

  onSearchHandle = value => {
    const { queryDataDeal } = this.state;
    const filterCriteria = [
      {
        field: "name",
        operator: "contains", //
        value: [value]
      },
      {
        field: "enable",
        operator: "==", //
        value: [true]
      }
    ];
    _.set(queryDataDeal, "criterias", filterCriteria);
    const { pagination } = this.state;
    this.setState(
      {
        queryDataDeal,
        pagination: {
          ...pagination,
          current: 1,
          pageSize: 5,
          total: null
        }
      },
      () => {
        this.fetchUserList();
      }
    );
  };

  renderTableItem = () => {
    const columns = [
      {
        title: formatMessage({
          id: "table.column.name",
          defaultMessage: "名称"
        }),
        dataIndex: "name",
        width: 200
        // render: text => <a>{text}</a>
      },
      {
        title: formatMessage({
          id: "table.column.rule",
          defaultMessage: "角色"
        }),
        width: 200,
        dataIndex: "profile__r.name"
      },
      {
        title: formatMessage({
          id: "table.column.email",
          defaultMessage: "邮箱"
        }),
        dataIndex: "email",
        // width: 150,
        render: (text, record) => {
          return (
            <Ellipsis className={styles.item} lines={1} tooltip>
              {text}
            </Ellipsis>
          );
        }
      }
      // {
      //   title: "账户",
      //   dataIndex: "account",
      //   render: (text, record) => {
      //     return <Ellipsis className={styles.item} lines={1} tooltip>{text}</Ellipsis>
      //   },
      // },
      // {
      //   title: "角色",
      //   dataIndex: "profile__r.name"
      // }
    ];

    const {
      needMultipleSelect,
      loading,
      userDataList,
      pagination
    } = this.state;
    const rowSelection = {
      type: needMultipleSelect ? "checkbox" : "radio",
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(
        //   `selectedRowKeys: ${selectedRowKeys}`,
        //   "selectedRows: ",
        //   selectedRows
        // );
        this.setState({ selectedRowKeys });
      }
    };
    return (
      <Fragment>
        <Search
          placeholder={formatMessage({ id: "table.placeholder.keyword" })}
          onSearch={this.onSearchHandle}
          style={{ width: "100%", marginBottom: "3px" }}
          // allowClear
        />
        <Table
          rowKey={record => _.get(record, "id", "")}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={userDataList}
          loading={loading}
          pagination={pagination}
          onChange={this.tableChangeHandle}
          scroll={{ y: 270 }}
        />
      </Fragment>
    );
  };

  renderFormItem = () => {
    const { form, type } = this.props;
    const { fieldLabel, isRequired } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    return (
      <div>
        <FormItem label={fieldLabel} {...formItemLayout}>
          {getFieldDecorator("comment", {
            initialValue: "",
            rules: [
              {
                required: isRequired,
                message: formatMessage(
                  { id: "form.required.tip" },
                  { api_name: fieldLabel }
                )
              }
            ]
          })(<TextArea />)}
        </FormItem>
        {type === "reject" &&
          _.get(window.LAYOUT, "operation.reject.attachments.show", true) && (
            <FormItem>
              {getFieldDecorator("attachments", {
                initialValue: []
              })(
                <AttachmentFieldItem
                  relationField={{
                    max_count: _.get(
                      window.LAYOUT,
                      "operation.reject.attachments.maxCount",
                      9
                    ),
                    file_ext: ["txt", "word", "excel", "ppt", "pdf", "img"],
                    max_size: "1047586"
                  }}
                />
              )}
            </FormItem>
          )}
      </div>
    );
  };

  onConfirm = () => {
    const { form, onOk } = this.props;
    const { renderTable, selectedRowKeys } = this.state;
    if (renderTable) {
      if (!_.isEmpty(selectedRowKeys)) {
        onOk(_.map(selectedRowKeys, it => _.toString(it)));
      } else {
        message.warn(formatMessage({ id: "table.placeholder.selectUser" }));
      }

      // message.warn("这里是假数据，不允许保存😯")
    } else {
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        onOk(values);
      });
    }
  };

  render() {
    const { ...modalProps } = this.props;
    const { modalTitle, renderTable } = this.state;
    const modalOpts = {
      title: modalTitle,
      ...modalProps,
      onOk: this.onConfirm
    };
    return (
      <Modal {...modalOpts}>
        {renderTable ? (
          <div>{this.renderTableItem()}</div>
        ) : (
          <Form layout="vertical">{this.renderFormItem()}</Form>
        )}
      </Modal>
    );
  }
}
export default Form.create()(WorkFlowModalForm);
