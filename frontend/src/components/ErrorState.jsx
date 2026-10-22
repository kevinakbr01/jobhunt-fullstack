export function ErrorState({
  title = "Terjadi Kesalahan",
  message = "Gagal memuat data dari server.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-[#141416] border border-rose-500/20 max-w-lg mx-auto my-6">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400 text-2xl shadow-lg shadow-rose-500/5">
        <i className="fa-solid fa-triangle-exclamation" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-[#F5F5F5] mb-2">{title}</h3>
      <p className="text-sm text-[#B3B3BB] max-w-sm mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B1B1F] hover:bg-[#2A2A2E] text-sm font-medium text-[#F5F5F5] border border-[#2A2A2E] transition-all"
        >
          <i className="fa-solid fa-rotate-right text-xs" />
          Coba Lagi
        </button>
      )}
    </div>
  );
}

export default ErrorState;
