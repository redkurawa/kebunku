import React, { useState } from 'react';
import PlantManager from '../components/PlantManager';
import ActivityForm from '../components/ActivityForm';
import Timeline from '../components/Timeline';
import { LayoutGrid, PlusCircle, History } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plants' | 'activity' | 'history'>(
    'activity'
  );

  return (
    <div className='dashboard-wrapper'>
      <div className='mobile-tabs'>
        <button
          className={`btn ${activeTab === 'activity' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('activity')}
          style={{
            backgroundColor:
              activeTab === 'activity' ? 'var(--primary-600)' : 'transparent',
            color: activeTab === 'activity' ? 'white' : 'var(--text-secondary)',
            border:
              activeTab === 'activity'
                ? 'none'
                : '1px solid var(--border-color)',
          }}
        >
          <PlusCircle size={18} /> Catat
        </button>
        <button
          className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('history')}
          style={{
            backgroundColor:
              activeTab === 'history' ? 'var(--primary-600)' : 'transparent',
            color: activeTab === 'history' ? 'white' : 'var(--text-secondary)',
            border:
              activeTab === 'history'
                ? 'none'
                : '1px solid var(--border-color)',
          }}
        >
          <History size={18} /> Riwayat
        </button>
        <button
          className={`btn ${activeTab === 'plants' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('plants')}
          style={{
            backgroundColor:
              activeTab === 'plants' ? 'var(--primary-600)' : 'transparent',
            color: activeTab === 'plants' ? 'white' : 'var(--text-secondary)',
            border:
              activeTab === 'plants' ? 'none' : '1px solid var(--border-color)',
          }}
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
