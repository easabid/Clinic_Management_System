export default function Badge({ label, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border border-gray-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${variants[variant] || variants.default} ${className}`}
    >
      {label}
    </span>
  );
}