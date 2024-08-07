import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './style/index.less'
import { ConfigProvider, theme } from "antd";
import zhCN from "antd/es/locale/zh_CN"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<ConfigProvider
		locale={zhCN}
		autoInsertSpaceInButton={false}
		theme={{
			// algorithm: theme.darkAlgorithm,
			token: {
				colorPrimary: "#108ee9"
			},
			components: {
				Tabs: {
					horizontalItemPadding: "12px 8px",
					horizontalMargin: "0",
					cardBg: "rgba(255, 255, 255, 1)"
				}
			},
		}}
	>
		<App/>
	</ConfigProvider>
)
