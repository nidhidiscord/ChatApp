import UserItem from './UserItem';

export default function UserList({ users, selectedId, onSelect }) {
  if (!users.length) return <p className="p-4 text-sm text-slate-400">No other users yet.</p>;
  return (
    <div className="flex-1 space-y-1 overflow-y-auto p-2">
      {users.map((u) => (
        <UserItem key={u._id} user={u} active={u._id === selectedId} onClick={() => onSelect(u)} />
      ))}
    </div>
  );
}
