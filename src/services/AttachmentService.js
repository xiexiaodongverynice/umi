/**
 * Created by Uncle Charlie, 2018/05/17
 */

import { FS,previewURL } from "../utils/config";
import searchUtil from "../utils/searchUtil";
import request from "../utils/request";

const restUrl = `${FS}/rest/files/`;
const uploadUrl = restUrl;
const downloadUrl = restUrl;

const getFileMeta = key => {
  const token = localStorage.getItem("token");
  const searchParam = searchUtil.stringify({ token });
  return fetch(`${restUrl}/${key}/info?${searchParam}`, {
    method: "GET",
    head: {
      token
    }
  }).then(response => response.json()).catch((e)=>{
    return e;
  });
};
const getFilePreview = (key) => {
  return request(`${previewURL}`,{
    method: 'GET',
    data:{attachment:key}
  });
};
// TODO: delete uploaded files.
export default {
  uploadUrl,
  downloadUrl,
  getFileMeta,
  getFilePreview
};
