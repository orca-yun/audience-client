import {
  ResponseModel,
  StreamInfo,
  LiveBroadcastingRoom,
  Commodity,
  Gift,
  Course,
} from "@/api/types";
import { Get, Post, Post } from "@/utils/interaction";

export function loginLogic(key: string, nickname: string): Promise<any> {
  return Post(`/v3/share/auth/user/${key}`, { nickname });
}

export function getLivingRoomInfo(
  room_key: string
): Promise<ResponseModel<LiveBroadcastingRoom>> {
  return Get(`/v3/share/live/${room_key}`);
}

export function sendGiftLogic(room_id: number, gift_id: number) {
  return Post(`/v3/market/gift/${room_id}/send`, {
    roomId: room_id,
    id: gift_id,
  });
}

export function getStreamUrl(
  room_id: number
): Promise<ResponseModel<StreamInfo>> {
  return Get(`/v3/stream/pull/${room_id}`);
}

export function prepareCheck(): Promise<ResponseModel<StreamInfo>> {
  return Get(`/v3/share/prepare/check`);
}

export function initPay(
  order_id: number,
  pay_type: number,
  call_back_type: number
) {
  return Get(
    `/v3/order/pay-info?orderId=${order_id}&payType=${pay_type}&callBackType=${call_back_type}`
  );
}

export function queryPay(order_id: number) {
  return Get(`/v3/order/payed/${order_id}`, {});
}

export function createdOrder(data: any) {
  return Post(`/v3/order`, data);
}

export function mineOrder(): Promise<ResponseModel<any[]>> {
  return Get(`/v3/order/mine`, {});
}

export function queryUserAddress() {
  return Get(`/v3/order/address`);
}

export function cancelOrder(order_id: number) {
  return Post(`/v3/order/${order_id}`, {})
}

export function initLoginUrl(
  room_id: number,
  channel_id: number,
  type: number
) {
  return Get(
    `/v3/auth/wx/qrcode?roomId=${room_id}&channelId=${channel_id}&platform=${type}`
  );
}

export function initLoginKey(login_key: number) {
  return Get(`/v3/auth/wx/e2e/${login_key}`);
}

