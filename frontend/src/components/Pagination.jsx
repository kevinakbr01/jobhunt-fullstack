export function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  // Membuat deretan nomor halaman
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <nav
      className="flex items-center justify-center gap-1.5 sm:gap-2 mt-8 select-none"
      aria-label="Navigasi Halaman"
    >
      {/* Tombol Sebelumnya */}
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3.5 py-2 rounded-xl border border-[#2A2A2E] bg-[#141416] text-xs sm:text-sm font-medium text-[#F5F5F5] hover:bg-[#1B1B1F] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
        aria-label="Halaman Sebelumnya"
      >
        <i className="fa-solid fa-chevron-left text-xs" />
        <span className="hidden sm:inline">Sebelumnya</span>
      </button>

      {/* Angka Halaman */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((item, idx) => {
          if (item === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-8 sm:w-10 text-center text-xs text-[#7E7E8A]"
              >
                ...
              </span>
            );
          }

          const isActive = item === page;
          return (
            <button
              key={`page-${item}`}
              type="button"
              onClick={() => onPageChange(item)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#FF7A1A] text-[#0B0B0C] shadow-lg shadow-[#FF7A1A]/20"
                  : "bg-[#141416] text-[#B3B3BB] hover:text-[#F5F5F5] hover:bg-[#1B1B1F] border border-[#2A2A2E]"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Tombol Berikutnya */}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3.5 py-2 rounded-xl border border-[#2A2A2E] bg-[#141416] text-xs sm:text-sm font-medium text-[#F5F5F5] hover:bg-[#1B1B1F] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
        aria-label="Halaman Berikutnya"
      >
        <span className="hidden sm:inline">Berikutnya</span>
        <i className="fa-solid fa-chevron-right text-xs" />
      </button>
    </nav>
  );
}

export default Pagination;
