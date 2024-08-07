import { Popover, Dropdown, Space } from "antd";
import type { MenuProps } from "antd"
import { DownOutlined } from '@ant-design/icons';
import { IStreamTypeEnum } from "@/api/enum";
import { useState, useEffect } from "react";
import { PlayRoutesOptions } from "@/components/LivePlayer";

interface SwitchRouteProps {
	allRoutes?: Array<{ label: string; route: IStreamTypeEnum; src: string }>
	url?: string
	selectedRoute: IStreamTypeEnum
	changeRoute: (url: string) => void
}

const getLabel = (route: IStreamTypeEnum) => {
	return PlayRoutesOptions.filter(item => item.value === route)[0].label
}

function SwitchRoute({allRoutes, selectedRoute, changeRoute}: SwitchRouteProps) {
	const [items, setItems] = useState<MenuProps['items']>([]);
	const [currentLabel, setCurrentLabel] = useState("")


	useEffect(() => {
		if (allRoutes && Array.isArray(allRoutes) && allRoutes.length > 0) {
			const newItems = allRoutes?.map((item) => (
				{
					key: item.route,
					label: item.label,
					route: item.src,
				}
			));
			setItems(newItems);
			setCurrentLabel(getLabel(selectedRoute))
		}
	}, [allRoutes, selectedRoute]);

	const onChangeRoute: MenuProps['onClick'] = (menuItem) => {
		setCurrentLabel(getLabel(menuItem.key as IStreamTypeEnum))
		// @ts-ignore
		changeRoute(menuItem.item?.props.route)
	};

	return (
		<Dropdown
			className="route-switch"
			menu={{
				items,
				onClick: onChangeRoute,
				selectable: true,
				defaultSelectedKeys: [selectedRoute],
			}}
		>
			<Space>
				{currentLabel}
				<DownOutlined/>
			</Space>
		</Dropdown>
	);
}

export default SwitchRoute;