<p align="center">
  <img src="https://i.imgur.com/l67acQe.png" height="300" alt="featherstore">  
</p>

# featherstore [![Build Status](https://travis-ci.com/ApolloStationIO/featherstore.svg?branch=master)](https://travis-ci.com/ApolloStationIO/featherstore)

> Zero-config, 600B, cross-browser storage for JavaScript apps

## Installation

`npm i featherstore --save`

or with [yarn](https://yarnpkg.com)

`yarn add featherstore`

## Usage

Creating a store a fairly easy -

```javascript
const store = featherstore();
```

### Options

You can pass in few options to `featherstore` (as an object) to create the store

- **namespace**
  Just so that you don't pollute the global namespace, the `namespace` you provide is prefixed to all the `keys` you use to save the data to the store. Defaults to `__FEATHERSTORE__`.

- **ttl** (time to live)
  That's the time in seconds for which the value will be stored. It defaults to **one day** from the time you save the value. You can pass any value that you like.

- **storage**
  The storage that'll be used to save the store data. Defaults to `window.localStorage`. You can pass in `'session'` to use `window.sessionStorage`. Else, you can supply your own storage, considering that has the same API surface as `window.localStorage`

```javascript
const store = featherstore({
  namespace: '__APPNAME__',
  ttl: 60 * 60 * 24 * 1000 * 365, // One year
  storage: 'session'
});
```

## Sample

```javascript
// create store
const store = featherstore();

// set a value
store.set('key', 'value');

// set a value with a custom timeout (other than default ttl) by passing ttl as third argument
store.set('key_3_sec', 'value for 3 secs', 3000);

// get a stored value
store.get('key'); // value

// check if the store has a value with some `key`
store.has('key'); // true
store.has('non_existing_key'); // false

// get the list of keys in store
store.keys(); // ['key']

// remove a value with some `key`
store.clear('key');

// remove all values from store i.e clear the store
store.clear();
```

## License

Copyright © MIT
