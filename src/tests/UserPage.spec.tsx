import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import UserPage from '@/pages/[id]/[name]/index.page'
import { User } from '@prisma/client'

vi.mock('next/router', () => require('next-router-mock'))
describe('User page', () => {
  let user: User

  beforeEach(async () => {
    user = {
      id: 'fake-user-id',
      fullname: 'john doe',
      phoneNumber: '239842',
      skype: 'http://www.fake-skype.com/johndoe',
      timezone: 'fake timezone',
      email: 'johndoe@email.com',
      linkedin: 'john-doe',
      image_url: 'http://www.fake-cdn.com/image.png',
      jobtitle: 'fake jobtitle',
      card_background_color: '#000000',
      card_text_color: '#FFFFFF',
      created_at: new Date(),
    }
  })

  it('Should be render correctly', () => {
    render(<UserPage user={user} />)

    expect(screen.getByText(`${user.fullname}`)).toBeInTheDocument()
  })
})
