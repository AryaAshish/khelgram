import { useCountUp } from '@/hooks/useCountUp'

export function AnimatedStatValue({ value }: { value: string }) {
  const { ref, display } = useCountUp(value)

  return <span ref={ref}>{display}</span>
}
