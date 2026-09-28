import { useMemo } from 'react';
import Avatar from './Avatar';
import ChatList from './ChatList';
import ChatInput from './ChatInput';

export default function ChatWindow({ selectedUser, messages, myId, onSend, onBack }) {
  // random image shown until a user is selected (desktop only)
  const randomImg = useMemo(() => `https://picsum.photos/seed/${Math.random().toString(36).slice(2)}/900/600`, []);

  if (!selectedUser) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-6">
        <img src={randomImg} alt="random" className="max-h-[60%] rounded-2xl border border-white/10 object-cover shadow-2xl" />
        <p className="text-slate-400">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-white/5 px-3 py-3 lg:px-4">
        {/* back button: mobile & tablet only */}
        <button
          onClick={onBack}
          aria-label="Back"
          className="rounded-lg px-2 py-1 text-xl text-white transition hover:bg-white/10 lg:hidden"
        >
          ←
        </button>
        <Avatar email={selectedUser.email} />
        <span className="truncate font-medium text-white">{selectedUser.email}</span>
      </div>
      <ChatList messages={messages} myId={myId} />
      <ChatInput onSend={onSend} />
    </div>
  );
}
