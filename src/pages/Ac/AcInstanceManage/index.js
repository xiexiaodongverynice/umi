import React, { PureComponent } from "react";
import _ from 'lodash';
import { connect } from "dva";
import { Card, Button} from "antd";
import Zmage from "react-zmage";
import styles from "./index.less";
import DataList from "./DataList";
import DataFilter from "./DataFilter";
import WorkFlowModalForm from "../../../components/Ac/WorkFlowModalForm";
import { baseURL,api } from "@/utils/config";

const nameSpace = "acInstanceManage";
// @Form.create()
@connect(({ acInstanceManage, loading }) => ({
  acInstanceManage,
  loading: loading.models.acInstanceManage
}))
class Index extends PureComponent {
  state = {
    queryDataDeal: []
  };

  componentDidMount = () => {
    const {
      dispatch,
      acInstanceManage: { object_describe_api_name: objectApiName, pagination },
      loading
    } = this.props;
    const dataDeal = {
      joiner: "and",
      criterias: [
        // {
        //   field: 'active',
        //   operator: '==', //
        //   value: [false]
        // }
      ],
      orderBy: "definitionKey",
      order: "asc",
      pageSize: pagination.pageSize,
      pageNo: pagination.current
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
      acInstanceManage: { object_describe_api_name: object_api_name },
      dispatch
    } = this.props;
    dispatch({
      type: `${nameSpace}/fetch`,
      payload: { dealData: queryDataDeal, object_api_name }
    });
  };

  render() {
    const {
      acInstanceManage: {
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
      onImageView:item=>{
        const {path} = api.ac.instance.image;
        const token = localStorage.getItem('token');
        const url = _.replace(`${baseURL}${path}?token=${token}`,'{procInstId}',item.procInstId);
        Zmage.browsing({ alt:'找不到图片啦',src:url,controller:{download:true} })
      },
      onChange: page => {
        const { queryDataDeal } = this.state;
        _.set(queryDataDeal, "pageSize", page.pageSize);
        _.set(queryDataDeal, "pageNo", page.current);

        this.setState({ queryDataDeal }, () => {
          this.queryRecordList();
        });
      },
      onDeleteItem: item => {
        dispatch({
          type: `${nameSpace}/showModal`,// TODO WITHDRAW
          payload: { approvalOperationModalVisible: true,approvalOperationModalType:"WITHDRAW",currentItem:item }
        });
        // dispatch({
        //   type: `${nameSpace}/delete`,
        //   payload: { id },
        //   callback: this.queryRecordList
        // });
      },
      onEditItem: item => {
        dispatch({
          type: `${nameSpace}/showModal`,
          payload: {
            modalType: 'update',
            currentItem: item,
            modalVisible: true
          },
          callback: this.queryRecordList
        });
      },
      onActivateItem: item => { // 激活流程
        dispatch({
          type: `${nameSpace}/activate`,
          payload: { processId: item.id },
          callback: this.queryRecordList
        });
      },
      onSuspendItem: item => { // 挂起流程
        dispatch({
          type: `${nameSpace}/suspend`,
          payload: { processId: item.id},
          callback: this.queryRecordList
        });
      },
      onDeployItem: item => {
        dispatch({
          type: `${nameSpace}/deploy`,
          payload: { id: item.id },
          callback: this.queryRecordList
        });
      },
    };

    const approvalOperationModalProps = {
      item: currentItem,
      visible: approvalOperationModalVisible,
      type: approvalOperationModalType,
      confirmLoading: dataLoading,
      width: 650,
      title: `是否撤回申请：${currentItem.name}`,
      onOk:(data)=>{
        const dealData = {
          reason: data.comment,
        };

        dispatch({
          type: `${nameSpace}/delete`,// 取消申请
          payload: { id: _.toString(currentItem.id),dealData },
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
          <div className={styles.tableListForm}>
            <DataFilter {...dataFilterProps} />
          </div>
          <DataList {...listProps} />
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
