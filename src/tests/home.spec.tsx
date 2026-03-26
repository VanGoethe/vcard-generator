import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import mockRouter from 'next-router-mock'
import { DescribeStep } from '@/pages/home/components/GenerateCardFom/DescribeStep'

describe('DescribeStep (Microsoft Graph prefill)', () => {
  beforeEach(() => {
    mockRouter.push('/')
    sessionStorage.clear()
  })

  it('prefills full name and job title from Microsoft profile when no session data', async () => {
    render(
      <DescribeStep
        navigateTo={vi.fn()}
        microsoftProfile={{
          displayName: 'jane doe',
          jobTitle: 'Program Officer',
        }}
      />,
    )

    await waitFor(() => {
      const fullname = screen.getByPlaceholderText(
        'John Doe',
      ) as HTMLInputElement
      const jobtitle = screen.getByPlaceholderText(
        'Frontend UI/UX developer at iMMAP inc.',
      ) as HTMLInputElement

      expect(fullname.value).toBe('Jane Doe')
      expect(jobtitle.value).toBe('Program Officer')
    })
  })
})
