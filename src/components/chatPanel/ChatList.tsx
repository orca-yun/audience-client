import React, { useEffect, useRef } from 'react';
import ChatItem from "@/components/chatPanel/ChatItem";
import { observer } from "mobx-react-lite";
import { Message } from "@/api/types";

import { useStore } from "@/store";

interface ChatListProps {
	chatList: Message[]
}

const ChatList: React.FC<ChatListProps> = ({chatList}) => {
  const { notice } = useStore()
	const chatPanelLine = useRef<HTMLDivElement>(null);

	function scrollToBottom() {
		if (chatPanelLine?.current) {
			chatPanelLine?.current.scrollIntoView();
		}
	}

	useEffect(scrollToBottom, [chatList]);

	return (
		<div className="chat-list">
			<div className="warning-title">
        {notice}
			</div>
			{chatList.map(item => <ChatItem messageItem={item} key={item.uuid}/>)}
			<div ref={chatPanelLine}></div>
		</div>
	);
}

export default observer(ChatList);
