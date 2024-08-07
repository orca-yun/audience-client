import io from 'socket.io-client'
import { store } from "@/store";

export const initSocket = () => {
	const url = import.meta.env.VITE_IM_URL
	const token = store.getCurrentToken()
	return io(`${url}/im`, {
			query: {token},
			autoConnect: false,
			transports: ["websocket"]
		}
	)
}
