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
  backingFind = '/backing/find?status=',
  // 二维码
  getQrCode = '/qrcode/get',
  deleteQrCodeById = '/qrcode/delete?id=',
  getQrCodeById = '/qrcode/getById?id=',
  updateQrCode = '/qrcode/update',
  saveRoomCode = '/room/saveRoomCode',
  // 登录
  login = '/user/login',
}
const getRoomById = (id: string) => apiClient.get({ url: `${TobaccoApi.getRoomById}${id}` });
const updateRoom = (data) => apiClient.post({ url: TobaccoApi.updateRoom, data });

const getbackingByRoomId = (roomId: string) =>
  apiClient.get({ url: `${TobaccoApi.getbackingByRoomId}${roomId}` });
const getRoomByArea = () => apiClient.get({ url: TobaccoApi.getRoomByArea });

const reviewBacking = (id: string) => apiClient.post({ url: `${TobaccoApi.reviewBacking}${id}` });
const refuseBacking = (id: string) => apiClient.post({ url: `${TobaccoApi.refuseBacking}${id}` });
const login = (data) => apiClient.post({ url: TobaccoApi.login, data });
const backingQuery = (data: any) => {
  return apiClient.post({ url: TobaccoApi.backingQuery, data });
};
const backgingFind = (id: string) => apiClient.get({ url: `${TobaccoApi.backingFind}${id}` });
// 二维码
const getQrCode = () => apiClient.get({ url: `${TobaccoApi.getQrCode}` });
const deleteQrCodeById = (id: string) =>
  apiClient.post({ url: `${TobaccoApi.deleteQrCodeById}${id}` });
const getQrCodeById = (id: string) => apiClient.get({ url: `${TobaccoApi.getQrCodeById}${id}` });
const updateQrCode = (data) => apiClient.post({ url: `${TobaccoApi.updateQrCode}`, data });
const saveRoomCode = (data) => apiClient.post({ url: `${TobaccoApi.saveRoomCode}`, data });
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
};
