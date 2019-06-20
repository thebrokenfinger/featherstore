/** Featherstore: Zero-config, 500B, cross-browser storage for JavaScript apps
 *  @name featherstore
 *  @param { object } options An object with properties `namespace`, `storage` and `ttl` (time to live)
 *  @returns { Featherstore } Returns a store with methods `get`, `set`, `has`, `keys` and `clear`
 */
export default function featherstore(options = {}) {
  const defaultOpts = {
    namespace: '__FEATHERSTORE__',
    storage: window.localStorage,
    ttl: 60 * 60 * 24 * 1000 // One day
  };

  // Choosing storage to be used
  let storage =
    options.storage === 'session' ? window.sessionStorage : window.localStorage;
  if (typeof options.storage === 'object') {
    storage = options.storage;
  }

  // Options to be used by library
  const $opts = Object.freeze(
    Object.assign({}, defaultOpts, options, {
      storage
    })
  );

  // Utils
  const getPrefixedKey = function(key) {
    return `${$opts.namespace}${key}`;
  };

  const getUnprefixedKey = function(key) {
    return key.replace($opts.namespace, '');
  };

  const stringifyJSON = JSON.stringify;
  const parseJSON = JSON.parse;

  // Return the store
  return {
    set(key, data, ttl = $opts.ttl) {
      const prefixedKey = getPrefixedKey(key);
      const value = {
        ttl: Date.now() + ttl,
        data
      };
      $opts.storage.setItem(prefixedKey, stringifyJSON(value));
      return data;
    },

    get(key, fallback = null) {
      try {
        const prefixedKey = getPrefixedKey(key);
        const value = parseJSON($opts.storage.getItem(prefixedKey));

        if (value.data !== null) {
          if ('ttl' in value && Number(value.ttl) < Date.now()) {
            $opts.storage.removeItem(prefixedKey);
            return null;
          }

          if ('data' in value) {
            return value.data;
          }

          return fallback;
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(
            `Featherstore [get]: Can't find any value for '${key}' in the store.`
          );
          return fallback;
        }
      }
    },

    clear(key = null) {
      if (key !== null) {
        $opts.storage.removeItem(getPrefixedKey(key));
      } else {
        $opts.storage.clear();
      }
      return true;
    },

    keys() {
      return Object.keys($opts.storage).map(getUnprefixedKey);
    },

    has(key) {
      const prefixedKey = getPrefixedKey(key);
      return prefixedKey in $opts.storage;
    }
  };
}
