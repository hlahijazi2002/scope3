import { useState, useRef } from "react";
import { Upload, CheckCircle2, FileText, X } from "lucide-react";

// TYPES

interface UploadedFile {
  name: string;
  size: number;
}

interface UploadCardProps {
  title: string;
  subTitle?: string;
  accept?: string;
  onUpload?: (file: File) => void;
}

// HELPERS

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// COMPONENT

export default function UploadCard({
  title,
  subTitle,
  accept = "*",
  onUpload,
}: UploadCardProps) {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile({ name: f.name, size: f.size });
    onUpload?.(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      onClick={() => !file && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`
        relative rounded-xl border-2 border-dashed p-5 text-center
        transition-all duration-200
        ${
          file
            ? "border-[#1FA971] bg-[#F3FBF7] cursor-default"
            : dragging
              ? "border-[#0F5F4B] bg-[#E8F7F0] scale-[1.02]"
              : "border-[#E5E7EB] bg-white cursor-pointer hover:border-[#1FA971] hover:bg-[#F3FBF7]"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />

      {file ? (
        /* ── uploaded state ── */
        <div className="flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-lg bg-[#1FA971] flex items-center justify-centershrink-0">
            <FileText size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-[#0F5F4B] truncate">
              {file.name}
            </div>
            <div className="text-[11px] text-[#6B7280]">
              {formatSize(file.size)}
            </div>
          </div>
          <CheckCircle2 size={18} className="text-[#1FA971] shrink-0" />
          <button
            onClick={clear}
            className="w-6 h-6 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-colors shrink-0"
          >
            <X size={11} className="text-[#6B7280]" />
          </button>
        </div>
      ) : (
        /* ── empty state ── */
        <>
          <div className="w-10 h-10 rounded-xl bg-[#F3FBF7] border border-[#E5E7EB] flex items-center justify-center mx-auto mb-3">
            <Upload size={20} className="text-[#6B7280]" />
          </div>
          <div className="text-[12px] font-semibold text-[#1D1F21] mb-1">
            {title}
          </div>
          {subTitle && (
            <div className="text-[11px] text-[#6B7280]">{subTitle}</div>
          )}
          <div className="text-[10px] text-[#1FA971] font-medium mt-2">
            Click to browse or drag & drop
          </div>
        </>
      )}
    </div>
  );
}
