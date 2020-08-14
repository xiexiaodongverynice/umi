import React, { Fragment } from "react";
import { Layout, Icon } from "antd";
import { FormattedMessage } from "umi/locale";
import GlobalFooter from "@/components/GlobalFooter";
import { footerText, beiAnText } from "@/utils/config";

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={
        [
          // {
          //   key: 'Pro 首页',
          //   title: 'Pro 首页',
          //   href: 'https://pro.ant.design',
          //   blankTarget: true,
          // },
          // {
          //   key: 'github',
          //   title: <Icon type="github" />,
          //   href: 'https://github.com/ant-design/ant-design-pro',
          //   blankTarget: true,
          // },
          // {
          //   key: 'Ant Design',
          //   title: 'Ant Design',
          //   href: 'https://ant.design',
          //   blankTarget: true,
          // },
        ]
      }
      copyright={
        <Fragment>
          {footerText} |{" "}
          <a href="http://www.beian.miit.gov.cn" target="_blank">
            {beiAnText}
          </a>
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
