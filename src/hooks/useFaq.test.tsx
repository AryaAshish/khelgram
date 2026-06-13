import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import {
  useAddFaqItem,
  useAdminFaq,
  useDeleteFaqItem,
  useFaq,
  useReorderFaqItems,
  useUpdateFaqItem,
} from './useFaq'
import * as faqService from '@/services/faq.service'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('@/services/faq.service', () => ({
  getFaqItems: vi.fn(),
  addFaqItem: vi.fn(),
  updateFaqItem: vi.fn(),
  deleteFaqItem: vi.fn(),
  reorderFaqItems: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useFaq', () => {
  beforeEach(() => {
    vi.mocked(toast.error).mockClear()
    vi.mocked(toast.success).mockClear()
    vi.mocked(faqService.getFaqItems).mockReset()
  })

  it('returns DB FAQ items when available', async () => {
    vi.mocked(faqService.getFaqItems).mockResolvedValue([
      {
        id: 'faq-db',
        question: 'Custom question?',
        answer: 'Custom answer',
        sortOrder: 0,
      },
    ])

    const { result } = renderHook(() => useFaq(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.items[0]?.id).toBe('faq-db')
  })

  it('returns empty list when DB returns empty', async () => {
    vi.mocked(faqService.getFaqItems).mockResolvedValue([])

    const { result } = renderHook(() => useFaq(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.items).toEqual([])
  })

  it('shows error toast when delete fails', async () => {
    vi.mocked(faqService.deleteFaqItem).mockRejectedValue(new Error('failed'))
    const { result } = renderHook(() => useDeleteFaqItem(), { wrapper: createWrapper() })
    await expect(result.current.mutateAsync('faq-1')).rejects.toThrow('failed')
    expect(toast.error).toHaveBeenCalled()
  })

  it('loads admin FAQ items', async () => {
    vi.mocked(faqService.getFaqItems).mockResolvedValue([
      { id: 'faq-1', question: 'Q?', answer: 'A', sortOrder: 0 },
    ])
    const { result } = renderHook(() => useAdminFaq(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.[0]?.question).toBe('Q?')
  })

  it('updates FAQ item', async () => {
    vi.mocked(faqService.updateFaqItem).mockResolvedValue({
      id: 'faq-1',
      question: 'Updated?',
      answer: 'Updated',
      sortOrder: 0,
    })
    const { result } = renderHook(() => useUpdateFaqItem(), { wrapper: createWrapper() })
    await result.current.mutateAsync({ id: 'faq-1', question: 'Updated?' })
    expect(toast.success).toHaveBeenCalled()
  })

  it('shows error toast when update fails', async () => {
    vi.mocked(faqService.updateFaqItem).mockRejectedValue(new Error('failed'))
    const { result } = renderHook(() => useUpdateFaqItem(), { wrapper: createWrapper() })
    await expect(result.current.mutateAsync({ id: 'faq-1', question: 'Fail' })).rejects.toThrow(
      'failed',
    )
    expect(toast.error).toHaveBeenCalled()
  })

  it('mutates FAQ items', async () => {
    vi.mocked(faqService.addFaqItem).mockResolvedValue({
      id: 'faq-new',
      question: 'Q?',
      answer: 'A',
      sortOrder: 1,
    })
    vi.mocked(faqService.deleteFaqItem).mockResolvedValue()
    vi.mocked(faqService.reorderFaqItems).mockResolvedValue()

    const wrapper = createWrapper()
    const { result: addResult } = renderHook(() => useAddFaqItem(), { wrapper })
    await addResult.current.mutateAsync({ question: 'Q?', answer: 'A' })

    const { result: deleteResult } = renderHook(() => useDeleteFaqItem(), { wrapper })
    await deleteResult.current.mutateAsync('faq-new')

    const { result: reorderResult } = renderHook(() => useReorderFaqItems(), { wrapper })
    await reorderResult.current.mutateAsync(['faq-new'])

    expect(toast.success).toHaveBeenCalled()
  })

  it('shows error toasts when add or reorder fails', async () => {
    vi.mocked(faqService.addFaqItem).mockRejectedValue(new Error('add failed'))
    vi.mocked(faqService.reorderFaqItems).mockRejectedValue(new Error('reorder failed'))

    const wrapper = createWrapper()

    await expect(
      renderHook(() => useAddFaqItem(), { wrapper }).result.current.mutateAsync({
        question: 'Q?',
        answer: 'A',
      }),
    ).rejects.toThrow('add failed')

    await expect(
      renderHook(() => useReorderFaqItems(), { wrapper }).result.current.mutateAsync(['faq-1']),
    ).rejects.toThrow('reorder failed')

    expect(toast.error).toHaveBeenCalledTimes(2)
  })
})
