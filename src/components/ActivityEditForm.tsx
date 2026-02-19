import React, { useState, useMemo, type ChangeEvent } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useActivities } from '../hooks/useActivities';
import { usePlants } from '../hooks/usePlants';
import { useAuth } from '../hooks/useAuth';
import {
  type ActivityType,
  type WeatherCondition,
  type Activity,
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

interface ActivityEditFormProps {
  activity: Activity;
  onSuccess: () => void;
  onCancel: () => void;
}

const ActivityEditForm: React.FC<ActivityEditFormProps> = ({
  activity,
  onSuccess,
  onCancel,
}) => {
  const { updateActivity } = useActivities();
  const { plants } = usePlants();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  type TargetScope = 'variety' | 'category' | 'group';

  // Parse existing date from activity
  const getInitialDate = () => {
    try {
      if (activity.date && typeof activity.date.toDate === 'function') {
        const date = activity.date.toDate();
        return date.toISOString().split('T')[0];
      }
    } catch (e) {
      console.error('Error parsing date:', e);
    }
    return new Date().toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    targetScope: (activity.targetScope || 'variety') as TargetScope,
    targetValue: activity.targetValue || '',
    plantId: activity.plantId || '',
    type: activity.type || 'pupuk',
    productName: activity.productName || '',
    date: getInitialDate(),
    description: activity.description || '',
    dosis: activity.dosis || '',
    volume: activity.volume || '',
    method: activity.method || 'spray',
    condition: activity.condition || 'cerah',
    existingPhotoUrls: activity.photoUrls || (activity.photoUrl ? [activity.photoUrl] : []),
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

  const removeExistingPhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      existingPhotoUrls: prev.existingPhotoUrls.filter((_, i) => i !== index),
    }));
  };



  const saveActivity = async (finalPhotoUrls: string[] = []) => {
    const activityDate = new Date(formData.date);

    // Clean up data based on activity type
    const isTreatment = ['pupuk', 'fungisida', 'insektisida'].includes(
      formData.type
    );
    const cleanedData: Partial<Activity> = {
      targetScope: formData.targetScope,
      targetValue: formData.targetValue,
      plantId: formData.plantId,
      type: formData.type as ActivityType,
      productName: isTreatment ? formData.productName : '',
      dosis: isTreatment ? transformDosisVolume(formData.dosis) : '',
      volume: isTreatment ? transformDosisVolume(formData.volume) : '',
      method: isTreatment ? formData.method : '',
      description: formData.description,
      condition: formData.condition as WeatherCondition,
      photoUrls: finalPhotoUrls,
      photoUrl: finalPhotoUrls.length > 0 ? finalPhotoUrls[0] : '',
      date: Timestamp.fromDate(activityDate),
    };

    await updateActivity(activity.id!, cleanedData);
    onSuccess();
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
      const photoUrls: string[] = [...formData.existingPhotoUrls];
      
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
            'Gagal mengunggah foto baru. Simpan perubahan tanpa foto baru?'
          );
          if (!proceed) throw uploadError;
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
      await saveActivity(formData.existingPhotoUrls);
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
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
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
            <select
              value={formData.plantId}
              onChange={(e) => {
                const selected = e.target.selectedOptions[0];
                setFormData({
                  ...formData,
                  plantId: e.target.value,
                  targetValue: selected ? selected.text : '',
                });
              }}
              required
            >
              <option value=''>-- Pilih Tanaman --</option>
              {plants.map((plant) => (
                <option key={plant.id} value={plant.id}>
                  {plant.categoryId} - {plant.variety} ({plant.name})
                </option>
              ))}
            </select>
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

      {/* Existing Photos */}
      {formData.existingPhotoUrls.length > 0 && (
        <div className='input-group'>
          <label>Foto Tersimpan</label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '1rem',
            }}
          >
            {formData.existingPhotoUrls.map((url, index) => (
              <div
                key={`existing-${index}`}
                style={{
                  position: 'relative',
                  aspectRatio: '1/1',
                }}
              >
                <img
                  src={url}
                  alt={`Existing ${index}`}
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
                  onClick={() => removeExistingPhoto(index)}
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
        </div>
      )}

      <div className='input-group'>
        <label>Tambah Foto Baru (Optional)</label>
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
            id='edit-photo-upload'
            type='file'
            accept='image/*'
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <div
            onClick={() => document.getElementById('edit-photo-upload')?.click()}
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
            <span>Klik untuk tambah foto baru (Bisa banyak)</span>
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
                  key={`new-${index}`}
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
                : 'Menyimpan perubahan...'}
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

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        <button
          type='button'
          className='btn'
          onClick={onCancel}
          disabled={loading}
          style={{ flex: 1 }}
        >
          Batal
        </button>
        <button
          type='submit'
          className='btn btn-primary'
          disabled={loading}
          style={{ flex: 1 }}
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </form>
  );
};

export default ActivityEditForm;
