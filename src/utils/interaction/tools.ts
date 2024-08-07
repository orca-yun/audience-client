import { message } from "antd";
import { InternalAxiosRequestConfig } from "axios";
import { store } from "@/store";

export const handleChangeRequestHeader = (config: InternalAxiosRequestConfig<any>) => {
	config.headers["content-type"] = "application/json;charset=utf-8";
	return config;
};

export const handleConfigureAuth = (config: InternalAxiosRequestConfig<any>) => {
	config.headers["Authorization"] = store.getCurrentToken()
	return config;
};

export const handleNetworkError = (errorResponse: any): void => {
	const networkErrMap: any = {
		"400": "错误的请求",
		"401": "未授权，请重新登录",
		"403": "拒绝访问",
		"404": "请求错误，未找到该资源",
		"405": "请求方法未允许",
		"408": "请求超时",
		"500": "服务器端出错",
		"501": "网络未实现",
		"502": "网络错误",
		"503": "服务不可用",
		"504": "网络超时",
		"505": "http版本不支持该请求",
	};
	const {status: errStatus} = errorResponse
	if (errorResponse.status) {
		if (errStatus == 401) {
			delete store.userTokenMap[store.roomInfo?.id as number]
			store.toggleLogin(true)
		}
		message.error(errorResponse.data.msg ? errorResponse.data.msg : networkErrMap[errStatus]);
		return;
	}

	message.error("无法连接到服务器！");
};

export const handleAuthError = (errno: string): boolean => {
	const authErrMap: any = {
		"401": "请重新登录",
	};
	if (authErrMap.hasOwnProperty(errno)) {
		console.log("handleAuthError -> error", errno);
		message.error(authErrMap[errno]);
		store.logout()
		return false;
	}

	return true;
};

export const handleGeneralError = (errno: string, errmsg: string): boolean => {
	// if (errno !== "0") {
	// 	message.error(errmsg);
	// 	return false;
	// }

	return true;
};