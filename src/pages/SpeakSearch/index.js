/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-shadow */
/* eslint-disable object-shorthand */
/* eslint-disable react/no-unused-state */
/* eslint-disable prefer-destructuring */
import React, { Component } from "react";
import { connect } from "dva";
import {
  Layout,
  Select,
  Row,
  Col,
  Button,
  Table,
  Input,
  AutoComplete
} from "antd";
import _ from "lodash";
import * as speakSearchservices from "../../services/speaksearch";

const InputGroup = Input.Group;
const { Content } = Layout;
const { Option } = Select;
const body = {
  needRelationQuery: false,
  joiner: "and",
  criterias: [
    {
      field: "record_type",
      operator: "in",
      value: ["speaker"]
    },
    {
      field: "is_active",
      value: ["true"],
      operator: "=="
    }
  ],
  orderBy: "update_time",
  order: "desc",
  objectApiName: "customer",
  pageSize: 10,
  pageNo: 1,
  approvalCriterias: [],
  territoryCriterias: []
};
// const { territory_id, role } = config;
class speakSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      listData: [],
      data: [],
      value: "",
      type: "name",
      body: {
        needRelationQuery: false,
        joiner: "and",
        criterias: [
          {
            field: "record_type",
            operator: "in",
            value: ["speaker"]
          },
          {
            field: "is_active",
            value: ["true"],
            operator: "=="
          }
        ],
        orderBy: "update_time",
        order: "desc",
        objectApiName: "customer",
        pageSize: 10,
        pageNo: 1,
        approvalCriterias: [],
        territoryCriterias: []
      }
    };
  }

  componentDidMount() {
    speakSearchservices.fetchCustomObjectDescribe().then(response => {
      if (!_.isEmpty(response.resultData)) {
        const data = response.resultData.items;
        _.each(data, item => {
          if (item.api_name == "customer") {
            _.each(item.fields, filter => {
              if (filter.api_name == "major_title") {
                this.setState({ major_title_options: filter.options });
              }
              if (filter.api_name == "admin_title") {
                this.setState({ admin_title_options: filter.options });
              }
            });
            // this.queryActiondata(body);
          }
        });
      }
    });
  }

  queryActiondata = body => {
    const { major_title_options, admin_title_options } = this.state;
    speakSearchservices.query(body).then(response => {
      if (!_.isEmpty(response.resultData)) {
        const data = response.resultData.result;
        _.each(data, item => {
          _.each(major_title_options, filter => {
            if (item.major_title == filter.value) {
              item.major_title = filter.label;
              item.key = data.id;
            }
          });
        });
        _.each(data, item => {
          _.each(admin_title_options, filter => {
            if (item.admin_title == filter.value) {
              item.admin_title = filter.label;
            }
          });
        });
        const totals = response.resultData.resultCount;
        const pageCount = response.resultData.pageNo;
        const pageSize = response.resultData.pageSize;
        this.setState({ listData: data, totals, pageCount, pageSize });
      }
    });
  };

  fetchUser = value => {
    if (!_.isEmpty(value)) {
      const { body, type } = this.state;
      const valuearr = [];
      valuearr.push(value);
      if (type == "name") {
        body.criterias.push({
          field: "name",
          operator: "contains",
          value: valuearr
        });
      } else {
        body.criterias.push({
          field: "id_number",
          operator: "contains",
          value: valuearr
        });
      }

      this.setState({ data: [] });
      if (body.criterias.length > 3) {
        body.criterias.splice(2, body.criterias.length - 3);
      }
      speakSearchservices.query(body).then(response => {
        if (!_.isEmpty(response.resultData)) {
          const data = response.resultData.result;
          this.setState({ data });
        }
      });
    } else {
      this.setState({ data: [] });
    }
  };

  handleChange = value => {
    this.setState({
      value,
      data: []
    });
  };

  changePageSize = (pageSize, current) => {
    this.setState({ pageSize, pageCount: current }, () => {
      const newbody = body;
      newbody.pageNo = this.state.pageCount;
      newbody.pageSize = this.state.pageSize;
      this.queryActiondata(newbody);
    });
  };

  changePage = pageCount => {
    this.setState({ pageCount }, () => {
      const newbody = body;
      newbody.pageNo = this.state.pageCount;
      this.queryActiondata(newbody);
    });
  };

  ChangeType = value => {
    this.setState({ type: value }, () => {
      this.handleChange("");
    });
  };

  onsearch = value => {
    const { body, type } = this.state;
    const valuearr = [];
    valuearr.push(value);
    if (type == "name") {
      body.criterias.push({
        field: "name",
        operator: "contains",
        value: valuearr
      });
    } else {
      body.criterias.push({
        field: "id_number",
        operator: "contains",
        value: valuearr
      });
    }
    this.queryActiondata(body);
  };

  godetails = item => {
    window.top.postMessage(
      {
        code: 1,
        action: "resolvePage",
        data: {
          hashPath: `#/object_page/customer/${item.id}/detail_page?recordType=${item.record_type}`, // 详情页 // hashPath: '#/object_page/customer/8287646850579746/edit_page?recordType=hcp', // 编辑页 // hashPath: '#/object_page/customer/add_page?recordType=hcp', // 新建页
          target: "blank" // web端特有，表示hashPath的页面是否打开新的标签页 self|blank
        }
      },
      "*"
    );
  };

  render() {
    const {
      data,
      value,
      listData,
      totals,
      pageCount,
      pageSize,
      type
    } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: false,
      showTotal: () => `共${totals}条`,
      pageSize: pageSize,
      current: pageCount,
      total: totals,
      onShowSizeChange: (current, pageSize) =>
        this.changePageSize(pageSize, current),
      onChange: current => this.changePage(current)
    };
    let children = "";
    if (type == "name") {
      children = data.map(item => <Option key={item.name}>{item.name}</Option>);
    } else {
      children = data.map(item => (
        <Option key={item.id_number}>{item.id_number}</Option>
      ));
    }

    const columns = [
      {
        title: "讲者名称",
        key: "name",
        render: (text, record) => (
          <a onClick={this.godetails.bind(null, record)}>{record.name}</a>
        )
      },
      {
        title: "所属机构",
        dataIndex: "belong_hco",
        key: "belong_hco"
      },
      {
        title: "职称",
        dataIndex: "major_title",
        key: "major_title"
      },
      {
        title: "职务",
        dataIndex: "admin_title",
        key: "admin_title"
      },
      {
        title: "身份证号",
        dataIndex: "id_number",
        key: "id_number"
      }
    ];
    return (
      <Layout className="layout">
        <Content style={{ padding: "50px 150px" }}>
          <div style={{ background: "#fff", padding: 24 }}>
            <div style={{ minHeight: 30 }}>
              <h4>讲者查询</h4>
            </div>
            <div>
              <Row>
                <Col span={22}>
                  <InputGroup compact>
                    <Select
                      defaultValue="姓名"
                      onChange={this.ChangeType}
                      style={{ width: 100 }}
                    >
                      <Option value="name">姓名</Option>
                      <Option value="id_number">身份证号</Option>
                    </Select>
                    <AutoComplete
                      dataSource={this.state.data}
                      style={{ width: "85%" }}
                      value={value}
                      onChange={this.handleChange}
                      onSearch={this.fetchUser}
                      placeholder="请输入查询内容"
                    >
                      {children}
                    </AutoComplete>
                  </InputGroup>
                </Col>
                <Col span={2}>
                  <Button
                    type="primary"
                    disabled={_.isEmpty(value)}
                    onClick={() => this.onsearch(value)}
                  >
                    搜索
                  </Button>
                </Col>
              </Row>
            </div>
            <div style={{ minHeight: 30, marginTop: 15 }}>
              <h4>查询结果</h4>
            </div>
            <div>
              <Table
                dataSource={listData}
                columns={columns}
                pagination={paginationProps}
              />
            </div>
          </div>
        </Content>
      </Layout>
    );
  }
}
export default connect()(speakSearch);
