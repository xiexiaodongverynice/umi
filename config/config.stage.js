// const baseAddress = "http://localhost:8848";
const deployEnvironment = 'stg';
const baseAddress = "https://stg-workflow-backend.territorypower.cn";
const tmAddress = "https://stg-tm.crmpower.cn";
const ssoAddress = "https://stg-sso.crmpower.cn";
const fsAddress = "https://stg-fs.crmpower.cn";
const pdfAddress = "https://pdf.crmpower.cn";
const previewAddress = 'https://stg-file-preview.crmpower.cn/rest/preview/upload';

export default {
  define:{deployEnvironment,baseAddress,tmAddress,ssoAddress,fsAddress,pdfAddress,previewAddress}
}
