import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface GalleryItem {
  id: string;
  image_url: string;
  title: string;
  description?: string;
  category: string;
}

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectItem = (item: GalleryItem, index: number) => {
    setSelectedItem(item);
    setSelectedIndex(index);
  };

  const handleNext = () => {
    const nextIndex = (selectedIndex + 1) % items.length;
    handleSelectItem(items[nextIndex], nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (selectedIndex - 1 + items.length) % items.length;
    handleSelectItem(items[prevIndex], prevIndex);
  };

  return (
    <section id="gallery" className="py-16 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-400 mb-2">Campaign Gallery</h2>
          <p className="text-amber-100">Moments from the high seas</p>
        </div>

        {isLoading ? (
          <div className="text-center text-amber-400">Loading gallery...</div>
        ) : items.length === 0 ? (
          <div className="text-center text-amber-100 py-12">
            <p>No gallery items yet. Epic moments coming soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item, index)}
                className="group relative overflow-hidden rounded-lg h-48 bg-slate-700 border border-amber-700/30 hover:border-amber-600 transition"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end">
                  <div className="p-3 w-full">
                    <p className="text-amber-400 font-bold text-sm line-clamp-1">{item.title}</p>
                    <p className="text-amber-900 text-xs">{item.category}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Gallery Lightbox */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            {/* Close button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute -top-10 right-0 text-amber-400 hover:text-amber-300 transition"
            >
              <X size={32} />
            </button>

            {/* Image */}
            <div className="relative bg-slate-800 rounded-lg overflow-hidden mb-4">
              <img
                src={selectedItem.image_url}
                alt={selectedItem.title}
                className="w-full h-auto max-h-screen object-contain"
              />

              {/* Navigation buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-amber-600/50 hover:bg-amber-600 text-white p-3 rounded transition"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-amber-600/50 hover:bg-amber-600 text-white p-3 rounded transition"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Info */}
            <div className="bg-slate-800 border border-amber-700/30 rounded-lg p-4">
              <h3 className="text-2xl font-bold text-amber-400 mb-2">{selectedItem.title}</h3>
              {selectedItem.description && (
                <p className="text-amber-100 mb-4">{selectedItem.description}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-amber-900 text-sm">{selectedItem.category}</span>
                <span className="text-amber-900 text-sm">{selectedIndex + 1} of {items.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
