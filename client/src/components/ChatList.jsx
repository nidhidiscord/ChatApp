import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatList({ messages, myId }) {
  const boxRef = useRef(null);

  // scroll only this box (scrollIntoView would also scroll the parent panels/page)
  useEffect(() => {
    const el = boxRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <div ref={boxRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
      {messages.map((m) => (
        <MessageBubble key={m._id} message={m} mine={m.sender === myId} />
      ))}
    </div>
  );
}
