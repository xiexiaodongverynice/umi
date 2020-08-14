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
import DesignOnlineDrawer from "./DesignOnlineDrawer";

const nameSpace = "acModelManage";
// @Form.create()
@connect(({ acModelManage, loading }) => ({
  acModelManage,
  loading: loading.models.acModelManage
}))
class Index extends PureComponent {
  state = {
    queryDataDeal: []
  };

  componentDidMount = () => {
    const {
      dispatch,
      acModelManage: { object_describe_api_name: objectApiName, pagination },
      loading
    } = this.props;
    const dataDeal = {
      joiner: "and",
      criterias: [],
      orderBy: "update_time",
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
      acModelManage: { object_describe_api_name: object_api_name },
      dispatch
    } = this.props;
    dispatch({
      type: `${nameSpace}/fetch`,
      payload: { dealData: queryDataDeal, object_api_name }
    });
  };

  render() {
    const {
      acModelManage: {
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
        console.log("change page", page);
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
            modalType: "update",
            currentItem: item,
            object_api_name: object_describe_api_name
          },
          callback: this.queryRecordList
        });
      },
      onDesignItem: item => {
        dispatch({
          type: `${nameSpace}/showModal`,
          payload: { currentItem: item, designOnLineModalVisible: true },
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
      item: modalType === "create" ? {} : currentItem,
      visible: modalVisible,
      maskClosable: false,
      width: 650,
      confirmLoading: dataLoading,
      title: `${modalType === "create" ? "新建空白模版" : "编辑工作表"}`,
      wrapClassName: "vertical-center-modal",
      onOk: data => {
        // if (modalType === 'update') {
        //   // _.set(data, 'version', _.get(currentItem, 'version'));
        //   // _.set(data, 'id', _.get(currentItem, 'id'));
        // }
        dispatch({
          type: `acModelManage/${modalType}`,
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

    const designModalProps = {
      item: currentItem,
      visible: designOnLineModalVisible,
      onOk: data => {},
      onCancel: () => {
        dispatch({
          type: `${nameSpace}/hideModal`,
          payload: { designOnLineModalVisible: false }
        });
      }
    };

    return (
      <Card bordered>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            <DataFilter {...dataFilterProps} />
          </div>
          <div className={styles.tableListOperator}>
            <Button
              icon="plus"
              type="primary"
              onClick={() => this.showModalVisible()}
            >
              新建空白模版
            </Button>
          </div>
          <DataList {...listProps} />
          {modalVisible && <DataModal {...modalProps} />}
          {/*{designOnLineModalVisible && <DesignOnLineModal {...designModalProps} />}*/}
          {designOnLineModalVisible && (
            <DesignOnlineDrawer {...designModalProps} />
          )}
        </div>
      </Card>
    );
  }
}
export default Index;
