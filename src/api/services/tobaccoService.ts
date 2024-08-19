import apiClient from '../apiClient';

export enum TobaccoApi {
  // 根据id查询烤房
  getRoomById = '/room/id?roomId=',
  // 修改烤房信息
  updateRoom = '/room/update',
  // 根据烤房id查询烘烤数据
  getbackingByRoomId = '/backing/id?roomId=',
  // submitbacking = '/backing/submit',
  updatebacking = 'backing/update',
  // 根据不同地区查询烤房
  getRoomByArea = '/room/getRoom',
  // 审核
  reviewBacking = '/backing/review',
  refuseBacking = '/backing/refuse',
  batchReview = '/backing/reviewAll',
  // 条件查询,
  backingQuery = '/backing/query',
  backingFind = '/backing/find',
  backingDelete = '/backing/delete',
  // 二维码
  getQrCode = '/qrcode/get',
  deleteQrCodeById = '/qrcode/delete?id=',
  getQrCodeById = '/qrcode/getById?id=',
  getQrCodeByRemark = '/qrcode/getByRemark?remark=',
  updateQrCode = '/qrcode/update',
  saveRoomCode = '/room/saveRoomCode',
  downloadImg = 'img/getCode',
  saveQR = '/qrcode/saveQR',
  deleteQR = '/qrcode/delete',
  updateQR = '/qrcode/update',
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
  findUser = '/user/find/',

  // city
  getCountry = '/room/getCounty',
  getStation = '/room/getStation',

  // 烟农 采集人
  getFarmerList = '/person/farmer/list',
  getCollectorList = '/person/collector/list',
  getFarmer = '/person/farmer/',
  getCollector = '/person/collector/',
  addFarmer = '/person/farmer',
  addCollector = '/person/collector',
  updateFarmer = '/person/farmer',
  updateCollector = '/person/collector',
  deleteFarmerById = '/person/farmer/',
  deleteCollectorById = '/person/collector/',
  getCollectorByQuery = '/person/collector',
  getFarmerByQuery = '/person/farmer',
  searchFarmer = '/person/farmer/search',
  searchCollector = '/person/collector/search',
}
const getRoomById = (id: string) => apiClient.get({ url: `${TobaccoApi.getRoomById}${id}` });
const updateRoom = (data) => apiClient.post({ url: TobaccoApi.updateRoom, data });

const getbackingByRoomId = (roomId: string) =>
  apiClient.get({ url: `${TobaccoApi.getbackingByRoomId}${roomId}` });
const getRoomByArea = (data) => apiClient.post({ url: TobaccoApi.getRoomByArea, data });
const updatebacking = (data) => apiClient.post({ url: TobaccoApi.updatebacking, data });
const reviewBacking = (params) => apiClient.post({ url: `${TobaccoApi.reviewBacking}`, params });
const refuseBacking = (params) => apiClient.post({ url: `${TobaccoApi.refuseBacking}`, params });
const batchReview = (data) => apiClient.post({ url: TobaccoApi.batchReview, data });
const backingQuery = (data: any) => {
  return apiClient.post({ url: TobaccoApi.backingQuery, data });
};
const backgingFind = (data) => apiClient.post({ url: `${TobaccoApi.backingFind}`, data });
const backingDelete = (data) =>
  apiClient.post({ url: `${TobaccoApi.backingDelete}`, params: data });
// 二维码
const getQrCode = (params) => apiClient.get({ url: `${TobaccoApi.getQrCode}`, params });
const deleteQrCodeById = (id: string) =>
  apiClient.post({ url: `${TobaccoApi.deleteQrCodeById}${id}` });
const getQrCodeById = (id: string) => apiClient.get({ url: `${TobaccoApi.getQrCodeById}${id}` });
const getQrCodeByRemark = (remark: string) =>
  apiClient.get({ url: `${TobaccoApi.getQrCodeByRemark}${remark}` });
