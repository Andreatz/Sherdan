import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabase';

interface Location {
  id: string;
  name: string;
  description: string;
  location_type: 'port' | 'island' | 'territory' | 'landmark';
  x_coordinate: number;
  y_coordinate: number;
  control_status: 'neutral' | 'player_controlled' | 'enemy_controlled' | 'allied';
  history?: string;
}

export const LocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location_type: 'port' as const,
    x_coordinate: 0,
    y_coordinate: 0,
    control_status: 'neutral' as const,
    history: '',
  });

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
      fetchLocations();
    } catch (error) {
      console.error('Error saving location:', error);
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
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
      const { error } = await supabase
        .from('world_locations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'player_controlled': return 'text-green-400';
      case 'enemy_controlled': return 'text-red-400';
      case 'allied': return 'text-blue-400';
      default: return 'text-amber-400';
    }
  };

  return (
    <AdminLayout currentPage="locations">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-amber-400">Map Locations</h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition"
            >
              <Plus size={20} />
              Add Location
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-slate-700 border border-amber-700/30 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-amber-400">{editingId ? 'Edit' : 'Add New'} Location</h2>
              <button onClick={resetForm} className="text-amber-400 hover:text-amber-300">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Location Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={formData.location_type}
                  onChange={(e) => setFormData({ ...formData, location_type: e.target.value as any })}
                  className="px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white focus:outline-none focus:border-amber-600"
                >
                  <option value="port">Port</option>
                  <option value="island">Island</option>
                  <option value="territory">Territory</option>
                  <option value="landmark">Landmark</option>
                </select>

                <select
                  value={formData.control_status}
                  onChange={(e) => setFormData({ ...formData, control_status: e.target.value as any })}
                  className="px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white focus:outline-none focus:border-amber-600"
                >
                  <option value="neutral">Neutral</option>
                  <option value="player_controlled">Player Controlled</option>
                  <option value="enemy_controlled">Enemy Controlled</option>
                  <option value="allied">Allied</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="X Coordinate"
                  value={formData.x_coordinate}
                  onChange={(e) => setFormData({ ...formData, x_coordinate: parseFloat(e.target.value) })}
                  step="0.1"
                  required
                  className="px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
                />

                <input
                  type="number"
                  placeholder="Y Coordinate"
                  value={formData.y_coordinate}
                  onChange={(e) => setFormData({ ...formData, y_coordinate: parseFloat(e.target.value) })}
                  step="0.1"
                  required
                  className="px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
                />
              </div>

              <textarea
                placeholder="History (Optional)"
                value={formData.history}
                onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded transition"
                >
                  {editingId ? 'Update' : 'Create'} Location
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-amber-400">Loading locations...</div>
        ) : locations.length === 0 ? (
          <div className="text-center text-amber-100 py-8">
            <p>No locations yet. Add some points of interest to your map!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {locations.map((location) => (
              <div key={location.id} className="bg-slate-700 border border-amber-700/30 rounded-lg p-4 flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-400">{location.name}</h3>
                  <p className="text-amber-100 text-sm">
                    {location.location_type.replace('_', ' ').toUpperCase()} • <span className={getStatusColor(location.control_status)}>{location.control_status.replace('_', ' ')}</span>
                  </p>
                  <p className="text-amber-900 text-sm mt-1">Coords: ({location.x_coordinate}, {location.y_coordinate})</p>
                  <p className="text-amber-100 text-sm mt-2 line-clamp-2">{location.description}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(location)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
                  >
                    <Edit2 size={18} />
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
