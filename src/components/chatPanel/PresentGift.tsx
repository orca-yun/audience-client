import React, { useEffect, useRef } from 'react';
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";

const PresentGift = () => {
	const {setSendGift, gift} = useStore()
	const giftRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (gift && giftRef.current) {
			giftRef.current.classList.add("show")
			setTimeout(() => {
				giftRef.current?.classList.remove("show")
				setSendGift(null)
			}, 3000)
		}
	}, [gift]);

	return (
		<div ref={giftRef} className="gift-jelly">
			{gift && <img src={gift?.img} alt=""/>}
		</div>
	);
}

export default observer(PresentGift);