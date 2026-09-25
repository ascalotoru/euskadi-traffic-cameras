import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { CameraCard, Camera } from './CameraCard'
import type { SetStateAction } from 'react'

const camera: Camera = {
  address: 'Bilbao',
  cameraId: '1',
  cameraName: 'AP-8 km 10',
  kilometer: '',
  latitude: '',
  longitude: '',
  road: '',
  sourceId: '',
  urlImage: 'https://example.com/img.jpg',
}

describe('CameraCard', () => {
  it('renders camera name and image', () => {
    render(
      <CameraCard
        camera={camera}
        favorites={[]}
        setFavorites={() => {}}
        favoriteMenu={false}
      />
    )
    expect(screen.getByText('AP-8 km 10')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/img.jpg')
  })

  it('toggles favorite on click', () => {
    const setFavorites = (updater: (prev: Camera[]) => Camera[]) => {
      const next = updater([])
      expect(next).toHaveLength(1)
      expect(next[0].cameraId).toBe('1')
    }
    const toggleFavorites = setFavorites as unknown as (value: SetStateAction<Camera[]>) => void
    render(
      <CameraCard
        camera={camera}
        favorites={[]}
        setFavorites={toggleFavorites}
        favoriteMenu={false}
      />
    )
    fireEvent.click(screen.getByRole('listitem'))
  })
})
