const styles = {
  light: {
    label: 'text-gray-700',
    input: 'border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500',
  },
  dark: {
    label: 'text-slate-300',
    input:
      'border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:border-indigo-400 focus:bg-white/10 focus:ring-2 focus:ring-indigo-400/30',
  },
};

export default function Input({ label, variant = 'light', className = '', ...props }) {
  const s = styles[variant];
  return (
    <div className="w-full">
      {label && <label className={`mb-1.5 block text-sm font-medium ${s.label}`}>{label}</label>}
      <input className={`w-full rounded-xl px-4 py-2.5 outline-none transition ${s.input} ${className}`} {...props} />
    </div>
  );
}
