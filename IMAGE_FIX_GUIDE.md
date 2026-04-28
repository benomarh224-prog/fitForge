# Next.js Image Configuration for Vercel

## 🚀 Quick Fix Summary

Your images should now work on Vercel! Here's what was fixed:

### ✅ Updated `next.config.ts`
- Replaced deprecated `images.domains` with `images.remotePatterns`
- Added proper Vercel domain support
- Configured image optimization settings

### ✅ Updated Components
- Hero section now uses Next.js `Image` component
- Machine guide images now use proper `Image` component
- Added loading states and blur placeholders

## 📋 Complete Image Setup Guide

### Step 1: Image Configuration in `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '**',
      },
      // Add external domains as needed
    ],
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

### Step 2: Using Next.js Image Component

#### For Regular Images:
```tsx
import Image from 'next/image';

<Image
  src="/images/your-image.png"
  alt="Description"
  width={400}
  height={300}
  priority={false} // Use true for above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..." // Optional blur placeholder
/>
```

#### For Background Images (Fill Container):
```tsx
<div className="relative w-full h-64">
  <Image
    src="/images/background.jpg"
    alt="Background"
    fill
    className="object-cover"
    priority={false}
  />
</div>
```

### Step 3: Vercel Deployment Checklist

1. **Deploy to Vercel** - Push your changes to trigger deployment
2. **Check Domain** - After deployment, update `next.config.ts` with your actual Vercel domain:
   ```typescript
   remotePatterns: [
     {
       protocol: 'https',
       hostname: 'your-app-name.vercel.app', // Replace with actual domain
       port: '',
       pathname: '**',
     },
   ]
   ```

3. **Image Optimization** - Vercel automatically optimizes images through Next.js

### Step 4: Troubleshooting

#### If images still don't load:

1. **Check Console** - Look for 404 errors in browser dev tools
2. **Verify Paths** - Ensure images are in `/public/images/` folder
3. **Check File Names** - Make sure file names match exactly (case-sensitive)
4. **Clear Cache** - Hard refresh browser (Ctrl+F5) or clear Vercel cache

#### Common Issues:

- **Wrong Path**: Use `/images/filename.png`, not `public/images/filename.png`
- **Missing Import**: Always import `Image` from `next/image`
- **External Images**: Add domain to `remotePatterns` for external images
- **File Size**: Large images may need optimization

### Step 5: Best Practices

1. **Use WebP/AVIF**: Next.js automatically serves optimized formats
2. **Add Priority**: Use `priority={true}` for above-the-fold images
3. **Blur Placeholder**: Improves perceived performance
4. **Responsive Images**: Use `fill` with container sizing for responsive images
5. **Lazy Loading**: Automatic for images below the fold

## 🎯 Your Images Should Now Work!

After deploying these changes to Vercel, your images will:
- ✅ Load properly on Vercel
- ✅ Be automatically optimized
- ✅ Support modern formats (WebP, AVIF)
- ✅ Have proper lazy loading
- ✅ Include loading states and blur placeholders

Deploy your changes and test the images on your Vercel domain! 🚀