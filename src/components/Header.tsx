import React from "react";
import IconFont from "@/components/Iconfont";
import { observer } from "mobx-react-lite";
import { QRCode, Popover, Tag, Image } from 'antd';
import { useTitle } from "ahooks";
import { liveStatusMap } from "@/api/enum"
import { isMobileDevice } from "@/utils";
import { useStore } from "@/store";
import Logo from "@/assets/128-white.jpg"
import fallback from "@/assets/fallback.png"
const isMobile = isMobileDevice()

type HeaderProps = {
	className?: string;  // Adding className props
};

const Header: React.FC<HeaderProps> = ({ className }) => {
	const {totalOnlineUsers, roomInfo, liveStatus, broadcastRoom} = useStore()
	const url = window.location.href
	useTitle(roomInfo?.name || broadcastRoom?.orgName || '')
	return (
		<header className={className}>
			<h1>
				<Image
					className="logo-img"
					src={roomInfo?.logo || broadcastRoom?.orgLogo || Logo}
					alt={roomInfo?.name}
					preview={false}
					fallback={fallback}
				/>
				{!isMobile && (<span>{roomInfo?.name || broadcastRoom?.orgName || '虎鲸云'}</span>)}
			</h1>
			<div className="title">
				<h3>{roomInfo?.name} </h3>
				<Tag color={liveStatus === 0 ? "#108ee9" : undefined}>
					{liveStatusMap[liveStatus as number]}
				</Tag>
				<span className="audience-num">
					<i></i>{
					roomInfo?.interact.tupleEnable
						? Number(totalOnlineUsers) * roomInfo?.interact.tupleNum
						: (Number(roomInfo?.interact.tupleNum) + Number(totalOnlineUsers))
				}人</span>
			</div>
			{
				!isMobile && <div>
          <Popover
            overlayInnerStyle={{padding: 10}}
            trigger="click"
            content={<QRCode value={url} bordered={false} color="#1890ff"/>}>
            <div className="mobile-btn"><IconFont type="dolphin-phone"></IconFont> 手机观看</div>
          </Popover>
        </div>
			}
		</header>
	)
}


export default observer(Header)