const updateQrCode = (data) => apiClient.post({ url: `${TobaccoApi.updateQrCode}`, data });
const saveRoomCode = (data) => apiClient.post({ url: `${TobaccoApi.saveRoomCode}`, data });
const downloadImg = (data) => apiClient.post({ url: `${TobaccoApi.downloadImg}`, data });
const getImgUrl = (url: string) => apiClient.get({ url: `${TobaccoApi.getImgUrl}${url}` });
const saveQR = (data) => apiClient.post({ url: `${TobaccoApi.saveQR}`, params: data });
const deleteQR = (data) => apiClient.post({ url: `${TobaccoApi.deleteQR}`, params: data });
const updateQR = (data) => apiClient.post({ url: `${TobaccoApi.updateQR}`, data });
// 获取审核历史数据
const getHistoryBakingData = (params) =>
  apiClient.get({ url: TobaccoApi.getHistoryBakingData, params });

// user
const login = (data) => apiClient.post({ url: TobaccoApi.login, data });
const createUser = (data) => apiClient.post({ url: TobaccoApi.createUser, data });
const getAllUser = (params) => apiClient.get({ url: TobaccoApi.getAllUser, params });
const getUserById = (id) => apiClient.get({ url: TobaccoApi.getUserById + 'id' });
const updateUser = (data) => apiClient.put({ url: TobaccoApi.updateUser, data });
const deleteUserById = (id) => apiClient.delete({ url: TobaccoApi.deleteUserById + id });
const findUser = (name) => apiClient.get({ url: TobaccoApi.findUser + name });
// role
const addRole = (data) => apiClient.post({ url: TobaccoApi.addRole, params: data });
const getAllRole = (params) => apiClient.get({ url: TobaccoApi.getAllRole, params });
const getRoleById = (id) => apiClient.get({ url: `${TobaccoApi.getRoleById}${id}` });
const updateRole = (data) => apiClient.put({ url: TobaccoApi.updateRole, data });
const deleteRole = (id) => apiClient.delete({ url: `${TobaccoApi.deleteRole}${id}` });
const getRolePermission = (roleId) =>
  apiClient.get({ url: TobaccoApi.getRolePermission.replace('roleId', roleId) });
const getCountry = () => apiClient.get({ url: `${TobaccoApi.getCountry}` });
const getStation = (data) => apiClient.get({ url: `${TobaccoApi.getStation}`, params: data });

// 烟农 采集人
const getFarmerByQuery = (data) =>
  apiClient.get({ url: TobaccoApi.getFarmerByQuery, params: data });
const getCollectorByQuery = (data) =>
  apiClient.get({ url: TobaccoApi.getCollectorByQuery, params: data });
const addFarmer = (data) => apiClient.post({ url: TobaccoApi.addFarmer, data });
const addCollector = (data) => apiClient.post({ url: TobaccoApi.addCollector, data });
const updateFarmer = (data) => apiClient.put({ url: TobaccoApi.updateFarmer, data });
const updateCollector = (data) => apiClient.put({ url: TobaccoApi.updateCollector, data });
const deleteCollectorById = (id) => apiClient.delete({ url: TobaccoApi.deleteCollectorById + id });
const deleteFarmerById = (id) => apiClient.delete({ url: TobaccoApi.deleteFarmerById + id });
const searchFarmer = (data) => apiClient.get({ url: TobaccoApi.searchFarmer, params: data });
const searchCollector = (data) => apiClient.get({ url: TobaccoApi.searchCollector, params: data });

export default {
  getRoomById,
  updateRoom,
  getbackingByRoomId,
  updatebacking,
  getRoomByArea,
  reviewBacking,
  refuseBacking,
  batchReview,
  login,
  backingQuery,
  backgingFind,
  backingDelete,
  getQrCode,
  deleteQrCodeById,
  getQrCodeById,
  getQrCodeByRemark,
  updateQrCode,
  saveRoomCode,
  downloadImg,
  saveQR,
  deleteQR,
  updateQR,
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
  findUser,
  getCountry,
  getStation,
  getFarmerByQuery,
  addFarmer,
  updateFarmer,
  deleteFarmerById,
  getCollectorByQuery,
  addCollector,
  deleteCollectorById,
  updateCollector,
  searchFarmer,
  searchCollector,
};
