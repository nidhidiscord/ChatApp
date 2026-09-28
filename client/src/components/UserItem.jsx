import Avatar from './Avatar';

export default function UserItem({ user, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
        active ? 'border-indigo-400/40 bg-indigo-500/20' : 'border-transparent hover:bg-white/5'
      }`}
    >
      <Avatar email={user.email} />
      <span className="truncate text-sm font-medium text-slate-200">{user.email}</span>
      {user.unreadCount > 0 && (
        <span className="ml-auto rounded-full bg-indigo-500 px-2 py-0.5 text-xs font-semibold text-white">{user.unreadCount}</span>
      )}
    </div>
  );
}
