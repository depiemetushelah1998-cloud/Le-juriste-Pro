// Convert SVG to Canvas and PNG Blob URL
function generatePngIcon(size) {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e1b4b"/>
        <stop offset="50%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#020617"/>
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="50%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${size * 0.21}" fill="url(#bg)"/>
    <rect width="${size - 16}" height="${size - 16}" x="8" y="8" rx="${size * 0.20}" fill="none" stroke="url(#gold)" stroke-width="${size * 0.01}" opacity="0.4"/>
    <g transform="scale(${size / 512})" fill="url(#gold)" stroke="url(#gold)">
      <path d="M256 90 L256 360" stroke-width="12" stroke-linecap="round"/>
      <path d="M140 140 L372 140" stroke-width="10" stroke-linecap="round"/>
      <circle cx="256" cy="90" r="16" fill="url(#gold)"/>
      <path d="M140 140 L100 240 M140 140 L180 240" stroke-width="4"/>
      <path d="M90 240 Q140 280 190 240 Z" fill="url(#gold)"/>
      <path d="M372 140 L332 240 M372 140 L412 240" stroke-width="4"/>
      <path d="M322 240 Q372 280 422 240 Z" fill="url(#gold)"/>
      <path d="M160 360 L256 380 L352 360 L360 410 L256 430 L152 410 Z" fill="url(#gold)" opacity="0.95"/>
      <path d="M180 425 L332 425" stroke-width="10" stroke-linecap="round"/>
      <text x="256" y="475" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="28" fill="#fbbf24" letter-spacing="4">LE JURISTE PRO</text>
    </g>
  </svg>`;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = new Image();
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
  };
  img.src = url;
}
