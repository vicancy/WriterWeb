function memoryCache () {
  var cache = {};
  function now() { return (new Date()).getTime(); }
  var debug = false;
  var hitCount = 0;
  var missCount = 0;

  function put(key, value, time, timeoutCallback) {
    if (debug) console.log('caching: ', key, ' = ', value, ' (@', time, ')');
    var oldRecord = cache[key];
    if (oldRecord) {
      clearTimeout(oldRecord.timeout);
    }

    var expire = time + now();

    var record = {value: value, expire: expire};

    if (!isNaN(expire)) {
      var timeout = setTimeout(function() {
        exports.del(key);
        if (typeof timeoutCallback === 'function') {
          timeoutCallback(key);
        }
      }, time);
      record.timeout = timeout;
    }

    if (debug) console.log('cached : ', record);
    cache[key] = record;
  }

  function del(key) {
    delete cache[key];
  }

  function clear() {
    cache = {};
  }

  function get(key) {
    var data = cache[key];
    console.log("cache get ", data);
    if (typeof data != "undefined") {
      if (isNaN(data.expire) || data.expire >= now()) {
        if (debug) hitCount++;
        return data.value;
      } else {
        // free some space
        if (debug) missCount++;
        del(key);
      }
    }
    return null;
  }

  function size() {
    var size = 0, key;
    for (key in cache) {
      if (cache.hasOwnProperty(key))
        if (get(key) !== null)
          size++;
    }
    return size;
  }

  function memsize() {
    var size = 0, key;
    for (key in cache) {
      if (cache.hasOwnProperty(key))
        size++;
    }
    return size;
  }

  function debug(bool) {
    debug = bool;
  }

  function hits() {
    return hitCount;
  }

  function misses() {
    return missCount;
  }

  function items() {
    return cache;
  }

}