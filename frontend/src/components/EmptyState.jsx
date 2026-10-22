export function EmptyState({
  icon = "fa-solid fa-magnifying-glass",
  title = "Tidak Ada Data",
  description = "Belum ada informasi yang dapat ditampilkan saat ini.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-14 text-center rounded-2xl bg-[#141416] border border-[#2A2A2E] max-w-lg mx-auto my-6">
      <div className="w-16 h-16 rounded-2xl bg-[#1B1B1F] border border-[#2A2A2E] flex items-center justify-center mb-4 text-[#7E7E8A] text-2xl">
        <i className={icon} />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-[#F5F5F5] mb-2">{title}</h3>
      <p className="text-sm text-[#B3B3BB] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF7A1A] hover:bg-[#E6690E] text-sm font-semibold text-[#0B0B0C] shadow-lg shadow-[#FF7A1A]/20 transition-all cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
