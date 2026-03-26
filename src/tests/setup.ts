import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Ensure Next.js `useRouter()` works in unit tests (Vitest does not apply
// per-file `vi.mock('next/router')` the same way Jest does).
vi.mock('next/router', () => require('next-router-mock'))
