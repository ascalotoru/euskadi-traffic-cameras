import { afterEach, describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { CameraCard, Camera } from './CameraCard'
import type { SetStateAction } from 'react'

afterEach(() => {
  cleanup()
})

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
    expect.assertions(4)
    const capturedUpdaters: ((prev: Camera[]) => Camera[])[] = []
    const setFavorites = vi.fn((updater: SetStateAction<Camera[]>) => {
      capturedUpdaters.push(updater as (prev: Camera[]) => Camera[])
    })
    render(
      <CameraCard
        camera={camera}
        favorites={[]}
        setFavorites={setFavorites}
        favoriteMenu={false}
      />
    )
    fireEvent.click(screen.getByRole('listitem'))
    expect(setFavorites).toHaveBeenCalledTimes(1)
    expect(capturedUpdaters).toHaveLength(1)
    const next = capturedUpdaters[0]([])
    expect(next).toHaveLength(1)
    expect(next[0].cameraId).toBe('1')
  })
})
