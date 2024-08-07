import React, { useEffect, useRef, useState } from 'react';
import IconFont from "@/components/Iconfont";
import { WxEmotions } from "@/utils/emotions"
import { useStore } from "@/store";
import { Input, Popover } from "antd"
import { isMobileDevice } from "@/utils"
import { observer } from "mobx-react-lite";

const emotions = new WxEmotions()
const isMobile = isMobileDevice()
const emotionList = emotions.emotionSrcList

interface Props {
	imSocket: any;
	showGiftPanel: () => void;
	showCommodityPanel: () => void;
	showCoursePanel?: () => void
	showOrderPanel?: () => void
}

const  ChatToolBar = (props: Props) => {
	const {imSocket, showGiftPanel, showCommodityPanel, showCoursePanel, showOrderPanel} = props
	const {toggleLogin, getCurrentToken, roomInfo} = useStore()
	const [msg, setMsg] = useState('');


	const addEmoji = (index: number) => {
		setMsg(msg + emotions.idToText(index))
	}

	const sendHandler = () => {
		if (!msg) return;
		if (!getCurrentToken()) {
			return toggleLogin(true)
		}
		imSocket.emit("message", {
			"msgType": "normal",
			"data": msg,
			"quotaData": null
		})
		setMsg("")
	}

	const keyboardHeight = useRef(200)

	const handleResize = (event: any) => {
		const {height} = event.target
		const windowHeight = window.innerHeight
		if (height < windowHeight && isMobile) {
			keyboardHeight.current = windowHeight - height
		}
	}

	useEffect(() => {
		window.visualViewport?.addEventListener("resize", handleResize);
		return () => {
			window.visualViewport?.removeEventListener("resize", handleResize);
		}
	}, []);


	const EmotionPanel = (
		<div className="emotions-panel">
			{emotionList.map((item, index) => (
				<div key={index} onClick={() => addEmoji(index)}><img src={item} alt=""/></div>))}
		</div>
	)

	return (
		<div className="chat-toolbar">
			<div className="chat-send-bar">
				<Input
					value={msg}
					maxLength={100}
					onChange={(e) => setMsg(e.target.value)}
					onPressEnter={sendHandler}
					placeholder="和大家一起互动起来吧..."
					enterKeyHint="send"
					suffix={
						<Popover content={EmotionPanel} trigger="click">
							<IconFont className="emotion-btn" type="dolphin-satisified"/>
						</Popover>
					}
				/>
				{
					!isMobile && (<button type="button" onClick={sendHandler}>发送</button>)
				}
			</div>
			<button type="button" className="gift-btn" onClick={showGiftPanel}/>
			<button type="button" className="cart-btn" onClick={showCommodityPanel}/>
			<button type="button" className="order-btn" onClick={showOrderPanel}/>
			{
				roomInfo?.page.showPpt === 1 && (
					<button type="button" className="more-btn" onClick={showCoursePanel}/>
				)
			}
		</div>
	);
}

export default observer(ChatToolBar);
