import React, { useState, useMemo } from 'react';
import { useActivities } from '../hooks/useActivities';
import { usePlants } from '../hooks/usePlants';
import { format } from 'date-fns';
import {
    ClipboardList,
    Trash2,
    Sun,
    Cloud,
    CloudRain,
    Droplets,
    CloudSun,
    Beaker,
    Bug,
    Eye,
    PlusCircle,
    Scissors,
    Sprout,
    Grape,
    Layers,
    AlertCircle,
    Maximize2,
    X,
    GitBranch,
    type LucideIcon
} from 'lucide-react';

const WEATHER_ICONS: Record<string, LucideIcon> = {
    cerah: Sun,
    mendung: Cloud,
    berawan: CloudSun,
    hujan_gerimis: Droplets,
    hujan_deras: CloudRain,
};

const ACTIVITY_ICONS: Record<string, LucideIcon> = {
    pupuk: Sprout,
    fungisida: Beaker,
    insektisida: Bug,
    monitor: Eye,
    new_comer: PlusCircle,
    pangkas: Scissors,
    semai: Sprout,
    hama_penyakit: Bug,
    panen_lainnya: Grape,
    pisah_anakan: GitBranch,
};

const ALL_ACTIVITY_TYPES = [
    { value: 'all', label: 'Semua', icon: ClipboardList },
    { value: 'pupuk', label: 'Pupuk', icon: Sprout },
    { value: 'fungisida', label: 'Fungsida', icon: Beaker },
    { value: 'insektisida', label: 'Insectisida', icon: Bug },
    { value: 'monitor', label: 'Monitor', icon: Eye },
    { value: 'new_comer', label: 'Tanaman Baru', icon: PlusCircle },
    { value: 'pangkas', label: 'Pangkas', icon: Scissors },
    { value: 'semai', label: 'Semai', icon: Sprout },
    { value: 'hama_penyakit', label: 'Hama/Penyakit', icon: Bug },
    { value: 'panen_lainnya', label: 'Panen/Lainnya', icon: Grape },
    { value: 'pisah_anakan', label: 'Pisah Anakan', icon: GitBranch },
];

