import { useEffect, useRef, useState } from "react";
import { Button, Form, Input, message, Modal, QRCode, Flex, Divider } from "antd";
import { observer } from "mobx-react-lite";
import { useSearchParams } from "react-router-dom";
import { useStore } from "@/store";
import {
  loginLogic,
  initLoginUrl,
  initLoginKey,
} from "@/api";
import { useRequest } from "ahooks";
import { VIEW_AUTH } from "@/api/enum";
import { isWechat } from "@/utils";
function LoginPanel(props: any) {
  const {
    showLogin,
    toggleLogin,
    roomKey,
    roomInfo,
    broadcastRoom,
    setUserTokenMap,
    userTokenMap,
  } = useStore();
  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };
  const isWechatBrowser = isWechat();
  const [qrcode, setQrcode] = useState<string | undefined>("");
  let loginKey: any = useRef(null);
  const [params] = useSearchParams();
  const { data: loginResult, run: loginRightNow } = useRequest(loginLogic, {
    manual: true,
    onSuccess: (res) => {
      setUserTokenMap({
        ...userTokenMap,
        [roomInfo?.id as number]: res?.data,
      });
      toggleLogin(false);
    },
  });
  const {
    params: paramsData,
    run: getLoginKey,
    cancel: cancelGetLoginKey,
  } = useRequest(initLoginKey, {
    manual: true,
    pollingInterval: 1000, //轮询间隔，单位为毫秒。
    pollingErrorRetryCount: 3, //轮询错误重试次数。如果设置为 -1，则无限次
    pollingWhenHidden: false, //是否在页面隐藏时停止轮询。
    onSuccess: (res) => {
      if (res?.data) {
        setUserTokenMap({
          ...userTokenMap,
          [roomInfo?.id as number]: res?.data,
        });
        toggleLogin(false);
        cancelGetLoginKey();
      }
    },
  });
  const { run: getLoginCode } = useRequest(initLoginUrl, {
    manual: true,
    onSuccess: (res) => {
      const url: any = res.data;
      setQrcode(url);
      const searchParams = new URLSearchParams(url);
      const state = searchParams.get("state");
      const idList: any = state?.split("#")[0].split(",");
      loginKey = idList[idList?.length - 2];
      getLoginKey(loginKey);
      isWechatBrowser && cancelGetLoginKey();
      toggleLogin(true);
    },
  });

  const handleOk = () => {
    form
      .validateFields()
      .then((v) => {
        if (
          v.password !== roomInfo?.permission.permissionJson &&
          roomInfo?.permission.permissionType === VIEW_AUTH.AUTH_PASSWORD
        ) {
          return message.error("密码不正确！");
        }
        const { nickname } = v;
        loginRightNow(roomKey, nickname);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const toWeixinAuth = () => {
    window.location.href = qrcode as string;
  };

  useEffect(() => {
    if (broadcastRoom?.roomId) {
      const token = params.get("token");
      const auth = params.get("auth");
      if (!userTokenMap[broadcastRoom?.roomId]) {
        !(token && auth) &&
          getLoginCode(
            broadcastRoom?.roomId,
            broadcastRoom?.channelId,
            isWechatBrowser ? 2 : 1
          );
      } 
      if (token && auth) {
        setUserTokenMap({
          ...userTokenMap,
          [broadcastRoom?.roomId]: token,
        });
      }
    }
  }, [broadcastRoom?.roomId]);
  return (
    <Modal
      title={isWechatBrowser ? "微信授权" : "微信扫码"}
      style={{ textAlign: 'center'}}
      width={isWechatBrowser ? 250 : 250}
      open={showLogin}
      onOk={handleOk}
      closeIcon={false}
      centered
      footer={null}
    >
      {!isWechatBrowser && <QRCode size={200} value={qrcode || "-"} />}

      {isWechatBrowser && (
        <Flex align="center" justify="center" vertical>
          <div>我们申请获取您的</div>
          <div>公开信息（昵称、头像等）</div>
          <Divider dashed />
          <Button type="primary" onClick={toWeixinAuth}>
          授权登陆
          </Button>
        </Flex>
      )}
      {/* <Form
				{...formItemLayout}
				form={form}
			>
				<Form.Item
					name="nickname"
					className="mt-20"
					label="用户名"
					rules={[{required: true, message: '请输入用户名'}]}
				>
					<Input placeholder="请输入用户名" maxLength={10}/>
				</Form.Item>
				{
					roomInfo?.permission.permissionType === VIEW_AUTH.AUTH_PASSWORD && (
						<Form.Item
							name="password"
							className="mt-8"
							label="房间密码"
							rules={[{required: true, message: '请输入房间密码'}]}
						>
							<Input placeholder="请输入密码" maxLength={10}/>
						</Form.Item>
					)
				}
				<div style={{height: 60}}></div>
			</Form> */}
    </Modal>
  );
}

export default observer(LoginPanel);
