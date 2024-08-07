export enum COMMODITY_STATUS {
	ON_SALE = 1,
	OFF_SALE = 2,
	SOLD_OUT = 3
}

export enum GIFT_STATUS {
	ON_SHELF = 1,
	OFF_SHELF = 2
}

export enum TOKEN_VALID {
	PASS = 1,
	EXPIRE = 2,
	ILLEGAL = 3,
	BLACKLIST = 4
}

export enum PAY_TYPE {
	JUMP = 1, // 1 跳转 2 在线支付 3. 小程序支付
	ONLINE = 2,
	WEAPP = 3
}

export enum LIVE_TYPES {
	STANDARD = 1, // 超低延迟
	ULTRA_LOW = 2 // 超低延迟
}

export enum TIMES_USERS {
	OPEN = 0,
	CLOSE = 1
}

export enum VIDEO_QUALITY {
	LOW_DEFINITION = 1,
	STANDARD_DEFINITION = 2,
	HIGH_DEFINITION = 3,
	QUASI_HIGH_DEFINITION = 4,
	SUPER_DEFINITION = 5
}

export enum VIEW_AUTH {
	AUTH_NO_PASSWORD = 1,
	AUTH_PASSWORD = 2,
	AUTH_PAY = 3
}

export enum LIVE_STATUS {
	LIVING = 0,
	END = 1
}

export enum IStreamTypeEnum {
	RTMP = 'rtmp',
	FLV = 'flv',
	M3U8 = 'm3u8',
	WEBRTC = 'webrtc',
}

export enum PHONE_LAYOUT {
	FULLSCREEN = 1,
	NORMAL,
	THREE,
}

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const sendTypes: { [key: number]: string } = {
	0: "主播",
	1: "助理",
	2: "用户",
	3: "机器人"
}

export const liveStatusMap: { [key: number]: string } = {
	0: "直播中",
	1: "未开始"
}


export const PlayRoutesOptions = [
	{
		label: '线路一',
		value: IStreamTypeEnum.WEBRTC,
	},
	{
		label: '线路二',
		value: IStreamTypeEnum.FLV,
	},
	{
		label: '线路三',
		value: IStreamTypeEnum.M3U8,
	},
]
