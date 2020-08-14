import React from 'react';
import { formatMessage } from "umi-plugin-react/locale";
import { Modal, Upload, Icon, Result, Button } from "antd";
import { baseURL,api } from "@/utils/config";

const {path} = api.ac.process.deploy;
const { Dragger } = Upload;

class Index extends React.Component {
  state = {
    currentItem:{},
    deployStatus:0,
    uploadResultMessage:'',
  };


  render() {
    const { onOk,...modalOpts } = this.props;
    const { deployStatus,uploadResultMessage,currentItem}=this.state;
    const that = this;
    const props = {
      name: 'file',
      multiple: true,
      action: `${baseURL}${path}`,
      headers: {
        authorization: "authorization-text",
        token: localStorage.getItem("token")
      },
      onChange(info) {
        console.log('info file==>',info.file);
        const { status,response={} } = info.file;
        const {head={},body={}} =response;
        const {code,msg} = head;

        if (status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (status === 'done'&&code===200) {
          that.setState({
            deployStatus:1,
            currentItem:body,
            uploadResultMessage:`${info.file.name} file uploaded and deployed successfully.`},()=>{
          })

        } else if (status === 'error'||(code!==200&&status !== 'uploading')) {
          that.setState({ deployStatus:2,uploadResultMessage: `${info.file.name} file upload or deploy failed.`})
        }
      },
    };
    return (
      <Modal {...modalOpts}>
        {
          deployStatus ===0 &&
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">点击这里或将文件拖拽到这里上传</p>
            <p className="ant-upload-hint">
              请选择BPMN文件，仅支持zip、bpmn20.xml、png、bpmn格式文件
            </p>
          </Dragger>
        }

        {deployStatus === 1 &&
          <Result
            status="success"
            subTitle={uploadResultMessage}
            title="Successfully Deploy Process!"
            extra={[
              <Button key="console" type="primary" onClick={()=>{onOk(currentItem)}}>Next,Set Process Category</Button>,
            ]}

          />
        }
        {deployStatus === 2 &&
          <Result
            status="error"
            title="Error Deploy Process!"
            subTitle={uploadResultMessage}
            extra={[
              <Button key="again" onClick={()=>{that.setState({deployStatus:0})}}>Try Again</Button>,
            ]}
          />
        }
      </Modal>
    );
  }
}

export default Index;
