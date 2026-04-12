import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronRight, Star, X } from 'lucide-react';
import { type Plant } from '../services/plantService';

interface PlantOption {
  id: string;
  name: string;
  categoryId: string;
  groupId: string;
}

interface PlantSelectProps {
  plants: Plant[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const STORAGE_KEY = 'kebunku_favorite_plants';

const getFavorites = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [] as string[];
  }
};

const saveFavorites = (ids: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignore storage errors
  }
};

export const PlantSelect: React.FC<PlantSelectProps> = ({
  plants,
  value,
  onChange,
  placeholder = 'Pilih Tanaman',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<string[]>(() => getFavorites());
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const plantOptions: PlantOption[] = useMemo(() => {
    return plants
      .filter(p => p.id)
      .map(p => ({
        id: p.id!,
        name: p.categoryId ? `${p.categoryId} - ${p.variety}` : p.variety,
        categoryId: p.categoryId || 'Lainnya',
        groupId: p.groupId || 'lain',
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [plants]);

  const filteredPlants = useMemo(() => {
    if (!search.trim()) return plantOptions;
    const query = search.toLowerCase();
    return plantOptions.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.categoryId.toLowerCase().includes(query)
    );
  }, [plantOptions, search]);

  const groupedPlants = useMemo(() => {
    const groups: Record<string, PlantOption[]> = {};
    filteredPlants.forEach(p => {
      if (!groups[p.categoryId]) {
        groups[p.categoryId] = [];
      }
      groups[p.categoryId].push(p);
    });
    return groups;
  }, [filteredPlants]);

  const favoritePlants = useMemo(() => {
    return plantOptions.filter(p => favorites.includes(p.id));
  }, [plantOptions, favorites]);

  const selectedPlant = useMemo(() => {
    return plantOptions.find(p => p.id === value);
  }, [plantOptions, value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleFavorite = (e: React.MouseEvent, plantId: string) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(plantId)
      ? favorites.filter(id => id !== plantId)
      : [...favorites, plantId].slice(-10);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const handleSelect = (plantId: string) => {
    onChange(plantId);
    setIsOpen(false);
    setSearch('');
  };

  const toggleGroup = (categoryId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', minWidth: '200px' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.6rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          backgroundColor: 'white',
          cursor: 'pointer',
          fontSize: '0.8125rem',
          minWidth: '200px',
        }}
      >
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedPlant ? selectedPlant.name : placeholder}
        </span>
        <ChevronDown size={14} style={{ color: 'var(--neutral-500)', flexShrink: 0 }} />
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            maxHeight: '400px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
          }}
        >
          <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-500)' }} />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari tanaman..."
                style={{
                  width: '100%',
                  padding: '0.4rem 0.4rem 0.4rem 28px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.8125rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {search && (
                <X
                  size={14}
                  onClick={e => { e.stopPropagation(); setSearch(''); }}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--neutral-500)' }}
                />
              )}
            </div>
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {favoritePlants.length > 0 && (
              <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star size={12} fill="var(--yellow-500)" color="var(--yellow-500)" />
                  Favorit
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {favoritePlants.map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleSelect(p.id)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        backgroundColor: value === p.id ? 'var(--primary-100)' : 'white',
                      }}
                    >
                      {p.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Object.entries(groupedPlants).map(([categoryId, plantsInGroup]) => (
              <div key={categoryId}>
                <div
                  onClick={() => toggleGroup(categoryId)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    backgroundColor: 'var(--neutral-50)',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  {expandedGroups.has(categoryId) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  {categoryId}
                  <span style={{ fontWeight: 400, color: 'var(--neutral-500)', fontSize: '0.75rem' }}>
                    ({plantsInGroup.length})
                  </span>
                </div>

                {expandedGroups.has(categoryId) && (
                  <div>
                    {plantsInGroup.map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleSelect(p.id)}
                        style={{
                          padding: '0.5rem 0.75rem 0.5rem 2rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.8125rem',
                          backgroundColor: value === p.id ? 'var(--primary-100)' : 'white',
                          borderBottom: '1px solid var(--neutral-100)',
                        }}
                      >
                        <span>{p.name}</span>
                        <Star
                          size={14}
                          fill={favorites.includes(p.id) ? 'var(--yellow-500)' : 'transparent'}
                          color={favorites.includes(p.id) ? 'var(--yellow-500)' : 'var(--neutral-400)'}
                          onClick={(e) => toggleFavorite(e, p.id)}
                          style={{ cursor: 'pointer', flexShrink: 0 }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {filteredPlants.length === 0 && (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--neutral-500)', fontSize: '0.8125rem' }}>
                Tidak ada tanaman ditemukan
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantSelect;