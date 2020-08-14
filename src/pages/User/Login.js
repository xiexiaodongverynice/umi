import React from "react";
import Link from "umi/link";
import { connect } from "dva";
import { Spin, Input, Col, Row, Form, Button, Icon } from "antd";
import { formatMessage } from "umi/locale";
import styles from "./login.less";
import * as config from "../../utils/config";

const FormItem = Form.Item;

class Login extends React.PureComponent {
  state = {
    isLoginAsAdmin: false
  };

  hasErrors = fieldsError =>
    Object.keys(fieldsError).some(field => fieldsError[field]);

  handleOk = () => {
    const { dispatch } = this.props;
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      const { loginName } = values;
      const { isLoginAsAdmin } = this.state;
      localStorage.setItem("loginName", loginName);
      if (isLoginAsAdmin) {
        dispatch({
          type: "login/loginAs",
          payload: values,
          callBack: () => {}
        });
      } else {
        dispatch({
          type: "login/login",
          payload: values,
          callBack: () => {}
        });
      }
    });
  };

  render() {
    const {
      login: { errMessage, initialDataLoading },
      loading: {
        models: { login: loginLogin },
        effects
      },
      loading
    } = this.props;
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const { isLoginAsAdmin } = this.state;
    return (
      <div className={styles.login_page}>
        <div className={styles.page_content}>
          <div className={styles.login_box}>
            <Spin
              spinning={
                effects["global/initSystemData"] === undefined
                  ? false
                  : effects["global/initSystemData"]
              }
              tip="正在初始化系统数据"
            >
              <div className={styles.form} style={{ background: "#FFFFFF" }}>
                <div className={styles.logo}>
                  <img alt="logo" src="/favicon.png" />
                </div>
                <div className={styles.login_header}>
                  <div className={styles.welcome_tip}>{formatMessage({ id: "app.login.welcome" })}</div>
                  {config.deployEnvironment === "stg" ||
                  config.deployEnvironment === "dev" ? (
                    <div className={styles.environment}>
                      <span>{config.deployEnvironment}环境</span>
                    </div>
                  ) : null}
                </div>
                <div style={{ height: "28px", marginBottom: "10px" }}>
                  {errMessage ? (
                    <div className={styles.err_tip}>
                      <img
                        alt="logo"
                        src="/cuowu.png"
                        style={{ verticalAlign: "middle", paddingLeft: "10px" }}
                      />
                      <span
                        style={{
                          verticalAlign: "middle",
                          paddingLeft: "5px",
                          fontSize: "14px;",
                          color: "#f10"
                        }}
                      >
                        {errMessage}
                      </span>
                    </div>
                  ) : null}
                </div>
                <form>
                  <Row>
                    <Col span={12} style={{ textAlign: "left" }}>
                      <span style={{ fontSize: "14px", color: "#7F8FA4" }}>
                        {formatMessage({ id: "app.login.user.account" })}
                      </span>
                    </Col>
                  </Row>
                  <FormItem style={{ marginLeft: "0px", marginBottom: "13px" }}>
                    {getFieldDecorator("loginName", {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({
                            id: "app.login.user_name is required"
                          })
                        }
                      ]
                    })(
                      <Input
                        size="default"
                        // onPressEnter={handleOk}
                        prefix={
                          <Icon
                            type="user"
                            style={{ color: "rgba(0,0,0,.25)" }}
                          />
                        }
                        placeholder={formatMessage({
                          id: "app.login.user.account"
                        })}
                      />
                    )}
                  </FormItem>
                  <Row>
                    <Col span={12} style={{ textAlign: "left" }}>
                      <span style={{ fontSize: "14px", color: "#7F8FA4" }}>
                        {formatMessage({ id: "app.login.password" })}
                      </span>
                    </Col>
                  </Row>
                  <FormItem style={{ marginLeft: "0px", marginBottom: "13px" }}>
                    {getFieldDecorator("pwd", {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({
                            id: "app.login.password is required"
                          })
                        }
                      ]
                    })(
                      <Input
                        size="default"
                        type="password"
                        prefix={
                          <Icon
                            type="lock"
                            style={{ color: "rgba(0,0,0,.25)" }}
                          />
                        }
                        // onPressEnter={handleOk}
                        placeholder={formatMessage({
                          id: "app.login.password"
                        })}
                      />
                    )}
                  </FormItem>
                  {isLoginAsAdmin && (
                    <>
                      <Row>
                        <Col span={12} style={{ textAlign: "left" }}>
                          <span style={{ fontSize: "14px", color: "#7F8FA4" }}>
                            {formatMessage({ id: "app.login.admin_login_as" })}
                          </span>
                        </Col>
                      </Row>
                      <FormItem
                        style={{ marginLeft: "0px", marginBottom: "13px" }}
                      >
                        {getFieldDecorator("loginAsName", {
                          rules: [
                            {
                              required: true,
                              message: formatMessage({
                                id: "app.login.password is required"
                              })
                            }
                          ]
                        })(
                          <Input
                            size="default"
                            prefix={
                              <Icon
                                type="lock"
                                style={{ color: "rgba(0,0,0,.25)" }}
                              />
                            }
                            // onPressEnter={handleOk}
                            placeholder={formatMessage({
                              id: "app.login.admin_login_as"
                            })}
                          />
                        )}
                      </FormItem>
                    </>
                  )}
                  <FormItem style={{ marginLeft: "0px", marginBottom: "20px" }}>
                    <Row>
                      <Button
                        type="primary"
                        size="default"
                        onClick={this.handleOk}
                        loading={loginLogin}
                        disabled={this.hasErrors(getFieldsError())}
                      >
                        {formatMessage({ id: "menu.login" })}
                      </Button>
                    </Row>
                  </FormItem>
                </form>
              </div>
              <div>
                <Row style={{ marginTop: "10px" }}>
                  <Col
                    onClick={() =>{}
                      // this.setState({ isLoginAsAdmin: !isLoginAsAdmin })
                    }
                    span={12}
                  >
                    {formatMessage({ id: "app.login.admin_login_as" })}
                  </Col>
                  <Col style={{ textAlign: "right" }} span={12}>
                    <Link to="/user/reset_password">
                      {formatMessage({ id: "app.login.forgot-password" })}
                    </Link>
                  </Col>
                </Row>
              </div>
            </Spin>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ login, loading }) => ({ login, loading }))(
  Form.create()(Login)
);
