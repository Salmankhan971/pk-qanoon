/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Noto+Nastaliq+Urdu:wght@400;700&family=Noto+Sans+Urdu:wght@400;500;700&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: 'Inter', 'Noto Sans Urdu', system-ui, -apple-system, sans-serif;
  --font-display: 'Outfit', sans-serif;
  --font-serif: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
  --font-urdu: 'Noto Nastaliq Urdu', 'Noto Sans Urdu', serif;

  --color-brand-linen: #f8f7f4;
  --color-brand-rail: #f0ede6;
  --color-brand-green: #004225;
  --color-brand-green-hover: #005a32;
}

/* Base styles and custom transitions */
html, body {
  background-color: var(--color-brand-linen);
  color: #1a202c;
  font-family: var(--font-sans);
}

/* Custom scrollbar for premium desktop styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Urdu specific typography spacing improvements */
.urdu-text {
  font-family: var(--font-urdu);
  line-height: 2;
}

