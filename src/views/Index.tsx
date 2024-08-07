import Header from "@/components/Header";
import LivePlayer from "@/components/LivePlayer";
import ChatPanel from "@/components/chatPanel/ChatPanel";
import React, { useMemo, useEffect, useState } from "react";
import LoginPanel from "@/components/LoginPanel";
import { getLivingRoomInfo, prepareCheck } from "@/api";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { isMobileDevice, safeJsonParse } from "@/utils"
import { initSocket } from "@/api/socket";
import { useSearchParams } from "react-router-dom";
import { useRequest } from "ahooks";
import { Message } from "@/api/types";
import { message, Spin } from "antd";
import { LIVE_STATUS, PHONE_LAYOUT, TOKEN_VALID } from "@/api/enum";
import WhiteBoardFeedback from "@/components/WhiteBoardFeedback";
import PresentGift from "@/components/chatPanel/PresentGift";

const isMobile = isMobileDevice()

function Index() {
	const {
		setRoomInfo,
		setNotice,
		roomInfo,
		logout,
		setRoomKey,
		setCommodityList,
		setGiftList,
		setRecommendCommodity,
		setSendGift,
		setTotalOnlineUsers,
		getCurrentToken,
		setBlocked,
		setLiveStatus,
		setBroadcastRoom,
	} = useStore()
	const [socket, setSocket] = useState<any>(undefined)
	const [params] = useSearchParams()
	const [loading, setLoading] = useState(true);
	const [messageList, setMessageList] = useState<Message[]>([])

	const {data: responseRoomInfo, run: getRoomInfo} = useRequest(getLivingRoomInfo, {
		manual: true,
		onSuccess: (result) => {
			setRoomInfo(result.data.room)
			setNotice(result.data.notice)
			setLiveStatus(result.data.livingStatus)
			setCommodityList(result.data.room.goodsItems)
			setGiftList(result.data.room.giftItems)
			setBroadcastRoom(result.data)
			setTotalOnlineUsers(result.data.totalOnlineUser)
			setLoading(false)
			
		},
		onError() {
			message.error("获取房间信息失败！");
		}
	})

	const {data: prepareData, run: prepareHandle} = useRequest(prepareCheck, {
		manual: true,
		onSuccess: (result: any) => {
			switch(result.data.result) {
				case TOKEN_VALID.BLACKLIST:
					setBlocked(true)
					break;
				case TOKEN_VALID.EXPIRE:
				case TOKEN_VALID.ILLEGAL:
					logout()
					window.location.reload()
					break;
				default:
					console.info('check pass')
			}
		}
	})

	useEffect(() => {
		const _roomKey = params.get("key")
		if (_roomKey) {
			setRoomKey(_roomKey)
			getRoomInfo(_roomKey)
		} else {
			message.error("url地址不合法！");
		}
	}, [params]);

	useEffect(() => {
		const token = getCurrentToken();
		if (token) {
			prepareHandle()
			const newSocket = initSocket()
			setSocket(newSocket)
		}
	}, [getCurrentToken()])


	const receiveMessage = (msg: Message) => {
		setMessageList(prevList => {
			let tempList = [...prevList]
			if (msg.msgType === "cancel") {
				for (let i = 0; i < tempList.length; i++) {
					if (tempList[i].uuid === msg.data) {
						tempList.splice(i, 1)
					}
				}
			} else {
				tempList.push({
					...msg,
					type: msg.msgType === "img" ? "img" : "message"
				});
			}
			return tempList
		})
	}

	useEffect(() => {
		let interval: any = null
		if (socket) {
			socket.connect()
			socket.on("message", (msg: Message) => {
				if (msg.msgType) {
					if (["normal", "img", "cancel", "reply"].includes(msg.msgType)) {
						receiveMessage(msg)
					}
				}
			})
			socket.on("ctrl", (msg: Message) => {
				if (msg.bizType === "system_msg") {
					setMessageList(prevList => {
						let tempList = [...prevList]
						tempList.push({
							...msg,
							type: "system_msg"
						});
						return tempList
					})
				} else if (msg.bizType === "gift") {
					const giftData: any = safeJsonParse(msg.data)
					setSendGift(giftData.giftItem)
					setMessageList(prevList => {
						let tempList = [...prevList]
						tempList.push({
							...msg,
							...giftData,
							type: "gift"
						});
						return tempList
					})
				} else if (msg.bizType === "goods_control") {
					const commodityList = safeJsonParse(msg.data)
					const {items, recommend} = commodityList as any
					setCommodityList(items)
					setRecommendCommodity(recommend)
				} else if (msg.bizType === "gift_control") {
					const giftList = safeJsonParse(msg.data)
					const {items} = giftList as any
					setGiftList(items)
				} else if (msg.bizType === "live_status") {
					setLiveStatus(Number(msg.data))
				} else if (msg.bizType === "total_online_user") {
					setTotalOnlineUsers(msg.data)
				} else if (msg.bizType === "blacklist_trigger") {
					setLiveStatus(LIVE_STATUS.END)
				}
			})
			interval = setInterval(() => {
				socket.emit("stat", {
					timestamp: Date.now()
				})
			}, 5000);
		}
		return () => {
			interval && clearInterval(interval)
			socket?.disconnect()
		};
	}, [socket]);

	const mobileLayout = Number(roomInfo?.page?.mobileLayout);

	const {roomId} = responseRoomInfo?.data || {}

	const getMobileLayout = useMemo(() => {
		switch (mobileLayout) {
			case PHONE_LAYOUT.FULLSCREEN:
				return 'fullscreen';
			case PHONE_LAYOUT.THREE:
				return 'three-layout';
			default:
				return 'normal';
		}
	}, [mobileLayout]);

	return (
		<Spin spinning={loading} size="large" tip="加载中..." wrapperClassName="spin-wrap">
			<div className="wrap">
				<Header className={`${getMobileLayout}`}/>
				<div className={`content ${getMobileLayout}`}>
					{
						roomInfo?.page.showDraw !== 1 ? (
							<>
								<div className="player-wrap" style={{backgroundImage: `url(${roomInfo?.page.bgImage || roomInfo?.cover || ''})`}}>
									<LivePlayer roomId={roomId}/>
								</div>
								<ChatPanel chatList={messageList} imSocket={socket}>
									{!isMobile && (<PresentGift/>)}
								</ChatPanel>
							</>
						) : (
							<>
								{
									((mobileLayout === 2 && !isMobile) || (mobileLayout === 3)) && (
										<div className="board">
											<WhiteBoardFeedback/>
										</div>
									)
								}
								<div className="compose-panel">
									<div className="player-wrap" style={{backgroundImage: `url(${roomInfo?.page.bgImage || roomInfo?.cover })`}}>
										<LivePlayer roomId={roomId}/>
									</div>
									<ChatPanel chatList={messageList} imSocket={socket}>
										{!isMobile && (<PresentGift/>)}
									</ChatPanel>
								</div>
							</>
						)
					}

				</div>
			</div>
			<LoginPanel/>
			{isMobile && (<PresentGift/>)}
		</Spin>
	)
}

export default observer(Index)
