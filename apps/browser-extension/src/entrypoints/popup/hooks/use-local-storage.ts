import { useEffect, useState } from "react"
import { storage } from "wxt/storage"

const buildKey = (key: string): `local:${string}` => `local:${key}`

export function useLocalStorage<T>(key: string, initialValue: T): [T, (newValue: T) => Promise<void>] {
  const [value, setValueInState] = useState<T>(initialValue)
  const localKey = buildKey(key)

  useEffect(() => {
    async function loadStorage() {
      const storedValue = await storage.getItem<T>(localKey)

      if (storedValue !== null) {
        setValue(storedValue)
      }
    }
    loadStorage()
  }, [localKey])

  const setValue = async (newValue: T) => {
    setValueInState(newValue)
    await storage.setItem<T>(localKey, newValue)
  }

  return [value, setValue]
}
