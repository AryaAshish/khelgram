import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import {
  useAddTestimonial,
  useAdminTestimonials,
  useDeleteTestimonial,
  useReorderTestimonials,
  useTestimonials,
  useUpdateTestimonial,
} from './useTestimonials'
import * as testimonialsService from '@/services/testimonials.service'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('@/services/testimonials.service', () => ({
  getTestimonials: vi.fn(),
  addTestimonial: vi.fn(),
  updateTestimonial: vi.fn(),
  deleteTestimonial: vi.fn(),
  reorderTestimonials: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useTestimonials hooks', () => {
  beforeEach(() => {
    vi.mocked(toast.error).mockClear()
    vi.mocked(toast.success).mockClear()
  })

  it('loads testimonials', async () => {
    vi.mocked(testimonialsService.getTestimonials).mockResolvedValue([
      { id: 't-1', quote: 'Great', author: 'Parent', relation: 'Mom', sortOrder: 0 },
    ])
    const { result } = renderHook(() => useTestimonials(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.testimonials[0]?.author).toBe('Parent')
  })

  it('loads admin testimonials', async () => {
    vi.mocked(testimonialsService.getTestimonials).mockResolvedValue([
      { id: 't-1', quote: 'Great', author: 'Parent', relation: 'Mom', sortOrder: 0 },
    ])
    const { result } = renderHook(() => useAdminTestimonials(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.[0]?.author).toBe('Parent')
  })

  it('updates testimonial', async () => {
    vi.mocked(testimonialsService.updateTestimonial).mockResolvedValue({
      id: 't-1',
      quote: 'Updated',
      author: 'Parent',
      relation: 'Mom',
      sortOrder: 0,
    })
    const { result } = renderHook(() => useUpdateTestimonial(), { wrapper: createWrapper() })
    await result.current.mutateAsync({ id: 't-1', quote: 'Updated' })
    expect(toast.success).toHaveBeenCalled()
  })

  it('shows error toast when update fails', async () => {
    vi.mocked(testimonialsService.updateTestimonial).mockRejectedValue(new Error('failed'))
    const { result } = renderHook(() => useUpdateTestimonial(), { wrapper: createWrapper() })
    await expect(result.current.mutateAsync({ id: 't-1', quote: 'Fail' })).rejects.toThrow('failed')
    expect(toast.error).toHaveBeenCalled()
  })

  it('shows error toast when add fails', async () => {
    vi.mocked(testimonialsService.addTestimonial).mockRejectedValue(new Error('failed'))
    const { result } = renderHook(() => useAddTestimonial(), { wrapper: createWrapper() })
    await expect(result.current.mutateAsync({ quote: 'Nice', author: 'Coach' })).rejects.toThrow(
      'failed',
    )
    expect(toast.error).toHaveBeenCalled()
  })

  it('mutates testimonials', async () => {
    vi.mocked(testimonialsService.addTestimonial).mockResolvedValue({
      id: 't-2',
      quote: 'Nice',
      author: 'Coach',
      relation: '',
      sortOrder: 1,
    })
    vi.mocked(testimonialsService.deleteTestimonial).mockResolvedValue()
    vi.mocked(testimonialsService.reorderTestimonials).mockResolvedValue()

    const wrapper = createWrapper()
    await renderHook(() => useAddTestimonial(), { wrapper }).result.current.mutateAsync({
      quote: 'Nice',
      author: 'Coach',
    })
    await renderHook(() => useDeleteTestimonial(), { wrapper }).result.current.mutateAsync('t-1')
    await renderHook(() => useReorderTestimonials(), { wrapper }).result.current.mutateAsync([
      't-1',
    ])
    expect(toast.success).toHaveBeenCalled()
  })

  it('shows error toasts when delete or reorder fails', async () => {
    vi.mocked(testimonialsService.deleteTestimonial).mockRejectedValue(new Error('delete failed'))
    vi.mocked(testimonialsService.reorderTestimonials).mockRejectedValue(
      new Error('reorder failed'),
    )

    const wrapper = createWrapper()

    await expect(
      renderHook(() => useDeleteTestimonial(), { wrapper }).result.current.mutateAsync('t-1'),
    ).rejects.toThrow('delete failed')

    await expect(
      renderHook(() => useReorderTestimonials(), { wrapper }).result.current.mutateAsync(['t-1']),
    ).rejects.toThrow('reorder failed')

    expect(toast.error).toHaveBeenCalledTimes(2)
  })
})
