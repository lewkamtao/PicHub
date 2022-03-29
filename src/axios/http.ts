import xwlRequest from './index'
const xwlRequests = new xwlRequest({
  baseURL: 'https://api.github.com',
  timeout: 30000,
})
export default xwlRequests
