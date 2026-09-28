import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import {
  fetchUsers, fetchMessages, selectUser, addMessage,
  incrementUnread, clearUnread, markMessagesRead, resetChat,
} from '../store/chatSlice';
import { socket, connectSocket, disconnectSocket } from '../api/socket';
import UserList from '../components/UserList';
import ChatWindow from '../components/ChatWindow';
import Avatar from '../components/Avatar';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((s) => s.auth);
  const { users, selectedUser, messages } = useSelector((s) => s.chat);

  // connect socket + load users once
  useEffect(() => {
    connectSocket(token);
    dispatch(fetchUsers());
    return () => disconnectSocket();
  }, [dispatch, token]);

  // realtime: new messages + read receipts
  useEffect(() => {
    const onReceive = (msg) => {
      const isMine = msg.sender === user._id;
      const otherId = isMine ? msg.receiver : msg.sender;

      if (selectedUser?._id === otherId) {
        dispatch(addMessage(msg));
        if (!isMine) socket.emit('mark_read', { from: otherId }); // chat is open -> read instantly
      } else if (!isMine) {
        dispatch(incrementUnread(otherId)); // chat not open -> unread badge
      }
    };
    const onRead = ({ reader }) => dispatch(markMessagesRead(reader)); // they read my messages -> blue ticks

    socket.on('receive_message', onReceive);
    socket.on('messages_read', onRead);
    return () => {
      socket.off('receive_message', onReceive);
      socket.off('messages_read', onRead);
    };
  }, [selectedUser, user, dispatch]);

  const handleSelect = (u) => {
    dispatch(selectUser(u));
    dispatch(fetchMessages(u._id)); // previous chat
    dispatch(clearUnread(u._id));
    socket.emit('mark_read', { from: u._id }); // mark their messages as read
  };

  const handleSend = ({ text, image }) => socket.emit('send_message', { to: selectedUser._id, text, image });

  const handleLogout = () => { dispatch(resetChat()); dispatch(logout()); };

  return (
    <div className="relative flex h-dvh gap-3 overflow-hidden bg-slate-950 p-2 lg:p-3">
      {/* glowing background orbs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />

      {/* sidebar */}
      <aside
        className={`relative min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl lg:flex lg:w-80 ${
          selectedUser ? 'hidden' : 'flex'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 p-4">
          <Avatar email={user?.email} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{user?.email}</p>
            <p className="text-xs text-slate-400">Online</p>
          </div>
          <button onClick={handleLogout} className="rounded-lg px-2 py-1 text-xs text-red-300 transition hover:bg-red-500/10">
            Logout
          </button>
        </div>
        <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Users</p>
        <UserList users={users} selectedId={selectedUser?._id} onSelect={handleSelect} />
      </aside>

      {/* chat panel */}
      <main
        className={`relative min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl lg:flex ${
          selectedUser ? 'flex' : 'hidden'
        }`}
      >
        <ChatWindow selectedUser={selectedUser} messages={messages} myId={user?._id} onSend={handleSend} onBack={() => dispatch(selectUser(null))} />
      </main>
    </div>
  );
}
