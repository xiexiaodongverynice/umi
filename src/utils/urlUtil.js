// http://www.cnblogs.com/see7di/archive/2011/11/21/2257442.html
import _ from 'lodash';
import UrlParse from 'url-parse';
import config from './config';
import storageUtil from "./storageUtil";

const { baseURL, api } = config;
const { ac } = api;
function joint(...params) {

}

function downloadAcModelXML(modelId){
  const { path ,method = "get" } = ac.model.downLoadXML;
  const url = _.replace(`${baseURL}${path}?token=${localStorage.getItem('token')}`,'{modelId}',modelId);
  return url;

}


export default {
  joint,downloadAcModelXML
};
