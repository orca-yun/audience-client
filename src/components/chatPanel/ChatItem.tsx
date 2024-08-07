import React from 'react';
import dayjs from "dayjs";
import { Message } from "@/api/types";
import { WxEmotions } from "@/utils/emotions";
import { isMobileDevice } from "@/utils";
import { Image } from "antd";
import { useStore } from "@/store";
import { PHONE_LAYOUT } from "@/api/enum";

const emotions = new WxEmotions()

const isMobile = isMobileDevice()

function ChatItem(props: { messageItem: Message }) {
	const { roomInfo } = useStore()
	const {messageItem} = props
	const isFullScreen = (isMobile) && (Number(roomInfo?.page.mobileLayout) === PHONE_LAYOUT.FULLSCREEN)
	const notMobileFullScreen = (isMobile) && (Number(roomInfo?.page.mobileLayout) !== PHONE_LAYOUT.FULLSCREEN)
	const MobileChatItem = () => (
		<div className="chat-item__mobile">
			<div className="chat-item__name">{messageItem.senderName}：</div>
			{
				messageItem.type === "message" && 
        <div className="chat-content" dangerouslySetInnerHTML={{"__html": emotions.parse(messageItem.data)}}></div>
			}
			{
				messageItem.type === "message" && messageItem.msgType == 'reply' &&
        <div className="chat-quota-data" dangerouslySetInnerHTML={{"__html": emotions.parse(messageItem.quotaData)}}></div>
			}
			{
				messageItem.type === "img" &&
        <div className="chat-content">
          <Image src={messageItem.data} alt="" preview={true}/>
        </div>
			}
		</div>
	)
	const PcChatItem = () => (
		<>
			<div className="chat-title">
				<div className="chat-user">
					<div className={`chat-avatar ${!messageItem.senderHeadIco && 'only-text'}`}>
						{messageItem.senderHeadIco ? (<img src={messageItem.senderHeadIco} alt={messageItem.senderName}/>) : (
							<span>{messageItem.senderName[0]}</span>)}
					</div>
					<div className="chat-name">{messageItem.senderName}</div>
				</div>
				<div className="chat-at">{dayjs(messageItem.ts).format("HH:mm:ss")}</div>
			</div>
			{
				messageItem.type === "message" &&
        <div className="chat-content" dangerouslySetInnerHTML={{"__html": emotions.parse(messageItem.data)}}></div>
			}
			{
				messageItem.type === "message" && messageItem.msgType == 'reply' &&
        <div className="chat-quota-data" dangerouslySetInnerHTML={{"__html": emotions.parse(messageItem.quotaData)}}></div>
			}
			{
				messageItem.type === "img" &&
        <div className="chat-content">
          <Image src={messageItem.data} alt="" preview={true} />
        </div>
			}
		</>
	)
	return (
		<div className="chat-item">
			{
				((messageItem.type === "message" || messageItem.type === "img") && (!isMobile)) && <PcChatItem/>
			}
			{
				((messageItem.type === "message" || messageItem.type === "img") && notMobileFullScreen) && <PcChatItem/>
			}

			{
				((messageItem.type === "message" || messageItem.type === "img") && isFullScreen) && <MobileChatItem/>
			}
			{
				(messageItem.type === "gift" && messageItem.giftItem?.name) && (
					<div className="notice-item">
						{
							(!isMobile) ? (<i className="notice-icon"></i>) : (<b>系统消息：</b>)
						}
						<span>{messageItem.senderName} 送给主播</span>
						<Image src={messageItem.giftItem?.img}
						       alt={messageItem.giftItem?.name}
						       preview={false}
						       width={50}/>
					</div>
				)
			}
			{/* 系统通知 */}
			{messageItem.type === "system_msg" && (
				<div className="notice-item">
					{
						(!isMobile) ? (<i className="notice-icon"></i>) : (<b>系统消息：</b>)
					}
					{messageItem.data}
				</div>
			)}

		</div>
	);
}

export default ChatItem;
