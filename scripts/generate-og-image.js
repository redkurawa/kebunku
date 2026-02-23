import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Create canvas 1200x630
const canvas = createCanvas(1200, 630);
const ctx = canvas.getContext('2d');

// Background gradient
const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
gradient.addColorStop(0, '#22c55e');
gradient.addColorStop(0.5, '#16a34a');
gradient.addColorStop(1, '#15803d');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 1200, 630);

// Icon background
ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
ctx.beginPath();
ctx.roundRect(540, 80, 120, 120, 24);
ctx.fill();

// Plant emoji (as logo placeholder)
ctx.font = '64px Arial';
ctx.fillStyle = 'white';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('🌱', 600, 140);

// Title
ctx.font = 'bold 72px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
ctx.fillStyle = 'white';
ctx.textAlign = 'center';
ctx.fillText('KebunKU', 600, 300);

// Description
ctx.font = '400 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
ctx.textAlign = 'center';
ctx.fillText('Digital Garden Diary', 600, 370);

// Footer icon background
ctx.fillStyle = 'white';
ctx.beginPath();
ctx.arc(80, 570, 20, 0, Math.PI * 2);
ctx.fill();

// Footer emoji
ctx.font = '24px Arial';
ctx.fillStyle = '#22c55e';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('🌿', 80, 570);

// Footer text
ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
ctx.fillStyle = 'white';
ctx.textAlign = 'left';
ctx.textBaseline = 'middle';
ctx.fillText('kebunqu.vercel.app', 110, 570);

// Save to public folder
const outputPath = join(__dirname, '..', 'public', 'og-image.png');
const buffer = canvas.toBuffer('image/png');
writeFileSync(outputPath, buffer);

console.log('✓ OG Image generated:', outputPath);
