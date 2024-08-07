import {
	PAY_TYPE,
	COMMODITY_STATUS,
	GIFT_STATUS,
	LIVE_TYPES,
	VIDEO_QUALITY,
	TIMES_USERS,
	VIEW_AUTH,
	LIVE_STATUS
} from "./enum"

export interface ResponseModel<T> {
	code: number
	data: T
	msg: string
}

export interface Commodity {
	id: number;
	orgId: number;
	roomId: number;
	goodsLibId: number;
	name: string;
	img: string;
	originalPrice: number;
	price: number;
	payType: PAY_TYPE;
	miniPage: string;
	jumpPage: string;
	sellStatus: COMMODITY_STATUS;
	qrcode?: string
}

export interface IOrder {
	id: number;
	goodsImage: string
	goodsName: string
	recipientName: string
	recipientPhone: string
	orderNo: string
	orderStatus: 1 | 2
	realAmt: number,
	timeoutTime: string
}

export interface Gift {
	id: number;
	orgId: number;
	roomId: number;
	giftLibId: number;
	name: string;
	img: string;
	price: number;
	status: GIFT_STATUS;
}

export interface LiveBroadcastingRoom {
  notice: string
	room: {
		id: number;
		name: string;
		livingTime: string; // ISO 8601 datetime string
		cover: string;
		logo: string;
		remark: string;
		livingType: LIVE_TYPES;
		videoQuality: VIDEO_QUALITY;
		interact: {
			tupleEnable: TIMES_USERS;
			tupleNum: number;
		};
		page: {
			mobileLayout: string | number;
			padPcLayout: string;
			bgImage: string;
			watermark: string;
			showDraw: 0 | 1;
			showPpt: 0 | 1;
		};
		permission: {
			permissionType: VIEW_AUTH;
			permissionJson: string;
		};
		goods: {
			btnTxt: string;
			countDown: number;
			showStyle: number;
		};
		coursewares: Course[];
		giftItems: Gift[];
		goodsItems: Commodity[]
	},
	orgId: number,
	orgLogo?: string,
	orgName?: string,
	roomId: number,
	channelId: number,
	token: string
	livingStatus: LIVE_STATUS;
	totalOnlineUser: string
}

export interface StreamInfo {
	rtmp?: string,
	flv: string,
	"m3u8": string,
	webrtc: string
}

export interface Course {
	id: number,
	orgId: number,
	roomId: number,
	name: string,
	status: number,
	images: string[]
}

// 封装后message
export interface Message {
	uuid: string | number,
	type: "message" | "img" | "gift" | "system_msg"
	bizType: "live_status" | "gift" | "system_msg" | "gift_control" | "goods_control" | 'total_online_user'
	msgType?: "normal" | "img" | "cancel" | "reply"
	data: string
	quotaData: string
	senderName: string
	senderHeadIco: string
	senderType: 0 | 1 | 2 | 3
	ts: number
	giftItem: {
		name: string,
		img: string,
		price: number
	}
}
