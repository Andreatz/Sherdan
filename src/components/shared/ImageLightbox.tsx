import React, { useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface ImageLightboxProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ src, alt, isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/40 rounded-full p-2 transition"
        aria-label="Chiudi"
      >
        <X size={24} />
      </button>
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl cursor-default"
      />
    </div>
  );
};

/** Wrapper cliccabile attorno a un'immagine che apre il lightbox */
export const ZoomableImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  style?: React.CSSProperties;
}> = ({ src, alt, className, imgClassName, style }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div
        className={`relative group cursor-zoom-in ${className ?? ''}`}
        onClick={() => setOpen(true)}
      >
        <img src={src} alt={alt} className={imgClassName} style={style} />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
          <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-80 drop-shadow transition" />
        </div>
      </div>
      <ImageLightbox src={src} alt={alt} isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};
