import { Commodity as CommodityType } from "@/api/types";
import React from "react";
import { Image } from "antd";
import fallback from "@/assets/fallback.png"

interface CommodityProps {
	commodity: CommodityType
	add2cart: () => void
	btnText?: string
}

const Commodity: React.FC<CommodityProps> = React.memo(({commodity, add2cart, btnText}) => (

	<div className="commodity" key={commodity.goodsLibId}>
		<div className="cover">
			<Image
				src={commodity.img}
				alt={commodity.name}
				preview={false}
				fallback={fallback}
			/>
		</div>
		<div className="description">
			<h3>{commodity.name}</h3>
			<p>
				<i>￥</i>
				<span>{commodity.price / 100}</span>
				<del>{commodity.originalPrice / 100}</del>
			</p>
		</div>
		{commodity.sellStatus === 1 && (
			<div className="purchase">
				<button onClick={add2cart}>{btnText}</button>
			</div>
		)}
		{commodity.sellStatus === 3 && (<div className="purchase">售罄</div>)}
	</div>
));

export default Commodity;
