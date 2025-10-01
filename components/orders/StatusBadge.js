export default function StatusBadge({ isSuccess, text }) {
  return (
    <span
      className={`inline-block text-white text-xs font-semibold px-3 py-1 rounded-full ${
        isSuccess ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {text}
    </span>
  );
}
