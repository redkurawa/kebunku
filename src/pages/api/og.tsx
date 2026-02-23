import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get('title') || 'KebunKU';
  const description = url.searchParams.get('description') || 'Digital Garden Diary';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
          padding: '60px',
        }}
      >
        {/* Icon/Logo placeholder */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '120px',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.2)',
            marginBottom: '40px',
          }}
        >
          <span style={{ fontSize: '64px' }}>🌱</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 20px 0',
            textAlign: 'center',
            letterSpacing: '-2px',
          }}
        >
          {title}
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: '36px',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: '0',
            textAlign: 'center',
            fontWeight: '400',
          }}
        >
          {description}
        </p>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '24px' }}>🌿</span>
          </div>
          <span style={{ fontSize: '20px', color: 'white', fontWeight: '500' }}>
            kebunqu.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
