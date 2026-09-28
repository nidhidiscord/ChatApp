export default function Avatar({ email = '', size = 'h-10 w-10' }) {
  return (
    <div className={`${size} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 font-semibold uppercase text-white shadow-lg shadow-indigo-500/20`}>
      {email[0] || '?'}
    </div>
  );
}
