import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabase';
import { it } from '../../content/texts';

interface Location {
  id: string;
  name: string;
  description: string;
  location_type: 'port' | 'island' | 'territory' | 'landmark';
  x_coordinate: number;
  y_coordinate: number;
  control_status: 'neutral' | 'player_controlled' | 'enemy_controlled' | 'allied';
  history?: string | null;
}

export const LocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location_type: 'port' as Location['location_type'],
    x_coordinate: 0,
    y_coordinate: 0,
    control_status: 'neutral' as Location['control_status'],
    history: '',
  });

  useEffect(() => {
    void fetchLocations();
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
      console.error('Errore nel caricamento dei luoghi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location_type: 'port',
      x_coordinate: 0,
      y_coordinate: 0,
      control_status: 'neutral',
      history: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from('world_locations')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('world_locations')
          .insert([formData]);

        if (error) throw error;
      }

      resetForm();
      await fetchLocations();
    } catch (error) {
      console.error('Errore nel salvataggio del luogo:', error);
    }
  };

  const handleEdit = (location: Location) => {
    setFormData({
      name: location.name,
      description: location.description,
      location_type: location.location_type,
      x_coordinate: location.x_coordinate,
      y_coordinate: location.y_coordinate,
      control_status: location.control_status,
      history: location.history || '',
    });
    setEditingId(location.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(it.adminLocations.confirmDelete)) return;

    try {
      const { error } = await supabase
        .from('world_locations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchLocations();
    } catch (error) {
      console.error('Errore nell’eliminazione del luogo:', error);
    }
  };

  const getStatusColor = (status: Location['control_status']) => {
    switch (status) {
      case 'player_controlled':
        return 'text-green-400';
      case 'enemy_controlled':
        return 'text-red-400';
      case 'allied':
        return 'text-blue-400';
      default:
        return 'text-amber-300';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-amber-300">
            {it.adminLocations.title}
          </h1>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Plus size={18} />
              {it.adminLocations.add}
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-slate-800 border border-amber-700/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-amber-300 mb-5">
              {editingId ? it.adminLocations.edit : it.adminLocations.addNew}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder={it.adminLocations.fields.name}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
              />

              <textarea
                placeholder={it.adminLocations.fields.description}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <select
                  value={formData.location_type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location_type: e.target.value as Location['location_type'],
                    })
                  }
                  className="px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white"
                >
                  <option value="port">{it.adminLocations.types.port}</option>
                  <option value="island">{it.adminLocations.types.island}</option>
                  <option value="territory">{it.adminLocations.types.territory}</option>
                  <option value="landmark">{it.adminLocations.types.landmark}</option>
                </select>

                <select
                  value={formData.control_status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      control_status: e.target.value as Location['control_status'],
                    })
                  }
                  className="px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white"
                >
                  <option value="neutral">{it.adminLocations.statuses.neutral}</option>
                  <option value="player_controlled">{it.adminLocations.statuses.player_controlled}</option>
                  <option value="enemy_controlled">{it.adminLocations.statuses.enemy_controlled}</option>
                  <option value="allied">{it.adminLocations.statuses.allied}</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder={it.adminLocations.fields.x}
                  value={formData.x_coordinate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      x_coordinate: parseFloat(e.target.value) || 0,
                    })
                  }
                  step="0.1"
                  required
                  className="px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
                />
                <input
                  type="number"
                  placeholder={it.adminLocations.fields.y}
                  value={formData.y_coordinate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      y_coordinate: parseFloat(e.target.value) || 0,
                    })
                  }
                  step="0.1"
                  required
                  className="px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
                />
              </div>

              <textarea
                placeholder={it.adminLocations.fields.history}
                value={formData.history}
                onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded transition"
                >
                  {editingId ? it.adminLocations.actions.update : it.adminLocations.actions.create}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded transition"
                >
                  {it.adminLocations.actions.cancel}
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-amber-300 py-8">
            {it.adminLocations.loading}
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center text-slate-300 py-10 bg-slate-800 rounded-xl border border-amber-700/20">
            {it.adminLocations.empty}
          </div>
        ) : (
          <div className="grid gap-4">
            {locations.map((location) => (
              <div
                key={location.id}
                className="bg-slate-800 border border-amber-700/20 rounded-xl p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-amber-300">
                    {location.name}
                  </h3>
                  <p className="text-slate-300 text-sm mt-1">
                    {it.adminLocations.types[location.location_type]} •{' '}
                    <span className={getStatusColor(location.control_status)}>
                      {it.adminLocations.statuses[location.control_status]}
                    </span>
                  </p>
                  <p className="text-slate-400 text-sm mt-2">
                    {it.adminLocations.coords}: ({location.x_coordinate}, {location.y_coordinate})
                  </p>
                  <p className="text-slate-300 text-sm mt-3 line-clamp-3">
                    {location.description}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(location)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(location.id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
