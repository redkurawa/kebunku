import React, { useState } from 'react';
import { usePlants } from '../hooks/usePlants';
import PlantForm from './PlantForm';
import { ChevronDown, ChevronRight, Plus, Leaf, Edit2, Trash2 } from 'lucide-react';
import { type Plant } from '../services/plantService';

const PlantManager: React.FC = () => {
    const { plants, loading, deletePlant } = usePlants();
    const [showForm, setShowForm] = useState(false);
    const [editingPlant, setEditingPlant] = useState<Plant | undefined>(undefined);
    const [expandedGroups, setExpandedGroups] = useState<string[]>(['buah', 'bunga', 'carnivora', 'lainnya']);

    const toggleGroup = (groupId: string) => {
        setExpandedGroups(prev =>
            prev.includes(groupId) ? prev.filter(g => g !== groupId) : [...prev, groupId]
        );
    };

    const handleEdit = (plant: Plant) => {
        setEditingPlant(plant);
        setShowForm(true);
        // Scroll to top to see the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (confirm('Hapus tanaman ini? Riwayat aktivitas untuk tanaman ini akan tetap ada tapi tidak tertaut ke tanaman yang aktif.')) {
            try {
                await deletePlant(id);
            } catch (error) {
                alert('Gagal menghapus tanaman');
            }
        }
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingPlant(undefined);
    };

    if (loading) return (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Memuat data tanaman...</p>
        </div>
    );

    // Group plants by groupId
    const groupedPlants = plants.reduce((acc, plant) => {
        const group = plant.groupId || 'lainnya';
        if (!acc[group]) acc[group] = [];
        acc[group].push(plant);
        return acc;
    }, {} as Record<string, typeof plants>);

    return (
        <div className="plant-manager">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                    <Leaf className="text-secondary-600" /> Koleksi Tanaman
                </h2>
                {!showForm && (
                    <button onClick={() => setShowForm(true)} className="btn btn-primary">
                        <Plus size={18} /> Tambah Tanaman
                    </button>
                )}
            </div>

            {showForm && (
                <PlantForm
                    onCancel={handleFormCancel}
                    initialData={editingPlant}
                />
            )}

            <div className="groups-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.keys(groupedPlants).length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <p style={{ color: 'var(--text-muted)' }}>Belum ada tanaman. Tambahkan tanaman pertama Anda!</p>
                    </div>
                ) : (
                    Object.entries(groupedPlants).map(([groupId, items]) => (
                        <div key={groupId} className="card" style={{ marginBottom: '1rem', padding: '1.5rem' }}>
                            <div
                                onClick={() => toggleGroup(groupId)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    marginBottom: expandedGroups.includes(groupId) ? '1rem' : 0
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    {expandedGroups.includes(groupId) ? <ChevronDown size={20} color="var(--text-secondary)" /> : <ChevronRight size={20} color="var(--text-secondary)" />}
                                    <h4 style={{ textTransform: 'capitalize', color: 'var(--text-primary)' }}>{groupId} ({items.length})</h4>
                                </div>
                            </div>

                            {expandedGroups.includes(groupId) && (
                                <div style={{ padding: '0.5rem', overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                                <th style={{ padding: '0.75rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Kategori</th>
                                                <th style={{ padding: '0.75rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Varietas</th>
                                                <th style={{ padding: '0.75rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Alias/Label</th>
                                                <th style={{ padding: '0.75rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right', textTransform: 'uppercase' }}>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((plant) => (
                                                <tr key={plant.id} style={{ borderBottom: '1px solid var(--stone-50)' }}>
                                                    <td style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--text-primary)' }}>{plant.categoryId}</td>
                                                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{plant.variety}</td>
                                                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                        {plant.name || '-'}
                                                    </td>
                                                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                            <button
                                                                onClick={() => handleEdit(plant)}
                                                                style={{ padding: '0.25rem', color: 'var(--secondary-600)' }}
                                                                title="Edit"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(plant.id!)}
                                                                style={{ padding: '0.25rem', color: 'var(--stone-400)' }}
                                                                title="Hapus"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PlantManager;
