#!/usr/bin/env node
// Generates public/og-image.png (1200x630) — the brand social-share card,
// referenced by og:image/twitter:image in BaseLayout.astro. Re-run this
// whenever the brand colors in src/styles/global.css change.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0b0e14"/>
  <circle cx="1000" cy="120" r="260" fill="#22c55e" opacity="0.06"/>
  <circle cx="120" cy="560" r="220" fill="#f2f2f2" opacity="0.06"/>

  <g transform="translate(120, 215)">
    <rect x="0" y="0" width="200" height="200" rx="44" fill="#10141c"/>
    <clipPath id="bar"><rect x="83" y="35" width="34" height="130" rx="10"/></clipPath>
    <g clip-path="url(#bar)">
      <rect x="83" y="35" width="34" height="97.5" fill="#22c55e"/>
      <rect x="83" y="132.5" width="34" height="32.5" fill="#f2f2f2"/>
    </g>
  </g>

  <text x="380" y="330" font-family="Arial, sans-serif" font-weight="700" font-size="108" fill="#f5f1e6">intech</text>
  <rect x="905" y="238" width="16" height="80" rx="4" fill="#22c55e"/>

  <text x="382" y="385" font-family="monospace" font-weight="600" font-size="30" letter-spacing="10" fill="#22c55e">.ORG.UA</text>

  <text x="120" y="470" font-family="Arial, sans-serif" font-size="30" fill="#8a93a6">Веб-розробка та ІТ-інфраструктура</text>
  <text x="120" y="512" font-family="monospace" font-size="24" letter-spacing="2" fill="#8a93a6">Полтава, Україна</text>
</svg>
`;

mkdirSync('public', { recursive: true });
await sharp(Buffer.from(svg)).png().toFile('public/og-image.png');
console.log('wrote public/og-image.png');
