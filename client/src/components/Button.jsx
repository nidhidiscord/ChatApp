const variants = {
  light: 'bg-indigo-600 hover:bg-indigo-700 rounded-lg',
  dark: 'rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/25 hover:from-indigo-400 hover:to-violet-400',
};

export default function Button({ children, loading, variant = 'light', className = '', ...props }) {
  return (
    <button
      disabled={loading || props.disabled}
      className={`px-4 py-2.5 font-medium text-white transition disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
}
