import React, { useState } from 'react';
import PlantManager from '../components/PlantManager';
import ActivityForm from '../components/ActivityForm';
import Timeline from '../components/Timeline';
import { LayoutGrid, PlusCircle, History } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'plants' | 'activity' | 'history'>('activity');

    return (
        <div className="dashboard-wrapper">
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                backgroundColor: 'var(--neutral-100)',
                padding: '0.25rem',
                borderRadius: 'var(--radius-lg)',
                width: 'fit-content'
            }}>
                <button
                    className={`btn ${activeTab === 'activity' ? 'btn-primary' : ''}`}
                    onClick={() => setActiveTab('activity')}
                    style={{ padding: '0.5rem 1rem' }}
                >
                    <PlusCircle size={18} /> Catat
                </button>
                <button
                    className={`btn ${activeTab === 'history' ? 'btn-primary' : ''}`}
                    onClick={() => setActiveTab('history')}
                    style={{ padding: '0.5rem 1rem' }}
                >
                    <History size={18} /> Riwayat
                </button>
                <button
                    className={`btn ${activeTab === 'plants' ? 'btn-primary' : ''}`}
                    onClick={() => setActiveTab('plants')}
                    style={{ padding: '0.5rem 1rem' }}
                >
                    <LayoutGrid size={18} /> Tanaman
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                {activeTab === 'activity' && (
                    <div>
                        <ActivityForm onSuccess={() => setActiveTab('history')} />
                    </div>
                )}

                {activeTab === 'history' && (
                    <div>
                        <Timeline />
                    </div>
                )}

                {activeTab === 'plants' && (
                    <div>
                        <PlantManager />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
