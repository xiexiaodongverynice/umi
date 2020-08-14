// const baseAddress = "http://localhost:8848";
const deployEnvironment = "dev";
const baseAddress = "http://54.223.73.224:8848";
const tmAddress = "https://dev-tm.crmpower.cn";
const ssoAddress = "https://dev-sso.crmpower.cn";
const fsAddress = "https://dev-fs.crmpower.cn";
const pdfAddress = "https://pdf.crmpower.cn";
const previewAddress =
  "https://dev-file-preview.crmpower.cn/rest/preview/upload";

export default {
  define: {
    deployEnvironment,
    baseAddress,
    tmAddress,
    ssoAddress,
    fsAddress,
    pdfAddress,
    previewAddress
  }
};
