import React, { useState, useMemo, type ChangeEvent } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useActivities } from '../hooks/useActivities';
import { usePlants } from '../hooks/usePlants';
import { useAuth } from '../hooks/useAuth';
import { type ActivityType, type WeatherCondition, activityService } from '../services/activityService';
import { Sprout, Loader2, Image as ImageIcon, X, Save } from 'lucide-react';

const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
    { value: 'pupuk', label: '🧪 Pupuk' },
    { value: 'fungisida', label: '🛡️ Fungsida' },
    { value: 'insektisida', label: '🪲 Insectisida' },
    { value: 'monitor', label: '👁️ Monitor' },
    { value: 'new_comer', label: '🆕 Tanaman Baru' },
    { value: 'pangkas', label: '✂️ Pangkas' },
    { value: 'semai', label: '🌱 Semai' },
    { value: 'hama_penyakit', label: '⚠️ Hama/Penyakit' },
    { value: 'panen_lainnya', label: '🧺 Panen/Lainnya' },
    { value: 'pisah_anakan', label: '🪴 Pisah Anakan' },
];

const METHODS = ['spray', 'kocor', 'tabur', 'tanam', 'lainnya'];

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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

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
        return Array.from(new Set(plants.map(p => p.categoryId))).sort();
    }, [plants]);

    const groups = useMemo(() => {
        return Array.from(new Set(plants.map(p => p.groupId))).sort();
    }, [plants]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadProgress(null);
    };

    const saveActivity = async (finalPhotoUrl: string = '') => {
        const activityDate = new Date(formData.date);
        await addActivity({
            ...formData,
            photoUrl: finalPhotoUrl,
            date: Timestamp.fromDate(activityDate),
        });

        setFormData({
            ...formData,
            description: '',
            dosis: '',
            volume: '',
            productName: '',
        });
        clearFile();
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
            let photoUrl = '';
            if (selectedFile && user) {
                setIsUploading(true);
                try {
                    photoUrl = await activityService.uploadImage(user.uid, selectedFile, (prog) => {
                        setUploadProgress(Math.round(prog));
                    });
                } catch (uploadError) {
                    console.error('Upload failed, but offering silent save:', uploadError);
                    const proceed = confirm('Gagal mengunggah foto (Kemungkinan Firebase Storage belum aktif). Simpan aktivitas tanpa foto?');
                    if (!proceed) throw uploadError;
                    // Otherwise proceed with empty photoUrl
                }
                setIsUploading(false);
            }

            await saveActivity(photoUrl);
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
            await saveActivity('');
        } catch (error) {
            alert('Gagal menyimpan: ' + (error instanceof Error ? error.message : 'Error'));
        } finally {
            setLoading(false);
        }
    };

    const handleScopeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setFormData({
            ...formData,
            targetScope: e.target.value as TargetScope,
            targetValue: '',
            plantId: ''
        });
    };

    const showTreatmentFields = ['pupuk', 'fungisida', 'insektisida'].includes(formData.type);

    return (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }}>
                <div style={{ backgroundColor: 'var(--secondary-100)', color: 'var(--secondary-600)', padding: '0.5rem', borderRadius: 'var(--radius-md)', display: 'flex' }}>
                    <Sprout size={24} />
                </div>
                Catat Aktivitas
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="input-group">
                    <label>Target Aktivitas</label>
                    <select value={formData.targetScope} onChange={handleScopeChange}>
                        <option value="variety">Per Tanaman</option>
                        <option value="category">Per Kategori (Bulk)</option>
                        <option value="group">Per Kelompok (Bulk)</option>
                    </select>
                </div>

                <div className="input-group">
                    <label>Pilih {formData.targetScope === 'variety' ? 'Tanaman' : formData.targetScope === 'category' ? 'Kategori' : 'Kelompok'}</label>
                    {formData.targetScope === 'variety' ? (
                        <select
                            value={formData.plantId}
                            onChange={(e) => {
                                const selected = e.target.selectedOptions[0];
                                setFormData({
                                    ...formData,
                                    plantId: e.target.value,
                                    targetValue: selected ? selected.text : ''
                                });
                            }}
                            required
                        >
                            <option value="">-- Pilih Tanaman --</option>
                            {plants.map((plant) => (
                                <option key={plant.id} value={plant.id}>
                                    {plant.categoryId} - {plant.variety} ({plant.name})
                                </option>
                            ))}
                        </select>
                    ) : (
                        <select
                            value={formData.targetValue}
                            onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                            required
                        >
                            <option value="">-- Pilih {formData.targetScope === 'category' ? 'Kategori' : 'Kelompok'} --</option>
                            {(formData.targetScope === 'category' ? categories : groups).map((v) => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                    <label>Jenis Aktivitas</label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as ActivityType })}
                    >
                        {ACTIVITY_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>

                <div className="input-group">
                    <label>Tanggal</label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                    />
                </div>
            </div>

            {showTreatmentFields && (
                <>
                    <div className="input-group">
                        <label>Nama Produk</label>
                        <input
                            type="text"
                            placeholder="Contoh: Acrobat 50WP"
                            value={formData.productName}
                            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                            required={showTreatmentFields}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div className="input-group">
                            <label>Dosis (e.g. 1 gr/lt)</label>
                            <input
                                type="text"
                                placeholder="1 gr/liter"
                                value={formData.dosis}
                                onChange={(e) => setFormData({ ...formData, dosis: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Volume (e.g. 5 lt)</label>
                            <input
                                type="text"
                                placeholder="5 liter"
                                value={formData.volume}
                                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Metode</label>
                            <select
                                value={formData.method}
                                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                            >
                                {METHODS.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </>
            )}

            <div className="input-group">
                <label>Kondisi Cuaca</label>
                <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as WeatherCondition })}
                >
                    {WEATHER_CONDITIONS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
            </div>

            <div className="input-group">
                <label>Keterangan / Deskripsi</label>
                <textarea
                    rows={3}
                    placeholder="Contoh: kondisi mendung, spray merata ke daun"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="input-group">
                <label>Foto Monitoring (Optional)</label>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    border: '2px dashed var(--neutral-200)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: 'var(--bg-color)'
                }} onClick={() => document.getElementById('photo-upload')?.click()}>
                    <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    {!previewUrl ? (
                        <div style={{ color: 'var(--neutral-500)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <ImageIcon size={32} />
                            <span>Klik untuk upload foto</span>
                        </div>
                    ) : (
                        <div style={{ position: 'relative', display: 'inline-block', alignSelf: 'center' }}>
                            <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 'var(--radius-sm)', display: 'block' }} />
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                                style={{
                                    position: 'absolute', top: '-10px', right: '-10px', backgroundColor: 'var(--neutral-800)',
                                    color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer'
                                }}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {loading && (
                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: 'var(--primary-50)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--primary-700)',
                    fontSize: '0.875rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <Loader2 className="animate-spin" size={20} />
                        <strong>{uploadProgress !== null ? `Mengunggah foto... (${uploadProgress}%)` : 'Menyimpan data...'}</strong>
                    </div>
                    {isUploading && uploadProgress === 0 && (
                        <div style={{ borderTop: '1px solid var(--primary-200)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem' }}>Progres 0% mungkin karena Firebase Storage belum aktif.</p>
                            <button
                                type="button"
                                onClick={handleSkipUpload}
                                className="btn"
                                style={{
                                    backgroundColor: 'white',
                                    color: 'var(--primary-700)',
                                    border: '1px solid var(--primary-300)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.75rem'
                                }}
                            >
                                <Save size={14} /> Lewati Foto & Simpan Saja
                            </button>
                        </div>
                    )}
                </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                {loading ? 'Sedang Memproses...' : 'Simpan Aktivitas'}
            </button>
        </form>
    );
};

export default ActivityForm;
