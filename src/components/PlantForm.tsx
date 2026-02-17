import React, { useState, useEffect } from 'react';
import { usePlants } from '../hooks/usePlants';
import { Plus, X, Save } from 'lucide-react';
import { type Plant } from '../services/plantService';

interface PlantFormProps {
  onCancel?: () => void;
  initialData?: Plant;
}

const PlantForm: React.FC<PlantFormProps> = ({ onCancel, initialData }) => {
  const { addPlant, updatePlant } = usePlants();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    groupId: 'buah',
    categoryId: '',
    variety: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        groupId: initialData.groupId || 'buah',
        categoryId: initialData.categoryId || '',
        variety: initialData.variety || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.variety) return;

    setLoading(true);
    try {
      if (initialData?.id) {
        await updatePlant(initialData.id, formData);
      } else {
        await addPlant(formData);
      }
      setFormData({ name: '', groupId: 'buah', categoryId: '', variety: '' });
      if (onCancel) onCancel();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      alert('Gagal menyimpan tanaman: ' + msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='card'
      style={{
        marginBottom: '1.5rem',
        border: initialData ? '2px solid var(--primary-color)' : '',
        width: '100%',
        maxWidth: '800px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <h3>{initialData ? 'Edit Tanaman' : 'Tambah Tanaman Baru'}</h3>
        {onCancel && (
          <button
            type='button'
            onClick={onCancel}
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className='input-group'>
        <label>Kelompok (Group)</label>
        <select
          value={formData.groupId}
          onChange={(e) =>
            setFormData({ ...formData, groupId: e.target.value })
          }
        >
          <option value='buah'>Buah</option>
          <option value='bunga'>Bunga</option>
          <option value='carnivora'>Carnivora</option>
          <option value='lainnya'>Lainnya</option>
        </select>
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
      >
        <div className='input-group'>
          <label>Kategori (e.g. Mangga, Anggur)</label>
          <input
            type='text'
            placeholder='Contoh: Anggur'
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
            required
          />
        </div>
        <div className='input-group'>
          <label>Jenis/Varietas (e.g. Jupiter)</label>
          <input
            type='text'
            placeholder='Contoh: Jupiter'
            value={formData.variety}
            onChange={(e) =>
              setFormData({ ...formData, variety: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className='input-group'>
        <label>Nama Alias / Label Tanaman</label>
        <input
          type='text'
          placeholder='Contoh: Pohon Depan Rumah'
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <button
        type='submit'
        className='btn btn-primary'
        style={{ width: '100%' }}
        disabled={loading}
      >
        {loading ? (
          <Plus size={18} className='animate-spin' />
        ) : initialData ? (
          <Save size={18} />
        ) : (
          <Plus size={18} />
        )}
        {loading
          ? 'Menyimpan...'
          : initialData
            ? 'Simpan Perubahan'
            : 'Tambah Tanaman'}
      </button>
    </form>
  );
};

export default PlantForm;
