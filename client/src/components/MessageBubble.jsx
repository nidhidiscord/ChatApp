export default function MessageBubble({ message, mine }) {
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] px-4 py-2 text-sm ${
          mine
            ? 'rounded-2xl rounded-br-md bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/20'
            : 'rounded-2xl rounded-bl-md border border-white/10 bg-white/10 text-slate-100'
        }`}
      >
        {message.image && <img src={message.image} alt="" className="mb-1 max-h-60 rounded-xl" />}
        {message.text && <p className="whitespace-pre-wrap break-words">{message.text}</p>}
        <span className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${mine ? 'text-indigo-100/70' : 'text-slate-400'}`}>
          {time}
          {mine && (
            <span className={message.read ? 'font-bold text-sky-300' : ''} title={message.read ? 'Read' : 'Sent'}>
              {message.read ? '✓✓' : '✓'}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
