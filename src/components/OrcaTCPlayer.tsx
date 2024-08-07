import React, { useRef, useEffect, useLayoutEffect, useState, MutableRefObject } from 'react'
import cls from 'classnames'
import TCPlayer, { TCPlayerIInstance } from 'tcplayer.js'
import 'tcplayer.js/dist/tcplayer.min.css'
import { IStreamTypeEnum } from '@/api/enum'
import { isMobileDevice } from "@/utils";
import { Simulate } from 'react-dom/test-utils'
import play = Simulate.play

const licenseUrl = import.meta.env.VITE_LICENCE_URL

interface ITCPlayer {
	url: string,
	className?: string,
	poster?: string,
	allRoutes: { src: string; route: IStreamTypeEnum; label: string }[],
	selectedRoute: IStreamTypeEnum,
}

const OrcaTCPlayer: React.FC<ITCPlayer> = (props) => {
	const {className, url, poster, allRoutes, selectedRoute} = props
	const wrapperRef = useRef<any>()
	const player = useRef<TCPlayerIInstance>()
	const [wrapperSize, setWrapperSize] = useState({width: 0, height: 0});
	const [fit, setFit] = useState(true);
	const isMobile = isMobileDevice();

	useLayoutEffect(() => {
		const updateSize = () => {
			const width = wrapperRef.current?.offsetWidth || 0;
			const height = wrapperRef.current?.offsetHeight || 0;
			setWrapperSize({width, height});
		}
		updateSize();
		window.addEventListener('resize', updateSize);
		return () => {
			window.removeEventListener('resize', updateSize);
		};
	}, [wrapperRef]);

	useEffect(() => {
		if (player.current) return
		const multiResolutions = {
			sources: allRoutes.reduce((a, b) => ({
				...a,
				[b.route]: [{src: b.src}],
			}), {}),
			labels: allRoutes.reduce((a, b) => ({
				...a,
				[b.route]: b.label,
			}), {}),
			showOrder: allRoutes.map(({route}) => route),
			defaultRes: selectedRoute,
		}

		const controlBarOptions = isMobile ? {
			qualitySwitcherMenuButton: true,
			volumePanel: false,
			progressControl: false,
			playToggle: true,
			currentTimeDisplay: false,
			durationDisplay: false,
			fullscreenToggle: true,
			timeDivider: false,
			playbackRateMenuButton: false,
		} : {
			playbackRateMenuButton: false,
			qualitySwitcherMenuButton: true,
			volumePanel: true,
			progressControl: true,
			playToggle: true,
			currentTimeDisplay: true,
			durationDisplay: true,
			fullscreenToggle: true,
			timeDivider: true,
		};
		player.current = TCPlayer('tc-player__orca', {
			sources: allRoutes.map(({src}) => ({src})),
			poster,
			licenseUrl,
			autoplay: true,
			controls: true,
			controlBar: controlBarOptions,
			multiResolution: multiResolutions,
		})
		player.current.on("error", e => {
			if (e.data.code == 52) {
				player.current?.src(url)
			} else {
				console.warn(e.message)
			}
		})
		player.current.on('loadedmetadata', () => {
			if (!player.current) return
			if (player.current?.videoWidth() > player.current?.videoHeight()) setFit(false);
		})
		return () => {
			// todo off 解绑
			player.current && player.current.dispose()
		}
	}, [url])

	useEffect(() => {
		const videoWrapper = document.querySelector('.tc-player__orca')
		if (!videoWrapper) return
		if (fit) videoWrapper.classList.add('stream-fit')
		else videoWrapper.classList.remove('stream-fit')
	}, [fit])

	useEffect(() => {
		if (player && wrapperSize) {
			player.current?.width(wrapperSize.width)
			player.current?.height(wrapperSize.height)
		}
	}, [wrapperSize]);

	return (
		<div className={cls(className)} ref={wrapperRef}>
			<video
				id="tc-player__orca"
				className="tc-player__orca"
				width={wrapperSize?.width}
				height={wrapperSize?.height}
				preload="auto"
				webkit-playsinline="true"
				playsInline
				x5-video-player-type="h5"
			/>
		</div>
	)
}

export default OrcaTCPlayer
