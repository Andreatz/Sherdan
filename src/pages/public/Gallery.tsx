import React, { useEffect, useState } from 'react';
import { it } from '../../content/texts';
import { supabase } from '../../utils/supabase';

interface GalleryItem {
  id: string;
  image_url: string;
  title: string;
  description: string | null;
  category: string | null;
}

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);

      const { data } = await supabase
        .from('gallery_items')
        .select('id, image_url, title, description, category')
        .order('upload_date', { ascending: false });

      setItems(data ?? []);
      setLoading(false);
    };

    void fetchGallery();
  }, []);

  const selectedItem = selectedIndex !== null ? items[selectedIndex] : null;

  return (
    <section id="gallery" className="py-24 px-6 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-300 mb-4">
            {it.galleryPublic.title}
          </h2>
          <p className="text-slate-300 text-lg">
            {it.galleryPublic.subtitle}
          </p>
        </div>

        {loading ? (
          <p className="text-center text-slate-300 text-lg">
            {it.galleryPublic.loading}
          </p>
        ) : items.length === 0 ? (
          <p className="text-center text-slate-400 text-lg">
            {it.galleryPublic.empty}
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setSelectedIndex(index)}
                className="group overflow-hidden rounded-2xl border border-amber-700/20 bg-slate-950 text-left hover:-translate-y-1 transition"
              >
                <div className="h-72 overflow-hidden bg-slate-800">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-amber-300 mb-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-slate-300 text-sm leading-6">
                      {item.description}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedItem && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
            onClick={() => setSelectedIndex(null)}
          >
            <div
              className="max-w-5xl w-full bg-slate-950 border border-amber-700/20 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
                <div className="bg-black">
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.title}
                    className="w-full h-full max-h-[80vh] object-contain"
                  />
                </div>

                <div className="p-8 flex flex-col">
                  <h3 className="text-3xl font-bold text-amber-300 mb-4">
                    {selectedItem.title}
                  </h3>

                  {selectedItem.category && (
                    <p className="text-amber-200 mb-4">
                      Categoria: {selectedItem.category}
                    </p>
                  )}

                  {selectedItem.description && (
                    <p className="text-slate-300 leading-7 mb-8">
                      {selectedItem.description}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between gap-3">
                    <button
                      onClick={() =>
                        setSelectedIndex((prev) =>
                          prev === null ? prev : Math.max(prev - 1, 0)
                        )
                      }
                      disabled={selectedIndex === 0}
                      className="px-4 py-2 rounded bg-slate-800 text-white disabled:opacity-40"
                    >
                      ←
                    </button>

                    <p className="text-slate-400 text-sm">
                      {selectedIndex! + 1} {it.galleryPublic.of} {items.length}
                    </p>

                    <button
                      onClick={() =>
                        setSelectedIndex((prev) =>
                          prev === null ? prev : Math.min(prev + 1, items.length - 1)
                        )
                      }
                      disabled={selectedIndex === items.length - 1}
                      className="px-4 py-2 rounded bg-slate-800 text-white disabled:opacity-40"
                    >
                      →
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedIndex(null)}
                    className="mt-4 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded transition"
                  >
                    Chiudi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
