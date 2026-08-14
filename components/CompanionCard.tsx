"use client";
import { useState, useTransition } from "react";
import { removeBookmark, addBookmark, deleteCompanion } from "@/lib/actions/companion.actions";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CompanionCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
  bookmarked: boolean;
}

const CompanionCard = ({
  id,
  name,
  topic,
  subject,
  duration,
  color,
  bookmarked,
}: CompanionCardProps) => {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault(); 
    const newState = !isBookmarked;
    setIsBookmarked(newState);

    startTransition(async () => {
      try {
        if (newState) {
          await addBookmark(id, pathname);
        } else {
          await removeBookmark(id, pathname);
        }
      } catch (error) {
        setIsBookmarked(!newState);
        console.error("Gagal mengubah bookmark", error);
      }
    });
  };

  // Fungsi untuk menghapus companion
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      setIsDeleting(true);
      startTransition(async () => {
        try {
          await deleteCompanion(id, pathname);
        } catch (error) {
          setIsDeleting(false);
          console.error("Gagal menghapus companion", error);
        }
      });
    }
  };

  return (
    <article className="companion-card relative" style={{ backgroundColor: color }}>
      <div className="flex justify-between items-center">
        <div className="subject-badge">{subject}</div>
        
        {/* Tombol Aksi Kanan Atas (Delete 'x' & Bookmark) */}
        <div className="flex items-center gap-2">
          {/* Tombol Delete huruf x */}
          <button
            onClick={handleDelete}
            disabled={isDeleting || isPending}
            className="w-6 h-6 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-xs font-bold text-slate-700 transition-colors"
            title="Delete Companion"
          >
            ✕
          </button>

          {/* Tombol Bookmark */}
          <button 
            className="companion-bookmark" 
            onClick={handleBookmark}
            disabled={isPending}
          >
            <Image
              src={
                isBookmarked ? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"
              }
              alt="bookmark"
              width={12.5}
              height={15}
            />
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="text-sm">{topic}</p>
      <div className="flex items-center gap-2">
        <Image
          src="/icons/clock.svg"
          alt="duration"
          width={13.5}
          height={13.5}
        />
        <p className="text-sm">{duration} minutes</p>
      </div>

      <Link href={`/companions/${id}`} className="w-full">
        <button className="btn-primary w-full justify-center">
          Launch Lesson
        </button>
      </Link>
    </article>
  );
};

export default CompanionCard;