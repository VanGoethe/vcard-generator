import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import mockRouter from 'next-router-mock'
import Card from '@/pages/cards/[email]/index.page'
import type { ComponentProps } from 'react'

describe('Card page', () => {
  let user: ComponentProps<typeof Card>['user']

  beforeEach(async () => {
    mockRouter.push('/cards/johndoe')
    user = {
      id: 'fake-user-id',
      fullname: 'john doe',
      phoneNumber: 'john-doe',
      email: 'johndoe@email.com',
      linkedin: 'john-doe',
      image_url: 'http://www.fake-cdn.com/image.png',
      jobtitle: 'fake description',
      card_background_color: '#000000',
      card_text_color: '#FFFFFF',
    }
  })

  it('Should be render correctly', () => {
    render(<Card user={user} />)

    const visible = screen.getByTestId('visit-card-visible')
    expect(
      within(visible).getByText('Scan to download the details'),
    ).toBeInTheDocument()
    expect(within(visible).getByText(user.phoneNumber)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Edit information/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Download card/i }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Save contact/i }),
    ).not.toBeInTheDocument()
  })
})
