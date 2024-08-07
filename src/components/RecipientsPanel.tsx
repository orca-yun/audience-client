import { Button, Form, Input, Modal, Cascader, Space, Alert } from "antd";
import { cityArray } from "@/utils/cityData";
import React, { forwardRef, useImperativeHandle } from "react";
function RecipientsPanel(props: any, ref: any) {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const { visible, hideModal, goodType, getFieldsValue } = props;
  const handleOk = () => {
    form
      .validateFields()
      .then((v) => {
        getFieldsValue(v);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useImperativeHandle(ref, () => {
    return {
      setFieldsValue: setFieldsValue,
    };
  });
  function setFieldsValue(data: any) {
    form.setFieldsValue({
      recipientName: data?.recipientName || "",
      recipientPhone: data?.recipientPhone || "",
      recipientArea:
        data?.recipientProvince && data?.recipientCity && data?.recipientCountry
          ? [
              data?.recipientProvince,
              data?.recipientCity,
              data?.recipientCountry,
            ]
          : [],
      recipientAddress: data?.recipientAddress || "",
    });
  }
  return (
    <Modal
      title="收件人信息"
      width={520}
      open={visible}
      onOk={handleOk}
      closeIcon={false}
      centered
      footer={null}
    >
      <Form {...formItemLayout} form={form} autoComplete="off">
        <Alert message="请填写/核实信息，务必保证信息填写完整准确" />
        <Form.Item
          name="recipientName"
          className="mt-20"
          label="收件人"
          rules={[{ required: true, message: "请输入收件人" }]}
        >
          <Input placeholder="请输入收件人" />
        </Form.Item>
        <Form.Item
          name="recipientPhone"
          className="mt-20"
          label="手机号"
          rules={[
            () => ({
              required: true,
              validator(_, value) {
                const regexp =
                  /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/;
                if (!value) {
                  return Promise.reject(new Error("请输入手机号码"));
                }
                if (!regexp.test(value)) {
                  return Promise.reject(new Error("请输入正确的手机号码"));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>
        {goodType == 2 && (
          <Form.Item
            name="recipientArea"
            className="mt-20"
            label="所在地区"
            rules={[{ required: true, message: "请选择所在地区" }]}
          >
            <Cascader options={cityArray} placeholder="请选择所在地区" />
          </Form.Item>
        )}
        {goodType == 2 && (
          <Form.Item
            name="recipientAddress"
            className="mt-20"
            label="详细地址"
            rules={[{ required: true, message: "请输入详细地址" }]}
          >
            <TextArea rows={4} placeholder="小区、写字楼、门牌号等" />
          </Form.Item>
        )}
        <Form.Item className="mt-20 mb-0" {...tailLayout}>
          <Space>
            <Button htmlType="button" onClick={hideModal}>
              取消
            </Button>
            <Button type="primary" onClick={handleOk}>
              确认支付
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default forwardRef(RecipientsPanel);
