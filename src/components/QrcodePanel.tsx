import { QRCode, Modal } from "antd";
import React from "react";

interface QrcodePanelProps {
	visible: boolean
	hideModal: () => void
	url?: string
}

const QrcodePanel: React.FC<QrcodePanelProps> = ({url, visible, hideModal}) => (
	<Modal
		title="请用微信扫码支付"
		onCancel={hideModal}
		open={visible}
		width={300}
		footer={null}
		centered>
		<div className="qrcode">
		<QRCode size={250} value={url || '-'} />
		</div>
	</Modal>
)
export default QrcodePanel;