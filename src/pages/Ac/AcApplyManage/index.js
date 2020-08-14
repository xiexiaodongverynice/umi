import React, { PureComponent } from "react";
import _ from 'lodash';
import { formatMessage } from "umi-plugin-react/locale";
import { connect } from "dva";
import {
  Card,
  Button} from "antd";
import Zmage from "react-zmage";
import styles from "./index.less";
import DataList from "./DataList";
import DataFilter from "./DataFilter";
import DataModal from "./DataModal";
import * as storageUtil from "@/utils/storageUtil";
import WorkFlowModalForm from "../../../components/Ac/WorkFlowModalForm";
import { baseURL,api } from "@/utils/config";

const nameSpace = "acApplyManage";
// @Form.create()
@connect(({ acApplyManage, loading }) => ({
  acApplyManage,
  loading: loading.models.acApplyManage
}))
class Index extends PureComponent {
  state = {
    queryDataDeal: []
  };

  componentDidMount = () => {
    const {
      dispatch,
      acApplyManage: { object_describe_api_name: objectApiName, pagination },
      loading
    } = this.props;
    const dataDeal = {
      joiner: "and",
      criterias: [{
        field: 'user_id',
        operator: '==', //
        value: [storageUtil.get("userId")]
      }],
      orderBy: "update_time",
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
      acApplyManage: { object_describe_api_name: object_api_name },
      dispatch
    } = this.props;
    dispatch({
      type: `${nameSpace}/fetch`,
      payload: { dealData: queryDataDeal, object_api_name }
    });
  };

  render() {
    const {
      acApplyManage: {
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
      loading: dataLoading,
    } = this.props;
    const dataFilterProps = {
      // isMotion,
      filter: {
        ...location.query
      },
      onFilterChange: (filterData, operatorList) => {
        const { queryDataDeal } = this.state;
        const filterCriteria = [{
          field: 'user_id',
          operator: '==', //
          value: [storageUtil.get("userId")]
        }];
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
        const url = _.replace(`${baseURL}${path}?token=${token}`,'{procInstId}',item.proc_inst_id);
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
      onReStartItem:item=>{
        const dealData = {
          businessKey: _.toString(item.id),
        };
        dispatch({
          type: `${nameSpace}/restart`,// 取消申请
          payload: { dealData },
          callback: () => {
            this.queryRecordList();
          }
        });

      },
      onCancelItem: item => { // 取消流程
        dispatch({
          type: `${nameSpace}/showModal`,
          payload: { approvalOperationModalVisible: true,approvalOperationModalType:"WITHDRAW",currentItem:item }
        });
      },
    };

    // const modalProps = {
    //   item: currentItem,
    //   visible: modalVisible,
    //   maskClosable: false,
    //   width: 650,
    //   confirmLoading: dataLoading,
    //   title: `${modalType === "create" ? "新建空白模版" : "编辑"}`,
    //   wrapClassName: "vertical-center-modal",
    //   onOk: data => {
    //
    //     _.set(data, 'category_id', _.get(data, 'category_id'));
    //     _.set(data, 'ref_object_api_name', _.get(data, 'ref_object_api_name'));
    //     _.set(data, 'description', _.get(data, 'description'));
    //
    //     _.set(data, 'id', _.get(currentItem, 'id'));
    //     _.set(data, 'process_id', _.get(currentItem, 'process_id'));
    //     _.set(data, 'version', _.get(currentItem, 'version'));
    //
    //     dispatch({
    //       type: `acApplyManage/${modalType}`,
    //       payload: { dealData: data },
    //       callback: () => {
    //         dispatch({
    //           type: `${nameSpace}/hideModal`,
    //           payload: { modalVisible: false }
    //         });
    //         this.queryRecordList();
    //       }
    //     });
    //   },
    //   onCancel: () => {
    //     dispatch({
    //       type: `${nameSpace}/hideModal`,
    //       payload: { modalVisible: false }
    //     });
    //   }
    // };

    const approvalOperationModalProps = {
      item: currentItem,
      visible: approvalOperationModalVisible,
      type: approvalOperationModalType,
      confirmLoading: dataLoading,
      width: 650,
      title: `${formatMessage({id:'table.pageTitle.whether_to_withdraw_the_application',defaultMessage:'是否撤回申请'})}：${currentItem.title}`,
      onOk:(data)=>{
        const dealData = {
          businessKey: _.toString(currentItem.id),
          procInstId:currentItem.proc_inst_id,
          reason: data.comment,
        };
        dispatch({
          type: `${nameSpace}/cancel`,// 取消申请
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
          <div className={styles.tableListForm}>
            <DataFilter {...dataFilterProps} />
          </div>
          <DataList {...listProps} />
          {/*{modalVisible && <DataModal {...modalProps} />}*/}
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
