import { Course } from "@/api/types";
import React, { useRef, useState } from "react";
import { Button, Empty, Image } from "antd";
import { useStore } from "@/store";
import { CSSTransition } from "react-transition-group";
import IconFont from "@/components/Iconfont";
import { observer } from "mobx-react-lite";

interface CoursePanelProps {
	show: boolean;
	visibleHandler: (visible: boolean) => void;
}

const CoursePanel: React.FC<CoursePanelProps> = ({show, visibleHandler}) => {
	const {roomInfo} = useStore()
	const [imageList, setImageList] = useState<string[]>([])
	const [previewVisible, setPreviewVisible] = useState(false);

	const showDetail = (images: string[]) => {
		setImageList(images)
		setPreviewVisible(true);
	}
	const hidePreview = () => {
		setPreviewVisible(false);
		setImageList([])
	}
	const nodeRef = useRef(null)
	return (
		<>
			<CSSTransition
				nodeRef={nodeRef}
				classNames="fade-up"
				in={show}
				timeout={300}
				unmountOnExit={true}>
				<div className="commodity-wrap" ref={nodeRef}>
					<div className="commodity-title">
						<h3>课件列表</h3>
						<div className="close-btn" onClick={() => visibleHandler(false)}>
							<IconFont type="dolphin-close"/>
						</div>
					</div>
					{
						roomInfo?.coursewares.length ? (
							<div className="course-list">
								<ul>
									{
										roomInfo?.coursewares.map((course: Course) => (
											<li key={course.id}>
												<h3>{course.name}</h3>
												<Button size="small" type="primary" onClick={() => showDetail(course.images)}>查看</Button>
											</li>
										))
									}
								</ul>
							</div>
						) : <div className="p-20"><Empty description="暂无课件"/></div>
					}
				</div>
			</CSSTransition>
			<Image.PreviewGroup
				preview={{
					getContainer: document.body,
					visible: previewVisible,
					onVisibleChange: hidePreview
				}}
				items={imageList}>
			</Image.PreviewGroup>
		</>
	)
};

export default observer(CoursePanel);
