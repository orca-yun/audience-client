import IconFont from "@/components/Iconfont";
import { message, Empty } from "antd";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import React, { useRef, useState } from "react";
import Commodity from "@/components/chatPanel/Commodity";
import { CSSTransition } from "react-transition-group";
import { useRequest } from "ahooks";
import { isWechat, isMobileDevice } from "@/utils";
import { createdOrder, initPay, queryPay, queryUserAddress } from "@/api";
import QrcodePanel from "@/components/QrcodePanel";
import RecipientsPanel from "@/components/RecipientsPanel";
import { Commodity as ICommodity } from "@/api/types";

interface CommodityListProps {
  show: boolean;
  visibleHandler: (visible: boolean) => void;
}
interface GoodsInfo {
  roomId: string;
  id: string;
  price: any;
  originalPrice: any;
  goodType: string;
}
const CommodityPanel: React.FC<CommodityListProps> = observer(
  ({ show, visibleHandler }) => {
    const { roomInfo, broadcastRoom, commodityList } = useStore();
    const [showQrcode, setShowQrcode] = useState(false);
    const [showRecipients, setShowRecipients] = useState(false);
    const [qrcode, setQrcode] = useState<string | undefined>("");
    const [goodsInfo, setGoodsInfo] = useState<GoodsInfo>({
      roomId: "",
      id: "",
      price: "",
      originalPrice: "",
      goodType: "",
    });
    let RecipientsPanelRef: any = useRef(null);
    const isWechatBrowser = isWechat();
    const isMobile = isMobileDevice();
    const { run: getOrderInfo } = useRequest(createdOrder, {
      manual: true,
      onSuccess: (result: any, params) => {
        if (result?.code == 200) {
          getPayInfo(result.data, 2, isMobile && isWechatBrowser ? 1 : 2);
        } else {
          console.log("2 empty", result?.code)
        }
        
      },
    });

    const { run: getPayInfo } = useRequest(initPay, {
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
    const { run: getLastAddressInfo } = useRequest(queryUserAddress, {
      manual: true,
      onSuccess: (result: any) => {
        setShowRecipients(true);
        if (RecipientsPanelRef.current) {
          RecipientsPanelRef.current.setFieldsValue(result.data);
        }
      },
    });
    const { run: queryPayStatus, cancel: cancelPayStatus } = useRequest(
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
          }
        },
      }
    );
    const add2cart = (commodity: undefined | any) => {
      setGoodsInfo(commodity);
      getLastAddressInfo();
    };

    const getFieldsValue = (data: any) => {
      setShowRecipients(false);
      const [recipientProvince, recipientCity, recipientCountry] =
        data.recipientArea || [];
      if (goodsInfo) {
        getOrderInfo({
          goodsId: goodsInfo.id,
          coupon: "",
          recipientName: data.recipientName,
          recipientPhone: data.recipientPhone,
          recipientProvince: recipientProvince,
          recipientCity: recipientCity,
          recipientCountry: recipientCountry,
          recipientAddress: data.recipientAddress,
        });
      }
    };
    const nodeRef = useRef(null);
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
              <h3>商品橱窗</h3>
              <div className="close-btn" onClick={() => visibleHandler(false)}>
                <IconFont type="dolphin-close" />
              </div>
            </div>
            {commodityList.length ? (
              <div className="commodity-list">
                {commodityList.map((commodity: ICommodity) => (
                  <Commodity
                    btnText="立即购买"
                    key={commodity.id}
                    commodity={commodity}
                    add2cart={() => add2cart(commodity)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-20">
                <Empty description="暂无商品" />
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
        <RecipientsPanel
          ref={RecipientsPanelRef}
          visible={showRecipients}
          goodType={goodsInfo.goodType}
          hideModal={() => {
            setShowRecipients(false);
          }}
          getFieldsValue={(data: any) => {
            getFieldsValue(data);
          }}
          url={qrcode}
        />
      </>
    );
  }
);

export default CommodityPanel;
