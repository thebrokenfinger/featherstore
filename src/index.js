/** Featherstore: Zero-config, 500B, cross-browser storage for JavaScript apps
 *  @name featherstore
 *  @param { object } options An object with properties `namespace`, `storage` and `ttl` (time to live)
 *  @returns { Featherstore } Returns a store with methods `get`, `set`, `has`, `keys` and `clear`
 */
export default function featherstore(options = {}) {
  const defaultOptions = {
    namespace: '__FEATHERSTORE__',
    storage: window.localStorage,
    ttl: 60 * 60 * 24 * 1000, // One day
  }

  // Choosing storage to be used
  let storage =
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
  const getPrefixedKey = function (key) {
    return `${$options.namespace}${key}`
  }

  const getUnprefixedKey = function (key) {
    return key.replace(new RegExp(`^${$options.namespace}`), '')
  }

  const stringifyJSON = JSON.stringify
  const parseJSON = JSON.parse

  // Return the store
  return {
    set(key, data, ttl = $options.ttl) {
      const prefixedKey = getPrefixedKey(key)
      const value = {
        ttl: Date.now() + ttl,
        data,
      }
      $options.storage.setItem(prefixedKey, stringifyJSON(value))
      return data
    },

    get(key, fallback = null) {
      try {
        const prefixedKey = getPrefixedKey(key)
        const value = parseJSON($options.storage.getItem(prefixedKey))

        if (value.data !== null) {
          if ('ttl' in value && Number(value.ttl) < Date.now()) {
            $options.storage.removeItem(prefixedKey)
            return null
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

    clear(key = null) {
      if (key === null) {
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
