import request from '@/utils/request'


export function listRanking(params) {
  return request({
    url: '/ranking/list' ,
    method: 'get',
    params
  })
}

export function createRanking(data) {
  return request({
    url: '/ranking/create',
    method: 'post',
    data
  })
}

export function updateRanking(data) {
  return request({
    url: '/ranking/update',
    method: 'post',
    data
  })
}
// 删除
export function deleteRanking(params) {
  return request({
    url: '/ranking/remove',
    method: 'get',
    params
  })
}


export function transferRanking(data) {
  return request({
    url: '/ranking/transfer',
    method: 'post',
    data
  })
}
