import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import UserPage from '@/pages/[id]/[name]/index.page'
import type { ComponentProps } from 'react'

vi.mock('next/router', () => require('next-router-mock'))
describe('User page', () => {
  let user: ComponentProps<typeof UserPage>['user']

  beforeEach(async () => {
    user = {
      id: 'fake-user-id',
      fullname: 'john doe',
      phoneNumber: '239842',
      email: 'johndoe@email.com',
      linkedin: 'john-doe',
      image_url: 'http://www.fake-cdn.com/image.png',
      jobtitle: 'fake jobtitle',
      card_background_color: '#000000',
      card_text_color: '#FFFFFF',
    }
  })

  it('Should be render correctly', () => {
    render(<UserPage user={user} />)

    const visible = screen.getByTestId('visit-card-visible')
    expect(
      within(visible).getByRole('heading', { name: user.fullname }),
    ).toBeInTheDocument()
    expect(
      within(visible).getByText('Scan to download the details'),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Edit information/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Download card/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Save contact/i }),
    ).toBeInTheDocument()
  })
})
