import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import mockRouter from 'next-router-mock'
import Card from '@/pages/cards/[email]/index.page'
import { User } from '@prisma/client'

describe('Card page', () => {
  let user: User

  beforeEach(async () => {
    mockRouter.push('/cards/johndoe')
    user = {
      id: 'fake-user-id',
      fullname: 'john doe',
      skype: 'john-doe',
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