const Timeline: React.FC = () => {
    const { activities, deleteActivity, loading, error } = useActivities();
    const { plants } = usePlants();
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('all');

    const filteredActivities = useMemo(() => {
        if (activeFilter === 'all') return activities;
        return activities.filter(a => a.type === activeFilter);
    }, [activities, activeFilter]);

    const getPlantInfo = (plantId: string) => {
        return plants.find(p => p.id === plantId);
    };

    if (loading) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Memuat riwayat...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card" style={{
                textAlign: 'center',
                padding: '2rem',
                border: '1px solid #fee2e2',
                backgroundColor: '#fef2f2'
            }}>
                <AlertCircle size={48} style={{ margin: '0 auto 1rem', color: '#ef4444' }} />
                <h3 style={{ color: '#991b1b', marginBottom: '0.5rem' }}>Terjadi Kesalahan</h3>
                <p style={{ color: '#b91c1c', fontSize: '0.875rem' }}>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="btn btn-primary"
                    style={{ marginTop: '1rem', backgroundColor: '#ef4444' }}
                >
                    Muat Ulang Halaman
                </button>
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <ClipboardList size={48} style={{ margin: '0 auto 1rem', color: 'var(--neutral-300)' }} />
                <p style={{ color: 'var(--neutral-500)' }}>Belum ada aktivitas yang dicatat.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ClipboardList className="text-primary-600" /> Riwayat Aktivitas
                </h2>
                <span style={{ fontSize: '0.875rem', color: 'var(--neutral-500)' }}>
                    {filteredActivities.length} {activeFilter === 'all' ? 'Aktivitas' : `Aktivitas ${activeFilter.replace('_', ' ')}`}
                </span>
            </div>

            {/* Filter Bar */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                marginBottom: '0.5rem',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }} className="hide-scrollbar">
                {ALL_ACTIVITY_TYPES.map((type) => {
                    const FilterIcon = type.icon;
                    const isActive = activeFilter === type.value;
                    return (
                        <button
                            key={type.value}
                            onClick={() => setActiveFilter(type.value)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.4rem 0.8rem',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                border: '1px solid',
                                transition: 'var(--transition)',
                                backgroundColor: isActive ? 'var(--primary-600)' : 'white',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                borderColor: isActive ? 'var(--primary-600)' : 'var(--border-color)',
                            }}
                        >
                            <FilterIcon size={14} />
                            {type.label}
                        </button>
                    );
                })}
            </div>

            {filteredActivities.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <ClipboardList size={40} style={{ margin: '0 auto 1rem', color: 'var(--neutral-300)' }} />
                    <p style={{ color: 'var(--neutral-500)' }}>Tidak ada aktivitas untuk filter ini.</p>
                </div>
            ) : filteredActivities.map((activity) => {
                const plant = activity.targetScope === 'variety' ? getPlantInfo(activity.plantId) : null;
                const Icon = ACTIVITY_ICONS[activity.type] || ClipboardList;
                const WeatherIcon = WEATHER_ICONS[activity.condition] || Cloud;

                const targetLabel = activity.targetScope === 'variety'
                    ? (plant ? `${plant.categoryId} - ${plant.variety}` : 'Tanaman dihapus')
                    : (activity.targetScope === 'category' ? `Kategori: ${activity.targetValue}` : `Kelompok: ${activity.targetValue}`);

                // Defensive date handling
                let dateStr = 'Tanggal tidak valid';
                try {
                    if (activity.date && typeof activity.date.toDate === 'function') {
                        dateStr = format(activity.date.toDate(), 'eeee, d MMM yyyy');
                    }
                } catch (e) {
                    console.error('Error formatting date:', e);
                }

                return (
                    <div key={activity.id} className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    backgroundColor: activity.targetScope === 'variety' ? 'var(--primary-100)' : 'var(--secondary-100)',
                                    color: activity.targetScope === 'variety' ? 'var(--primary-700)' : 'var(--secondary-700)',
                                    padding: '0.5rem',
                                    borderRadius: 'var(--radius-md)'
                                }}>
                                    {activity.targetScope === 'variety' ? <Icon size={20} /> : <Layers size={20} />}
                                </div>
                                <div>
                                    <h4 style={{ textTransform: 'capitalize' }}>
                                        {activity.type === 'new_comer' ? 'tanaman baru' : activity.type.replace('_', ' ')}: {targetLabel}
                                    </h4>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--neutral-500)' }}>
                                        {dateStr}
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--neutral-500)', fontSize: '0.8125rem' }}>
                                    {activity.condition && <WeatherIcon size={16} />}
                                    <span style={{ textTransform: 'capitalize' }}>{activity.condition ? activity.condition.replace('_', ' ') : '-'}</span>
                                </div>
                                <button
                                    onClick={() => confirm('Hapus aktivitas ini?') && deleteActivity(activity.id!)}
                                    style={{ color: 'var(--neutral-400)' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div style={{ fontSize: '0.9375rem', color: 'var(--neutral-700)', marginLeft: '3.25rem' }}>
                            {activity.productName && (
                                <div style={{ marginBottom: '0.4rem' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        backgroundColor: 'var(--primary-600)',
                                        color: 'white',
                                        padding: '0.125rem 0.5rem',
                                        borderRadius: '999px',
                                        fontWeight: 600
                                    }}>
                                        📦 {activity.productName}
                                    </span>
                                </div>
                            )}
                            {activity.description && <p style={{ marginBottom: '0.5rem' }}>{activity.description}</p>}

                            {activity.photoUrl && (
                                <div style={{
                                    position: 'relative',
                                    width: 'fit-content',
                                    marginTop: '0.75rem',
                                    marginBottom: '1rem'
                                }}>
                                    <img
                                        src={activity.photoUrl}
                                        alt="Monitoring"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '150px',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                            display: 'block'
                                        }}
                                        onClick={() => setFullscreenImage(activity.photoUrl!)}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '8px',
                                        right: '8px',
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        color: 'white',
                                        padding: '4px',
                                        borderRadius: '4px',
                                        pointerEvents: 'none'
                                    }}>
                                        <Maximize2 size={12} />
                                    </div>
                                </div>
                            )}

                            {(activity.dosis || activity.volume || activity.method) && (
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '0.75rem',
                                    fontSize: '0.8125rem',
                                    backgroundColor: 'var(--neutral-100)',
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: 'var(--radius-sm)',
                                    width: 'fit-content'
                                }}>
                                    {activity.dosis && <span><strong>Dosis:</strong> {activity.dosis}</span>}
                                    {activity.volume && <span><strong>Volume:</strong> {activity.volume}</span>}
                                    {activity.method && <span style={{ textTransform: 'capitalize' }}><strong>Metode:</strong> {activity.method}</span>}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {fullscreenImage && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '2rem'
                }} onClick={() => setFullscreenImage(null)}>
                    <button style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        color: 'white',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}>
                        <X size={32} />
                    </button>
                    <img
                        src={fullscreenImage}
                        alt="Fullscreen"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain'
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default Timeline;
