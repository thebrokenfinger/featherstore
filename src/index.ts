/**
 * Featherstore: Zero-config, 500B, cross-browser storage for JavaScript apps
 */

export type FeatherstoreOptions = {
  namespace?: string
  storage?: 'local' | 'session' | Storage
  ttl?: number
}

export type Featherstore = {
  get: <T>(key: string, fallback?: T | undefined) => unknown
  set: (key: string, value: unknown, ttl?: number) => unknown
  has: (key: string) => boolean
  keys: () => string[]
  clear: (key?: string) => boolean
}

export default function featherstore(
  options: FeatherstoreOptions = {}
): Featherstore {
  const defaultOptions = {
    namespace: '__FEATHERSTORE__',
    storage: window.localStorage,
    ttl: 60 * 60 * 24 * 1000, // One day
  }

  // Choosing storage to be used
  let storage: Storage =
    options.storage === 'session' ? window.sessionStorage : window.localStorage
  if (typeof options.storage === 'object') {
    storage = options.storage
  }

  // Options to be used by library
  const $options = (Object.freeze || Object)(
    Object.assign({}, defaultOptions, options, {
      storage,
    })
  )

  // Utils
  const getPrefixedKey = function (key: string) {
    return `${$options.namespace}${key}`
  }

  const getUnprefixedKey = function (key: string) {
    return key.replace(new RegExp(`^${$options.namespace}`), '')
  }

  const stringifyJson = JSON.stringify
  const parseJson = JSON.parse

  // Return the store
  return {
    set(key, data, ttl = $options.ttl) {
      const prefixedKey = getPrefixedKey(key)
      const value = {
        ttl: Date.now() + ttl,
        data,
      }
      $options.storage.setItem(prefixedKey, stringifyJson(value))
      return data
    },

    get(key, fallback) {
      try {
        const prefixedKey = getPrefixedKey(key)
        const value = parseJson($options.storage.getItem(prefixedKey) ?? '')

        if (value.data !== undefined) {
          if ('ttl' in value && Number(value.ttl) < Date.now()) {
            $options.storage.removeItem(prefixedKey)
            return
          }

          if ('data' in value) {
            return value.data
          }

          return fallback
        }
      } catch {
        console.error(
          `Featherstore [get]: Can't find any value for '${key}' in the store.`
        )

        return fallback
      }
    },

    clear(key) {
      if (key === undefined) {
        $options.storage.clear()
      } else {
        $options.storage.removeItem(getPrefixedKey(key))
      }

      return true
    },

    keys() {
      return Object.keys($options.storage).map(key => getUnprefixedKey(key))
    },

    has(key) {
      const prefixedKey = getPrefixedKey(key)
      return prefixedKey in $options.storage
    },
  }
}
