import React, { useEffect, useState } from 'react';
import { it } from '../../content/texts';
import { supabase } from '../../utils/supabase';

interface WorldLocation {
  id: string;
  name: string;
  description: string;
  location_type: 'port' | 'island' | 'territory' | 'landmark';
  x_coordinate: number;
  y_coordinate: number;
  control_status: 'neutral' | 'player_controlled' | 'enemy_controlled' | 'allied';
  history: string | null;
}

export const MapPage: React.FC = () => {
  const [locations, setLocations] = useState<WorldLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<WorldLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);

      const { data } = await supabase
        .from('world_locations')
        .select('id, name, description, location_type, x_coordinate, y_coordinate, control_status, history')
        .order('name', { ascending: true });

      setLocations(data ?? []);
      setLoading(false);
    };

    void fetchLocations();
  }, []);

  const typeLabel = (type: WorldLocation['location_type']) =>
    it.mapPublic.locationTypes[type] ?? type;

  const statusLabel = (status: WorldLocation['control_status']) =>
    it.mapPublic.controlStatuses[status] ?? status;

  const statusColor = (status: WorldLocation['control_status']) => {
    switch (status) {
      case 'player_controlled':
        return 'bg-emerald-500';
      case 'enemy_controlled':
        return 'bg-red-500';
      case 'allied':
        return 'bg-sky-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <section id="map" className="py-24 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-300 mb-4">
            {it.mapPublic.title}
          </h2>
          <p className="text-slate-300 text-lg">
            {it.mapPublic.subtitle}
          </p>
        </div>

        {loading ? (
          <p className="text-center text-slate-300 text-lg">
            {it.mapPublic.loading}
          </p>
        ) : (
          <div className="grid lg:grid-cols-[1.3fr_0.9fr] gap-8">
            <div className="relative min-h-[520px] rounded-2xl border border-amber-700/20 bg-[linear-gradient(180deg,#132033,#0b1320)] overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:24px_24px]" />
              <div className="absolute inset-0 p-6">
                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => setSelectedLocation(location)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                    style={{
                      left: `${location.x_coordinate}%`,
                      top: `${location.y_coordinate}%`,
                    }}
                    title={location.name}
                  >
                    <span className={`block w-4 h-4 rounded-full ${statusColor(location.control_status)} ring-4 ring-white/10 group-hover:scale-125 transition`} />
                  </button>
                ))}
              </div>

              <div className="absolute bottom-4 left-4 text-xs text-slate-400 bg-slate-900/70 px-3 py-2 rounded">
                {it.mapPublic.worldMapAlt}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-700/20 bg-slate-900 p-6">
              <h3 className="text-2xl font-bold text-amber-300 mb-6">
                {it.mapPublic.locations}
              </h3>

              <div className="space-y-4 max-h-[520px] overflow-auto pr-2">
                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => setSelectedLocation(location)}
                    className="w-full text-left rounded-xl border border-amber-700/10 bg-slate-950 p-4 hover:bg-slate-800/50 transition"
                  >
                    <h4 className="text-lg font-semibold text-white mb-1">
                      {location.name}
                    </h4>
                    <p className="text-sm text-amber-200 mb-1">
                      {it.mapPublic.type}: {typeLabel(location.location_type)}
                    </p>
                    <p className="text-sm text-slate-400">
                      {it.mapPublic.control}: {statusLabel(location.control_status)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedLocation && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4" onClick={() => setSelectedLocation(null)}>
            <div
              className="max-w-2xl w-full rounded-2xl border border-amber-700/20 bg-slate-900 p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-3xl font-bold text-amber-300 mb-4">
                {selectedLocation.name}
              </h3>

              <div className="space-y-3 text-slate-200">
                <p>
                  <span className="text-amber-200 font-semibold">{it.mapPublic.type}:</span>{' '}
                  {typeLabel(selectedLocation.location_type)}
                </p>
                <p>
                  <span className="text-amber-200 font-semibold">{it.mapPublic.control}:</span>{' '}
                  {statusLabel(selectedLocation.control_status)}
                </p>
                <p>
                  <span className="text-amber-200 font-semibold">{it.mapPublic.coordinates}:</span>{' '}
                  {selectedLocation.x_coordinate}, {selectedLocation.y_coordinate}
                </p>
                <p className="whitespace-pre-line leading-7">
                  <span className="text-amber-200 font-semibold">{it.mapPublic.description}:</span>{' '}
                  {selectedLocation.description}
                </p>

                {selectedLocation.history && (
                  <p className="whitespace-pre-line leading-7">
                    <span className="text-amber-200 font-semibold">{it.mapPublic.history}:</span>{' '}
                    {selectedLocation.history}
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedLocation(null)}
                className="mt-8 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded transition"
              >
                Chiudi
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
