import React, { PureComponent } from "react";
import _ from 'lodash';
import { connect } from "dva";
import { Card } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import styles from "./index.less";
import WorkFlowModalForm from "../../../components/Ac/WorkFlowModalForm";
import DataList from "./DataList";
import DataFilter from "./DataFilter";
import DataModal from "./DataModal";

const nameSpace = "acTodoManage";
@connect(({ acTodoManage, loading }) => ({
  acTodoManage,
  loading: loading.models.acTodoManage
}))
class Index extends PureComponent {
  state = {
    queryDataDeal: [],
  };

  componentDidMount = () => {
    const {
      dispatch,
      acTodoManage: { object_describe_api_name: objectApiName, pagination },
      loading
    } = this.props;
    const dataDeal = {
      joiner: "and",
      criterias: [
        // {
        //   field: 'latest',
        //   operator: '==', //
        //   value: [true]
        // }
      ],
      orderBy: "createTime",
      order: "desc",
      pageSize: pagination.pageSize,
      pageNo: pagination.current,
    };
    this.setState({ queryDataDeal: dataDeal }, () => {
      this.queryRecordList();
    });
  };

  showModalVisible = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${nameSpace}/showModal`,
      payload: {
        modalType: "create",
        modalVisible: true
      }
    });
  };

  queryRecordList = () => {
    const { queryDataDeal } = this.state;
    const {
      acTodoManage: { object_describe_api_name: object_api_name },
      dispatch
    } = this.props;
    dispatch({
      type: `${nameSpace}/fetch`,
      payload: { dealData: queryDataDeal, object_api_name }
    });
  };

  render() {
    const {
      acTodoManage: {
        list,
        modalVisible,
        designOnLineModalVisible,
        modalType,
        approvalOperationModalVisible,
        approvalOperationModalType,
        currentItem,
        object_describe_api_name,
        pagination
      },
      dispatch,
      loading: dataLoading
    } = this.props;

    const dataFilterProps = {
      // isMotion,
      filter: {
        ...location.query
      },
      onFilterChange: (filterData, operatorList) => {
        const { queryDataDeal } = this.state;
        const filterCriteria = [];
        _.forEach(_.keys(filterData), filterDataKey => {
          const filterDataValue = _.get(filterData, filterDataKey);
          if (filterDataValue !== undefined && filterDataValue !== "") {
            filterCriteria.push({
              field: filterDataKey,
              operator: _.get(operatorList, filterDataKey, "=="), //
              value: [filterDataValue]
            });
          }
        });

        _.set(queryDataDeal, "criterias", filterCriteria);
        _.set(queryDataDeal, "pageSize", 5);
        _.set(queryDataDeal, "pageNo", 1);

        this.setState({ queryDataDeal }, () => {
          this.queryRecordList();
        });
      },
      onSearch(fieldsValue) {
        console.log("onSearch", fieldsValue);
      },
      onAdd() {}
    };

    const listProps = {
      pagination,
      dataSource: list,
      loading: dataLoading,
      onChange: page => {
        const { queryDataDeal } = this.state;
        _.set(queryDataDeal, "pageSize", page.pageSize);
        _.set(queryDataDeal, "pageNo", page.current);

        this.setState({ queryDataDeal }, () => {
          this.queryRecordList();
        });
      },
      onPassItem: item => { // 同意流程
        dispatch({
          type: `${nameSpace}/showModal`,
          payload: { approvalOperationModalVisible: true,approvalOperationModalType:"pass",currentItem:item }
        });
      },
      onRejectItem: item => { // 拒绝流程
        dispatch({
          type: `${nameSpace}/showModal`,
          payload: { approvalOperationModalVisible: true,approvalOperationModalType:"reject",currentItem:item }
        });
      },
      onAddSignItem: item => { // 流程加签
        dispatch({
          type: `${nameSpace}/showModal`,
          payload: { approvalOperationModalVisible: true,approvalOperationModalType:"addExecution",currentItem:item }
        });
      },
      onEntrustItem: item => { // 流程委托
        dispatch({
          type: `${nameSpace}/showModal`,
          payload: { approvalOperationModalVisible: true,approvalOperationModalType:"delegate",currentItem:item }
        });
      },
      onBackItem: item => { // TODO 驳回流程
        // const dealData = {
        //   id: item.id,
        //   procInstId:item.procInstId,
        //   assignees:[],
        //   priority:0,
        //   comment: '【驳回】back fail',
        //   // attachment
        // };
        // dispatch({
        //   type: `${nameSpace}/back`,
        //   payload: { dealData },
        //   callback: this.queryRecordList
        // });
        // dispatch({
        //   type: `${nameSpace}/showModal`,
        //   payload: { approvalOperationModalVisible: true,approvalOperationModalType:"delegate",currentItem:item }
        // });
      },
    };

    const modalProps = {
      item: currentItem,
      visible: modalVisible,
      maskClosable: false,
      width: 650,
      confirmLoading: dataLoading,
      title: `${modalType === "create" ? "新建空白模版" : "编辑"}`,
      wrapClassName: "vertical-center-modal",
      onOk: data => {

        _.set(data, 'category_id', _.get(data, 'category_id'));
        _.set(data, 'ref_object_api_name', _.get(data, 'ref_object_api_name'));
        _.set(data, 'description', _.get(data, 'description'));

        _.set(data, 'id', _.get(currentItem, 'id'));
        _.set(data, 'process_id', _.get(currentItem, 'process_id'));
        _.set(data, 'version', _.get(currentItem, 'version'));

        dispatch({
          type: `acTodoManage/${modalType}`,
          payload: { dealData: data },
          callback: () => {
            dispatch({
              type: `${nameSpace}/hideModal`,
              payload: { modalVisible: false }
            });
            this.queryRecordList();
          }
        });
      },
      onCancel: () => {
        dispatch({
          type: `${nameSpace}/hideModal`,
          payload: { modalVisible: false }
        });
      }
    };


    const approvalOperationModalProps = {
      item: currentItem,
      visible: approvalOperationModalVisible,
      type: approvalOperationModalType,
      confirmLoading: dataLoading,
      width: 800,
      // title: `是否XX：${currentItem.title}`,
      onOk:(data)=>{
        console.log('approval-operation-modal-visible==>',data);
        let dealData ={};
        if(approvalOperationModalType==='pass'){// 同意
          dealData = {
            taskId: currentItem.id,
            procInstId: currentItem.procInstId,
            comment: data.comment,
          }
        }else if(approvalOperationModalType==='reject'){// 拒绝
          dealData = {
            taskId: currentItem.id,
            procInstId: currentItem.procInstId,
            comment: data.comment,
            attachments:_.map(data.attachments,(it)=>{return {url:it}})
          }
        }else if(approvalOperationModalType==='addExecution'){// 加签
          dealData = {
            taskId: currentItem.id,
            assigneeList: data,
          }
        }else if(approvalOperationModalType==='delegate'){// 委托
          dealData = {
            taskId: currentItem.id,
            assignee: _.head(data),
          }
        }

        console.log(dealData)
        dispatch({
          type: `${nameSpace}/${approvalOperationModalType}`,// 取消申请
          payload: { dealData },
          callback: () => {
            dispatch({
              type: `${nameSpace}/hideModal`,
              payload: { approvalOperationModalVisible: false,approvalOperationModalType:"" }
            });
            this.queryRecordList();
          }
        });

      },
      onCancel: () => {
        dispatch({
          type: `${nameSpace}/hideModal`,
          payload: { approvalOperationModalVisible: false,approvalOperationModalType:"" }
        });
      }
    }

    return (
      <Card bordered>
        <div className={styles.tableList}>
          {/*<div className={styles.tableListForm}>
            <DataFilter {...dataFilterProps} />
          </div>*/}
          <DataList {...listProps} />
          {modalVisible && <DataModal {...modalProps} />}
          {approvalOperationModalVisible && (
            <WorkFlowModalForm
              {...approvalOperationModalProps}
            />
          )}
        </div>
      </Card>
    );
  }
}
export default Index;
