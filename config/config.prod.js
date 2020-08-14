// const baseAddress = "http://localhost:8848";
const deployEnvironment = 'prod';
const baseAddress = "https://prod-workflow-backend.territorypower.cn";
const tmAddress = "https://prod-tm.crmpower.cn";
const ssoAddress = "https://prod-sso.crmpower.cn";
const fsAddress = "https://prod-fs.crmpower.cn";
const pdfAddress = "https://pdf.crmpower.cn";
const previewAddress = 'https://dev-file-preview.crmpower.cn/rest/preview/upload';

export default {
  define:{deployEnvironment,baseAddress,tmAddress,ssoAddress,fsAddress,pdfAddress,previewAddress}
}
