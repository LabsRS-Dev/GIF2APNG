/**
 * @author Ian
 * @created 2017-5-31 15:17:21
 */
import {
  BS
} from 'dove.max.sdk'

const internal = {
  getAppName: () => {
    return BS.b$.App.getAppName()
  },
  getAppVersion: () => {
    return BS.b$.App.getAppVersion()
  },
  getHomePage: () => {
    return BS.b$.App.getHomePageURL()
  },
  getDocPage: () => {
    return BS.b$.App.getDocumentPageURL()
  },
  getNewsDataUrl: () => {
    return BS.b$.App.getNewsJsonURL()
  },
  getVendorName: () => {
    return BS.b$.App.getVendorName()
  },
  getVendorWebSiteURL: () => {
    return BS.b$.App.getVendorWebSiteURL()
  },
  getAdditionalConfigURL: () => {
    return BS.b$.App.getAdditionalConfigURL()
  },
  getSupportPageURL: () => {
    return BS.b$.App.getSupportPageURL()
  },
  getSupportEmail: () => {
    return BS.b$.App.getSupportEmail()
  }
}


const SysConfig = {
  appName: internal.getAppName() || 'GMagon GIF',
  version: internal.getAppVersion() || '20171210.10.35',
  homepage: internal.getHomePage() || 'https://gmagon.com/products/store/gmagon_gif/index.html',
  docPage: internal.getDocPage() || 'https://gmagon.com/products/store/gamgon_gif/docs.html',
  newsDataUrl: internal.getNewsDataUrl() || 'https://gmagon.com/products/store/gmagon_gif/data/news.json',
  companyName: internal.getVendorName() || 'GMagon',
  appReleaseDate: '2017/12/10',
  companyWebsiteHomepage: internal.getVendorWebSiteURL() || 'https://gmagon.com',
  support: internal.getSupportPageURL() || 'http://gmagon.com/support',
  // apiHost: 'https://api.gmagon.com/plugin/gif/api',
  apiHost: 'http://192.168.3.6:5000/plugin/gif/api',
  // userMachine: 'https://api.gmagon.com/api',
  userMachine: 'http://192.168.3.6:5000/api'
}

// export
export { SysConfig }
