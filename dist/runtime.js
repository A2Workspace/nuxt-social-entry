'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
    rsComboSymbolsRange = '\\u20d0-\\u20f0',
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
 * that is not found in the character symbols.
 *
 * @private
 * @param {Array} strSymbols The string symbols to inspect.
 * @param {Array} chrSymbols The character symbols to find.
 * @returns {number} Returns the index of the first unmatched string symbol.
 */
function charsStartIndex(strSymbols, chrSymbols) {
  var index = -1,
      length = strSymbols.length;

  while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
  return index;
}

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
 * that is not found in the character symbols.
 *
 * @private
 * @param {Array} strSymbols The string symbols to inspect.
 * @param {Array} chrSymbols The character symbols to find.
 * @returns {number} Returns the index of the last unmatched string symbol.
 */
function charsEndIndex(strSymbols, chrSymbols) {
  var index = strSymbols.length;

  while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
  return index;
}

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol = root.Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : baseSlice(array, start, end);
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Removes leading and trailing whitespace or specified characters from `string`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to trim.
 * @param {string} [chars=whitespace] The characters to trim.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {string} Returns the trimmed string.
 * @example
 *
 * _.trim('  abc  ');
 * // => 'abc'
 *
 * _.trim('-_-abc-_-', '_-');
 * // => 'abc'
 *
 * _.map(['  foo  ', '  bar  '], _.trim);
 * // => ['foo', 'bar']
 */
function trim(string, chars, guard) {
  string = toString(string);
  if (string && (guard || chars === undefined)) {
    return string.replace(reTrim, '');
  }
  if (!string || !(chars = baseToString(chars))) {
    return string;
  }
  var strSymbols = stringToArray(string),
      chrSymbols = stringToArray(chars),
      start = charsStartIndex(strSymbols, chrSymbols),
      end = charsEndIndex(strSymbols, chrSymbols) + 1;

  return castSlice(strSymbols, start, end).join('');
}

var lodash_trim = trim;

class RedirectRequest {
  constructor(targetUrl) {
    this.targetUrl = targetUrl;
  }
  redirect() {
    window.location.assign(this.targetUrl);
  }
  getTargetUrl() {
    return this.targetUrl;
  }
}
RedirectRequest.make = function(uri, params = {}) {
  if (!uri.match(/^https?:\/\//)) {
    uri = lodash_trim(window.location.href, "/") + "/" + lodash_trim(uri, "/");
  }
  const targetUrl = new URL(uri);
  for (const [key, value] of Object.entries(params)) {
    targetUrl.searchParams.set(key, value);
  }
  return new RedirectRequest(targetUrl.toString());
};

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}
function resetParams() {
  window.history.replaceState({}, window.document.title, window.location.href.split("?")[0]);
}
function getPayload(response) {
  let payload = response.data;
  if (typeof payload === "object" && typeof payload.data === "object") {
    return payload;
  }
  return payload;
}

class SocialEntry {
  constructor(ctx, options) {
    this.ctx = ctx;
    this.options = options;
  }
  endpoint(name) {
    const options = Object.assign({}, this.options, this.ctx.$config);
    if (typeof options.endpoints[name] === "undefined") {
      throw new Error(`Cannot resolve endpoint: ${name}`);
    }
    let url = options.endpoints[name];
    if (url.match(/^https?:\/\//)) {
      return url;
    }
    return lodash_trim(options.url, "/") + "/" + lodash_trim(url, "/");
  }
  authorize(provider, continueUri) {
    continueUri = continueUri || window.location.href;
    const endpoint = this.endpoint("authorization");
    return RedirectRequest.make(endpoint, {
      continue: continueUri,
      provider
    });
  }
  async completeAuthorization(code) {
    const defaultOptions = {
      code: getParam("code"),
      url: this.endpoint("token"),
      autoResetParams: true
    };
    const options = function() {
      if (typeof code === "string") {
        return Object.assign({}, defaultOptions, {
          code,
          autoResetParams: false
        });
      }
      if (typeof code === "object") {
        return Object.assign({}, defaultOptions, code);
      }
      return defaultOptions;
    }();
    const requestConfig = {
      method: "post",
      url: options.url,
      data: {
        code: options.code
      }
    };
    const response = await this.ctx.app.$axios.request(requestConfig).finally(() => {
      if (options.autoResetParams) {
        resetParams();
      }
    });
    this.lastAccessTokenResponse = response;
    this.accessToken = this.getAccessToken(response);
    return response;
  }
  hasAuthCode() {
    return getParam("code") !== null;
  }
  isNewUserAccess(response) {
    const payload = getPayload(response);
    return payload.new_user || payload.local_user_id == null;
  }
  hasAccessToken(response) {
    const payload = getPayload(response);
    return typeof payload.access_token === "string";
  }
  getAccessToken(response) {
    const payload = getPayload(response);
    return payload.access_token;
  }
  async requestAccess(options, handler) {
    let accessToken = options.accessToken || this.accessToken;
    if (!accessToken) {
      if (this.hasAuthCode() == false) {
        throw new Error("[SocialEntry] Unauthorized");
      }
      const accessTokenResponse = await this.completeAuthorization();
      let respondedAccessToken = this.getAccessToken(accessTokenResponse);
      if (!respondedAccessToken) {
        throw new Error("[SocialEntry] Invalid access token response");
      }
      accessToken = respondedAccessToken;
    }
    const requestConfig = {
      method: "post",
      url: options.url,
      data: {
        access_token: accessToken
      }
    };
    return await handler(requestConfig);
  }
  async loginWithToken(accessToken) {
    const options = parseAccessRequestOptions(accessToken, this.endpoint("login"));
    const response = await this.requestAccess(options, (requestConfig) => {
      return this.ctx.app.$axios.request(requestConfig);
    });
    if (isAuthModuleLoaded(this.ctx)) {
      const userAccessToken = this.getAccessToken(response);
      await this.ctx.app.$auth.setUserToken(userAccessToken, userAccessToken);
    }
    return response;
  }
  connectWithToken(accessToken) {
    const options = parseAccessRequestOptions(accessToken, this.endpoint("connect"));
    return this.requestAccess(options, (requestConfig) => {
      return this.ctx.app.$axios.request(requestConfig);
    });
  }
  disconnect(provider, identifier) {
    const requestConfig = {
      method: "post",
      url: this.endpoint("disconnect"),
      data: {
        identifier,
        type: provider
      }
    };
    return this.ctx.app.$axios.request(requestConfig);
  }
}
function parseAccessRequestOptions(accessToken, url) {
  const defaultOptions = {
    accessToken: null,
    url
  };
  const options = function() {
    if (typeof accessToken === "string") {
      return Object.assign({}, defaultOptions, { accessToken });
    }
    if (typeof accessToken === "object") {
      return Object.assign({}, defaultOptions, accessToken);
    }
    return defaultOptions;
  }();
  return options;
}
function isAuthModuleLoaded(ctx) {
  return ctx.app.$auth && typeof ctx.app.$auth.setUserToken === "function";
}

exports.SocialEntry = SocialEntry;
exports.getParam = getParam;
exports.getPayload = getPayload;
exports.resetParams = resetParams;
