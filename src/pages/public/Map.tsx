import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface Location {
  id: string;
  name: string;
  description: string;
  location_type: string;
  x_coordinate: number;
  y_coordinate: number;
  control_status: string;
  history?: string;
}

export const MapPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const mapImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('world_locations')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newZoom = zoom - (e.deltaY > 0 ? 0.1 : 0.1);
    setZoom(Math.max(0.5, Math.min(3, newZoom)));
  };

  const getControlColor = (status: string) => {
    switch (status) {
      case 'player_controlled': return 'bg-green-500';
      case 'enemy_controlled': return 'bg-red-500';
      case 'allied': return 'bg-blue-500';
      default: return 'bg-amber-500';
    }
  };

  const getTypeSymbol = (type: string) => {
    switch (type) {
      case 'port': return '⚓';
      case 'island': return '🏝️';
      case 'territory': return '🚩';
      case 'landmark': return '🗺️';
      default: return '📍';
    }
  };

  return (
    <section id="map" className="py-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-400 mb-2">World Map</h2>
          <p className="text-amber-100">Explore the known world and beyond</p>
        </div>

        {isLoading ? (
          <div className="text-center text-amber-400">Loading map...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Map Canvas */}
            <div className="lg:col-span-3">
              <div
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                className="relative w-full h-96 lg:h-screen bg-slate-800 border border-amber-700/30 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
              >
                {/* Map Image */}
                <div
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  }}
                  className="absolute inset-0"
                >
                  <img
                    ref={mapImageRef}
                    src="/07BW004-full.png"
                    alt="World Map"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Location Markers */}
                <div className="absolute inset-0 pointer-events-none">
                  {locations.map((location) => {
                    const mapElement = mapImageRef.current;
                    if (!mapElement) return null;

                    const pinX = (location.x_coordinate / 100) * mapElement.offsetWidth;
                    const pinY = (location.y_coordinate / 100) * mapElement.offsetHeight;

                    return (
                      <button
                        key={location.id}
                        onClick={() => setSelectedLocation(location)}
                        className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 transition transform hover:scale-125"
                        style={{
                          left: `${pinX}px`,
                          top: `${pinY}px`,
                          transform: `translate(-50%, -50%) scale(${1 / zoom})`,
                        }}
                        title={location.name}
                      >
                        <div className={`w-6 h-6 ${getControlColor(location.control_status)} rounded-full border-2 border-white shadow-lg flex items-center justify-center text-sm`}>
                          {getTypeSymbol(location.location_type)}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Zoom Controls */}
                <div className="absolute bottom-4 left-4 flex flex-col gap-2 pointer-events-auto">
                  <button
                    onClick={() => setZoom(Math.min(3, zoom + 0.2))}
                    className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded transition"
                  >
                    <ZoomIn size={20} />
                  </button>
                  <button
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
                    className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded transition"
                  >
                    <ZoomOut size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Locations List */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 border border-amber-700/30 rounded-lg p-4">
                <h3 className="text-amber-400 font-bold mb-4">Locations ({locations.length})</h3>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {locations.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => setSelectedLocation(location)}
                      className="w-full text-left p-2 bg-slate-700 hover:bg-slate-600 rounded transition text-amber-100 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeSymbol(location.location_type)}</span>
                        <span className="font-bold text-amber-400">{location.name}</span>
                      </div>
                      <div className="text-xs text-amber-900 ml-6">{location.location_type.replace('_', ' ')}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Location Detail Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-amber-700/30 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-start p-4 border-b border-amber-700/30">
              <h2 className="text-xl font-bold text-amber-400">{selectedLocation.name}</h2>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-amber-400 hover:text-amber-300 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <p className="text-amber-900 text-xs font-medium uppercase">Type</p>
                <p className="text-amber-400 font-bold">{selectedLocation.location_type.replace('_', ' ')}</p>
              </div>

              <div>
                <p className="text-amber-900 text-xs font-medium uppercase">Control</p>
                <p className="text-amber-400 font-bold">{selectedLocation.control_status.replace('_', ' ')}</p>
              </div>

              <div>
                <p className="text-amber-900 text-xs font-medium uppercase">Description</p>
                <p className="text-amber-100">{selectedLocation.description}</p>
              </div>

              {selectedLocation.history && (
                <div>
                  <p className="text-amber-900 text-xs font-medium uppercase">History</p>
                  <p className="text-amber-100">{selectedLocation.history}</p>
                </div>
              )}

              <div className="pt-2 border-t border-amber-700/30">
                <p className="text-amber-900 text-xs">Coordinates: ({selectedLocation.x_coordinate}, {selectedLocation.y_coordinate})</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
