import React from 'react'
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Ensure Next.js `useRouter()` works in unit tests (Vitest does not apply
// per-file `vi.mock('next/router')` the same way Jest does).
vi.mock('next/router', () => require('next-router-mock'))

// Vitest does not load `next.config.js`; mock `next/image` to avoid
// `images.qualities` warnings and to support static imports (SVG, etc.).
vi.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({
    src,
    alt,
    priority: _priority,
    quality: _quality,
    placeholder: _placeholder,
    blurDataURL: _blurDataURL,
    ...rest
  }: React.ComponentProps<'img'> & {
    src?: string | { src?: string; default?: string }
    priority?: boolean
    quality?: number
    placeholder?: string
    blurDataURL?: string
  }) {
    const resolvedSrc =
      typeof src === 'string'
        ? src
        : src && typeof src === 'object' && 'src' in src
          ? String((src as { src?: string }).src ?? '')
          : src && typeof src === 'object' && 'default' in src
            ? String((src as { default?: string }).default ?? '')
            : ''
    return React.createElement('img', {
      alt: alt ?? '',
      src: resolvedSrc,
      ...rest,
    })
  },
}))
