import React, { Suspense } from "react";
import _ from "lodash";
import { Layout, Button, Spin } from "antd";
import DocumentTitle from "react-document-title";
import { connect } from "dva";
import { ContainerQuery } from "react-container-query";
import classNames from "classnames";
import Media from "react-media";
import { formatMessage, setLocale, getLocale } from "umi-plugin-react/locale";
import logo from "../assets/logo.svg";
import Footer from "./Footer";
import Header from "./Header";
import Context from "./MenuContext";
import SiderMenu from "@/components/SiderMenu";
import getPageTitle from "@/utils/getPageTitle";
import styles from "./BasicLayout.less";
import * as defaultSettings from "../defaultSettings";

const { Content, Sider } = Layout;

const screen = {
  "screen-xs": {
    maxWidth: 575
  },
  "screen-sm": {
    minWidth: 576,
    maxWidth: 767
  },
  "screen-md": {
    minWidth: 768,
    maxWidth: 991
  },
  "screen-lg": {
    minWidth: 992,
    maxWidth: 1199
  },
  "screen-xl": {
    minWidth: 1200,
    maxWidth: 1599
  },
  "screen-xxl": {
    minWidth: 1600
  }
};
class BasicLayout extends React.Component {
  componentDidMount() {
    const {
      dispatch,
      location: { pathname,query },
      route: { routes, path, authority }
    } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    // dispatch({
    //   type: 'setting/getSetting',
    // });
    // themeColorClient.changeColor(defaultSettings.primaryColor);
    if (_.startsWith(pathname, "/iframe")) {
      // const query = _.get(this.props, "location.query");
      const locale = _.get(query, "locale");
      if(locale){
        setLocale(locale,false);
      }
      dispatch({
        type: "login/loginWithToken"
      });
    }
    dispatch({
      type: "menu/getMenuData",
      payload: { routes, path, authority }
    });
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap
    };
  }

  getContentStyle = () => {
    const {
      fixedHeader,
      location: { pathname }
    } = this.props;
    const isFrame = _.startsWith(pathname, "/iframe");
    return {
      margin: isFrame||"24px 24px 0",
      paddingTop: fixedHeader && !isFrame ? 64 : 0,
      position: "relative"
    };
  };

  getLayoutStyle = () => {
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== "topmenu") {
      return {
        paddingLeft: collapsed ? "80px" : "256px"
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: "global/changeLayoutCollapsed",
      payload: collapsed
    });
  };

  render() {
    const {
      children,
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      fixedHeader,
      renderPageTitle,
      layoutData,
      login: { loginLoading=false },
      dispatch
    } = this.props;
    const { navTheme, layout: PropsLayout } = defaultSettings;
    const isTop = PropsLayout === "topmenu";
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    let isIframe;
    if (_.startsWith(pathname, "/iframe")) {
      isIframe = true;
    } else {
      isIframe = false;
    }
    const props = {
      dw: _.get(layoutData, "dw"),
      setting: _.get(layoutData, "setting")
    };


    const layout = (
      <Layout>
        {isTop ? null : (
          <SiderMenu
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: "100vh"
          }}
        >
          {!isIframe && (
            <Header
              menuData={menuData}
              handleMenuCollapse={this.handleMenuCollapse}
              logo={logo}
              isMobile={isMobile}
              {...this.props}
            />
          )}
          <Content
            style={
              { ...this.getContentStyle() }
            }
          >
            {renderPageTitle && (
              <div className={styles.pageHeader}>
                <p className={styles.title}>{renderPageTitle}</p>
              </div>
            )}
            {children}
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
          <Spin spinning={loginLoading} tip="正在初始化数据">
            <ContainerQuery query={screen}>
              {params => (
                <Context.Provider value={this.getContext()}>
                  <div className={classNames(params)}>{layout}</div>
                </Context.Provider>
              )}
            </ContainerQuery>
          </Spin>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, menu: menuModel, login }) => ({
  collapsed: global.collapsed,
  login,
  renderPageTitle: global.renderPageTitle,
  layoutData: global.layoutData,
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
  layout: setting.layout,
  ...setting
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
