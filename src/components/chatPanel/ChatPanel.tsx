import React, {
  useRef,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import ChatToolBar from "@/components/chatPanel/ChatToolBar";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { Message } from "@/api/types";
import IconFont from "@/components/Iconfont";
import { Image, Tabs, message } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { CSSTransition } from "react-transition-group";
import CommodityPanel from "@/components/chatPanel/CommodityPanel";
import GiftPanel from "@/components/chatPanel/GiftPanel";
import OrderPanel from "@/components/chatPanel/OrderPanel";
import QrcodePanel from "@/components/QrcodePanel";
import ChatList from "@/components/chatPanel/ChatList";
import WhiteBoardFeedback from "@/components/WhiteBoardFeedback";
import CoursePanel from "@/components/chatPanel/CoursePanel";
import { isWechat, isMobileDevice } from "@/utils";
import { PHONE_LAYOUT } from "@/api/enum";
import fallback from "@/assets/fallback.png";
import { useRequest } from "ahooks";
import { createdOrder, initPay, queryPay, queryUserAddress } from "@/api";
import RecipientsPanel from "@/components/RecipientsPanel";

interface ChatPanelProps {
  chatList: Message[];
  imSocket: any;
  children?: ReactNode;
}

interface ITab {
  label: string;
  key: string;
  children: ReactNode | null;
}
interface GoodsInfo {
  roomId: string;
  id: string;
  price: any;
  originalPrice: any;
  goodType: string;
}
const ChatPanel: React.FC<ChatPanelProps> = ({
  chatList,
  imSocket,
  children,
}) => {
  const {
    setRecommendCommodity,
    recommendCommodity,
    roomInfo,
    broadcastRoom,
  } = useStore();
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
  const [showCommodity, setShowCommodity] = useState(false);
  const [showCourse, setShowCourse] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [showQrcode, setShowQrcode] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const { run: getOrderInfo } = useRequest(createdOrder, {
    manual: true,
    onSuccess: (result: any, params) => {
      if (result?.code == 200) {
        getPayInfo(result.data, 2, isMobile && isWechatBrowser ? 1 : 2);
      } else {
        console.log("1 empty", result?.code)
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
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let hasRecommend = Boolean(recommendCommodity);
    if (hasRecommend) {
      timeout = setTimeout(() => {
        setRecommendCommodity(null);
        timeout && clearTimeout(timeout);
      }, 15 * 1000);
    }
    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [recommendCommodity]);
  const toggleWhiteboard = () => {
    setShowWhiteboard(!showWhiteboard);
  };

  const isRenderWhiteBoard = useMemo(() => {
    return (
      roomInfo?.page.showDraw &&
      isMobileDevice() &&
      Number(roomInfo.page.mobileLayout) !== PHONE_LAYOUT.THREE
    );
  }, [roomInfo]);
  const nodeRef = useRef(null);

  return (
    <>
      <div className="chat-panel">
        <div className="chat-panel__title">
          <span className="active">互动聊天</span>
        </div>
        {imSocket && (
          <>
            <ChatList chatList={chatList} />
            <ChatToolBar
              imSocket={imSocket}
              showCoursePanel={() => setShowCourse(true)}
              showCommodityPanel={() => setShowCommodity(true)}
              showGiftPanel={() => setShowGift(true)}
              showOrderPanel={() => setShowOrder(true)}
            />
          </>
        )}
        {children}
        {
          <CSSTransition
            appear={true}
            in={Boolean(recommendCommodity)}
            timeout={300}
            classNames="fade-left"
            nodeRef={nodeRef}
            unmountOnExit={false}
          >
            <div className="recommend" ref={nodeRef}>
              <CloseCircleOutlined
                className="close-recommend"
                onClick={() => setRecommendCommodity(null)}
              />
              <div className="cover">
                <Image
                  src={recommendCommodity?.img || ""}
                  alt={recommendCommodity?.name}
                  preview={false}
                  fallback={fallback}
                />
              </div>
              <div className="desc">
                <div className="name">{recommendCommodity?.name}</div>
                <div className="purchase-btn" onClick={() => add2cart(recommendCommodity)}>
                  <span>
                    <i>￥</i>
                    {(recommendCommodity?.price || 0) / 100}
                  </span>
                  <button
                    type="button"
                  >
                    {roomInfo?.goods.btnTxt || "抢"}
                  </button>
                </div>
              </div>
            </div>
          </CSSTransition>
        }
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
        <CommodityPanel
          show={showCommodity}
          visibleHandler={setShowCommodity}
        />
        <OrderPanel
          show={showOrder}
          visibleHandler={setShowOrder}
        />
        <GiftPanel show={showGift} visibleHandler={setShowGift} />
        <CoursePanel show={showCourse} visibleHandler={setShowCourse} />
        {isRenderWhiteBoard ? (
          <div className="whiteboard-btn" onClick={toggleWhiteboard}>
            <IconFont type="dolphin-whiteboard" />
          </div>
        ) : (
          ""
        )}
      </div>
      {isRenderWhiteBoard ? (
        <div
          className={`mobile-whiteboard-wrap ${
            showWhiteboard ? "show" : "hide"
          }`}
        >
          <WhiteBoardFeedback />
        </div>
      ) : null}
    </>
  );
};

export default observer(ChatPanel);
