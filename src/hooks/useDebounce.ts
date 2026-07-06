import { useEffect, useState } from 'react'

type Props = {
  value: string
  delay: number
}

export default function useDebounce({ value, delay }: Props) {
  const [debouncedVal, setDebouncedVal] = useState<string>(value)

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedVal(value)
    }, delay)
    return () => clearTimeout(t)
  }, [value, delay])

  return debouncedVal
}