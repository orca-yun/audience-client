// https://cloud.tencent.com/document/product/266/63004
interface TCPlayerOptions {
	autoplay?: boolean
	controls?: boolean
	poster?: string
	controlBar?: {
		playToggle?: boolean
		progressControl?: boolean
		volumePanel?: boolean
		currentTimeDisplay?: boolean
		durationDisplay?: boolean
		timeDivider?: boolean
		playbackRateMenuButton?: boolean
		fullscreenToggle?: boolean
		qualitySwitcherMenuButton?: boolean
	}
	listener?: (msg: string) => void
	// ABR场景 hls自适应码率（根据网络）
	sources?: {
		src: string
		type?: string
	}[]
	webrtcConfig?: {
		// 是否渲染多清晰度的开关，默认开启，可选
		enableAbr?: boolean,
		// 模板名对应的label名，可选
		abrLabels?: Record<string, string>,
		fallbackUrl?: string
	}
	licenseUrl?: string
	// 清晰度 https://cloud.tencent.com/document/product/881/100140
	multiResolution?: {
		sources?: Record<string, { src: string }[]>
		// 配置每个清晰度标签
		labels?: Record<string, string>
		// 配置各清晰度在播放器组件上的顺序
		showOrder?: string[]
		// 配置默认选中的清晰度
		defaultRes?: string
	},
	languages: {
		"zh-cn": {
		  "No video has been loaded.": "可定义错误提示文案，如：没带防盗链检测参数，请重试",
		  "Could not download the video.": "获取视频数据超时",
		  "You aborted the media playback.": "视频数据加载过程中被中断",
		  "A network error caused the media download to fail part-way.": "由于网络问题造成加载视频失败",
		  "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.": "视频解码时发生错误",
		  "The media could not be loaded, either because the server or network failed or because the format is not supported.": "视频因格式不支持或者服务器或网络的问题无法加载",
		  "The media is encrypted and we do not have the keys to decrypt it.": "视频解密时发生错误",
		  "Request timed out.": "点播媒体数据接口请求超时",
		  "Server is not respond.": "点播媒体数据接口没有返回数据",
		  "Server respond error data.": "点播媒体数据接口返回异常数据",
		  "No video transcoding information found.": "播放器没有检测到可以在当前播放器播放的视频数据，请对该视频进行转码操作",
		  "A network error caused the media download to fail part-way.": "网络错误导致视频下载中途失败",
		  "Rise an internal exception when playing HLS.": "播放 HLS 时出现内部异常",
		  "The license has expired. Please check whether the expiration time setting is reasonable.": "license 过期，请检查过期时间设置是否合理",
		  "Other errors.": "其他错误",
		  "Server failed.": "媒体服务器错误",
		  "AppID is not exist, Please check if the AppID is correct.": "AppID 不存在，请检查 AppID 是否正确",
		  "Internal error.": "内部错误",
		}
	},
}

declare module 'tcplayer.js' {
	export type TCPlayerIInstance = {
		src: (url: string) => void
		dispose: () => void
		width: (width?: number) => void
		height: (height?: number) => void
		on(webrtcfallback: "webrtcfallback", param: (event) => void): void;
		on(error: "error", param: (event) => void): void;
		on(eventName: "canplay", param: (event) => void): void;
		on(eventName: "resolutionswitched" | 'loadedmetadata', param: (event) => void): void;
		off(eventName: string, param: () => void): void;
		videoWidth: () => number;
		videoHeight: () => number;
	}
	export default function TCPlayer(elementId: string, options: TCPlayerOptions): TCPlayerIInstance
}


