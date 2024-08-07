import React, { useEffect, useMemo, useState } from 'react';
import IconFont from "@/components/Iconfont";
import { getStreamUrl } from "@/api";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { IStreamTypeEnum, LIVE_STATUS, LIVE_TYPES, liveStatusMap, PlayRoutesOptions } from "@/api/enum";
import { useRequest } from "ahooks";
import OrcaTCPlayer from "@/components/OrcaTCPlayer";
import poster from "@/assets/poster.png"
import { isIOS } from "@/utils"

interface LivePlayerProps {
	roomId?: any
}

const ios = isIOS()

const LivePlayer: React.FC<LivePlayerProps> = ({roomId}) => {
	const {roomInfo, liveStatus, getCurrentToken} = useStore()

	const {data: streamInfo, run: initStream, error} = useRequest(getStreamUrl, {
		manual: true
	})
	const [curPlayRoute, setCurPlayRoute] = useState<IStreamTypeEnum>(IStreamTypeEnum.WEBRTC)
	const [curUrl, setCurUrl] = useState("")
	useEffect(() => {
		// const defaultRoute = (roomInfo?.livingType === LIVE_TYPES.ULTRA_LOW) ? IStreamTypeEnum.WEBRTC : (ios ? IStreamTypeEnum.M3U8 : IStreamTypeEnum.FLV)
		if (streamInfo?.data) {
			// setCurPlayRoute(defaultRoute)
			setCurUrl(streamInfo.data[curPlayRoute] as string)
		}
	}, [roomInfo, streamInfo?.data]);

	const token = getCurrentToken();

	useEffect(() => {
		if (token && liveStatus == LIVE_STATUS.LIVING) {
			initStream(roomInfo?.id as number)
		}
	}, [token, liveStatus]);


	const allRoutes = useMemo(() => {
		if (!streamInfo?.data) return []
		return PlayRoutesOptions
			.filter((item) => {
				if (ios && item.value === 'flv') return false;
				return (streamInfo.data[item.value]);
			})
			.map((item) => ({
				src: (streamInfo.data)[item.value] as string,
				route: item.value,
				label: item.label,
			}))
			.filter(Boolean)
	}, [streamInfo?.data])
	return (
		<>
			{liveStatus !== 0 && (
				<div className="live-none">
					<IconFont type="dolphin-live"/> {liveStatusMap[liveStatus as number]}
				</div>
			)}
			{liveStatus === 0 && (
				<div className="orca-video-player">
					{
						curUrl && (
							<OrcaTCPlayer
								className="orca-video-player__item tcplay"
								url={curUrl}
								allRoutes={allRoutes}
								poster={/^http(s)?/.test(roomInfo?.cover as string) ? roomInfo?.cover : poster}
								selectedRoute={curPlayRoute}
							/>
						)
					}
				</div>
			)}
		</>
	)
}

export default observer(LivePlayer)
