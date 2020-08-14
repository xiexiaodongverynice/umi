import React from 'react';
import _ from "lodash";
import { formatMessage } from "umi-plugin-react/locale";
import { Drawer, Modal, Radio } from 'antd';
import config from "../../../utils/config";

const { baseURL } = config;

const {confirm} = Modal;

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iFrameHeight: document.body.clientHeight-100
    }
  }

  onClose = () => {
    const { onCancel } = this.props;
    confirm({
      title: '请确认是否已经保存流程图?',
      onOk() {
        onCancel();
      },
    });

  };

  render() {
    const { visible,item } = this.props;
    const { iFrameHeight } = this.state;
    return (
      <div>
        <Drawer
          title={`工作流编辑器——${item.name}——${item.key}`}
          placement="top"
          onClose={this.onClose}
          visible={visible}
          closable
          width='100%'
          height='100%'
        >
          <iframe
            style={{width:'100%', height:iFrameHeight, overflow:'visible'}}
            // onLoad={() => {
            //   const obj = findDOMNode(this.wrapper);
            //   this.setState({
            //     "iFrameHeight":  obj.contentWindow.document.body.scrollHeight + 'px'
            //   });
            // }}
            src={`${baseURL}/modeler.html?modelId=${_.get(item,'id')}&token=${localStorage.getItem('token')}&time=${_.now()}`}
            width="100%"
            height={iFrameHeight}
            scrolling="no"
            frameBorder="0"
          />
        </Drawer>
      </div>
    );
  }
}
