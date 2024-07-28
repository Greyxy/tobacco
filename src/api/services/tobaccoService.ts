import { allPass } from 'ramda';
import apiClient from '../apiClient';

export enum TobaccoApi {
  // 根据id查询烤房
  getRoomById = '/room/id?roomId=',
  // 修改烤房信息
  updateRoom = '/room/update',
  // 根据烤房id查询烘烤数据
  getbackingByRoomId = '/backing/id?roomId=',
  // submitbacking = '/backing/submit',
  // updatebacking = 'backing/update',
  // 根据不同地区查询烤房
  getRoomByArea = '/room/getRoom',
  // 审核
  reviewBacking = '/backing/review?id=',
  refuseBacking = '/backing/refuse?id=',
  // 条件查询
  backingQuery = '/backing/query',
  backingFind = '/backing/find',
  // 二维码
  getQrCode = '/qrcode/get',
  deleteQrCodeById = '/qrcode/delete?id=',
  getQrCodeById = '/qrcode/getById?id=',
  updateQrCode = '/qrcode/update',
  saveRoomCode = '/room/saveRoomCode',
  downloadImg = 'img/getCode',
  // 获取图片链接
  getImgUrl = '/img/preview?fileName=',
  // 审核历史数据
  getHistoryBakingData = 'backing/getHistory',


  // role
  addRole = '/role/add',
  getAllRole = '/role/get',
  getRoleById = '/role/',
  updateRole = '/role/update',
  deleteRole = '/role/',
  dispatchPermission = '/role/id/permissions',
  getRolePermission = '/role/roles/roleId/permissions',
  // craeteRole='/role/createRole'

  // user 
  login = '/user/login',
  createUser = '/user/create',
  getAllUser = '/user/all',
  getUserById = '/user/',
  updateUser = '/user/update',
  deleteUserById = '/user/delete/',
  findUser = '/user/find/'

}
const getRoomById = (id: string) => apiClient.get({ url: `${TobaccoApi.getRoomById}${id}` });
const updateRoom = (data) => apiClient.post({ url: TobaccoApi.updateRoom, data });

const getbackingByRoomId = (roomId: string) =>
  apiClient.get({ url: `${TobaccoApi.getbackingByRoomId}${roomId}` });
const getRoomByArea = (data) => apiClient.post({ url: TobaccoApi.getRoomByArea, data },);

const reviewBacking = (id: string) => apiClient.post({ url: `${TobaccoApi.reviewBacking}${id}` });
const refuseBacking = (id: string) => apiClient.post({ url: `${TobaccoApi.refuseBacking}${id}` });
const backingQuery = (data: any) => {
  return apiClient.post({ url: TobaccoApi.backingQuery, data });
};
const backgingFind = (data) => apiClient.get({ url: `${TobaccoApi.backingFind}`, params: data });
// 二维码
const getQrCode = (params) => apiClient.get({ url: `${TobaccoApi.getQrCode}`, params });
const deleteQrCodeById = (id: string) =>
  apiClient.post({ url: `${TobaccoApi.deleteQrCodeById}${id}` });
const getQrCodeById = (id: string) => apiClient.get({ url: `${TobaccoApi.getQrCodeById}${id}` });
const updateQrCode = (data) => apiClient.post({ url: `${TobaccoApi.updateQrCode}`, data });
const saveRoomCode = (data) => apiClient.post({ url: `${TobaccoApi.saveRoomCode}`, data });
const downloadImg = (data) => apiClient.post({ url: `${TobaccoApi.downloadImg}`, data })
const getImgUrl = (url: string) => apiClient.get({ url: `${TobaccoApi.getImgUrl}${url}` })
// 获取审核历史数据
const getHistoryBakingData = (params) => apiClient.get({ url: TobaccoApi.getHistoryBakingData, params })


// user
const login = (data) => apiClient.post({ url: TobaccoApi.login, data });
const createUser = (data) => apiClient.post({ url: TobaccoApi.createUser, data })
const getAllUser = (params) => apiClient.get({ url: TobaccoApi.getAllUser, params })
const getUserById = (id) => apiClient.get({ url: TobaccoApi.getUserById + 'id' })
const updateUser = (data) => apiClient.put({ url: TobaccoApi.updateUser, data })
const deleteUserById = (id) => apiClient.delete({ url: TobaccoApi.deleteUserById + id })
const findUser = (name) => apiClient.get({ url: TobaccoApi.findUser + name })
// role
const addRole = (data) => apiClient.post({ url: TobaccoApi.addRole, params: data })
const getAllRole = (params) => apiClient.get({ url: TobaccoApi.getAllRole, params })
const getRoleById = (id) => apiClient.get({ url: `${TobaccoApi.getRoleById}${id}` })
const updateRole = (data) => apiClient.put({ url: TobaccoApi.updateRole, data })
const deleteRole = (id) => apiClient.delete({ url: `${TobaccoApi.deleteRole}${id}` })
const getRolePermission = (roleId) => apiClient.get({ url: TobaccoApi.getRolePermission.replace('roleId', roleId) })
export default {
  getRoomById,
  updateRoom,
  getbackingByRoomId,
  getRoomByArea,
  reviewBacking,
  refuseBacking,
  login,
  backingQuery,
  backgingFind,
  getQrCode,
  deleteQrCodeById,
  getQrCodeById,
  updateQrCode,
  saveRoomCode,
  downloadImg,
  getImgUrl,
  getHistoryBakingData,
  addRole,
  getAllRole,
  getRoleById,
  updateRole,
  deleteRole,
  getRolePermission,
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUserById,
  findUser
}