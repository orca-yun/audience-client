import axios from "axios";
import { ResponseModel } from "@/api/types";
import {
	handleChangeRequestHeader,
	handleConfigureAuth,
	handleAuthError,
	handleGeneralError,
	handleNetworkError,
} from "./tools";

type Fn = (data: ResponseModel<any>) => unknown;

interface IAnyObj {
	[index: string]: unknown;
}


const _axios = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	timeout: 60000,
	headers: {'Content-Type': 'application/json;charset=utf-8'},
})

_axios.interceptors.request.use((config) => {
	config = handleChangeRequestHeader(config);
	config = handleConfigureAuth(config);
	return config;
});

_axios.interceptors.response.use(
	(response) => {
		if (response.status !== 200) return Promise.reject(response.data);
		handleAuthError(response.data.code);
		handleGeneralError(response.data.code, response.data.msg);
		return response;
	},
	(err) => {
		handleNetworkError(err.response);
		return Promise.reject(err.response);
	}
);

export const Get = <T, >(
	url: string,
	params: IAnyObj = {},
	clearFn?: Fn
): Promise<ResponseModel<T>> =>
	new Promise((resolve, reject) => {
		_axios
			.get(url, {params})
			.then((result) => {
				let res: ResponseModel<T>;
				if (clearFn !== undefined) {
					res = clearFn(result.data) as unknown as ResponseModel<T>;
				} else {
					res = result.data as ResponseModel<T>;
				}
				resolve(res as ResponseModel<T>);
			})
			.catch((err) => {
				reject(err);
			});
	});

export const Post = <T, >(
	url: string,
	data: IAnyObj,
	params: IAnyObj = {}
): Promise<ResponseModel<T>> => {
	return new Promise((resolve) => {
		_axios
			.post(url, data, {params})
			.then((result) => {
				resolve(result.data as ResponseModel<T>);
			})
			.catch((err) => {
				resolve(err);
			});
	});
};