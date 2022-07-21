import featherstore, { type Featherstore } from '../src/index'

let store: Featherstore

beforeEach(() => {
  store = featherstore()
})

afterEach(() => {
  store.clear()
})

describe('featherstore', () => {
  it('should create a store exposing an API with five methods', () => {
    const keys = Object.keys(store)
    expect(Object.keys(store).length).toBe(5)
    expect(keys).toStrictEqual(['set', 'get', 'clear', 'keys', 'has'])
  })
})

describe('featherstore#set', () => {
  it('should save a key-value provided', () => {
    expect(store.set('key', 'value')).toBe('value')
    expect(store.get('key')).toBe('value')
  })

  it('should save key-value for a time explicitly provided', async () => {
    store.set('key', 'value for 1sec', 1000)
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
    expect(store.get('key')).toBe(undefined)
  })
})

describe('featherstore#get', () => {
  it('should get a stored value', () => {
    store.set('number', 3)
    store.set('string', 'featherstore')
    store.set('array', [1, 2, 3])
    store.set('object', { a: 'a' })

    expect(store.get('number')).toStrictEqual(3)
    expect(store.get('string')).toStrictEqual('featherstore')
    expect(store.get('array')).toStrictEqual([1, 2, 3])
    expect(store.get('object')).toStrictEqual({ a: 'a' })
  })
})

describe('featherstore#keys', () => {
  it('should return all the keys stored in the store', () => {
    store.set('key1', 'value1')
    store.set('key2', 'value2')
    expect(store.keys()).toStrictEqual(['key1', 'key2'])
  })

  it('should return empty list if called on empty store', () => {
    expect(store.keys().length).toBe(0)
  })
})

describe('featherstore#clear', () => {
  it('should remove all the stored values from the storage', () => {
    store.set('number', 3)
    store.set('string', 'featherstore')
    store.set('array', [1, 2, 3])
    store.set('object', { a: 'a' })
    store.clear()

    expect(store.keys().length).toBe(0)
  })

  it('should clear only one item (if exists) if the key is provided', () => {
    store.set('number', 3)
    store.set('string', 'featherstore')
    store.clear('number')

    expect(store.get('number')).toBe(undefined)
    expect(store.get('string')).toBe('featherstore')
  })
})

describe('featherstore#has', () => {
  it('should be truthy if store has a value stored with the key', () => {
    store.set('number', 3)
    expect(store.has('number')).toBe(true)
  })

  it('should be falsy if store does not have a value stored with the key', () => {
    expect(store.has('number')).toBe(false)
  })
})
