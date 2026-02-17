import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Flower2, Palette } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, signOut } = useAuth();
    const [theme, setTheme] = useState(localStorage.getItem('kb-theme') || 'orange');

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('kb-theme', theme);
    }, [theme]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setIsMenuOpen(false);
        if (isMenuOpen) {
            window.addEventListener('click', handleClickOutside);
        }
        return () => window.removeEventListener('click', handleClickOutside);
    }, [isMenuOpen]);

    return (
        <div className="layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <header style={{
                backgroundColor: '#ffffff',
                borderBottom: '1px solid var(--border-color)',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem'
                }}>
                    <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            backgroundColor: 'var(--primary-600)',
                            color: 'white',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Flower2 size={24} />
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>KebunKU</span>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                cursor: 'pointer',
                                padding: '0.25rem 0.5rem',
                                borderRadius: 'var(--radius-md)',
                                transition: 'var(--transition)',
                                backgroundColor: isMenuOpen ? 'var(--stone-100)' : 'transparent'
                            }}
                            className="user-trigger"
                        >
                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>{user?.displayName}</div>
                                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                            </div>
                            {user?.photoURL && (
                                <img
                                    src={user.photoURL}
                                    alt="avatar"
                                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-color)' }}
                                />
                            )}
                        </div>

                        {isMenuOpen && (
                            <div style={{
                                position: 'absolute',
                                top: 'calc(100% + 0.5rem)',
                                right: 0,
                                width: '200px',
                                backgroundColor: '#ffffff',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border-color)',
                                boxShadow: 'var(--shadow-md)',
                                padding: '0.75rem',
                                zIndex: 100,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem'
                            }} onClick={(e) => e.stopPropagation()}>
                                <div style={{ padding: '0 0.25rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                        <Palette size={14} /> TEMA WARNA
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                                        {['orange', 'teal', 'slate', 'stone'].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setTheme(t)}
                                                style={{
                                                    padding: '0.4rem',
                                                    fontSize: '0.75rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    border: '1px solid',
                                                    borderColor: theme === t ? 'var(--primary-600)' : 'var(--border-color)',
                                                    backgroundColor: theme === t ? 'var(--primary-50)' : 'transparent',
                                                    color: theme === t ? 'var(--primary-700)' : 'var(--text-secondary)',
                                                    textTransform: 'capitalize',
                                                    fontWeight: theme === t ? 600 : 400
                                                }}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.25rem 0' }} />

                                <button
                                    onClick={() => signOut()}
                                    className="btn btn-outline"
                                    style={{
                                        width: '100%',
                                        justifyContent: 'flex-start',
                                        padding: '0.5rem',
                                        fontSize: '0.8125rem',
                                        color: '#ef4444',
                                        borderColor: 'transparent'
                                    }}
                                >
                                    <LogOut size={16} /> Keluar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="container" style={{ flex: 1, padding: '1rem 0' }}>
                {children}
            </main>

            <footer style={{
                textAlign: 'center',
                padding: '2.5rem 0',
                color: 'var(--text-muted)',
                fontSize: '0.8125rem',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-color)'
            }}>
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} KebunKU - Digital Garden Diary</p>
                    <p style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>Crafted for Healthy Plants</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
