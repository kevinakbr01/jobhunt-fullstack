/**
 * Spinner loader sederhana
 */
export function Spinner({ size = "md", text = "Memuat..." }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-7 h-7 border-3",
    lg: "w-10 h-10 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-t-transparent border-[#FF7A1A] animate-spin`}
      />
      {text && <p className="text-xs sm:text-sm text-[#B3B3BB]">{text}</p>}
    </div>
  );
}

/**
 * Skeleton card untuk grid daftar lowongan
 */
export function JobCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-[#141416] border border-[#2A2A2E] animate-pulse flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#1B1B1F]" />
          <div className="w-20 h-6 rounded-md bg-[#1B1B1F]" />
        </div>
        <div className="w-3/4 h-5 rounded-md bg-[#1B1B1F] mb-2" />
        <div className="w-1/2 h-4 rounded-md bg-[#1B1B1F] mb-4" />
        <div className="w-full h-3 rounded bg-[#1B1B1F] mb-2" />
        <div className="w-4/5 h-3 rounded bg-[#1B1B1F]" />
      </div>
      <div className="pt-5 mt-5 border-t border-[#2A2A2E]/60 flex items-center justify-between">
        <div className="w-28 h-4 rounded bg-[#1B1B1F]" />
        <div className="w-16 h-4 rounded bg-[#1B1B1F]" />
      </div>
    </div>
  );
}

/**
 * Skeleton loader untuk daftar lowongan pekerjaan
 */
export function JobListSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <JobCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Skeleton loader untuk tabel data
 */
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#2A2A2E] bg-[#141416] animate-pulse">
      <div className="h-12 bg-[#1B1B1F] border-b border-[#2A2A2E]" />
      <div className="divide-y divide-[#2A2A2E]">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-6 py-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className="h-4 rounded bg-[#1B1B1F] flex-1"
                style={{ maxWidth: c === 0 ? "35%" : "20%" }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
