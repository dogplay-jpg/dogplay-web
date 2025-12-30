const fs = require('fs');

// Read the layout file
const content = fs.readFileSync('E:/dpy1/src/app/[locale]/layout.tsx', 'utf8');

// Replace the head section with proper metadata
const newContent = content.replace(
  /<html lang=[^>]+ className=\{inter\.variable\}>[\s\S]*?<head>[\s\S]*?<\/head>/,
  `<html lang={locale === 'hi' ? 'hi-IN' : 'en-IN'} className={inter.variable}>
      <head />`
).replace(
    /<link rel="icon" href="\/favicon\.ico" \/>/,
    ``
);

fs.writeFileSync('E:/dpy1/src/app/[locale]/layout.tsx', newContent);
console.log('Fixed layout.tsx - removed incompatible head tags');
