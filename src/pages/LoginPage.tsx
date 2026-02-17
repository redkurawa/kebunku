import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Loader2, Flower2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
    const { signInWithGoogle, user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            navigate('/', { replace: true });
        }
    }, [user, loading, navigate]);

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error('Login error:', error);
            alert('Login gagal. Silakan periksa konfigurasi Firebase Anda atau coba lagi.');
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '1.5rem', backgroundColor: 'var(--bg-color)' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary-600)" />
                <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Memeriksa status masuk...</div>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: 'var(--stone-100)',
            padding: '1rem'
        }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '3rem 2rem', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <div style={{
                        backgroundColor: 'var(--primary-600)',
                        color: 'white',
                        width: '64px',
                        height: '64px',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
                    }}>
                        <Flower2 size={36} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
                        KebunKU
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.5 }}>
                        Digital Diary for your <span style={{ color: 'var(--primary-600)', fontWeight: 600 }}>Garden</span>. <br />
                        Track, monitor, and grow healthy plants.
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    style={{ width: '100%', height: '52px', fontSize: '1.1rem', fontWeight: 600, gap: '0.75rem', borderRadius: 'var(--radius-md)' }}
                    onClick={handleLogin}
                >
                    <LogIn size={20} />
                    Masuk dengan Google
                </button>

                <div style={{ marginTop: '2.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    <p>By signing in, you agree to our Terms and Service.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
