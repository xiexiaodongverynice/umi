/**
 * Created by Uncle Charlie, 2018/05/17
 * @flow
 */

import React, { Component } from "react";
import { Row, Col, Upload, Button, Icon, Form, message } from "antd";
import _ from "lodash";
import { formatMessage } from "umi-plugin-react/locale";

import AttachmentService from "../../services/AttachmentService";
import styles from "./AttachmentFieldItem.less";
import Attachment from "../../utils/cache";
import { PDF } from "../../utils/config";
import { IMG_EXTENSIONS, IS_IMG, getImageUrl } from "../../utils/file";
import ImageViewer from "./ImageViewer";
import Ellipsis from "../Ellipsis";

const FormItem = Form.Item;

const ICON_STYLE = {
  cursor: "pointer",
  marginRight: 10
};

// type Prop = {
//   value: any,
//   relationField: any,
//   fieldList: any[],
//   needDisabled?: boolean,
//   onlyView?: boolean,
//   onChange?: (val?: any) => void,
// };

// type State = {
//   fileList: any[],
//   value: string,
// };

// type FileInfo = { file: { name: string }, fileList: any[] };

const DEFAULT_FILE_EXT = ".txt,.pdf";
/**
 * TODO: i18n => '上传文件'
 */
export default class AttachmentFieldItem extends Component {
  constructor(props) {
    super(props);
    const { relationField, fieldList } = this.props;
    const fileTypes = _.get(relationField, "file_ext", []);
    this.acceptedExtensions = this.getFileExtensions(fileTypes);
    const { value = [] } = props;
    this.state = {
      value,
      fileList: value.map(item => {
        return {
          key: item,
          loading: false
        };
      }) // 已经上传的文件
    };

    this.imageViewer = null;
  }

  async componentDidMount() {
    this.getFileList();
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.value, this.props.value)) {
      this.setState(
        {
          value: nextProps.value,
          fileList: nextProps.value.map(item => {
            return {
              key: item,
              loading: false
            };
          })
        },
        () => {
          this.getFileList();
        }
      );
    }
  }

  async getFileList() {
    const { fileList } = this.state;
    const fileListMetas = await Promise.all(
      fileList.map(file => {
        return new Promise(async (resolve, reject) => {
          try {
            const resp = await AttachmentService.getFileMeta(
              _.get(file, "key")
            );
            if(_.isError(resp)){// 报错了
              resolve({name:'找不到文件了',display:'none'})
            }
            let meta = _.get(resp, "userMetadata", {});
            /**
             * minio文件服务的userMetadata key是大写的，这里直接读取会取不到
             */
            meta = _.mapKeys(meta, (value, key) => {
              return _.toLower(key);
            });
            const res = await AttachmentService.getFilePreview(_.get(file, 'key'));
            const prevUrl = _.get(res, 'resultData.result', '');
            resolve(
              Object.assign({}, file, {
                name: _.get(meta, "original-name", ""),
                previewUrl: prevUrl,
              })
            );
          } catch (err) {
            reject(err);
          }
        });
      })
    );
    this.setState({
      fileList: fileListMetas
    });
  }

  getFileExtensions = fileTypes => {
    if (_.isEmpty(fileTypes)) {
      return DEFAULT_FILE_EXT;
    }

    const targetFileTypes = _.cloneDeep(fileTypes);
    let acceptExtensions = [];

    const findWord = _.find(targetFileTypes, item => item === "word");
    if (findWord) {
      acceptExtensions = _.concat(acceptExtensions, [".doc", ".docx"]);
      _.remove(targetFileTypes, item => item === "word");
    }
    const findExcel = _.find(targetFileTypes, item => item === "excel");
    if (findExcel) {
      acceptExtensions = _.concat(acceptExtensions, [".xls", ".xlsx"]);
      _.remove(targetFileTypes, item => item === "excel");
    }
    const findPpt = _.find(targetFileTypes, item => item === "ppt");
    if (findPpt) {
      acceptExtensions = _.concat(acceptExtensions, [".ppt", ".pptx"]);
      _.remove(targetFileTypes, item => item === "ppt");
    }
    const findImg = _.find(targetFileTypes, item => item === "img");
    if (findImg) {
      acceptExtensions = _.concat(acceptExtensions, IMG_EXTENSIONS);
      _.remove(targetFileTypes, item => item === "img");
    }
    acceptExtensions = _.concat(
      acceptExtensions,
      _.map(targetFileTypes, item => `.${item}`)
    );

    return !_.isEmpty(acceptExtensions)
      ? _.join(acceptExtensions, ",")
      : DEFAULT_FILE_EXT;
  };

  getFilePath = fileInfo => {
    return `${AttachmentService.downloadUrl}/${
      fileInfo.key
    }?ask_file_name=true&token=${localStorage.getItem("token")}`;
  };

  handleChange = info => {
    const { id } = this.props;
    const { file } = info;
    const { error, percent, response, status, originFileObj } = file;
    const { uid } = originFileObj;
    if (status === "done" && percent === 100) {
      const { fileList } = this.state;
      if (!_.isUndefined(error)) {
        message.error(`上传失败: ${response.message}`);
        this.setState({
          fileList: fileList.splice(
            _.findIndex(fileList, {
              key: uid
            }),
            1
          )
        });
      } else {
        const finalFileList = fileList.map(item => {
          if (item.key === uid) {
            return Object.assign({}, item, response, {
              loading: false
            });
          }
          return item;
        });
        this.setState(
          {
            fileList: finalFileList,
            value: getValuesFromFileList(finalFileList)
          },
          this.updateValue
        );
        Attachment.delete({ id });
      }
    }
  };

  updateValue = () => {
    const { value } = this.state;
    const { onChange } = this.props;
    if (onChange && _.isFunction(onChange)) {
      onChange(value);
    }
  };

  beforeUpload = file => {
    const { id, relationField: { label = "" } = {} } = this.props;
    const { name } = file;
    const { uid } = file;
    const valid = this.acceptedExtensions.indexOf(file.type) >= 0;
    if (!valid) {
      const fileList = _.get(this.state, "fileList", []);
      this.setState({
        fileList: _.concat(fileList, { key: uid, loading: 1, name })
      });
    } else {
      const fileList = _.get(this.state, "fileList");
      this.setState({
        fileList: fileList.concat({
          key: null,
          loading: 2,
          name
        })
      });
    }
    Attachment.add({ id, label });
  };

  deleteFile(key) {
    const fileList = this.state.fileList.filter(file => file.key !== key);
    this.setState(
      {
        fileList,
        value: getValuesFromFileList(fileList)
      },
      this.updateValue
    );
  }

  renderExtraIcons(fileInfo) {
    const filename = _.get(fileInfo, 'name', '');
    const previewUrl = _.get(fileInfo, 'previewUrl', '');
    if (IS_IMG(filename)) {
      return [
        <Icon
          type="eye"
          style={ICON_STYLE}
          onClick={() => {
            this.imageViewer.show(getImageUrl(fileInfo));
          }}
        />,
      ];
    } else if (!_.isEmpty(previewUrl)) {
      return [
        <Icon
          type="eye"
          style={ICON_STYLE}
          onClick={() => {
            window.open(previewUrl);
          }}
        />,
      ];
    }
  }

  renderList = dataSource => {
    if (_.isEmpty(dataSource)) {
      return null;
    }
    const { onlyView, needDisabled } = this.props;
    return (
      <div>
        {_.map(dataSource, fileInfo => {
          const fileName = _.get(fileInfo, "name", "undefined");
          const display = _.get(fileInfo, "display");
          const filePath = this.getFilePath(fileInfo);
          return (
            <Row
              key={Math.random()}
              style={{
                paddingLeft: 10,
                borderRadius: 5,
                border: "1px solid #d3d0d9",
                marginBottom: 5
              }}
            >
              <Col span={18}>
                <Ellipsis lines={1} tooltip>{fileName}</Ellipsis>
              </Col>
              <Col
                span={6}
                style={{
                  float: "right"
                }}
              >
                {fileInfo.loading ? (
                  <Icon type="loading" />
                ) : (
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center"
                    }}
                  >
                    {this.renderExtraIcons(fileInfo)}
                    {onlyView ? (
                      <Icon
                        key={filePath}
                        type="download"
                        style={{
                          cursor: "pointer",
                          display
                        }}
                        onClick={() => {
                          window.open(filePath);
                        }}
                      />
                    ) : (
                      <Icon
                        key={filePath}
                        type="close"
                        onClick={this.deleteFile.bind(this, fileInfo.key)}
                        style={Object.assign(
                          {
                            color: "red",
                            cursor: "pointer"
                          },
                          needDisabled ? { display: "none" } : {}
                        )}
                      />
                    )}
                  </div>
                )}
              </Col>
            </Row>
          );
        })}
      </div>
    );
  };

  render() {
    const { onlyView, needDisabled, relationField } = this.props;
    let { max_count } = relationField;
    max_count = parseInt(max_count);
    const { fileList } = this.state;

    /**
     * 上传数量限制条件
     */
    const upload_disabled = fileList.length >= max_count || needDisabled;
    return (
      <div>
        {!onlyView && (
          <Row>
            <Col span={6}>
              <Upload
                name="file"
                multiple={false}
                action={AttachmentService.uploadUrl}
                showUploadList={false}
                accept={this.acceptedExtensions}
                onChange={this.handleChange}
                beforeUpload={this.beforeUpload}
                disabled={needDisabled}
                headers={{
                  authorization: "authorization-text",
                  token: localStorage.getItem("token")
                }}
                style={{
                  display: upload_disabled ? "none" : "inherit"
                }}
              >
                <a href="javascript:void(0)">{formatMessage({ id: 'table.button.uploadAttachment'})}</a>
              </Upload>
              {upload_disabled ? <label>{formatMessage({ id: 'table.button.uploadAttachment'})}</label> : null}
            </Col>
            <Col span={18}>
              <label className={styles.rule}>
                {"(最多可上传${max_count}个.)"
                  .replace("${max_count}", max_count)
                  .replace("${format}", this.acceptedExtensions)}
              </label>
            </Col>
          </Row>
        )}
        {this.renderList(fileList)}
        <ImageViewer ref={el => (this.imageViewer = el)} />
      </div>
    );
  }
}

function getValuesFromFileList(fileList) {
  return fileList.map(item => item.key);
}
