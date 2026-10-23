import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useJobs } from "../hooks/useJobs";
import { JobCard } from "../components/JobCard";
import { JobListSkeleton } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";
import { Pagination } from "../components/Pagination";

export function JobCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Ambil state dari URL params
  const initialKeyword = searchParams.get("keyword") || "";
  const initialType = searchParams.get("type") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialSort = searchParams.get("sort") || "newest";
  const initialPage = Number(searchParams.get("page") || 1);

  const [keywordInput, setKeywordInput] = useState(initialKeyword);
  const [debouncedKeyword, setDebouncedKeyword] = useState(initialKeyword);
  const [selectedType, setSelectedType] = useState(initialType);
  const [locationInput, setLocationInput] = useState(initialLocation);
  const [debouncedLocation, setDebouncedLocation] = useState(initialLocation);
  const [sortOption, setSortOption] = useState(initialSort);
  const [page, setPage] = useState(initialPage);

  // State untuk Fitur Inovatif: Search Suggestions / Autocomplete
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  // Debounce keyword selama 300 ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keywordInput);
      setPage(1); // Reset ke halaman 1 saat keyword berubah
    }, 300);

    return () => clearTimeout(handler);
  }, [keywordInput]);

  // Debounce location selama 300 ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedLocation(locationInput);
      setPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [locationInput]);

  // Sinkronkan state ke URL Query Parameters
  useEffect(() => {
    const params = {};
    if (debouncedKeyword) params.keyword = debouncedKeyword;
    if (selectedType) params.type = selectedType;
    if (debouncedLocation) params.location = debouncedLocation;
    if (sortOption && sortOption !== "newest") params.sort = sortOption;
    if (page > 1) params.page = page.toString();

    setSearchParams(params, { replace: true });
  }, [debouncedKeyword, selectedType, debouncedLocation, sortOption, page, setSearchParams]);

  // Tutup suggestions dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch lowongan dengan query params aktif
  const { data, isLoading, isError, refetch } = useJobs({
    keyword: debouncedKeyword || undefined,
    type: selectedType || undefined,
    location: debouncedLocation || undefined,
    sort: sortOption,
    page,
    limit: 9,
  });

  const jobs = useMemo(() => data?.jobs || [], [data?.jobs]);
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

  // Data Autocomplete / Suggestions dari daftar lowongan
  const suggestions = useMemo(() => {
    if (!keywordInput || keywordInput.trim().length < 2) return [];

    const query = keywordInput.toLowerCase().trim();
    const matches = new Set();

    jobs.forEach((job) => {
      if (job.title && job.title.toLowerCase().includes(query)) {
        matches.add({ text: job.title, type: "Posisi", icon: "fa-briefcase" });
      }
      if (job.company && job.company.toLowerCase().includes(query)) {
        matches.add({ text: job.company, type: "Perusahaan", icon: "fa-building" });
      }
    });

    return Array.from(matches).slice(0, 5);
  }, [keywordInput, jobs]);

  const handleSelectSuggestion = (text) => {
    setKeywordInput(text);
    setDebouncedKeyword(text);
    setShowSuggestions(false);
    setPage(1);
  };

  const handleClearFilters = () => {
    setKeywordInput("");
    setDebouncedKeyword("");
    setSelectedType("");
    setLocationInput("");
    setDebouncedLocation("");
    setSortOption("newest");
    setPage(1);
  };

  const jobTypeOptions = [
    { label: "Semua Tipe", value: "" },
    { label: "Full Time", value: "full-time" },
    { label: "Part Time", value: "part-time" },
    { label: "Kontrak", value: "contract" },
    { label: "Magang", value: "internship" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Halaman */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5F5] tracking-tight">
          Katalog Lowongan Kerja
        </h1>
        <p className="text-sm sm:text-base text-[#B3B3BB] mt-1.5">
          Jelajahi dan temukan peluang kerja sesuai keahlian, tipe, dan preferensi lokasi Anda.
        </p>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#141416] border border-[#2A2A2E] space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          {/* Search Box dengan Autocomplete */}
          <div className="md:col-span-6 relative" ref={searchContainerRef}>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0B0B0C] border border-[#2A2A2E] focus-within:border-[#FF7A1A] transition-colors">
              <i className="fa-solid fa-magnifying-glass text-[#7E7E8A] text-sm shrink-0" />
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => {
                  setKeywordInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Cari judul pekerjaan atau nama perusahaan..."
                className="w-full bg-transparent text-sm text-[#F5F5F5] placeholder-[#7E7E8A] focus:outline-none"
              />
              {keywordInput && (
                <button
                  type="button"
                  onClick={() => {
                    setKeywordInput("");
                    setDebouncedKeyword("");
                  }}
                  className="text-[#7E7E8A] hover:text-[#F5F5F5]"
                  aria-label="Hapus kata kunci"
                >
                  <i className="fa-solid fa-xmark text-xs" />
                </button>
              )}
            </div>

            {/* Inovasi: Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-[#141416] border border-[#2A2A2E] rounded-xl shadow-2xl z-30 py-2 overflow-hidden animate-in fade-in">
                <div className="px-3 py-1 text-[11px] font-semibold text-[#7E7E8A] uppercase tracking-wider">
                  Saran Pencarian
                </div>
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(s.text)}
                    className="w-full text-left px-3.5 py-2 text-xs sm:text-sm text-[#F5F5F5] hover:bg-[#1B1B1F] hover:text-[#FF7A1A] flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <i className={`fa-solid ${s.icon} text-xs text-[#7E7E8A]`} />
                      <span className="truncate">{s.text}</span>
                    </span>
                    <span className="text-[10px] text-[#7E7E8A] px-2 py-0.5 rounded bg-[#0B0B0C] border border-[#2A2A2E]">
                      {s.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Lokasi */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0B0B0C] border border-[#2A2A2E] focus-within:border-[#FF7A1A] transition-colors">
              <i className="fa-solid fa-location-dot text-[#7E7E8A] text-sm shrink-0" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Lokasi (cth: Jakarta, Remote)..."
                className="w-full bg-transparent text-sm text-[#F5F5F5] placeholder-[#7E7E8A] focus:outline-none"
              />
              {locationInput && (
                <button
                  type="button"
                  onClick={() => {
                    setLocationInput("");
                    setDebouncedLocation("");
                  }}
                  className="text-[#7E7E8A] hover:text-[#F5F5F5]"
                  aria-label="Hapus lokasi"
                >
                  <i className="fa-solid fa-xmark text-xs" />
                </button>
              )}
            </div>
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#0B0B0C] border border-[#2A2A2E] focus-within:border-[#FF7A1A]">
              <i className="fa-solid fa-arrow-down-short-wide text-[#7E7E8A] text-sm shrink-0" />
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-transparent text-sm text-[#F5F5F5] focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-[#141416] text-[#F5F5F5]">
                  Terbaru Dipasang
                </option>
                <option value="most_applicants" className="bg-[#141416] text-[#F5F5F5]">
                  Paling Banyak Pelamar
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Tipe Pekerjaan (Pills) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2A2A2E]/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#7E7E8A] mr-1">Tipe:</span>
            {jobTypeOptions.map((opt) => {
              const isSelected = selectedType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSelectedType(opt.value);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-[#FF7A1A] text-[#0B0B0C] font-bold shadow-md shadow-[#FF7A1A]/20"
                      : "bg-[#0B0B0C] text-[#B3B3BB] hover:text-[#F5F5F5] hover:bg-[#1B1B1F] border border-[#2A2A2E]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {(debouncedKeyword || selectedType || debouncedLocation || sortOption !== "newest") && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-[#FF7A1A] hover:underline flex items-center gap-1.5"
            >
              <i className="fa-solid fa-rotate-left text-[10px]" />
              Reset Semua Filter
            </button>
          )}
        </div>
      </div>

      {/* Ringkasan Jumlah Lowongan */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-[#B3B3BB]">
        <p>
          Menampilkan{" "}
          <span className="font-bold text-[#F5F5F5]">{pagination.total}</span> lowongan
          pekerjaan aktif
        </p>
        {pagination.totalPages > 1 && (
          <p className="text-xs text-[#7E7E8A]">
            Halaman {pagination.page} dari {pagination.totalPages}
          </p>
        )}
      </div>

      {/* Konten Utama Lowongan */}
      {isLoading ? (
        <JobListSkeleton count={9} />
      ) : isError ? (
        <ErrorState
          title="Gagal Memuat Lowongan"
          message="Terjadi gangguan saat mengambil data lowongan. Silakan coba beberapa saat lagi."
          onRetry={refetch}
        />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon="fa-solid fa-briefcase"
          title="Tidak Ada Lowongan yang Sesuai"
          description="Coba ubah kata kunci pencarian, hapus filter tipe atau lokasi untuk melihat lowongan lainnya."
          actionLabel="Reset Filter"
          onAction={handleClearFilters}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}
    </div>
  );
}

export default JobCatalog;
