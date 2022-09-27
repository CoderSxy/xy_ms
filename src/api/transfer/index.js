import request from '@/utils/request'

export function getFiles(query) {
  return request({
    url: '/transfer/list',
    method: 'get',
    params: query
  })
}
export function recordFile(data) {
  return request({
    url: '/transfer/record',
    method: 'post',
    data: data
  })
}
export function removeFile(query) {
  return request({
    url: '/transfer/fileremove',
    method: 'get',
    params: query
  })
}
