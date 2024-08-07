import React, { useEffect, useRef } from "react";
import IconFont from "@/components/Iconfont";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { Gift } from "@/api/types";
import { Empty } from "antd";
import { CSSTransition } from "react-transition-group";
import { useRequest } from "ahooks";
import { sendGiftLogic } from "@/api";

interface GiftItemProps {
	gift: Gift;
	sendGift: (gift: Gift) => void;
}

const GiftItem: React.FC<GiftItemProps> = ({sendGift, gift}) => (
	<div className="gift" key={gift.id} onClick={() => sendGift(gift)}>
		<div className="cover"><img src={gift.img} alt={gift.name}/></div>
		<h3>{gift.name}</h3>
		<p>{gift.price ? ("￥" + (gift.price / 100)) : "免费"}</p>
	</div>
)

interface GiftPanelProps {
	show: boolean;
	visibleHandler: (visible: boolean) => void;
}

const GiftPanel: React.FC<GiftPanelProps> = observer(({show, visibleHandler}) => {
	const {setSendGift, roomInfo, giftList} = useStore()
	const {data: sendResult, run: sendGiftRightNow} = useRequest(sendGiftLogic, {
		manual: true,
		onSuccess() {
			setTimeout(() => visibleHandler(false), 150)
		}
	})

	const sendGift = (gift: Gift) => {
		setSendGift(gift)
		sendGiftRightNow(roomInfo?.id as number, gift.id)
	}
	const nodeRef = useRef(null);
	return (
		<CSSTransition
			appear={true}
			in={show}
			timeout={300}
			classNames="fade-up"
			nodeRef={nodeRef}
			unmountOnExit={false}>
			<div className="gift-wrap" ref={nodeRef}>
				<div className="gift-title">
					<h3>送礼物</h3>
					<div className="close-btn" onClick={() => visibleHandler(false)}>
						<IconFont type="dolphin-close"/>
					</div>
				</div>
				{
					giftList.length
						? (<div className="gift-list">
							{giftList.map(gift => <GiftItem key={gift.id} gift={gift} sendGift={sendGift}/>)}
						</div>)
						: <div className="p-20"><Empty description="暂无礼物"/></div>
				}
			</div>
		</CSSTransition>

	);
})

export default GiftPanel;

