import React from "react";
import { connect } from "dva";
import router from "umi/router";
import { Row, Col, Form, Icon, Input, Button } from "antd";
import { formatMessage } from "umi/locale";
import styles from "./resetPassword.less";

const FormItem = Form.Item;

class ResetPassword extends React.PureComponent {
  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 }
    }
  };

  handleOk = () => {
    const { dispatch } = this.props;
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      dispatch({
        type: "userPassword/reset",
        payload: values
      });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div
        className={styles.form}
        style={{ background: "#FFFFFF", height: 250 }}
      >
        <Row className={styles.header} span={24}>
          <Col span={20}>
            <h1>{formatMessage({ id: "app.login.retrieve_password" })}</h1>
          </Col>
          <Col
            span={4}
            style={{ textAlign: "right", fontSize: 20, cursor: "pointer" }}
            onClick={() => {
              router.push("/user/login");
            }}
          >
            <Icon type="close" />
          </Col>
        </Row>
        <form>
          <FormItem
            label={formatMessage({ id: "app.login.user.account" })}
            {...this.formItemLayout}
          >
            {getFieldDecorator("loginId", {
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: "app.login.user_name is required"
                  })
                }
              ]
            })(<Input size="large" placeholder="" />)}
          </FormItem>
          <FormItem>
            <Row>
              <Button
                type="primary"
                size="large"
                // loading={loading.models.user_password}
                // disabled={hasErrors(getFieldsError())}
                onClick={this.handleOk}
              >
                {formatMessage({ id: "app.setting.action.confirm" })}
              </Button>
            </Row>
          </FormItem>
        </form>
      </div>
    );
  }
}

export default connect(({ userPassword }) => ({ userPassword }))(
  Form.create()(ResetPassword)
);
