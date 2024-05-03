import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from '@/pages/cards/[fullname]/index.page'
import { User } from '@prisma/client'

vi.mock('next/router', () => require('next-router-mock'))

describe('Card page', () => {
  let user: User

  beforeEach(async () => {
    user = {
      id: 'fake-user-id',
      fullname: 'john doe',
      skype: 'john-doe',
      timezone: 'john-doe',
      phoneNumber: 'john-doe',
      email: 'johndoe@email.com',
      linkedin: 'john-doe',
      image_url: 'http://www.fake-cdn.com/image.png',
      jobtitle: 'fake description',
      card_background_color: '#000000',
      card_text_color: '#FFFFFF',
      created_at: new Date(),
    }
  })

  it('Should be render correctly', () => {
    render(<Card user={user} />)

    expect(screen.getByText(`${user.fullname}`)).toBeInTheDocument()
  })
})
