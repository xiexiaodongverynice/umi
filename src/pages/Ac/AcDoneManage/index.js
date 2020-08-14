import React, { PureComponent } from "react";
import _ from 'lodash';
import { formatMessage } from "umi-plugin-react/locale";
import { connect } from "dva";
import {
  Card,
  Button} from "antd";

import styles from "./index.less";
import DataList from "./DataList";
import DataFilter from "./DataFilter";
import DataModal from "./DataModal";

const nameSpace = "acDoneManage";
// @Form.create()
@connect(({ acDoneManage, loading }) => ({
  acDoneManage,
  loading: loading.models.acDoneManage
}))
class Index extends PureComponent {
  state = {
    queryDataDeal: []
  };

  componentDidMount = () => {
    const {
      dispatch,
      acDoneManage: { object_describe_api_name: objectApiName, pagination },
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
      orderBy: "endTime",
      order: "desc",
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
      acDoneManage: { object_describe_api_name: object_api_name },
      dispatch
    } = this.props;
    dispatch({
      type: `${nameSpace}/fetch`,
      payload: { dealData: queryDataDeal, object_api_name }
    });
  };

  render() {
    const {
      acDoneManage: {
        list,
        modalVisible,
        designOnLineModalVisible,
        modalType,
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
      onDeleteItem: id => {
        dispatch({
          type: `${nameSpace}/delete`,
          payload: { id },
          callback: this.queryRecordList
        });
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
      onPassItem: item => { // 通过流程
        const dealData = {
          id: item.id,
          procInstId:item.procInstId,
          assignees:[],
          priority:0,
          comment: 'pass ok',
          // attachment
        };
        dispatch({
          type: `${nameSpace}/pass`,
          payload: { dealData },
          callback: this.queryRecordList
        });
      },
      onSuspendItem: item => { // 挂起流程
        dispatch({
          type: `${nameSpace}/suspend`,
          payload: { processId:_.get(item,'process_id') },
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
          type: `acDoneManage/${modalType}`,
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

    return (
      <Card bordered>
        <div className={styles.tableList}>
          {/*<div className={styles.tableListForm}>
            <DataFilter {...dataFilterProps} />
          </div>*/}
          <DataList {...listProps} />
          {modalVisible && <DataModal {...modalProps} />}
        </div>
      </Card>
    );
  }
}
export default Index;
