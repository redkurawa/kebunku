import React, { useState } from 'react';
import { usePlants } from '../hooks/usePlants';
import PlantForm from './PlantForm';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Leaf,
  Edit2,
  Trash2,
} from 'lucide-react';
import { type Plant } from '../services/plantService';

const PlantManager: React.FC = () => {
  const { plants, loading, deletePlant, updatePlant } = usePlants();
  const [showForm, setShowForm] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | undefined>(
    undefined
  );
  // Initial state: all collapsed (tertutup)
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  // For batch update
  const [selectedPlants, setSelectedPlants] = useState<Set<string>>(new Set());
  const [showBatchUpdate, setShowBatchUpdate] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [batchLoading, setBatchLoading] = useState(false);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((g) => g !== groupId)
        : [...prev, groupId]
    );
  };

  const toggleSelectPlant = (plantId: string) => {
    setSelectedPlants((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(plantId)) {
        newSet.delete(plantId);
      } else {
        newSet.add(plantId);
      }
      return newSet;
    });
  };

  const handleBatchUpdate = async () => {
    if (!newCategory.trim() || selectedPlants.size === 0) return;

    if (
      !confirm(
        `Ubah kategori ${selectedPlants.size} tanaman menjadi "${newCategory}"?`
      )
    ) {
      return;
    }

    setBatchLoading(true);
    try {
      // Normalize the category like we do in the service
      const normalizedCategory = newCategory.trim().split(' ')[0];
      const capitalized =
        normalizedCategory.charAt(0).toUpperCase() +
        normalizedCategory.slice(1).toLowerCase();

      for (const plantId of selectedPlants) {
        await updatePlant(plantId, { categoryId: capitalized });
      }

      alert(`Berhasil mengubah ${selectedPlants.size} tanaman`);
      setSelectedPlants(new Set());
      setShowBatchUpdate(false);
      setNewCategory('');
    } catch (err) {
      console.error('Error batch updating:', err);
      alert('Gagal mengubah kategori');
    } finally {
      setBatchLoading(false);
    }
  };

  const handleEdit = (plant: Plant) => {
    setEditingPlant(plant);
    setShowForm(true);
    // Scroll to top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        'Hapus tanaman ini? Riwayat aktivitas untuk tanaman ini akan tetap ada tapi tidak tertaut ke tanaman yang aktif.'
      )
    ) {
      try {
        await deletePlant(id);
      } catch (err) {
        console.error('Error deleting plant:', err);
        alert('Gagal menghapus tanaman');
      }
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPlant(undefined);
  };

  // Helper to display group name properly
  const getGroupDisplayName = (groupId: string): string => {
    const groupNames: Record<string, string> = {
      sayur: 'Sayur',
      buah: 'Buah',
      hias: 'Hias',
      carnivora: 'Carnivora',
      lainnya: 'Lainnya',
      bunga: 'Bunga',
    };
    return groupNames[groupId] || groupId;
  };

  if (loading)
    return (
      <div className='card' style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Memuat data tanaman...</p>
      </div>
    );

  // Auto-map category to group based on keywords
  const getAutoGroup = (categoryId: string, currentGroup: string): string => {
    const cat = categoryId.toLowerCase();
    // If already has a valid group, keep it
    if (['sayur', 'buah', 'hias', 'carnivora'].includes(currentGroup)) {
      return currentGroup;
    }
    // Auto-map based on category keywords
    if (
      cat.includes('kangkung') ||
      cat.includes('cabe') ||
      cat.includes('cabai') ||
      cat.includes('bayam') ||
      cat.includes('sawi') ||
      cat.includes('selada') ||
      cat.includes('tomat') ||
      cat.includes('terong') ||
      cat.includes('bawang') ||
      cat.includes('wortel') ||
      cat.includes('kol') ||
      cat.includes('brokoli')
    ) {
      return 'sayur';
    }
    if (
      cat.includes('mangga') ||
      cat.includes('anggur') ||
      cat.includes('jeruk') ||
      cat.includes('apel') ||
      cat.includes('pisang') ||
      cat.includes('pepaya') ||
      cat.includes('jambu') ||
      cat.includes('durian') ||
      cat.includes('rambutan')
    ) {
      return 'buah';
    }
    // Default to current group or 'lainnya'
    return currentGroup || 'lainnya';
  };

  // Group plants by groupId with auto-mapping, then sort each group
  const groupedPlants = plants.reduce(
    (acc, plant) => {
      const group = getAutoGroup(plant.categoryId, plant.groupId || 'lainnya');
      if (!acc[group]) acc[group] = [];
      acc[group].push(plant);
      return acc;
    },
    {} as Record<string, typeof plants>
  );

  // Sort plants within each group alphabetically by categoryId + variety
  Object.keys(groupedPlants).forEach((group) => {
    groupedPlants[group].sort((a, b) => {
      const aKey = `${a.categoryId || ''} - ${a.variety || ''}`.toLowerCase();
      const bKey = `${b.categoryId || ''} - ${b.variety || ''}`.toLowerCase();
      return aKey.localeCompare(bKey);
    });
  });

  return (
    <div className='plant-manager' style={{ width: '100%', maxWidth: '800px' }}>
      <div
        className='plant-manager-header'
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <h2
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          <Leaf className='text-secondary-600' /> Koleksi Tanaman
        </h2>
        {!showForm && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {selectedPlants.size > 0 && (
              <button
                onClick={() => setShowBatchUpdate(true)}
                className='btn btn-secondary'
                style={{ backgroundColor: 'var(--secondary-600)' }}
              >
                Ubah Kategori ({selectedPlants.size})
              </button>
            )}
            <button
              onClick={() => setShowForm(true)}
              className='btn btn-primary'
              style={{
                width: 'var(--btn-width, auto)',
              }}
            >
              <Plus size={18} /> Tambah Tanaman
            </button>
          </div>
        )}
        <style>{`
          @media (max-width: 767px) {
            .plant-manager-header {
              flex-direction: column;
              align-items: stretch !important;
            }
            .plant-manager-header .btn {
              width: 100% !important;
            }
          }
        `}</style>
      </div>

      {showForm && (
        <PlantForm onCancel={handleFormCancel} initialData={editingPlant} />
      )}

      {showBatchUpdate && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowBatchUpdate(false)}
        >
          <div
            className='card'
            style={{ padding: '2rem', maxWidth: '400px', width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '1rem' }}>
              Ubah Kategori ({selectedPlants.size} tanaman)
            </h3>
            <div className='input-group'>
              <label>Kategori Baru</label>
              <input
                type='text'
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder='Contoh: Pinguicula'
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button
                onClick={handleBatchUpdate}
                className='btn btn-primary'
                disabled={batchLoading || !newCategory.trim()}
                style={{ flex: 1 }}
              >
                {batchLoading ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button
                onClick={() => {
                  setShowBatchUpdate(false);
                  setNewCategory('');
                }}
                className='btn'
                style={{ backgroundColor: 'var(--neutral-200)' }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className='groups-list'
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        {Object.keys(groupedPlants).length === 0 ? (
          <div
            className='card'
            style={{ textAlign: 'center', padding: '2rem' }}
          >
            <p style={{ color: 'var(--text-muted)' }}>
              Belum ada tanaman. Tambahkan tanaman pertama Anda!
            </p>
          </div>
        ) : (
          Object.entries(groupedPlants).map(([groupId, items]) => (
            <div
              key={groupId}
              className='card'
              style={{ marginBottom: '1rem', padding: '1.5rem' }}
            >
              <div
                onClick={() => toggleGroup(groupId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  marginBottom: expandedGroups.includes(groupId) ? '1rem' : 0,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  {expandedGroups.includes(groupId) ? (
                    <ChevronDown size={20} color='var(--text-secondary)' />
                  ) : (
                    <ChevronRight size={20} color='var(--text-secondary)' />
                  )}
                  <h4
                    style={{
                      textTransform: 'capitalize',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {getGroupDisplayName(groupId)} ({items.length})
                  </h4>
                </div>
              </div>

              {expandedGroups.includes(groupId) && (
                <div className='plant-card-list'>
                  {items.map((plant) => (
                    <div key={plant.id} className='plant-item-card'>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flex: 1,
                        }}
                      >
                        <div style={{ width: '30px', flexShrink: 0 }}>
                          <input
                            type='checkbox'
                            checked={selectedPlants.has(plant.id!)}
                            onChange={() => toggleSelectPlant(plant.id!)}
                          />
                        </div>
                        <div className='plant-info'>
                          <div
                            style={{
                              fontWeight: 600,
                              color: 'var(--text-primary)',
                            }}
                          >
                            {plant.categoryId} - {plant.variety}
                          </div>
                          <div className='plant-meta'>
                            {plant.name && <span>🏷️ {plant.name}</span>}
                            <span>🌱 {getGroupDisplayName(plant.groupId)}</span>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                        }}
                      >
                        <button
                          onClick={() => handleEdit(plant)}
                          style={{
                            padding: '0.5rem',
                            color: 'var(--secondary-600)',
                            backgroundColor: 'var(--secondary-50)',
                            borderRadius: 'var(--radius-md)',
                          }}
                          title='Edit'
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(plant.id!)}
                          style={{
                            padding: '0.5rem',
                            color: 'var(--stone-400)',
                            backgroundColor: 'var(--stone-100)',
                            borderRadius: 'var(--radius-md)',
                          }}
                          title='Hapus'
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
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
