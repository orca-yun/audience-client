import IconFont from "@/components/Iconfont";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useRequest } from "ahooks";
import { initPay, mineOrder, queryPay, cancelOrder } from "@/api";
import { IOrder } from "@/api/types";
import { Empty, Image, message, Card } from "antd";
import fallback from "@/assets/fallback.png";
import QrcodePanel from "@/components/QrcodePanel";
import { isMobileDevice, isWechat } from "@/utils";
import dayjs from "dayjs";

interface OrderProps {
	show: boolean;
	visibleHandler: (visible: boolean) => void;
}


const OrderPanel: React.FC<OrderProps> = observer(
	({show, visibleHandler}) => {
		const [showQrcode, setShowQrcode] = useState(false);
		const [qrcode, setQrcode] = useState<string | undefined>("");
		const {data: orderList, run, loading, refresh} = useRequest(mineOrder, {
			manual: true
		})
		//
		const isWechatBrowser = isWechat();
		const isMobile = isMobileDevice();

		const {run: getPayInfo} = useRequest(initPay, {
			manual: true,
			onSuccess: (result: any, params) => {
				if (result?.data.payInfo) {
					setQrcode(result?.data.payInfo);
					queryPayStatus(result?.data.orderNo);
					if (isMobile && isWechatBrowser) {
						window.location.href = result?.data.payInfo;
					} else {
						setShowQrcode(true);
					}
				}
			},
		});

		const {run: queryPayStatus, cancel: cancelPayStatus} = useRequest(
			queryPay,
			{
				manual: true,
				pollingInterval: 1000, //轮询间隔，单位为毫秒。
				pollingErrorRetryCount: 3, //轮询错误重试次数。如果设置为 -1，则无限次
				pollingWhenHidden: false, //是否在页面隐藏时停止轮询。
				onSuccess: (result: any, params) => {
					if (result?.data) {
						cancelPayStatus();
						setShowQrcode(false);
						message.success("支付成功");
						// 支付完成后刷新列表
						refresh();
					}
				},
			}
		);

		const {run: cancelOrderInfo} = useRequest(cancelOrder, {
			manual: true,
			onSuccess: (result: any, params) => {
				if (result.code === 200) {
					refresh()
				}
			},
		})

		const payRightNow = (order_id: number) => {
			getPayInfo(order_id, 2, isMobile && isWechatBrowser ? 1 : 2);
		};

		const cancelRightNow = (order_id: number) => {
			cancelOrderInfo(order_id);
		};

		useEffect(() => {
			if (show) run()
		}, [show]);

		const nodeRef = useRef(null);
		const cardBody = { "padding": 0 }
		return (
			<>
				<CSSTransition
					nodeRef={nodeRef}
					classNames="fade-up"
					in={show}
					timeout={300}
					unmountOnExit={true}
				>
					<div className="commodity-wrap" ref={nodeRef}>
						<div className="commodity-title">
							<h3>我的订单</h3>
							<div className="close-btn" onClick={() => visibleHandler(false)}>
								<IconFont type="dolphin-close"/>
							</div>
						</div>
						{orderList?.data.length ? (
							<Card
								className="commodity-list"
								loading={loading}
								bordered={false}
								styles={{body: cardBody}}>
								{orderList?.data.map((order: IOrder) => (
									<div className="commodity mb-10">
										<div className="cover">
											<Image
												src={order.goodsImage}
												alt={order.goodsName}
												preview={false}
												fallback={fallback}
											/>
										</div>
										<div className="desc">
											<h3>{order.goodsName}</h3>
											<p>订单号：{order.orderNo}</p>
											<p>购买人：{order.recipientName}&nbsp;&nbsp;{order.recipientPhone}</p>
											<p>价格：{order.realAmt / 100}元</p>
										</div>
										{(order.orderStatus === 2) && (
											<div className="pay-btn">
												<a>已支付</a>
											</div>
										)}
										{(order.orderStatus === 1 && dayjs().isBefore(order.timeoutTime)) && (
											<div className="pay-btn">
												<a onClick={() => cancelRightNow(order.id)}>取消订单</a>
												<button onClick={() => payRightNow(order.id)}>立即支付</button>
											</div>
										)}
										{(order.orderStatus === 1 && !dayjs().isBefore(order.timeoutTime)) && (
											<div className="pay-btn">
												<button disabled={true}>订单超时</button>
											</div>
										)}
									</div>
								))}
							</Card>
						) : (
							<div className="p-20">
								<Empty description="暂无订单"/>
							</div>
						)}
					</div>
				</CSSTransition>
				<QrcodePanel
					visible={showQrcode}
					hideModal={() => {
						setShowQrcode(false);
						cancelPayStatus();
					}}
					url={qrcode}
				/>
			</>
		);
	}
);

export default OrderPanel;
