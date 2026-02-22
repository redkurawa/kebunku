import React, { useState, useMemo, type ChangeEvent } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useActivities } from '../hooks/useActivities';
import { usePlants } from '../hooks/usePlants';
import { useAuth } from '../hooks/useAuth';
import {
  type ActivityType,
  type WeatherCondition,
  activityService,
} from '../services/activityService';
import {
  Sprout,
  Loader2,
  Image as ImageIcon,
  X,
  Save,
  Bug,
  Beaker,
  Eye,
  PlusCircle,
  Scissors,
  Grape,
  TreeDeciduous,
  Package,
  ClipboardList,
  AlertCircle,
} from 'lucide-react';

const ACTIVITY_TYPES: {
  value: ActivityType;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: 'pupuk', label: '🧪 Pupuk', icon: <Sprout size={16} /> },
  { value: 'fungisida', label: '🧪 Fungsida', icon: <Beaker size={16} /> },
  { value: 'insektisida', label: '🦟 Insectisida', icon: <Bug size={16} /> },
  { value: 'monitor', label: '👁️ Monitor', icon: <Eye size={16} /> },
  {
    value: 'new_comer',
    label: '🆕 Tanaman Baru',
    icon: <PlusCircle size={16} />,
  },
  { value: 'pangkas', label: '✂️ Pangkas', icon: <Scissors size={16} /> },
  { value: 'semai', label: '🌱 Semai', icon: <Sprout size={16} /> },
  {
    value: 'hama_penyakit',
    label: '⚠️ Hama/Penyakit',
    icon: <AlertCircle size={16} />,
  },
  {
    value: 'panen_lainnya',
    label: '🧺 Panen/Lainnya',
    icon: <Grape size={16} />,
  },
  {
    value: 'pisah_anakan',
    label: '⛄ Pisah Anakan',
    icon: <TreeDeciduous size={16} />,
  },
  { value: 'pindah_pot', label: '📦 Pindah Pot', icon: <Package size={16} /> },
  { value: 'lainnya', label: '📝 Lainnya', icon: <ClipboardList size={16} /> },
];

const METHODS = ['spray', 'kocor', 'tabur', 'tanam', 'lainnya'];

// Helper function to transform dose/volume values
const transformDosisVolume = (value: string): string => {
  if (!value) return value;

  let result = value.trim();

  // Transform dose: g/l -> gr/ltr
  result = result.replace(/g\/l/gi, 'gr/ltr');
  // Transform dose: m/l -> ml/ltr (milliliter per liter)
  result = result.replace(/m\/l/gi, 'ml/ltr');
  // Transform volume: 5 l -> 5 ltr (standalone l at end of word/number)
  result = result.replace(/(\d+)\s*l(?!t|\w)/gi, '$1 ltr');
  // Transform dose: 10g -> 10 gram (standalone g at end)
  result = result.replace(/(\d+)\s*g(?!r|\w)/gi, '$1 gram');

  return result;
};

const WEATHER_CONDITIONS: { value: WeatherCondition; label: string }[] = [
  { value: 'cerah', label: 'Cerah' },
  { value: 'mendung', label: 'Mendung' },
  { value: 'berawan', label: 'Berawan' },
  { value: 'hujan_gerimis', label: 'Hujan Gerimis' },
  { value: 'hujan_deras', label: 'Hujan Beras' },
];

const ActivityForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { addActivity } = useActivities();
  const { plants } = usePlants();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [plantSearch, setPlantSearch] = useState('');

  type TargetScope = 'variety' | 'category' | 'group';

  const [formData, setFormData] = useState({
    targetScope: 'variety' as TargetScope,
    targetValue: '',
    plantId: '',
    type: 'pupuk' as ActivityType,
    productName: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    dosis: '',
    volume: '',
    method: 'spray',
    condition: 'cerah' as WeatherCondition,
  });

  const categories = useMemo(() => {
    const raw = plants.map((p) => (p.categoryId || '').trim()).filter(Boolean);
    const unique = new Map<string, string>();
    raw.forEach((cat) => {
      const lower = cat.toLowerCase();
      if (!unique.has(lower)) {
        unique.set(lower, cat);
      }
    });
    return Array.from(unique.values()).sort((a, b) => a.localeCompare(b));
  }, [plants]);

  const groups = useMemo(() => {
    const raw = plants.map((p) => (p.groupId || '').trim()).filter(Boolean);
    const unique = new Map<string, string>();
    raw.forEach((grp) => {
      const lower = grp.toLowerCase();
      if (!unique.has(lower)) {
        unique.set(lower, grp);
      }
    });
    return Array.from(unique.values()).sort((a, b) => a.localeCompare(b));
  }, [plants]);

  // Sort plants by categoryId first, then by variety
  const sortedPlants = useMemo(() => {
    return [...plants].sort((a, b) => {
      const catA = (a.categoryId || '').toLowerCase();
      const catB = (b.categoryId || '').toLowerCase();
      if (catA < catB) return -1;
      if (catA > catB) return 1;
      // If same category, sort by variety
      const varA = (a.variety || '').toLowerCase();
      const varB = (b.variety || '').toLowerCase();
      return varA.localeCompare(varB);
    });
  }, [plants]);

  // Filter and group plants by category for dropdown
  const groupedPlants: [string, typeof plants][] = useMemo(() => {
    const search = plantSearch.toLowerCase().trim();
    const filtered = sortedPlants.filter((plant) => {
      if (!search) return true;
      const categoryMatch = (plant.categoryId || '')
        .toLowerCase()
        .includes(search);
      const varietyMatch = (plant.variety || '').toLowerCase().includes(search);
      const nameMatch = (plant.name || '').toLowerCase().includes(search);
      return categoryMatch || varietyMatch || nameMatch;
    });

    // Group by first word of category (case-insensitive)
    // This handles cases where variety is stored in categoryId (e.g., "Drosera Spatulata" -> group by "Drosera")
    const groups: Record<string, { display: string; plants: typeof plants }> =
      {};
    filtered.forEach((plant) => {
      const catRaw = plant.categoryId || 'Unknown';
      // Use first word (up to first space) as the group key for better grouping
      const catKey = catRaw.toLowerCase().split(' ')[0];
      if (!groups[catKey]) {
        // Capitalize first letter for display
        groups[catKey] = {
          display: catKey.charAt(0).toUpperCase() + catKey.slice(1),
          plants: [],
        };
      }
      groups[catKey].plants.push(plant);
    });

    // Sort and convert to array format
    return Object.entries(groups)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(
        ([_key, value]) =>
          [value.display, value.plants] as [string, typeof plants]
      );
  }, [sortedPlants, plantSearch]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setPreviewUrls([]);
    setUploadProgress(null);
  };

  const saveActivity = async (finalPhotoUrls: string[] = []) => {
    const activityDate = new Date(formData.date);

    // Clean up data based on activity type
    const isTreatment = ['pupuk', 'fungisida', 'insektisida'].includes(
      formData.type
    );
    const cleanedData = {
      ...formData,
      productName: isTreatment ? formData.productName : '',
      dosis: isTreatment ? transformDosisVolume(formData.dosis) : '',
      volume: isTreatment ? transformDosisVolume(formData.volume) : '',
      method: isTreatment ? formData.method : '',
      photoUrls: finalPhotoUrls,
      // For backward compatibility if needed:
      photoUrl: finalPhotoUrls.length > 0 ? finalPhotoUrls[0] : '',
      date: Timestamp.fromDate(activityDate),
    };

    await addActivity(cleanedData);

    setFormData({
      ...formData,
      description: '',
      dosis: '',
      volume: '',
      productName: '',
    });
    clearFiles();
    if (onSuccess) onSuccess();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.targetScope === 'variety' && !formData.plantId) {
      alert('Pilih tanaman terlebih dahulu');
      return;
    }

    const activityDate = new Date(formData.date);
    if (isNaN(activityDate.getTime())) {
      alert('Tanggal tidak valid');
      return;
    }

    setLoading(true);
    try {
      const photoUrls: string[] = [];
      if (selectedFiles.length > 0 && user) {
        setIsUploading(true);
        try {
          // Upload files one by one
          for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const url = await activityService.uploadImage(
              user.uid,
              file,
              (prog) => {
                // Approximate overall progress
                const overallProg =
                  ((i + prog / 100) / selectedFiles.length) * 100;
                setUploadProgress(Math.round(overallProg));
              }
            );
            photoUrls.push(url);
          }
        } catch (uploadError) {
          console.error(
            'Upload failed, but offering silent save:',
            uploadError
          );
          const proceed = confirm(
            'Gagal mengunggah foto. Simpan aktivitas tanpa foto?'
          );
          if (!proceed) throw uploadError;
          // Otherwise proceed with empty photoUrls
        }
        setIsUploading(false);
      }

      await saveActivity(photoUrls);
    } catch (error) {
      console.error('Form Error:', error);
      const msg = error instanceof Error ? error.message : 'Terjadi kesalahan.';
      alert(msg);
    } finally {
      setLoading(false);
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleSkipUpload = async () => {
    if (!confirm('Hentikan upload dan simpan data saja?')) return;

    setLoading(true);
    setIsUploading(false);
    try {
      await saveActivity([]);
    } catch (error) {
      alert(
        'Gagal menyimpan: ' + (error instanceof Error ? error.message : 'Error')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleScopeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      targetScope: e.target.value as TargetScope,
      targetValue: '',
      plantId: '',
    });
  };

  const showTreatmentFields = ['pupuk', 'fungisida', 'insektisida'].includes(
    formData.type
  );

  return (
    <form
      onSubmit={handleSubmit}
      className='card'
      style={{ marginBottom: '2rem', width: '100%', maxWidth: '800px' }}
    >
      <h2
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: 'var(--text-primary)',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--secondary-100)',
            color: 'var(--secondary-600)',
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
          }}
        >
          <Sprout size={24} />
        </div>
        Catat Aktivitas
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div className='input-group'>
          <label>Target Aktivitas</label>
          <select value={formData.targetScope} onChange={handleScopeChange}>
            <option value='variety'>Per Tanaman</option>
            <option value='category'>Per Kategori (Bulk)</option>
            <option value='group'>Per Kelompok (Bulk)</option>
          </select>
        </div>

        <div className='input-group'>
          <label>
            Pilih{' '}
            {formData.targetScope === 'variety'
              ? 'Tanaman'
              : formData.targetScope === 'category'
                ? 'Kategori'
                : 'Kelompok'}
          </label>
          {formData.targetScope === 'variety' ? (
            <>
              <input
                type='text'
                placeholder='Cari tanaman...'
                value={plantSearch}
                onChange={(e) => setPlantSearch(e.target.value)}
                style={{
                  marginBottom: '0.5rem',
                  padding: '0.5rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  width: '100%',
                  fontSize: '0.875rem',
                }}
              />
              <select
                value={formData.plantId || ''}
                onChange={(e) => {
                  const selectedPlantId = e.target.value;
                  if (!selectedPlantId) {
                    setFormData({
                      ...formData,
                      plantId: '',
                      targetValue: '',
                    });
                    return;
                  }
                  // Find the selected plant to get its display text
                  const selectedPlant = plants.find(
                    (p) => p.id === selectedPlantId
                  );
                  setFormData({
                    ...formData,
                    plantId: selectedPlantId,
                    targetValue: selectedPlant
                      ? `${selectedPlant.categoryId} - ${selectedPlant.variety} (${selectedPlant.name})`
                      : '',
                  });
                }}
                required
              >
                <option value=''>
                  {plantSearch && groupedPlants.length > 0
                    ? `-- Pilih dari ${groupedPlants.reduce(
                        (acc, [, pl]) => acc + pl.length,
                        0
                      )} hasil --`
                    : '-- Pilih Tanaman --'}
                </option>
                {groupedPlants.map(([category, plantsInCategory]) => (
                  <optgroup key={category} label={category}>
                    {plantsInCategory.map((plant) => (
                      <option key={plant.id} value={plant.id}>
                        {plant.variety} ({plant.name})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </>
          ) : (
            <select
              value={formData.targetValue}
              onChange={(e) =>
                setFormData({ ...formData, targetValue: e.target.value })
              }
              required
            >
              <option value=''>
                -- Pilih{' '}
                {formData.targetScope === 'category' ? 'Kategori' : 'Kelompok'}{' '}
                --
              </option>
              {(formData.targetScope === 'category' ? categories : groups).map(
                (v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                )
              )}
            </select>
          )}
        </div>
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
      >
        <div className='input-group'>
          <label>Jenis Aktivitas</label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as ActivityType })
            }
          >
            {ACTIVITY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className='input-group'>
          <label>Tanggal</label>
          <input
            type='date'
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
      </div>

      {showTreatmentFields && (
        <>
          <div className='input-group'>
            <label>Nama Produk</label>
            <input
              type='text'
              placeholder='Contoh: Acrobat 50WP'
              value={formData.productName}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
              required={showTreatmentFields}
            />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '1rem',
            }}
          >
            <div className='input-group'>
              <label>Dosis (e.g. 1 gr/lt)</label>
              <input
                type='text'
                placeholder='1 gr/liter'
                value={formData.dosis}
                onChange={(e) =>
                  setFormData({ ...formData, dosis: e.target.value })
                }
              />
            </div>
            <div className='input-group'>
              <label>Volume (e.g. 5 lt)</label>
              <input
                type='text'
                placeholder='5 liter'
                value={formData.volume}
                onChange={(e) =>
                  setFormData({ ...formData, volume: e.target.value })
                }
              />
            </div>
            <div className='input-group'>
              <label>Metode</label>
              <select
                value={formData.method}
                onChange={(e) =>
                  setFormData({ ...formData, method: e.target.value })
                }
              >
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      <div className='input-group'>
        <label>Kondisi Cuaca</label>
        <select
          value={formData.condition}
          onChange={(e) =>
            setFormData({
              ...formData,
              condition: e.target.value as WeatherCondition,
            })
          }
        >
          {WEATHER_CONDITIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className='input-group'>
        <label>Keterangan / Deskripsi</label>
        <textarea
          rows={3}
          placeholder='Contoh: kondisi mendung, spray merata ke daun'
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div className='input-group'>
        <label>Foto Monitoring (Optional)</label>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            border: '2px dashed var(--neutral-200)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            backgroundColor: 'var(--bg-color)',
          }}
        >
          <input
            id='photo-upload'
            type='file'
            accept='image/*'
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <div
            onClick={() => document.getElementById('photo-upload')?.click()}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--neutral-500)',
              padding: '1rem',
              border: '2px dashed transparent',
              transition: 'var(--transition)',
            }}
          >
            <ImageIcon size={32} />
            <span>Klik untuk tambah foto (Bisa banyak)</span>
          </div>

          {previewUrls.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '1rem',
                marginTop: '1rem',
              }}
            >
              {previewUrls.map((url, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    aspectRatio: '1/1',
                  }}
                >
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-sm)',
                      display: 'block',
                    }}
                  />
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      zIndex: 10,
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--primary-50)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--primary-700)',
            fontSize: '0.875rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.5rem',
            }}
          >
            <Loader2 className='animate-spin' size={20} />
            <strong>
              {uploadProgress !== null
                ? `Mengunggah foto... (${uploadProgress}%)`
                : 'Menyimpan data...'}
            </strong>
          </div>
          {isUploading && uploadProgress === 0 && (
            <div
              style={{
                borderTop: '1px solid var(--primary-200)',
                paddingTop: '0.5rem',
                marginTop: '0.5rem',
              }}
            >
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem' }}>
                Progres 0% mungkin karena Firebase Storage belum aktif.
              </p>
              <button
                type='button'
                onClick={handleSkipUpload}
                className='btn'
                style={{
                  backgroundColor: 'white',
                  color: 'var(--primary-700)',
                  border: '1px solid var(--primary-300)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.75rem',
                }}
              >
                <Save size={14} /> Lewati Foto & Simpan Saja
              </button>
            </div>
          )}
        </div>
      )}

      <button
        type='submit'
        className='btn btn-primary'
        style={{ width: '100%', marginTop: '1rem' }}
        disabled={loading}
      >
        {loading ? 'Sedang Memproses...' : 'Simpan Aktivitas'}
      </button>
    </form>
  );
};

export default ActivityForm;
