var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/node-stdlib-browser/helpers/esbuild/shim.js
var import_buffer, import_process, _globalThis, _global;
var init_shim = __esm({
  "node_modules/node-stdlib-browser/helpers/esbuild/shim.js"() {
    import_buffer = require("buffer");
    import_process = __toESM(require("process"));
    _globalThis = function(Object2) {
      function get4() {
        var _global3 = this || self;
        delete Object2.prototype.__magic__;
        return _global3;
      }
      if (typeof globalThis === "object") {
        return globalThis;
      }
      if (this) {
        return get4();
      } else {
        Object2.defineProperty(Object2.prototype, "__magic__", {
          configurable: true,
          get: get4
        });
        var _global2 = __magic__;
        return _global2;
      }
    }(Object);
    _global = _globalThis;
  }
});

// node_modules/clone/clone.js
var require_clone = __commonJS({
  "node_modules/clone/clone.js"(exports, module2) {
    init_shim();
    var clone7 = function() {
      "use strict";
      function _instanceof(obj, type) {
        return type != null && obj instanceof type;
      }
      var nativeMap;
      try {
        nativeMap = Map;
      } catch (_) {
        nativeMap = function() {
        };
      }
      var nativeSet;
      try {
        nativeSet = Set;
      } catch (_) {
        nativeSet = function() {
        };
      }
      var nativePromise;
      try {
        nativePromise = Promise;
      } catch (_) {
        nativePromise = function() {
        };
      }
      function clone8(parent, circular, depth, prototype, includeNonEnumerable) {
        if (typeof circular === "object") {
          depth = circular.depth;
          prototype = circular.prototype;
          includeNonEnumerable = circular.includeNonEnumerable;
          circular = circular.circular;
        }
        var allParents = [];
        var allChildren = [];
        var useBuffer = typeof import_buffer.Buffer != "undefined";
        if (typeof circular == "undefined")
          circular = true;
        if (typeof depth == "undefined")
          depth = Infinity;
        function _clone(parent2, depth2) {
          if (parent2 === null)
            return null;
          if (depth2 === 0)
            return parent2;
          var child;
          var proto;
          if (typeof parent2 != "object") {
            return parent2;
          }
          if (_instanceof(parent2, nativeMap)) {
            child = new nativeMap();
          } else if (_instanceof(parent2, nativeSet)) {
            child = new nativeSet();
          } else if (_instanceof(parent2, nativePromise)) {
            child = new nativePromise(function(resolve, reject) {
              parent2.then(function(value) {
                resolve(_clone(value, depth2 - 1));
              }, function(err) {
                reject(_clone(err, depth2 - 1));
              });
            });
          } else if (clone8.__isArray(parent2)) {
            child = [];
          } else if (clone8.__isRegExp(parent2)) {
            child = new RegExp(parent2.source, __getRegExpFlags(parent2));
            if (parent2.lastIndex)
              child.lastIndex = parent2.lastIndex;
          } else if (clone8.__isDate(parent2)) {
            child = new Date(parent2.getTime());
          } else if (useBuffer && import_buffer.Buffer.isBuffer(parent2)) {
            if (import_buffer.Buffer.allocUnsafe) {
              child = import_buffer.Buffer.allocUnsafe(parent2.length);
            } else {
              child = new import_buffer.Buffer(parent2.length);
            }
            parent2.copy(child);
            return child;
          } else if (_instanceof(parent2, Error)) {
            child = Object.create(parent2);
          } else {
            if (typeof prototype == "undefined") {
              proto = Object.getPrototypeOf(parent2);
              child = Object.create(proto);
            } else {
              child = Object.create(prototype);
              proto = prototype;
            }
          }
          if (circular) {
            var index = allParents.indexOf(parent2);
            if (index != -1) {
              return allChildren[index];
            }
            allParents.push(parent2);
            allChildren.push(child);
          }
          if (_instanceof(parent2, nativeMap)) {
            parent2.forEach(function(value, key) {
              var keyChild = _clone(key, depth2 - 1);
              var valueChild = _clone(value, depth2 - 1);
              child.set(keyChild, valueChild);
            });
          }
          if (_instanceof(parent2, nativeSet)) {
            parent2.forEach(function(value) {
              var entryChild = _clone(value, depth2 - 1);
              child.add(entryChild);
            });
          }
          for (var i in parent2) {
            var attrs;
            if (proto) {
              attrs = Object.getOwnPropertyDescriptor(proto, i);
            }
            if (attrs && attrs.set == null) {
              continue;
            }
            child[i] = _clone(parent2[i], depth2 - 1);
          }
          if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(parent2);
            for (var i = 0; i < symbols.length; i++) {
              var symbol = symbols[i];
              var descriptor = Object.getOwnPropertyDescriptor(parent2, symbol);
              if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
                continue;
              }
              child[symbol] = _clone(parent2[symbol], depth2 - 1);
              if (!descriptor.enumerable) {
                Object.defineProperty(child, symbol, {
                  enumerable: false
                });
              }
            }
          }
          if (includeNonEnumerable) {
            var allPropertyNames = Object.getOwnPropertyNames(parent2);
            for (var i = 0; i < allPropertyNames.length; i++) {
              var propertyName = allPropertyNames[i];
              var descriptor = Object.getOwnPropertyDescriptor(parent2, propertyName);
              if (descriptor && descriptor.enumerable) {
                continue;
              }
              child[propertyName] = _clone(parent2[propertyName], depth2 - 1);
              Object.defineProperty(child, propertyName, {
                enumerable: false
              });
            }
          }
          return child;
        }
        return _clone(parent, depth);
      }
      clone8.clonePrototype = function clonePrototype(parent) {
        if (parent === null)
          return null;
        var c = function() {
        };
        c.prototype = parent;
        return new c();
      };
      function __objToStr(o) {
        return Object.prototype.toString.call(o);
      }
      clone8.__objToStr = __objToStr;
      function __isDate(o) {
        return typeof o === "object" && __objToStr(o) === "[object Date]";
      }
      clone8.__isDate = __isDate;
      function __isArray(o) {
        return typeof o === "object" && __objToStr(o) === "[object Array]";
      }
      clone8.__isArray = __isArray;
      function __isRegExp(o) {
        return typeof o === "object" && __objToStr(o) === "[object RegExp]";
      }
      clone8.__isRegExp = __isRegExp;
      function __getRegExpFlags(re) {
        var flags = "";
        if (re.global)
          flags += "g";
        if (re.ignoreCase)
          flags += "i";
        if (re.multiline)
          flags += "m";
        return flags;
      }
      clone8.__getRegExpFlags = __getRegExpFlags;
      return clone8;
    }();
    if (typeof module2 === "object" && module2.exports) {
      module2.exports = clone7;
    }
  }
});

// node_modules/fast-glob/out/utils/array.js
var require_array = __commonJS({
  "node_modules/fast-glob/out/utils/array.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.splitWhen = exports.flatten = void 0;
    function flatten(items) {
      return items.reduce((collection, item) => [].concat(collection, item), []);
    }
    exports.flatten = flatten;
    function splitWhen(items, predicate) {
      const result = [[]];
      let groupIndex = 0;
      for (const item of items) {
        if (predicate(item)) {
          groupIndex++;
          result[groupIndex] = [];
        } else {
          result[groupIndex].push(item);
        }
      }
      return result;
    }
    exports.splitWhen = splitWhen;
  }
});

// node_modules/fast-glob/out/utils/errno.js
var require_errno = __commonJS({
  "node_modules/fast-glob/out/utils/errno.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isEnoentCodeError = void 0;
    function isEnoentCodeError(error7) {
      return error7.code === "ENOENT";
    }
    exports.isEnoentCodeError = isEnoentCodeError;
  }
});

// node_modules/fast-glob/out/utils/fs.js
var require_fs = __commonJS({
  "node_modules/fast-glob/out/utils/fs.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createDirentFromStats = void 0;
    var DirentFromStats = class {
      constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
      }
    };
    function createDirentFromStats(name, stats) {
      return new DirentFromStats(name, stats);
    }
    exports.createDirentFromStats = createDirentFromStats;
  }
});

// node_modules/fast-glob/out/utils/path.js
var require_path = __commonJS({
  "node_modules/fast-glob/out/utils/path.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.removeLeadingDotSegment = exports.escape = exports.makeAbsolute = exports.unixify = void 0;
    var path10 = require("path");
    var LEADING_DOT_SEGMENT_CHARACTERS_COUNT = 2;
    var UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\())/g;
    function unixify(filepath) {
      return filepath.replace(/\\/g, "/");
    }
    exports.unixify = unixify;
    function makeAbsolute(cwd, filepath) {
      return path10.resolve(cwd, filepath);
    }
    exports.makeAbsolute = makeAbsolute;
    function escape(pattern) {
      return pattern.replace(UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
    }
    exports.escape = escape;
    function removeLeadingDotSegment(entry) {
      if (entry.charAt(0) === ".") {
        const secondCharactery = entry.charAt(1);
        if (secondCharactery === "/" || secondCharactery === "\\") {
          return entry.slice(LEADING_DOT_SEGMENT_CHARACTERS_COUNT);
        }
      }
      return entry;
    }
    exports.removeLeadingDotSegment = removeLeadingDotSegment;
  }
});

// node_modules/is-extglob/index.js
var require_is_extglob = __commonJS({
  "node_modules/is-extglob/index.js"(exports, module2) {
    init_shim();
    module2.exports = function isExtglob(str) {
      if (typeof str !== "string" || str === "") {
        return false;
      }
      var match;
      while (match = /(\\).|([@?!+*]\(.*\))/g.exec(str)) {
        if (match[2])
          return true;
        str = str.slice(match.index + match[0].length);
      }
      return false;
    };
  }
});

// node_modules/is-glob/index.js
var require_is_glob = __commonJS({
  "node_modules/is-glob/index.js"(exports, module2) {
    init_shim();
    var isExtglob = require_is_extglob();
    var chars = { "{": "}", "(": ")", "[": "]" };
    var strictCheck = function(str) {
      if (str[0] === "!") {
        return true;
      }
      var index = 0;
      var pipeIndex = -2;
      var closeSquareIndex = -2;
      var closeCurlyIndex = -2;
      var closeParenIndex = -2;
      var backSlashIndex = -2;
      while (index < str.length) {
        if (str[index] === "*") {
          return true;
        }
        if (str[index + 1] === "?" && /[\].+)]/.test(str[index])) {
          return true;
        }
        if (closeSquareIndex !== -1 && str[index] === "[" && str[index + 1] !== "]") {
          if (closeSquareIndex < index) {
            closeSquareIndex = str.indexOf("]", index);
          }
          if (closeSquareIndex > index) {
            if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
              return true;
            }
            backSlashIndex = str.indexOf("\\", index);
            if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
              return true;
            }
          }
        }
        if (closeCurlyIndex !== -1 && str[index] === "{" && str[index + 1] !== "}") {
          closeCurlyIndex = str.indexOf("}", index);
          if (closeCurlyIndex > index) {
            backSlashIndex = str.indexOf("\\", index);
            if (backSlashIndex === -1 || backSlashIndex > closeCurlyIndex) {
              return true;
            }
          }
        }
        if (closeParenIndex !== -1 && str[index] === "(" && str[index + 1] === "?" && /[:!=]/.test(str[index + 2]) && str[index + 3] !== ")") {
          closeParenIndex = str.indexOf(")", index);
          if (closeParenIndex > index) {
            backSlashIndex = str.indexOf("\\", index);
            if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
              return true;
            }
          }
        }
        if (pipeIndex !== -1 && str[index] === "(" && str[index + 1] !== "|") {
          if (pipeIndex < index) {
            pipeIndex = str.indexOf("|", index);
          }
          if (pipeIndex !== -1 && str[pipeIndex + 1] !== ")") {
            closeParenIndex = str.indexOf(")", pipeIndex);
            if (closeParenIndex > pipeIndex) {
              backSlashIndex = str.indexOf("\\", pipeIndex);
              if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
                return true;
              }
            }
          }
        }
        if (str[index] === "\\") {
          var open = str[index + 1];
          index += 2;
          var close = chars[open];
          if (close) {
            var n = str.indexOf(close, index);
            if (n !== -1) {
              index = n + 1;
            }
          }
          if (str[index] === "!") {
            return true;
          }
        } else {
          index++;
        }
      }
      return false;
    };
    var relaxedCheck = function(str) {
      if (str[0] === "!") {
        return true;
      }
      var index = 0;
      while (index < str.length) {
        if (/[*?{}()[\]]/.test(str[index])) {
          return true;
        }
        if (str[index] === "\\") {
          var open = str[index + 1];
          index += 2;
          var close = chars[open];
          if (close) {
            var n = str.indexOf(close, index);
            if (n !== -1) {
              index = n + 1;
            }
          }
          if (str[index] === "!") {
            return true;
          }
        } else {
          index++;
        }
      }
      return false;
    };
    module2.exports = function isGlob(str, options) {
      if (typeof str !== "string" || str === "") {
        return false;
      }
      if (isExtglob(str)) {
        return true;
      }
      var check2 = strictCheck;
      if (options && options.strict === false) {
        check2 = relaxedCheck;
      }
      return check2(str);
    };
  }
});

// node_modules/glob-parent/index.js
var require_glob_parent = __commonJS({
  "node_modules/glob-parent/index.js"(exports, module2) {
    "use strict";
    init_shim();
    var isGlob = require_is_glob();
    var pathPosixDirname = require("path").posix.dirname;
    var isWin32 = require("os").platform() === "win32";
    var slash = "/";
    var backslash = /\\/g;
    var enclosure = /[\{\[].*[\}\]]$/;
    var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
    var escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;
    module2.exports = function globParent(str, opts) {
      var options = Object.assign({ flipBackslashes: true }, opts);
      if (options.flipBackslashes && isWin32 && str.indexOf(slash) < 0) {
        str = str.replace(backslash, slash);
      }
      if (enclosure.test(str)) {
        str += slash;
      }
      str += "a";
      do {
        str = pathPosixDirname(str);
      } while (isGlob(str) || globby.test(str));
      return str.replace(escaped, "$1");
    };
  }
});

// node_modules/braces/lib/utils.js
var require_utils = __commonJS({
  "node_modules/braces/lib/utils.js"(exports) {
    "use strict";
    init_shim();
    exports.isInteger = (num3) => {
      if (typeof num3 === "number") {
        return Number.isInteger(num3);
      }
      if (typeof num3 === "string" && num3.trim() !== "") {
        return Number.isInteger(Number(num3));
      }
      return false;
    };
    exports.find = (node, type) => node.nodes.find((node2) => node2.type === type);
    exports.exceedsLimit = (min, max, step = 1, limit) => {
      if (limit === false)
        return false;
      if (!exports.isInteger(min) || !exports.isInteger(max))
        return false;
      return (Number(max) - Number(min)) / Number(step) >= limit;
    };
    exports.escapeNode = (block, n = 0, type) => {
      let node = block.nodes[n];
      if (!node)
        return;
      if (type && node.type === type || node.type === "open" || node.type === "close") {
        if (node.escaped !== true) {
          node.value = "\\" + node.value;
          node.escaped = true;
        }
      }
    };
    exports.encloseBrace = (node) => {
      if (node.type !== "brace")
        return false;
      if (node.commas >> 0 + node.ranges >> 0 === 0) {
        node.invalid = true;
        return true;
      }
      return false;
    };
    exports.isInvalidBrace = (block) => {
      if (block.type !== "brace")
        return false;
      if (block.invalid === true || block.dollar)
        return true;
      if (block.commas >> 0 + block.ranges >> 0 === 0) {
        block.invalid = true;
        return true;
      }
      if (block.open !== true || block.close !== true) {
        block.invalid = true;
        return true;
      }
      return false;
    };
    exports.isOpenOrClose = (node) => {
      if (node.type === "open" || node.type === "close") {
        return true;
      }
      return node.open === true || node.close === true;
    };
    exports.reduce = (nodes) => nodes.reduce((acc, node) => {
      if (node.type === "text")
        acc.push(node.value);
      if (node.type === "range")
        node.type = "text";
      return acc;
    }, []);
    exports.flatten = (...args) => {
      const result = [];
      const flat = (arr) => {
        for (let i = 0; i < arr.length; i++) {
          let ele = arr[i];
          Array.isArray(ele) ? flat(ele, result) : ele !== void 0 && result.push(ele);
        }
        return result;
      };
      flat(args);
      return result;
    };
  }
});

// node_modules/braces/lib/stringify.js
var require_stringify = __commonJS({
  "node_modules/braces/lib/stringify.js"(exports, module2) {
    "use strict";
    init_shim();
    var utils = require_utils();
    module2.exports = (ast, options = {}) => {
      let stringify = (node, parent = {}) => {
        let invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
        let invalidNode = node.invalid === true && options.escapeInvalid === true;
        let output = "";
        if (node.value) {
          if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) {
            return "\\" + node.value;
          }
          return node.value;
        }
        if (node.value) {
          return node.value;
        }
        if (node.nodes) {
          for (let child of node.nodes) {
            output += stringify(child);
          }
        }
        return output;
      };
      return stringify(ast);
    };
  }
});

// node_modules/is-number/index.js
var require_is_number = __commonJS({
  "node_modules/is-number/index.js"(exports, module2) {
    "use strict";
    init_shim();
    module2.exports = function(num3) {
      if (typeof num3 === "number") {
        return num3 - num3 === 0;
      }
      if (typeof num3 === "string" && num3.trim() !== "") {
        return Number.isFinite ? Number.isFinite(+num3) : isFinite(+num3);
      }
      return false;
    };
  }
});

// node_modules/to-regex-range/index.js
var require_to_regex_range = __commonJS({
  "node_modules/to-regex-range/index.js"(exports, module2) {
    "use strict";
    init_shim();
    var isNumber = require_is_number();
    var toRegexRange = (min, max, options) => {
      if (isNumber(min) === false) {
        throw new TypeError("toRegexRange: expected the first argument to be a number");
      }
      if (max === void 0 || min === max) {
        return String(min);
      }
      if (isNumber(max) === false) {
        throw new TypeError("toRegexRange: expected the second argument to be a number.");
      }
      let opts = { relaxZeros: true, ...options };
      if (typeof opts.strictZeros === "boolean") {
        opts.relaxZeros = opts.strictZeros === false;
      }
      let relax = String(opts.relaxZeros);
      let shorthand = String(opts.shorthand);
      let capture = String(opts.capture);
      let wrap = String(opts.wrap);
      let cacheKey = min + ":" + max + "=" + relax + shorthand + capture + wrap;
      if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
        return toRegexRange.cache[cacheKey].result;
      }
      let a = Math.min(min, max);
      let b = Math.max(min, max);
      if (Math.abs(a - b) === 1) {
        let result = min + "|" + max;
        if (opts.capture) {
          return `(${result})`;
        }
        if (opts.wrap === false) {
          return result;
        }
        return `(?:${result})`;
      }
      let isPadded = hasPadding(min) || hasPadding(max);
      let state = { min, max, a, b };
      let positives = [];
      let negatives = [];
      if (isPadded) {
        state.isPadded = isPadded;
        state.maxLen = String(state.max).length;
      }
      if (a < 0) {
        let newMin = b < 0 ? Math.abs(b) : 1;
        negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
        a = state.a = 0;
      }
      if (b >= 0) {
        positives = splitToPatterns(a, b, state, opts);
      }
      state.negatives = negatives;
      state.positives = positives;
      state.result = collatePatterns(negatives, positives, opts);
      if (opts.capture === true) {
        state.result = `(${state.result})`;
      } else if (opts.wrap !== false && positives.length + negatives.length > 1) {
        state.result = `(?:${state.result})`;
      }
      toRegexRange.cache[cacheKey] = state;
      return state.result;
    };
    function collatePatterns(neg, pos, options) {
      let onlyNegative = filterPatterns(neg, pos, "-", false, options) || [];
      let onlyPositive = filterPatterns(pos, neg, "", false, options) || [];
      let intersected = filterPatterns(neg, pos, "-?", true, options) || [];
      let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
      return subpatterns.join("|");
    }
    function splitToRanges(min, max) {
      let nines = 1;
      let zeros = 1;
      let stop = countNines(min, nines);
      let stops = /* @__PURE__ */ new Set([max]);
      while (min <= stop && stop <= max) {
        stops.add(stop);
        nines += 1;
        stop = countNines(min, nines);
      }
      stop = countZeros(max + 1, zeros) - 1;
      while (min < stop && stop <= max) {
        stops.add(stop);
        zeros += 1;
        stop = countZeros(max + 1, zeros) - 1;
      }
      stops = [...stops];
      stops.sort(compare);
      return stops;
    }
    function rangeToPattern(start, stop, options) {
      if (start === stop) {
        return { pattern: start, count: [], digits: 0 };
      }
      let zipped = zip(start, stop);
      let digits = zipped.length;
      let pattern = "";
      let count = 0;
      for (let i = 0; i < digits; i++) {
        let [startDigit, stopDigit] = zipped[i];
        if (startDigit === stopDigit) {
          pattern += startDigit;
        } else if (startDigit !== "0" || stopDigit !== "9") {
          pattern += toCharacterClass(startDigit, stopDigit, options);
        } else {
          count++;
        }
      }
      if (count) {
        pattern += options.shorthand === true ? "\\d" : "[0-9]";
      }
      return { pattern, count: [count], digits };
    }
    function splitToPatterns(min, max, tok, options) {
      let ranges = splitToRanges(min, max);
      let tokens2 = [];
      let start = min;
      let prev;
      for (let i = 0; i < ranges.length; i++) {
        let max2 = ranges[i];
        let obj = rangeToPattern(String(start), String(max2), options);
        let zeros = "";
        if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
          if (prev.count.length > 1) {
            prev.count.pop();
          }
          prev.count.push(obj.count[0]);
          prev.string = prev.pattern + toQuantifier(prev.count);
          start = max2 + 1;
          continue;
        }
        if (tok.isPadded) {
          zeros = padZeros(max2, tok, options);
        }
        obj.string = zeros + obj.pattern + toQuantifier(obj.count);
        tokens2.push(obj);
        start = max2 + 1;
        prev = obj;
      }
      return tokens2;
    }
    function filterPatterns(arr, comparison, prefix, intersection, options) {
      let result = [];
      for (let ele of arr) {
        let { string } = ele;
        if (!intersection && !contains(comparison, "string", string)) {
          result.push(prefix + string);
        }
        if (intersection && contains(comparison, "string", string)) {
          result.push(prefix + string);
        }
      }
      return result;
    }
    function zip(a, b) {
      let arr = [];
      for (let i = 0; i < a.length; i++)
        arr.push([a[i], b[i]]);
      return arr;
    }
    function compare(a, b) {
      return a > b ? 1 : b > a ? -1 : 0;
    }
    function contains(arr, key, val) {
      return arr.some((ele) => ele[key] === val);
    }
    function countNines(min, len) {
      return Number(String(min).slice(0, -len) + "9".repeat(len));
    }
    function countZeros(integer, zeros) {
      return integer - integer % Math.pow(10, zeros);
    }
    function toQuantifier(digits) {
      let [start = 0, stop = ""] = digits;
      if (stop || start > 1) {
        return `{${start + (stop ? "," + stop : "")}}`;
      }
      return "";
    }
    function toCharacterClass(a, b, options) {
      return `[${a}${b - a === 1 ? "" : "-"}${b}]`;
    }
    function hasPadding(str) {
      return /^-?(0+)\d/.test(str);
    }
    function padZeros(value, tok, options) {
      if (!tok.isPadded) {
        return value;
      }
      let diff = Math.abs(tok.maxLen - String(value).length);
      let relax = options.relaxZeros !== false;
      switch (diff) {
        case 0:
          return "";
        case 1:
          return relax ? "0?" : "0";
        case 2:
          return relax ? "0{0,2}" : "00";
        default: {
          return relax ? `0{0,${diff}}` : `0{${diff}}`;
        }
      }
    }
    toRegexRange.cache = {};
    toRegexRange.clearCache = () => toRegexRange.cache = {};
    module2.exports = toRegexRange;
  }
});

// node_modules/fill-range/index.js
var require_fill_range = __commonJS({
  "node_modules/fill-range/index.js"(exports, module2) {
    "use strict";
    init_shim();
    var util = require("util");
    var toRegexRange = require_to_regex_range();
    var isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    var transform = (toNumber) => {
      return (value) => toNumber === true ? Number(value) : String(value);
    };
    var isValidValue = (value) => {
      return typeof value === "number" || typeof value === "string" && value !== "";
    };
    var isNumber = (num3) => Number.isInteger(+num3);
    var zeros = (input) => {
      let value = `${input}`;
      let index = -1;
      if (value[0] === "-")
        value = value.slice(1);
      if (value === "0")
        return false;
      while (value[++index] === "0")
        ;
      return index > 0;
    };
    var stringify = (start, end, options) => {
      if (typeof start === "string" || typeof end === "string") {
        return true;
      }
      return options.stringify === true;
    };
    var pad = (input, maxLength, toNumber) => {
      if (maxLength > 0) {
        let dash = input[0] === "-" ? "-" : "";
        if (dash)
          input = input.slice(1);
        input = dash + input.padStart(dash ? maxLength - 1 : maxLength, "0");
      }
      if (toNumber === false) {
        return String(input);
      }
      return input;
    };
    var toMaxLen = (input, maxLength) => {
      let negative = input[0] === "-" ? "-" : "";
      if (negative) {
        input = input.slice(1);
        maxLength--;
      }
      while (input.length < maxLength)
        input = "0" + input;
      return negative ? "-" + input : input;
    };
    var toSequence = (parts, options) => {
      parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
      parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
      let prefix = options.capture ? "" : "?:";
      let positives = "";
      let negatives = "";
      let result;
      if (parts.positives.length) {
        positives = parts.positives.join("|");
      }
      if (parts.negatives.length) {
        negatives = `-(${prefix}${parts.negatives.join("|")})`;
      }
      if (positives && negatives) {
        result = `${positives}|${negatives}`;
      } else {
        result = positives || negatives;
      }
      if (options.wrap) {
        return `(${prefix}${result})`;
      }
      return result;
    };
    var toRange = (a, b, isNumbers, options) => {
      if (isNumbers) {
        return toRegexRange(a, b, { wrap: false, ...options });
      }
      let start = String.fromCharCode(a);
      if (a === b)
        return start;
      let stop = String.fromCharCode(b);
      return `[${start}-${stop}]`;
    };
    var toRegex = (start, end, options) => {
      if (Array.isArray(start)) {
        let wrap = options.wrap === true;
        let prefix = options.capture ? "" : "?:";
        return wrap ? `(${prefix}${start.join("|")})` : start.join("|");
      }
      return toRegexRange(start, end, options);
    };
    var rangeError = (...args) => {
      return new RangeError("Invalid range arguments: " + util.inspect(...args));
    };
    var invalidRange = (start, end, options) => {
      if (options.strictRanges === true)
        throw rangeError([start, end]);
      return [];
    };
    var invalidStep = (step, options) => {
      if (options.strictRanges === true) {
        throw new TypeError(`Expected step "${step}" to be a number`);
      }
      return [];
    };
    var fillNumbers = (start, end, step = 1, options = {}) => {
      let a = Number(start);
      let b = Number(end);
      if (!Number.isInteger(a) || !Number.isInteger(b)) {
        if (options.strictRanges === true)
          throw rangeError([start, end]);
        return [];
      }
      if (a === 0)
        a = 0;
      if (b === 0)
        b = 0;
      let descending = a > b;
      let startString = String(start);
      let endString = String(end);
      let stepString = String(step);
      step = Math.max(Math.abs(step), 1);
      let padded = zeros(startString) || zeros(endString) || zeros(stepString);
      let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
      let toNumber = padded === false && stringify(start, end, options) === false;
      let format = options.transform || transform(toNumber);
      if (options.toRegex && step === 1) {
        return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
      }
      let parts = { negatives: [], positives: [] };
      let push = (num3) => parts[num3 < 0 ? "negatives" : "positives"].push(Math.abs(num3));
      let range = [];
      let index = 0;
      while (descending ? a >= b : a <= b) {
        if (options.toRegex === true && step > 1) {
          push(a);
        } else {
          range.push(pad(format(a, index), maxLen, toNumber));
        }
        a = descending ? a - step : a + step;
        index++;
      }
      if (options.toRegex === true) {
        return step > 1 ? toSequence(parts, options) : toRegex(range, null, { wrap: false, ...options });
      }
      return range;
    };
    var fillLetters = (start, end, step = 1, options = {}) => {
      if (!isNumber(start) && start.length > 1 || !isNumber(end) && end.length > 1) {
        return invalidRange(start, end, options);
      }
      let format = options.transform || ((val) => String.fromCharCode(val));
      let a = `${start}`.charCodeAt(0);
      let b = `${end}`.charCodeAt(0);
      let descending = a > b;
      let min = Math.min(a, b);
      let max = Math.max(a, b);
      if (options.toRegex && step === 1) {
        return toRange(min, max, false, options);
      }
      let range = [];
      let index = 0;
      while (descending ? a >= b : a <= b) {
        range.push(format(a, index));
        a = descending ? a - step : a + step;
        index++;
      }
      if (options.toRegex === true) {
        return toRegex(range, null, { wrap: false, options });
      }
      return range;
    };
    var fill = (start, end, step, options = {}) => {
      if (end == null && isValidValue(start)) {
        return [start];
      }
      if (!isValidValue(start) || !isValidValue(end)) {
        return invalidRange(start, end, options);
      }
      if (typeof step === "function") {
        return fill(start, end, 1, { transform: step });
      }
      if (isObject(step)) {
        return fill(start, end, 0, step);
      }
      let opts = { ...options };
      if (opts.capture === true)
        opts.wrap = true;
      step = step || opts.step || 1;
      if (!isNumber(step)) {
        if (step != null && !isObject(step))
          return invalidStep(step, opts);
        return fill(start, end, 1, step);
      }
      if (isNumber(start) && isNumber(end)) {
        return fillNumbers(start, end, step, opts);
      }
      return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
    };
    module2.exports = fill;
  }
});

// node_modules/braces/lib/compile.js
var require_compile = __commonJS({
  "node_modules/braces/lib/compile.js"(exports, module2) {
    "use strict";
    init_shim();
    var fill = require_fill_range();
    var utils = require_utils();
    var compile = (ast, options = {}) => {
      let walk = (node, parent = {}) => {
        let invalidBlock = utils.isInvalidBrace(parent);
        let invalidNode = node.invalid === true && options.escapeInvalid === true;
        let invalid = invalidBlock === true || invalidNode === true;
        let prefix = options.escapeInvalid === true ? "\\" : "";
        let output = "";
        if (node.isOpen === true) {
          return prefix + node.value;
        }
        if (node.isClose === true) {
          return prefix + node.value;
        }
        if (node.type === "open") {
          return invalid ? prefix + node.value : "(";
        }
        if (node.type === "close") {
          return invalid ? prefix + node.value : ")";
        }
        if (node.type === "comma") {
          return node.prev.type === "comma" ? "" : invalid ? node.value : "|";
        }
        if (node.value) {
          return node.value;
        }
        if (node.nodes && node.ranges > 0) {
          let args = utils.reduce(node.nodes);
          let range = fill(...args, { ...options, wrap: false, toRegex: true });
          if (range.length !== 0) {
            return args.length > 1 && range.length > 1 ? `(${range})` : range;
          }
        }
        if (node.nodes) {
          for (let child of node.nodes) {
            output += walk(child, node);
          }
        }
        return output;
      };
      return walk(ast);
    };
    module2.exports = compile;
  }
});

// node_modules/braces/lib/expand.js
var require_expand = __commonJS({
  "node_modules/braces/lib/expand.js"(exports, module2) {
    "use strict";
    init_shim();
    var fill = require_fill_range();
    var stringify = require_stringify();
    var utils = require_utils();
    var append = (queue = "", stash = "", enclose = false) => {
      let result = [];
      queue = [].concat(queue);
      stash = [].concat(stash);
      if (!stash.length)
        return queue;
      if (!queue.length) {
        return enclose ? utils.flatten(stash).map((ele) => `{${ele}}`) : stash;
      }
      for (let item of queue) {
        if (Array.isArray(item)) {
          for (let value of item) {
            result.push(append(value, stash, enclose));
          }
        } else {
          for (let ele of stash) {
            if (enclose === true && typeof ele === "string")
              ele = `{${ele}}`;
            result.push(Array.isArray(ele) ? append(item, ele, enclose) : item + ele);
          }
        }
      }
      return utils.flatten(result);
    };
    var expand = (ast, options = {}) => {
      let rangeLimit = options.rangeLimit === void 0 ? 1e3 : options.rangeLimit;
      let walk = (node, parent = {}) => {
        node.queue = [];
        let p = parent;
        let q = parent.queue;
        while (p.type !== "brace" && p.type !== "root" && p.parent) {
          p = p.parent;
          q = p.queue;
        }
        if (node.invalid || node.dollar) {
          q.push(append(q.pop(), stringify(node, options)));
          return;
        }
        if (node.type === "brace" && node.invalid !== true && node.nodes.length === 2) {
          q.push(append(q.pop(), ["{}"]));
          return;
        }
        if (node.nodes && node.ranges > 0) {
          let args = utils.reduce(node.nodes);
          if (utils.exceedsLimit(...args, options.step, rangeLimit)) {
            throw new RangeError("expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.");
          }
          let range = fill(...args, options);
          if (range.length === 0) {
            range = stringify(node, options);
          }
          q.push(append(q.pop(), range));
          node.nodes = [];
          return;
        }
        let enclose = utils.encloseBrace(node);
        let queue = node.queue;
        let block = node;
        while (block.type !== "brace" && block.type !== "root" && block.parent) {
          block = block.parent;
          queue = block.queue;
        }
        for (let i = 0; i < node.nodes.length; i++) {
          let child = node.nodes[i];
          if (child.type === "comma" && node.type === "brace") {
            if (i === 1)
              queue.push("");
            queue.push("");
            continue;
          }
          if (child.type === "close") {
            q.push(append(q.pop(), queue, enclose));
            continue;
          }
          if (child.value && child.type !== "open") {
            queue.push(append(queue.pop(), child.value));
            continue;
          }
          if (child.nodes) {
            walk(child, node);
          }
        }
        return queue;
      };
      return utils.flatten(walk(ast));
    };
    module2.exports = expand;
  }
});

// node_modules/braces/lib/constants.js
var require_constants = __commonJS({
  "node_modules/braces/lib/constants.js"(exports, module2) {
    "use strict";
    init_shim();
    module2.exports = {
      MAX_LENGTH: 1024 * 64,
      CHAR_0: "0",
      CHAR_9: "9",
      CHAR_UPPERCASE_A: "A",
      CHAR_LOWERCASE_A: "a",
      CHAR_UPPERCASE_Z: "Z",
      CHAR_LOWERCASE_Z: "z",
      CHAR_LEFT_PARENTHESES: "(",
      CHAR_RIGHT_PARENTHESES: ")",
      CHAR_ASTERISK: "*",
      CHAR_AMPERSAND: "&",
      CHAR_AT: "@",
      CHAR_BACKSLASH: "\\",
      CHAR_BACKTICK: "`",
      CHAR_CARRIAGE_RETURN: "\r",
      CHAR_CIRCUMFLEX_ACCENT: "^",
      CHAR_COLON: ":",
      CHAR_COMMA: ",",
      CHAR_DOLLAR: "$",
      CHAR_DOT: ".",
      CHAR_DOUBLE_QUOTE: '"',
      CHAR_EQUAL: "=",
      CHAR_EXCLAMATION_MARK: "!",
      CHAR_FORM_FEED: "\f",
      CHAR_FORWARD_SLASH: "/",
      CHAR_HASH: "#",
      CHAR_HYPHEN_MINUS: "-",
      CHAR_LEFT_ANGLE_BRACKET: "<",
      CHAR_LEFT_CURLY_BRACE: "{",
      CHAR_LEFT_SQUARE_BRACKET: "[",
      CHAR_LINE_FEED: "\n",
      CHAR_NO_BREAK_SPACE: "\xA0",
      CHAR_PERCENT: "%",
      CHAR_PLUS: "+",
      CHAR_QUESTION_MARK: "?",
      CHAR_RIGHT_ANGLE_BRACKET: ">",
      CHAR_RIGHT_CURLY_BRACE: "}",
      CHAR_RIGHT_SQUARE_BRACKET: "]",
      CHAR_SEMICOLON: ";",
      CHAR_SINGLE_QUOTE: "'",
      CHAR_SPACE: " ",
      CHAR_TAB: "	",
      CHAR_UNDERSCORE: "_",
      CHAR_VERTICAL_LINE: "|",
      CHAR_ZERO_WIDTH_NOBREAK_SPACE: "\uFEFF"
    };
  }
});

// node_modules/braces/lib/parse.js
var require_parse = __commonJS({
  "node_modules/braces/lib/parse.js"(exports, module2) {
    "use strict";
    init_shim();
    var stringify = require_stringify();
    var {
      MAX_LENGTH,
      CHAR_BACKSLASH,
      CHAR_BACKTICK,
      CHAR_COMMA,
      CHAR_DOT,
      CHAR_LEFT_PARENTHESES,
      CHAR_RIGHT_PARENTHESES,
      CHAR_LEFT_CURLY_BRACE,
      CHAR_RIGHT_CURLY_BRACE,
      CHAR_LEFT_SQUARE_BRACKET,
      CHAR_RIGHT_SQUARE_BRACKET,
      CHAR_DOUBLE_QUOTE,
      CHAR_SINGLE_QUOTE,
      CHAR_NO_BREAK_SPACE,
      CHAR_ZERO_WIDTH_NOBREAK_SPACE
    } = require_constants();
    var parse2 = (input, options = {}) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected a string");
      }
      let opts = options || {};
      let max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      if (input.length > max) {
        throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
      }
      let ast = { type: "root", input, nodes: [] };
      let stack = [ast];
      let block = ast;
      let prev = ast;
      let brackets = 0;
      let length = input.length;
      let index = 0;
      let depth = 0;
      let value;
      let memo = {};
      const advance = () => input[index++];
      const push = (node) => {
        if (node.type === "text" && prev.type === "dot") {
          prev.type = "text";
        }
        if (prev && prev.type === "text" && node.type === "text") {
          prev.value += node.value;
          return;
        }
        block.nodes.push(node);
        node.parent = block;
        node.prev = prev;
        prev = node;
        return node;
      };
      push({ type: "bos" });
      while (index < length) {
        block = stack[stack.length - 1];
        value = advance();
        if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
          continue;
        }
        if (value === CHAR_BACKSLASH) {
          push({ type: "text", value: (options.keepEscaping ? value : "") + advance() });
          continue;
        }
        if (value === CHAR_RIGHT_SQUARE_BRACKET) {
          push({ type: "text", value: "\\" + value });
          continue;
        }
        if (value === CHAR_LEFT_SQUARE_BRACKET) {
          brackets++;
          let closed = true;
          let next;
          while (index < length && (next = advance())) {
            value += next;
            if (next === CHAR_LEFT_SQUARE_BRACKET) {
              brackets++;
              continue;
            }
            if (next === CHAR_BACKSLASH) {
              value += advance();
              continue;
            }
            if (next === CHAR_RIGHT_SQUARE_BRACKET) {
              brackets--;
              if (brackets === 0) {
                break;
              }
            }
          }
          push({ type: "text", value });
          continue;
        }
        if (value === CHAR_LEFT_PARENTHESES) {
          block = push({ type: "paren", nodes: [] });
          stack.push(block);
          push({ type: "text", value });
          continue;
        }
        if (value === CHAR_RIGHT_PARENTHESES) {
          if (block.type !== "paren") {
            push({ type: "text", value });
            continue;
          }
          block = stack.pop();
          push({ type: "text", value });
          block = stack[stack.length - 1];
          continue;
        }
        if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
          let open = value;
          let next;
          if (options.keepQuotes !== true) {
            value = "";
          }
          while (index < length && (next = advance())) {
            if (next === CHAR_BACKSLASH) {
              value += next + advance();
              continue;
            }
            if (next === open) {
              if (options.keepQuotes === true)
                value += next;
              break;
            }
            value += next;
          }
          push({ type: "text", value });
          continue;
        }
        if (value === CHAR_LEFT_CURLY_BRACE) {
          depth++;
          let dollar = prev.value && prev.value.slice(-1) === "$" || block.dollar === true;
          let brace = {
            type: "brace",
            open: true,
            close: false,
            dollar,
            depth,
            commas: 0,
            ranges: 0,
            nodes: []
          };
          block = push(brace);
          stack.push(block);
          push({ type: "open", value });
          continue;
        }
        if (value === CHAR_RIGHT_CURLY_BRACE) {
          if (block.type !== "brace") {
            push({ type: "text", value });
            continue;
          }
          let type = "close";
          block = stack.pop();
          block.close = true;
          push({ type, value });
          depth--;
          block = stack[stack.length - 1];
          continue;
        }
        if (value === CHAR_COMMA && depth > 0) {
          if (block.ranges > 0) {
            block.ranges = 0;
            let open = block.nodes.shift();
            block.nodes = [open, { type: "text", value: stringify(block) }];
          }
          push({ type: "comma", value });
          block.commas++;
          continue;
        }
        if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
          let siblings = block.nodes;
          if (depth === 0 || siblings.length === 0) {
            push({ type: "text", value });
            continue;
          }
          if (prev.type === "dot") {
            block.range = [];
            prev.value += value;
            prev.type = "range";
            if (block.nodes.length !== 3 && block.nodes.length !== 5) {
              block.invalid = true;
              block.ranges = 0;
              prev.type = "text";
              continue;
            }
            block.ranges++;
            block.args = [];
            continue;
          }
          if (prev.type === "range") {
            siblings.pop();
            let before = siblings[siblings.length - 1];
            before.value += prev.value + value;
            prev = before;
            block.ranges--;
            continue;
          }
          push({ type: "dot", value });
          continue;
        }
        push({ type: "text", value });
      }
      do {
        block = stack.pop();
        if (block.type !== "root") {
          block.nodes.forEach((node) => {
            if (!node.nodes) {
              if (node.type === "open")
                node.isOpen = true;
              if (node.type === "close")
                node.isClose = true;
              if (!node.nodes)
                node.type = "text";
              node.invalid = true;
            }
          });
          let parent = stack[stack.length - 1];
          let index2 = parent.nodes.indexOf(block);
          parent.nodes.splice(index2, 1, ...block.nodes);
        }
      } while (stack.length > 0);
      push({ type: "eos" });
      return ast;
    };
    module2.exports = parse2;
  }
});

// node_modules/braces/index.js
var require_braces = __commonJS({
  "node_modules/braces/index.js"(exports, module2) {
    "use strict";
    init_shim();
    var stringify = require_stringify();
    var compile = require_compile();
    var expand = require_expand();
    var parse2 = require_parse();
    var braces = (input, options = {}) => {
      let output = [];
      if (Array.isArray(input)) {
        for (let pattern of input) {
          let result = braces.create(pattern, options);
          if (Array.isArray(result)) {
            output.push(...result);
          } else {
            output.push(result);
          }
        }
      } else {
        output = [].concat(braces.create(input, options));
      }
      if (options && options.expand === true && options.nodupes === true) {
        output = [...new Set(output)];
      }
      return output;
    };
    braces.parse = (input, options = {}) => parse2(input, options);
    braces.stringify = (input, options = {}) => {
      if (typeof input === "string") {
        return stringify(braces.parse(input, options), options);
      }
      return stringify(input, options);
    };
    braces.compile = (input, options = {}) => {
      if (typeof input === "string") {
        input = braces.parse(input, options);
      }
      return compile(input, options);
    };
    braces.expand = (input, options = {}) => {
      if (typeof input === "string") {
        input = braces.parse(input, options);
      }
      let result = expand(input, options);
      if (options.noempty === true) {
        result = result.filter(Boolean);
      }
      if (options.nodupes === true) {
        result = [...new Set(result)];
      }
      return result;
    };
    braces.create = (input, options = {}) => {
      if (input === "" || input.length < 3) {
        return [input];
      }
      return options.expand !== true ? braces.compile(input, options) : braces.expand(input, options);
    };
    module2.exports = braces;
  }
});

// node_modules/picomatch/lib/constants.js
var require_constants2 = __commonJS({
  "node_modules/picomatch/lib/constants.js"(exports, module2) {
    "use strict";
    init_shim();
    var path10 = require("path");
    var WIN_SLASH = "\\\\/";
    var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
    var DOT_LITERAL = "\\.";
    var PLUS_LITERAL = "\\+";
    var QMARK_LITERAL = "\\?";
    var SLASH_LITERAL = "\\/";
    var ONE_CHAR = "(?=.)";
    var QMARK = "[^/]";
    var END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
    var START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
    var DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
    var NO_DOT = `(?!${DOT_LITERAL})`;
    var NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
    var NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
    var NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
    var QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
    var STAR = `${QMARK}*?`;
    var POSIX_CHARS = {
      DOT_LITERAL,
      PLUS_LITERAL,
      QMARK_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      QMARK,
      END_ANCHOR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOTS,
      NO_DOT_SLASH,
      NO_DOTS_SLASH,
      QMARK_NO_DOT,
      STAR,
      START_ANCHOR
    };
    var WINDOWS_CHARS = {
      ...POSIX_CHARS,
      SLASH_LITERAL: `[${WIN_SLASH}]`,
      QMARK: WIN_NO_SLASH,
      STAR: `${WIN_NO_SLASH}*?`,
      DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
      NO_DOT: `(?!${DOT_LITERAL})`,
      NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
      NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
      START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
      END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
    };
    var POSIX_REGEX_SOURCE = {
      alnum: "a-zA-Z0-9",
      alpha: "a-zA-Z",
      ascii: "\\x00-\\x7F",
      blank: " \\t",
      cntrl: "\\x00-\\x1F\\x7F",
      digit: "0-9",
      graph: "\\x21-\\x7E",
      lower: "a-z",
      print: "\\x20-\\x7E ",
      punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
      space: " \\t\\r\\n\\v\\f",
      upper: "A-Z",
      word: "A-Za-z0-9_",
      xdigit: "A-Fa-f0-9"
    };
    module2.exports = {
      MAX_LENGTH: 1024 * 64,
      POSIX_REGEX_SOURCE,
      REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
      REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
      REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
      REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
      REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
      REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
      REPLACEMENTS: {
        "***": "*",
        "**/**": "**",
        "**/**/**": "**"
      },
      CHAR_0: 48,
      CHAR_9: 57,
      CHAR_UPPERCASE_A: 65,
      CHAR_LOWERCASE_A: 97,
      CHAR_UPPERCASE_Z: 90,
      CHAR_LOWERCASE_Z: 122,
      CHAR_LEFT_PARENTHESES: 40,
      CHAR_RIGHT_PARENTHESES: 41,
      CHAR_ASTERISK: 42,
      CHAR_AMPERSAND: 38,
      CHAR_AT: 64,
      CHAR_BACKWARD_SLASH: 92,
      CHAR_CARRIAGE_RETURN: 13,
      CHAR_CIRCUMFLEX_ACCENT: 94,
      CHAR_COLON: 58,
      CHAR_COMMA: 44,
      CHAR_DOT: 46,
      CHAR_DOUBLE_QUOTE: 34,
      CHAR_EQUAL: 61,
      CHAR_EXCLAMATION_MARK: 33,
      CHAR_FORM_FEED: 12,
      CHAR_FORWARD_SLASH: 47,
      CHAR_GRAVE_ACCENT: 96,
      CHAR_HASH: 35,
      CHAR_HYPHEN_MINUS: 45,
      CHAR_LEFT_ANGLE_BRACKET: 60,
      CHAR_LEFT_CURLY_BRACE: 123,
      CHAR_LEFT_SQUARE_BRACKET: 91,
      CHAR_LINE_FEED: 10,
      CHAR_NO_BREAK_SPACE: 160,
      CHAR_PERCENT: 37,
      CHAR_PLUS: 43,
      CHAR_QUESTION_MARK: 63,
      CHAR_RIGHT_ANGLE_BRACKET: 62,
      CHAR_RIGHT_CURLY_BRACE: 125,
      CHAR_RIGHT_SQUARE_BRACKET: 93,
      CHAR_SEMICOLON: 59,
      CHAR_SINGLE_QUOTE: 39,
      CHAR_SPACE: 32,
      CHAR_TAB: 9,
      CHAR_UNDERSCORE: 95,
      CHAR_VERTICAL_LINE: 124,
      CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
      SEP: path10.sep,
      extglobChars(chars) {
        return {
          "!": { type: "negate", open: "(?:(?!(?:", close: `))${chars.STAR})` },
          "?": { type: "qmark", open: "(?:", close: ")?" },
          "+": { type: "plus", open: "(?:", close: ")+" },
          "*": { type: "star", open: "(?:", close: ")*" },
          "@": { type: "at", open: "(?:", close: ")" }
        };
      },
      globChars(win32) {
        return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
      }
    };
  }
});

// node_modules/picomatch/lib/utils.js
var require_utils2 = __commonJS({
  "node_modules/picomatch/lib/utils.js"(exports) {
    "use strict";
    init_shim();
    var path10 = require("path");
    var win32 = import_process.default.platform === "win32";
    var {
      REGEX_BACKSLASH,
      REGEX_REMOVE_BACKSLASH,
      REGEX_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_GLOBAL
    } = require_constants2();
    exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
    exports.isRegexChar = (str) => str.length === 1 && exports.hasRegexChars(str);
    exports.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
    exports.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
    exports.removeBackslashes = (str) => {
      return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
        return match === "\\" ? "" : match;
      });
    };
    exports.supportsLookbehinds = () => {
      const segs = import_process.default.version.slice(1).split(".").map(Number);
      if (segs.length === 3 && segs[0] >= 9 || segs[0] === 8 && segs[1] >= 10) {
        return true;
      }
      return false;
    };
    exports.isWindows = (options) => {
      if (options && typeof options.windows === "boolean") {
        return options.windows;
      }
      return win32 === true || path10.sep === "\\";
    };
    exports.escapeLast = (input, char, lastIdx) => {
      const idx = input.lastIndexOf(char, lastIdx);
      if (idx === -1)
        return input;
      if (input[idx - 1] === "\\")
        return exports.escapeLast(input, char, idx - 1);
      return `${input.slice(0, idx)}\\${input.slice(idx)}`;
    };
    exports.removePrefix = (input, state = {}) => {
      let output = input;
      if (output.startsWith("./")) {
        output = output.slice(2);
        state.prefix = "./";
      }
      return output;
    };
    exports.wrapOutput = (input, state = {}, options = {}) => {
      const prepend = options.contains ? "" : "^";
      const append = options.contains ? "" : "$";
      let output = `${prepend}(?:${input})${append}`;
      if (state.negated === true) {
        output = `(?:^(?!${output}).*$)`;
      }
      return output;
    };
  }
});

// node_modules/picomatch/lib/scan.js
var require_scan = __commonJS({
  "node_modules/picomatch/lib/scan.js"(exports, module2) {
    "use strict";
    init_shim();
    var utils = require_utils2();
    var {
      CHAR_ASTERISK,
      CHAR_AT,
      CHAR_BACKWARD_SLASH,
      CHAR_COMMA,
      CHAR_DOT,
      CHAR_EXCLAMATION_MARK,
      CHAR_FORWARD_SLASH,
      CHAR_LEFT_CURLY_BRACE,
      CHAR_LEFT_PARENTHESES,
      CHAR_LEFT_SQUARE_BRACKET,
      CHAR_PLUS,
      CHAR_QUESTION_MARK,
      CHAR_RIGHT_CURLY_BRACE,
      CHAR_RIGHT_PARENTHESES,
      CHAR_RIGHT_SQUARE_BRACKET
    } = require_constants2();
    var isPathSeparator = (code) => {
      return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
    };
    var depth = (token) => {
      if (token.isPrefix !== true) {
        token.depth = token.isGlobstar ? Infinity : 1;
      }
    };
    var scan = (input, options) => {
      const opts = options || {};
      const length = input.length - 1;
      const scanToEnd = opts.parts === true || opts.scanToEnd === true;
      const slashes = [];
      const tokens2 = [];
      const parts = [];
      let str = input;
      let index = -1;
      let start = 0;
      let lastIndex = 0;
      let isBrace = false;
      let isBracket = false;
      let isGlob = false;
      let isExtglob = false;
      let isGlobstar = false;
      let braceEscaped = false;
      let backslashes = false;
      let negated = false;
      let negatedExtglob = false;
      let finished = false;
      let braces = 0;
      let prev;
      let code;
      let token = { value: "", depth: 0, isGlob: false };
      const eos = () => index >= length;
      const peek = () => str.charCodeAt(index + 1);
      const advance = () => {
        prev = code;
        return str.charCodeAt(++index);
      };
      while (index < length) {
        code = advance();
        let next;
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          code = advance();
          if (code === CHAR_LEFT_CURLY_BRACE) {
            braceEscaped = true;
          }
          continue;
        }
        if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (code === CHAR_LEFT_CURLY_BRACE) {
              braces++;
              continue;
            }
            if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (braceEscaped !== true && code === CHAR_COMMA) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (code === CHAR_RIGHT_CURLY_BRACE) {
              braces--;
              if (braces === 0) {
                braceEscaped = false;
                isBrace = token.isBrace = true;
                finished = true;
                break;
              }
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_FORWARD_SLASH) {
          slashes.push(index);
          tokens2.push(token);
          token = { value: "", depth: 0, isGlob: false };
          if (finished === true)
            continue;
          if (prev === CHAR_DOT && index === start + 1) {
            start += 2;
            continue;
          }
          lastIndex = index + 1;
          continue;
        }
        if (opts.noext !== true) {
          const isExtglobChar = code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK;
          if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
            isGlob = token.isGlob = true;
            isExtglob = token.isExtglob = true;
            finished = true;
            if (code === CHAR_EXCLAMATION_MARK && index === start) {
              negatedExtglob = true;
            }
            if (scanToEnd === true) {
              while (eos() !== true && (code = advance())) {
                if (code === CHAR_BACKWARD_SLASH) {
                  backslashes = token.backslashes = true;
                  code = advance();
                  continue;
                }
                if (code === CHAR_RIGHT_PARENTHESES) {
                  isGlob = token.isGlob = true;
                  finished = true;
                  break;
                }
              }
              continue;
            }
            break;
          }
        }
        if (code === CHAR_ASTERISK) {
          if (prev === CHAR_ASTERISK)
            isGlobstar = token.isGlobstar = true;
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_QUESTION_MARK) {
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_LEFT_SQUARE_BRACKET) {
          while (eos() !== true && (next = advance())) {
            if (next === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (next === CHAR_RIGHT_SQUARE_BRACKET) {
              isBracket = token.isBracket = true;
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
          negated = token.negated = true;
          start++;
          continue;
        }
        if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
          isGlob = token.isGlob = true;
          if (scanToEnd === true) {
            while (eos() !== true && (code = advance())) {
              if (code === CHAR_LEFT_PARENTHESES) {
                backslashes = token.backslashes = true;
                code = advance();
                continue;
              }
              if (code === CHAR_RIGHT_PARENTHESES) {
                finished = true;
                break;
              }
            }
            continue;
          }
          break;
        }
        if (isGlob === true) {
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
      if (opts.noext === true) {
        isExtglob = false;
        isGlob = false;
      }
      let base = str;
      let prefix = "";
      let glob4 = "";
      if (start > 0) {
        prefix = str.slice(0, start);
        str = str.slice(start);
        lastIndex -= start;
      }
      if (base && isGlob === true && lastIndex > 0) {
        base = str.slice(0, lastIndex);
        glob4 = str.slice(lastIndex);
      } else if (isGlob === true) {
        base = "";
        glob4 = str;
      } else {
        base = str;
      }
      if (base && base !== "" && base !== "/" && base !== str) {
        if (isPathSeparator(base.charCodeAt(base.length - 1))) {
          base = base.slice(0, -1);
        }
      }
      if (opts.unescape === true) {
        if (glob4)
          glob4 = utils.removeBackslashes(glob4);
        if (base && backslashes === true) {
          base = utils.removeBackslashes(base);
        }
      }
      const state = {
        prefix,
        input,
        start,
        base,
        glob: glob4,
        isBrace,
        isBracket,
        isGlob,
        isExtglob,
        isGlobstar,
        negated,
        negatedExtglob
      };
      if (opts.tokens === true) {
        state.maxDepth = 0;
        if (!isPathSeparator(code)) {
          tokens2.push(token);
        }
        state.tokens = tokens2;
      }
      if (opts.parts === true || opts.tokens === true) {
        let prevIndex;
        for (let idx = 0; idx < slashes.length; idx++) {
          const n = prevIndex ? prevIndex + 1 : start;
          const i = slashes[idx];
          const value = input.slice(n, i);
          if (opts.tokens) {
            if (idx === 0 && start !== 0) {
              tokens2[idx].isPrefix = true;
              tokens2[idx].value = prefix;
            } else {
              tokens2[idx].value = value;
            }
            depth(tokens2[idx]);
            state.maxDepth += tokens2[idx].depth;
          }
          if (idx !== 0 || value !== "") {
            parts.push(value);
          }
          prevIndex = i;
        }
        if (prevIndex && prevIndex + 1 < input.length) {
          const value = input.slice(prevIndex + 1);
          parts.push(value);
          if (opts.tokens) {
            tokens2[tokens2.length - 1].value = value;
            depth(tokens2[tokens2.length - 1]);
            state.maxDepth += tokens2[tokens2.length - 1].depth;
          }
        }
        state.slashes = slashes;
        state.parts = parts;
      }
      return state;
    };
    module2.exports = scan;
  }
});

// node_modules/picomatch/lib/parse.js
var require_parse2 = __commonJS({
  "node_modules/picomatch/lib/parse.js"(exports, module2) {
    "use strict";
    init_shim();
    var constants = require_constants2();
    var utils = require_utils2();
    var {
      MAX_LENGTH,
      POSIX_REGEX_SOURCE,
      REGEX_NON_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_BACKREF,
      REPLACEMENTS
    } = constants;
    var expandRange = (args, options) => {
      if (typeof options.expandRange === "function") {
        return options.expandRange(...args, options);
      }
      args.sort();
      const value = `[${args.join("-")}]`;
      try {
        new RegExp(value);
      } catch (ex) {
        return args.map((v) => utils.escapeRegex(v)).join("..");
      }
      return value;
    };
    var syntaxError = (type, char) => {
      return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
    };
    var parse2 = (input, options) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected a string");
      }
      input = REPLACEMENTS[input] || input;
      const opts = { ...options };
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      let len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      const bos = { type: "bos", value: "", output: opts.prepend || "" };
      const tokens2 = [bos];
      const capture = opts.capture ? "" : "?:";
      const win32 = utils.isWindows(options);
      const PLATFORM_CHARS = constants.globChars(win32);
      const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
      const {
        DOT_LITERAL,
        PLUS_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOT_SLASH,
        NO_DOTS_SLASH,
        QMARK,
        QMARK_NO_DOT,
        STAR,
        START_ANCHOR
      } = PLATFORM_CHARS;
      const globstar = (opts2) => {
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const nodot = opts.dot ? "" : NO_DOT;
      const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
      let star = opts.bash === true ? globstar(opts) : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      if (typeof opts.noext === "boolean") {
        opts.noextglob = opts.noext;
      }
      const state = {
        input,
        index: -1,
        start: 0,
        dot: opts.dot === true,
        consumed: "",
        output: "",
        prefix: "",
        backtrack: false,
        negated: false,
        brackets: 0,
        braces: 0,
        parens: 0,
        quotes: 0,
        globstar: false,
        tokens: tokens2
      };
      input = utils.removePrefix(input, state);
      len = input.length;
      const extglobs = [];
      const braces = [];
      const stack = [];
      let prev = bos;
      let value;
      const eos = () => state.index === len - 1;
      const peek = state.peek = (n = 1) => input[state.index + n];
      const advance = state.advance = () => input[++state.index] || "";
      const remaining = () => input.slice(state.index + 1);
      const consume = (value2 = "", num3 = 0) => {
        state.consumed += value2;
        state.index += num3;
      };
      const append = (token) => {
        state.output += token.output != null ? token.output : token.value;
        consume(token.value);
      };
      const negate = () => {
        let count = 1;
        while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
          advance();
          state.start++;
          count++;
        }
        if (count % 2 === 0) {
          return false;
        }
        state.negated = true;
        state.start++;
        return true;
      };
      const increment = (type) => {
        state[type]++;
        stack.push(type);
      };
      const decrement = (type) => {
        state[type]--;
        stack.pop();
      };
      const push = (tok) => {
        if (prev.type === "globstar") {
          const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
          const isExtglob = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
          if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
            state.output = state.output.slice(0, -prev.output.length);
            prev.type = "star";
            prev.value = "*";
            prev.output = star;
            state.output += prev.output;
          }
        }
        if (extglobs.length && tok.type !== "paren") {
          extglobs[extglobs.length - 1].inner += tok.value;
        }
        if (tok.value || tok.output)
          append(tok);
        if (prev && prev.type === "text" && tok.type === "text") {
          prev.value += tok.value;
          prev.output = (prev.output || "") + tok.value;
          return;
        }
        tok.prev = prev;
        tokens2.push(tok);
        prev = tok;
      };
      const extglobOpen = (type, value2) => {
        const token = { ...EXTGLOB_CHARS[value2], conditions: 1, inner: "" };
        token.prev = prev;
        token.parens = state.parens;
        token.output = state.output;
        const output = (opts.capture ? "(" : "") + token.open;
        increment("parens");
        push({ type, value: value2, output: state.output ? "" : ONE_CHAR });
        push({ type: "paren", extglob: true, value: advance(), output });
        extglobs.push(token);
      };
      const extglobClose = (token) => {
        let output = token.close + (opts.capture ? ")" : "");
        let rest;
        if (token.type === "negate") {
          let extglobStar = star;
          if (token.inner && token.inner.length > 1 && token.inner.includes("/")) {
            extglobStar = globstar(opts);
          }
          if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
            output = token.close = `)$))${extglobStar}`;
          }
          if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
            const expression = parse2(rest, { ...options, fastpaths: false }).output;
            output = token.close = `)${expression})${extglobStar})`;
          }
          if (token.prev.type === "bos") {
            state.negatedExtglob = true;
          }
        }
        push({ type: "paren", extglob: true, value, output });
        decrement("parens");
      };
      if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
        let backslashes = false;
        let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
          if (first === "\\") {
            backslashes = true;
            return m;
          }
          if (first === "?") {
            if (esc) {
              return esc + first + (rest ? QMARK.repeat(rest.length) : "");
            }
            if (index === 0) {
              return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
            }
            return QMARK.repeat(chars.length);
          }
          if (first === ".") {
            return DOT_LITERAL.repeat(chars.length);
          }
          if (first === "*") {
            if (esc) {
              return esc + first + (rest ? star : "");
            }
            return star;
          }
          return esc ? m : `\\${m}`;
        });
        if (backslashes === true) {
          if (opts.unescape === true) {
            output = output.replace(/\\/g, "");
          } else {
            output = output.replace(/\\+/g, (m) => {
              return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
            });
          }
        }
        if (output === input && opts.contains === true) {
          state.output = input;
          return state;
        }
        state.output = utils.wrapOutput(output, state, options);
        return state;
      }
      while (!eos()) {
        value = advance();
        if (value === "\0") {
          continue;
        }
        if (value === "\\") {
          const next = peek();
          if (next === "/" && opts.bash !== true) {
            continue;
          }
          if (next === "." || next === ";") {
            continue;
          }
          if (!next) {
            value += "\\";
            push({ type: "text", value });
            continue;
          }
          const match = /^\\+/.exec(remaining());
          let slashes = 0;
          if (match && match[0].length > 2) {
            slashes = match[0].length;
            state.index += slashes;
            if (slashes % 2 !== 0) {
              value += "\\";
            }
          }
          if (opts.unescape === true) {
            value = advance();
          } else {
            value += advance();
          }
          if (state.brackets === 0) {
            push({ type: "text", value });
            continue;
          }
        }
        if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
          if (opts.posix !== false && value === ":") {
            const inner = prev.value.slice(1);
            if (inner.includes("[")) {
              prev.posix = true;
              if (inner.includes(":")) {
                const idx = prev.value.lastIndexOf("[");
                const pre = prev.value.slice(0, idx);
                const rest2 = prev.value.slice(idx + 2);
                const posix = POSIX_REGEX_SOURCE[rest2];
                if (posix) {
                  prev.value = pre + posix;
                  state.backtrack = true;
                  advance();
                  if (!bos.output && tokens2.indexOf(prev) === 1) {
                    bos.output = ONE_CHAR;
                  }
                  continue;
                }
              }
            }
          }
          if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") {
            value = `\\${value}`;
          }
          if (value === "]" && (prev.value === "[" || prev.value === "[^")) {
            value = `\\${value}`;
          }
          if (opts.posix === true && value === "!" && prev.value === "[") {
            value = "^";
          }
          prev.value += value;
          append({ value });
          continue;
        }
        if (state.quotes === 1 && value !== '"') {
          value = utils.escapeRegex(value);
          prev.value += value;
          append({ value });
          continue;
        }
        if (value === '"') {
          state.quotes = state.quotes === 1 ? 0 : 1;
          if (opts.keepQuotes === true) {
            push({ type: "text", value });
          }
          continue;
        }
        if (value === "(") {
          increment("parens");
          push({ type: "paren", value });
          continue;
        }
        if (value === ")") {
          if (state.parens === 0 && opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError("opening", "("));
          }
          const extglob = extglobs[extglobs.length - 1];
          if (extglob && state.parens === extglob.parens + 1) {
            extglobClose(extglobs.pop());
            continue;
          }
          push({ type: "paren", value, output: state.parens ? ")" : "\\)" });
          decrement("parens");
          continue;
        }
        if (value === "[") {
          if (opts.nobracket === true || !remaining().includes("]")) {
            if (opts.nobracket !== true && opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("closing", "]"));
            }
            value = `\\${value}`;
          } else {
            increment("brackets");
          }
          push({ type: "bracket", value });
          continue;
        }
        if (value === "]") {
          if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
            push({ type: "text", value, output: `\\${value}` });
            continue;
          }
          if (state.brackets === 0) {
            if (opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("opening", "["));
            }
            push({ type: "text", value, output: `\\${value}` });
            continue;
          }
          decrement("brackets");
          const prevValue = prev.value.slice(1);
          if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) {
            value = `/${value}`;
          }
          prev.value += value;
          append({ value });
          if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
            continue;
          }
          const escaped = utils.escapeRegex(prev.value);
          state.output = state.output.slice(0, -prev.value.length);
          if (opts.literalBrackets === true) {
            state.output += escaped;
            prev.value = escaped;
            continue;
          }
          prev.value = `(${capture}${escaped}|${prev.value})`;
          state.output += prev.value;
          continue;
        }
        if (value === "{" && opts.nobrace !== true) {
          increment("braces");
          const open = {
            type: "brace",
            value,
            output: "(",
            outputIndex: state.output.length,
            tokensIndex: state.tokens.length
          };
          braces.push(open);
          push(open);
          continue;
        }
        if (value === "}") {
          const brace = braces[braces.length - 1];
          if (opts.nobrace === true || !brace) {
            push({ type: "text", value, output: value });
            continue;
          }
          let output = ")";
          if (brace.dots === true) {
            const arr = tokens2.slice();
            const range = [];
            for (let i = arr.length - 1; i >= 0; i--) {
              tokens2.pop();
              if (arr[i].type === "brace") {
                break;
              }
              if (arr[i].type !== "dots") {
                range.unshift(arr[i].value);
              }
            }
            output = expandRange(range, opts);
            state.backtrack = true;
          }
          if (brace.comma !== true && brace.dots !== true) {
            const out = state.output.slice(0, brace.outputIndex);
            const toks = state.tokens.slice(brace.tokensIndex);
            brace.value = brace.output = "\\{";
            value = output = "\\}";
            state.output = out;
            for (const t of toks) {
              state.output += t.output || t.value;
            }
          }
          push({ type: "brace", value, output });
          decrement("braces");
          braces.pop();
          continue;
        }
        if (value === "|") {
          if (extglobs.length > 0) {
            extglobs[extglobs.length - 1].conditions++;
          }
          push({ type: "text", value });
          continue;
        }
        if (value === ",") {
          let output = value;
          const brace = braces[braces.length - 1];
          if (brace && stack[stack.length - 1] === "braces") {
            brace.comma = true;
            output = "|";
          }
          push({ type: "comma", value, output });
          continue;
        }
        if (value === "/") {
          if (prev.type === "dot" && state.index === state.start + 1) {
            state.start = state.index + 1;
            state.consumed = "";
            state.output = "";
            tokens2.pop();
            prev = bos;
            continue;
          }
          push({ type: "slash", value, output: SLASH_LITERAL });
          continue;
        }
        if (value === ".") {
          if (state.braces > 0 && prev.type === "dot") {
            if (prev.value === ".")
              prev.output = DOT_LITERAL;
            const brace = braces[braces.length - 1];
            prev.type = "dots";
            prev.output += value;
            prev.value += value;
            brace.dots = true;
            continue;
          }
          if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
            push({ type: "text", value, output: DOT_LITERAL });
            continue;
          }
          push({ type: "dot", value, output: DOT_LITERAL });
          continue;
        }
        if (value === "?") {
          const isGroup = prev && prev.value === "(";
          if (!isGroup && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("qmark", value);
            continue;
          }
          if (prev && prev.type === "paren") {
            const next = peek();
            let output = value;
            if (next === "<" && !utils.supportsLookbehinds()) {
              throw new Error("Node.js v10 or higher is required for regex lookbehinds");
            }
            if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) {
              output = `\\${value}`;
            }
            push({ type: "text", value, output });
            continue;
          }
          if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
            push({ type: "qmark", value, output: QMARK_NO_DOT });
            continue;
          }
          push({ type: "qmark", value, output: QMARK });
          continue;
        }
        if (value === "!") {
          if (opts.noextglob !== true && peek() === "(") {
            if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
              extglobOpen("negate", value);
              continue;
            }
          }
          if (opts.nonegate !== true && state.index === 0) {
            negate();
            continue;
          }
        }
        if (value === "+") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("plus", value);
            continue;
          }
          if (prev && prev.value === "(" || opts.regex === false) {
            push({ type: "plus", value, output: PLUS_LITERAL });
            continue;
          }
          if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
            push({ type: "plus", value });
            continue;
          }
          push({ type: "plus", value: PLUS_LITERAL });
          continue;
        }
        if (value === "@") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            push({ type: "at", extglob: true, value, output: "" });
            continue;
          }
          push({ type: "text", value });
          continue;
        }
        if (value !== "*") {
          if (value === "$" || value === "^") {
            value = `\\${value}`;
          }
          const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
          if (match) {
            value += match[0];
            state.index += match[0].length;
          }
          push({ type: "text", value });
          continue;
        }
        if (prev && (prev.type === "globstar" || prev.star === true)) {
          prev.type = "star";
          prev.star = true;
          prev.value += value;
          prev.output = star;
          state.backtrack = true;
          state.globstar = true;
          consume(value);
          continue;
        }
        let rest = remaining();
        if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
          extglobOpen("star", value);
          continue;
        }
        if (prev.type === "star") {
          if (opts.noglobstar === true) {
            consume(value);
            continue;
          }
          const prior = prev.prev;
          const before = prior.prev;
          const isStart = prior.type === "slash" || prior.type === "bos";
          const afterStar = before && (before.type === "star" || before.type === "globstar");
          if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
            push({ type: "star", value, output: "" });
            continue;
          }
          const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
          const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
          if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
            push({ type: "star", value, output: "" });
            continue;
          }
          while (rest.slice(0, 3) === "/**") {
            const after = input[state.index + 4];
            if (after && after !== "/") {
              break;
            }
            rest = rest.slice(3);
            consume("/**", 3);
          }
          if (prior.type === "bos" && eos()) {
            prev.type = "globstar";
            prev.value += value;
            prev.output = globstar(opts);
            state.output = prev.output;
            state.globstar = true;
            consume(value);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
            prev.value += value;
            state.globstar = true;
            state.output += prior.output + prev.output;
            consume(value);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
            const end = rest[1] !== void 0 ? "|$" : "";
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
            prev.value += value;
            state.output += prior.output + prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          if (prior.type === "bos" && rest[0] === "/") {
            prev.type = "globstar";
            prev.value += value;
            prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
            state.output = prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          state.output = state.output.slice(0, -prev.output.length);
          prev.type = "globstar";
          prev.output = globstar(opts);
          prev.value += value;
          state.output += prev.output;
          state.globstar = true;
          consume(value);
          continue;
        }
        const token = { type: "star", value, output: star };
        if (opts.bash === true) {
          token.output = ".*?";
          if (prev.type === "bos" || prev.type === "slash") {
            token.output = nodot + token.output;
          }
          push(token);
          continue;
        }
        if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
          token.output = value;
          push(token);
          continue;
        }
        if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
          if (prev.type === "dot") {
            state.output += NO_DOT_SLASH;
            prev.output += NO_DOT_SLASH;
          } else if (opts.dot === true) {
            state.output += NO_DOTS_SLASH;
            prev.output += NO_DOTS_SLASH;
          } else {
            state.output += nodot;
            prev.output += nodot;
          }
          if (peek() !== "*") {
            state.output += ONE_CHAR;
            prev.output += ONE_CHAR;
          }
        }
        push(token);
      }
      while (state.brackets > 0) {
        if (opts.strictBrackets === true)
          throw new SyntaxError(syntaxError("closing", "]"));
        state.output = utils.escapeLast(state.output, "[");
        decrement("brackets");
      }
      while (state.parens > 0) {
        if (opts.strictBrackets === true)
          throw new SyntaxError(syntaxError("closing", ")"));
        state.output = utils.escapeLast(state.output, "(");
        decrement("parens");
      }
      while (state.braces > 0) {
        if (opts.strictBrackets === true)
          throw new SyntaxError(syntaxError("closing", "}"));
        state.output = utils.escapeLast(state.output, "{");
        decrement("braces");
      }
      if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) {
        push({ type: "maybe_slash", value: "", output: `${SLASH_LITERAL}?` });
      }
      if (state.backtrack === true) {
        state.output = "";
        for (const token of state.tokens) {
          state.output += token.output != null ? token.output : token.value;
          if (token.suffix) {
            state.output += token.suffix;
          }
        }
      }
      return state;
    };
    parse2.fastpaths = (input, options) => {
      const opts = { ...options };
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      const len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      input = REPLACEMENTS[input] || input;
      const win32 = utils.isWindows(options);
      const {
        DOT_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOTS,
        NO_DOTS_SLASH,
        STAR,
        START_ANCHOR
      } = constants.globChars(win32);
      const nodot = opts.dot ? NO_DOTS : NO_DOT;
      const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
      const capture = opts.capture ? "" : "?:";
      const state = { negated: false, prefix: "" };
      let star = opts.bash === true ? ".*?" : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      const globstar = (opts2) => {
        if (opts2.noglobstar === true)
          return star;
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const create6 = (str) => {
        switch (str) {
          case "*":
            return `${nodot}${ONE_CHAR}${star}`;
          case ".*":
            return `${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "*.*":
            return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "*/*":
            return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
          case "**":
            return nodot + globstar(opts);
          case "**/*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
          case "**/*.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "**/.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
          default: {
            const match = /^(.*?)\.(\w+)$/.exec(str);
            if (!match)
              return;
            const source2 = create6(match[1]);
            if (!source2)
              return;
            return source2 + DOT_LITERAL + match[2];
          }
        }
      };
      const output = utils.removePrefix(input, state);
      let source = create6(output);
      if (source && opts.strictSlashes !== true) {
        source += `${SLASH_LITERAL}?`;
      }
      return source;
    };
    module2.exports = parse2;
  }
});

// node_modules/picomatch/lib/picomatch.js
var require_picomatch = __commonJS({
  "node_modules/picomatch/lib/picomatch.js"(exports, module2) {
    "use strict";
    init_shim();
    var path10 = require("path");
    var scan = require_scan();
    var parse2 = require_parse2();
    var utils = require_utils2();
    var constants = require_constants2();
    var isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
    var picomatch = (glob4, options, returnState = false) => {
      if (Array.isArray(glob4)) {
        const fns = glob4.map((input) => picomatch(input, options, returnState));
        const arrayMatcher = (str) => {
          for (const isMatch of fns) {
            const state2 = isMatch(str);
            if (state2)
              return state2;
          }
          return false;
        };
        return arrayMatcher;
      }
      const isState = isObject(glob4) && glob4.tokens && glob4.input;
      if (glob4 === "" || typeof glob4 !== "string" && !isState) {
        throw new TypeError("Expected pattern to be a non-empty string");
      }
      const opts = options || {};
      const posix = utils.isWindows(options);
      const regex = isState ? picomatch.compileRe(glob4, options) : picomatch.makeRe(glob4, options, false, true);
      const state = regex.state;
      delete regex.state;
      let isIgnored = () => false;
      if (opts.ignore) {
        const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
        isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
      }
      const matcher = (input, returnObject = false) => {
        const { isMatch, match, output } = picomatch.test(input, regex, options, { glob: glob4, posix });
        const result = { glob: glob4, state, regex, posix, input, output, match, isMatch };
        if (typeof opts.onResult === "function") {
          opts.onResult(result);
        }
        if (isMatch === false) {
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (isIgnored(input)) {
          if (typeof opts.onIgnore === "function") {
            opts.onIgnore(result);
          }
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (typeof opts.onMatch === "function") {
          opts.onMatch(result);
        }
        return returnObject ? result : true;
      };
      if (returnState) {
        matcher.state = state;
      }
      return matcher;
    };
    picomatch.test = (input, regex, options, { glob: glob4, posix } = {}) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected input to be a string");
      }
      if (input === "") {
        return { isMatch: false, output: "" };
      }
      const opts = options || {};
      const format = opts.format || (posix ? utils.toPosixSlashes : null);
      let match = input === glob4;
      let output = match && format ? format(input) : input;
      if (match === false) {
        output = format ? format(input) : input;
        match = output === glob4;
      }
      if (match === false || opts.capture === true) {
        if (opts.matchBase === true || opts.basename === true) {
          match = picomatch.matchBase(input, regex, options, posix);
        } else {
          match = regex.exec(output);
        }
      }
      return { isMatch: Boolean(match), match, output };
    };
    picomatch.matchBase = (input, glob4, options, posix = utils.isWindows(options)) => {
      const regex = glob4 instanceof RegExp ? glob4 : picomatch.makeRe(glob4, options);
      return regex.test(path10.basename(input));
    };
    picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
    picomatch.parse = (pattern, options) => {
      if (Array.isArray(pattern))
        return pattern.map((p) => picomatch.parse(p, options));
      return parse2(pattern, { ...options, fastpaths: false });
    };
    picomatch.scan = (input, options) => scan(input, options);
    picomatch.compileRe = (state, options, returnOutput = false, returnState = false) => {
      if (returnOutput === true) {
        return state.output;
      }
      const opts = options || {};
      const prepend = opts.contains ? "" : "^";
      const append = opts.contains ? "" : "$";
      let source = `${prepend}(?:${state.output})${append}`;
      if (state && state.negated === true) {
        source = `^(?!${source}).*$`;
      }
      const regex = picomatch.toRegex(source, options);
      if (returnState === true) {
        regex.state = state;
      }
      return regex;
    };
    picomatch.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
      if (!input || typeof input !== "string") {
        throw new TypeError("Expected a non-empty string");
      }
      let parsed = { negated: false, fastpaths: true };
      if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) {
        parsed.output = parse2.fastpaths(input, options);
      }
      if (!parsed.output) {
        parsed = parse2(input, options);
      }
      return picomatch.compileRe(parsed, options, returnOutput, returnState);
    };
    picomatch.toRegex = (source, options) => {
      try {
        const opts = options || {};
        return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
      } catch (err) {
        if (options && options.debug === true)
          throw err;
        return /$^/;
      }
    };
    picomatch.constants = constants;
    module2.exports = picomatch;
  }
});

// node_modules/picomatch/index.js
var require_picomatch2 = __commonJS({
  "node_modules/picomatch/index.js"(exports, module2) {
    "use strict";
    init_shim();
    module2.exports = require_picomatch();
  }
});

// node_modules/micromatch/index.js
var require_micromatch = __commonJS({
  "node_modules/micromatch/index.js"(exports, module2) {
    "use strict";
    init_shim();
    var util = require("util");
    var braces = require_braces();
    var picomatch = require_picomatch2();
    var utils = require_utils2();
    var isEmptyString = (val) => val === "" || val === "./";
    var micromatch = (list, patterns, options) => {
      patterns = [].concat(patterns);
      list = [].concat(list);
      let omit = /* @__PURE__ */ new Set();
      let keep = /* @__PURE__ */ new Set();
      let items = /* @__PURE__ */ new Set();
      let negatives = 0;
      let onResult = (state) => {
        items.add(state.output);
        if (options && options.onResult) {
          options.onResult(state);
        }
      };
      for (let i = 0; i < patterns.length; i++) {
        let isMatch = picomatch(String(patterns[i]), { ...options, onResult }, true);
        let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
        if (negated)
          negatives++;
        for (let item of list) {
          let matched = isMatch(item, true);
          let match = negated ? !matched.isMatch : matched.isMatch;
          if (!match)
            continue;
          if (negated) {
            omit.add(matched.output);
          } else {
            omit.delete(matched.output);
            keep.add(matched.output);
          }
        }
      }
      let result = negatives === patterns.length ? [...items] : [...keep];
      let matches = result.filter((item) => !omit.has(item));
      if (options && matches.length === 0) {
        if (options.failglob === true) {
          throw new Error(`No matches found for "${patterns.join(", ")}"`);
        }
        if (options.nonull === true || options.nullglob === true) {
          return options.unescape ? patterns.map((p) => p.replace(/\\/g, "")) : patterns;
        }
      }
      return matches;
    };
    micromatch.match = micromatch;
    micromatch.matcher = (pattern, options) => picomatch(pattern, options);
    micromatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
    micromatch.any = micromatch.isMatch;
    micromatch.not = (list, patterns, options = {}) => {
      patterns = [].concat(patterns).map(String);
      let result = /* @__PURE__ */ new Set();
      let items = [];
      let onResult = (state) => {
        if (options.onResult)
          options.onResult(state);
        items.push(state.output);
      };
      let matches = new Set(micromatch(list, patterns, { ...options, onResult }));
      for (let item of items) {
        if (!matches.has(item)) {
          result.add(item);
        }
      }
      return [...result];
    };
    micromatch.contains = (str, pattern, options) => {
      if (typeof str !== "string") {
        throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
      }
      if (Array.isArray(pattern)) {
        return pattern.some((p) => micromatch.contains(str, p, options));
      }
      if (typeof pattern === "string") {
        if (isEmptyString(str) || isEmptyString(pattern)) {
          return false;
        }
        if (str.includes(pattern) || str.startsWith("./") && str.slice(2).includes(pattern)) {
          return true;
        }
      }
      return micromatch.isMatch(str, pattern, { ...options, contains: true });
    };
    micromatch.matchKeys = (obj, patterns, options) => {
      if (!utils.isObject(obj)) {
        throw new TypeError("Expected the first argument to be an object");
      }
      let keys = micromatch(Object.keys(obj), patterns, options);
      let res = {};
      for (let key of keys)
        res[key] = obj[key];
      return res;
    };
    micromatch.some = (list, patterns, options) => {
      let items = [].concat(list);
      for (let pattern of [].concat(patterns)) {
        let isMatch = picomatch(String(pattern), options);
        if (items.some((item) => isMatch(item))) {
          return true;
        }
      }
      return false;
    };
    micromatch.every = (list, patterns, options) => {
      let items = [].concat(list);
      for (let pattern of [].concat(patterns)) {
        let isMatch = picomatch(String(pattern), options);
        if (!items.every((item) => isMatch(item))) {
          return false;
        }
      }
      return true;
    };
    micromatch.all = (str, patterns, options) => {
      if (typeof str !== "string") {
        throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
      }
      return [].concat(patterns).every((p) => picomatch(p, options)(str));
    };
    micromatch.capture = (glob4, input, options) => {
      let posix = utils.isWindows(options);
      let regex = picomatch.makeRe(String(glob4), { ...options, capture: true });
      let match = regex.exec(posix ? utils.toPosixSlashes(input) : input);
      if (match) {
        return match.slice(1).map((v) => v === void 0 ? "" : v);
      }
    };
    micromatch.makeRe = (...args) => picomatch.makeRe(...args);
    micromatch.scan = (...args) => picomatch.scan(...args);
    micromatch.parse = (patterns, options) => {
      let res = [];
      for (let pattern of [].concat(patterns || [])) {
        for (let str of braces(String(pattern), options)) {
          res.push(picomatch.parse(str, options));
        }
      }
      return res;
    };
    micromatch.braces = (pattern, options) => {
      if (typeof pattern !== "string")
        throw new TypeError("Expected a string");
      if (options && options.nobrace === true || !/\{.*\}/.test(pattern)) {
        return [pattern];
      }
      return braces(pattern, options);
    };
    micromatch.braceExpand = (pattern, options) => {
      if (typeof pattern !== "string")
        throw new TypeError("Expected a string");
      return micromatch.braces(pattern, { ...options, expand: true });
    };
    module2.exports = micromatch;
  }
});

// node_modules/fast-glob/out/utils/pattern.js
var require_pattern = __commonJS({
  "node_modules/fast-glob/out/utils/pattern.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.matchAny = exports.convertPatternsToRe = exports.makeRe = exports.getPatternParts = exports.expandBraceExpansion = exports.expandPatternsWithBraceExpansion = exports.isAffectDepthOfReadingPattern = exports.endsWithSlashGlobStar = exports.hasGlobStar = exports.getBaseDirectory = exports.isPatternRelatedToParentDirectory = exports.getPatternsOutsideCurrentDirectory = exports.getPatternsInsideCurrentDirectory = exports.getPositivePatterns = exports.getNegativePatterns = exports.isPositivePattern = exports.isNegativePattern = exports.convertToNegativePattern = exports.convertToPositivePattern = exports.isDynamicPattern = exports.isStaticPattern = void 0;
    var path10 = require("path");
    var globParent = require_glob_parent();
    var micromatch = require_micromatch();
    var GLOBSTAR = "**";
    var ESCAPE_SYMBOL = "\\";
    var COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
    var REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[[^[]*]/;
    var REGEX_GROUP_SYMBOLS_RE = /(?:^|[^!*+?@])\([^(]*\|[^|]*\)/;
    var GLOB_EXTENSION_SYMBOLS_RE = /[!*+?@]\([^(]*\)/;
    var BRACE_EXPANSION_SEPARATORS_RE = /,|\.\./;
    function isStaticPattern(pattern, options = {}) {
      return !isDynamicPattern(pattern, options);
    }
    exports.isStaticPattern = isStaticPattern;
    function isDynamicPattern(pattern, options = {}) {
      if (pattern === "") {
        return false;
      }
      if (options.caseSensitiveMatch === false || pattern.includes(ESCAPE_SYMBOL)) {
        return true;
      }
      if (COMMON_GLOB_SYMBOLS_RE.test(pattern) || REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern) || REGEX_GROUP_SYMBOLS_RE.test(pattern)) {
        return true;
      }
      if (options.extglob !== false && GLOB_EXTENSION_SYMBOLS_RE.test(pattern)) {
        return true;
      }
      if (options.braceExpansion !== false && hasBraceExpansion(pattern)) {
        return true;
      }
      return false;
    }
    exports.isDynamicPattern = isDynamicPattern;
    function hasBraceExpansion(pattern) {
      const openingBraceIndex = pattern.indexOf("{");
      if (openingBraceIndex === -1) {
        return false;
      }
      const closingBraceIndex = pattern.indexOf("}", openingBraceIndex + 1);
      if (closingBraceIndex === -1) {
        return false;
      }
      const braceContent = pattern.slice(openingBraceIndex, closingBraceIndex);
      return BRACE_EXPANSION_SEPARATORS_RE.test(braceContent);
    }
    function convertToPositivePattern(pattern) {
      return isNegativePattern(pattern) ? pattern.slice(1) : pattern;
    }
    exports.convertToPositivePattern = convertToPositivePattern;
    function convertToNegativePattern(pattern) {
      return "!" + pattern;
    }
    exports.convertToNegativePattern = convertToNegativePattern;
    function isNegativePattern(pattern) {
      return pattern.startsWith("!") && pattern[1] !== "(";
    }
    exports.isNegativePattern = isNegativePattern;
    function isPositivePattern(pattern) {
      return !isNegativePattern(pattern);
    }
    exports.isPositivePattern = isPositivePattern;
    function getNegativePatterns(patterns) {
      return patterns.filter(isNegativePattern);
    }
    exports.getNegativePatterns = getNegativePatterns;
    function getPositivePatterns(patterns) {
      return patterns.filter(isPositivePattern);
    }
    exports.getPositivePatterns = getPositivePatterns;
    function getPatternsInsideCurrentDirectory(patterns) {
      return patterns.filter((pattern) => !isPatternRelatedToParentDirectory(pattern));
    }
    exports.getPatternsInsideCurrentDirectory = getPatternsInsideCurrentDirectory;
    function getPatternsOutsideCurrentDirectory(patterns) {
      return patterns.filter(isPatternRelatedToParentDirectory);
    }
    exports.getPatternsOutsideCurrentDirectory = getPatternsOutsideCurrentDirectory;
    function isPatternRelatedToParentDirectory(pattern) {
      return pattern.startsWith("..") || pattern.startsWith("./..");
    }
    exports.isPatternRelatedToParentDirectory = isPatternRelatedToParentDirectory;
    function getBaseDirectory(pattern) {
      return globParent(pattern, { flipBackslashes: false });
    }
    exports.getBaseDirectory = getBaseDirectory;
    function hasGlobStar(pattern) {
      return pattern.includes(GLOBSTAR);
    }
    exports.hasGlobStar = hasGlobStar;
    function endsWithSlashGlobStar(pattern) {
      return pattern.endsWith("/" + GLOBSTAR);
    }
    exports.endsWithSlashGlobStar = endsWithSlashGlobStar;
    function isAffectDepthOfReadingPattern(pattern) {
      const basename = path10.basename(pattern);
      return endsWithSlashGlobStar(pattern) || isStaticPattern(basename);
    }
    exports.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
    function expandPatternsWithBraceExpansion(patterns) {
      return patterns.reduce((collection, pattern) => {
        return collection.concat(expandBraceExpansion(pattern));
      }, []);
    }
    exports.expandPatternsWithBraceExpansion = expandPatternsWithBraceExpansion;
    function expandBraceExpansion(pattern) {
      return micromatch.braces(pattern, {
        expand: true,
        nodupes: true
      });
    }
    exports.expandBraceExpansion = expandBraceExpansion;
    function getPatternParts(pattern, options) {
      let { parts } = micromatch.scan(pattern, Object.assign(Object.assign({}, options), { parts: true }));
      if (parts.length === 0) {
        parts = [pattern];
      }
      if (parts[0].startsWith("/")) {
        parts[0] = parts[0].slice(1);
        parts.unshift("");
      }
      return parts;
    }
    exports.getPatternParts = getPatternParts;
    function makeRe(pattern, options) {
      return micromatch.makeRe(pattern, options);
    }
    exports.makeRe = makeRe;
    function convertPatternsToRe(patterns, options) {
      return patterns.map((pattern) => makeRe(pattern, options));
    }
    exports.convertPatternsToRe = convertPatternsToRe;
    function matchAny(entry, patternsRe) {
      return patternsRe.some((patternRe) => patternRe.test(entry));
    }
    exports.matchAny = matchAny;
  }
});

// node_modules/merge2/index.js
var require_merge2 = __commonJS({
  "node_modules/merge2/index.js"(exports, module2) {
    "use strict";
    init_shim();
    var Stream = require("stream");
    var PassThrough = Stream.PassThrough;
    var slice = Array.prototype.slice;
    module2.exports = merge2;
    function merge2() {
      const streamsQueue = [];
      const args = slice.call(arguments);
      let merging = false;
      let options = args[args.length - 1];
      if (options && !Array.isArray(options) && options.pipe == null) {
        args.pop();
      } else {
        options = {};
      }
      const doEnd = options.end !== false;
      const doPipeError = options.pipeError === true;
      if (options.objectMode == null) {
        options.objectMode = true;
      }
      if (options.highWaterMark == null) {
        options.highWaterMark = 64 * 1024;
      }
      const mergedStream = PassThrough(options);
      function addStream() {
        for (let i = 0, len = arguments.length; i < len; i++) {
          streamsQueue.push(pauseStreams(arguments[i], options));
        }
        mergeStream();
        return this;
      }
      function mergeStream() {
        if (merging) {
          return;
        }
        merging = true;
        let streams = streamsQueue.shift();
        if (!streams) {
          import_process.default.nextTick(endStream);
          return;
        }
        if (!Array.isArray(streams)) {
          streams = [streams];
        }
        let pipesCount = streams.length + 1;
        function next() {
          if (--pipesCount > 0) {
            return;
          }
          merging = false;
          mergeStream();
        }
        function pipe(stream) {
          function onend() {
            stream.removeListener("merge2UnpipeEnd", onend);
            stream.removeListener("end", onend);
            if (doPipeError) {
              stream.removeListener("error", onerror);
            }
            next();
          }
          function onerror(err) {
            mergedStream.emit("error", err);
          }
          if (stream._readableState.endEmitted) {
            return next();
          }
          stream.on("merge2UnpipeEnd", onend);
          stream.on("end", onend);
          if (doPipeError) {
            stream.on("error", onerror);
          }
          stream.pipe(mergedStream, { end: false });
          stream.resume();
        }
        for (let i = 0; i < streams.length; i++) {
          pipe(streams[i]);
        }
        next();
      }
      function endStream() {
        merging = false;
        mergedStream.emit("queueDrain");
        if (doEnd) {
          mergedStream.end();
        }
      }
      mergedStream.setMaxListeners(0);
      mergedStream.add = addStream;
      mergedStream.on("unpipe", function(stream) {
        stream.emit("merge2UnpipeEnd");
      });
      if (args.length) {
        addStream.apply(null, args);
      }
      return mergedStream;
    }
    function pauseStreams(streams, options) {
      if (!Array.isArray(streams)) {
        if (!streams._readableState && streams.pipe) {
          streams = streams.pipe(PassThrough(options));
        }
        if (!streams._readableState || !streams.pause || !streams.pipe) {
          throw new Error("Only readable stream can be merged.");
        }
        streams.pause();
      } else {
        for (let i = 0, len = streams.length; i < len; i++) {
          streams[i] = pauseStreams(streams[i], options);
        }
      }
      return streams;
    }
  }
});

// node_modules/fast-glob/out/utils/stream.js
var require_stream = __commonJS({
  "node_modules/fast-glob/out/utils/stream.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.merge = void 0;
    var merge2 = require_merge2();
    function merge3(streams) {
      const mergedStream = merge2(streams);
      streams.forEach((stream) => {
        stream.once("error", (error7) => mergedStream.emit("error", error7));
      });
      mergedStream.once("close", () => propagateCloseEventToSources(streams));
      mergedStream.once("end", () => propagateCloseEventToSources(streams));
      return mergedStream;
    }
    exports.merge = merge3;
    function propagateCloseEventToSources(streams) {
      streams.forEach((stream) => stream.emit("close"));
    }
  }
});

// node_modules/fast-glob/out/utils/string.js
var require_string = __commonJS({
  "node_modules/fast-glob/out/utils/string.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isEmpty = exports.isString = void 0;
    function isString(input) {
      return typeof input === "string";
    }
    exports.isString = isString;
    function isEmpty(input) {
      return input === "";
    }
    exports.isEmpty = isEmpty;
  }
});

// node_modules/fast-glob/out/utils/index.js
var require_utils3 = __commonJS({
  "node_modules/fast-glob/out/utils/index.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.string = exports.stream = exports.pattern = exports.path = exports.fs = exports.errno = exports.array = void 0;
    var array = require_array();
    exports.array = array;
    var errno = require_errno();
    exports.errno = errno;
    var fs16 = require_fs();
    exports.fs = fs16;
    var path10 = require_path();
    exports.path = path10;
    var pattern = require_pattern();
    exports.pattern = pattern;
    var stream = require_stream();
    exports.stream = stream;
    var string = require_string();
    exports.string = string;
  }
});

// node_modules/fast-glob/out/managers/tasks.js
var require_tasks = __commonJS({
  "node_modules/fast-glob/out/managers/tasks.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.convertPatternGroupToTask = exports.convertPatternGroupsToTasks = exports.groupPatternsByBaseDirectory = exports.getNegativePatternsAsPositive = exports.getPositivePatterns = exports.convertPatternsToTasks = exports.generate = void 0;
    var utils = require_utils3();
    function generate(patterns, settings) {
      const positivePatterns = getPositivePatterns(patterns);
      const negativePatterns = getNegativePatternsAsPositive(patterns, settings.ignore);
      const staticPatterns = positivePatterns.filter((pattern) => utils.pattern.isStaticPattern(pattern, settings));
      const dynamicPatterns = positivePatterns.filter((pattern) => utils.pattern.isDynamicPattern(pattern, settings));
      const staticTasks = convertPatternsToTasks(staticPatterns, negativePatterns, false);
      const dynamicTasks = convertPatternsToTasks(dynamicPatterns, negativePatterns, true);
      return staticTasks.concat(dynamicTasks);
    }
    exports.generate = generate;
    function convertPatternsToTasks(positive, negative, dynamic) {
      const tasks = [];
      const patternsOutsideCurrentDirectory = utils.pattern.getPatternsOutsideCurrentDirectory(positive);
      const patternsInsideCurrentDirectory = utils.pattern.getPatternsInsideCurrentDirectory(positive);
      const outsideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsOutsideCurrentDirectory);
      const insideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsInsideCurrentDirectory);
      tasks.push(...convertPatternGroupsToTasks(outsideCurrentDirectoryGroup, negative, dynamic));
      if ("." in insideCurrentDirectoryGroup) {
        tasks.push(convertPatternGroupToTask(".", patternsInsideCurrentDirectory, negative, dynamic));
      } else {
        tasks.push(...convertPatternGroupsToTasks(insideCurrentDirectoryGroup, negative, dynamic));
      }
      return tasks;
    }
    exports.convertPatternsToTasks = convertPatternsToTasks;
    function getPositivePatterns(patterns) {
      return utils.pattern.getPositivePatterns(patterns);
    }
    exports.getPositivePatterns = getPositivePatterns;
    function getNegativePatternsAsPositive(patterns, ignore) {
      const negative = utils.pattern.getNegativePatterns(patterns).concat(ignore);
      const positive = negative.map(utils.pattern.convertToPositivePattern);
      return positive;
    }
    exports.getNegativePatternsAsPositive = getNegativePatternsAsPositive;
    function groupPatternsByBaseDirectory(patterns) {
      const group = {};
      return patterns.reduce((collection, pattern) => {
        const base = utils.pattern.getBaseDirectory(pattern);
        if (base in collection) {
          collection[base].push(pattern);
        } else {
          collection[base] = [pattern];
        }
        return collection;
      }, group);
    }
    exports.groupPatternsByBaseDirectory = groupPatternsByBaseDirectory;
    function convertPatternGroupsToTasks(positive, negative, dynamic) {
      return Object.keys(positive).map((base) => {
        return convertPatternGroupToTask(base, positive[base], negative, dynamic);
      });
    }
    exports.convertPatternGroupsToTasks = convertPatternGroupsToTasks;
    function convertPatternGroupToTask(base, positive, negative, dynamic) {
      return {
        dynamic,
        positive,
        negative,
        base,
        patterns: [].concat(positive, negative.map(utils.pattern.convertToNegativePattern))
      };
    }
    exports.convertPatternGroupToTask = convertPatternGroupToTask;
  }
});

// node_modules/fast-glob/out/managers/patterns.js
var require_patterns = __commonJS({
  "node_modules/fast-glob/out/managers/patterns.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.removeDuplicateSlashes = exports.transform = void 0;
    var DOUBLE_SLASH_RE = /(?!^)\/{2,}/g;
    function transform(patterns) {
      return patterns.map((pattern) => removeDuplicateSlashes(pattern));
    }
    exports.transform = transform;
    function removeDuplicateSlashes(pattern) {
      return pattern.replace(DOUBLE_SLASH_RE, "/");
    }
    exports.removeDuplicateSlashes = removeDuplicateSlashes;
  }
});

// node_modules/@nodelib/fs.stat/out/providers/async.js
var require_async = __commonJS({
  "node_modules/@nodelib/fs.stat/out/providers/async.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.read = void 0;
    function read(path10, settings, callback) {
      settings.fs.lstat(path10, (lstatError, lstat) => {
        if (lstatError !== null) {
          callFailureCallback(callback, lstatError);
          return;
        }
        if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
          callSuccessCallback(callback, lstat);
          return;
        }
        settings.fs.stat(path10, (statError, stat) => {
          if (statError !== null) {
            if (settings.throwErrorOnBrokenSymbolicLink) {
              callFailureCallback(callback, statError);
              return;
            }
            callSuccessCallback(callback, lstat);
            return;
          }
          if (settings.markSymbolicLink) {
            stat.isSymbolicLink = () => true;
          }
          callSuccessCallback(callback, stat);
        });
      });
    }
    exports.read = read;
    function callFailureCallback(callback, error7) {
      callback(error7);
    }
    function callSuccessCallback(callback, result) {
      callback(null, result);
    }
  }
});

// node_modules/@nodelib/fs.stat/out/providers/sync.js
var require_sync = __commonJS({
  "node_modules/@nodelib/fs.stat/out/providers/sync.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.read = void 0;
    function read(path10, settings) {
      const lstat = settings.fs.lstatSync(path10);
      if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
        return lstat;
      }
      try {
        const stat = settings.fs.statSync(path10);
        if (settings.markSymbolicLink) {
          stat.isSymbolicLink = () => true;
        }
        return stat;
      } catch (error7) {
        if (!settings.throwErrorOnBrokenSymbolicLink) {
          return lstat;
        }
        throw error7;
      }
    }
    exports.read = read;
  }
});

// node_modules/@nodelib/fs.stat/out/adapters/fs.js
var require_fs2 = __commonJS({
  "node_modules/@nodelib/fs.stat/out/adapters/fs.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createFileSystemAdapter = exports.FILE_SYSTEM_ADAPTER = void 0;
    var fs16 = require("fs");
    exports.FILE_SYSTEM_ADAPTER = {
      lstat: fs16.lstat,
      stat: fs16.stat,
      lstatSync: fs16.lstatSync,
      statSync: fs16.statSync
    };
    function createFileSystemAdapter(fsMethods) {
      if (fsMethods === void 0) {
        return exports.FILE_SYSTEM_ADAPTER;
      }
      return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
    }
    exports.createFileSystemAdapter = createFileSystemAdapter;
  }
});

// node_modules/@nodelib/fs.stat/out/settings.js
var require_settings = __commonJS({
  "node_modules/@nodelib/fs.stat/out/settings.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var fs16 = require_fs2();
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, true);
        this.fs = fs16.createFileSystemAdapter(this._options.fs);
        this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
      }
      _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
      }
    };
    exports.default = Settings;
  }
});

// node_modules/@nodelib/fs.stat/out/index.js
var require_out = __commonJS({
  "node_modules/@nodelib/fs.stat/out/index.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.statSync = exports.stat = exports.Settings = void 0;
    var async = require_async();
    var sync = require_sync();
    var settings_1 = require_settings();
    exports.Settings = settings_1.default;
    function stat(path10, optionsOrSettingsOrCallback, callback) {
      if (typeof optionsOrSettingsOrCallback === "function") {
        async.read(path10, getSettings(), optionsOrSettingsOrCallback);
        return;
      }
      async.read(path10, getSettings(optionsOrSettingsOrCallback), callback);
    }
    exports.stat = stat;
    function statSync(path10, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      return sync.read(path10, settings);
    }
    exports.statSync = statSync;
    function getSettings(settingsOrOptions = {}) {
      if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
      }
      return new settings_1.default(settingsOrOptions);
    }
  }
});

// node_modules/queue-microtask/index.js
var require_queue_microtask = __commonJS({
  "node_modules/queue-microtask/index.js"(exports, module2) {
    init_shim();
    var promise;
    module2.exports = typeof queueMicrotask === "function" ? queueMicrotask.bind(typeof window !== "undefined" ? window : _global) : (cb) => (promise || (promise = Promise.resolve())).then(cb).catch((err) => setTimeout(() => {
      throw err;
    }, 0));
  }
});

// node_modules/run-parallel/index.js
var require_run_parallel = __commonJS({
  "node_modules/run-parallel/index.js"(exports, module2) {
    init_shim();
    module2.exports = runParallel;
    var queueMicrotask2 = require_queue_microtask();
    function runParallel(tasks, cb) {
      let results, pending, keys;
      let isSync = true;
      if (Array.isArray(tasks)) {
        results = [];
        pending = tasks.length;
      } else {
        keys = Object.keys(tasks);
        results = {};
        pending = keys.length;
      }
      function done(err) {
        function end() {
          if (cb)
            cb(err, results);
          cb = null;
        }
        if (isSync)
          queueMicrotask2(end);
        else
          end();
      }
      function each(i, err, result) {
        results[i] = result;
        if (--pending === 0 || err) {
          done(err);
        }
      }
      if (!pending) {
        done(null);
      } else if (keys) {
        keys.forEach(function(key) {
          tasks[key](function(err, result) {
            each(key, err, result);
          });
        });
      } else {
        tasks.forEach(function(task, i) {
          task(function(err, result) {
            each(i, err, result);
          });
        });
      }
      isSync = false;
    }
  }
});

// node_modules/@nodelib/fs.scandir/out/constants.js
var require_constants3 = __commonJS({
  "node_modules/@nodelib/fs.scandir/out/constants.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IS_SUPPORT_READDIR_WITH_FILE_TYPES = void 0;
    var NODE_PROCESS_VERSION_PARTS = import_process.default.versions.node.split(".");
    if (NODE_PROCESS_VERSION_PARTS[0] === void 0 || NODE_PROCESS_VERSION_PARTS[1] === void 0) {
      throw new Error(`Unexpected behavior. The 'process.versions.node' variable has invalid value: ${import_process.default.versions.node}`);
    }
    var MAJOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[0], 10);
    var MINOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[1], 10);
    var SUPPORTED_MAJOR_VERSION = 10;
    var SUPPORTED_MINOR_VERSION = 10;
    var IS_MATCHED_BY_MAJOR = MAJOR_VERSION > SUPPORTED_MAJOR_VERSION;
    var IS_MATCHED_BY_MAJOR_AND_MINOR = MAJOR_VERSION === SUPPORTED_MAJOR_VERSION && MINOR_VERSION >= SUPPORTED_MINOR_VERSION;
    exports.IS_SUPPORT_READDIR_WITH_FILE_TYPES = IS_MATCHED_BY_MAJOR || IS_MATCHED_BY_MAJOR_AND_MINOR;
  }
});

// node_modules/@nodelib/fs.scandir/out/utils/fs.js
var require_fs3 = __commonJS({
  "node_modules/@nodelib/fs.scandir/out/utils/fs.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createDirentFromStats = void 0;
    var DirentFromStats = class {
      constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
      }
    };
    function createDirentFromStats(name, stats) {
      return new DirentFromStats(name, stats);
    }
    exports.createDirentFromStats = createDirentFromStats;
  }
});

// node_modules/@nodelib/fs.scandir/out/utils/index.js
var require_utils4 = __commonJS({
  "node_modules/@nodelib/fs.scandir/out/utils/index.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fs = void 0;
    var fs16 = require_fs3();
    exports.fs = fs16;
  }
});

// node_modules/@nodelib/fs.scandir/out/providers/common.js
var require_common = __commonJS({
  "node_modules/@nodelib/fs.scandir/out/providers/common.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.joinPathSegments = void 0;
    function joinPathSegments(a, b, separator) {
      if (a.endsWith(separator)) {
        return a + b;
      }
      return a + separator + b;
    }
    exports.joinPathSegments = joinPathSegments;
  }
});

// node_modules/@nodelib/fs.scandir/out/providers/async.js
var require_async2 = __commonJS({
  "node_modules/@nodelib/fs.scandir/out/providers/async.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.readdir = exports.readdirWithFileTypes = exports.read = void 0;
    var fsStat = require_out();
    var rpl = require_run_parallel();
    var constants_1 = require_constants3();
    var utils = require_utils4();
    var common = require_common();
    function read(directory, settings, callback) {
      if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        readdirWithFileTypes(directory, settings, callback);
        return;
      }
      readdir(directory, settings, callback);
    }
    exports.read = read;
    function readdirWithFileTypes(directory, settings, callback) {
      settings.fs.readdir(directory, { withFileTypes: true }, (readdirError, dirents) => {
        if (readdirError !== null) {
          callFailureCallback(callback, readdirError);
          return;
        }
        const entries = dirents.map((dirent) => ({
          dirent,
          name: dirent.name,
          path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
        }));
        if (!settings.followSymbolicLinks) {
          callSuccessCallback(callback, entries);
          return;
        }
        const tasks = entries.map((entry) => makeRplTaskEntry(entry, settings));
        rpl(tasks, (rplError, rplEntries) => {
          if (rplError !== null) {
            callFailureCallback(callback, rplError);
            return;
          }
          callSuccessCallback(callback, rplEntries);
        });
      });
    }
    exports.readdirWithFileTypes = readdirWithFileTypes;
    function makeRplTaskEntry(entry, settings) {
      return (done) => {
        if (!entry.dirent.isSymbolicLink()) {
          done(null, entry);
          return;
        }
        settings.fs.stat(entry.path, (statError, stats) => {
          if (statError !== null) {
            if (settings.throwErrorOnBrokenSymbolicLink) {
              done(statError);
              return;
            }
            done(null, entry);
            return;
          }
          entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
          done(null, entry);
        });
      };
    }
    function readdir(directory, settings, callback) {
      settings.fs.readdir(directory, (readdirError, names) => {
        if (readdirError !== null) {
          callFailureCallback(callback, readdirError);
          return;
        }
        const tasks = names.map((name) => {
          const path10 = common.joinPathSegments(directory, name, settings.pathSegmentSeparator);
          return (done) => {
            fsStat.stat(path10, settings.fsStatSettings, (error7, stats) => {
              if (error7 !== null) {
                done(error7);
                return;
              }
              const entry = {
                name,
                path: path10,
                dirent: utils.fs.createDirentFromStats(name, stats)
              };
              if (settings.stats) {
                entry.stats = stats;
              }
              done(null, entry);
            });
          };
        });
        rpl(tasks, (rplError, entries) => {
          if (rplError !== null) {
            callFailureCallback(callback, rplError);
            return;
          }
          callSuccessCallback(callback, entries);
        });
      });
    }
    exports.readdir = readdir;
    function callFailureCallback(callback, error7) {
      callback(error7);
    }
    function callSuccessCallback(callback, result) {
      callback(null, result);
    }
  }
});

// node_modules/@nodelib/fs.scandir/out/providers/sync.js
var require_sync2 = __commonJS({
  "node_modules/@nodelib/fs.scandir/out/providers/sync.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.readdir = exports.readdirWithFileTypes = exports.read = void 0;
    var fsStat = require_out();
    var constants_1 = require_constants3();
    var utils = require_utils4();
    var common = require_common();
    function read(directory, settings) {
      if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        return readdirWithFileTypes(directory, settings);
      }
      return readdir(directory, settings);
    }
    exports.read = read;
    function readdirWithFileTypes(directory, settings) {
      const dirents = settings.fs.readdirSync(directory, { withFileTypes: true });
      return dirents.map((dirent) => {
        const entry = {
          dirent,
          name: dirent.name,
          path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
        };
        if (entry.dirent.isSymbolicLink() && settings.followSymbolicLinks) {
          try {
            const stats = settings.fs.statSync(entry.path);
            entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
          } catch (error7) {
            if (settings.throwErrorOnBrokenSymbolicLink) {
              throw error7;
            }
          }
        }
        return entry;
      });
    }
    exports.readdirWithFileTypes = readdirWithFileTypes;
    function readdir(directory, settings) {
      const names = settings.fs.readdirSync(directory);
      return names.map((name) => {
        const entryPath = common.joinPathSegments(directory, name, settings.pathSegmentSeparator);
        const stats = fsStat.statSync(entryPath, settings.fsStatSettings);
        const entry = {
          name,
          path: entryPath,
          dirent: utils.fs.createDirentFromStats(name, stats)
        };
        if (settings.stats) {
          entry.stats = stats;
        }
        return entry;
      });
    }
    exports.readdir = readdir;
  }
});

// node_modules/@nodelib/fs.scandir/out/adapters/fs.js
var require_fs4 = __commonJS({
  "node_modules/@nodelib/fs.scandir/out/adapters/fs.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createFileSystemAdapter = exports.FILE_SYSTEM_ADAPTER = void 0;
    var fs16 = require("fs");
    exports.FILE_SYSTEM_ADAPTER = {
      lstat: fs16.lstat,
      stat: fs16.stat,
      lstatSync: fs16.lstatSync,
      statSync: fs16.statSync,
      readdir: fs16.readdir,
      readdirSync: fs16.readdirSync
    };
    function createFileSystemAdapter(fsMethods) {
      if (fsMethods === void 0) {
        return exports.FILE_SYSTEM_ADAPTER;
      }
      return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
    }
    exports.createFileSystemAdapter = createFileSystemAdapter;
  }
});

// node_modules/@nodelib/fs.scandir/out/settings.js
var require_settings2 = __commonJS({
  "node_modules/@nodelib/fs.scandir/out/settings.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var path10 = require("path");
    var fsStat = require_out();
    var fs16 = require_fs4();
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, false);
        this.fs = fs16.createFileSystemAdapter(this._options.fs);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path10.sep);
        this.stats = this._getValue(this._options.stats, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
        this.fsStatSettings = new fsStat.Settings({
          followSymbolicLink: this.followSymbolicLinks,
          fs: this.fs,
          throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink
        });
      }
      _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
      }
    };
    exports.default = Settings;
  }
});

// node_modules/@nodelib/fs.scandir/out/index.js
var require_out2 = __commonJS({
  "node_modules/@nodelib/fs.scandir/out/index.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Settings = exports.scandirSync = exports.scandir = void 0;
    var async = require_async2();
    var sync = require_sync2();
    var settings_1 = require_settings2();
    exports.Settings = settings_1.default;
    function scandir(path10, optionsOrSettingsOrCallback, callback) {
      if (typeof optionsOrSettingsOrCallback === "function") {
        async.read(path10, getSettings(), optionsOrSettingsOrCallback);
        return;
      }
      async.read(path10, getSettings(optionsOrSettingsOrCallback), callback);
    }
    exports.scandir = scandir;
    function scandirSync(path10, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      return sync.read(path10, settings);
    }
    exports.scandirSync = scandirSync;
    function getSettings(settingsOrOptions = {}) {
      if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
      }
      return new settings_1.default(settingsOrOptions);
    }
  }
});

// node_modules/reusify/reusify.js
var require_reusify = __commonJS({
  "node_modules/reusify/reusify.js"(exports, module2) {
    "use strict";
    init_shim();
    function reusify(Constructor2) {
      var head = new Constructor2();
      var tail = head;
      function get4() {
        var current = head;
        if (current.next) {
          head = current.next;
        } else {
          head = new Constructor2();
          tail = head;
        }
        current.next = null;
        return current;
      }
      function release(obj) {
        tail.next = obj;
        tail = obj;
      }
      return {
        get: get4,
        release
      };
    }
    module2.exports = reusify;
  }
});

// node_modules/fastq/queue.js
var require_queue = __commonJS({
  "node_modules/fastq/queue.js"(exports, module2) {
    "use strict";
    init_shim();
    var reusify = require_reusify();
    function fastqueue(context, worker, concurrency) {
      if (typeof context === "function") {
        concurrency = worker;
        worker = context;
        context = null;
      }
      if (concurrency < 1) {
        throw new Error("fastqueue concurrency must be greater than 1");
      }
      var cache2 = reusify(Task);
      var queueHead = null;
      var queueTail = null;
      var _running = 0;
      var errorHandler = null;
      var self2 = {
        push,
        drain: noop,
        saturated: noop,
        pause,
        paused: false,
        concurrency,
        running,
        resume,
        idle,
        length,
        getQueue,
        unshift,
        empty: noop,
        kill,
        killAndDrain,
        error: error7
      };
      return self2;
      function running() {
        return _running;
      }
      function pause() {
        self2.paused = true;
      }
      function length() {
        var current = queueHead;
        var counter = 0;
        while (current) {
          current = current.next;
          counter++;
        }
        return counter;
      }
      function getQueue() {
        var current = queueHead;
        var tasks = [];
        while (current) {
          tasks.push(current.value);
          current = current.next;
        }
        return tasks;
      }
      function resume() {
        if (!self2.paused)
          return;
        self2.paused = false;
        for (var i = 0; i < self2.concurrency; i++) {
          _running++;
          release();
        }
      }
      function idle() {
        return _running === 0 && self2.length() === 0;
      }
      function push(value, done) {
        var current = cache2.get();
        current.context = context;
        current.release = release;
        current.value = value;
        current.callback = done || noop;
        current.errorHandler = errorHandler;
        if (_running === self2.concurrency || self2.paused) {
          if (queueTail) {
            queueTail.next = current;
            queueTail = current;
          } else {
            queueHead = current;
            queueTail = current;
            self2.saturated();
          }
        } else {
          _running++;
          worker.call(context, current.value, current.worked);
        }
      }
      function unshift(value, done) {
        var current = cache2.get();
        current.context = context;
        current.release = release;
        current.value = value;
        current.callback = done || noop;
        if (_running === self2.concurrency || self2.paused) {
          if (queueHead) {
            current.next = queueHead;
            queueHead = current;
          } else {
            queueHead = current;
            queueTail = current;
            self2.saturated();
          }
        } else {
          _running++;
          worker.call(context, current.value, current.worked);
        }
      }
      function release(holder) {
        if (holder) {
          cache2.release(holder);
        }
        var next = queueHead;
        if (next) {
          if (!self2.paused) {
            if (queueTail === queueHead) {
              queueTail = null;
            }
            queueHead = next.next;
            next.next = null;
            worker.call(context, next.value, next.worked);
            if (queueTail === null) {
              self2.empty();
            }
          } else {
            _running--;
          }
        } else if (--_running === 0) {
          self2.drain();
        }
      }
      function kill() {
        queueHead = null;
        queueTail = null;
        self2.drain = noop;
      }
      function killAndDrain() {
        queueHead = null;
        queueTail = null;
        self2.drain();
        self2.drain = noop;
      }
      function error7(handler) {
        errorHandler = handler;
      }
    }
    function noop() {
    }
    function Task() {
      this.value = null;
      this.callback = noop;
      this.next = null;
      this.release = noop;
      this.context = null;
      this.errorHandler = null;
      var self2 = this;
      this.worked = function worked(err, result) {
        var callback = self2.callback;
        var errorHandler = self2.errorHandler;
        var val = self2.value;
        self2.value = null;
        self2.callback = noop;
        if (self2.errorHandler) {
          errorHandler(err, val);
        }
        callback.call(self2.context, err, result);
        self2.release(self2);
      };
    }
    function queueAsPromised(context, worker, concurrency) {
      if (typeof context === "function") {
        concurrency = worker;
        worker = context;
        context = null;
      }
      function asyncWrapper(arg, cb) {
        worker.call(this, arg).then(function(res) {
          cb(null, res);
        }, cb);
      }
      var queue = fastqueue(context, asyncWrapper, concurrency);
      var pushCb = queue.push;
      var unshiftCb = queue.unshift;
      queue.push = push;
      queue.unshift = unshift;
      queue.drained = drained;
      return queue;
      function push(value) {
        var p = new Promise(function(resolve, reject) {
          pushCb(value, function(err, result) {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          });
        });
        p.catch(noop);
        return p;
      }
      function unshift(value) {
        var p = new Promise(function(resolve, reject) {
          unshiftCb(value, function(err, result) {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          });
        });
        p.catch(noop);
        return p;
      }
      function drained() {
        var previousDrain = queue.drain;
        var p = new Promise(function(resolve) {
          queue.drain = function() {
            previousDrain();
            resolve();
          };
        });
        return p;
      }
    }
    module2.exports = fastqueue;
    module2.exports.promise = queueAsPromised;
  }
});

// node_modules/@nodelib/fs.walk/out/readers/common.js
var require_common2 = __commonJS({
  "node_modules/@nodelib/fs.walk/out/readers/common.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.joinPathSegments = exports.replacePathSegmentSeparator = exports.isAppliedFilter = exports.isFatalError = void 0;
    function isFatalError(settings, error7) {
      if (settings.errorFilter === null) {
        return true;
      }
      return !settings.errorFilter(error7);
    }
    exports.isFatalError = isFatalError;
    function isAppliedFilter(filter, value) {
      return filter === null || filter(value);
    }
    exports.isAppliedFilter = isAppliedFilter;
    function replacePathSegmentSeparator(filepath, separator) {
      return filepath.split(/[/\\]/).join(separator);
    }
    exports.replacePathSegmentSeparator = replacePathSegmentSeparator;
    function joinPathSegments(a, b, separator) {
      if (a === "") {
        return b;
      }
      if (a.endsWith(separator)) {
        return a + b;
      }
      return a + separator + b;
    }
    exports.joinPathSegments = joinPathSegments;
  }
});

// node_modules/@nodelib/fs.walk/out/readers/reader.js
var require_reader = __commonJS({
  "node_modules/@nodelib/fs.walk/out/readers/reader.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var common = require_common2();
    var Reader = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._root = common.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
      }
    };
    exports.default = Reader;
  }
});

// node_modules/@nodelib/fs.walk/out/readers/async.js
var require_async3 = __commonJS({
  "node_modules/@nodelib/fs.walk/out/readers/async.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var events_1 = require("events");
    var fsScandir = require_out2();
    var fastq = require_queue();
    var common = require_common2();
    var reader_1 = require_reader();
    var AsyncReader = class extends reader_1.default {
      constructor(_root, _settings) {
        super(_root, _settings);
        this._settings = _settings;
        this._scandir = fsScandir.scandir;
        this._emitter = new events_1.EventEmitter();
        this._queue = fastq(this._worker.bind(this), this._settings.concurrency);
        this._isFatalError = false;
        this._isDestroyed = false;
        this._queue.drain = () => {
          if (!this._isFatalError) {
            this._emitter.emit("end");
          }
        };
      }
      read() {
        this._isFatalError = false;
        this._isDestroyed = false;
        setImmediate(() => {
          this._pushToQueue(this._root, this._settings.basePath);
        });
        return this._emitter;
      }
      get isDestroyed() {
        return this._isDestroyed;
      }
      destroy() {
        if (this._isDestroyed) {
          throw new Error("The reader is already destroyed");
        }
        this._isDestroyed = true;
        this._queue.killAndDrain();
      }
      onEntry(callback) {
        this._emitter.on("entry", callback);
      }
      onError(callback) {
        this._emitter.once("error", callback);
      }
      onEnd(callback) {
        this._emitter.once("end", callback);
      }
      _pushToQueue(directory, base) {
        const queueItem = { directory, base };
        this._queue.push(queueItem, (error7) => {
          if (error7 !== null) {
            this._handleError(error7);
          }
        });
      }
      _worker(item, done) {
        this._scandir(item.directory, this._settings.fsScandirSettings, (error7, entries) => {
          if (error7 !== null) {
            done(error7, void 0);
            return;
          }
          for (const entry of entries) {
            this._handleEntry(entry, item.base);
          }
          done(null, void 0);
        });
      }
      _handleError(error7) {
        if (this._isDestroyed || !common.isFatalError(this._settings, error7)) {
          return;
        }
        this._isFatalError = true;
        this._isDestroyed = true;
        this._emitter.emit("error", error7);
      }
      _handleEntry(entry, base) {
        if (this._isDestroyed || this._isFatalError) {
          return;
        }
        const fullpath = entry.path;
        if (base !== void 0) {
          entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
        }
        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
          this._emitEntry(entry);
        }
        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
          this._pushToQueue(fullpath, base === void 0 ? void 0 : entry.path);
        }
      }
      _emitEntry(entry) {
        this._emitter.emit("entry", entry);
      }
    };
    exports.default = AsyncReader;
  }
});

// node_modules/@nodelib/fs.walk/out/providers/async.js
var require_async4 = __commonJS({
  "node_modules/@nodelib/fs.walk/out/providers/async.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var async_1 = require_async3();
    var AsyncProvider = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1.default(this._root, this._settings);
        this._storage = [];
      }
      read(callback) {
        this._reader.onError((error7) => {
          callFailureCallback(callback, error7);
        });
        this._reader.onEntry((entry) => {
          this._storage.push(entry);
        });
        this._reader.onEnd(() => {
          callSuccessCallback(callback, this._storage);
        });
        this._reader.read();
      }
    };
    exports.default = AsyncProvider;
    function callFailureCallback(callback, error7) {
      callback(error7);
    }
    function callSuccessCallback(callback, entries) {
      callback(null, entries);
    }
  }
});

// node_modules/@nodelib/fs.walk/out/providers/stream.js
var require_stream2 = __commonJS({
  "node_modules/@nodelib/fs.walk/out/providers/stream.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var stream_1 = require("stream");
    var async_1 = require_async3();
    var StreamProvider = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1.default(this._root, this._settings);
        this._stream = new stream_1.Readable({
          objectMode: true,
          read: () => {
          },
          destroy: () => {
            if (!this._reader.isDestroyed) {
              this._reader.destroy();
            }
          }
        });
      }
      read() {
        this._reader.onError((error7) => {
          this._stream.emit("error", error7);
        });
        this._reader.onEntry((entry) => {
          this._stream.push(entry);
        });
        this._reader.onEnd(() => {
          this._stream.push(null);
        });
        this._reader.read();
        return this._stream;
      }
    };
    exports.default = StreamProvider;
  }
});

// node_modules/@nodelib/fs.walk/out/readers/sync.js
var require_sync3 = __commonJS({
  "node_modules/@nodelib/fs.walk/out/readers/sync.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var fsScandir = require_out2();
    var common = require_common2();
    var reader_1 = require_reader();
    var SyncReader = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._scandir = fsScandir.scandirSync;
        this._storage = [];
        this._queue = /* @__PURE__ */ new Set();
      }
      read() {
        this._pushToQueue(this._root, this._settings.basePath);
        this._handleQueue();
        return this._storage;
      }
      _pushToQueue(directory, base) {
        this._queue.add({ directory, base });
      }
      _handleQueue() {
        for (const item of this._queue.values()) {
          this._handleDirectory(item.directory, item.base);
        }
      }
      _handleDirectory(directory, base) {
        try {
          const entries = this._scandir(directory, this._settings.fsScandirSettings);
          for (const entry of entries) {
            this._handleEntry(entry, base);
          }
        } catch (error7) {
          this._handleError(error7);
        }
      }
      _handleError(error7) {
        if (!common.isFatalError(this._settings, error7)) {
          return;
        }
        throw error7;
      }
      _handleEntry(entry, base) {
        const fullpath = entry.path;
        if (base !== void 0) {
          entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
        }
        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
          this._pushToStorage(entry);
        }
        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
          this._pushToQueue(fullpath, base === void 0 ? void 0 : entry.path);
        }
      }
      _pushToStorage(entry) {
        this._storage.push(entry);
      }
    };
    exports.default = SyncReader;
  }
});

// node_modules/@nodelib/fs.walk/out/providers/sync.js
var require_sync4 = __commonJS({
  "node_modules/@nodelib/fs.walk/out/providers/sync.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var sync_1 = require_sync3();
    var SyncProvider = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new sync_1.default(this._root, this._settings);
      }
      read() {
        return this._reader.read();
      }
    };
    exports.default = SyncProvider;
  }
});

// node_modules/@nodelib/fs.walk/out/settings.js
var require_settings3 = __commonJS({
  "node_modules/@nodelib/fs.walk/out/settings.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var path10 = require("path");
    var fsScandir = require_out2();
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.basePath = this._getValue(this._options.basePath, void 0);
        this.concurrency = this._getValue(this._options.concurrency, Number.POSITIVE_INFINITY);
        this.deepFilter = this._getValue(this._options.deepFilter, null);
        this.entryFilter = this._getValue(this._options.entryFilter, null);
        this.errorFilter = this._getValue(this._options.errorFilter, null);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path10.sep);
        this.fsScandirSettings = new fsScandir.Settings({
          followSymbolicLinks: this._options.followSymbolicLinks,
          fs: this._options.fs,
          pathSegmentSeparator: this._options.pathSegmentSeparator,
          stats: this._options.stats,
          throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
        });
      }
      _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
      }
    };
    exports.default = Settings;
  }
});

// node_modules/@nodelib/fs.walk/out/index.js
var require_out3 = __commonJS({
  "node_modules/@nodelib/fs.walk/out/index.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Settings = exports.walkStream = exports.walkSync = exports.walk = void 0;
    var async_1 = require_async4();
    var stream_1 = require_stream2();
    var sync_1 = require_sync4();
    var settings_1 = require_settings3();
    exports.Settings = settings_1.default;
    function walk(directory, optionsOrSettingsOrCallback, callback) {
      if (typeof optionsOrSettingsOrCallback === "function") {
        new async_1.default(directory, getSettings()).read(optionsOrSettingsOrCallback);
        return;
      }
      new async_1.default(directory, getSettings(optionsOrSettingsOrCallback)).read(callback);
    }
    exports.walk = walk;
    function walkSync(directory, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      const provider = new sync_1.default(directory, settings);
      return provider.read();
    }
    exports.walkSync = walkSync;
    function walkStream(directory, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      const provider = new stream_1.default(directory, settings);
      return provider.read();
    }
    exports.walkStream = walkStream;
    function getSettings(settingsOrOptions = {}) {
      if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
      }
      return new settings_1.default(settingsOrOptions);
    }
  }
});

// node_modules/fast-glob/out/readers/reader.js
var require_reader2 = __commonJS({
  "node_modules/fast-glob/out/readers/reader.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var path10 = require("path");
    var fsStat = require_out();
    var utils = require_utils3();
    var Reader = class {
      constructor(_settings) {
        this._settings = _settings;
        this._fsStatSettings = new fsStat.Settings({
          followSymbolicLink: this._settings.followSymbolicLinks,
          fs: this._settings.fs,
          throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
        });
      }
      _getFullEntryPath(filepath) {
        return path10.resolve(this._settings.cwd, filepath);
      }
      _makeEntry(stats, pattern) {
        const entry = {
          name: pattern,
          path: pattern,
          dirent: utils.fs.createDirentFromStats(pattern, stats)
        };
        if (this._settings.stats) {
          entry.stats = stats;
        }
        return entry;
      }
      _isFatalError(error7) {
        return !utils.errno.isEnoentCodeError(error7) && !this._settings.suppressErrors;
      }
    };
    exports.default = Reader;
  }
});

// node_modules/fast-glob/out/readers/stream.js
var require_stream3 = __commonJS({
  "node_modules/fast-glob/out/readers/stream.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var stream_1 = require("stream");
    var fsStat = require_out();
    var fsWalk = require_out3();
    var reader_1 = require_reader2();
    var ReaderStream = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._walkStream = fsWalk.walkStream;
        this._stat = fsStat.stat;
      }
      dynamic(root, options) {
        return this._walkStream(root, options);
      }
      static(patterns, options) {
        const filepaths = patterns.map(this._getFullEntryPath, this);
        const stream = new stream_1.PassThrough({ objectMode: true });
        stream._write = (index, _enc, done) => {
          return this._getEntry(filepaths[index], patterns[index], options).then((entry) => {
            if (entry !== null && options.entryFilter(entry)) {
              stream.push(entry);
            }
            if (index === filepaths.length - 1) {
              stream.end();
            }
            done();
          }).catch(done);
        };
        for (let i = 0; i < filepaths.length; i++) {
          stream.write(i);
        }
        return stream;
      }
      _getEntry(filepath, pattern, options) {
        return this._getStat(filepath).then((stats) => this._makeEntry(stats, pattern)).catch((error7) => {
          if (options.errorFilter(error7)) {
            return null;
          }
          throw error7;
        });
      }
      _getStat(filepath) {
        return new Promise((resolve, reject) => {
          this._stat(filepath, this._fsStatSettings, (error7, stats) => {
            return error7 === null ? resolve(stats) : reject(error7);
          });
        });
      }
    };
    exports.default = ReaderStream;
  }
});

// node_modules/fast-glob/out/readers/async.js
var require_async5 = __commonJS({
  "node_modules/fast-glob/out/readers/async.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var fsWalk = require_out3();
    var reader_1 = require_reader2();
    var stream_1 = require_stream3();
    var ReaderAsync = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._walkAsync = fsWalk.walk;
        this._readerStream = new stream_1.default(this._settings);
      }
      dynamic(root, options) {
        return new Promise((resolve, reject) => {
          this._walkAsync(root, options, (error7, entries) => {
            if (error7 === null) {
              resolve(entries);
            } else {
              reject(error7);
            }
          });
        });
      }
      async static(patterns, options) {
        const entries = [];
        const stream = this._readerStream.static(patterns, options);
        return new Promise((resolve, reject) => {
          stream.once("error", reject);
          stream.on("data", (entry) => entries.push(entry));
          stream.once("end", () => resolve(entries));
        });
      }
    };
    exports.default = ReaderAsync;
  }
});

// node_modules/fast-glob/out/providers/matchers/matcher.js
var require_matcher = __commonJS({
  "node_modules/fast-glob/out/providers/matchers/matcher.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils = require_utils3();
    var Matcher = class {
      constructor(_patterns, _settings, _micromatchOptions) {
        this._patterns = _patterns;
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this._storage = [];
        this._fillStorage();
      }
      _fillStorage() {
        const patterns = utils.pattern.expandPatternsWithBraceExpansion(this._patterns);
        for (const pattern of patterns) {
          const segments = this._getPatternSegments(pattern);
          const sections = this._splitSegmentsIntoSections(segments);
          this._storage.push({
            complete: sections.length <= 1,
            pattern,
            segments,
            sections
          });
        }
      }
      _getPatternSegments(pattern) {
        const parts = utils.pattern.getPatternParts(pattern, this._micromatchOptions);
        return parts.map((part) => {
          const dynamic = utils.pattern.isDynamicPattern(part, this._settings);
          if (!dynamic) {
            return {
              dynamic: false,
              pattern: part
            };
          }
          return {
            dynamic: true,
            pattern: part,
            patternRe: utils.pattern.makeRe(part, this._micromatchOptions)
          };
        });
      }
      _splitSegmentsIntoSections(segments) {
        return utils.array.splitWhen(segments, (segment) => segment.dynamic && utils.pattern.hasGlobStar(segment.pattern));
      }
    };
    exports.default = Matcher;
  }
});

// node_modules/fast-glob/out/providers/matchers/partial.js
var require_partial = __commonJS({
  "node_modules/fast-glob/out/providers/matchers/partial.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var matcher_1 = require_matcher();
    var PartialMatcher = class extends matcher_1.default {
      match(filepath) {
        const parts = filepath.split("/");
        const levels = parts.length;
        const patterns = this._storage.filter((info) => !info.complete || info.segments.length > levels);
        for (const pattern of patterns) {
          const section = pattern.sections[0];
          if (!pattern.complete && levels > section.length) {
            return true;
          }
          const match = parts.every((part, index) => {
            const segment = pattern.segments[index];
            if (segment.dynamic && segment.patternRe.test(part)) {
              return true;
            }
            if (!segment.dynamic && segment.pattern === part) {
              return true;
            }
            return false;
          });
          if (match) {
            return true;
          }
        }
        return false;
      }
    };
    exports.default = PartialMatcher;
  }
});

// node_modules/fast-glob/out/providers/filters/deep.js
var require_deep = __commonJS({
  "node_modules/fast-glob/out/providers/filters/deep.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils = require_utils3();
    var partial_1 = require_partial();
    var DeepFilter = class {
      constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
      }
      getFilter(basePath, positive, negative) {
        const matcher = this._getMatcher(positive);
        const negativeRe = this._getNegativePatternsRe(negative);
        return (entry) => this._filter(basePath, entry, matcher, negativeRe);
      }
      _getMatcher(patterns) {
        return new partial_1.default(patterns, this._settings, this._micromatchOptions);
      }
      _getNegativePatternsRe(patterns) {
        const affectDepthOfReadingPatterns = patterns.filter(utils.pattern.isAffectDepthOfReadingPattern);
        return utils.pattern.convertPatternsToRe(affectDepthOfReadingPatterns, this._micromatchOptions);
      }
      _filter(basePath, entry, matcher, negativeRe) {
        if (this._isSkippedByDeep(basePath, entry.path)) {
          return false;
        }
        if (this._isSkippedSymbolicLink(entry)) {
          return false;
        }
        const filepath = utils.path.removeLeadingDotSegment(entry.path);
        if (this._isSkippedByPositivePatterns(filepath, matcher)) {
          return false;
        }
        return this._isSkippedByNegativePatterns(filepath, negativeRe);
      }
      _isSkippedByDeep(basePath, entryPath) {
        if (this._settings.deep === Infinity) {
          return false;
        }
        return this._getEntryLevel(basePath, entryPath) >= this._settings.deep;
      }
      _getEntryLevel(basePath, entryPath) {
        const entryPathDepth = entryPath.split("/").length;
        if (basePath === "") {
          return entryPathDepth;
        }
        const basePathDepth = basePath.split("/").length;
        return entryPathDepth - basePathDepth;
      }
      _isSkippedSymbolicLink(entry) {
        return !this._settings.followSymbolicLinks && entry.dirent.isSymbolicLink();
      }
      _isSkippedByPositivePatterns(entryPath, matcher) {
        return !this._settings.baseNameMatch && !matcher.match(entryPath);
      }
      _isSkippedByNegativePatterns(entryPath, patternsRe) {
        return !utils.pattern.matchAny(entryPath, patternsRe);
      }
    };
    exports.default = DeepFilter;
  }
});

// node_modules/fast-glob/out/providers/filters/entry.js
var require_entry = __commonJS({
  "node_modules/fast-glob/out/providers/filters/entry.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils = require_utils3();
    var EntryFilter = class {
      constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this.index = /* @__PURE__ */ new Map();
      }
      getFilter(positive, negative) {
        const positiveRe = utils.pattern.convertPatternsToRe(positive, this._micromatchOptions);
        const negativeRe = utils.pattern.convertPatternsToRe(negative, this._micromatchOptions);
        return (entry) => this._filter(entry, positiveRe, negativeRe);
      }
      _filter(entry, positiveRe, negativeRe) {
        if (this._settings.unique && this._isDuplicateEntry(entry)) {
          return false;
        }
        if (this._onlyFileFilter(entry) || this._onlyDirectoryFilter(entry)) {
          return false;
        }
        if (this._isSkippedByAbsoluteNegativePatterns(entry.path, negativeRe)) {
          return false;
        }
        const filepath = this._settings.baseNameMatch ? entry.name : entry.path;
        const isDirectory = entry.dirent.isDirectory();
        const isMatched = this._isMatchToPatterns(filepath, positiveRe, isDirectory) && !this._isMatchToPatterns(entry.path, negativeRe, isDirectory);
        if (this._settings.unique && isMatched) {
          this._createIndexRecord(entry);
        }
        return isMatched;
      }
      _isDuplicateEntry(entry) {
        return this.index.has(entry.path);
      }
      _createIndexRecord(entry) {
        this.index.set(entry.path, void 0);
      }
      _onlyFileFilter(entry) {
        return this._settings.onlyFiles && !entry.dirent.isFile();
      }
      _onlyDirectoryFilter(entry) {
        return this._settings.onlyDirectories && !entry.dirent.isDirectory();
      }
      _isSkippedByAbsoluteNegativePatterns(entryPath, patternsRe) {
        if (!this._settings.absolute) {
          return false;
        }
        const fullpath = utils.path.makeAbsolute(this._settings.cwd, entryPath);
        return utils.pattern.matchAny(fullpath, patternsRe);
      }
      _isMatchToPatterns(entryPath, patternsRe, isDirectory) {
        const filepath = utils.path.removeLeadingDotSegment(entryPath);
        const isMatched = utils.pattern.matchAny(filepath, patternsRe);
        if (!isMatched && isDirectory) {
          return utils.pattern.matchAny(filepath + "/", patternsRe);
        }
        return isMatched;
      }
    };
    exports.default = EntryFilter;
  }
});

// node_modules/fast-glob/out/providers/filters/error.js
var require_error = __commonJS({
  "node_modules/fast-glob/out/providers/filters/error.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils = require_utils3();
    var ErrorFilter = class {
      constructor(_settings) {
        this._settings = _settings;
      }
      getFilter() {
        return (error7) => this._isNonFatalError(error7);
      }
      _isNonFatalError(error7) {
        return utils.errno.isEnoentCodeError(error7) || this._settings.suppressErrors;
      }
    };
    exports.default = ErrorFilter;
  }
});

// node_modules/fast-glob/out/providers/transformers/entry.js
var require_entry2 = __commonJS({
  "node_modules/fast-glob/out/providers/transformers/entry.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils = require_utils3();
    var EntryTransformer = class {
      constructor(_settings) {
        this._settings = _settings;
      }
      getTransformer() {
        return (entry) => this._transform(entry);
      }
      _transform(entry) {
        let filepath = entry.path;
        if (this._settings.absolute) {
          filepath = utils.path.makeAbsolute(this._settings.cwd, filepath);
          filepath = utils.path.unixify(filepath);
        }
        if (this._settings.markDirectories && entry.dirent.isDirectory()) {
          filepath += "/";
        }
        if (!this._settings.objectMode) {
          return filepath;
        }
        return Object.assign(Object.assign({}, entry), { path: filepath });
      }
    };
    exports.default = EntryTransformer;
  }
});

// node_modules/fast-glob/out/providers/provider.js
var require_provider = __commonJS({
  "node_modules/fast-glob/out/providers/provider.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var path10 = require("path");
    var deep_1 = require_deep();
    var entry_1 = require_entry();
    var error_1 = require_error();
    var entry_2 = require_entry2();
    var Provider = class {
      constructor(_settings) {
        this._settings = _settings;
        this.errorFilter = new error_1.default(this._settings);
        this.entryFilter = new entry_1.default(this._settings, this._getMicromatchOptions());
        this.deepFilter = new deep_1.default(this._settings, this._getMicromatchOptions());
        this.entryTransformer = new entry_2.default(this._settings);
      }
      _getRootDirectory(task) {
        return path10.resolve(this._settings.cwd, task.base);
      }
      _getReaderOptions(task) {
        const basePath = task.base === "." ? "" : task.base;
        return {
          basePath,
          pathSegmentSeparator: "/",
          concurrency: this._settings.concurrency,
          deepFilter: this.deepFilter.getFilter(basePath, task.positive, task.negative),
          entryFilter: this.entryFilter.getFilter(task.positive, task.negative),
          errorFilter: this.errorFilter.getFilter(),
          followSymbolicLinks: this._settings.followSymbolicLinks,
          fs: this._settings.fs,
          stats: this._settings.stats,
          throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
          transform: this.entryTransformer.getTransformer()
        };
      }
      _getMicromatchOptions() {
        return {
          dot: this._settings.dot,
          matchBase: this._settings.baseNameMatch,
          nobrace: !this._settings.braceExpansion,
          nocase: !this._settings.caseSensitiveMatch,
          noext: !this._settings.extglob,
          noglobstar: !this._settings.globstar,
          posix: true,
          strictSlashes: false
        };
      }
    };
    exports.default = Provider;
  }
});

// node_modules/fast-glob/out/providers/async.js
var require_async6 = __commonJS({
  "node_modules/fast-glob/out/providers/async.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var async_1 = require_async5();
    var provider_1 = require_provider();
    var ProviderAsync = class extends provider_1.default {
      constructor() {
        super(...arguments);
        this._reader = new async_1.default(this._settings);
      }
      async read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = await this.api(root, task, options);
        return entries.map((entry) => options.transform(entry));
      }
      api(root, task, options) {
        if (task.dynamic) {
          return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
      }
    };
    exports.default = ProviderAsync;
  }
});

// node_modules/fast-glob/out/providers/stream.js
var require_stream4 = __commonJS({
  "node_modules/fast-glob/out/providers/stream.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var stream_1 = require("stream");
    var stream_2 = require_stream3();
    var provider_1 = require_provider();
    var ProviderStream = class extends provider_1.default {
      constructor() {
        super(...arguments);
        this._reader = new stream_2.default(this._settings);
      }
      read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const source = this.api(root, task, options);
        const destination = new stream_1.Readable({ objectMode: true, read: () => {
        } });
        source.once("error", (error7) => destination.emit("error", error7)).on("data", (entry) => destination.emit("data", options.transform(entry))).once("end", () => destination.emit("end"));
        destination.once("close", () => source.destroy());
        return destination;
      }
      api(root, task, options) {
        if (task.dynamic) {
          return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
      }
    };
    exports.default = ProviderStream;
  }
});

// node_modules/fast-glob/out/readers/sync.js
var require_sync5 = __commonJS({
  "node_modules/fast-glob/out/readers/sync.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var fsStat = require_out();
    var fsWalk = require_out3();
    var reader_1 = require_reader2();
    var ReaderSync = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._walkSync = fsWalk.walkSync;
        this._statSync = fsStat.statSync;
      }
      dynamic(root, options) {
        return this._walkSync(root, options);
      }
      static(patterns, options) {
        const entries = [];
        for (const pattern of patterns) {
          const filepath = this._getFullEntryPath(pattern);
          const entry = this._getEntry(filepath, pattern, options);
          if (entry === null || !options.entryFilter(entry)) {
            continue;
          }
          entries.push(entry);
        }
        return entries;
      }
      _getEntry(filepath, pattern, options) {
        try {
          const stats = this._getStat(filepath);
          return this._makeEntry(stats, pattern);
        } catch (error7) {
          if (options.errorFilter(error7)) {
            return null;
          }
          throw error7;
        }
      }
      _getStat(filepath) {
        return this._statSync(filepath, this._fsStatSettings);
      }
    };
    exports.default = ReaderSync;
  }
});

// node_modules/fast-glob/out/providers/sync.js
var require_sync6 = __commonJS({
  "node_modules/fast-glob/out/providers/sync.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    var sync_1 = require_sync5();
    var provider_1 = require_provider();
    var ProviderSync = class extends provider_1.default {
      constructor() {
        super(...arguments);
        this._reader = new sync_1.default(this._settings);
      }
      read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = this.api(root, task, options);
        return entries.map(options.transform);
      }
      api(root, task, options) {
        if (task.dynamic) {
          return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
      }
    };
    exports.default = ProviderSync;
  }
});

// node_modules/fast-glob/out/settings.js
var require_settings4 = __commonJS({
  "node_modules/fast-glob/out/settings.js"(exports) {
    "use strict";
    init_shim();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;
    var fs16 = require("fs");
    var os = require("os");
    var CPU_COUNT = Math.max(os.cpus().length, 1);
    exports.DEFAULT_FILE_SYSTEM_ADAPTER = {
      lstat: fs16.lstat,
      lstatSync: fs16.lstatSync,
      stat: fs16.stat,
      statSync: fs16.statSync,
      readdir: fs16.readdir,
      readdirSync: fs16.readdirSync
    };
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.absolute = this._getValue(this._options.absolute, false);
        this.baseNameMatch = this._getValue(this._options.baseNameMatch, false);
        this.braceExpansion = this._getValue(this._options.braceExpansion, true);
        this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, true);
        this.concurrency = this._getValue(this._options.concurrency, CPU_COUNT);
        this.cwd = this._getValue(this._options.cwd, import_process.default.cwd());
        this.deep = this._getValue(this._options.deep, Infinity);
        this.dot = this._getValue(this._options.dot, false);
        this.extglob = this._getValue(this._options.extglob, true);
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, true);
        this.fs = this._getFileSystemMethods(this._options.fs);
        this.globstar = this._getValue(this._options.globstar, true);
        this.ignore = this._getValue(this._options.ignore, []);
        this.markDirectories = this._getValue(this._options.markDirectories, false);
        this.objectMode = this._getValue(this._options.objectMode, false);
        this.onlyDirectories = this._getValue(this._options.onlyDirectories, false);
        this.onlyFiles = this._getValue(this._options.onlyFiles, true);
        this.stats = this._getValue(this._options.stats, false);
        this.suppressErrors = this._getValue(this._options.suppressErrors, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, false);
        this.unique = this._getValue(this._options.unique, true);
        if (this.onlyDirectories) {
          this.onlyFiles = false;
        }
        if (this.stats) {
          this.objectMode = true;
        }
      }
      _getValue(option, value) {
        return option === void 0 ? value : option;
      }
      _getFileSystemMethods(methods = {}) {
        return Object.assign(Object.assign({}, exports.DEFAULT_FILE_SYSTEM_ADAPTER), methods);
      }
    };
    exports.default = Settings;
  }
});

// node_modules/fast-glob/out/index.js
var require_out4 = __commonJS({
  "node_modules/fast-glob/out/index.js"(exports, module2) {
    "use strict";
    init_shim();
    var taskManager = require_tasks();
    var patternManager = require_patterns();
    var async_1 = require_async6();
    var stream_1 = require_stream4();
    var sync_1 = require_sync6();
    var settings_1 = require_settings4();
    var utils = require_utils3();
    async function FastGlob(source, options) {
      assertPatternsInput(source);
      const works = getWorks(source, async_1.default, options);
      const result = await Promise.all(works);
      return utils.array.flatten(result);
    }
    (function(FastGlob2) {
      function sync(source, options) {
        assertPatternsInput(source);
        const works = getWorks(source, sync_1.default, options);
        return utils.array.flatten(works);
      }
      FastGlob2.sync = sync;
      function stream(source, options) {
        assertPatternsInput(source);
        const works = getWorks(source, stream_1.default, options);
        return utils.stream.merge(works);
      }
      FastGlob2.stream = stream;
      function generateTasks(source, options) {
        assertPatternsInput(source);
        const patterns = patternManager.transform([].concat(source));
        const settings = new settings_1.default(options);
        return taskManager.generate(patterns, settings);
      }
      FastGlob2.generateTasks = generateTasks;
      function isDynamicPattern(source, options) {
        assertPatternsInput(source);
        const settings = new settings_1.default(options);
        return utils.pattern.isDynamicPattern(source, settings);
      }
      FastGlob2.isDynamicPattern = isDynamicPattern;
      function escapePath(source) {
        assertPatternsInput(source);
        return utils.path.escape(source);
      }
      FastGlob2.escapePath = escapePath;
    })(FastGlob || (FastGlob = {}));
    function getWorks(source, _Provider, options) {
      const patterns = patternManager.transform([].concat(source));
      const settings = new settings_1.default(options);
      const tasks = taskManager.generate(patterns, settings);
      const provider = new _Provider(settings);
      return tasks.map(provider.read, provider);
    }
    function assertPatternsInput(input) {
      const source = [].concat(input);
      const isValidSource = source.every((item) => utils.string.isString(item) && !utils.string.isEmpty(item));
      if (!isValidSource) {
        throw new TypeError("Patterns must be a string (non empty) or an array of strings");
      }
    }
    module2.exports = FastGlob;
  }
});

// node_modules/postgres-array/index.js
var require_postgres_array = __commonJS({
  "node_modules/postgres-array/index.js"(exports) {
    "use strict";
    init_shim();
    exports.parse = function(source, transform) {
      return new ArrayParser(source, transform).parse();
    };
    var ArrayParser = class {
      constructor(source, transform) {
        this.source = source;
        this.transform = transform || identity;
        this.position = 0;
        this.entries = [];
        this.recorded = [];
        this.dimension = 0;
      }
      isEof() {
        return this.position >= this.source.length;
      }
      nextCharacter() {
        var character = this.source[this.position++];
        if (character === "\\") {
          return {
            value: this.source[this.position++],
            escaped: true
          };
        }
        return {
          value: character,
          escaped: false
        };
      }
      record(character) {
        this.recorded.push(character);
      }
      newEntry(includeEmpty) {
        var entry;
        if (this.recorded.length > 0 || includeEmpty) {
          entry = this.recorded.join("");
          if (entry === "NULL" && !includeEmpty) {
            entry = null;
          }
          if (entry !== null)
            entry = this.transform(entry);
          this.entries.push(entry);
          this.recorded = [];
        }
      }
      consumeDimensions() {
        if (this.source[0] === "[") {
          while (!this.isEof()) {
            var char = this.nextCharacter();
            if (char.value === "=")
              break;
          }
        }
      }
      parse(nested) {
        var character, parser, quote;
        this.consumeDimensions();
        while (!this.isEof()) {
          character = this.nextCharacter();
          if (character.value === "{" && !quote) {
            this.dimension++;
            if (this.dimension > 1) {
              parser = new ArrayParser(this.source.substr(this.position - 1), this.transform);
              this.entries.push(parser.parse(true));
              this.position += parser.position - 2;
            }
          } else if (character.value === "}" && !quote) {
            this.dimension--;
            if (!this.dimension) {
              this.newEntry();
              if (nested)
                return this.entries;
            }
          } else if (character.value === '"' && !character.escaped) {
            if (quote)
              this.newEntry(true);
            quote = !quote;
          } else if (character.value === "," && !quote) {
            this.newEntry();
          } else {
            this.record(character.value);
          }
        }
        if (this.dimension !== 0) {
          throw new Error("array dimension not balanced");
        }
        return this.entries;
      }
    };
    function identity(value) {
      return value;
    }
  }
});

// node_modules/pg-types/lib/arrayParser.js
var require_arrayParser = __commonJS({
  "node_modules/pg-types/lib/arrayParser.js"(exports, module2) {
    init_shim();
    var array = require_postgres_array();
    module2.exports = {
      create: function(source, transform) {
        return {
          parse: function() {
            return array.parse(source, transform);
          }
        };
      }
    };
  }
});

// node_modules/postgres-date/index.js
var require_postgres_date = __commonJS({
  "node_modules/postgres-date/index.js"(exports, module2) {
    "use strict";
    init_shim();
    var DATE_TIME = /(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/;
    var DATE = /^(\d{1,})-(\d{2})-(\d{2})( BC)?$/;
    var TIME_ZONE = /([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/;
    var INFINITY = /^-?infinity$/;
    module2.exports = function parseDate2(isoDate) {
      if (INFINITY.test(isoDate)) {
        return Number(isoDate.replace("i", "I"));
      }
      var matches = DATE_TIME.exec(isoDate);
      if (!matches) {
        return getDate(isoDate) || null;
      }
      var isBC = !!matches[8];
      var year = parseInt(matches[1], 10);
      if (isBC) {
        year = bcYearToNegativeYear(year);
      }
      var month = parseInt(matches[2], 10) - 1;
      var day = matches[3];
      var hour = parseInt(matches[4], 10);
      var minute = parseInt(matches[5], 10);
      var second = parseInt(matches[6], 10);
      var ms = matches[7];
      ms = ms ? 1e3 * parseFloat(ms) : 0;
      var date;
      var offset = timeZoneOffset(isoDate);
      if (offset != null) {
        date = new Date(Date.UTC(year, month, day, hour, minute, second, ms));
        if (is0To99(year)) {
          date.setUTCFullYear(year);
        }
        if (offset !== 0) {
          date.setTime(date.getTime() - offset);
        }
      } else {
        date = new Date(year, month, day, hour, minute, second, ms);
        if (is0To99(year)) {
          date.setFullYear(year);
        }
      }
      return date;
    };
    function getDate(isoDate) {
      var matches = DATE.exec(isoDate);
      if (!matches) {
        return;
      }
      var year = parseInt(matches[1], 10);
      var isBC = !!matches[4];
      if (isBC) {
        year = bcYearToNegativeYear(year);
      }
      var month = parseInt(matches[2], 10) - 1;
      var day = matches[3];
      var date = new Date(year, month, day);
      if (is0To99(year)) {
        date.setFullYear(year);
      }
      return date;
    }
    function timeZoneOffset(isoDate) {
      if (isoDate.endsWith("+00")) {
        return 0;
      }
      var zone = TIME_ZONE.exec(isoDate.split(" ")[1]);
      if (!zone)
        return;
      var type = zone[1];
      if (type === "Z") {
        return 0;
      }
      var sign3 = type === "-" ? -1 : 1;
      var offset = parseInt(zone[2], 10) * 3600 + parseInt(zone[3] || 0, 10) * 60 + parseInt(zone[4] || 0, 10);
      return offset * sign3 * 1e3;
    }
    function bcYearToNegativeYear(year) {
      return -(year - 1);
    }
    function is0To99(num3) {
      return num3 >= 0 && num3 < 100;
    }
  }
});

// node_modules/xtend/mutable.js
var require_mutable = __commonJS({
  "node_modules/xtend/mutable.js"(exports, module2) {
    init_shim();
    module2.exports = extend;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function extend(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    }
  }
});

// node_modules/postgres-interval/index.js
var require_postgres_interval = __commonJS({
  "node_modules/postgres-interval/index.js"(exports, module2) {
    "use strict";
    init_shim();
    var extend = require_mutable();
    module2.exports = PostgresInterval;
    function PostgresInterval(raw) {
      if (!(this instanceof PostgresInterval)) {
        return new PostgresInterval(raw);
      }
      extend(this, parse2(raw));
    }
    var properties = ["seconds", "minutes", "hours", "days", "months", "years"];
    PostgresInterval.prototype.toPostgres = function() {
      var filtered = properties.filter(this.hasOwnProperty, this);
      if (this.milliseconds && filtered.indexOf("seconds") < 0) {
        filtered.push("seconds");
      }
      if (filtered.length === 0)
        return "0";
      return filtered.map(function(property) {
        var value = this[property] || 0;
        if (property === "seconds" && this.milliseconds) {
          value = (value + this.milliseconds / 1e3).toFixed(6).replace(/\.?0+$/, "");
        }
        return value + " " + property;
      }, this).join(" ");
    };
    var propertiesISOEquivalent = {
      years: "Y",
      months: "M",
      days: "D",
      hours: "H",
      minutes: "M",
      seconds: "S"
    };
    var dateProperties = ["years", "months", "days"];
    var timeProperties = ["hours", "minutes", "seconds"];
    PostgresInterval.prototype.toISOString = PostgresInterval.prototype.toISO = function() {
      var datePart = dateProperties.map(buildProperty, this).join("");
      var timePart = timeProperties.map(buildProperty, this).join("");
      return "P" + datePart + "T" + timePart;
      function buildProperty(property) {
        var value = this[property] || 0;
        if (property === "seconds" && this.milliseconds) {
          value = (value + this.milliseconds / 1e3).toFixed(6).replace(/0+$/, "");
        }
        return value + propertiesISOEquivalent[property];
      }
    };
    var NUMBER = "([+-]?\\d+)";
    var YEAR = NUMBER + "\\s+years?";
    var MONTH = NUMBER + "\\s+mons?";
    var DAY = NUMBER + "\\s+days?";
    var TIME = "([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?";
    var INTERVAL = new RegExp([YEAR, MONTH, DAY, TIME].map(function(regexString) {
      return "(" + regexString + ")?";
    }).join("\\s*"));
    var positions = {
      years: 2,
      months: 4,
      days: 6,
      hours: 9,
      minutes: 10,
      seconds: 11,
      milliseconds: 12
    };
    var negatives = ["hours", "minutes", "seconds", "milliseconds"];
    function parseMilliseconds(fraction) {
      var microseconds = fraction + "000000".slice(fraction.length);
      return parseInt(microseconds, 10) / 1e3;
    }
    function parse2(interval) {
      if (!interval)
        return {};
      var matches = INTERVAL.exec(interval);
      var isNegative = matches[8] === "-";
      return Object.keys(positions).reduce(function(parsed, property) {
        var position = positions[property];
        var value = matches[position];
        if (!value)
          return parsed;
        value = property === "milliseconds" ? parseMilliseconds(value) : parseInt(value, 10);
        if (!value)
          return parsed;
        if (isNegative && ~negatives.indexOf(property)) {
          value *= -1;
        }
        parsed[property] = value;
        return parsed;
      }, {});
    }
  }
});

// node_modules/postgres-bytea/index.js
var require_postgres_bytea = __commonJS({
  "node_modules/postgres-bytea/index.js"(exports, module2) {
    "use strict";
    init_shim();
    module2.exports = function parseBytea(input) {
      if (/^\\x/.test(input)) {
        return new import_buffer.Buffer(input.substr(2), "hex");
      }
      var output = "";
      var i = 0;
      while (i < input.length) {
        if (input[i] !== "\\") {
          output += input[i];
          ++i;
        } else {
          if (/[0-7]{3}/.test(input.substr(i + 1, 3))) {
            output += String.fromCharCode(parseInt(input.substr(i + 1, 3), 8));
            i += 4;
          } else {
            var backslashes = 1;
            while (i + backslashes < input.length && input[i + backslashes] === "\\") {
              backslashes++;
            }
            for (var k = 0; k < Math.floor(backslashes / 2); ++k) {
              output += "\\";
            }
            i += Math.floor(backslashes / 2) * 2;
          }
        }
      }
      return new import_buffer.Buffer(output, "binary");
    };
  }
});

// node_modules/pg-types/lib/textParsers.js
var require_textParsers = __commonJS({
  "node_modules/pg-types/lib/textParsers.js"(exports, module2) {
    init_shim();
    var array = require_postgres_array();
    var arrayParser = require_arrayParser();
    var parseDate2 = require_postgres_date();
    var parseInterval = require_postgres_interval();
    var parseByteA = require_postgres_bytea();
    function allowNull(fn) {
      return function nullAllowed(value) {
        if (value === null)
          return value;
        return fn(value);
      };
    }
    function parseBool(value) {
      if (value === null)
        return value;
      return value === "TRUE" || value === "t" || value === "true" || value === "y" || value === "yes" || value === "on" || value === "1";
    }
    function parseBoolArray(value) {
      if (!value)
        return null;
      return array.parse(value, parseBool);
    }
    function parseBaseTenInt(string) {
      return parseInt(string, 10);
    }
    function parseIntegerArray(value) {
      if (!value)
        return null;
      return array.parse(value, allowNull(parseBaseTenInt));
    }
    function parseBigIntegerArray(value) {
      if (!value)
        return null;
      return array.parse(value, allowNull(function(entry) {
        return parseBigInteger(entry).trim();
      }));
    }
    var parsePointArray = function(value) {
      if (!value) {
        return null;
      }
      var p = arrayParser.create(value, function(entry) {
        if (entry !== null) {
          entry = parsePoint(entry);
        }
        return entry;
      });
      return p.parse();
    };
    var parseFloatArray = function(value) {
      if (!value) {
        return null;
      }
      var p = arrayParser.create(value, function(entry) {
        if (entry !== null) {
          entry = parseFloat(entry);
        }
        return entry;
      });
      return p.parse();
    };
    var parseStringArray = function(value) {
      if (!value) {
        return null;
      }
      var p = arrayParser.create(value);
      return p.parse();
    };
    var parseDateArray = function(value) {
      if (!value) {
        return null;
      }
      var p = arrayParser.create(value, function(entry) {
        if (entry !== null) {
          entry = parseDate2(entry);
        }
        return entry;
      });
      return p.parse();
    };
    var parseIntervalArray = function(value) {
      if (!value) {
        return null;
      }
      var p = arrayParser.create(value, function(entry) {
        if (entry !== null) {
          entry = parseInterval(entry);
        }
        return entry;
      });
      return p.parse();
    };
    var parseByteAArray = function(value) {
      if (!value) {
        return null;
      }
      return array.parse(value, allowNull(parseByteA));
    };
    var parseInteger = function(value) {
      return parseInt(value, 10);
    };
    var parseBigInteger = function(value) {
      var valStr = String(value);
      if (/^\d+$/.test(valStr)) {
        return valStr;
      }
      return value;
    };
    var parseJsonArray = function(value) {
      if (!value) {
        return null;
      }
      return array.parse(value, allowNull(JSON.parse));
    };
    var parsePoint = function(value) {
      if (value[0] !== "(") {
        return null;
      }
      value = value.substring(1, value.length - 1).split(",");
      return {
        x: parseFloat(value[0]),
        y: parseFloat(value[1])
      };
    };
    var parseCircle = function(value) {
      if (value[0] !== "<" && value[1] !== "(") {
        return null;
      }
      var point = "(";
      var radius = "";
      var pointParsed = false;
      for (var i = 2; i < value.length - 1; i++) {
        if (!pointParsed) {
          point += value[i];
        }
        if (value[i] === ")") {
          pointParsed = true;
          continue;
        } else if (!pointParsed) {
          continue;
        }
        if (value[i] === ",") {
          continue;
        }
        radius += value[i];
      }
      var result = parsePoint(point);
      result.radius = parseFloat(radius);
      return result;
    };
    var init = function(register) {
      register(20, parseBigInteger);
      register(21, parseInteger);
      register(23, parseInteger);
      register(26, parseInteger);
      register(700, parseFloat);
      register(701, parseFloat);
      register(16, parseBool);
      register(1082, parseDate2);
      register(1114, parseDate2);
      register(1184, parseDate2);
      register(600, parsePoint);
      register(651, parseStringArray);
      register(718, parseCircle);
      register(1e3, parseBoolArray);
      register(1001, parseByteAArray);
      register(1005, parseIntegerArray);
      register(1007, parseIntegerArray);
      register(1028, parseIntegerArray);
      register(1016, parseBigIntegerArray);
      register(1017, parsePointArray);
      register(1021, parseFloatArray);
      register(1022, parseFloatArray);
      register(1231, parseFloatArray);
      register(1014, parseStringArray);
      register(1015, parseStringArray);
      register(1008, parseStringArray);
      register(1009, parseStringArray);
      register(1040, parseStringArray);
      register(1041, parseStringArray);
      register(1115, parseDateArray);
      register(1182, parseDateArray);
      register(1185, parseDateArray);
      register(1186, parseInterval);
      register(1187, parseIntervalArray);
      register(17, parseByteA);
      register(114, JSON.parse.bind(JSON));
      register(3802, JSON.parse.bind(JSON));
      register(199, parseJsonArray);
      register(3807, parseJsonArray);
      register(3907, parseStringArray);
      register(2951, parseStringArray);
      register(791, parseStringArray);
      register(1183, parseStringArray);
      register(1270, parseStringArray);
    };
    module2.exports = {
      init
    };
  }
});

// node_modules/pg-int8/index.js
var require_pg_int8 = __commonJS({
  "node_modules/pg-int8/index.js"(exports, module2) {
    "use strict";
    init_shim();
    var BASE = 1e6;
    function readInt8(buffer) {
      var high = buffer.readInt32BE(0);
      var low = buffer.readUInt32BE(4);
      var sign3 = "";
      if (high < 0) {
        high = ~high + (low === 0);
        low = ~low + 1 >>> 0;
        sign3 = "-";
      }
      var result = "";
      var carry;
      var t;
      var digits;
      var pad;
      var l;
      var i;
      {
        carry = high % BASE;
        high = high / BASE >>> 0;
        t = 4294967296 * carry + low;
        low = t / BASE >>> 0;
        digits = "" + (t - BASE * low);
        if (low === 0 && high === 0) {
          return sign3 + digits + result;
        }
        pad = "";
        l = 6 - digits.length;
        for (i = 0; i < l; i++) {
          pad += "0";
        }
        result = pad + digits + result;
      }
      {
        carry = high % BASE;
        high = high / BASE >>> 0;
        t = 4294967296 * carry + low;
        low = t / BASE >>> 0;
        digits = "" + (t - BASE * low);
        if (low === 0 && high === 0) {
          return sign3 + digits + result;
        }
        pad = "";
        l = 6 - digits.length;
        for (i = 0; i < l; i++) {
          pad += "0";
        }
        result = pad + digits + result;
      }
      {
        carry = high % BASE;
        high = high / BASE >>> 0;
        t = 4294967296 * carry + low;
        low = t / BASE >>> 0;
        digits = "" + (t - BASE * low);
        if (low === 0 && high === 0) {
          return sign3 + digits + result;
        }
        pad = "";
        l = 6 - digits.length;
        for (i = 0; i < l; i++) {
          pad += "0";
        }
        result = pad + digits + result;
      }
      {
        carry = high % BASE;
        t = 4294967296 * carry + low;
        digits = "" + t % BASE;
        return sign3 + digits + result;
      }
    }
    module2.exports = readInt8;
  }
});

// node_modules/pg-types/lib/binaryParsers.js
var require_binaryParsers = __commonJS({
  "node_modules/pg-types/lib/binaryParsers.js"(exports, module2) {
    init_shim();
    var parseInt64 = require_pg_int8();
    var parseBits = function(data, bits, offset, invert, callback) {
      offset = offset || 0;
      invert = invert || false;
      callback = callback || function(lastValue, newValue, bits2) {
        return lastValue * Math.pow(2, bits2) + newValue;
      };
      var offsetBytes = offset >> 3;
      var inv = function(value) {
        if (invert) {
          return ~value & 255;
        }
        return value;
      };
      var mask = 255;
      var firstBits = 8 - offset % 8;
      if (bits < firstBits) {
        mask = 255 << 8 - bits & 255;
        firstBits = bits;
      }
      if (offset) {
        mask = mask >> offset % 8;
      }
      var result = 0;
      if (offset % 8 + bits >= 8) {
        result = callback(0, inv(data[offsetBytes]) & mask, firstBits);
      }
      var bytes = bits + offset >> 3;
      for (var i = offsetBytes + 1; i < bytes; i++) {
        result = callback(result, inv(data[i]), 8);
      }
      var lastBits = (bits + offset) % 8;
      if (lastBits > 0) {
        result = callback(result, inv(data[bytes]) >> 8 - lastBits, lastBits);
      }
      return result;
    };
    var parseFloatFromBits = function(data, precisionBits, exponentBits) {
      var bias = Math.pow(2, exponentBits - 1) - 1;
      var sign3 = parseBits(data, 1);
      var exponent = parseBits(data, exponentBits, 1);
      if (exponent === 0) {
        return 0;
      }
      var precisionBitsCounter = 1;
      var parsePrecisionBits = function(lastValue, newValue, bits) {
        if (lastValue === 0) {
          lastValue = 1;
        }
        for (var i = 1; i <= bits; i++) {
          precisionBitsCounter /= 2;
          if ((newValue & 1 << bits - i) > 0) {
            lastValue += precisionBitsCounter;
          }
        }
        return lastValue;
      };
      var mantissa = parseBits(data, precisionBits, exponentBits + 1, false, parsePrecisionBits);
      if (exponent == Math.pow(2, exponentBits + 1) - 1) {
        if (mantissa === 0) {
          return sign3 === 0 ? Infinity : -Infinity;
        }
        return NaN;
      }
      return (sign3 === 0 ? 1 : -1) * Math.pow(2, exponent - bias) * mantissa;
    };
    var parseInt16 = function(value) {
      if (parseBits(value, 1) == 1) {
        return -1 * (parseBits(value, 15, 1, true) + 1);
      }
      return parseBits(value, 15, 1);
    };
    var parseInt32 = function(value) {
      if (parseBits(value, 1) == 1) {
        return -1 * (parseBits(value, 31, 1, true) + 1);
      }
      return parseBits(value, 31, 1);
    };
    var parseFloat32 = function(value) {
      return parseFloatFromBits(value, 23, 8);
    };
    var parseFloat64 = function(value) {
      return parseFloatFromBits(value, 52, 11);
    };
    var parseNumeric = function(value) {
      var sign3 = parseBits(value, 16, 32);
      if (sign3 == 49152) {
        return NaN;
      }
      var weight = Math.pow(1e4, parseBits(value, 16, 16));
      var result = 0;
      var digits = [];
      var ndigits = parseBits(value, 16);
      for (var i = 0; i < ndigits; i++) {
        result += parseBits(value, 16, 64 + 16 * i) * weight;
        weight /= 1e4;
      }
      var scale = Math.pow(10, parseBits(value, 16, 48));
      return (sign3 === 0 ? 1 : -1) * Math.round(result * scale) / scale;
    };
    var parseDate2 = function(isUTC, value) {
      var sign3 = parseBits(value, 1);
      var rawValue = parseBits(value, 63, 1);
      var result = new Date((sign3 === 0 ? 1 : -1) * rawValue / 1e3 + 9466848e5);
      if (!isUTC) {
        result.setTime(result.getTime() + result.getTimezoneOffset() * 6e4);
      }
      result.usec = rawValue % 1e3;
      result.getMicroSeconds = function() {
        return this.usec;
      };
      result.setMicroSeconds = function(value2) {
        this.usec = value2;
      };
      result.getUTCMicroSeconds = function() {
        return this.usec;
      };
      return result;
    };
    var parseArray = function(value) {
      var dim = parseBits(value, 32);
      var flags = parseBits(value, 32, 32);
      var elementType = parseBits(value, 32, 64);
      var offset = 96;
      var dims = [];
      for (var i = 0; i < dim; i++) {
        dims[i] = parseBits(value, 32, offset);
        offset += 32;
        offset += 32;
      }
      var parseElement = function(elementType2) {
        var length = parseBits(value, 32, offset);
        offset += 32;
        if (length == 4294967295) {
          return null;
        }
        var result;
        if (elementType2 == 23 || elementType2 == 20) {
          result = parseBits(value, length * 8, offset);
          offset += length * 8;
          return result;
        } else if (elementType2 == 25) {
          result = value.toString(this.encoding, offset >> 3, (offset += length << 3) >> 3);
          return result;
        } else {
          console.log("ERROR: ElementType not implemented: " + elementType2);
        }
      };
      var parse2 = function(dimension, elementType2) {
        var array = [];
        var i2;
        if (dimension.length > 1) {
          var count = dimension.shift();
          for (i2 = 0; i2 < count; i2++) {
            array[i2] = parse2(dimension, elementType2);
          }
          dimension.unshift(count);
        } else {
          for (i2 = 0; i2 < dimension[0]; i2++) {
            array[i2] = parseElement(elementType2);
          }
        }
        return array;
      };
      return parse2(dims, elementType);
    };
    var parseText = function(value) {
      return value.toString("utf8");
    };
    var parseBool = function(value) {
      if (value === null)
        return null;
      return parseBits(value, 8) > 0;
    };
    var init = function(register) {
      register(20, parseInt64);
      register(21, parseInt16);
      register(23, parseInt32);
      register(26, parseInt32);
      register(1700, parseNumeric);
      register(700, parseFloat32);
      register(701, parseFloat64);
      register(16, parseBool);
      register(1114, parseDate2.bind(null, false));
      register(1184, parseDate2.bind(null, true));
      register(1e3, parseArray);
      register(1007, parseArray);
      register(1016, parseArray);
      register(1008, parseArray);
      register(1009, parseArray);
      register(25, parseText);
    };
    module2.exports = {
      init
    };
  }
});

// node_modules/pg-types/lib/builtins.js
var require_builtins = __commonJS({
  "node_modules/pg-types/lib/builtins.js"(exports, module2) {
    init_shim();
    module2.exports = {
      BOOL: 16,
      BYTEA: 17,
      CHAR: 18,
      INT8: 20,
      INT2: 21,
      INT4: 23,
      REGPROC: 24,
      TEXT: 25,
      OID: 26,
      TID: 27,
      XID: 28,
      CID: 29,
      JSON: 114,
      XML: 142,
      PG_NODE_TREE: 194,
      SMGR: 210,
      PATH: 602,
      POLYGON: 604,
      CIDR: 650,
      FLOAT4: 700,
      FLOAT8: 701,
      ABSTIME: 702,
      RELTIME: 703,
      TINTERVAL: 704,
      CIRCLE: 718,
      MACADDR8: 774,
      MONEY: 790,
      MACADDR: 829,
      INET: 869,
      ACLITEM: 1033,
      BPCHAR: 1042,
      VARCHAR: 1043,
      DATE: 1082,
      TIME: 1083,
      TIMESTAMP: 1114,
      TIMESTAMPTZ: 1184,
      INTERVAL: 1186,
      TIMETZ: 1266,
      BIT: 1560,
      VARBIT: 1562,
      NUMERIC: 1700,
      REFCURSOR: 1790,
      REGPROCEDURE: 2202,
      REGOPER: 2203,
      REGOPERATOR: 2204,
      REGCLASS: 2205,
      REGTYPE: 2206,
      UUID: 2950,
      TXID_SNAPSHOT: 2970,
      PG_LSN: 3220,
      PG_NDISTINCT: 3361,
      PG_DEPENDENCIES: 3402,
      TSVECTOR: 3614,
      TSQUERY: 3615,
      GTSVECTOR: 3642,
      REGCONFIG: 3734,
      REGDICTIONARY: 3769,
      JSONB: 3802,
      REGNAMESPACE: 4089,
      REGROLE: 4096
    };
  }
});

// node_modules/pg-types/index.js
var require_pg_types = __commonJS({
  "node_modules/pg-types/index.js"(exports) {
    init_shim();
    var textParsers = require_textParsers();
    var binaryParsers = require_binaryParsers();
    var arrayParser = require_arrayParser();
    var builtinTypes = require_builtins();
    exports.getTypeParser = getTypeParser;
    exports.setTypeParser = setTypeParser;
    exports.arrayParser = arrayParser;
    exports.builtins = builtinTypes;
    var typeParsers = {
      text: {},
      binary: {}
    };
    function noParse(val) {
      return String(val);
    }
    function getTypeParser(oid, format) {
      format = format || "text";
      if (!typeParsers[format]) {
        return noParse;
      }
      return typeParsers[format][oid] || noParse;
    }
    function setTypeParser(oid, format, parseFn) {
      if (typeof format == "function") {
        parseFn = format;
        format = "text";
      }
      typeParsers[format][oid] = parseFn;
    }
    textParsers.init(function(oid, converter) {
      typeParsers.text[oid] = converter;
    });
    binaryParsers.init(function(oid, converter) {
      typeParsers.binary[oid] = converter;
    });
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ALLOWED_VAULT_VARIABLES: () => ALLOWED_VAULT_VARIABLES,
  AskUI: () => AskUI,
  BackendPlugin: () => BackendPlugin,
  BadState: () => BadState,
  BookkeeperImporter: () => BookkeeperImporter,
  CLI: () => CLI,
  CLIRunner: () => CLIRunner,
  DB: () => DB,
  DataPlugin: () => DataPlugin,
  DatabaseError: () => DatabaseError,
  EnvironmentVault: () => EnvironmentVault,
  Exporter: () => Exporter,
  GitRepo: () => GitRepo,
  ISPDemoServer: () => ISPDemoServer,
  ImportPlugin: () => ImportPlugin,
  InvalidArgument: () => InvalidArgument,
  InvalidFile: () => InvalidFile,
  NotFound: () => NotFound,
  NotImplemented: () => NotImplemented,
  Password: () => Password,
  Process: () => Process,
  ProcessFile: () => ProcessFile,
  ProcessHandler: () => ProcessHandler,
  ProcessStep: () => ProcessStep,
  ProcessingError: () => ProcessingError,
  ProcessingSystem: () => ProcessingSystem,
  ReportPlugin: () => ReportPlugin,
  SchemePlugin: () => SchemePlugin,
  ServicePlugin: () => ServicePlugin,
  SystemError: () => SystemError,
  TasenorExporter: () => TasenorExporter,
  TextFileProcessHandler: () => TextFileProcessHandler,
  TilitinExporter: () => TilitinExporter,
  ToolPlugin: () => ToolPlugin,
  TransactionImportHandler: () => TransactionImportHandler,
  TransactionRules: () => TransactionRules,
  TransactionUI: () => TransactionUI,
  TransferAnalyzer: () => TransferAnalyzer,
  Vault: () => Vault,
  cleanUrl: () => cleanUrl,
  cli: () => cli,
  createUuid: () => createUuid,
  data2csv: () => data2csv,
  defaultConnector: () => defaultConnector,
  getVault: () => getVault,
  isAskUI: () => isAskUI,
  isDevelopment: () => isDevelopment,
  isProduction: () => isProduction,
  isTransactionImportConnector: () => isTransactionImportConnector,
  nodeEnv: () => nodeEnv,
  plugins: () => plugins,
  randomString: () => randomString,
  router: () => router,
  system: () => system,
  systemPiped: () => systemPiped,
  tasenorFinalStack: () => tasenorFinalStack,
  tasenorInitialStack: () => tasenorInitialStack,
  tasenorStack: () => tasenorStack,
  tokens: () => tokens,
  vault: () => vault
});
module.exports = __toCommonJS(src_exports);
init_shim();

// src/cli.ts
init_shim();
var import_readline = __toESM(require("readline"));
var import_argparse = require("argparse");
var import_tasenor_common14 = require("@dataplug/tasenor-common");
var import_clone2 = __toESM(require_clone());

// src/commands/db.ts
init_shim();
var import_tasenor_common = require("@dataplug/tasenor-common");
var import_fs2 = __toESM(require("fs"));

// src/commands/index.ts
init_shim();
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_form_data = __toESM(require("form-data"));
var Command = class {
  constructor(cli2) {
    this.cli = cli2;
  }
  get verbose() {
    return !!this.args.verbose;
  }
  get debug() {
    return !!this.args.debug;
  }
  addArguments(parser) {
  }
  setArgs(args) {
    this.args = args;
  }
  print(data) {
    throw new Error(`Class ${this.constructor.name} does not implement print().`);
  }
  out(prefix, data) {
    if (this.args.json) {
      console.log(JSON.stringify(data, null, 2));
    } else {
      if (!this.verbose) {
        try {
          this.print(data);
          return;
        } catch (err) {
          if (!/does not implement print/.test(`${err}`)) {
            throw err;
          }
        }
      }
      const print = (prefix2, obj) => {
        if (typeof obj === "object") {
          if (obj === null) {
            console.log(`${prefix2} = null`);
          } else if (obj instanceof Array) {
            for (let i = 0; i < obj.length; i++) {
              console.log(`${prefix2}[${i}]`);
              print(`  ${prefix2}[${i}]`, obj[i]);
            }
          } else {
            for (const key of Object.keys(obj)) {
              print(`  ${prefix2}.${key}`, obj[key]);
            }
          }
        } else {
          console.log(`${prefix2} =`, obj);
        }
      };
      print(prefix, data);
    }
  }
  async run() {
    throw new Error(`A command ${this.constructor.name} does not implement run().`);
  }
  formForFile(filePath) {
    const form = new import_form_data.default();
    const buf = import_fs.default.readFileSync(filePath);
    form.append("file", buf, import_path.default.basename(filePath));
    return form;
  }
  async get(api) {
    await this.cli.login();
    const resp = await this.cli.request("GET", api);
    if (!resp.success) {
      throw new Error(`Call to GET ${api} failed: ${JSON.stringify(resp)}`);
    }
    return resp.data;
  }
  async getUi(api) {
    await this.cli.login();
    const resp = await this.cli.requestUi("GET", api);
    if (!resp.success) {
      throw new Error(`Call to GET UI ${api} failed: ${JSON.stringify(resp)}`);
    }
    return resp.data;
  }
  async delete(api) {
    await this.cli.login();
    const resp = await this.cli.request("DELETE", api);
    if (!resp.success) {
      throw new Error(`Call to DELETE ${api} failed: ${JSON.stringify(resp)}`);
    }
    return resp.data;
  }
  async deleteUi(api, args = void 0) {
    await this.cli.login();
    const resp = await this.cli.requestUi("DELETE", api, args);
    if (!resp.success) {
      throw new Error(`Call to DELETE UI ${api} failed: ${JSON.stringify(resp)}`);
    }
    return resp.data;
  }
  async patch(api, data) {
    await this.cli.login();
    const resp = await this.cli.request("PATCH", api, data);
    if (!resp.success) {
      throw new Error(`Call to PATCH ${api} failed: ${JSON.stringify(resp)}`);
    }
    return resp.data;
  }
  async post(api, data) {
    await this.cli.login();
    const resp = await this.cli.request("POST", api, data);
    if (!resp.success) {
      throw new Error(`Call to POST ${api} failed: ${JSON.stringify(resp)}`);
    }
    return resp.data;
  }
  async postUi(api, data) {
    await this.cli.login();
    const resp = await this.cli.requestUi("POST", api, data);
    if (!resp.success) {
      throw new Error(`Call to POST UI ${api} failed: ${JSON.stringify(resp)}`);
    }
    return resp.data;
  }
  async postUpload(api, filePath) {
    const form = this.formForFile(filePath);
    return this.post(api, form);
  }
  async runBy(op) {
    const cmd = this.args[op];
    if (!cmd) {
      this.help();
      return;
    }
    if (typeof cmd !== "string") {
      throw new Error(`Invalid operation argument ${JSON.stringify(cmd)}.`);
    }
    if (!this[cmd]) {
      console.log(this[cmd]);
      throw new Error(`There is no member function '${cmd}' in command class '${this.constructor.name}'.`);
    }
    await this[cmd]();
  }
  str(arg) {
    if (arg === null || arg === void 0) {
      return "";
    }
    if (typeof arg === "string") {
      return arg;
    }
    return arg[0];
  }
  num(arg) {
    if (arg === null || arg === void 0) {
      return 0;
    }
    return parseFloat(this.str(arg));
  }
  async periodId(db, periodArg) {
    if (!db) {
      throw new Error(`Invalid database argument ${JSON.stringify(db)}`);
    }
    const period = this.str(periodArg);
    if (!period) {
      throw new Error(`Invalid period argument ${JSON.stringify(period)}`);
    }
    let periods = await this.get(`/db/${db}/period`);
    if (/^\d{4}$/.test(period)) {
      const date = `${period}-06-15`;
      periods = periods.filter((p) => p.start_date <= date && date <= p.end_date);
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(period)) {
      periods = periods.filter((p) => p.start_date <= period && period <= p.end_date);
    } else if (/^\d+$/.test(period)) {
      const id = parseInt(period);
      periods = periods.filter((p) => p.id === id);
    } else {
      throw new Error(`Invalid period argument ${JSON.stringify(period)}`);
    }
    if (periods.length > 1) {
      throw new Error(`Too many periods match to ${JSON.stringify(period)}`);
    }
    if (!periods.length) {
      throw new Error(`No periods found matching ${JSON.stringify(period)}`);
    }
    return periods[0].id;
  }
  async singlePeriod(dbArg) {
    const period = await this.get(`/db/${this.str(dbArg)}/period`);
    if (period.length < 1) {
      throw new Error("There are no periods in the database.");
    }
    if (period.length > 1) {
      throw new Error("There are too many periods in the database to set initial balance.");
    }
    return period[0];
  }
  async readAccounts(dbArg) {
    if (!this.accounts) {
      this.accounts = {};
      this.accountsById = {};
      const accounts = await this.get(`/db/${this.str(dbArg)}/account`);
      for (const account of accounts) {
        this.accounts[account.number] = account;
        this.accountsById[account.id || 0] = account;
      }
    }
  }
  async accountId(dbArg, accountArg) {
    await this.readAccounts(dbArg);
    const num3 = this.str(accountArg);
    if (!this.accounts[num3]) {
      throw new Error(`No account found matching ${JSON.stringify(accountArg)}`);
    }
    return this.accounts[num3].id;
  }
  async entries(dbArg, entryArg) {
    if (!entryArg) {
      throw new Error(`Invalid entry argument ${JSON.stringify(entryArg)}.`);
    }
    const entry = typeof entryArg === "string" ? [entryArg] : entryArg;
    const ret = [];
    for (const e of entry) {
      const match = /^\s*(\d+)\s+(.+?)\s+([-+]?\d+([,.]\d+)?)$/.exec(e);
      if (!match) {
        throw new Error(`Invalid transaction line ${JSON.stringify(e)}`);
      }
      const amount = Math.round(parseFloat(match[3].replace(",", ".")) * 100);
      ret.push({
        account_id: await this.accountId(dbArg, match[1]),
        number: match[1],
        amount,
        description: match[2]
      });
    }
    return ret;
  }
  date(dateArg) {
    const date = this.str(dateArg);
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(`Invalid date argument ${JSON.stringify(dateArg)}`);
    }
    return date;
  }
  value(value) {
    value = this.str(value);
    try {
      return JSON.parse(value);
    } catch (err) {
      return value;
    }
  }
  async jsonData(dataArg) {
    if (dataArg instanceof Array) {
      const ret = {};
      for (const data2 of dataArg) {
        Object.assign(ret, await this.jsonData(data2));
      }
      return ret;
    }
    if (!dataArg || typeof dataArg !== "string") {
      throw new Error(`Invalid JSON data argument ${JSON.stringify(dataArg)}.`);
    }
    let data;
    if (dataArg[0] === "@") {
      data = import_fs.default.readFileSync(dataArg.substring(1)).toString("utf-8");
    } else {
      data = dataArg;
    }
    try {
      return JSON.parse(data);
    } catch (err) {
      throw new Error(`Failed to parse JSON ${data.substr(0, 1e3)}.`);
    }
  }
  async plugin(pluginArg) {
    if (!this.plugins) {
      this.plugins = await this.getUi("/internal/plugins");
    }
    if (pluginArg instanceof Array) {
      const result = [];
      for (const plugin2 of pluginArg) {
        result.push(await this.plugin(plugin2));
      }
      return result;
    }
    const code = this.str(pluginArg);
    const plugin = this.plugins.filter((p) => p.code === code);
    if (!plugin.length) {
      throw new Error(`Cannot find plugin '${code}'.`);
    }
    return plugin[0];
  }
  async importer(dbArg, nameArg) {
    if (!this.importers) {
      this.importers = await this.get(`/db/${this.str(dbArg)}/importer`);
    }
    const name = this.str(nameArg);
    const importer = this.importers.filter((p) => p.name === name);
    if (!importer.length) {
      throw new Error(`Cannot find importer '${name}'.`);
    }
    return importer[0];
  }
  async tag(db, name) {
    const resp = await this.get(`/db/${db}/tags`);
    const match = resp.filter((tag) => tag.tag === name);
    if (!match.length) {
      throw new Error(`Cannot find a tag '${name}.`);
    }
    return match[0];
  }
  help() {
    const args = this.cli.originalArgs.concat(["-h"]);
    this.cli.run([], args);
  }
};

// src/commands/db.ts
var DbCommand = class extends Command {
  addArguments(parser) {
    const sub = parser.add_subparsers();
    const ls = sub.add_parser("ls", { help: "List all databases" });
    ls.set_defaults({ subCommand: "ls" });
    const create6 = sub.add_parser("create", { help: "Create a database" });
    create6.set_defaults({ subCommand: "create" });
    create6.add_argument("scheme", { help: "Bookkeeping scheme plugin code" });
    create6.add_argument("databaseName", { help: "Name of the new database" });
    create6.add_argument("companyName", { nargs: "?", help: "Name of the company (optional)" });
    create6.add_argument("companyCode", { nargs: "?", help: "Registration code of the company (optional)" });
    create6.add_argument("language", { nargs: "?", help: "Database language (optional)" });
    create6.add_argument("currency", { nargs: "?", help: "Currency (optional)" });
    const rm = sub.add_parser("rm", { help: "Delete a database" });
    rm.set_defaults({ subCommand: "rm" });
    rm.add_argument("databaseName", { help: "Name of the database" });
    const upload = sub.add_parser("upload", { help: "Upload a database" });
    upload.set_defaults({ subCommand: "upload" });
    upload.add_argument("path", { help: "Path to the file to upload" });
  }
  async ls() {
    const resp = await this.get("/db");
    this.out("db", resp);
  }
  print(data) {
    for (const db of data) {
      console.log(db.name);
    }
  }
  async rm() {
    const { databaseName } = this.args;
    await this.delete(`/db/${databaseName}`);
    (0, import_tasenor_common.log)(`Database ${databaseName} deleted successfully.`);
  }
  async create() {
    const { scheme, databaseName, companyName, companyCode, language, currency } = this.args;
    const settings = {
      language,
      currency
    };
    const params = { scheme, databaseName, companyName, companyCode, settings };
    await this.post("/db", params);
    (0, import_tasenor_common.log)(`Database ${databaseName} created successfully.`);
  }
  async upload() {
    const { path: path10 } = this.args;
    if (!path10 || !import_fs2.default.existsSync(this.str(path10))) {
      throw new Error(`File path ${path10} does not exist.`);
    }
    await this.postUpload("/db/upload", path10);
    (0, import_tasenor_common.log)(`Database ${path10} uploaded successfully.`);
  }
  async run() {
    await this.runBy("subCommand");
  }
};
var db_default = DbCommand;

// src/commands/account.ts
init_shim();
var import_tasenor_common2 = require("@dataplug/tasenor-common");
var AccountCommand = class extends Command {
  addArguments(parser) {
    const sub = parser.add_subparsers();
    const ls = sub.add_parser("ls", { help: "List all accounts" });
    ls.set_defaults({ subCommand: "ls" });
    ls.add_argument("db", { help: "Name of the database" });
    const rm = sub.add_parser("rm", { help: "Delete an account" });
    rm.set_defaults({ subCommand: "rm" });
    rm.add_argument("db", { help: "Name of the database" });
    rm.add_argument("id", { help: "ID of the account" });
    const create6 = sub.add_parser("create", { help: "Create an account" });
    create6.set_defaults({ subCommand: "create" });
    create6.add_argument("db", { help: "Name of the database" });
    create6.add_argument("language", { help: "Account language" });
    create6.add_argument("currency", { help: "Account currency" });
    create6.add_argument("type", { help: "Account type" });
    create6.add_argument("number", { help: "Account number" });
    create6.add_argument("name", { help: "Account name" });
    create6.add_argument("data", { help: "Additional account data in JSON format", nargs: "?" });
  }
  async ls() {
    const { db } = this.args;
    const resp = await this.get(`/db/${db}/account`);
    this.out("account", resp);
  }
  print(data) {
    for (const account of data.sort((a, b) => (a.id || 0) - (b.id || 0))) {
      const { id, number, name, type, language, currency, data: data2 } = account;
      console.log(`#${id} [${language} ${currency} ${type}] ${number} ${name} ${Object.keys(data2).length ? JSON.stringify(data2) : ""}`);
    }
  }
  async rm() {
    const { db, id } = this.args;
    await this.delete(`/db/${db}/account/${id}`);
    (0, import_tasenor_common2.log)(`Account ${id} deleted successfully.`);
  }
  async create() {
    const { db, number, name, type, language, currency, data } = this.args;
    const params = {
      number,
      name,
      type,
      language,
      currency,
      data: data ? await this.jsonData(data) : {}
    };
    await this.post(`/db/${db}/account`, params);
    (0, import_tasenor_common2.log)(`Account ${number} ${name} created successfully.`);
  }
  async run() {
    await this.runBy("subCommand");
  }
};
var account_default = AccountCommand;

// src/commands/balance.ts
init_shim();
var import_sprintf_js = require("sprintf-js");
var import_tasenor_common3 = require("@dataplug/tasenor-common");
var import_clone = __toESM(require_clone());
var BalanceCommand = class extends Command {
  addArguments(parser) {
    const sub = parser.add_subparsers();
    const ls = sub.add_parser("ls", { help: "List account balances" });
    ls.set_defaults({ subCommand: "ls" });
    ls.add_argument("db", { help: "Name of the database" });
    ls.add_argument("period", { help: "Period year, date or ID" });
    const create6 = sub.add_parser("create", { help: "Initialize account balances" });
    create6.set_defaults({ subCommand: "create" });
    create6.add_argument("--force", "-f", { action: "store_true", help: "If given, allow invalid entries to be created", required: false });
    create6.add_argument("--map", { help: "Remap account numbers using JSON or @filepath mapping", required: false });
    create6.add_argument("--stock", { nargs: "*", help: "Define initial stock using JSON or @filepath mapping", required: false });
    create6.add_argument("--text", { help: "A description for the transaction", required: false });
    create6.add_argument("db", { help: "Name of the database" });
    create6.add_argument("data", { help: "A JSON data or @filepath for balances" });
  }
  async ls() {
    const { db, period, verbose } = this.args;
    const periodId = await this.periodId(db, period);
    const resp = await this.get(`/db/${db}/period/${periodId}`);
    await this.readAccounts(db);
    if (!verbose && resp.balances) {
      this.out("balance", resp.balances.reduce((prev, cur) => ({ ...prev, [cur.number]: cur.total }), {}));
      return;
    }
    this.out("balance", resp);
  }
  print(data) {
    Object.keys(data).sort().forEach((number) => {
      console.log(number, this.accounts[number].name, "	", (0, import_sprintf_js.sprintf)("%.2f", data[number] / 100));
    });
  }
  async create() {
    const { db, data, map, stock, text, force } = this.args;
    if (!db) {
      throw new Error(`Invalid database argument ${JSON.stringify(db)}`);
    }
    const dataArg = await this.jsonData(data);
    const mapArg = map ? await this.jsonData(map) : {};
    const period = await this.singlePeriod(db);
    const stockArg = await this.jsonData(stock);
    const docs = await this.get(`/db/${db}/document`);
    if (docs.filter((d) => d.number !== 0).length && !force) {
      throw new Error("There are already non-initial transactions in the database and cannot be initialized anymore.");
    }
    const sum = Object.values(dataArg).reduce((prev, cur) => prev + cur, 0);
    if (sum) {
      if (force) {
        (0, import_tasenor_common3.warning)(`Initial balance total must be zero. Got ${sum} from ${JSON.stringify(dataArg)}.`);
      } else {
        throw new Error(`Initial balance total must be zero. Got ${sum} from ${JSON.stringify(dataArg)}.`);
      }
    }
    for (const account of Object.keys(dataArg)) {
      if (!dataArg[account]) {
        continue;
      }
      await this.accountId(db, mapArg[account] || account);
    }
    const document = docs.length > 0 ? docs[0] : await this.post(`/db/${db}/document`, {
      period_id: period.id,
      date: this.date(period.start_date),
      number: 0
    });
    (0, import_tasenor_common3.log)(`Created a document #${document.id} on ${period.start_date}.`);
    const description = this.str(text) || "Initial balance";
    for (const account of Object.keys(dataArg)) {
      const destAccount = mapArg[account] || account;
      if (!dataArg[account]) {
        (0, import_tasenor_common3.log)(`Skipping an entry ${destAccount} ${description} ${(0, import_sprintf_js.sprintf)("%.2f", 0)}.`);
        continue;
      }
      const entry = {
        document_id: document.id,
        account_id: await this.accountId(db, destAccount),
        debit: dataArg[account] >= 0 ? 1 : 0,
        amount: Math.abs(dataArg[account]),
        description
      };
      if (stockArg[destAccount]) {
        entry.data = {
          stock: {
            set: (0, import_clone.default)(stockArg[destAccount])
          }
        };
        delete stockArg[destAccount];
      }
      const out = await this.post(`/db/${db}/entry`, entry);
      (0, import_tasenor_common3.log)(`Created an entry #${out.id} for ${destAccount} ${description} ${(0, import_sprintf_js.sprintf)("%.2f", dataArg[account] / 100)}.`);
    }
    if (Object.keys(stockArg).length) {
      throw new Error(`Unused initial stocks for accounts ${Object.keys(stockArg).join(", ")}`);
    }
  }
  async run() {
    await this.runBy("subCommand");
  }
};
var balance_default = BalanceCommand;

// src/commands/entry.ts
init_shim();
var import_sprintf_js2 = require("sprintf-js");
var import_tasenor_common4 = require("@dataplug/tasenor-common");
var EntryCommand = class extends Command {
  addArguments(parser) {
    const sub = parser.add_subparsers();
    const ls = sub.add_parser("ls", { help: "Find entries matching the filter" });
    ls.set_defaults({ subCommand: "ls" });
    ls.add_argument("--account", { help: "Match to this account number", required: false });
    ls.add_argument("--text", { help: "Match to this exact description", required: false });
    ls.add_argument("db", { help: "Name of the database" });
    const edit = sub.add_parser("edit", { help: "Change entries matching the filter" });
    edit.set_defaults({ subCommand: "edit" });
    edit.add_argument("--account", { help: "Match to this account number", required: false });
    edit.add_argument("--text", { help: "Match to this exact description", required: false });
    edit.add_argument("db", { help: "Name of the database" });
    edit.add_argument("data", { help: "JSON data for patching the entry" });
    const rm = sub.add_parser("rm", { help: "Remove entries matching the filter" });
    rm.set_defaults({ subCommand: "rm" });
    rm.add_argument("--account", { help: "Match to this account number", required: false });
    rm.add_argument("--text", { help: "Match to this exact description", required: false });
    rm.add_argument("--all", { help: "Delete the whole transaction that includes the matching line.", action: "store_true", required: false });
    rm.add_argument("db", { help: "Name of the database" });
  }
  async filter() {
    const { db, account, text } = this.args;
    await this.readAccounts(db);
    const query = [];
    if (account) {
      const id = await this.accountId(db, account);
      query.push(`account_id=${id}`);
    }
    if (text) {
      query.push(`text=${text}`);
    }
    return this.get(`/db/${db}/entry${query.length ? "?" + query.join("&") : ""}`);
  }
  async ls() {
    const resp = await this.filter();
    this.out("entry", resp);
  }
  print(data) {
    for (const entry of data) {
      const { id, account_id, debit, amount, description } = entry;
      console.log(`#${id} ${this.accountsById[account_id || -1].number} ${this.accountsById[account_id || -1].name}`);
      console.log("    ", (0, import_sprintf_js2.sprintf)("%.2f", debit ? amount / 100 : amount / -100), "	", description);
      if (entry.data && Object.keys(entry.data).length) {
        console.log("    ", JSON.stringify(entry.data));
      }
    }
  }
  async edit() {
    const { db, data } = this.args;
    const params = await this.jsonData(data);
    for (const key of Object.keys(params)) {
      switch (key) {
        case "description":
          break;
        case "account":
          params.account_id = await this.accountId(db, `${params[key]}`);
          delete params.account;
          break;
        default:
          throw new Error(`No handler yet for entry data '${key}'.`);
      }
    }
    const resp = await this.filter();
    for (const entry of resp) {
      (0, import_tasenor_common4.log)(`Changing entry #${entry.id} to have ${JSON.stringify(params)}`);
      await this.patch(`/db/${db}/entry/${entry.id}`, params);
    }
  }
  async rm() {
    const { db } = this.args;
    const resp = await this.filter();
    if (this.args.all) {
      const docIds = /* @__PURE__ */ new Set();
      for (const entry of resp) {
        docIds.add(entry.document_id);
      }
      for (const id of docIds) {
        await this.delete(`/db/${db}/document/${id}`);
      }
    } else {
      for (const entry of resp) {
        await this.delete(`/db/${db}/entry/${entry.id}`);
      }
    }
  }
  async run() {
    await this.runBy("subCommand");
  }
};
var entry_default = EntryCommand;

// src/commands/import.ts
init_shim();
var import_fs3 = __toESM(require("fs"));
var import_mime_types = __toESM(require("mime-types"));
var import_tasenor_common5 = require("@dataplug/tasenor-common");
var ImportCommand = class extends Command {
  addArguments(parser) {
    const sub = parser.add_subparsers();
    const ls = sub.add_parser("ls", { help: "List all imports" });
    ls.set_defaults({ subCommand: "ls" });
    ls.add_argument("db", { help: "Name of the database" });
    ls.add_argument("name", { help: "Name of the importer" });
    const create6 = sub.add_parser("create", { help: "Import a file" });
    create6.set_defaults({ subCommand: "create" });
    create6.add_argument("--first", { help: "First date of the allowed period YYYY-MM-DD", default: "1900-01-01" });
    create6.add_argument("--last", { help: "Final date of the allowed period YYYY-MM-DD", default: "2999-12-31" });
    create6.add_argument("--answers", { help: "Answer file", required: false });
    create6.add_argument("db", { help: "Name of the database" });
    create6.add_argument("name", { help: "Name of the importer" });
    create6.add_argument("file", { help: "Path to the file(s) to import", nargs: "+" });
  }
  async ls() {
    const { db, name } = this.args;
    const importer = await this.importer(db, name);
    const resp = await this.get(`/db/${db}/import/${importer.id}`);
    this.out("import", resp);
  }
  async create() {
    const { db, name, file, answers, first, last } = this.args;
    const importer = await this.importer(db, name);
    const encoding = "base64";
    const files = [];
    for (const filePath of file || []) {
      const data = import_fs3.default.readFileSync(filePath).toString(encoding);
      files.push({
        name: filePath,
        encoding,
        type: import_mime_types.default.lookup(filePath),
        data
      });
    }
    const answersArg = answers ? await this.jsonData(answers) : null;
    const resp = await this.post(`/db/${db}/importer/${importer.id}`, {
      firstDate: first,
      lastDate: last,
      files
    });
    this.out("import", resp);
    if (answersArg) {
      (0, import_tasenor_common5.log)(`Uploading answers to process #${resp.processId}`);
      const resp2 = await this.post(`/db/${db}/import/${importer.id}/process/${resp.processId}`, {
        answer: answersArg
      });
      this.out("import", resp2);
    }
  }
  print(data) {
    if ("processId" in data && "step" in data) {
      (0, import_tasenor_common5.log)(`Process ID: ${data.processId}, Step: ${data.step}, ${data.status}`);
      return;
    }
    for (const imp of data.sort((a, b) => (a.id || 0) - (b.id || 0))) {
      const { id, name, status, error: error7 } = imp;
      console.log(`#${id} ${name} ${status}`);
      if (error7) {
        console.log("  ", error7);
      }
      console.log();
    }
  }
  async run() {
    await this.runBy("subCommand");
  }
};
var import_default = ImportCommand;

// src/commands/period.ts
init_shim();
var import_tasenor_common6 = require("@dataplug/tasenor-common");
var PeriodCommand = class extends Command {
  addArguments(parser) {
    const sub = parser.add_subparsers();
    const ls = sub.add_parser("ls", { help: "List all periods" });
    ls.set_defaults({ subCommand: "ls" });
    ls.add_argument("db", { help: "Name of the database" });
    const rm = sub.add_parser("rm", { help: "Delete a period" });
    rm.set_defaults({ subCommand: "rm" });
    rm.add_argument("db", { help: "Name of the database" });
    rm.add_argument("id", { help: "ID of the period" });
    const create6 = sub.add_parser("create", { help: "Create a period" });
    create6.set_defaults({ subCommand: "create" });
    create6.add_argument("db", { help: "Name of the database" });
    create6.add_argument("start_date", { help: "First date of the period YYYY-MM-DD" });
    create6.add_argument("end_date", { help: "Final date of the period YYYY-MM-DD" });
  }
  async ls() {
    const { db } = this.args;
    const resp = await this.get(`/db/${db}/period`);
    this.out("period", resp);
  }
  print(data) {
    for (const period of data.sort((a, b) => (a.id || 0) - (b.id || 0))) {
      const { id, start_date, end_date } = period;
      console.log(`#${id} ${start_date} ${end_date}`);
    }
  }
  async rm() {
    const { db, id } = this.args;
    await this.delete(`/db/${db}/period/${id}`);
    (0, import_tasenor_common6.log)(`Period ${id} deleted successfully.`);
  }
  async create() {
    const { db, start_date, end_date } = this.args;
    const params = { start_date, end_date };
    await this.post(`/db/${db}/period`, params);
    (0, import_tasenor_common6.log)(`Period ${start_date}...${end_date} created successfully.`);
  }
  async run() {
    await this.runBy("subCommand");
  }
};
var period_default = PeriodCommand;

// src/commands/importer.ts
init_shim();
var import_tasenor_common7 = require("@dataplug/tasenor-common");
var ImporterCommand = class extends Command {
  addArguments(parser) {
    const sub = parser.add_subparsers();
    const ls = sub.add_parser("ls", { help: "List all importers" });
    ls.set_defaults({ subCommand: "ls" });
    ls.add_argument("db", { help: "Name of the database" });
    const create6 = sub.add_parser("create", { help: "Create an importer" });
    create6.set_defaults({ subCommand: "create" });
    create6.add_argument("db", { help: "Name of the database" });
    create6.add_argument("name", { help: "Name of the importer" });
    create6.add_argument("plugin", { help: "Code of the import handler plugin" });
    const set = sub.add_parser("set", { help: "Set configuration variable for an importer" });
    set.set_defaults({ subCommand: "set" });
    set.add_argument("db", { help: "Name of the database" });
    set.add_argument("name", { help: "The name of the importer" });
    set.add_argument("variable", { help: "Name of the configuration variable" });
    set.add_argument("value", { help: "Value for the configuration variable" });
    const config2 = sub.add_parser("config", { help: "Set whole configuration for an importer" });
    config2.set_defaults({ subCommand: "config" });
    config2.add_argument("db", { help: "Name of the database" });
    config2.add_argument("name", { help: "The name of the importer" });
    config2.add_argument("config", { help: "JSON data or @filepath for configuration" });
  }
  async ls() {
    const { db } = this.args;
    const resp = await this.get(`/db/${db}/importer`);
    this.out("importer", resp);
  }
  print(data) {
    for (const importer of data.sort((a, b) => (a.id || 0) - (b.id || 0))) {
      const { id, name, config: config2 } = importer;
      console.log(`#${id} ${name}`);
      if (config2.rules) {
        config2.rules = "...skipped...";
      }
      console.dir(config2, { depth: null });
      console.log();
    }
  }
  async create() {
    const { db, name, plugin } = this.args;
    await this.plugin(plugin);
    const code = this.str(plugin);
    await this.post(`/db/${db}/importer`, { name, config: { handlers: [code] } });
    (0, import_tasenor_common7.log)(`Importer ${name} created successfully.`);
  }
  async set() {
    const { db, name, variable, value } = this.args;
    const importer = await this.importer(db, name);
    const variableArg = this.str(variable);
    const valueArg = this.value(value);
    await this.patch(`/db/${db}/importer/${importer.id}`, { config: { [variableArg]: valueArg } });
    const newImporter = await this.get(`/db/${db}/importer/${importer.id}`);
    (0, import_tasenor_common7.log)(`Variable ${variableArg} set to ${JSON.stringify(newImporter.config[variableArg])}`);
  }
  async config() {
    const { db, name, config: config2 } = this.args;
    const importer = await this.importer(db, name);
    const configArg = await this.jsonData(config2);
    await this.patch(`/db/${db}/importer/${importer.id}`, { config: configArg });
    (0, import_tasenor_common7.log)(`Updated configuration for importer ${name}`);
  }
  async run() {
    await this.runBy("subCommand");
  }
};
var importer_default = ImporterCommand;

// src/commands/plugin.ts
init_shim();
var import_tasenor_common8 = require("@dataplug/tasenor-common");
var PluginCommand = class extends Command {
  addArguments(parser) {
    const sub = parser.add_subparsers();
    const ls = sub.add_parser("ls", { help: "List plugins and their status" });
    ls.set_defaults({ subCommand: "ls" });
    ls.add_argument("--short", "-s", { action: "store_true", help: "If given, show just plugin codes in one line", required: false });
    ls.add_argument("--installed", "-i", { action: "store_true", help: "If given, show only installed plugins", required: false });
    const install = sub.add_parser("install", { help: "Install plugins" });
    install.set_defaults({ subCommand: "install" });
    install.add_argument("code", { help: "Plugin code", nargs: "+" });
    const rm = sub.add_parser("rm", { help: "Uninstall plugins" });
    rm.set_defaults({ subCommand: "rm" });
    rm.add_argument("code", { help: "Plugin code", nargs: "+" });
    const rebuild = sub.add_parser("rebuild", { help: "Rebuild UI with newly installed plugins" });
    rebuild.set_defaults({ subCommand: "rebuild" });
    const reset = sub.add_parser("reset", { help: "Remove all installed plugins" });
    reset.set_defaults({ subCommand: "reset" });
    const refresh = sub.add_parser("refresh", { help: "Reftresh the plugin list" });
    refresh.set_defaults({ subCommand: "refresh" });
  }
  print(data) {
    for (const plugin of data.sort((a, b) => a.id - b.id)) {
      const { id, code, installedVersion, use, type } = plugin;
      console.log(`#${id} ${code} ${use} ${type} ${installedVersion ? "[v" + installedVersion + "]" : ""}`);
    }
  }
  async ls() {
    const { short, installed } = this.args;
    let resp = await this.getUi("/internal/plugins");
    if (installed) {
      resp = resp.filter((plugin) => plugin.installedVersion);
    }
    if (short) {
      console.log(resp.map((plugin) => plugin.code).join(" "));
      return;
    }
    this.out("plugin", resp);
  }
  async install() {
    const { code } = this.args;
    const plugins2 = await this.plugin(code);
    for (const plugin of plugins2) {
      const version = plugin.availableVersion;
      if (!version) {
        throw new Error(`No version available of plugin ${code}.`);
      }
      (0, import_tasenor_common8.log)(`Installing plugin ${plugin.code} version ${version}`);
      await this.postUi("/internal/plugins", { code: plugin.code, version });
    }
  }
  async rm() {
    const { code } = this.args;
    const plugins2 = await this.plugin(code);
    for (const plugin of plugins2) {
      (0, import_tasenor_common8.log)(`Removing plugin ${plugin.code}`);
      await this.deleteUi("/internal/plugins", { code: plugin.code });
    }
  }
  async rebuild() {
    (0, import_tasenor_common8.log)("Rebuilding plugins");
    await this.getUi("/internal/plugins/rebuild");
  }
  async refresh() {
    (0, import_tasenor_common8.log)("Refreshing plugins");
    await this.getUi("/internal/plugins");
  }
  async reset() {
    (0, import_tasenor_common8.log)("Removing all plugins");
    await this.getUi("/internal/plugins/reset");
  }
  async run() {
    await this.runBy("subCommand");
  }
};
var plugin_default = PluginCommand;

// src/commands/report.ts
init_shim();
var import_sprintf_js3 = require("sprintf-js");
var ReportCommand = class extends Command {
  addArguments(parser) {
    const sub = parser.add_subparsers();
    const ls = sub.add_parser("ls", { help: "List of reports" });
    ls.set_defaults({ subCommand: "ls" });
    ls.add_argument("db", { help: "Name of the database" });
    const view = sub.add_parser("view", { help: "Show a report" });
    view.set_defaults({ subCommand: "view" });
    view.add_argument("db", { help: "Name of the database" });
    view.add_argument("report", { help: "Name of the report" });
    view.add_argument("period", { help: "Period year, date or ID" });
  }
  async ls() {
    const { db } = this.args;
    const resp = await this.get(`/db/${db}/report`);
    this.out("report", resp);
  }
  async view() {
    const { db, period, report } = this.args;
    const periodId = await this.periodId(db, period);
    const resp = await this.get(`/db/${db}/report/${report}/${periodId}`);
    this.out("report", resp);
  }
  print(data) {
    if ("options" in data) {
      Object.keys(data.options).forEach((opt) => console.log(opt));
      return;
    }
    if ("data" in data) {
      const report = data;
      console.log();
      console.log(report.format);
      console.log();
      if ("meta" in data) {
        Object.keys(report.meta).forEach((meta) => console.log(`${meta}: ${report.meta[meta]}`));
        console.log();
      }
      const lines = [];
      const columns = data.columns || [];
      let line = [];
      for (const column of columns) {
        line.push(column.title);
      }
      lines.push(line);
      for (const item of report.data) {
        line = [];
        for (const column of columns) {
          const text = {
            name: () => item.name,
            numeric: () => item.amounts && item.amounts[column.name] !== void 0 && (0, import_sprintf_js3.sprintf)("%.2f", (item.amounts[column.name] || 0) / 100)
          }[column.type]();
          line.push(text || "");
        }
        lines.push(line);
      }
      const spaces = columns.map(() => "");
      for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < columns.length; j++) {
          if (lines[i][j].length > spaces[j].length) {
            spaces[j] = lines[i][j].replace(/./g, " ");
          }
        }
      }
      for (let i = 0; i < lines.length; i++) {
        let str = "";
        for (let j = 0; j < columns.length; j++) {
          str += (lines[i][j] + spaces[j] + " ").substr(0, spaces[j].length + 1);
        }
        console.log(str);
      }
      return;
    }
    throw new Error("Default output not implented.");
  }
  async run() {
    await this.runBy("subCommand");
  }
};
var report_default = ReportCommand;

// src/commands/settings.ts
init_shim();
var import_tasenor_common9 = require("@dataplug/tasenor-common");
var SettingsCommand = class extends Command {
  addArguments(parser) {
    const sub = parser.add_subparsers();
    const ls = sub.add_parser("ls", { help: "List all settings" });
    ls.set_defaults({ subCommand: "ls" });
    ls.add_argument("--all", "-a", { help: "Show all UI configurations and other extras.", action: "store_true", required: false });
    ls.add_argument("db", { help: "Name of the database", nargs: "?" });
    const set = sub.add_parser("set", { help: "Change a settings" });
    set.set_defaults({ subCommand: "set" });
    set.add_argument("dest", { help: "Name of the database, name of the plugin  or `system`" });
    set.add_argument("key", { help: "Name of the setting" });
    set.add_argument("value", { help: "New value for the setting" });
  }
  async ls() {
    const { db, all } = this.args;
    const resp = db ? await this.get(`/db/${db}/settings`) : null;
    const resp2 = await this.get("/system/settings");
    const resp3 = await this.get("/system/settings/plugins");
    const pluginSettings = {};
    Object.keys(resp3).forEach((plugin) => {
      pluginSettings[plugin] = all ? resp3[plugin] : resp3[plugin].settings;
    });
    this.out("settings", db ? {
      db: resp,
      system: resp2,
      plugin: pluginSettings
    } : {
      system: resp2,
      plugins: pluginSettings
    });
  }
  print(data) {
    console.dir(data, { depth: null });
  }
  async set() {
    const { dest, key, value } = this.args;
    const valueArg = await this.value(value);
    const keyArg = this.str(key);
    const destArg = this.str(dest);
    if (destArg === "system") {
      (0, import_tasenor_common9.log)(`Setting system variable ${keyArg} to ${JSON.stringify(valueArg)}.`);
      await this.patch("/system/settings", { [keyArg]: valueArg });
      return;
    }
    const resp = await this.get("/system/settings/plugins");
    if (destArg in resp) {
      (0, import_tasenor_common9.log)(`Setting plugin ${destArg} setting ${keyArg} to ${JSON.stringify(valueArg)}.`);
      await this.patch("/system/settings/plugins", { [`${destArg}.${keyArg}`]: valueArg });
      return;
    }
    (0, import_tasenor_common9.log)(`Setting databas ${destArg} setting ${keyArg} to ${JSON.stringify(valueArg)}.`);
    await this.patch(`/db/${destArg}/settings`, { [keyArg]: valueArg });
  }
  async run() {
    await this.runBy("subCommand");
  }
};
var settings_default = SettingsCommand;

// src/commands/stock.ts
init_shim();
var import_sprintf_js4 = require("sprintf-js");
var import_tasenor_common10 = require("@dataplug/tasenor-common");
var StockCommand = class extends Command {
  addArguments(parser) {
    const sub = parser.add_subparsers();
    const create6 = sub.add_parser("create", { help: "Create initial stock" });
    create6.set_defaults({ subCommand: "create" });
    create6.add_argument("db", { help: "Name of the database" });
    create6.add_argument("data", { help: "A JSON data or @filepath for initial stock data" });
  }
  async create() {
    const { db, data } = this.args;
    if (!db) {
      throw new Error(`Invalid database argument ${JSON.stringify(db)}`);
    }
    const dataArg = await this.jsonData(data);
    const period = await this.singlePeriod(db);
    const docs = await this.get(`/db/${db}/document?period=${period.id}&entries`);
    const zeroTx = docs.filter((doc) => doc.number === 0);
    if (!zeroTx.length) {
      throw new Error("Cannot set stock unless there is 0-transaction for initial balances defined.");
    }
    if (!zeroTx[0].entries) {
      throw new Error("Cannot set stock unless there are entries in 0-transaction for initial balances.");
    }
    const entryIndex = {};
    let i = 0;
    for (const entry of zeroTx[0].entries) {
      if (entry.account_id) {
        entryIndex[entry.account_id] = i++;
      }
    }
    for (const account of Object.keys(dataArg)) {
      const accountId = await this.accountId(db, account);
      if (accountId && !entryIndex[accountId]) {
        const newEntry = await this.post(`/db/${db}/entry`, {
          document_id: zeroTx[0].id,
          account_id: accountId,
          debit: 1,
          amount: 0,
          description: zeroTx[0].entries[0].description
        });
        (0, import_tasenor_common10.log)(`Created an entry #${newEntry.id} for ${account} ${zeroTx[0].entries[0].description} ${(0, import_sprintf_js4.sprintf)("%.2f", 0)}.`);
        zeroTx[0].entries.push(newEntry);
        entryIndex[accountId] = zeroTx[0].entries.length - 1;
      }
    }
    for (const account of Object.keys(dataArg)) {
      const accountId = await this.accountId(db, account);
      if (accountId) {
        const entry = zeroTx[0].entries[entryIndex[accountId]];
        entry.data = entry.data || {};
        Object.assign(entry.data, {
          stock: {
            set: dataArg[account]
          }
        });
        await this.patch(`/db/${db}/entry/${entry.id}`, { data: entry.data });
        (0, import_tasenor_common10.log)(`Updated initial stock data for entry #${entry.id}.`);
      }
    }
  }
  async run() {
    await this.runBy("subCommand");
  }
};
var stock_default = StockCommand;

// src/commands/tag.ts
init_shim();
var import_fs4 = __toESM(require("fs"));
var import_mime_types2 = __toESM(require("mime-types"));
var import_tasenor_common11 = require("@dataplug/tasenor-common");
var TagCommand = class extends Command {
  addArguments(parser) {
    const sub = parser.add_subparsers();
    const ls = sub.add_parser("ls", { help: "List all tags" });
    ls.set_defaults({ subCommand: "ls" });
    ls.add_argument("db", { help: "Name of the database" });
    ls.add_argument("--tags-only", { help: "Show only tags", action: "store_true", required: false });
    const download = sub.add_parser("download", { help: "Download a tag image" });
    download.set_defaults({ subCommand: "download" });
    download.add_argument("db", { help: "Name of the database" });
    download.add_argument("tag", { help: "Name of the tag" });
    const rm = sub.add_parser("rm", { help: "Delete a tag" });
    rm.set_defaults({ subCommand: "rm" });
    rm.add_argument("db", { help: "Name of the database" });
    rm.add_argument("id", { help: "ID of the tag" });
    const create6 = sub.add_parser("create", { help: "Create a tag" });
    create6.set_defaults({ subCommand: "create" });
    create6.add_argument("db", { help: "Name of the database" });
    create6.add_argument("tag", { help: "Tag itself" });
    create6.add_argument("name", { help: "Description" });
    create6.add_argument("type", { help: "Group name of the tag" });
    create6.add_argument("path", { help: "Path to the file" });
    create6.add_argument("order", { help: "Ordering number for the tag", nargs: "?" });
  }
  async ls() {
    const { db, tags_only } = this.args;
    const resp = await this.get(`/db/${db}/tags`);
    if (tags_only) {
      for (const tag of resp.map((t) => t.tag)) {
        console.log(tag);
      }
    } else {
      this.out("tag", resp);
    }
  }
  print(data) {
    for (const line of data.sort((a, b) => (a.id || 0) - (b.id || 0))) {
      const { id, tag, name, mime: mime2, type, order } = line;
      console.log(`#${id} ${tag}	${name}	${mime2}	${type}	${order}`);
    }
  }
  async rm() {
    const { db, id } = this.args;
    await this.delete(`/db/${db}/tags/${id}`);
    (0, import_tasenor_common11.log)(`Tag ${id} deleted successfully.`);
  }
  async download() {
    const { db, tag } = this.args;
    const tagArg = await this.tag(db, tag);
    const name = `${tagArg.tag}.${(tagArg.mime || "/bin").split("/")[1]}`;
    const data = import_buffer.Buffer.from(tagArg.picture || "", "base64");
    import_fs4.default.writeFileSync(name, data);
    (0, import_tasenor_common11.log)(`Saved a tag to file ${name}.`);
  }
  async create() {
    const { db, tag, name, path: path10, type } = this.args;
    if (!path10 || !import_fs4.default.existsSync(this.str(path10))) {
      throw new Error(`File path ${path10} does not exist.`);
    }
    const mime2 = import_mime_types2.default.lookup(path10);
    let order = this.num(this.args.order);
    if (!order) {
      const maxNumber = {};
      const old = await this.get(`/db/${db}/tags`);
      for (const tag2 of old) {
        if (!tag2.type) {
          continue;
        }
        maxNumber[tag2.type] = Math.max(maxNumber[tag2.type] || 0, tag2.order);
      }
      order = (maxNumber[this.str(type)] || 0) + 1;
    }
    const picture = import_fs4.default.readFileSync(this.str(path10)).toString("base64");
    const params = { tag, name, mime: mime2, type, order, picture };
    await this.post(`/db/${db}/tags`, params);
    (0, import_tasenor_common11.log)(`Tag ${tag} created successfully.`);
  }
  async run() {
    await this.runBy("subCommand");
  }
};
var tag_default = TagCommand;

// src/commands/tx.ts
init_shim();
var import_sprintf_js5 = require("sprintf-js");
var import_tasenor_common12 = require("@dataplug/tasenor-common");
var TxCommand = class extends Command {
  addArguments(parser) {
    const sub = parser.add_subparsers();
    const ls = sub.add_parser("ls", { help: "List all transactions" });
    ls.set_defaults({ subCommand: "ls" });
    ls.add_argument("db", { help: "Name of the database" });
    ls.add_argument("period", { help: "Period year, date or ID" });
    const rm = sub.add_parser("rm", { help: "Delete a transaction" });
    rm.set_defaults({ subCommand: "rm" });
    rm.add_argument("db", { help: "Name of the database" });
    rm.add_argument("id", { help: "ID of the transaction" });
    const create6 = sub.add_parser("create", { help: "Create a transaction" });
    create6.set_defaults({ subCommand: "create" });
    create6.add_argument("--force", { help: "Allow invalid transactions.", action: "store_true", required: false });
    create6.add_argument("db", { help: "Name of the database" });
    create6.add_argument("date", { help: "The transaction date" });
    create6.add_argument("entry", { nargs: "+", help: 'A transaction line as string, e.g "1234 Description +12,00"' });
  }
  async ls() {
    const { db, period } = this.args;
    const periodId = await this.periodId(db, period);
    const resp = await this.get(`/db/${db}/document?period=${periodId}&entries`);
    await this.readAccounts(db);
    this.out("document", resp);
  }
  print(data) {
    for (const doc of data.sort((a, b) => (a.number || 0) - (b.number || 0))) {
      const { number, date } = doc;
      console.log(`#${number} ${date}`);
      if (doc.entries) {
        for (const entry of doc.entries) {
          console.log("  ", this.accountsById[entry.account_id || -1].number, (0, import_sprintf_js5.sprintf)("%.2f", entry.debit ? entry.amount / 100 : entry.amount / -100), entry.description);
        }
      }
    }
  }
  async rm() {
    const { db, id } = this.args;
    await this.delete(`/db/${db}/document/${id}`);
    (0, import_tasenor_common12.log)(`Document ${id} deleted successfully.`);
  }
  async create() {
    const { db, date, entry, force } = this.args;
    if (!db) {
      throw new Error(`Invalid database argument ${JSON.stringify(db)}`);
    }
    const periodId = await this.periodId(db, date);
    const entries = await this.entries(db, entry);
    const sum = entries.reduce((prev, cur) => prev + cur.amount, 0);
    if (sum && !force) {
      throw new Error(`Transaction total must be zero. Got ${sum} from ${JSON.stringify(entries)}.`);
    }
    const document = await this.post(`/db/${db}/document`, { period_id: periodId, date: this.date(date) });
    (0, import_tasenor_common12.log)(`Created a document #${document.id} on ${date}.`);
    for (const e of entries) {
      const out = await this.post(`/db/${db}/entry`, {
        document_id: document.id,
        account_id: e.account_id,
        debit: e.amount > 0,
        amount: Math.abs(e.amount),
        description: e.description
      });
      (0, import_tasenor_common12.log)(`Created an entry #${out.id} for ${e.number} ${e.description} ${(0, import_sprintf_js5.sprintf)("%.2f", e.amount / 100)}.`);
    }
  }
  async run() {
    await this.runBy("subCommand");
  }
};
var tx_default = TxCommand;

// src/commands/user.ts
init_shim();
var import_tasenor_common13 = require("@dataplug/tasenor-common");
var UserCommand = class extends Command {
  addArguments(parser) {
    const sub = parser.add_subparsers();
    const ls = sub.add_parser("ls", { help: "List all users" });
    ls.set_defaults({ subCommand: "ls" });
    const rm = sub.add_parser("rm", { help: "Delete a user" });
    rm.set_defaults({ subCommand: "rm" });
    rm.add_argument("email", { help: "Email address of the user" });
    const create6 = sub.add_parser("create", { help: "Create a user" });
    create6.set_defaults({ subCommand: "create" });
    create6.add_argument("name", { help: "Full name of the user" });
    create6.add_argument("passwd", { help: "Initial password for the user" });
    create6.add_argument("email", { help: "Email address of the user" });
    const add = sub.add_parser("add", { help: "Add a user to the database" });
    add.set_defaults({ subCommand: "add" });
    add.add_argument("email", { help: "Email address of the user" });
    add.add_argument("db", { help: "Name of the database" });
  }
  async ls() {
    const resp = await this.get("/admin/user");
    this.out("user", resp);
  }
  print(data) {
    for (const user of data.sort((a, b) => (a.id || 0) - (b.id || 0))) {
      const { id, name, email, config: config2 } = user;
      console.log(`#${id} ${name} ${email} ${JSON.stringify(config2)}`);
    }
  }
  async rm() {
    const { email } = this.args;
    await this.delete(`/admin/user/${email}`);
    (0, import_tasenor_common13.log)(`User ${email} deleted successfully.`);
  }
  async create() {
    const { name, passwd, email } = this.args;
    const params = { name, password: passwd, email };
    await this.post("/admin/user", params);
    (0, import_tasenor_common13.log)(`User ${name} created successfully.`);
  }
  async add() {
    const { email, db } = this.args;
    (0, import_tasenor_common13.log)(`Adding user ${email} to database ${db}`);
    await this.post(`/admin/user/${email}/databases`, { database: this.str(db) });
  }
  async run() {
    await this.runBy("subCommand");
  }
};
var user_default = UserCommand;

// src/cli.ts
var readlineInterface;
function ask(question) {
  if (!readlineInterface) {
    readlineInterface = import_readline.default.createInterface({
      input: import_process.default.stdin,
      output: import_process.default.stdout
    });
  }
  return new Promise((resolve) => {
    readlineInterface.question(question ? `${question} ` : ">", (text) => {
      resolve(text);
    });
  });
}
function exit() {
  if (readlineInterface)
    readlineInterface.close();
}
var CLIRunner = class {
  async request(method, url, data) {
    const caller = import_tasenor_common14.net[method];
    const fullUrl = url.startsWith("/") ? `${this.api}${url}` : `${this.api}/${url}`;
    return this.doRequest(caller, fullUrl, data);
  }
  async requestUi(method, url, data) {
    const caller = import_tasenor_common14.net[method];
    const fullUrl = url.startsWith("/") ? `${this.uiApi}${url}` : `${this.uiApi}/${url}`;
    return this.doRequest(caller, fullUrl, data);
  }
  async doRequest(caller, fullUrl, data) {
    let result = null;
    let error7;
    const max = this.args.retry || 0;
    for (let i = -1; i < max; i++) {
      try {
        result = await caller(fullUrl, data);
        if (result && result.success) {
          return result;
        }
        error7 = new Error(JSON.stringify(result));
      } catch (err) {
        error7 = err;
      }
      const delay = (i + 1) * 5;
      (0, import_tasenor_common14.note)(`Waiting for ${delay} seconds`);
      await (0, import_tasenor_common14.waitPromise)(delay * 1e3);
    }
    throw error7;
  }
  async login() {
    if (this.token)
      return;
    (0, import_tasenor_common14.log)(`Logging in to ${this.api} as ${this.user}`);
    const resp = await this.request("POST", "/auth", { user: this.user, password: this.password });
    if (resp.success && resp.data && resp.data instanceof Object) {
      if ("token" in resp.data && "refresh" in resp.data) {
        const { token, refresh } = resp.data;
        this.configureApi(this.api, { token, refresh });
        this.configureApi(this.uiApi, { token, refresh });
        this.token = token;
      }
    }
  }
  configureApi(api, tokens2 = void 0) {
    import_tasenor_common14.net.configure({ sites: { [api]: {} } });
    if (tokens2) {
      import_tasenor_common14.net.setConf(api, "token", tokens2.token);
      import_tasenor_common14.net.setConf(api, "refreshToken", tokens2.refresh);
    }
  }
};
var CLI = class extends CLIRunner {
  constructor() {
    super();
    this.commands = {
      account: new account_default(this),
      db: new db_default(this),
      balance: new balance_default(this),
      entry: new entry_default(this),
      import: new import_default(this),
      importer: new importer_default(this),
      period: new period_default(this),
      plugin: new plugin_default(this),
      report: new report_default(this),
      settings: new settings_default(this),
      stock: new stock_default(this),
      tag: new tag_default(this),
      tx: new tx_default(this),
      user: new user_default(this)
    };
  }
  addDefaults(defaults) {
    for (const def of defaults) {
      const { name, envName, defaultValue } = def;
      if (this.args[name] === void 0) {
        this.args[name] = import_process.default.env[envName] || defaultValue;
      }
    }
  }
  async run(defaults = [], explicitArgs = []) {
    const pop = (args, name) => {
      const ret = args[name];
      delete args[name];
      if (!ret)
        return "";
      return typeof ret === "string" ? ret : ret[0];
    };
    const parser = new import_argparse.ArgumentParser({
      description: "Tasenor command line tool"
    });
    parser.add_argument("command", { help: "Command handling the operation", choices: Object.keys(this.commands) });
    parser.add_argument("--debug", "-d", { help: "If set, show logs for requests etc", action: "store_true", required: false });
    parser.add_argument("--json", { help: "If set, show output as JSON", action: "store_true", required: false });
    parser.add_argument("--verbose", "-v", { help: "If set, show more comprehensive output", action: "store_true", required: false });
    parser.add_argument("--user", { help: "User email for logging in (use USERNAME env by default)", type: String, required: false });
    parser.add_argument("--password", { help: "User password for logging in (use PASSWORD env by default)", type: String, required: false });
    parser.add_argument("--api", { help: "The server base URL providing Bookkeeper API (use API env by default)", type: String, required: false });
    parser.add_argument("--ui-api", { help: "The server base URL providing Bookkeeper UI API (use UI_API env by default)", type: String, required: false });
    parser.add_argument("--retry", { help: "If given, retry this many times if network call fails", type: Number, required: false });
    this.originalArgs = explicitArgs.length ? (0, import_clone2.default)(explicitArgs) : (0, import_clone2.default)(import_process.default.argv.splice(2));
    let cmd;
    for (let i = 0; i < this.originalArgs.length; i++) {
      if (this.commands[this.originalArgs[i]]) {
        cmd = this.commands[this.originalArgs[i]];
        break;
      }
    }
    if (cmd) {
      cmd.addArguments(parser);
    }
    this.args = parser.parse_args(this.originalArgs);
    cmd?.setArgs(this.args);
    this.addDefaults(defaults);
    this.user = pop(this.args, "user");
    this.password = pop(this.args, "password");
    this.api = pop(this.args, "api");
    this.uiApi = pop(this.args, "ui_api");
    delete this.args.command;
    if (!this.args.debug) {
      (0, import_tasenor_common14.mute)();
    }
    if (this.api) {
      this.configureApi(this.api);
    }
    if (this.uiApi) {
      this.configureApi(this.uiApi);
    }
    cmd && await cmd.run();
  }
};
var cli = {
  ask,
  exit
};

// src/database/index.ts
init_shim();

// src/database/BookkeeperImporter.ts
init_shim();
var import_fast_glob = __toESM(require_out4());
var import_path2 = __toESM(require("path"));
var import_fs5 = __toESM(require("fs"));
var import_tasenor_common16 = require("@dataplug/tasenor-common");

// src/database/DB.ts
init_shim();
var import_tasenor_common15 = require("@dataplug/tasenor-common");
var import_knex = __toESM(require("knex"));
var import_pg = require("pg");
var import_pg_types = __toESM(require_pg_types());
var import_ts_opaque = require("ts-opaque");
var parseDate = (val) => val;
import_pg.types.setTypeParser(import_pg_types.builtins.TIMESTAMPTZ, parseDate);
import_pg.types.setTypeParser(import_pg_types.builtins.TIMESTAMP, parseDate);
import_pg.types.setTypeParser(import_pg_types.builtins.DATE, parseDate);
var exists = async (master, name) => {
  return !!await master("databases").select("*").where({ name }).first();
};
var getConfig = async (master, name, hostOverride = null) => {
  const coder = new import_tasenor_common15.Crypto(vault.get("SECRET"));
  const userDb = await master("databases").select("*").where({ name }).first();
  const password = coder.decrypt(userDb.password);
  if (!password) {
    throw new Error("Failed to get password.");
  }
  return {
    client: "postgresql",
    connection: {
      host: hostOverride === null ? userDb.host : hostOverride,
      port: userDb.port,
      database: userDb.name,
      user: userDb.user,
      password
    },
    pool: {
      min: 1,
      max: 3
    }
  };
};
var cache = {};
var get = async (master, name, hostOverride = null) => {
  if (!await exists(master, name)) {
    delete cache[name];
    throw new Error(`Database '${name}' does not exist.`);
  }
  const cacheName = hostOverride ? `${name}:${hostOverride}` : name;
  if (!cache[cacheName]) {
    const knexConfig = await getConfig(master, name, hostOverride);
    cache[cacheName] = (0, import_knex.default)(knexConfig);
  }
  return cache[cacheName];
};
var disconnect = async (name) => {
  for (const conn of Object.entries(cache)) {
    if (conn[0].split(":")[0] === name) {
      (0, import_tasenor_common15.log)(`Disconnecting ${conn[0]}`);
      await conn[1].destroy();
      delete cache[conn[0]];
    }
  }
};
var getRootConfig = () => {
  const url = new URL(vault.get("DATABASE_URL"));
  const knexConfig = {
    client: "postgresql",
    connection: {
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      database: "postgres",
      user: vault.get("DATABASE_ROOT_USER"),
      password: vault.get("DATABASE_ROOT_PASSWORD")
    },
    pool: {
      min: 1,
      max: 1
    }
  };
  return knexConfig;
};
var getKnexConfig = (knexUrl) => {
  const url = new URL(knexUrl);
  return {
    client: "postgresql",
    connection: {
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      database: url.pathname.replace(/^\//, ""),
      user: url.username,
      password: url.password
    },
    pool: {
      min: 1,
      max: 5
    }
  };
};
var rootCache;
var getRoot = () => {
  if (rootCache)
    return rootCache;
  rootCache = (0, import_knex.default)(getRootConfig());
  return rootCache;
};
var getMasterConfig = () => {
  return getKnexConfig(vault.get("DATABASE_URL"));
};
var masterCache;
var getMaster = () => {
  if (masterCache)
    return masterCache;
  masterCache = (0, import_knex.default)(getMasterConfig());
  return masterCache;
};
var isValidName = (name) => {
  return (0, import_tasenor_common15.isDatabaseName)(name);
};
var create = async (masterDb, name, host, port, migrations = null, hostOverride = null) => {
  if (await exists(masterDb, name)) {
    throw new Error(`Database '${name}' exist.`);
  }
  if (!isValidName(name)) {
    throw new Error(`Invalid database name '${name}'.`);
  }
  const rootDb = getRoot();
  const user = "user" + randomString(20);
  const password = randomString(64);
  const crypto2 = new import_tasenor_common15.Crypto(vault.get("SECRET"));
  const entry = {
    name,
    host,
    port,
    user,
    password: crypto2.encrypt(password),
    config: {}
  };
  await rootDb.raw(`CREATE USER "${user}" WITH PASSWORD '${password}'`);
  await rootDb.raw(`CREATE DATABASE "${name}"`);
  await rootDb.raw(`GRANT ALL PRIVILEGES ON DATABASE "${name}" TO "${user}"`);
  const id = (await masterDb("databases").insert(entry).returning("id"))[0].id;
  if (migrations) {
    await migrate(masterDb, name, migrations, hostOverride);
  }
  return id;
};
var migrate = async (masterDb, name, migrations, hostOverride = null) => {
  const conf = await getConfig(masterDb, name, hostOverride);
  conf.migrations = { directory: migrations };
  const db = (0, import_knex.default)(conf);
  await db.migrate.latest();
  await db.destroy();
};
var rollback = async (masterDb, name, migrations, hostOverride = null) => {
  const conf = await getConfig(masterDb, name, hostOverride);
  conf.migrations = { directory: migrations };
  const db = (0, import_knex.default)(conf);
  await db.migrate.rollback();
  await db.destroy();
};
var destroy = async (masterDb, name, hostOverride = null) => {
  const db = await masterDb("databases").where({ name }).first();
  if (!db) {
    return "Database not found.";
  }
  const dbToDelete = await get(masterDb, name, hostOverride);
  await dbToDelete.raw(`DROP OWNED BY ${db.user}`);
  disconnect(name);
  await masterDb("database_users").where({ database_id: db.id }).delete();
  await masterDb("databases").where({ id: db.id }).delete();
  const rootDb = getRoot();
  await rootDb.raw(`DROP OWNED BY ${db.user}`);
  await rootDb.raw(`DROP USER ${db.user}`);
  await rootDb.raw(`DROP DATABASE ${db.name} WITH (FORCE)`);
  return null;
};
async function findName(masterDb, init) {
  let n = 1;
  let name = init;
  while (await exists(masterDb, (0, import_ts_opaque.create)(name))) {
    n++;
    name = `${init}${n}`;
  }
  return name;
}
async function disconnectAll() {
  if (masterCache) {
    (0, import_tasenor_common15.log)("Disconnecting master DB.");
    await masterCache.destroy();
  }
  if (rootCache) {
    (0, import_tasenor_common15.log)("Disconnecting root DB.");
    await rootCache.destroy();
  }
  for (const conn of Object.entries(cache)) {
    (0, import_tasenor_common15.log)(`Disconnecting ${conn[0]}`);
    await conn[1].destroy();
  }
}
async function customerDbs(hostOverride = null) {
  const all = [];
  await vault.initialize();
  const master = await getMaster();
  const dbs = await master("databases").select("name", "host", "port", "user", "password");
  for (const db of dbs) {
    const conf = await getConfig(master, db.name, hostOverride);
    const { host, port, database, user, password } = conf.connection;
    all.push({ host, port, database, user, password });
  }
  return all;
}
function envHost() {
  if (!import_process.default.env.DATABASE_URL) {
    return null;
  }
  const url = new URL(import_process.default.env.DATABASE_URL);
  return url.hostname;
}
var DB = {
  create,
  customerDbs,
  destroy,
  disconnectAll,
  envHost,
  exists,
  findName,
  get,
  getConfig,
  getKnexConfig,
  getMaster,
  getMasterConfig,
  getRoot,
  getRootConfig,
  isValidName,
  migrate,
  rollback
};

// src/database/BookkeeperImporter.ts
var import_ts_opaque2 = require("ts-opaque");
var BookkeeperImporter = class {
  constructor() {
    this.VERSION = null;
  }
  async readTsv(file) {
    (0, import_tasenor_common16.log)(`Reading ${file}.`);
    const content = import_fs5.default.readFileSync(file).toString("utf-8").trim();
    const lines = content.split("\n").map((s) => s.split("	"));
    const headers = lines[0];
    headers[0] = headers[0].replace(/^#\s+/, "");
    const objects = [];
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = lines[i][j] || "";
      }
      objects.push(obj);
    }
    return objects;
  }
  setVersion(file) {
    this.VERSION = JSON.parse(import_fs5.default.readFileSync(file).toString("utf-8"));
    (0, import_tasenor_common16.log)(`Found file format version ${this.VERSION}.`);
  }
  async readAccountTsv(file) {
    const match = /([a-z][a-z])-([A-Z][A-Z][A-Z])\.tsv$/.exec(file);
    if (!match) {
      throw new Error(`File name ${file} has not correct format.`);
    }
    const entries = [];
    const [, language, currency] = match;
    const accounts = await this.readTsv(file);
    let headings = [];
    for (const account of accounts) {
      if (account.text !== "") {
        const flags = new Set(account.flags ? account.flags.split(" ") : []);
        const code = !account.code ? null : /^\d+(\.\d+)$/.test(account.code) ? account.code : account.code.replace(/^_+/, "");
        let data;
        try {
          data = account.data === void 0 || account.data === "" ? {} : JSON.parse(account.data);
        } catch (err) {
          throw new Error(`Parsing account data failed: ${account.data}.`);
        }
        if (code !== null) {
          data.code = code;
        }
        if (flags.has("FAVOURITE")) {
          data.favourite = true;
        }
        const entry = {
          language,
          currency,
          number: account["number / title"],
          name: account.text,
          type: account.type,
          data
        };
        if (headings.length) {
          for (const heading of headings) {
            heading.number = entry.number;
            entries.push(heading);
          }
          headings = [];
        }
        entries.push(entry);
      } else {
        const spaces = /^(_*)/.exec(account["number / title"]);
        const entry = {
          text: account["number / title"].replace(/^_+/, ""),
          number: null,
          level: spaces ? spaces[1].length : 0
        };
        headings.push(entry);
      }
    }
    return entries;
  }
  async setAccounts(db, files) {
    let count = 0;
    for (const file of files) {
      const accounts = await this.readAccountTsv(file);
      for (const entry of accounts) {
        if (entry.text) {
          await db("heading").insert(entry).catch((err) => {
            (0, import_tasenor_common16.error)(`Failed to insert a heading ${JSON.stringify(entry)}`);
            throw err;
          });
        } else {
          await db("account").insert(entry).catch((err) => {
            (0, import_tasenor_common16.error)(`Failed to insert an account ${JSON.stringify(entry)}`);
            throw err;
          });
        }
        count++;
      }
    }
    (0, import_tasenor_common16.log)(`Inserted ${count} rows to the database.`);
  }
  async setPeriods(db, file) {
    (0, import_tasenor_common16.log)(`Reading period file ${file}.`);
    let count = 0;
    const periods = await this.readTsv(file);
    for (const period of periods) {
      const entry = {
        start_date: period.start,
        end_date: period.end,
        locked: period.flags === "LOCKED"
      };
      await db("period").insert(entry);
      count++;
    }
    (0, import_tasenor_common16.log)(`Inserted ${count} rows to the database.`);
  }
  async setEntries(db, file, conf) {
    (0, import_tasenor_common16.log)(`Reading entry file ${file}.`);
    let count = 0;
    const periods = await db("period").select("id").orderBy("start_date");
    const periodMap = {};
    const accounts = await db("account").select("id", "number").where({ language: conf.language });
    const accountMap = accounts.reduce((prev, cur) => ({ [cur.number]: cur.id, ...prev }), {});
    let n = 1;
    for (const period of periods) {
      periodMap[n++] = period.id;
    }
    const data = await this.readTsv(file);
    let periodId, docId, rowNumber;
    for (const line of data) {
      const check2 = /^Period (\d+)/.exec(line.number);
      if (check2) {
        periodId = periodMap[parseInt(check2[1])];
        if (!periodId) {
          throw Error(`Inconsistent periods. Cannot find period number ${n}.`);
        }
        continue;
      }
      if (line.number !== "") {
        const entry2 = {
          period_id: periodId,
          number: parseInt(line.number),
          date: line["date / account"]
        };
        docId = (await db("document").insert(entry2).returning("id"))[0].id;
        count++;
        rowNumber = 1;
        continue;
      }
      if (!accountMap[line["date / account"]]) {
        throw Error(`Inconsistent accounts. Cannot account find number ${line["date / account"]}.`);
      }
      const amount = parseFloat(line.amount);
      const flags = new Set(line.flags.split(" "));
      const data2 = {};
      if (flags.has("VAT_IGNORE") || flags.has("VAT_RECONCILED")) {
        data2.VAT = {};
        if (flags.has("VAT_IGNORE")) {
          data2.VAT.ignore = true;
        }
        if (flags.has("VAT_RECONCILED")) {
          data2.VAT.reconciled = true;
        }
      }
      const entry = {
        document_id: docId,
        account_id: accountMap[line["date / account"]],
        debit: !(amount < 0),
        amount: Math.abs(amount),
        description: line.text,
        row_number: rowNumber,
        data: data2
      };
      rowNumber++;
      await db("entry").insert(entry).catch((err) => {
        (0, import_tasenor_common16.error)(`Failed to insert an entry ${JSON.stringify(entry)}`);
        throw err;
      });
      count++;
    }
    (0, import_tasenor_common16.log)(`Inserted ${count} rows to the database.`);
  }
  async setConfig(db, config2) {
    (0, import_tasenor_common16.log)("Saving configuration.");
    const transform = (config3, prefix = "") => {
      const ret = {};
      Object.keys(config3).forEach((k) => {
        if (config3[k] !== null && typeof config3[k] === "object" && config3[k].length === void 0) {
          Object.assign(ret, transform(config3[k], `${k}.`));
        } else {
          ret[`${prefix}${k}`] = config3[k];
        }
      });
      return ret;
    };
    for (const [k, v] of Object.entries(transform(config2))) {
      await db("settings").insert({ name: k, value: JSON.stringify(v) });
    }
  }
  async setTags(db, file) {
    (0, import_tasenor_common16.log)(`Reading tag file ${file}.`);
    const picPath = import_path2.default.dirname(file);
    let count = 0;
    const tags = await this.readTsv(file);
    for (const tag of tags) {
      const pic = import_fs5.default.readFileSync(import_path2.default.join(picPath, tag.picture));
      const entry = {
        tag: tag.tag,
        name: tag.name,
        mime: tag.mime,
        picture: pic,
        type: tag.type,
        order: tag.order
      };
      await db("tags").insert(entry);
      count++;
    }
    (0, import_tasenor_common16.log)(`Inserted ${count} rows to the database.`);
  }
  async clearEverything(db) {
    (0, import_tasenor_common16.log)("Deleting all existing data.");
    await db("entry").del();
    await db("document").del();
    await db("account").del();
    await db("heading").del();
    await db("period").del();
    await db("tags").del();
    await db("settings").del();
  }
  async restore(masterDb, dbName, out, hostOverride = null) {
    const userDb = await DB.get(masterDb, (0, import_ts_opaque2.create)(dbName), hostOverride);
    this.setVersion((0, import_ts_opaque2.create)(import_path2.default.join(out, "VERSION")));
    const conf = JSON.parse(import_fs5.default.readFileSync(import_path2.default.join(out, "settings.json")).toString("utf-8"));
    if (!conf.language) {
      throw new Error("Configuration does not have language.");
    }
    await this.clearEverything(userDb);
    await this.setConfig(userDb, conf);
    const files = import_fast_glob.default.sync(import_path2.default.join(out, "accounts", "*"));
    await this.setAccounts(userDb, files);
    const periodsPath = import_path2.default.join(out, "periods.tsv");
    await this.setPeriods(userDb, (0, import_ts_opaque2.create)(periodsPath));
    const entriesPath = import_path2.default.join(out, "entries.tsv");
    await this.setEntries(userDb, (0, import_ts_opaque2.create)(entriesPath), conf);
    const tagsPath = import_path2.default.join(out, "tags.tsv");
    await this.setTags(userDb, (0, import_ts_opaque2.create)(tagsPath));
  }
  async run(masterDb, dbName, tarPath, out, hostOverride = null) {
    tarPath = (0, import_ts_opaque2.create)(import_path2.default.resolve(tarPath));
    if (!import_fs5.default.existsSync(tarPath)) {
      throw new Error(`Backup ${tarPath} does not exist.`);
    }
    await system(`cd "${out}" && tar xf "${tarPath}"`);
    await this.restore(masterDb, dbName, out, hostOverride);
    await system(`rm -fr "${out}"`);
  }
};

// src/error.ts
init_shim();
var ProcessingError = class extends Error {
};
var InvalidFile = class extends ProcessingError {
};
var InvalidArgument = class extends ProcessingError {
};
var BadState = class extends ProcessingError {
};
var NotImplemented = class extends ProcessingError {
};
var NotFound = class extends ProcessingError {
};
var DatabaseError = class extends ProcessingError {
};
var SystemError = class extends ProcessingError {
};
var AskUI = class extends Error {
  constructor(element) {
    super("Need more information from UI.");
    this.element = element;
  }
};
function isAskUI(obj) {
  return obj instanceof Error && "element" in obj;
}

// src/export/index.ts
init_shim();

// src/export/Exporter.ts
init_shim();
var import_path3 = __toESM(require("path"));
var import_fs6 = __toESM(require("fs"));
var import_tasenor_common18 = require("@dataplug/tasenor-common");
var import_ts_opaque3 = require("ts-opaque");

// src/system.ts
init_shim();
var import_child_process = require("child_process");
var import_tasenor_common17 = require("@dataplug/tasenor-common");
async function system(command, quiet = false) {
  if (!quiet) {
    (0, import_tasenor_common17.log)(`Running system command: ${command}`);
  }
  return new Promise((resolve, reject) => {
    (0, import_child_process.exec)(command, { maxBuffer: 1024 * 1024 * 500 }, (err, stdout, stderr) => {
      if (err) {
        if (!quiet)
          (0, import_tasenor_common17.error)(err);
        return reject(err);
      }
      if (stderr && !quiet) {
        (0, import_tasenor_common17.note)(`${stderr}`);
      }
      if (stdout && !quiet) {
        (0, import_tasenor_common17.log)(`${stdout}`);
      }
      resolve(stdout);
    });
  });
}
async function systemPiped(command, quiet = false, ignoreError = false) {
  if (!quiet) {
    (0, import_tasenor_common17.log)(`Running system command: ${command}`);
  }
  return new Promise((resolve, reject) => {
    let out = "";
    const proc = (0, import_child_process.spawn)(command, { shell: true });
    proc.stdout.on("data", (data) => {
      out += data;
      if (!quiet)
        import_process.default.stdout.write(data);
    });
    proc.stderr.on("data", (data) => {
      if (!quiet)
        import_process.default.stderr.write(data);
    });
    proc.on("close", (code) => {
      if (code) {
        if (ignoreError) {
          resolve(null);
        } else {
          reject(new Error(`Call '${command}' failed with code ${code}.`));
        }
      } else {
        resolve(out);
      }
    });
  });
}
function isProduction() {
  return !isDevelopment();
}
function nodeEnv() {
  const env = import_process.default.env.NODE_ENV || "production";
  if (!["development", "staging", "production"].includes(env)) {
    throw new Error(`Invalid NODE_ENV ${env}.`);
  }
  return env;
}
function isDevelopment() {
  return nodeEnv() === "development";
}

// src/export/Exporter.ts
var import_dayjs = __toESM(require("dayjs"));
var Exporter = class {
  constructor() {
    this.VERSION = 1;
  }
  async getAccounts(db) {
    throw new Error(`Exporter ${this.constructor.name} does not implement getAccounts().`);
  }
  async getPeriods(db) {
    throw new Error(`Exporter ${this.constructor.name} does not implement getPeriods().`);
  }
  async getEntries(db) {
    throw new Error(`Exporter ${this.constructor.name} does not implement getEntries().`);
  }
  async getConfig(db) {
    throw new Error(`Exporter ${this.constructor.name} does not implement getConfig().`);
  }
  async getTags(db, out) {
    throw new Error(`Exporter ${this.constructor.name} does not implement getTags().`);
  }
  writeTsv(path10, lines) {
    (0, import_tasenor_common18.log)(`Writing ${path10}`);
    import_fs6.default.writeFileSync(path10, lines.map((l) => l.join("	")).join("\n") + "\n");
  }
  writeJson(path10, data) {
    (0, import_tasenor_common18.log)(`Writing ${path10}`);
    import_fs6.default.writeFileSync(path10, JSON.stringify(data, null, 4) + "\n");
  }
  async dump(db, out) {
    const accountDir = import_path3.default.join(out, "accounts");
    if (!import_fs6.default.existsSync(accountDir)) {
      import_fs6.default.mkdirSync(accountDir);
    }
    (0, import_tasenor_common18.log)(`Saving file format version ${this.VERSION}.`);
    this.writeJson((0, import_ts_opaque3.create)(import_path3.default.join(out, "VERSION")), this.VERSION);
    const conf = await this.getConfig(db);
    this.writeJson((0, import_ts_opaque3.create)(import_path3.default.join(out, "settings.json")), conf);
    const accounts = await this.getAccounts(db);
    this.writeTsv((0, import_ts_opaque3.create)(import_path3.default.join(accountDir, "fi-EUR.tsv")), accounts);
    const periods = await this.getPeriods(db);
    this.writeTsv((0, import_ts_opaque3.create)(import_path3.default.join(out, "periods.tsv")), periods);
    const entries = await this.getEntries(db);
    this.writeTsv((0, import_ts_opaque3.create)(import_path3.default.join(out, "entries.tsv")), entries);
    const tags = await this.getTags(db, out);
    this.writeTsv((0, import_ts_opaque3.create)(import_path3.default.join(out, "tags.tsv")), tags);
    return conf;
  }
  async makeTar(conf, out, destPath) {
    const name = conf.companyName || "unknown";
    const tar = `${name.replace(/[^-a-zA-Z0-9]/, "_")}-${(0, import_dayjs.default)().format("YYYY-MM-DD")}-export.tgz`;
    const tarPath = `${out}/../${tar}`;
    const dest = import_process.default.cwd();
    if (!destPath) {
      destPath = (0, import_ts_opaque3.create)(import_path3.default.join(dest, tar));
    }
    if (import_path3.default.dirname(destPath) === ".") {
      destPath = (0, import_ts_opaque3.create)(import_path3.default.join(dest, import_path3.default.basename(destPath)));
    }
    await system(`cd "${out}" && tar cjf "${tarPath}" . && mv "${tarPath}" "${destPath}" && rm -fr ${out}`);
    (0, import_tasenor_common18.log)(`Package ready ${destPath}`);
    return destPath;
  }
};

// src/export/TilitinExporter.ts
init_shim();
var import_knex2 = __toESM(require("knex"));
var import_dayjs2 = __toESM(require("dayjs"));
var import_utc = __toESM(require("dayjs/plugin/utc"));
var import_path4 = __toESM(require("path"));
var import_fs7 = __toESM(require("fs"));
var import_tasenor_common19 = require("@dataplug/tasenor-common");
import_dayjs2.default.extend(import_utc.default);
var VAT_IGNORE = 1;
var VAT_RECONCILED = 2;
var ACCOUNT_TYPES = Object.keys(import_tasenor_common19.AccountType);
function dateFromDb(date) {
  const str = import_dayjs2.default.utc(date).add(2, "hours").format("YYYY-MM-DD");
  return str;
}
var TilitinExporter = class extends Exporter {
  database(path10) {
    return (0, import_knex2.default)({
      client: "sqlite3",
      connection: {
        filename: path10
      },
      useNullAsDefault: true
    });
  }
  async getAccounts(db) {
    const headings = {};
    for (const heading of await db("coa_heading").select("*").orderBy("level")) {
      headings[heading.number] = headings[heading.number] || [];
      let tab = "";
      for (let i = 0; i < heading.level; i++) {
        tab += "_";
      }
      heading.text = tab + heading.text;
      headings[heading.number].push(heading);
    }
    const lines = [["# number / title", "text", "type", "code", "flags", "data"]];
    for (const account of await db("account").select("*").orderBy("number")) {
      if (headings[account.number]) {
        for (const heading of headings[account.number]) {
          lines.push([heading.text, "", "", "", "", ""]);
        }
      }
      lines.push([account.number, account.name, ACCOUNT_TYPES[account.type], account.vat_percentage || "", account.flags ? "FAVOURITE" : "", ""]);
    }
    (0, import_tasenor_common19.log)(`Found ${lines.length} lines of data for headings and accounts.`);
    return lines;
  }
  async getPeriods(db) {
    const lines = [["# start", "end", "flags"]];
    for (const period of await db("period").select("*").orderBy("start_date")) {
      lines.push([dateFromDb(period.start_date), dateFromDb(period.end_date), period.locked ? "LOCKED" : ""]);
    }
    (0, import_tasenor_common19.log)(`Found ${lines.length} lines of data for periods.`);
    return lines;
  }
  async getEntries(db) {
    const lines = [["# number", "date / account", "amount", "text", "flags"]];
    let n = 1;
    for (const period of await db("period").select("*").orderBy("start_date")) {
      lines.push([`Period ${n}`, "", "", "", ""]);
      for (const doc of await db("document").select("*").where({ period_id: period.id }).orderBy("period_id", "number")) {
        lines.push([doc.number, dateFromDb(doc.date), "", "", ""]);
        for (const entry of await db("entry").join("account", "entry.account_id", "account.id").select("entry.*", "account.number").where({ document_id: doc.id }).orderBy("row_number")) {
          const flags = [];
          if (entry.flags & VAT_IGNORE) {
            flags.push("VAT_IGNORE");
          }
          if (entry.flags & VAT_RECONCILED) {
            flags.push("VAT_RECONCILED");
          }
          lines.push(["", entry.number, entry.debit ? entry.amount : -entry.amount, entry.description, flags.join(" ")]);
        }
      }
      n++;
    }
    (0, import_tasenor_common19.log)(`Found ${lines.length} lines of data for documents and entries.`);
    return lines;
  }
  async hasTable(db, table) {
    let hasTable = true;
    try {
      await db(table).select("*").limit(1);
    } catch (err) {
      hasTable = false;
    }
    return hasTable;
  }
  async getConfig(db) {
    const conf = import_tasenor_common19.Bookkeeper.createConfig();
    conf.language = "fi";
    conf.currency = "EUR";
    conf.scheme = "FinnishLimitedCompanyComplete";
    conf.schemeVersion = "1.0.0";
    if (await db("account").select("*").where({ number: "29391" }).first()) {
      conf.VAT = {
        salesAccount: "29391",
        purchasesAccount: "29392",
        receivableAccount: "1763",
        payableAccount: "2939",
        delayedReceivableAccount: "1845",
        delayedPayableAccount: "2977",
        statementTagTypes: []
      };
    }
    for (const setting of await db("settings").select("name", "business_id")) {
      conf.companyName = setting.name;
      conf.companyCode = setting.business_id;
    }
    if (await this.hasTable(db, "fyffe_settings")) {
      for (const setting of await db("fyffe_settings").select("*")) {
        switch (setting.name) {
          case "income-statement-tag-types":
            conf.FinnishIncomeStatementReport = { tagTypes: JSON.parse(setting.value) };
            break;
          default:
            throw new Error(`Unable to parse setting '${setting.name}'`);
        }
      }
    }
    if (conf.VAT && conf.VAT.statementTagTypes && !conf.FinnishIncomeStatementReport) {
      conf.FinnishIncomeStatementReport = {
        tagTypes: conf.VAT.statementTagTypes
      };
    }
    return conf;
  }
  async getTags(db, out) {
    const lines = [["# tag", "name", "mime", "picture", "type", "order"]];
    const picDir = import_path4.default.join(out, "pictures");
    if (!import_fs7.default.existsSync(picDir)) {
      import_fs7.default.mkdirSync(picDir);
    }
    if (await this.hasTable(db, "tags")) {
      for (const tag of await db("tags").select("*").orderBy("order")) {
        const ext = tag.mime.split("/")[1];
        const file = `${tag.type}-${tag.order}.${ext}`;
        import_fs7.default.writeFileSync(import_path4.default.join(picDir, file), tag.picture);
        lines.push([tag.tag, tag.name, tag.mime, import_path4.default.join("pictures", file), tag.type, tag.order]);
      }
    }
    (0, import_tasenor_common19.log)(`Found ${lines.length} lines of data for tags.`);
    return lines;
  }
  async getReports(db) {
    const reports = {};
    for (const report of await db("report_structure").select("*")) {
      reports[report.id] = report.data;
    }
    (0, import_tasenor_common19.log)(`Found reports ${Object.keys(reports)}.`);
    return reports;
  }
  convertReport(report) {
    const lines = [["# accounts", "title", "flags"]];
    for (const line of report.trim().split("\n")) {
      let entries;
      if (line === "")
        continue;
      if (line === "-") {
        entries = ["", "", ["BREAK"]];
      } else if (line === "--") {
        entries = ["", "", ["NEW_PAGE"]];
      } else {
        const parts = line.split(";");
        const code = parts[0];
        let tab = "";
        for (let i = 0; i < parseInt(code[2]); i++) {
          tab += "_";
        }
        let flags = [];
        switch (code[0]) {
          case "H":
            flags = ["HIDE_TOTAL", "REQUIRED"];
            break;
          case "G":
            flags = ["HIDE_TOTAL"];
            break;
          case "S":
            flags = ["REQUIRED"];
            break;
          case "D":
            flags = ["DETAILS"];
            break;
          case "T":
            break;
          default:
            throw new Error(`Cannot parse letter ${code[0]} in report code ${code} of line ${line}.`);
        }
        switch (code[1]) {
          case "B":
            flags.push("BOLD");
            break;
          case "I":
            flags.push("ITALIC");
            break;
          case "P":
            break;
          default:
            throw new Error(`Cannot parse letter ${code[1]} in report code ${code} of line ${line}.`);
        }
        if (parts.length === 4) {
          entries = [`${parts[1]}-${parts[2]}`, tab + parts[3], flags];
        } else if (parts.length === 6) {
          entries = [`${parts[1]}-${parts[2]} ${parts[3]}-${parts[4]}`, tab + parts[5], flags];
        } else if (parts.length === 8) {
          entries = [`${parts[1]}-${parts[2]} ${parts[3]}-${parts[4]} ${parts[5]}-${parts[6]}`, tab + parts[7], flags];
        } else {
          throw new Error(`Unable to parse line ${line} since there are ${parts.length} parts.`);
        }
      }
      lines.push([entries[0], entries[1], entries[2].join(" ")]);
    }
    return lines;
  }
  async run(sqlite, out, destPath) {
    if (!import_fs7.default.existsSync(sqlite)) {
      throw new Error(`Database ${out} does not exist.`);
    }
    const db = this.database(sqlite);
    const conf = await this.dump(db, out);
    return this.makeTar(conf, out, destPath);
  }
};

// src/export/TasenorExporter.ts
init_shim();
var import_tasenor_common20 = require("@dataplug/tasenor-common");
var import_knex3 = __toESM(require("knex"));
var import_dot_object = __toESM(require("dot-object"));
var import_path5 = __toESM(require("path"));
var import_fs8 = __toESM(require("fs"));
var TasenorExporter = class extends Exporter {
  async getConfig(db) {
    const conf = import_tasenor_common20.Bookkeeper.createConfig();
    const settings = {};
    for (const setting of await db("settings").select("*")) {
      settings[setting.name] = setting.value;
    }
    Object.assign(conf, import_dot_object.default.object(settings));
    return conf;
  }
  async getAccounts(db) {
    const headings = {};
    for (const heading of await db("heading").select("*").orderBy("level")) {
      headings[heading.number] = headings[heading.number] || [];
      let tab = "";
      for (let i = 0; i < heading.level; i++) {
        tab += "_";
      }
      heading.text = tab + heading.text;
      headings[heading.number].push(heading);
    }
    const lines = [["# number / title", "text", "type", "code", "flags", "data"]];
    for (const account of await db("account").select("*").orderBy("number")) {
      if (headings[account.number]) {
        for (const heading of headings[account.number]) {
          lines.push([heading.text, "", "", "", "", ""]);
        }
      }
      const flags = [];
      if (account.data.favourite)
        flags.push("FAVOURITE");
      const code = account.data.code || "";
      delete account.data.code;
      delete account.data.favourite;
      lines.push([account.number, account.name, account.type, code, flags.join(" "), Object.keys(account.data).length ? JSON.stringify(account.data) : ""]);
    }
    (0, import_tasenor_common20.log)(`Found ${lines.length} lines of data for headings and accounts.`);
    return lines;
  }
  async getPeriods(db) {
    const lines = [["# start", "end", "flags"]];
    for (const period of await db("period").select("*").orderBy("start_date")) {
      lines.push([period.start_date, period.end_date, period.locked ? "LOCKED" : ""]);
    }
    (0, import_tasenor_common20.log)(`Found ${lines.length} lines of data for periods.`);
    return lines;
  }
  async getEntries(db) {
    const lines = [["# number", "date / account", "amount", "text", "flags"]];
    let n = 1;
    for (const period of await db("period").select("*").orderBy("start_date")) {
      lines.push([`Period ${n}`, "", "", "", ""]);
      for (const doc of await db("document").select("*").where({ period_id: period.id }).orderBy("period_id", "number")) {
        lines.push([doc.number, doc.date, "", "", ""]);
        for (const entry of await db("entry").join("account", "entry.account_id", "account.id").select("entry.*", "account.number").where({ document_id: doc.id }).orderBy("row_number")) {
          const flags = [];
          if (entry.data.vat && entry.data.vat.ignore) {
            flags.push("VAT_IGNORE");
          }
          if (entry.data.vat && entry.data.vat.reconciled) {
            flags.push("VAT_RECONCILED");
          }
          lines.push(["", entry.number, entry.debit ? entry.amount : -entry.amount, entry.description, flags.join(" ")]);
        }
      }
      n++;
    }
    (0, import_tasenor_common20.log)(`Found ${lines.length} lines of data for documents and entries.`);
    return lines;
  }
  async getTags(db, out) {
    const lines = [["# tag", "name", "mime", "picture", "type", "order"]];
    const picDir = import_path5.default.join(out, "pictures");
    if (!import_fs8.default.existsSync(picDir)) {
      import_fs8.default.mkdirSync(picDir);
    }
    for (const tag of await db("tags").select("*").orderBy("order")) {
      const ext = tag.mime.split("/")[1];
      const file = `${tag.type}-${tag.order}.${ext}`;
      import_fs8.default.writeFileSync(import_path5.default.join(picDir, file), tag.picture);
      lines.push([tag.tag, tag.name, tag.mime, import_path5.default.join("pictures", file), tag.type, tag.order]);
    }
    (0, import_tasenor_common20.log)(`Found ${lines.length} lines of data for tags.`);
    return lines;
  }
  async run(dbUrl, out, destPath = void 0) {
    const db = DB.getKnexConfig(dbUrl);
    const conf = await this.dump((0, import_knex3.default)(db), out);
    return this.makeTar(conf, out, destPath);
  }
  async runDb(db, out, destPath = void 0) {
    const conf = await this.dump(db, out);
    return this.makeTar(conf, out, destPath);
  }
};

// src/import/index.ts
init_shim();

// src/import/TextFileProcessHandler.ts
init_shim();
var import_csv_parse = __toESM(require("csv-parse"));

// src/process/ProcessHandler.ts
init_shim();
var ProcessHandler = class {
  constructor(name) {
    this.name = name;
  }
  connect(system2) {
    this.system = system2;
  }
  canHandle(file) {
    throw new NotImplemented(`A handler '${this.name}' cannot check file '${file.name}', since canHandle() is not implemented.`);
  }
  canAppend(file) {
    throw new NotImplemented(`A handler '${this.name}' cannot append file '${file.name}', since canAppend() is not implemented.`);
  }
  checkCompletion(state) {
    throw new NotImplemented(`A handler '${this.name}' cannot check state '${JSON.stringify(state)}', since checkCompletion() is not implemented.`);
  }
  async action(process2, action, state, files) {
    throw new NotImplemented(`A handler '${this.name}' for files ${files.map((f) => `'${f}''`).join(", ")} does not implement action()`);
  }
  startingState(files) {
    throw new NotImplemented(`A handler '${this.name}' for file ${files.map((f) => `'${f}''`).join(", ")} does not implement startingState()`);
  }
  async getDirections(state, config2) {
    throw new NotImplemented(`A handler '${this.name}' for state '${JSON.stringify(state)}' does not implement getDirections()`);
  }
  async rollback(step) {
    throw new NotImplemented(`A handler '${this.name}' for step '${step}' does not implement rollback()`);
  }
};

// src/import/TextFileProcessHandler.ts
var import_tasenor_common21 = require("@dataplug/tasenor-common");
var TextFileProcessHandler = class extends ProcessHandler {
  startingState(processFiles) {
    const files = {};
    for (const processFile of processFiles) {
      files[processFile.name] = {
        lines: processFile.decode().replace(/\n+$/, "").split("\n").map((text, line) => ({
          text,
          line,
          columns: {}
        }))
      };
    }
    return {
      stage: "initial",
      files
    };
  }
  checkCompletion(state) {
    if (state.stage === "executed") {
      return true;
    }
    return void 0;
  }
  async needInputForSegmentation(state, config2) {
    return false;
  }
  async needInputForClassification(state, config2) {
    return false;
  }
  async needInputForAnalysis(state, config2) {
    return false;
  }
  async needInputForExecution(state, config2) {
    return false;
  }
  async getDirections(state, config2) {
    let input;
    let directions;
    switch (state.stage) {
      case "initial":
        input = await this.needInputForSegmentation(state, config2);
        if (input)
          return input;
        directions = new import_tasenor_common21.Directions({
          type: "action",
          action: { op: "segmentation" }
        });
        break;
      case "segmented":
        input = await this.needInputForClassification(state, config2);
        if (input)
          return input;
        directions = new import_tasenor_common21.Directions({
          type: "action",
          action: { op: "classification" }
        });
        break;
      case "classified":
        input = await this.needInputForAnalysis(state, config2);
        if (input)
          return input;
        directions = new import_tasenor_common21.Directions({
          type: "action",
          action: { op: "analysis" }
        });
        break;
      case "analyzed":
        input = await this.needInputForExecution(state, config2);
        if (input)
          return input;
        directions = new import_tasenor_common21.Directions({
          type: "action",
          action: { op: "execution" }
        });
        break;
      default:
        throw new BadState("Cannot find directions from the current state.");
    }
    return directions;
  }
  async action(process2, action, state, files) {
    if (!(0, import_tasenor_common21.isImportAction)(action)) {
      throw new BadState(`Action is not import action ${JSON.stringify(action)}`);
    }
    if ((0, import_tasenor_common21.isImportOpAction)(action)) {
      switch (action.op) {
        case "analysis":
        case "classification":
        case "segmentation":
        case "execution":
          return this[action.op](process2, state, files, process2.config);
        default:
          throw new BadState(`Cannot parse action ${JSON.stringify(action)}`);
      }
    }
    if ((0, import_tasenor_common21.isImportConfigureAction)(action)) {
      Object.assign(process2.config, action.configure);
      await process2.save();
    }
    if ((0, import_tasenor_common21.isImportAnswerAction)(action)) {
      if (!process2.config.answers) {
        process2.config.answers = {};
      }
      const answers = process2.config.answers;
      for (const segmentId of Object.keys(action.answer)) {
        answers[segmentId] = answers[segmentId] || {};
        for (const variable of Object.keys(action.answer[segmentId])) {
          answers[segmentId][variable] = action.answer[segmentId][variable];
        }
      }
      await process2.save();
    }
    return state;
  }
  async segmentation(process2, state, files, config2) {
    throw new NotImplemented(`A class ${this.constructor.name} does not implement segmentation().`);
  }
  async classification(process2, state, files, config2) {
    throw new NotImplemented(`A class ${this.constructor.name} does not implement classification().`);
  }
  async analysis(process2, state, files, config2) {
    throw new NotImplemented(`A class ${this.constructor.name} does not implement analysis().`);
  }
  async execution(process2, state, files, config2) {
    throw new NotImplemented(`A class ${this.constructor.name} does not implement execution().`);
  }
  async parseLine(line, options = {}) {
    return new Promise((resolve, reject) => {
      (0, import_csv_parse.default)(line, {
        delimiter: options.columnSeparator || ",",
        skip_lines_with_error: !!options.skipErrors
      }, function(err, out) {
        if (err) {
          reject(err);
        } else {
          resolve(out[0]);
        }
      });
    });
  }
  async parseCSV(state, options = {}) {
    let headings = [];
    let dropLines = options.cutFromBeginning || 0;
    let firstLine = true;
    for (const fileName of Object.keys(state.files)) {
      for (let n = 0; n < state.files[fileName].lines.length; n++) {
        if (dropLines) {
          dropLines--;
          continue;
        }
        const line = { ...state.files[fileName].lines[n] };
        const text = options.trimLines ? line.text.trim() : line.text;
        if (firstLine) {
          firstLine = false;
          if (options.useFirstLineHeadings) {
            headings = await this.parseLine(text, options);
            const headCount = {};
            for (let i = 0; i < headings.length; i++) {
              headCount[headings[i]] = headCount[headings[i]] || 0;
              headCount[headings[i]]++;
              if (headCount[headings[i]] > 1) {
                headings[i] = `${headings[i]}${headCount[headings[i]]}`;
              }
            }
            continue;
          } else {
            const size = (await this.parseLine(text, options)).length;
            for (let i = 0; i < size; i++) {
              headings.push(`${i}`);
            }
          }
        }
        const columns = {};
        const pieces = text.trim() !== "" ? await this.parseLine(text, options) : null;
        if (pieces) {
          pieces.forEach((column, index) => {
            if (index < headings.length) {
              columns[headings[index]] = column;
            } else {
              columns["+"] = columns["+"] || "";
              columns["+"] += column + "\n";
            }
          });
          line.columns = columns;
          state.files[fileName].lines[n] = line;
        }
      }
    }
    const newState = {
      ...state,
      stage: "segmented"
    };
    return newState;
  }
};

// src/import/TransactionImportConnector.ts
init_shim();
function isTransactionImportConnector(o) {
  if (typeof o !== "object" || o === null) {
    return false;
  }
  let f = o.getRate;
  if (typeof f !== "function") {
    return false;
  }
  f = o.getStock;
  if (typeof f !== "function") {
    return false;
  }
  f = o.initializeBalances;
  if (typeof f !== "function") {
    return false;
  }
  f = o.getAccountCanditates;
  if (typeof f !== "function") {
    return false;
  }
  f = o.getVAT;
  if (typeof f !== "function") {
    return false;
  }
  return true;
}

// src/import/TransactionImportHandler.ts
init_shim();
var import_tasenor_common24 = require("@dataplug/tasenor-common");

// src/import/TransferAnalyzer.ts
init_shim();
var import_clone3 = __toESM(require_clone());
var import_merge = __toESM(require("merge"));
var import_sprintf_js6 = require("sprintf-js");
var import_tasenor_common22 = require("@dataplug/tasenor-common");
function setEqual(s1, s2) {
  if (s1.size !== s2.size) {
    return false;
  }
  return (/* @__PURE__ */ new Set([...s1, ...s2])).size === s1.size;
}
function setEqualArray(s1, s2) {
  return setEqual(s1, new Set(s2));
}
function num(value, digits = null, sign3 = false) {
  let result;
  if (digits !== null) {
    result = (0, import_sprintf_js6.sprintf)(`%.${digits}f`, value);
  } else {
    result = `${value}`;
  }
  if (sign3 && value >= 0) {
    result = `+${result}`;
  }
  return result;
}
var TransferAnalyzer = class {
  constructor(handler, config2, state) {
    this.handler = handler;
    this.config = config2;
    this.state = state;
    this.stocks = {};
    this.balances = new import_tasenor_common22.BalanceBookkeeping();
  }
  get UI() {
    return this.handler.UI;
  }
  async initialize(time) {
    await this.handler.system.connector.initializeBalances(time, this.balances, this.config);
  }
  getBalances() {
    return this.balances.summary();
  }
  getBalance(addr) {
    return this.balances.get(addr);
  }
  applyBalance(txEntry) {
    return this.balances.apply(txEntry);
  }
  getConfig(name, def = void 0) {
    if (!this.config[name]) {
      if (def !== void 0) {
        return def;
      }
      throw new SystemError(`A variable ${name} is not configured for transfer analyser.`);
    }
    return this.config[name];
  }
  async getTranslation(text) {
    return this.handler.getTranslation(text, this.getConfig("language"));
  }
  getLines(segmentId) {
    return this.handler.getLines(this.state, segmentId);
  }
  async collectAccounts(segment, transfers, options = { findMissing: false }) {
    const missing = [];
    const accounts = {};
    for (const transfer of transfers.transfers) {
      const account = await this.getAccount(transfer.reason, transfer.type, transfer.asset, segment.id);
      if (account === void 0) {
        if (!options.findMissing) {
          throw new BadState(`Unable to find an account number for ${transfer.reason}.${transfer.type}.${transfer.asset}.`);
        }
        missing.push(`${transfer.reason}.${transfer.type}.${transfer.asset}`);
        continue;
      }
      accounts[`${transfer.reason}.${transfer.type}.${transfer.asset}`] = account;
      if (transfer.reason === "trade" && transfer.type === "stock" && this.getConfig("allowShortSelling", false)) {
        const account2 = await this.getAccount("trade", "short", transfer.asset, segment.id);
        if (account2 === void 0) {
          if (!options.findMissing) {
            throw new BadState(`Unable to find an account number for trade.short.${transfer.asset}.`);
          }
          missing.push(`trade.short.${transfer.asset}`);
        } else {
          accounts[`trade.short.${transfer.asset}`] = account2;
        }
        continue;
      }
    }
    return options.findMissing ? missing : accounts;
  }
  async collectOtherValues(transfers, values) {
    const currency = this.getConfig("currency");
    const primaryReasons = new Set(
      transfers.transfers.filter((t) => !["fee"].includes(t.reason)).map((t) => t.reason)
    );
    const primaryAssets = new Set(
      transfers.transfers.filter((t) => !["fee"].includes(t.reason)).map((t) => t.type)
    );
    function weHave(reasons, assets) {
      return setEqualArray(primaryReasons, reasons) && setEqualArray(primaryAssets, assets);
    }
    function entriesHaving(reason, type, asset = null) {
      if (typeof type === "string") {
        type = [type];
      }
      return transfers.transfers.filter(
        (t) => t.reason === reason && type.includes(t.type) && (asset === null || t.asset === asset)
      );
    }
    function shouldHaveOne(reason, type, asset = null) {
      const entries = entriesHaving(reason, type, asset);
      if (entries.length < 1) {
        throw new InvalidFile(`Dit not find entries matching ${reason}.${type}.${asset} from ${JSON.stringify(transfers)}`);
      }
      if (entries.length > 1) {
        throw new InvalidFile(`Found too many entries matching ${reason}.${type}.${asset}: ${JSON.stringify(entries)}`);
      }
      return entries[0];
    }
    values.currency = currency;
    values.exchange = this.handler.name.replace(/Import$/, "");
    transfers.transfers.forEach((transfer) => {
      if (transfer.data) {
        Object.assign(values, transfer.data);
      }
    });
    let kind;
    if (weHave(["trade"], ["currency", "crypto"]) || weHave(["trade"], ["currency", "stock"])) {
      const moneyEntry = shouldHaveOne("trade", "currency");
      if (moneyEntry.amount === void 0) {
        throw new SystemError(`Invalid transfer amount undefined in ${JSON.stringify(moneyEntry)}.`);
      }
      kind = moneyEntry.amount < 0 ? "buy" : "sell";
      const tradeableEntry = shouldHaveOne("trade", ["crypto", "stock"]);
      if (tradeableEntry.amount === void 0) {
        throw new SystemError(`Invalid transfer amount undefined in ${JSON.stringify(tradeableEntry)}.`);
      }
      values.takeAmount = num(tradeableEntry.amount, null, true);
      values.takeAsset = tradeableEntry.asset;
    } else if (weHave(["trade"], ["crypto"]) || weHave(["trade"], ["stock"])) {
      kind = "trade";
    } else if (weHave(["trade"], ["currency", "short"])) {
      if (!values.kind)
        throw new BadState(`Kind is not defined in values for short trade ${JSON.stringify(transfers.transfers)}.`);
      kind = values.kind;
    } else if (weHave(["forex"], ["currency"]) || weHave(["forex", "income"], ["currency", "statement"]) || weHave(["forex", "expense"], ["currency", "statement"])) {
      kind = "forex";
      const myEntry = transfers.transfers.filter((a) => a.reason === "forex" && a.type === "currency" && a.asset === currency);
      if (myEntry.length === 0) {
        throw new SystemError(`Cannot find transfer of currency ${currency} from ${JSON.stringify(myEntry)}.`);
      }
      if (myEntry.length > 1) {
        throw new SystemError(`Too many transfers of currency ${currency} in ${JSON.stringify(myEntry)}.`);
      }
      if (myEntry[0].amount === void 0) {
        throw new SystemError(`Invalid transfer amount undefined in ${JSON.stringify(myEntry)}.`);
      }
      const otherEntry = transfers.transfers.filter((a) => a.reason === "forex" && a.type === "currency" && a.asset !== currency);
      if (myEntry.length === 0) {
        throw new SystemError(`Cannot find transfer of currency not ${currency} from ${JSON.stringify(myEntry)}.`);
      }
      if (myEntry.length > 1) {
        throw new SystemError(`Too many transfers of currency not ${currency} in ${JSON.stringify(myEntry)}.`);
      }
      if (otherEntry[0].amount === void 0) {
        throw new SystemError(`Invalid transfer amount undefined in ${JSON.stringify(otherEntry)}.`);
      }
      values.takeAsset = myEntry[0].amount < 0 ? otherEntry[0].asset : myEntry[0].asset;
      values.giveAsset = myEntry[0].amount < 0 ? myEntry[0].asset : otherEntry[0].asset;
    } else if (weHave(["dividend", "income"], ["currency", "statement"]) || weHave(["tax", "dividend", "income"], ["currency", "statement"])) {
      kind = "dividend";
    } else if (weHave(["income"], ["currency", "statement"]) || weHave(["income", "tax"], ["currency", "statement"])) {
      kind = "income";
      const statementEntry = shouldHaveOne("income", "statement");
      values.name = await this.getTranslation(`income-${statementEntry.asset}`);
    } else if (weHave(["income"], ["account"])) {
      kind = "income";
      const texts = transfers.transfers.filter((tr) => tr.type === "account" && tr.data && tr.data.text !== void 0).map((tr) => tr.data?.text);
      if (!texts.length) {
        throw new SystemError(`If transfer uses direct 'account' type, one of the parts must have text defined in data: ${JSON.stringify(transfers.transfers)}`);
      }
      values.name = texts.join(" ");
    } else if (weHave(["investment"], ["currency", "statement"])) {
      kind = "investment";
      const statementEntry = shouldHaveOne("investment", "statement");
      values.name = await this.getTranslation(`income-${statementEntry.asset}`);
    } else if (weHave(["expense"], ["currency", "statement"]) || weHave(["expense", "tax"], ["currency", "statement"])) {
      kind = "expense";
      const statementEntry = shouldHaveOne("expense", "statement");
      values.name = await this.getTranslation(`expense-${statementEntry.asset}`);
    } else if (weHave(["expense"], ["account"])) {
      kind = "expense";
      const texts = transfers.transfers.filter((tr) => tr.type === "account" && tr.data && tr.data.text !== void 0).map((tr) => tr.data?.text);
      if (!texts.length) {
        throw new SystemError(`If transfer uses direct 'account' type, one of the parts must have text defined in data: ${JSON.stringify(transfers.transfers)}`);
      }
      values.name = texts.join(" ");
    } else if (weHave(["distribution"], ["currency", "statement"])) {
      kind = "distribution";
      const statementEntry = shouldHaveOne("distribution", "statement");
      values.name = await this.getTranslation(`expense-${statementEntry.asset}`);
    } else if (weHave(["tax"], ["currency", "statement"])) {
      kind = "tax";
      const statementEntry = shouldHaveOne("tax", "statement");
      values.name = await this.getTranslation(`tax-${statementEntry.asset}`);
    } else if (weHave(["deposit"], ["currency", "external"])) {
      kind = "deposit";
      const moneyEntry = shouldHaveOne("deposit", "currency", currency);
      if (moneyEntry.amount === void 0) {
        throw new SystemError(`Invalid transfer amount undefined in ${JSON.stringify(moneyEntry)}.`);
      }
    } else if (weHave(["withdrawal"], ["currency", "external"])) {
      kind = "withdrawal";
      const moneyEntry = shouldHaveOne("withdrawal", "currency", currency);
      if (moneyEntry.amount === void 0) {
        throw new SystemError(`Invalid transfer amount undefined in ${JSON.stringify(moneyEntry)}.`);
      }
    } else if (weHave(["transfer"], ["currency", "external"])) {
      kind = "transfer";
      const moneyEntry = shouldHaveOne("transfer", "currency", currency);
      if (moneyEntry.amount === void 0) {
        throw new SystemError(`Invalid transfer amount undefined in ${JSON.stringify(moneyEntry)}.`);
      }
      const externalEntry = shouldHaveOne("transfer", "external");
      values.service = externalEntry.asset;
    } else if (weHave(["correction"], ["currency", "statement"]) || weHave(["tax", "correction"], ["currency", "statement"]) || weHave(["tax", "correction"], ["statement"])) {
      kind = "correction";
      const assets = transfers.transfers.filter((t) => t.reason !== "tax" && t.type === "statement").reduce((prev, cur) => prev.add(cur.asset), /* @__PURE__ */ new Set());
      if (assets.size > 1) {
        throw new SystemError(`Mixed asset ${[...assets].join(" and ")} corrections not supported in ${JSON.stringify(transfers.transfers)}`);
      }
      if (!assets.size) {
        throw new SystemError(`Cannot find any statement types in ${JSON.stringify(transfers.transfers)}`);
      }
      const assetName = assets.values().next().value;
      if (/^INCOME/.test(assetName)) {
        values.name = await this.getTranslation(`income-${assetName}`);
      } else {
        values.name = await this.getTranslation(`expense-${assetName}`);
      }
    } else {
      console.log("Failing transfers:");
      console.dir(transfers, { depth: null });
      throw new NotImplemented(`Analyzer does not handle combination '${[...primaryReasons]}' and '${[...primaryAssets]}' yet.`);
    }
    values.kind = kind;
    return values;
  }
  setData(transfer, values) {
    if (!transfer.data) {
      transfer.data = {};
    }
    Object.assign(transfer.data, values);
  }
  setRate(transfer, asset, rate) {
    if (!transfer.data) {
      transfer.data = {};
    }
    if (!transfer.data.rates) {
      transfer.data.rates = {};
    }
    transfer.data.rates[asset] = rate;
  }
  async getRate(time, transfer, type, asset) {
    if (transfer.data && transfer.data.rates && transfer.data.rates[asset] !== void 0) {
      if (transfer.data.rates[asset] !== void 0) {
        const rate = transfer.data.rates[asset];
        if (rate !== void 0) {
          return rate;
        }
      }
    }
    return await this.getRateAt(time, type, asset);
  }
  async setValue(time, transfer, type, asset, amount = null) {
    const currency = this.getConfig("currency");
    if (amount === null) {
      if (transfer.amount === null || transfer.amount === void 0) {
        return;
      }
      amount = transfer.amount;
    }
    if (type === "currency" && asset === currency || type === "account") {
      transfer.value = Math.round(amount * 100);
    } else {
      const rate = await this.getRate(time, transfer, type, asset);
      transfer.value = Math.round(rate * amount * 100);
      this.setRate(transfer, asset, rate);
      if (type === "currency" && (0, import_tasenor_common22.isCurrency)(transfer.asset)) {
        this.setData(transfer, {
          currency: transfer.asset,
          currencyValue: Math.round(amount * 100)
        });
      }
    }
  }
  async fillInLocalCurrencies(time, transfers) {
    const currency = this.getConfig("currency");
    for (const transfer of transfers.transfers) {
      if ((transfer.type === "account" || transfer.type === "currency" && transfer.asset === currency) && transfer.amount !== null) {
        await this.setValue(time, transfer, transfer.type, transfer.asset);
      }
    }
  }
  async fillInCurrencies(time, transfers) {
    for (const transfer of transfers.transfers) {
      if (transfer.value)
        continue;
      if (transfer.amount === null)
        continue;
      if (transfer.type === "currency" && (0, import_tasenor_common22.isCurrency)(transfer.asset)) {
        await this.setValue(time, transfer, transfer.type, transfer.asset);
      } else if (transfer.data && transfer.data.currency && (0, import_tasenor_common22.isCurrency)(transfer.data.currency) && transfer.data.currencyValue) {
        await this.setValue(time, transfer, "currency", transfer.data.currency, transfer.data.currencyValue / 100);
      } else if (transfer.type === "currency") {
        throw new SystemError(`Cannot determine currency in ${JSON.stringify(transfer)}.`);
      }
    }
  }
  fillLastMissing(transfers, canDeduct) {
    if (transfers.length === 1) {
      return transfers[0].value !== null && transfers[0].value !== void 0;
    }
    let total = 0;
    let unknown = null;
    for (const transfer of transfers) {
      if (transfer.value === null || transfer.value === void 0) {
        if (unknown === null && canDeduct) {
          unknown = transfer;
        } else {
          return false;
        }
      } else {
        total += transfer.value;
      }
    }
    if (unknown) {
      unknown.value = -total;
    }
    return true;
  }
  async calculateAssetValues(transfers, segment) {
    const values = {};
    const hasNonCurrencyTrades = transfers.transfers.some((t) => t.reason === "trade" && t.type !== "account" && t.type !== "currency" && t.amount && t.amount < 0);
    const needFullScan = transfers.transfers.every((t) => t.value !== void 0);
    let closingShortPosition = false;
    let canDeduct = !hasNonCurrencyTrades;
    for (const transfer of transfers.transfers) {
      if (transfer.reason === "trade" && transfer.type === "stock") {
        const transferAmount = transfer.amount || 0;
        const { amount } = await this.getStock(segment.time, transfer.type, transfer.asset);
        if (amount < 0 && transferAmount > 0) {
          closingShortPosition = true;
          canDeduct = false;
          break;
        }
      }
    }
    for (const transfer of transfers.transfers) {
      if (transfer.data && transfer.data.currency !== void 0 && transfer.data.currencyValue !== void 0) {
        continue;
      }
      if (transfer.amount === void 0) {
        throw new SystemError(`Invalid transfer amount undefined in ${JSON.stringify(transfer)}. Please use amount="null" to denote value that needs to be calculated.`);
      }
      if (!(0, import_tasenor_common22.isAssetTransferReason)(transfer.reason)) {
        throw new SystemError(`Invalid transfer reason ${JSON.stringify(transfer.reason)} in ${JSON.stringify(transfer)}.`);
      }
      if (!(0, import_tasenor_common22.isAssetType)(transfer.type)) {
        throw new SystemError(`Invalid transfer type ${JSON.stringify(transfer.type)} in ${JSON.stringify(transfer)}.`);
      }
    }
    await this.fillInLocalCurrencies(segment.time, transfers);
    if (!needFullScan && this.fillLastMissing(transfers.transfers, canDeduct))
      return values;
    await this.fillInCurrencies(segment.time, transfers);
    if (!needFullScan && this.fillLastMissing(transfers.transfers, canDeduct))
      return values;
    for (const transfer of transfers.transfers) {
      if (transfer.value === void 0 && transfer.reason === "tax") {
        const taxCurrency = transfer?.data?.currency;
        if (!taxCurrency) {
          throw new SystemError(`A currency must be defined in data for ${transfer.reason} transfers in ${JSON.stringify(transfer)}.`);
        }
        await this.setValue(segment.time, transfer, "currency", taxCurrency);
      }
    }
    if (!needFullScan && this.fillLastMissing(transfers.transfers, canDeduct))
      return values;
    for (const transfer of transfers.transfers) {
      if (transfer.value === void 0 && (transfer.reason === "fee" || transfer.reason === "dividend")) {
        await this.setValue(segment.time, transfer, transfer.type, transfer.asset);
      }
    }
    if (!needFullScan && this.fillLastMissing(transfers.transfers, canDeduct))
      return values;
    for (const transfer of transfers.transfers) {
      if (transfer.reason === "trade") {
        const transferAmount = transfer.amount || 0;
        if (transferAmount < 0) {
          if (transfer.value !== void 0) {
            transfer.value = Math.round(transfer.value || 0);
          } else {
            const { value, amount } = await this.getStock(segment.time, transfer.type, transfer.asset);
            if ((0, import_tasenor_common22.less)(amount, -transferAmount)) {
              const shortOk = await this.UI.getBoolean(this.config, "allowShortSelling", "Do we allow short selling of assets?");
              if (!shortOk) {
                throw new SystemError(`We have ${amount} assets ${transfer.asset} in stock for trading on ${segment.time} when ${transferAmount} needed.`);
              }
              if (amount > 0) {
                throw new NotImplemented(`Cannot handle mix of short selling and normal selling ${transferAmount} ${transfer.asset} on ${segment.time} and having ${amount}.`);
              }
              transfer.type = "short";
              values.kind = "short-sell";
              transfer.value = -transfers.transfers.filter((t) => t.value && t.value > 0 && t.type === "currency").reduce((prev, cur) => prev + (cur && cur.value || 0), 0);
            } else {
              transfer.value = Math.round(transferAmount * (value / amount));
              if (!transfer.value) {
                throw new SystemError(`Asset ${transfer.type} ${transfer.asset} have no value left when trading on ${segment.time}.`);
              }
            }
          }
          values.giveAmount = num(transferAmount, null, true);
          values.giveAsset = transfer.asset;
        } else {
          if (closingShortPosition) {
            const { value, amount } = await this.getStock(segment.time, transfer.type, transfer.asset);
            transfer.value = Math.round(transferAmount * (value / amount));
            transfer.type = "short";
            values.kind = "short-buy";
          } else {
            if (transfer.value === void 0) {
              const rate = await this.getRate(segment.time, transfer, transfer.type, transfer.asset);
              transfer.value = Math.round(rate * transferAmount * 100);
              this.setRate(transfer, transfer.asset, rate);
            } else {
              transfer.value = Math.round(transfer.value || 0);
            }
          }
          values.takeAmount = num(transferAmount, null, true);
          values.takeAsset = transfer.asset;
        }
      }
    }
    if (canDeduct) {
      await this.handleMultipleMissingValues(transfers);
    }
    if (!this.fillLastMissing(transfers.transfers, canDeduct)) {
      throw new SystemError(`Unable to determine valuation in ${JSON.stringify(transfers)}.`);
    }
    return values;
  }
  async handleMultipleMissingValues(transfers) {
    const missing = [];
    const byType = {};
    for (const transfer of transfers.transfers) {
      if (transfer.amount === null) {
        missing.push(transfer);
      } else {
        const key = `${transfer.reason}.${transfer.type}`;
        byType[key] = byType[key] || [];
        byType[key].push(transfer);
      }
    }
    const n = missing.length;
    if (n < 2) {
      return;
    }
    const keys = Object.keys(byType);
    if (setEqualArray(/* @__PURE__ */ new Set(["income.statement", "tax.statement"]), keys)) {
      for (const key of keys) {
        if (byType[key].length > n) {
          (0, import_tasenor_common22.warning)(`Trying to resolve more than one missing value, but probably leads to fail, since we got ${byType[key].length} entries for ${key} while expecting ${n}.`);
        }
      }
      for (let i = 0; i < n; i++) {
        const slice = [missing[i]];
        for (const key of keys) {
          if (byType[key][i]) {
            slice.push(byType[key][i]);
          }
        }
        this.fillLastMissing(slice, true);
      }
      return;
    }
    throw new NotImplemented(`Not able yet to calculate missing values for ${keys.join(" and ")}`);
  }
  async analyze(transfers, segment, config2) {
    import_merge.default.recursive(this.config, config2);
    transfers = (0, import_clone3.default)(transfers);
    const accounts = await this.collectAccounts(segment, transfers);
    let feeIsMissingFromTotal = false;
    const hasFees = transfers.transfers.filter((t) => t.reason === "fee").length > 0;
    if (hasFees) {
      const nonFees = new Set(transfers.transfers.filter((t) => t.reason !== "fee" && !(t.reason === "income" && t.asset.indexOf("PROFIT") >= 0) && !(t.reason === "expense" && t.asset.indexOf("LOSS") >= 0)).map((t) => t.reason));
      if (nonFees.size > 1) {
        throw new Error(`Too many non-fees (${[...nonFees].join(" and ")}) to determine actual transfer reasoning ${JSON.stringify(transfers.transfers)}.`);
      }
      const nonFee = [...nonFees][0];
      const feeTypes = new Set(transfers.transfers.filter((t) => t.reason === "fee").map((t) => t.type));
      if (feeTypes.size > 1) {
        throw new Error(`Too many fee types (${[...feeTypes].join(" and ")}) to determine actual fee type ${JSON.stringify(transfers.transfers)}.`);
      }
      const feeType = [...feeTypes][0];
      let variable;
      if (nonFee === "trade") {
        switch (feeType) {
          case "currency":
            variable = "isTradeFeePartOfTotal";
            break;
          case "crypto":
            variable = "isCryptoTradeFeePartOfTotal";
            break;
          default:
            throw new NotImplemented(`Cannot handle fee type '${feeType}' yet.`);
        }
      } else if (nonFee === "withdrawal") {
        variable = "isWithdrawalFeePartOfTotal";
      } else if (nonFee === "forex") {
        variable = "isForexFeePartOfTotal";
      } else {
        throw new Error(`Handling non-fee '${nonFee}' not implemented.`);
      }
      feeIsMissingFromTotal = !await this.UI.getBoolean(config2, variable, "Is transaction fee of type {type} already included in the {reason} total?".replace("{type}", feeType).replace("{reason}", await this.getTranslation(`reason-${nonFee}`)));
      if (feeIsMissingFromTotal) {
        for (const fee of transfers.transfers.filter((t) => t.reason === "fee")) {
          const assetTransfers = transfers.transfers.filter((t) => t.type === fee.type && t.asset === fee.asset && ["trade", "forex", "withdrawal"].includes(t.reason));
          if (assetTransfers.length < 1) {
            throw new SystemError(`Cannot find any assets to adjust for ${fee.asset} fee in ${JSON.stringify(transfers.transfers)}`);
          }
          if (assetTransfers[0].amount === void 0 || fee.amount === void 0) {
            throw new SystemError(`Unable to adjust fee assets for ${fee.asset} fee in ${JSON.stringify(transfers.transfers)}`);
          }
          assetTransfers[0].amount -= fee.amount;
        }
      }
    }
    const assetValues = await this.calculateAssetValues(transfers, segment);
    const values = await this.collectOtherValues(transfers, assetValues);
    const kind = values.kind;
    const feesToDeduct = {};
    const valueToDeduct = {};
    if (hasFees) {
      for (const transfer of transfers.transfers) {
        if (transfer.type === "crypto" || transfer.type === "stock" || transfer.type === "short") {
          if (transfer.reason === "fee") {
            feesToDeduct[transfer.asset] = (feesToDeduct[transfer.asset] || 0) + (transfer.amount || 0);
            valueToDeduct[transfer.asset] = (valueToDeduct[transfer.asset] || 0) + (transfer.value || 0);
          }
        }
      }
    }
    for (const transfer of transfers.transfers) {
      const change = {};
      if (transfer.type === "crypto" || transfer.type === "stock" || transfer.type === "short") {
        if (transfer.reason !== "fee") {
          if (transfer.value === void 0) {
            throw Error(`Encountered invalid transfer value undefined for ${JSON.stringify(transfer)}.`);
          }
          if (transfer.amount === void 0) {
            throw Error(`Encountered invalid transfer amount undefined for ${JSON.stringify(transfer)}.`);
          }
          change[transfer.asset] = {
            value: transfer.value || 0,
            amount: transfer.amount || 0
          };
          const data = { stock: { change } };
          if (feesToDeduct[transfer.asset]) {
            change[transfer.asset].amount -= feesToDeduct[transfer.asset];
            change[transfer.asset].value -= valueToDeduct[transfer.asset];
            data.feeAmount = feesToDeduct[transfer.asset];
            data.feeCurrency = transfer.asset;
            delete feesToDeduct[transfer.asset];
          }
          this.setData(transfer, data);
          const type = transfer.type === "short" ? "stock" : transfer.type;
          await this.changeStock(segment.time, type, transfer.asset, transfer.amount, transfer.value);
        }
      }
    }
    if (Object.keys(feesToDeduct).length) {
      throw new Error(`There was no matching transfer to deduct ${Object.keys(feesToDeduct).join(" and ")} in ${JSON.stringify(transfers.transfers)}.`);
    }
    let total = 0;
    for (const transfer of transfers.transfers) {
      if (transfer.value === void 0) {
        throw new SystemError(`Failed to determine value of transfer ${JSON.stringify(transfer)}.`);
      }
      total += transfer.value;
    }
    if (kind === "trade" || kind === "sell" || kind === "short-buy") {
      if (total) {
        const soldAsset = kind === "short-buy" ? transfers.transfers.filter((t) => t.reason === "trade" && t.value && t.value > 0) : transfers.transfers.filter((t) => t.reason === "trade" && t.value && t.value < 0);
        if (soldAsset.length !== 1) {
          throw new BadState(`Did not found unique asset that was sold from ${JSON.stringify(transfers.transfers)}`);
        }
        let reason;
        let asset;
        if (total > 0) {
          reason = "income";
          if (kind === "short-buy") {
            asset = "TRADE_PROFIT_SHORT";
          } else {
            asset = `TRADE_PROFIT_${soldAsset[0].type.toUpperCase()}`;
          }
        } else {
          reason = "expense";
          if (kind === "short-buy") {
            asset = "TRADE_LOSS_SHORT";
          } else {
            asset = `TRADE_LOSS_${soldAsset[0].type.toUpperCase()}`;
          }
        }
        const gains = {
          reason,
          asset,
          amount: -total / 100,
          type: "statement",
          value: -total
        };
        if (soldAsset[0].data && soldAsset[0].data.notes) {
          gains.data = {
            notes: soldAsset[0].data.notes
          };
        }
        const account = await this.getAccount(gains.reason, gains.type, gains.asset, segment.id);
        const address = `${gains.reason}.${gains.type}.${gains.asset}`;
        if (account) {
          accounts[address] = account;
        } else {
          await this.UI.throwGetAccount(config2, address);
        }
        transfers.transfers.push(gains);
        total = 0;
      }
    }
    if (Math.abs(total) > import_tasenor_common22.ZERO_CENTS) {
      throw new SystemError(`Total should be zero but got ${total} from ${JSON.stringify(transfers.transfers)}.`);
    }
    this.fillCurrencies(transfers);
    const tx = await this.createTransaction(transfers, kind, values, accounts, segment);
    transfers.transactions = [tx];
    return transfers;
  }
  async createTransaction(transfers, kind, values, accounts, segment) {
    const tx = {
      date: segment.time,
      segmentId: segment.id,
      entries: []
    };
    let lastText;
    for (let i = 0; i < transfers.transfers.length; i++) {
      const transfer = transfers.transfers[i];
      const data = transfer.data || {};
      if (transfer.text)
        lastText = transfer.text;
      let description = lastText;
      if (!description)
        description = await this.constructText(kind, { ...values, ...data }, transfers);
      if (!description) {
        throw new SystemError(`Failed to construct description for ${JSON.stringify(transfer)}.`);
      }
      if (transfer.data && transfer.data.notes) {
        const notes = [];
        for (const note4 of transfer.data.notes) {
          if (note4 && `${note4}`.trim()) {
            const translatedNote = await this.getTranslation(`note-${note4}`);
            if (translatedNote !== `note-${note4}`) {
              notes.push(translatedNote);
            } else {
              notes.push(note4);
            }
          }
        }
        if (notes.length) {
          description += ` (${notes.join(", ")})`;
        }
      }
      let txEntry = {
        account: accounts[`${transfer.reason}.${transfer.type}.${transfer.asset}`],
        amount: transfer.value === void 0 ? 0 : transfer.value,
        description
      };
      if (!txEntry.account) {
        throw new SystemError(`Cannot find account ${transfer.reason}.${transfer.type}.${transfer.asset} for entry ${JSON.stringify(txEntry)}`);
      }
      const total = this.applyBalance(txEntry);
      if (this.balances.mayTakeLoan(transfer.reason, transfer.type, transfer.asset) && (0, import_tasenor_common22.realNegative)(total)) {
        const addr = `${transfer.reason}.${transfer.type}.${transfer.asset}`;
        const debtAddr = this.balances.debtAddress(addr);
        const debtAccount = this.getConfig(`account.${debtAddr}`, null);
        if (debtAccount === null) {
          await this.UI.throwDebtAccount(this.config, txEntry.account, addr);
        }
      }
      if (transfer.data) {
        txEntry.data = (0, import_clone3.default)(transfer.data);
      }
      const { reason, type } = transfer;
      if (type === "external") {
        if (reason === "deposit") {
          const recordDeposits = await this.UI.getBoolean(this.config, "recordDeposits", "Deposits tend to appear in two import sources. Do you want to record deposits in this import?");
          if (!recordDeposits) {
            tx.executionResult = "ignored";
          }
        } else if (reason === "withdrawal") {
          const recordWithdrawals = await this.UI.getBoolean(this.config, "recordWithdrawals", "Withdrawals tend to appear in two import sources. Do you want to record withdrawals in this import?");
          if (!recordWithdrawals) {
            tx.executionResult = "ignored";
          }
        }
      }
      txEntry = await this.postProcessTags(txEntry, transfer, segment);
      tx.entries.push(txEntry);
    }
    return tx;
  }
  async postProcessTags(tx, transfer, segment) {
    let tags;
    if (!("tags" in transfer)) {
      tags = await this.getTags(transfer.reason, transfer.type, transfer.asset);
    } else {
      tags = transfer.tags;
    }
    if (tags) {
      if (typeof tags === "string" && /^(\[[a-zA-Z0-9]+\])+$/.test(tags)) {
        tags = tags.substr(1, tags.length - 2).split("][");
      }
      if (!(tags instanceof Array)) {
        throw new BadState(`Invalid tags ${JSON.stringify(tags)}`);
      }
      tx.description = `[${tags.filter((t) => !!t).join("][")}] ${tx.description}`;
    }
    return tx;
  }
  async getAccount(reason, type, asset, segmentId) {
    const account = this.getConfig(`account.${reason}.${type}.${asset}`, null);
    if (typeof account === "string") {
      return account;
    }
    const generic = this.getConfig(`account.${reason}.${type}.*`, null);
    if (typeof generic === "string") {
      return generic;
    }
    if (/^[0-9]+$/.test(asset)) {
      return asset;
    }
    if (!segmentId) {
      return void 0;
    }
    const answers = this.getConfig("answers", {});
    if (answers[segmentId] && answers[segmentId][`account.${reason}.${type}.${asset}`]) {
      return answers[segmentId][`account.${reason}.${type}.${asset}`];
    }
  }
  async getTags(reason, type, asset) {
    for (const variable of [`tags.${reason}.${type}.${asset}`, `tags.${reason}.${type}.*`, `tags.${reason}.*.*`, "tags.*.*.*"]) {
      const tags = this.getConfig(variable, null);
      if (tags !== null) {
        if (tags instanceof Array) {
          return tags;
        }
        throw new BadState(`Bad tags configured ${JSON.stringify(tags)} for tags.${reason}.${type}.${asset}`);
      }
    }
  }
  async getTagsForAddr(addr) {
    const [reason, type, asset] = addr.split(".");
    return this.getTags(reason, type, asset);
  }
  async getAccountQuery(reason, type, asset) {
    const account = this.getConfig(`account.${reason}.${type}.${asset}`, null);
    if (typeof account === "object" && account !== null) {
      return account;
    }
  }
  async constructText(kind, values, original) {
    const template = `import-text-${kind}`;
    const prefix = this.getConfig("transaction.prefix", "");
    let text = await this.getTranslation(template);
    if (text === template) {
      throw new BadState(`Not able to find translation for '${template}'.`);
    }
    text = `${prefix}${text}`;
    while (true) {
      const match = /(\{([a-zA-Z0-9]+)\})/.exec(text);
      if (!match)
        break;
      if (values[match[2]] === void 0) {
        throw new BadState(`Not able to find value '${match[2]}' from ${JSON.stringify(original)}`);
      }
      const value = `${values[match[2]]}`;
      text = text.replace(match[1], value);
    }
    return text;
  }
  async getRateAt(time, type, asset) {
    const exchange = this.handler.name;
    const currency = this.getConfig("currency");
    if (type === "currency" && asset === currency || type === "account") {
      return 1;
    }
    if (!exchange && type === "crypto") {
      throw new Error(`Exchange is compulsory setting in cryptocurrency import. Cannot determine rate for ${asset} at ${time}.`);
    }
    if (!isTransactionImportConnector(this.handler.system.connector)) {
      throw new SystemError("Connector used is not a transaction import connector.");
    }
    return this.handler.getRate(time, type, asset, currency, exchange);
  }
  async getStock(time, type, asset) {
    if (!isTransactionImportConnector(this.handler.system.connector)) {
      throw new SystemError("Connector used is not a transaction import connector.");
    }
    const account = await this.getAccount("trade", type, asset);
    if (!account) {
      throw new Error(`Unable to find account for ${type} ${asset}.`);
    }
    if (!this.stocks[account]) {
      this.stocks[account] = new import_tasenor_common22.StockBookkeeping(`Account ${account}`);
    }
    if (!this.stocks[account].has(type, asset)) {
      const { value, amount } = await this.handler.system.connector.getStock(time, account, asset);
      this.stocks[account].set(time, type, asset, amount, value);
      return { value, amount };
    }
    const ret = this.stocks[account].get(time, type, asset);
    return ret;
  }
  async changeStock(time, type, asset, amount, value) {
    await this.getStock(time, type, asset);
    const account = await this.getAccount("trade", type, asset);
    if (!account) {
      throw new Error(`Unable to find account for ${type} ${asset}.`);
    }
    if (!this.stocks[account]) {
      this.stocks[account] = new import_tasenor_common22.StockBookkeeping(`Account ${account}`);
    }
    await this.stocks[account].change(time, type, asset, amount, value);
  }
  async getAverage(time, type, asset) {
    const { amount, value } = await this.getStock(time, type, asset);
    return value / amount;
  }
  fillCurrencies(transfers) {
    const rates = {};
    const explicitCurrencies = /* @__PURE__ */ new Set();
    const setRate = (currency2, rate) => {
      if (rates[currency2] !== void 0 && Math.abs(rate - (rates[currency2] || 0)) > 0.1) {
        (0, import_tasenor_common22.warning)(`Found two different rates ${rates[currency2]} and ${rate} for ${currency2} on ${JSON.stringify(transfers.transfers)}.`);
      }
      rates[currency2] = rate;
    };
    transfers.transfers.forEach((transfer) => {
      if (transfer.data && transfer.data.currency && transfer.data.currencyValue && transfer.value !== void 0) {
        setRate(transfer.data.currency, transfer.value / transfer.data.currencyValue);
        explicitCurrencies.add(transfer.data.currency);
      }
      if (transfer.data && transfer.data.rates !== void 0) {
        Object.keys(transfer.data.rates).forEach((currency2) => {
          if (transfer.data !== void 0 && transfer.data.rates !== void 0 && transfer.data.rates[currency2] !== void 0) {
            setRate(currency2, parseFloat(transfer.data.rates[currency2]));
          }
        });
      }
    });
    if (Object.keys(rates).length === 0) {
      return;
    }
    transfers.transfers.forEach((transfer) => {
      transfer.data = transfer.data || {};
      transfer.data.rates = transfer.data.rates || {};
      Object.assign(transfer.data.rates, rates);
    });
    if (explicitCurrencies.size !== 1) {
      return;
    }
    const currency = [...explicitCurrencies][0];
    transfers.transfers.forEach((transfer) => {
      if (transfer.data && transfer.data.currency === void 0 && transfer.data.currencyValue === void 0 && transfer.value !== void 0) {
        if (rates[currency] !== void 0) {
          transfer.data = transfer.data || {};
          transfer.data.currency = currency;
          transfer.data.currencyValue = Math.round(transfer.value / (rates[currency] || 0));
        }
      }
    });
  }
};

// src/import/TransactionImportHandler.ts
var import_object_hash = __toESM(require("object-hash"));

// src/import/TransactionUI.ts
init_shim();
var TransactionUI = class {
  constructor(deps) {
    this.deps = deps;
  }
  async getConfigOrAsk(config2, variable, element) {
    if (variable in config2) {
      return config2[variable];
    }
    throw new AskUI({
      type: "flat",
      elements: [
        element,
        await this.submit("Continue", 1, config2.language)
      ]
    });
  }
  async getBoolean(config2, variable, description) {
    return this.getConfigOrAsk(config2, variable, {
      type: "yesno",
      name: `configure.${variable}`,
      label: await this.getTranslation(description, config2.language),
      actions: {}
    });
  }
  async getTranslation(text, language) {
    return this.deps.getTranslation(text, language);
  }
  async accountLabel(accType, language) {
    const [reason, type, asset] = accType.split(".");
    const text = await this.getTranslation(`account-${reason}-${type}`, language);
    let name = asset;
    if (type === "statement") {
      if (reason === "income") {
        name = await this.getTranslation(`income-${asset}`, language);
      } else if (reason === "expense") {
        name = await this.getTranslation(`expense-${asset}`, language);
      } else if (reason === "tax") {
        name = await this.getTranslation(`tax-${asset}`, language);
      }
    }
    return text.replace("{asset}", name);
  }
  accountFilter(accType) {
    const [reason] = accType.split(".");
    switch (`${reason}`) {
      case "debt":
        return { type: ["ASSET", "LIABILITY"] };
      case "deposit":
      case "trade":
      case "withdrawal":
        return { type: "ASSET" };
      case "fee":
        return { type: "EXPENSE" };
    }
    return null;
  }
  async account(config2, account, defaultAccount = void 0) {
    const language = config2.language;
    const ui = {
      type: "account",
      name: `configure.account.${account}`,
      actions: {},
      label: await this.accountLabel(account, language),
      filter: this.accountFilter(account)
    };
    if (defaultAccount) {
      ui.defaultValue = defaultAccount;
    } else {
      const canditates = await this.deps.getAccountCanditates(account, { ...config2, plugin: config2.handlers instanceof Array && config2.handlers.length ? config2.handlers[0] : void 0 });
      if (canditates.length) {
        ui.defaultValue = canditates[0];
        if (canditates.length > 1) {
          ui.preferred = canditates;
        }
      }
    }
    return ui;
  }
  async throwGetAccount(config2, address) {
    const account = await this.account(config2, address);
    const submit = await this.submit("Continue", 1, config2.language);
    throw new AskUI({
      type: "flat",
      elements: [
        account,
        submit
      ]
    });
  }
  async throwDebtAccount(config2, account, address) {
    const language = config2.language;
    const text = await this.getTranslation("The account below has negative balance. If you want to record it to the separate debt account, please select another account below.", language);
    const message = await this.message(text, "info");
    const parts = address.split(".");
    const debtAddr = `debt.${parts[1]}.${parts[2]}`;
    const accountUI = await this.account(config2, debtAddr, account);
    const submit = await this.submit("Continue", 1, language);
    throw new AskUI({
      type: "flat",
      elements: [
        message,
        accountUI,
        submit
      ]
    });
  }
  async accountGroup(config2, accounts) {
    const [reason, type] = accounts[0].split(".");
    const elements = [];
    const language = config2.language;
    for (const account of accounts) {
      elements.push(await this.account(config2, account));
    }
    return {
      type: "flat",
      elements: [
        {
          type: "boolean",
          name: `grouping.${reason}.${type}`,
          label: await this.getTranslation("Do you want to use the same account for all of them?", language),
          defaultValue: false,
          actions: {}
        },
        {
          type: "case",
          condition: `grouping.${reason}.${type}`,
          cases: {
            true: await this.account(config2, `${reason}.${type}.*`),
            false: {
              type: "flat",
              elements
            }
          }
        }
      ]
    };
  }
  async submit(label, objectWrapLevel, language) {
    let errorMessage = await this.getTranslation("Saving failed", language);
    let successMessage = await this.getTranslation("Saved successfully", language);
    if (label === "Retry") {
      errorMessage = await this.getTranslation("Retry failed", language);
      successMessage = await this.getTranslation("Retried successfully", language);
    }
    return {
      type: "button",
      label,
      actions: {
        onClick: {
          type: "post",
          url: "",
          objectWrapLevel,
          errorMessage,
          successMessage
        }
      }
    };
  }
  async message(text, severity) {
    return {
      type: "message",
      severity,
      text
    };
  }
  async throwErrorRetry(message, language) {
    throw new AskUI({
      type: "flat",
      elements: [
        await this.message(message, "error"),
        await this.submit("Retry", 0, language)
      ]
    });
  }
  async parseQuery(name, query, language) {
    if ("ask" in query) {
      return {
        name,
        type: "radio",
        label: query.label || await this.getTranslation("Select one of the following:", language),
        actions: {},
        options: query.ask
      };
    } else if ("chooseTag" in query) {
      return {
        name,
        type: "tags",
        label: query.label || await this.getTranslation("Select one of the following:", language),
        actions: {},
        single: true,
        options: query.chooseTag
      };
    } else if ("text" in query) {
      return {
        name,
        type: "text",
        label: query.label || await this.getTranslation("Please enter text:", language),
        actions: {}
      };
    } else {
      throw new SystemError(`Unable to parse UI from query ${JSON.stringify(query)}.`);
    }
  }
  async query(name, query, lines, language) {
    const elements = [];
    if (lines && lines.length) {
      elements.push(await this.describeLines(lines, language));
    }
    if (query instanceof Array) {
      for (const q of query) {
        elements.push(await this.parseQuery(name, q, language));
      }
    } else {
      elements.push(await this.parseQuery(name, query, language));
    }
    elements.push(await this.submit("Continue", 2, language));
    return {
      type: "flat",
      elements
    };
  }
  async throwQuery(name, query, lines, language) {
    const element = await this.query(name, query, lines, language);
    this.throw(element);
  }
  throw(element) {
    throw new AskUI(element);
  }
  async describeLines(lines, language) {
    const viewer = lines.map((line) => ({
      type: "textFileLine",
      line
    }));
    return {
      type: "box",
      elements: [
        {
          type: "html",
          html: `<strong>${await this.getTranslation("Based on the following imported lines", language)}</strong>`
        },
        ...viewer
      ]
    };
  }
  async throwRadioQuestion(text, variable, options, language) {
    throw new AskUI({
      type: "flat",
      elements: [
        {
          type: "message",
          severity: "info",
          text
        },
        {
          type: "radio",
          name: `configure.${variable}`,
          options,
          actions: {}
        },
        {
          type: "button",
          label: await this.deps.getTranslation("Continue", language),
          actions: {
            onClick: {
              type: "post",
              url: "",
              objectWrapLevel: 1
            }
          }
        }
      ]
    });
  }
  async throwNoFilterMatchForLine(lines, config2, options) {
    throw new AskUI({
      type: "ruleEditor",
      name: "once",
      actions: {
        onContinue: {
          type: "post",
          url: ""
        },
        onCreateRule: {
          type: "post",
          url: "/rule"
        }
      },
      config: config2,
      lines,
      options,
      cashAccount: config2.cashAccount
    });
  }
};

// src/import/TransactionRules.ts
init_shim();
var import_tasenor_common23 = require("@dataplug/tasenor-common");
var import_clone4 = __toESM(require_clone());
var TransactionRules = class {
  constructor(handler) {
    this.handler = handler;
    this.UI = handler.UI;
    this.clearCache();
  }
  clearCache() {
    this.cache = {};
  }
  cachedQuery(query) {
    if (query.name) {
      if ((0, import_tasenor_common23.isUIQueryRef)(query)) {
        if (!this.cache[query.name]) {
          throw new BadState(`Cannot use a reference to question '${query.name}' before it is defined.`);
        }
        return this.cache[query.name];
      } else {
        this.cache[query.name] = query;
      }
    }
    return query;
  }
  async getAnswers(segmentId, lines, questions, config2) {
    const language = config2.language;
    const results = {};
    const missing = [];
    for (let [variable, query] of Object.entries(questions)) {
      query = this.cachedQuery(query);
      const answers = config2.answers || {};
      if (segmentId in answers && variable in answers[segmentId]) {
        results[variable] = answers[segmentId][variable];
      } else {
        missing.push(await this.UI.parseQuery(`answer.${segmentId}.${variable}`, query, language));
      }
    }
    if (missing.length) {
      const element = {
        type: "flat",
        elements: [
          await this.UI.describeLines(lines, language),
          ...missing,
          await this.UI.submit("Continue", 2, language)
        ]
      };
      this.UI.throw(element);
    }
    return results;
  }
  async classifyLines(lines, config2, segment) {
    const transfers = [];
    const rules = config2.rules || [];
    const engine = new import_tasenor_common23.RulesEngine();
    let matched = false;
    config2 = (0, import_clone4.default)(config2);
    if (config2.questions) {
      config2.questions.forEach((q) => this.cachedQuery(q));
    }
    const lang = config2.language;
    (0, import_tasenor_common23.debug)("RULES", "============================================================");
    (0, import_tasenor_common23.debug)("RULES", "Classifying segment", segment.id);
    (0, import_tasenor_common23.debug)("RULES", "============================================================");
    try {
      for (const line of lines) {
        let lineHasMatch = false;
        const lineValues = (0, import_clone4.default)(line.columns);
        (0, import_tasenor_common23.debug)("RULES", "-----------------------------------------------------");
        (0, import_tasenor_common23.debug)("RULES", line.text);
        (0, import_tasenor_common23.debug)("RULES", "-----------------------------------------------------");
        (0, import_tasenor_common23.debug)("RULES", lineValues);
        if (config2.answers && line.segmentId) {
          const answers = config2.answers;
          if (answers[line.segmentId] && answers[line.segmentId].transfers) {
            return await this.postProcess(segment, {
              type: "transfers",
              transfers: answers[line.segmentId].transfers
            });
          }
        }
        for (let rule of rules) {
          rule = (0, import_clone4.default)(rule);
          const values = { ...lineValues, config: config2, rule, text: line.text, lineNumber: line.line };
          if (engine.eval(rule.filter, values)) {
            (0, import_tasenor_common23.debug)("RULES", "Rule", rule.name, "with filter", rule.filter, "matches.");
            matched = true;
            lineHasMatch = true;
            if (!rule.result) {
              throw new BadState(`The rule ${JSON.stringify(rule)} has no result section.`);
            }
            const answers = rule.questions ? await this.getAnswers(segment.id, lines, rule.questions, config2) : {};
            const results = "length" in rule.result ? rule.result : [rule.result];
            if (rule.questions) {
              const q = rule.questions;
              Object.keys(q).forEach((key) => {
                q[key] = this.cachedQuery(q[key]);
              });
            }
            let index = 0;
            for (const result of results) {
              (0, import_tasenor_common23.debug)("RULES", `Result[${index}]:`);
              const transfer = {};
              for (const [name, formula] of Object.entries(result)) {
                if (name in transfer) {
                  (0, import_tasenor_common23.warning)(`A rule '${rule.name}' resulted duplicate value in formula '${formula}' for the field '${name}''. Already having ${JSON.stringify(transfer)}.`);
                } else {
                  transfer[name] = engine.eval(formula, { ...values, ...answers });
                  (0, import_tasenor_common23.debug)("RULES", `  ${name} =`, JSON.stringify(transfer[name]));
                }
              }
              if (transfer.if === void 0 || engine.eval(transfer.if, { ...values, ...answers })) {
                if ((0, import_tasenor_common23.isAssetTransfer)(transfer) && transfer.asset !== "undefined" && transfer.asset !== "null") {
                  transfers.push(transfer);
                  if (transfer.if) {
                    (0, import_tasenor_common23.debug)("RULES", "  Accepted condition", transfer.if);
                  }
                } else {
                  console.log("Failing lines:");
                  console.dir(lines, { depth: null });
                  console.log("Matching rule:");
                  console.dir(rule, { depth: null });
                  throw new BadState(`Asset transfer ${JSON.stringify(transfer)} is incomplete.`);
                }
              } else {
                (0, import_tasenor_common23.debug)("RULES", "  Dropped due to condition", transfer.if);
              }
              index++;
            }
            break;
          }
        }
        if (!lineHasMatch) {
          await this.UI.throwNoFilterMatchForLine(lines, config2, this.handler.importOptions);
        }
      }
      if (transfers.length > 0) {
        return await this.postProcess(segment, {
          type: "transfers",
          transfers
        });
      }
    } catch (err) {
      if (err instanceof import_tasenor_common23.RuleParsingError) {
        (0, import_tasenor_common23.error)(`Parsing error in expression '${err.expression}': ${err.message}`);
        if (err.variables.rule) {
          (0, import_tasenor_common23.error)(`While parsig rule ${JSON.stringify(err.variables.rule)}`);
        }
        if (err.variables && err.variables.text) {
          (0, import_tasenor_common23.error)(`Failure in line ${err.variables.lineNumber}: ${err.variables.text}`);
        }
        const msg = (await this.UI.getTranslation("Parsing error in expression `{expr}`: {message}", lang)).replace("{expr}", err.expression).replace("{message}", err.message);
        await this.UI.throwErrorRetry(msg, lang);
      } else {
        throw err;
      }
    }
    if (matched) {
      throw new Error(`Found matches but the result list is empty for ${JSON.stringify(lines)}.`);
    }
    throw new Error(`Could not find rules matching ${JSON.stringify(lines)}.`);
  }
  async postProcess(segment, result) {
    const vatReasons = /* @__PURE__ */ new Set(["dividend", "income", "expense"]);
    const currencies = new Set(result.transfers.filter((t) => vatReasons.has(t.reason) && t.type === "currency").map((t) => t.asset));
    if (currencies.size > 1) {
      throw new SystemError(`Not yet able to sort out VAT for multiple different currencies in ${JSON.stringify(result.transfers)}`);
    }
    if (currencies.size) {
      const currency = [...currencies][0];
      const vatTransfers = [];
      for (const transfer of result.transfers) {
        let vatPct;
        if (transfer.data && "vat" in transfer.data) {
          vatPct = transfer.data.vat;
        } else {
          vatPct = await this.handler.getVAT(segment.time, transfer, currency);
        }
        const vatValue = transfer.data && "vatValue" in transfer.data ? transfer.data.vatValue : null;
        if ((vatPct || vatValue) && transfer.amount) {
          const oldAmount = Math.round(transfer.amount * 100);
          const newAmount = vatValue !== null && vatValue !== void 0 ? Math.round(oldAmount - vatValue * 100) : Math.round(transfer.amount * 100 / (1 + vatPct / 100));
          transfer.amount = newAmount / 100;
          const vat = oldAmount - newAmount;
          const vatEntry = {
            reason: "tax",
            type: "statement",
            asset: vat > 0 ? "VAT_FROM_PURCHASES" : "VAT_FROM_SALES",
            amount: vat / 100,
            data: {
              currency
            }
          };
          if (transfer.tags) {
            vatEntry.tags = transfer.tags;
          }
          vatTransfers.push(vatEntry);
        }
      }
      result.transfers = result.transfers.concat(vatTransfers);
    }
    for (let i = 0; i < result.transfers.length; i++) {
      if ("tags" in result.transfers[i] && typeof result.transfers[i].tags === "object" && result.transfers[i].tags?.length === void 0 && result.transfers[i].tags !== null) {
        const tags = result.transfers[i].tags;
        result.transfers[i].tags = Object.keys(tags).filter((t) => !!tags[t]).sort();
      }
    }
    return result;
  }
};

// src/import/TransactionImportHandler.ts
var TransactionImportHandler = class extends TextFileProcessHandler {
  constructor(name) {
    super(name);
    this.importOptions = {
      parser: "csv",
      numericFields: [],
      requiredFields: [],
      textField: null,
      totalAmountField: null,
      csv: {}
    };
    this.UI = new TransactionUI(this);
    this.rules = new TransactionRules(this);
  }
  canAppend(file) {
    return false;
  }
  getBalance(addr) {
    if (!this.analyzer) {
      throw new Error(`Cannot access balance for ${addr} when no analyzer instantiated.`);
    }
    return this.analyzer.getBalance(addr);
  }
  async getTranslation(text, language) {
    if (!language) {
      throw new SystemError("Language is compulsory setting for importing, if there are unknowns to ask from UI.");
    }
    return this.system.getTranslation(text, language);
  }
  getAccountCanditates(addr, config2) {
    return this.system.connector.getAccountCanditates(addr, config2);
  }
  async groupingById(state) {
    state.segments = {};
    for (const fileName of Object.keys(state.files)) {
      for (let n = 0; n < state.files[fileName].lines.length; n++) {
        const line = state.files[fileName].lines[n];
        if (!line.columns || Object.keys(line.columns).length === 0) {
          continue;
        }
        const id = this.segmentId(line);
        if (!id || !state.segments) {
          throw new InvalidFile(`The segment ID for ${JSON.stringify(line)} was not found by ${this.constructor.name}.`);
        }
        if (id === import_tasenor_common24.NO_SEGMENT) {
          continue;
        }
        state.segments[id] = state.segments[id] || { id, time: void 0, lines: [] };
        state.segments[id].lines.push({ number: n, file: fileName });
        line.segmentId = id;
      }
      if (!state.segments) {
        throw new InvalidFile("This cannot happen.");
      }
      Object.values(state.segments).forEach((segment) => {
        const stamps = /* @__PURE__ */ new Set();
        segment.lines.forEach((segmentLine) => {
          const line = state.files[segmentLine.file].lines[segmentLine.number];
          const time = this.time(line);
          if (time) {
            stamps.add(time.getTime());
          }
        });
        if (stamps.size === 0) {
          throw new InvalidFile(`Was not able to find timestamps for lines ${JSON.stringify(segment.lines)}.`);
        }
        if (stamps.size > 1) {
          throw new InvalidFile(`Found more than one (${stamps.size}) canditate for timestamp (${[...stamps]}) from lines ${JSON.stringify(segment.lines)}.`);
        }
        segment.time = new Date([...stamps][0]);
      });
    }
    return state;
  }
  async parse(state, config2 = {}) {
    switch (this.importOptions.parser) {
      case "csv":
        return this.parseCSV(state, this.importOptions.csv);
      default:
        throw new SystemError(`Parser '${this.importOptions.parser}' is not implemented.`);
    }
  }
  async segmentationCSV(process2, state, files) {
    const parsed = await this.parse(state, process2.config);
    const newState = await this.groupingById(parsed);
    this.debugSegmentation(newState);
    return newState;
  }
  async segmentationPostProcess(state) {
    for (const fileName of Object.keys(state.files)) {
      const { textField, totalAmountField } = this.importOptions;
      for (let n = 0; n < state.files[fileName].lines.length; n++) {
        const columns = state.files[fileName].lines[n].columns;
        for (const name of this.importOptions.requiredFields) {
          if (columns[name] === void 0) {
            columns[name] = "";
          }
        }
        for (const name of this.importOptions.numericFields) {
          if (columns[name] !== void 0) {
            columns[name] = columns[name] === "" ? 0 : (0, import_tasenor_common24.num)(columns[name]);
          }
        }
        if (textField) {
          columns._textField = columns[textField];
        }
        if (totalAmountField) {
          columns._totalAmountField = columns[totalAmountField];
        }
      }
    }
    return state;
  }
  async segmentation(process2, state, files) {
    const result = await this.segmentationPostProcess(await this.segmentationCSV(process2, state, files));
    return result;
  }
  debugSegmentation(state) {
    if (state.files) {
      Object.keys(state.files).forEach((fileName) => {
        (0, import_tasenor_common24.debug)("SEGMENTATION", `Segmentation of ${fileName}`);
        (0, import_tasenor_common24.debug)("SEGMENTATION", state.files[fileName].lines.filter((line) => Object.keys(line.columns).length > 0));
      });
    }
  }
  hash(line) {
    const obj = Object.entries(line.columns).filter((entry) => entry[1] !== void 0).reduce((prev, cur) => ({ ...prev, [cur[0]]: cur[1].trim() }), {});
    return import_object_hash.default.sha1(obj);
  }
  segmentId(line) {
    if (line.columns && Object.keys(line.columns).length) {
      return this.hash(line);
    }
    return import_tasenor_common24.NO_SEGMENT;
  }
  time(line) {
    throw new NotImplemented(`Import class ${this.constructor.name} does not implement time().`);
  }
  async classification(process2, state, files) {
    const newState = {
      stage: "classified",
      files: state.files,
      segments: state.segments,
      result: {}
    };
    if (state.segments) {
      for (const segment of this.sortSegments(state.segments)) {
        const lines = segment.lines.map((fileRef) => state.files[fileRef.file].lines[fileRef.number]);
        const result = await this.classifyLines(lines, process2.config, state.segments[segment.id]);
        if (newState.result) {
          newState.result[segment.id] = [result];
        }
      }
    }
    this.debugClassification(newState);
    return newState;
  }
  debugClassification(state) {
    if (state.result) {
      Object.keys(state.result).forEach((segmentId) => {
        if (state.result && state.result[segmentId]) {
          (0, import_tasenor_common24.debug)("CLASSIFICATION", `Classification of ${segmentId}`);
          (0, import_tasenor_common24.debug)("CLASSIFICATION", state.result[segmentId]);
        }
      });
    }
  }
  async classifyLines(lines, config2, segment) {
    return await this.rules.classifyLines(lines, config2, segment);
  }
  getLines(state, segmentId) {
    if (state.segments && state.segments[segmentId]) {
      const segment = state.segments[segmentId];
      const lines = segment.lines.map((line) => state.files[line.file].lines[line.number]);
      return lines;
    }
    return null;
  }
  async needInputForAnalysis(state, config2) {
    if (!state.result || !state.segments) {
      return false;
    }
    const missing = /* @__PURE__ */ new Set();
    const analyzer = new TransferAnalyzer(this, config2, state);
    for (const [segmentId, result] of Object.entries(state.result)) {
      const segment = state.segments[segmentId];
      const items = result;
      for (const transfer of items) {
        for (const acc of await analyzer.collectAccounts(segment, transfer, { findMissing: true })) {
          missing.add(acc);
        }
      }
      for (const address of missing) {
        if (config2.answers) {
          const answers = config2.answers;
          if (segmentId in answers && `account.${address}` in answers[segmentId] && answers[segmentId][`account.${address}`] !== void 0) {
            missing.delete(address);
            continue;
          }
        }
        const [reason, type, asset] = address.split(".");
        const query = await analyzer.getAccountQuery(reason, type, asset);
        const lines = this.getLines(state, segmentId);
        if (!lines) {
          throw new Error(`Failed to collect lines for segment ${segmentId}.`);
        }
        if (query) {
          const description = await this.UI.describeLines(lines, config2.language);
          const question = await this.UI.query(`answer.${segmentId}.account.${address}`, query, [], config2.language);
          return new import_tasenor_common24.Directions({
            type: "ui",
            element: {
              type: "flat",
              elements: [description, question]
            }
          });
        }
      }
    }
    if (!missing.size) {
      return false;
    }
    return this.directionsForMissingAccounts(missing, config2);
  }
  async directionsForMissingAccounts(missing, config2) {
    const configured = Object.keys(config2).filter((key) => /^account\.\w+\.\w+\./.test(key));
    const pairs = {};
    for (const address of configured) {
      const [, reason, type, asset] = address.split(".");
      if (asset !== "*") {
        pairs[`${reason}.${type}`] = pairs[`${reason}.${type}`] || /* @__PURE__ */ new Set();
        pairs[`${reason}.${type}`].add(`${reason}.${type}.${asset}`);
      }
    }
    for (const address of missing) {
      const [reason, type, asset] = address.split(".");
      pairs[`${reason}.${type}`] = pairs[`${reason}.${type}`] || /* @__PURE__ */ new Set();
      pairs[`${reason}.${type}`].add(`${reason}.${type}.${asset}`);
    }
    const elements = [];
    for (const addresses of Object.values(pairs)) {
      if (addresses.size === 1) {
        if (missing.has([...addresses][0])) {
          elements.push(await this.UI.account(config2, [...addresses][0]));
        }
      } else {
        let count = 0;
        for (const address of addresses) {
          if (missing.has(address))
            count++;
        }
        if (count) {
          elements.push(await this.UI.accountGroup(config2, [...addresses]));
        }
      }
    }
    if (elements.length === 0) {
      return false;
    }
    elements.push(await this.UI.submit("Continue", 1, config2.language));
    return new import_tasenor_common24.Directions({
      type: "ui",
      element: {
        type: "flat",
        elements
      }
    });
  }
  sortSegments(segments) {
    const time = (entry) => {
      return typeof entry.time === "string" ? new Date(entry.time).getTime() : entry.time.getTime();
    };
    return Object.values(segments).sort((a, b) => time(a) - time(b));
  }
  async analysis(process2, state, files, config2) {
    this.analyzer = new TransferAnalyzer(this, config2, state);
    if (state.result && state.segments) {
      const segments = this.sortSegments(state.segments);
      let lastResult;
      if (segments.length) {
        let firstTimeStamp;
        const confStartDate = config2.firstDate ? new Date(`${config2.firstDate}T00:00:00.000Z`) : null;
        for (let i = 0; i < segments.length; i++) {
          const segmentTime = typeof segments[i].time === "string" ? new Date(segments[i].time) : segments[i].time;
          if (!confStartDate || segmentTime >= confStartDate) {
            firstTimeStamp = segmentTime;
            break;
          }
        }
        if (!firstTimeStamp) {
          throw new Error(`Unable to find any valid time stamps after ${confStartDate}.`);
        }
        lastResult = state.result[segments[segments.length - 1].id];
        await this.analyzer.initialize(firstTimeStamp);
      }
      for (const segment of segments) {
        const txDesc = state.result[segment.id];
        if (!txDesc) {
          throw new BadState(`Cannot find results for segment ${segment.id} during analysis (${JSON.stringify(segment)})`);
        }
        for (let i = 0; i < txDesc.length; i++) {
          txDesc[i] = await this.analyze(txDesc[i], segment, config2, state);
        }
      }
      const balances = this.analyzer.getBalances().filter((balance) => balance.mayTakeLoan);
      if (lastResult && balances.length) {
        if (!this.analyzer)
          throw new Error("No analyzer. Internal error.");
        const lastTxs = lastResult[lastResult.length - 1].transactions;
        for (const balance of balances) {
          const loanTx = {
            date: lastTxs[lastTxs.length - 1].date,
            segmentId: lastTxs[lastTxs.length - 1].segmentId,
            entries: []
          };
          const [loanReason, loanType, loanAsset] = balance.debtAddress.split(".");
          const loanAccount = await this.analyzer.getAccount(loanReason, loanType, loanAsset);
          if (balance.account === loanAccount) {
            continue;
          }
          const accountBalance = this.analyzer.getBalance(balance.address) || 0;
          const debtBalance = this.analyzer.getBalance(balance.debtAddress) || 0;
          let entry;
          let entry2;
          if ((0, import_tasenor_common24.realNegative)(accountBalance)) {
            const description = await this.getTranslation("Additional loan taken", config2.language);
            entry = {
              account: balance.account,
              amount: -accountBalance,
              description
            };
            entry2 = {
              account: loanAccount || "0",
              amount: accountBalance,
              description
            };
          } else if ((0, import_tasenor_common24.realNegative)(debtBalance)) {
            const description = await this.getTranslation("Loan paid back", config2.language);
            const payBack = Math.abs(Math.min(-debtBalance, accountBalance));
            if ((0, import_tasenor_common24.realPositive)(payBack)) {
              entry = {
                account: balance.account,
                amount: -payBack,
                description
              };
              entry2 = {
                account: loanAccount || "0",
                amount: payBack,
                description
              };
            }
          }
          if (entry && entry2) {
            const tags = await this.analyzer.getTagsForAddr(balance.debtAddress);
            if (tags) {
              const prefix = tags instanceof Array ? `[${tags.join("][")}]` : tags;
              entry.description = `${prefix} ${entry.description}`;
              entry2.description = `${prefix} ${entry2.description}`;
            }
            loanTx.entries.push(entry);
            this.analyzer.applyBalance(entry);
            loanTx.entries.push(entry2);
            this.analyzer.applyBalance(entry2);
            lastTxs.push(loanTx);
          }
        }
      }
    }
    const newState = {
      ...state,
      stage: "analyzed"
    };
    this.debugAnalysis(newState);
    return newState;
  }
  async analyze(txs, segment, config2, state) {
    if (!this.analyzer) {
      throw new SystemError("Calling analyze() without setting up analyzer.");
    }
    switch (txs.type) {
      case "transfers":
        return await this.analyzer.analyze(txs, segment, config2);
      default:
        throw new NotImplemented(`Cannot analyze yet type '${txs.type}' in ${this.constructor.name}.`);
    }
  }
  debugAnalysis(state) {
    if (state.result !== void 0) {
      Object.keys(state.result).forEach((segmentId) => {
        (0, import_tasenor_common24.debug)("ANALYSIS", `Analyzed ${segmentId}`);
        if (state.result && segmentId in state.result) {
          for (const result of state.result[segmentId]) {
            (0, import_tasenor_common24.debug)("ANALYSIS", result.transfers);
          }
        }
      });
    }
  }
  async execution(process2, state, files) {
    const output = new import_tasenor_common24.TransactionApplyResults();
    if (state.result) {
      for (const segmentId of Object.keys(state.result)) {
        const result = state.result[segmentId];
        for (const res of result) {
          if (res.transactions) {
            for (const tx of res.transactions) {
              if (!tx.executionResult)
                tx.executionResult = "not done";
            }
          }
        }
      }
      for (const segmentId of Object.keys(state.result)) {
        (0, import_tasenor_common24.debug)("EXECUTION", `Execution of segment ${segmentId}`);
        const result = state.result[segmentId];
        for (const res of result) {
          (0, import_tasenor_common24.debug)("EXECUTION", res.transactions);
          const applied = await this.system.connector.applyResult(process2.id, res);
          output.add(applied);
        }
      }
    }
    this.analyzer = null;
    return {
      ...state,
      output: output.toJSON(),
      stage: "executed"
    };
  }
  async getVAT(time, transfer, currency) {
    const connector = this.system.connector;
    return connector.getVAT(time, transfer, currency);
  }
  async getRate(time, type, asset, currency, exchange) {
    if (!isTransactionImportConnector(this.system.connector)) {
      throw new SystemError("Connector used is not a transaction import connector.");
    }
    return this.system.connector.getRate(time, type, asset, currency, exchange);
  }
};

// src/net/index.ts
init_shim();

// src/net/crypto.ts
init_shim();
var import_crypto = __toESM(require("crypto"));
var import_bcrypt = __toESM(require("bcrypt"));
var Password = class {
  static async hash(password) {
    const salt = await import_bcrypt.default.genSalt(13);
    const hash2 = await import_bcrypt.default.hash(password, salt);
    return hash2;
  }
  static async compare(password, hash2) {
    return await import_bcrypt.default.compare(password, hash2);
  }
};
function randomString(len = 32) {
  const buf = import_crypto.default.randomBytes(len / 2);
  return buf.toString("hex");
}
function createUuid() {
  function randomDigit() {
    const rand = import_crypto.default.randomBytes(1);
    return (rand[0] % 16).toString(16);
  }
  return "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/x/g, randomDigit);
}

// src/net/git.ts
init_shim();
var import_tasenor_common25 = require("@dataplug/tasenor-common");
var import_simple_git = __toESM(require("simple-git"));
var import_git_url_parse = __toESM(require("git-url-parse"));
var import_fs9 = __toESM(require("fs"));
var import_fast_glob2 = __toESM(require_out4());
var import_path6 = __toESM(require("path"));
var GitRepo = class {
  constructor(url, rootDir) {
    this.url = url;
    this.name = GitRepo.defaultName(url);
    this.setDir(rootDir);
    this.git.outputHandler(function(command, stdout, stderr) {
      stdout.on("data", (str) => (0, import_tasenor_common25.log)(`GIT: ${str}`.trim()));
      stderr.on("data", (str) => (0, import_tasenor_common25.warning)(`GIT: ${str.toString("utf-8")}`.trim()));
    });
  }
  get fullPath() {
    return import_path6.default.join(this.rootDir, this.name);
  }
  configure(name, email) {
    this.git.addConfig("user.name", name).addConfig("user.email", email);
  }
  setDir(rootDir) {
    this.rootDir = rootDir;
    if (import_fs9.default.existsSync(this.fullPath)) {
      this.git = (0, import_simple_git.default)({ baseDir: this.fullPath });
    } else {
      this.git = (0, import_simple_git.default)();
    }
  }
  async clean() {
    if (!import_fs9.default.existsSync(this.fullPath)) {
      return;
    }
    await import_fs9.default.promises.rm(this.fullPath, { recursive: true });
  }
  async fetch() {
    if (import_fs9.default.existsSync(this.fullPath)) {
      return false;
    }
    await this.git.clone(this.url, this.fullPath);
    this.setDir(this.rootDir);
    return true;
  }
  glob(pattern) {
    const N = this.fullPath.length;
    return import_fast_glob2.default.sync(this.fullPath + "/" + pattern).map((s) => {
      if (s.substring(0, N) !== this.fullPath) {
        throw new Error(`Strage. Glob found a file ${s} from repo ${this.fullPath}.`);
      }
      return s.substring(N + 1);
    });
  }
  async put(message, ...subPaths) {
    await this.git.add(subPaths);
    await this.git.commit(message);
    await this.git.push();
  }
  static async all(dir) {
    const repos = [];
    const dotGits = import_fast_glob2.default.sync(dir + "/*/.git");
    for (const dotGit of dotGits) {
      const dir2 = import_path6.default.dirname(dotGit);
      const remote = (await (0, import_simple_git.default)(dir2).getRemotes(true)).find((r) => r.name === "origin");
      if (remote) {
        repos.push(new GitRepo(remote.refs.fetch, dir2));
      }
    }
    return repos;
  }
  static defaultName(repo) {
    const { pathname } = (0, import_git_url_parse.default)(repo);
    return import_path6.default.basename(pathname).replace(/\.git/, "");
  }
  static async get(repoUrl, parentDir, runYarnInstall = false) {
    const repo = new GitRepo(repoUrl, parentDir);
    const fetched = await repo.fetch();
    if (fetched && runYarnInstall) {
      await systemPiped(`cd "${repo.fullPath}" && yarn install`);
    }
    return repo;
  }
};

// src/net/middleware.ts
init_shim();
var import_cors = __toESM(require("cors"));
var import_express = __toESM(require("express"));
var import_tasenor_common27 = require("@dataplug/tasenor-common");

// src/net/tokens.ts
init_shim();
var import_tasenor_common26 = require("@dataplug/tasenor-common");
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_ts_opaque4 = require("ts-opaque");

// src/net/vault.ts
init_shim();
var ALLOWED_VAULT_VARIABLES = [
  "TASENOR_API_URL",
  "API_SITE_TOKEN",
  "DATABASE_ROOT_PASSWORD",
  "DATABASE_ROOT_USER",
  "DATABASE_URL",
  "SECRET",
  "ERP_SITE_TOKEN"
];
var validVariables = new Set(ALLOWED_VAULT_VARIABLES);
var Vault = class {
  constructor(url) {
    this.url = url;
    this.values = {};
    this.initialized = false;
    this.secret = null;
  }
  async initialize() {
    throw new Error(`A class ${this.constructor.name} does not implement initialize().`);
  }
  get(variable) {
    if (!validVariables.has(variable))
      throw new Error(`A variable ${variable} is not valid vault value.`);
    if (!(variable in this.values)) {
      throw new Error(`Cannot find variable ${variable} from the vault.`);
    }
    return this.values[variable];
  }
  getPrivateSecret() {
    if (this.secret === null) {
      this.secret = randomString(512);
    }
    return this.secret;
  }
  setPrivateSecret(secret) {
    this.secret = secret;
  }
};
var EnvironmentVault = class extends Vault {
  async initialize() {
    for (const variable of ALLOWED_VAULT_VARIABLES) {
      const value = import_process.default.env[variable];
      if (value !== void 0) {
        this.values[variable] = value;
      }
    }
  }
};
var currentVault;
function getVault() {
  if (currentVault && currentVault.url === import_process.default.env.VAULT_URL)
    return currentVault;
  if (!import_process.default.env.VAULT_URL) {
    throw new Error("No VAULT_URL set and cannot instantiate the vault.");
  }
  const url = new URL(import_process.default.env.VAULT_URL);
  switch (url.protocol) {
    case "env:":
      currentVault = new EnvironmentVault(import_process.default.env.VAULT_URL);
      break;
    default:
      throw new Error(`Cannot recognize protocol ${url.protocol} of vault URL ${import_process.default.env.VAULT_URL}`);
  }
  return currentVault;
}
function get2(variable) {
  const vault2 = getVault();
  if (!vault2.initialized) {
    throw new Error("Cannot use the vault before it is initialized.");
  }
  const value = vault2.get(variable);
  if (value === void 0) {
    throw new Error(`Cannot find value ${variable} from the vault.`);
  }
  return value;
}
function getPrivateSecret() {
  const vault2 = getVault();
  if (!vault2.initialized) {
    throw new Error("Cannot use the vault before it is initialized.");
  }
  return vault2.getPrivateSecret();
}
function setPrivateSecret(secret) {
  const vault2 = getVault();
  vault2.setPrivateSecret(secret);
}
async function initialize() {
  const vault2 = getVault();
  vault2.initialized = true;
  await vault2.initialize();
}
var vault = {
  get: get2,
  getPrivateSecret,
  getVault,
  initialize,
  setPrivateSecret
};

// src/net/tokens.ts
function get3(request) {
  let token;
  if (request.query && request.query.token) {
    token = request.query.token;
  } else if (request.headers.authorization && /^Bearer /.test(request.headers.authorization)) {
    token = request.headers.authorization.substr(7);
  }
  return token;
}
async function sign(payload, audience, expires = 0) {
  const secret = audience === "refresh" ? await vault.get("SECRET") : vault.getPrivateSecret();
  if (!secret) {
    throw new Error("Cannot fins secret to sign token.");
  }
  if (!expires) {
    expires = audience === "refresh" ? import_tasenor_common26.REFRESH_TOKEN_EXPIRY_TIME : import_tasenor_common26.TOKEN_EXPIRY_TIME;
  }
  const options = {
    audience,
    expiresIn: expires,
    issuer: import_tasenor_common26.TOKEN_ISSUER
  };
  const token = (0, import_ts_opaque4.create)(import_jsonwebtoken.default.sign({ data: payload }, secret, options));
  return token;
}
async function sign2(payload, audience, expires = 0) {
  const token = await sign(payload, audience, expires);
  const refresh = await sign({ audience, owner: payload.owner, feats: payload.feats, plugins: payload.plugins }, "refresh", expires * 2);
  return { token, refresh };
}
function verify(token, secret, audience, quiet = false) {
  if (!secret)
    throw new Error("Cannot verify token since no secret given.");
  if (!audience)
    throw new Error("Cannot verify token since no audience given.");
  function fail(msg) {
    if (!quiet)
      (0, import_tasenor_common26.error)(msg);
  }
  try {
    const decoded = import_jsonwebtoken.default.verify(token, secret, { audience, issuer: [import_tasenor_common26.TOKEN_ISSUER] });
    if (!decoded) {
      fail("Cannot decode the token.");
    } else if (!decoded.data) {
      fail(`Cannot find any payload from the token ${token}.`);
    } else {
      if (!decoded.exp) {
        fail(`Token content ${decoded} does not have exp-field.`);
        return null;
      }
      if (decoded.data.audience) {
        const data = decoded.data;
        if (!data.owner || !data.feats) {
          fail(`Cannot find proper payload from the refresh token with content ${JSON.stringify(decoded)}.`);
          return null;
        } else {
          return data;
        }
      } else {
        const data = decoded.data;
        if (!data.owner || !data.feats) {
          fail(`Cannot find proper payload from the token with content ${JSON.stringify(decoded)}.`);
          return null;
        } else {
          return data;
        }
      }
    }
  } catch (err) {
    fail(`Token verification failed ${err} for ${JSON.stringify(parse(token))}`);
  }
  return null;
}
function parse(token) {
  const decoded = import_jsonwebtoken.default.decode(token, { json: true, complete: true });
  return decoded;
}
async function check(token, audience, quiet = false) {
  if (!token) {
    return false;
  }
  const secret = audience === "refresh" ? await vault.get("SECRET") : vault.getPrivateSecret();
  if (!secret) {
    return false;
  }
  const payload = tokens.verify(token, secret, audience, quiet);
  return !!payload;
}
var tokens = {
  check,
  get: get3,
  parse,
  sign,
  sign2,
  verify
};

// src/net/middleware.ts
var import_helmet = __toESM(require("helmet"));
function cleanUrl(url) {
  return url.replace(/\btoken=[^&]+\b/, "token=xxxx");
}
function tasenorInitialStack(args) {
  const stack = [];
  stack.push((req, res, next) => {
    if (req.method !== "OPTIONS") {
      let owner;
      const token = tokens.get(req);
      if (token) {
        const payload = tokens.parse(token);
        if (payload && payload.payload && payload.payload.data) {
          owner = payload.payload.data.owner;
          let aud = payload.payload.aud;
          if (payload.payload.aud === "refresh") {
            aud = payload.payload.data.audience;
          }
          switch (aud) {
            case "sites":
              owner = `Site ${owner}`;
              break;
            case "bookkeeping":
              owner = `User ${owner}`;
              break;
          }
        }
      }
      const user = owner ? `${owner} from ${req.ip}` : `${req.ip}`;
      const message = `${user} ${req.method} ${req.hostname} ${cleanUrl(req.originalUrl)}`;
      (0, import_tasenor_common27.log)(message);
    }
    next();
  });
  stack.push((0, import_cors.default)({ origin: args.origin }));
  let contentSecurityPolicy;
  if (args.api) {
    const apiOrigin = new URL(args.api).origin;
    contentSecurityPolicy = {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'", apiOrigin],
        imgSrc: ["'self'", "data:", apiOrigin],
        scriptSrc: ["'self'", "'unsafe-eval'"]
      }
    };
  } else {
    contentSecurityPolicy = false;
  }
  stack.push((0, import_helmet.default)({
    contentSecurityPolicy
  }));
  return stack;
}
function tasenorFinalStack() {
  const stack = [];
  stack.push((err, req, res, next) => {
    (0, import_tasenor_common27.error)("Internal error:", err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).send({ message: "Internal server error." });
    const message = `${req.ip} ${req.method} ${req.hostname} ${cleanUrl(req.originalUrl)} => ${res.statusCode}`;
    (0, import_tasenor_common27.error)(message);
  });
  return stack;
}
function tasenorStack({ url, json, user, uuid, admin, superuser, audience, token, upload }) {
  const stack = [];
  if (superuser) {
    admin = true;
  }
  if (admin) {
    user = true;
  }
  if (user && !audience) {
    audience = "bookkeeping";
  }
  if (audience) {
    token = true;
  }
  if (uuid) {
    token = true;
  }
  const params = {};
  if (upload) {
    params.limit = import_tasenor_common27.MAX_UPLOAD_SIZE;
  }
  if (url || upload && !url && !json) {
    stack.push(import_express.default.urlencoded({ extended: true, ...params }));
  }
  if (json) {
    stack.push(import_express.default.json({ ...params }));
  }
  if (token) {
    stack.push(async (req, res, next) => {
      res.locals.token = tokens.get(req);
      next();
    });
  }
  if (uuid) {
    stack.push(async (req, res, next) => {
      if (!res.locals.token) {
        (0, import_tasenor_common27.error)("There is no token in the request and we are looking for UUID.");
        return res.status(403).send({ message: "Forbidden." });
      }
      const uuid2 = req.headers["x-uuid"];
      if (!uuid2) {
        (0, import_tasenor_common27.error)("Cannot find UUID from the request.");
        return res.status(403).send({ message: "Forbidden." });
      }
      const payload = tokens.parse(res.locals.token);
      if (!payload) {
        (0, import_tasenor_common27.error)(`Cannot parse payload from the token ${res.locals.token}`);
        return res.status(403).send({ message: "Forbidden." });
      }
      const audience2 = payload.payload.aud;
      const secret = vault.getPrivateSecret();
      const ok = tokens.verify(res.locals.token, secret, audience2);
      if (!ok) {
        (0, import_tasenor_common27.error)(`Failed to verify token ${res.locals.token} for audience ${audience2}.`);
        return res.status(403).send({ message: "Forbidden." });
      }
      res.locals.uuid = uuid2;
      res.locals.owner = ok.owner;
      next();
    });
  }
  if (audience) {
    stack.push(async (req, res, next) => {
      const token2 = res.locals.token;
      if (!token2) {
        (0, import_tasenor_common27.error)(`Request ${req.method} ${cleanUrl(req.originalUrl)} from ${req.ip} has no token.`);
        res.status(401).send({ message: "Unauthorized." });
        return;
      }
      const secret = audience === "refresh" ? await vault.get("SECRET") : vault.getPrivateSecret();
      if (!secret) {
        (0, import_tasenor_common27.error)("Cannot find SECRET.");
        return res.status(500).send({ message: "Unable to handle authorized requests at the moment." });
      }
      if (!audience) {
        return res.status(500).send({ message: "Internal error." });
      }
      const payload = tokens.verify(token2, secret, audience);
      if (!payload) {
        (0, import_tasenor_common27.error)(`Request from ${req.ip} has bad token ${token2}`);
        return res.status(403).send({ message: "Forbidden." });
      }
      if (admin && !payload.feats.ADMIN && !payload.feats.SUPERUSER) {
        (0, import_tasenor_common27.error)(`Request denied for admin access to ${JSON.stringify(payload)}`);
        return res.status(403).send({ message: "Forbidden." });
      }
      if (superuser && !payload.feats.SUPERUSER) {
        (0, import_tasenor_common27.error)(`Request denied for superuser access to ${JSON.stringify(payload)}`);
        return res.status(403).send({ message: "Forbidden." });
      }
      res.locals.auth = payload;
      res.locals.user = payload.owner;
      next();
    });
  }
  return stack;
}

// src/plugins/index.ts
init_shim();

// src/plugins/BackendPlugin.ts
init_shim();
var import_tasenor_common28 = require("@dataplug/tasenor-common");
var import_path7 = __toESM(require("path"));
var import_fs10 = __toESM(require("fs"));
var BackendPlugin = class {
  constructor() {
    this.id = null;
    this.code = "";
    this.title = "";
    this.version = null;
    this.releaseDate = null;
    this.use = "unknown";
    this.type = "unknown";
    this.icon = "";
    this.description = "";
    this.path = "";
    this.languages = {};
  }
  async install() {
  }
  async uninstall() {
  }
  async installToDb(db) {
  }
  async uninstallFromDb(db) {
  }
  get fullPath() {
    return this.path;
  }
  filePath(name) {
    return `${this.fullPath}/backend/${name}`;
  }
  toJSON() {
    return {
      id: this.id,
      code: this.code,
      title: this.title,
      description: this.description,
      icon: this.icon,
      version: this.version,
      releaseDate: this.releaseDate,
      use: this.use,
      type: this.type,
      path: this.path
    };
  }
  getSettings() {
    return null;
  }
  t(str, lang) {
    if (this.catalog) {
      return this.catalog.t(str, lang);
    }
    if (lang in this.languages && str in this.languages[lang]) {
      return this.languages[lang][str];
    }
    return str;
  }
  async getSetting(db, name) {
    const setting = await db("settings").select("value").where({ name: `${this.code}.${name}` }).first();
    return setting ? setting.value : void 0;
  }
  async hourly(hour) {
  }
  async nightly(db) {
  }
  getWorkSpace(db) {
    const workdir = import_path7.default.join((0, import_tasenor_common28.getServerRoot)(), "src", "plugins", "workspace", this.code, db.client.config.connection.database);
    if (!import_fs10.default.existsSync(workdir)) {
      import_fs10.default.mkdirSync(workdir, { recursive: true });
    }
    import_fs10.default.chmodSync(workdir, 448);
    return workdir;
  }
  static create(Class, path10, catalog) {
    const instance = new Class();
    instance.path = path10;
    instance.catalog = catalog;
    return instance;
  }
};

// src/plugins/DataPlugin.ts
init_shim();
var import_fs11 = __toESM(require("fs"));
var DataPlugin = class extends BackendPlugin {
  constructor(...sources) {
    super();
    this.sources = sources;
  }
  async getKnowledge() {
    const result = {};
    for (const source of this.sources) {
      const filePath = this.filePath(`${source}.json`);
      const data = JSON.parse(import_fs11.default.readFileSync(filePath).toString("utf-8"));
      Object.assign(result, { [source]: data });
    }
    return result;
  }
};

// src/plugins/ImportPlugin.ts
init_shim();
var import_tasenor_common29 = require("@dataplug/tasenor-common");
var import_fs12 = __toESM(require("fs"));
var ImportPlugin = class extends BackendPlugin {
  constructor(handler) {
    super();
    this.handler = handler;
    this.UI = handler.UI;
    this.languages = this.getLanguages();
  }
  getLanguages() {
    return {
      en: {
        "account-debt-currency": "Account for recording debt in {asset} currency",
        "account-deposit-currency": "Account for depositing {asset} currency",
        "account-deposit-external": "Account for external deposit source for {asset}",
        "account-distribution-currency": "Account to pay our {asset} dividends from",
        "account-distribution-statement": "Account to record our dividend payments for {asset}",
        "account-dividend-currency": "Account for recording received {asset} dividends",
        "account-expense-currency": "Account for expenses in {asset} currency",
        "account-expense-statement": "Account for recording expense {asset}",
        "account-fee-currency": "Account for fees in {asset} currency",
        "account-fee-crypto": "Account for fees in {asset} crypto currency",
        "account-forex-currency": "Account for {asset} foreign exchange",
        "account-income-currency": "Account for income in {asset} currency",
        "account-income-statement": "Account for recording income {asset}",
        "account-investment-currency": "Account for receiving investments in {asset} currency",
        "account-investment-statement": "Account for recording investment {asset}",
        "account-tax-currency": "Account for recording tax in currency {asset}",
        "account-tax-statement": "Account for tax statament {asset}",
        "account-trade-crypto": "Account for trading crypto currency {asset}",
        "account-trade-stock": "Account for trading stocks {asset}",
        "account-trade-currency": "Account for using currency {asset} for trading",
        "account-transfer-currency": "Account for transferring currency {asset}",
        "account-transfer-external": "Account for transferring to/from external source {asset}",
        "account-withdrawal-currency": "Account for withdrawing currency {asset}",
        "account-withdrawal-external": "Account for withdrawing from external source {asset}",
        "asset-type-crypto": "a crypto currency",
        "asset-type-currency": "a currency",
        "asset-type-external": "an external instance",
        "asset-type-statement": "a statement recording",
        "asset-type-stock": "a stock exchange traded asset",
        "asset-type-short": "a short position",
        "import-text-buy": "Buy {takeAmount} {takeAsset}",
        "import-text-correction": "{name}",
        "import-text-deposit": "Deposit to {exchange} service",
        "import-text-distribution": "{name}",
        "import-text-dividend": "Dividend {asset}",
        "import-text-expense": "{name}",
        "import-text-forex": "Sell currency {giveAsset} for {takeAsset}",
        "import-text-income": "{name}",
        "import-text-investment": "{name}",
        "import-text-sell": "Sell {giveAmount} {giveAsset}",
        "import-text-short-buy": "Closing short position {takeAmount} {takeAsset}",
        "import-text-short-sell": "Short selling {giveAmount} {giveAsset}",
        "import-text-tax": "{name}",
        "import-text-trade": "Trade {giveAmount} {giveAsset} {takeAmount} {takeAsset}",
        "import-text-transfer": "{service} transfer",
        "import-text-withdrawal": "Withdrawal from {exchange} service",
        "reason-deposit": "deposit",
        "reason-dividend": "payment",
        "reason-expense": "expense",
        "reason-fee": "fee",
        "reason-forex": "exchange",
        "reason-income": "income",
        "reason-trade": "trading",
        "reason-transfer": "transfers",
        "reason-withdrawal": "withdrawal",
        "note-split": "Split",
        "note-converted": "Converted"
      },
      fi: {
        "account-debt-currency": "Tili veloille valuutassa {asset}",
        "account-deposit-currency": "Tili valuutan {asset} talletuksille",
        "account-deposit-external": "Vastatili ulkoisille talletuksille {asset}",
        "account-distribution-currency": "Tili, josta maksetaan {asset} osingot",
        "account-distribution-statement": "Raportointitili, johon kirjataan maksettavat osingot {asset}",
        "account-dividend-currency": "Tili saaduista {asset} osingoista",
        "account-expense-currency": "Tili kuluille {asset} valuutassa",
        "account-expense-statement": "Raportointitili {asset} kuluille",
        "account-fee-currency": "Tili k\xE4ytt\xF6maksuille {asset} valuutassa",
        "account-fee-crypto": "Tili k\xE4ytt\xF6maksuille {asset} kryptovaluutassa",
        "account-forex-currency": "Valuutanvaihtotili {asset} valuutalle",
        "account-income-currency": "Tili tuloille {asset} valuutassa",
        "account-income-statement": "Raportointitili {asset} tuloille",
        "account-investment-currency": "Tili saaduille sijoituksille {asset} valuutassa",
        "account-investment-statement": "Raportointitili sijoituksille {asset} valuutassa",
        "account-tax-currency": "Verot {asset} valuutassa",
        "account-tax-statement": "Raportointitili veroille {asset} valuutassa",
        "account-trade-crypto": "Vaihto-omaisuustili {asset} kryptovaluutalle",
        "account-trade-stock": "Vaihto-omaisuustili {asset} osakkeelle",
        "account-trade-currency": "Valuuttatili {asset} valuutalle vaihto-omaisuuden hankintaan",
        "account-transfer-currency": "Siirtotili {asset} valuutalle",
        "account-transfer-external": "Siirtotili ulkoiseen kohteeseen {asset} valuutalle",
        "account-withdrawal-currency": "Nostotili {asset} valuutalle",
        "account-withdrawal-external": "Vastatili valuutan {asset} nostoille",
        "asset-type-crypto": "kryptovaluutta",
        "asset-type-currency": "valuutta",
        "asset-type-external": "ulkopuolinen instanssi",
        "asset-type-statement": "raportointi",
        "asset-type-stock": "osake tai vastaava",
        "asset-type-short": "lyhyeksi myyty positio",
        "Do you want to import also currency deposits here?": "Haluatko tuoda my\xF6s valuuttojen talletukset t\xE4nne?",
        "Do you want to import also currency withdrawals here?": "Haluatko tuoda my\xF6s valuuttojen nostot t\xE4nne?",
        "import-text-buy": "Osto {takeAmount} {takeAsset}",
        "import-text-correction": "{name}",
        "import-text-deposit": "Talletus {exchange}-palveluun",
        "import-text-distribution": "{name}",
        "import-text-dividend": "Osinko {asset}",
        "import-text-expense": "{name}",
        "import-text-forex": "Valuutanvaihto",
        "import-text-income": "{name}",
        "import-text-investment": "{name}",
        "import-text-sell": "Myynti {giveAmount} {giveAsset}",
        "import-text-short-buy": "Suljettu lyhyeksimyynti {takeAmount} {takeAsset}",
        "import-text-short-sell": "Lyhyeksimyynti {giveAmount} {giveAsset}",
        "import-text-tax": "{name}",
        "import-text-trade": "Vaihto {giveAmount} {giveAsset} {takeAmount} {takeAsset}",
        "import-text-transfer": "{service} siirto",
        "import-text-withdrawal": "Nosto {exchange}-palvelusta",
        "Parsing error in expression `{expr}`: {message}": "Virhe laskukaavassa `{expr}`: {message}",
        "reason-deposit": "talletus",
        "reason-dividend": "maksu",
        "reason-expense": "meno",
        "reason-fee": "kulu",
        "reason-forex": "vaihto",
        "reason-income": "tulo",
        "reason-trade": "vaihdanta",
        "reason-transfer": "siirto",
        "reason-withdrawal": "nosto",
        "Retried successfully": "Uudelleenyritys onnistui",
        "Retry failed": "Uudelleenyritys ei onnistunut",
        "Select one of the following:": "Valitse yksi seuraavista:",
        "Additional information needed": "Tarvitaan lis\xE4tietoja",
        "Based on the following imported lines": "Seuraavien tuotujen rivien perusteella",
        "Do you want to use the same account for all of them?": "Haluatko k\xE4ytt\xE4\xE4 samaa tili\xE4 kaikille samanlaisille?",
        Created: "Luotuja",
        Duplicates: "Aiemmin luotuja",
        Ignored: "V\xE4liinj\xE4tettyj\xE4",
        "Account Changes": "Tilien muutokset",
        "Process Was Successfully Completed!": "Prosessointi saatu p\xE4\xE4t\xF6kseen onnistuneesti!",
        "Do we allow short selling of assets?": "Sallitaanko lyhyeksi myynti?",
        January: "tammikuu",
        February: "helmikuu",
        March: "maaliskuu",
        April: "huhtikuu",
        May: "toukokuu",
        June: "kes\xE4kuu",
        July: "hein\xE4kuu",
        August: "elokuu",
        September: "syyskuu",
        October: "lokakuu",
        November: "marraskuu",
        December: "joulukuu",
        "note-split": "splitti",
        "note-converted": "konvertoitu",
        "The account below has negative balance. If you want to record it to the separate debt account, please select another account below:": "Tilill\xE4 {account} on negatiivinen saldo. Jos haluat kirjata negatiiviset saldot erilliselle velkatilille, valitse tili seuraavasta:",
        "Additional loan taken": "Lainanoton lis\xE4ys",
        "Loan paid back": "Lainan takaisinmaksu",
        "The date {date} falls outside of the period {firstDate} to {lastDate}.": "P\xE4iv\xE4m\xE4\xE4r\xE4 {date} on tilikauden {firstDate} - {lastDate} ulkopuolella.",
        "What do we do with that kind of transactions?": "Mit\xE4 t\xE4m\xE4nkaltaisille tapahtumille tulisi tehd\xE4?",
        "Ignore transaction": "J\xE4tt\xE4\xE4 v\xE4liin",
        "Halt with an error": "Keskeytt\xE4\xE4 tuonti virheeseen",
        "Is transaction fee of type {type} already included in the {reason} total?": "Onko {reason}-tapahtumassa tyypin {type} kulut lis\xE4tty valmiiksi yhteissummaan?"
      }
    };
  }
  getHandler() {
    return this.handler;
  }
  getRules() {
    const path10 = this.filePath("rules.json");
    (0, import_tasenor_common29.log)(`Reading rules ${path10}.`);
    return JSON.parse(import_fs12.default.readFileSync(path10).toString("utf-8")).rules;
  }
};

// src/plugins/ReportPlugin.ts
init_shim();
var import_fs13 = __toESM(require("fs"));
var import_dayjs3 = __toESM(require("dayjs"));
var import_quarterOfYear = __toESM(require("dayjs/plugin/quarterOfYear"));
import_dayjs3.default.extend(import_quarterOfYear.default);
var ReportPlugin = class extends BackendPlugin {
  constructor(...formats) {
    super();
    this.formats = formats;
  }
  getReportStructure(id) {
    const path10 = this.filePath(`${id}.tsv`);
    if (import_fs13.default.existsSync(path10)) {
      return import_fs13.default.readFileSync(path10).toString("utf-8");
    }
  }
  getReportStructures() {
    const ret = {};
    for (const id of this.formats) {
      ret[id] = this.getReportStructure(id);
    }
    return ret;
  }
  hasReport(id) {
    return this.formats.includes(id);
  }
  getReportOptions(id) {
    return {};
  }
  time2str(timestamp) {
    if (timestamp === null) {
      return null;
    }
    if (timestamp instanceof Date) {
      timestamp = timestamp.toISOString();
    }
    return timestamp.substr(0, 10);
  }
  flags2item(flags) {
    const item = {};
    flags.forEach((flag) => {
      switch (flag) {
        case "NEW_PAGE":
          break;
        case "BREAK":
          item.break = true;
          break;
        case "BOLD":
          item.bold = true;
          break;
        case "ITALIC":
          item.italic = true;
          break;
        case "DETAILS":
          item.accountDetails = true;
          break;
        case "HIDE_TOTAL":
          item.hideTotal = true;
          break;
        case "REQUIRED":
          item.required = true;
          break;
        default:
          throw new Error(`Cannot recoginze report format flag '${flag}'.`);
      }
    });
    return item;
  }
  async getColumns(id, entries, options, settings) {
    if (!options.periods) {
      throw new Error(`Need periods to define columns ${JSON.stringify(options)}`);
    }
    const columns = options.periods.map((period) => {
      return {
        type: "numeric",
        name: "period" + period.id,
        title: this.columnTitle(id, period, options)
      };
    });
    columns.unshift({
      name: "title",
      title: "",
      type: "name"
    });
    return columns;
  }
  columnTitle(id, period, options) {
    throw new Error(`Report plugin ${this.constructor.name} does not implement columnTitle().`);
  }
  forceOptions(options) {
    return {
      negateAssetAndProfit: false,
      addPreviousPeriod: false
    };
  }
  async constructSqlQuery(db, options, settings) {
    let negateSql = "(CASE debit WHEN true THEN 1 ELSE -1 END)";
    if (options.negateAssetAndProfit) {
      negateSql += " * (CASE WHEN account.type IN ('ASSET', 'PROFIT') THEN 1 ELSE -1 END)";
    }
    const periodIds = [options.periodId];
    if (options.addPreviousPeriod) {
      const recentPeriods = await db.select("*").from("period").where("id", "<=", options.periodId).orderBy("end_date", "desc").limit(2);
      if (recentPeriods.length > 1) {
        periodIds.push(recentPeriods[1].id);
      }
      options.periods = recentPeriods;
    }
    let sqlQuery = db.select(
      "document.period_id AS periodId",
      "document.number AS documentId",
      "document.date",
      "account.name",
      "account.type",
      "account.number",
      db.raw(`CAST(ROUND(${negateSql} * entry.amount * 100) AS BIGINT) AS amount`),
      "entry.description"
    ).from("entry").leftJoin("account", "account.id", "entry.account_id").leftJoin("document", "document.id", "entry.document_id").whereIn("document.period_id", periodIds);
    if (options.accountId) {
      sqlQuery = sqlQuery.andWhere("account.id", "=", options.accountId);
    }
    sqlQuery = sqlQuery.orderBy("document.date").orderBy("document.number").orderBy("document.id").orderBy("entry.row_number");
    return sqlQuery;
  }
  async renderReport(db, id, options = {}) {
    Object.assign(options, this.forceOptions(options));
    const settings = (await db("settings").where("name", "like", `${this.code}.%`).orWhere({ name: "companyName" }).orWhere({ name: "companyCode" })).reduce((prev, cur) => ({ ...prev, [cur.name]: cur.value }), {});
    const settingName = `${this.code}.tagTypes`;
    if (options.byTags && settings[settingName]) {
      const tags = await db("tags").select("id", "tag", "name", "type", "order").from("tags").whereIn("type", settings[settingName]).orderBy("order");
      settings.tags = tags;
    } else {
      settings.tags = [];
    }
    options.format = this.getReportStructure(id);
    const q = await this.constructSqlQuery(db, options, settings);
    let entries = await q;
    for (const entry of entries) {
      entry.amount = parseInt(entry.amount);
    }
    entries = this.doFiltering(id, entries, options, settings);
    const columns = await this.getColumns(id, entries, options, settings);
    let data = this.preProcess(id, entries, options, settings, columns);
    data = this.postProcess(id, data, options, settings, columns);
    const report = {
      format: id,
      columns,
      meta: {
        businessName: settings.companyName,
        businessId: settings.companyCode
      },
      data
    };
    if (options.csv) {
      return data2csv(report, options);
    }
    return report;
  }
  doFiltering(id, entries, options, settings) {
    let filter = (entry) => true;
    if (options.quarter1) {
      filter = (entry) => (0, import_dayjs3.default)(entry.date).quarter() <= 1;
    }
    if (options.quarter2) {
      filter = (entry) => (0, import_dayjs3.default)(entry.date).quarter() <= 2;
    }
    if (options.quarter3) {
      filter = (entry) => (0, import_dayjs3.default)(entry.date).quarter() <= 3;
    }
    return entries.filter(filter);
  }
  preProcess(id, entries, options, settings, columns) {
    throw new Error(`Report plugin ${this.constructor.name} does not implement preProcess().`);
  }
  postProcess(id, data, options, settings, columns) {
    return data;
  }
  parseAndCombineReport(accountNumbers, accountNames, columnNames, format, totals) {
    const allAccounts = Array.from(accountNumbers).sort();
    const ret = [];
    format.split("\n").forEach((line) => {
      if (/^#/.test(line)) {
        return;
      }
      let [numbers, text, flags] = line.split("	");
      numbers = numbers.split(" ");
      flags = flags ? new Set(flags.trim().split(/\s+/)) : /* @__PURE__ */ new Set();
      const tab = text ? text.replace(/^(_*).*/, "$1").length : 0;
      text = text ? text.replace(/^_+/, "") : "";
      if (flags.has("NEW_PAGE")) {
        ret.push({ pageBreak: true });
        return;
      }
      if (flags.has("BREAK")) {
        ret.push({ paragraphBreak: true });
        return;
      }
      const amounts = {};
      columnNames.forEach((column) => amounts[column] = null);
      let unused = true;
      const item = { tab, ...this.flags2item(flags) };
      for (let i = 0; i < numbers.length; i++) {
        const parts = numbers[i].split("-");
        const from = parts[0];
        const to = parts[1];
        columnNames.forEach((column) => {
          allAccounts.forEach((number) => {
            if (number >= from && number < to) {
              unused = false;
              if (totals[column][number] !== void 0) {
                amounts[column] += totals[column][number];
              }
            }
          });
        });
      }
      if (!item.accountDetails) {
        if (item.required || !unused) {
          item.name = text;
          item.amounts = amounts;
          ret.push(item);
        }
      }
      if (item.accountDetails) {
        for (let i = 0; i < numbers.length; i++) {
          const parts = numbers[i].split("-");
          const from = parts[0];
          const to = parts[1];
          allAccounts.forEach((number) => {
            if (number >= from && number < to) {
              const item2 = { tab, ...this.flags2item(flags) };
              item2.isAccount = true;
              delete item2.accountDetails;
              item2.name = accountNames[number];
              item2.number = number;
              item2.amounts = {};
              columnNames.forEach((column) => {
                if (!item2.amounts) {
                  item2.amounts = {};
                }
                if (totals[column][number] === void 0) {
                  item2.amounts[column] = null;
                } else {
                  item2.amounts[column] = totals[column][number] + 0;
                }
              });
              ret.push(item2);
            }
          });
        }
      }
    });
    return ret;
  }
};

// src/plugins/SchemePlugin.ts
init_shim();
var SchemePlugin = class extends BackendPlugin {
  constructor(...schemes) {
    super();
    this.schemes = new Set(schemes);
  }
  hasScheme(code) {
    return this.schemes.has(code);
  }
  getSchemePaths(code, languae) {
    throw new Error(`A class ${this.constructor.name} does not implement getScheme().`);
  }
  getSchemeDefaults(code) {
    return {};
  }
  supportedCurrencies() {
    return [];
  }
  supportedLanguages() {
    return [];
  }
};

// src/plugins/ServicePlugin.ts
init_shim();
var import_axios = __toESM(require("axios"));
var import_tasenor_common30 = require("@dataplug/tasenor-common");
var ServicePlugin = class extends BackendPlugin {
  constructor(...services) {
    super();
    this.services = services;
  }
  getServices() {
    return this.services;
  }
  async executeQuery(best, db, service, query) {
    const settings = {};
    for (const setting of await db("settings").select("*").where("name", "like", `${this.code}.%`)) {
      const [, name] = setting.name.split(".");
      settings[name] = setting.value;
    }
    if (this.isAdequate(best)) {
      return;
    }
    let result;
    try {
      result = await this.query(db, settings, service, query);
    } catch (err) {
      (0, import_tasenor_common30.error)(`Exception when handling service ${service} query ${JSON.stringify(query)}: ${err}`);
      result = {
        status: 500,
        message: `Execution of service ${service} query failed on plugin ${this.constructor.name}.`
      };
    }
    this.addResult(best, result);
  }
  async query(db, settings, service, query) {
    throw new Error(`A service plugin ${this.constructor.name} does not implement query().`);
  }
  addResult(old, latest) {
    if (latest.status >= 200 && latest.status < 300 || old.status === 404 && old.message === "No handlers found.") {
      delete old.message;
      Object.assign(old, latest);
    }
  }
  isAdequate(solution) {
    return solution.status >= 200 && solution.status < 300;
  }
  async request(service, method, url, params, headers = {}) {
    if (method !== "GET") {
      throw new Error("Only GET method currently supported in plugin requests.");
    }
    (0, import_tasenor_common30.note)(`Service ${service} request ${method} ${url}`);
    return new Promise((resolve, reject) => {
      import_axios.default.request({ method, url, params, headers }).then((response) => {
        (0, import_tasenor_common30.log)(`Request ${method} ${url}: HTTP ${response.status}`);
        resolve({
          status: response.status,
          data: response.data
        });
      }).catch((err) => {
        const status = err.response ? err.response.status : 500;
        const message = err.response && err.response.data && err.response.data.message ? err.response.data.message : `${err}`;
        (0, import_tasenor_common30.error)(`Request ${method} ${url} failed: HTTP ${status} ${message}`);
        resolve({
          status,
          message
        });
      });
    });
  }
  cacheHeadersKey(service, header) {
    return {};
  }
  cacheParamsKey(service, params) {
    return params;
  }
  async cachedRequest(db, service, method, url, params, headers = {}, options = {}) {
    const keyParams = this.cacheParamsKey(service, params);
    const keyHeaders = this.cacheHeadersKey(service, headers);
    const cached = db ? await db("cached_requests").select("status", "result").where({ method, url, query: keyParams, headers: keyHeaders }).first() : null;
    if (cached) {
      if (cached.status >= 200 && cached.status < 300) {
        (0, import_tasenor_common30.log)(`Using cached service ${service} result for ${method} ${url}`);
        return cached.result;
      }
    }
    if (options.rateLimitDelay) {
      await (0, import_tasenor_common30.waitPromise)(options.rateLimitDelay);
    }
    const result = await this.request(service, method, url, params, headers);
    if (db) {
      await db("cached_requests").insert({ method, url, query: keyParams, headers: keyHeaders, status: result.status || null, result });
    }
    return result;
  }
};

// src/plugins/ToolPlugin.ts
init_shim();
var ToolPlugin = class extends BackendPlugin {
  async GET(query) {
    return void 0;
  }
  async DELETE(query) {
    return void 0;
  }
  async POST(data) {
    return void 0;
  }
  async PUT(data) {
    return void 0;
  }
  async PATCH(data) {
    return void 0;
  }
};

// src/plugins/plugins.ts
init_shim();
var import_fs14 = __toESM(require("fs"));
var import_fast_glob3 = __toESM(require_out4());
var import_path8 = __toESM(require("path"));
var import_tasenor_common31 = require("@dataplug/tasenor-common");
var import_ts_opaque5 = require("ts-opaque");
var PLUGIN_FIELDS = ["code", "title", "version", "icon", "releaseDate", "use", "type", "description"];
var config = {
  PLUGIN_PATH: void 0
};
function getConfig2(variable) {
  const value = config[variable];
  if (value === void 0) {
    throw new Error(`Configuration variable ${variable} is required but it is not set.`);
  }
  return value;
}
function setConfig(variable, value) {
  if (variable in config) {
    config[variable] = value;
  } else {
    throw new Error(`No such configuration variable as ${variable}.`);
  }
}
function sortPlugins(plugins2) {
  return plugins2.sort((a, b) => a.code < b.code ? -1 : a.code > b.code ? 1 : 0);
}
function samePlugins(listA, listB) {
  if (listA.length !== listB.length) {
    return false;
  }
  listA = sortPlugins(listA);
  listB = sortPlugins(listB);
  for (let i = 0; i < listA.length; i++) {
    if (listA[i].id !== listB[i].id || listA[i].code !== listB[i].code || listA[i].installedVersion !== listB[i].installedVersion || listA[i].path !== listB[i].path) {
      return false;
    }
  }
  return true;
}
function loadPluginIndex() {
  if (import_fs14.default.existsSync(import_path8.default.join(getConfig2("PLUGIN_PATH"), "index.json"))) {
    return JSON.parse(import_fs14.default.readFileSync(import_path8.default.join(getConfig2("PLUGIN_PATH"), "index.json")).toString("utf-8"));
  }
  return [];
}
function savePluginIndex(plugins2) {
  plugins2 = sortPlugins(plugins2);
  import_fs14.default.writeFileSync(import_path8.default.join(getConfig2("PLUGIN_PATH"), "index.json"), JSON.stringify(plugins2, null, 2) + "\n");
}
function updatePluginIndex(plugin, plugins2 = void 0) {
  const old = findPluginFromIndex(plugin.code, plugins2);
  if (!old) {
    throw new Error(`Cannot update non-existing plugin ${plugin.code}.`);
  }
  Object.assign(old, plugin);
  savePluginIndex(plugins2);
  return plugins2;
}
function findPluginFromIndex(code, plugins2 = void 0) {
  const index = plugins2 || loadPluginIndex();
  const plugin = index.find((plugin2) => plugin2.code === code);
  return plugin || null;
}
async function fetchOfficialPluginList() {
  const plugins2 = await import_tasenor_common31.net.GET(`${vault.get("TASENOR_API_URL")}/plugins`);
  if (plugins2.success) {
    return plugins2.data;
  }
  return [];
}
function scanPlugins() {
  const rootPath = import_path8.default.resolve(getConfig2("PLUGIN_PATH"));
  let uiFiles = [];
  let backendFiles = [];
  const dirs = import_fast_glob3.default.sync(import_path8.default.join(rootPath, "**", "package.json"));
  dirs.map((dir) => import_path8.default.dirname(import_fs14.default.realpathSync(dir))).forEach((dir) => {
    uiFiles = uiFiles.concat(
      import_fast_glob3.default.sync(import_path8.default.join(dir, "**", "ui", "index.tsx")).map(
        (p) => p.substring(0, p.length - "ui/index.tsx".length)
      )
    );
    backendFiles = backendFiles.concat(
      import_fast_glob3.default.sync(import_path8.default.join(dir, "**", "backend", "index.ts")).map(
        (p) => p.substring(0, p.length - "backend/index.ts".length)
      )
    );
  });
  const pluginSet = new Set(uiFiles.concat(backendFiles));
  return [...pluginSet].map(scanPlugin);
}
function scanPlugin(pluginPath) {
  const uiPath = import_path8.default.join(pluginPath, "ui", "index.tsx");
  const ui = import_fs14.default.existsSync(uiPath) ? readUIPlugin(uiPath) : null;
  const backendPath = import_path8.default.join(pluginPath, "backend", "index.ts");
  const backend = import_fs14.default.existsSync(backendPath) ? readBackendPlugin(backendPath) : null;
  if (ui && backend) {
    for (const field of PLUGIN_FIELDS) {
      if (ui[field] !== backend[field]) {
        throw new Error(`A field '${field}' have contradicting values ${JSON.stringify(ui[field])} and ${JSON.stringify(backend[field])} for index files '${uiPath}' and '${backendPath}'.`);
      }
    }
  }
  if (ui === null && backend === null) {
    throw new Error(`Cannot find any plugins in '${pluginPath}'.`);
  }
  return ui || backend;
}
function readUIPlugin(indexPath) {
  const regex = new RegExp(`^\\s*static\\s+(${PLUGIN_FIELDS.join("|")})\\s*=\\s*(?:'([^']*)'|"([^"]*)")`);
  const data = {
    code: (0, import_ts_opaque5.create)("Unknown"),
    title: "Unknown Development Plugin",
    icon: "HelpOutline",
    path: import_path8.default.dirname(import_path8.default.dirname(indexPath)),
    version: (0, import_ts_opaque5.create)("0"),
    releaseDate: null,
    use: "unknown",
    type: "unknown",
    description: "No description"
  };
  const code = import_fs14.default.readFileSync(indexPath).toString("utf-8").split("\n");
  for (const line of code) {
    const match = regex.exec(line);
    if (match) {
      data[match[1]] = match[2];
    }
  }
  return data;
}
function readBackendPlugin(indexPath) {
  const regex = new RegExp(`^\\s*this\\.(${PLUGIN_FIELDS.join("|")})\\s*=\\s*(?:'([^']*)'|"([^"]*)")`);
  const data = {
    code: (0, import_ts_opaque5.create)("Unknown"),
    title: "Unknown Development Plugin",
    icon: "HelpOutline",
    path: import_path8.default.dirname(import_path8.default.dirname(indexPath)),
    version: (0, import_ts_opaque5.create)("0"),
    releaseDate: null,
    use: "unknown",
    type: "unknown",
    description: "No description"
  };
  const code = import_fs14.default.readFileSync(indexPath).toString("utf-8").split("\n");
  for (const line of code) {
    const match = regex.exec(line);
    if (match) {
      data[match[1]] = match[2];
    }
  }
  return data;
}
function loadPluginState(plugin) {
  const stateFile = plugin.path && import_path8.default.join(plugin.path, ".state");
  if (stateFile && import_fs14.default.existsSync(stateFile)) {
    return JSON.parse(import_fs14.default.readFileSync(stateFile).toString("utf-8"));
  }
  return {
    installed: false
  };
}
function savePluginState(plugin, state) {
  const stateFile = import_path8.default.join(plugin.path, ".state");
  import_fs14.default.writeFileSync(stateFile, JSON.stringify(state, null, 2) + "\n");
}
function isInstalled(plugin) {
  return loadPluginState(plugin).installed;
}
async function updatePluginList() {
  let current = [];
  for (const plugin of await fetchOfficialPluginList()) {
    current[plugin.code] = plugin;
  }
  let localId = -1;
  for (const plugin of await scanPlugins()) {
    if (!current[plugin.code]) {
      current[plugin.code] = plugin;
      current[plugin.code].id = localId--;
    }
    current[plugin.code].path = plugin.path;
    current[plugin.code].version = plugin.version;
    current[plugin.code].availableVersion = plugin.version;
    if (isInstalled(plugin)) {
      current[plugin.code].installedVersion = plugin.version;
    }
  }
  const old = loadPluginIndex();
  current = Object.values(current);
  if (!samePlugins(old, current)) {
    savePluginIndex(current);
  }
  return current;
}
function pluginLocalPath(indexFilePath) {
  const match = /\/[^/]+\/(ui|backend)\/index.tsx?$/.exec(indexFilePath);
  if (match) {
    return match[0].substring(1);
  }
}
var plugins = {
  findPluginFromIndex,
  fetchOfficialPluginList,
  getConfig: getConfig2,
  isInstalled,
  loadPluginIndex,
  loadPluginState,
  pluginLocalPath,
  samePlugins,
  savePluginIndex,
  savePluginState,
  scanPlugins,
  setConfig,
  sortPlugins,
  updatePluginIndex,
  updatePluginList
};

// src/process/index.ts
init_shim();

// src/process/Process.ts
init_shim();
var import_clone6 = __toESM(require_clone());

// src/process/ProcessFile.ts
init_shim();
var import_chardet = __toESM(require("chardet"));
var import_clone5 = __toESM(require_clone());
var ProcessFile = class {
  constructor(obj) {
    this.id = null;
    this.processId = obj.processId || null;
    this.name = obj.name;
    this.type = obj.type;
    this.encoding = obj.encoding;
    this.data = obj.data;
    this._decoded = void 0;
  }
  toString() {
    return `ProcessFile #${this.id} ${this.name}`;
  }
  toJSON() {
    return {
      processId: this.processId,
      name: this.name,
      type: this.type,
      encoding: this.encoding,
      data: this.data
    };
  }
  async save(db) {
    const out = this.toJSON();
    if (this.encoding === "json") {
      out.data = JSON.stringify(out.data);
    }
    if (this.id) {
      await db("process_files").update(out).where({ id: this.id });
      return this.id;
    } else {
      this.id = (await db("process_files").insert(out).returning("id"))[0].id;
      if (this.id)
        return this.id;
      throw new DatabaseError(`Saving process ${JSON.stringify(out)} failed.`);
    }
  }
  firstLineMatch(re) {
    const str = this.decode();
    const n = str.indexOf("\n");
    const line1 = n < 0 ? str : str.substr(0, n).trim();
    return re.test(line1);
  }
  secondLineMatch(re) {
    const lines = this.decode().split("\n");
    return lines.length > 1 && re.test(lines[1].trim());
  }
  thirdLineMatch(re) {
    const lines = this.decode().split("\n");
    return lines.length > 2 && re.test(lines[2].trim());
  }
  isTextFile() {
    return this.type?.startsWith("text/") || false;
  }
  parseEncoding(encoding) {
    switch (encoding.toUpperCase()) {
      case "UTF-8":
        return "utf-8";
      case "ISO-8859-1":
        return "latin1";
      case "UTF-16LE":
        return "utf16le";
      default:
        throw new InvalidFile(`Not able to map text encoding ${encoding}.`);
    }
  }
  decode() {
    if (this._decoded) {
      return this._decoded;
    }
    if (this.encoding === "base64") {
      const buffer = import_buffer.Buffer.from(this.data, "base64");
      const encoding = import_chardet.default.detect(buffer);
      if (!encoding) {
        throw new InvalidFile(`Cannot determine encoding for '${this}'.`);
      }
      this._decoded = buffer.toString(this.parseEncoding(encoding));
      return this._decoded;
    }
    if (this.encoding === "utf-8") {
      this._decoded = (0, import_clone5.default)(this.data);
      return this._decoded || "";
    }
    throw new InvalidFile(`An encoding '${this.encoding}' is not yet supported.`);
  }
};

// src/process/ProcessStep.ts
init_shim();
var import_tasenor_common32 = require("@dataplug/tasenor-common");
var ProcessStep = class {
  constructor(obj) {
    this.processId = obj.processId || null;
    this.number = obj.number;
    this.state = obj.state;
    this.handler = obj.handler;
    this.directions = obj.directions ? new import_tasenor_common32.Directions(obj.directions) : void 0;
    this.action = obj.action;
    this.started = obj.started;
    this.finished = obj.finished;
  }
  toString() {
    return `ProcessStep ${this.number} of Process #${this.processId}`;
  }
  get db() {
    return this.process.db;
  }
  async save() {
    if (this.id) {
      await this.db("process_steps").update(this.toJSON()).where({ id: this.id });
      return this.id;
    } else {
      this.started = new Date();
      this.id = (await this.db("process_steps").insert(this.toJSON()).returning("id"))[0].id;
      if (this.id)
        return this.id;
      throw new DatabaseError(`Saving process ${JSON.stringify(this.toJSON)} failed.`);
    }
  }
  toJSON() {
    return {
      processId: this.processId,
      number: this.number,
      state: this.state,
      directions: this.directions,
      handler: this.handler,
      action: this.action,
      started: this.started,
      finished: this.finished
    };
  }
  async setDirections(db, directions) {
    this.directions = directions;
    await db("process_steps").update({ directions: directions.toJSON() }).where({ id: this.id });
  }
};

// src/process/Process.ts
var import_tasenor_common33 = require("@dataplug/tasenor-common");
var Process = class {
  constructor(system2, name, config2 = {}) {
    this.system = system2;
    this.id = null;
    this.config = config2;
    this.name = name || "[no name]";
    this.complete = false;
    this.successful = void 0;
    this.files = [];
    this.steps = [];
    this.currentStep = void 0;
    this.status = "INCOMPLETE";
  }
  toString() {
    return `Process #${this.id} ${this.name}`;
  }
  toJSON() {
    return {
      name: this.name,
      config: this.config,
      complete: this.complete,
      successful: this.successful,
      currentStep: this.currentStep,
      status: this.status,
      error: this.error
    };
  }
  addFile(file) {
    file.processId = this.id;
    this.files.push(file);
  }
  async addStep(step) {
    step.processId = this.id;
    step.process = this;
    this.steps.push(step);
  }
  async getCurrentStep() {
    if (this.currentStep === null || this.currentStep === void 0) {
      throw new BadState(`Process #${this.id} ${this.name} has invalid current step.`);
    }
    if (this.steps[this.currentStep]) {
      return this.steps[this.currentStep];
    }
    return this.loadStep(this.currentStep);
  }
  async proceedToState(action, state) {
    const current = await this.getCurrentStep();
    const handler = this.system.getHandler(current.handler);
    current.action = action;
    current.finished = new Date();
    current.save();
    const nextStep = new ProcessStep({
      number: current.number + 1,
      state,
      handler: handler.name
    });
    this.addStep(nextStep);
    this.currentStep = (this.currentStep || 0) + 1;
    this.system.logger.info(`Proceeding ${this} to new step ${this.currentStep}.`);
    this.save();
    await nextStep.save();
    await this.system.checkFinishAndFindDirections(handler, nextStep);
  }
  get db() {
    return this.system.db;
  }
  async save() {
    if (this.id) {
      await this.db("processes").update(this.toJSON()).where({ id: this.id });
      return this.id;
    } else {
      this.id = (await this.db("processes").insert(this.toJSON()).returning("id"))[0].id;
      if (this.id)
        return this.id;
      throw new DatabaseError(`Saving process ${JSON.stringify(this.toJSON)} failed.`);
    }
  }
  async load(id) {
    const data = await this.db("processes").select("*").where({ id }).first();
    if (!data) {
      throw new InvalidArgument(`Cannot find process #${id}`);
    }
    Object.assign(this, data);
    this.id = id;
    this.files = (await this.db("process_files").select("*").where({ processId: this.id })).map((fileData) => {
      const file = new ProcessFile(fileData);
      file.id = fileData.id;
      return file;
    });
    await this.getCurrentStep();
  }
  async loadStep(number) {
    if (!this.id) {
      throw new BadState(`Cannot load steps, if the process have no ID ${JSON.stringify(this.toJSON())}.`);
    }
    if (this.currentStep === void 0) {
      throw new BadState(`Cannot load any steps, since process have no current step ${JSON.stringify(this.toJSON())}.`);
    }
    const data = await this.db("process_steps").where({ processId: this.id, number }).first();
    if (!data) {
      throw new BadState(`Cannot find step ${this.currentStep} for process ${JSON.stringify(this.toJSON())}.`);
    }
    this.steps[this.currentStep] = new ProcessStep(data);
    this.steps[this.currentStep].id = data.id;
    this.steps[this.currentStep].process = this;
    return this.steps[this.currentStep];
  }
  canRun() {
    return !this.complete && (this.status === "INCOMPLETE" || this.status === "WAITING");
  }
  async run() {
    let step;
    let MAX_RUNS = 100;
    while (true) {
      MAX_RUNS--;
      if (MAX_RUNS < 0) {
        this.system.logger.error(`Maximum number of executions reached for the process ${this}.`);
        break;
      }
      step = await this.getCurrentStep();
      if (!step.directions) {
        this.system.logger.info(`No new directions for the process ${this}.`);
        break;
      }
      if (!step.directions.isImmediate()) {
        this.system.logger.info(`Waiting for more input for the process ${this}.`);
        await this.updateStatus();
        break;
      }
      const handler = this.system.getHandler(step.handler);
      const state = (0, import_clone6.default)(step.state);
      const action = (0, import_clone6.default)(step.directions.action);
      try {
        if (action) {
          const nextState = await handler.action(this, action, state, this.files);
          await this.proceedToState(action, nextState);
        } else {
          throw new BadState(`Process step ${step} has no action.`);
        }
      } catch (err) {
        return await this.crashed(err);
      }
    }
  }
  async crashed(err) {
    if (isAskUI(err)) {
      const directions = new import_tasenor_common33.Directions({
        type: "ui",
        element: err.element
      });
      const step = await this.getCurrentStep();
      step.directions = directions;
      await step.save();
      await this.updateStatus();
      return;
    }
    this.system.logger.error(`Processing of ${this} failed:`, err);
    if (this.currentStep !== void 0 && this.currentStep !== null) {
      const step = await this.loadStep(this.currentStep);
      step.finished = new Date();
      await step.save();
    }
    this.error = err.stack ? err.stack : `${err.name}: ${err.message}`;
    await this.save();
    await this.updateStatus();
  }
  async updateStatus() {
    let status = "INCOMPLETE";
    if (this.error) {
      status = "CRASHED";
    } else {
      if (this.currentStep === null || this.currentStep === void 0) {
        throw new BadState(`Cannot check status when there is no current step loaded for ${this}`);
      }
      const step = this.steps[this.currentStep];
      if (step.finished) {
        if (this.successful === true)
          status = "SUCCEEDED";
        if (this.successful === false)
          status = "FAILED";
      }
      if (step.directions) {
        status = step.directions.isImmediate() ? "INCOMPLETE" : "WAITING";
      }
    }
    if (this.status !== status) {
      this.system.logger.info(`Process ${this} is now ${status}`);
    }
    this.status = status;
    await this.db("processes").update({ status }).where({ id: this.id });
    let directions, state;
    switch (status) {
      case "SUCCEEDED":
        await this.system.connector.success(this.state);
        break;
      case "CRASHED":
        await this.system.connector.fail(this.error);
        break;
      case "FAILED":
        await this.system.connector.fail(this.state);
        break;
      default:
        directions = this.currentStep ? this.steps[this.currentStep].directions : null;
        state = this.currentStep ? this.steps[this.currentStep].state : null;
        await this.system.connector.waiting(state, directions);
    }
  }
  get state() {
    if (this.currentStep === null || this.currentStep === void 0) {
      throw new BadState(`Cannot check state when there is no current step loaded for ${this}`);
    }
    const step = this.steps[this.currentStep];
    return step.state;
  }
  async input(action) {
    const step = await this.getCurrentStep();
    const handler = this.system.getHandler(step.handler);
    let nextState;
    try {
      nextState = await handler.action(this, action, (0, import_clone6.default)(step.state), this.files);
    } catch (err) {
      return this.crashed(err);
    }
    await this.proceedToState(action, nextState);
  }
  async rollback() {
    if (this.currentStep === null || this.currentStep === void 0) {
      throw new BadState("Cannot roll back when there is no current step.");
    }
    if (this.currentStep < 1) {
      throw new BadState("Cannot roll back when there is only initial step in the process.");
    }
    const step = await this.getCurrentStep();
    this.system.logger.info(`Attempt of rolling back '${step}' from '${this}'.`);
    const handler = this.system.getHandler(step.handler);
    const result = await handler.rollback(step);
    if (result) {
      if (this.error) {
        this.error = void 0;
      }
      await this.db("process_steps").delete().where({ id: step.id });
      this.currentStep--;
      await this.save();
      const newCurrentStep = await this.getCurrentStep();
      newCurrentStep.finished = void 0;
      await newCurrentStep.save();
      await this.updateStatus();
      this.system.logger.info(`Roll back of '${this}' to '${newCurrentStep}' successful.`);
      return true;
    }
    this.system.logger.info(`Not able to roll back '${this}'.`);
    return false;
  }
};

// src/process/ProcessConnector.ts
init_shim();
var defaultConnector = {
  async initialize() {
    console.log(new Date(), "Connector initialized.");
  },
  async applyResult() {
    console.log(new Date(), "Result received.");
    return {};
  },
  async success() {
    console.log(new Date(), "Process completed.");
  },
  async waiting() {
  },
  async fail() {
    console.error(new Date(), "Process failed.");
  },
  async getTranslation(text) {
    return text;
  }
};

// src/process/ProcessingSystem.ts
init_shim();
var ProcessingSystem = class {
  constructor(db, connector) {
    this.handlers = {};
    this.db = db;
    this.logger = {
      info: (...msg) => console.log(new Date(), ...msg),
      error: (...msg) => console.error(new Date(), ...msg)
    };
    this.connector = connector;
  }
  async getTranslation(text, language) {
    return this.connector.getTranslation(text, language);
  }
  register(handler) {
    if (!handler) {
      throw new InvalidArgument("A handler was undefined.");
    }
    if (!handler.name) {
      throw new InvalidArgument("A handler without name cannot be registered.");
    }
    if (handler.name in this.handlers) {
      throw new InvalidArgument(`The handler '${handler.name}' is already defined.`);
    }
    if (handler.name.length > 32) {
      throw new InvalidArgument(`The handler name '${handler.name}' is too long.`);
    }
    handler.system = this;
    this.handlers[handler.name] = handler;
  }
  async createProcess(name, files, config2) {
    const process2 = new Process(this, name, config2);
    await process2.save();
    if (files.length < 1) {
      await process2.crashed(new InvalidArgument("No files given to create a process."));
      return process2;
    }
    const file = files[0];
    const processFile = new ProcessFile(file);
    process2.addFile(processFile);
    await processFile.save(this.db);
    let selectedHandler = null;
    for (const handler of Object.values(this.handlers)) {
      try {
        if (handler.canHandle(processFile)) {
          selectedHandler = handler;
          break;
        }
      } catch (err) {
        await process2.crashed(err);
        return process2;
      }
    }
    if (!selectedHandler) {
      await process2.crashed(new InvalidArgument(`No handler found for the file ${file.name} of type ${file.type}.`));
      return process2;
    }
    for (let i = 1; i < files.length; i++) {
      const processFile2 = new ProcessFile(files[i]);
      if (!selectedHandler.canAppend(processFile2)) {
        await process2.crashed(new InvalidArgument(`The file ${files[i].name} of type ${files[i].type} cannot be appended to handler.`));
        return process2;
      }
      process2.addFile(processFile2);
      await processFile2.save(this.db);
    }
    let state;
    try {
      state = selectedHandler.startingState(process2.files);
    } catch (err) {
      await process2.crashed(err);
      return process2;
    }
    const step = new ProcessStep({
      number: 0,
      handler: selectedHandler.name,
      state
    });
    process2.addStep(step);
    await step.save();
    process2.currentStep = 0;
    await process2.save();
    this.logger.info(`Created process ${process2}.`);
    await this.checkFinishAndFindDirections(selectedHandler, step);
    return process2;
  }
  async checkFinishAndFindDirections(handler, step) {
    let result;
    try {
      result = handler.checkCompletion(step.state);
    } catch (err) {
      return step.process.crashed(err);
    }
    if (result === void 0) {
      let directions;
      try {
        directions = await handler.getDirections(step.state, step.process.config);
      } catch (err) {
        return step.process.crashed(err);
      }
      await step.setDirections(this.db, directions);
    } else {
      step.directions = void 0;
      step.action = void 0;
      step.finished = new Date();
      await step.save();
      step.process.complete = true;
      step.process.successful = result;
      await step.process.save();
    }
    await step.process.updateStatus();
  }
  getHandler(name) {
    if (!(name in this.handlers)) {
      throw new InvalidArgument(`There is no handler for '${name}'.`);
    }
    return this.handlers[name];
  }
  async loadProcess(id) {
    const process2 = new Process(this, null);
    await process2.load(id);
    return process2;
  }
};

// src/reports/index.ts
init_shim();

// src/reports/conversions.ts
init_shim();
var import_json2csv = __toESM(require("json2csv"));
var import_sprintf_js7 = require("sprintf-js");
function data2csv(report, options) {
  const csv = [];
  const render = {
    id: (column, entry) => entry.id,
    name: (column, entry) => `${entry.isAccount ? entry.number + " " : ""}${entry.name}`,
    text: (column, entry) => entry[column.name],
    numeric: (column, entry) => entry.amounts && !entry.hideTotal && entry.amounts[column.name] !== "" && !isNaN(entry.amounts[column.name]) && entry.amounts[column.name] !== void 0 ? entry.amounts[column.name] === null ? "\u2014" : (0, import_sprintf_js7.sprintf)("%.2f", entry.amounts[column.name] / 100) : ""
  };
  const { data, columns } = report;
  let line = {};
  if (!options.dropTitle) {
    columns.forEach((column) => line[column.name] = column.title);
    csv.push(line);
  }
  data.forEach((entry) => {
    if (entry.paragraphBreak) {
      return;
    }
    line = {};
    columns.forEach((column) => {
      if (entry.pageBreak || entry.paragraphBreak) {
        line[column.name] = "";
      } else {
        line[column.name] = render[column.type](column, entry);
      }
    });
    csv.push(line);
  });
  const fields = columns.map((c) => c.name);
  return import_json2csv.default.parse(csv, { fields, header: false });
}

// src/server/index.ts
init_shim();

// src/server/router.ts
init_shim();
var import_express2 = __toESM(require("express"));

// src/server/api.ts
init_shim();
function api_default(db) {
  return {
    process: {
      getAll: async () => {
        return db("processes").select("*").orderBy("created", "desc");
      },
      get: async (id) => {
        const data = await db("processes").select("*").where({ id }).first();
        if (data) {
          const steps = await db("process_steps").select("id", "action", "directions", "number", "started", "finished").where({ processId: id }).orderBy("number");
          data.steps = steps || [];
        }
        return data;
      },
      getStep: async (id, number) => {
        const data = await db("process_steps").select("*").where({ processId: id, number }).first();
        return data;
      }
    }
  };
}

// src/server/router.ts
function router(db, configurator) {
  const router2 = import_express2.default.Router();
  const api = api_default(db);
  router2.get(
    "/",
    async (req, res) => {
      return res.send(await api.process.getAll());
    }
  );
  router2.get(
    "/:id",
    async (req, res) => {
      return res.send(await api.process.get(parseInt(req.params.id)));
    }
  );
  router2.post(
    "/",
    async (req, res) => {
      const system2 = configurator(req);
      const { files, config: config2 } = req.body;
      const names = files.map((f) => f.name);
      const process2 = await system2.createProcess(
        `Uploading files ${names.join(", ")}`,
        files,
        { ...res.locals.server.configDefaults, ...config2 }
      );
      if (process2.canRun()) {
        await process2.run();
      }
      return res.send(await api.process.get(process2.id));
    }
  );
  router2.post(
    "/:id",
    async (req, res) => {
      const system2 = configurator(req);
      const { id } = req.params;
      const process2 = await system2.loadProcess(parseInt(id));
      await process2.input(req.body);
      if (process2.canRun()) {
        await process2.run();
      }
      res.sendStatus(204);
    }
  );
  router2.get(
    "/:id/step/:number",
    async (req, res) => {
      return res.send(await api.process.getStep(parseInt(req.params.id), parseInt(req.params.number)));
    }
  );
  return router2;
}

// src/server/ISPDemoServer.ts
init_shim();
var import_path9 = __toESM(require("path"));
var import_express3 = __toESM(require("express"));
var import_fs15 = __toESM(require("fs"));
var import_knex4 = __toESM(require("knex"));
var import_cors2 = __toESM(require("cors"));
var ISPDemoServer = class {
  constructor(port, databaseUrl, handlers, connector = null, configDefaults = {}) {
    this.app = (0, import_express3.default)();
    this.start = async (reset = false) => {
      if (reset) {
        await this.db.migrate.rollback();
      }
      await this.db.migrate.latest();
      const systemCreator = () => {
        const system2 = new ProcessingSystem(this.db, this.connector);
        this.handlers.forEach((handler) => system2.register(handler));
        return system2;
      };
      this.app.use((req, res, next) => {
        res.locals.server = this;
        next();
      });
      this.app.use((req, res, next) => {
        console.log(new Date(), req.method, req.url);
        next();
      });
      this.app.use((0, import_cors2.default)());
      this.app.use(import_express3.default.json({ limit: "1024MB" }));
      this.app.use("/api/isp", router(this.db, systemCreator));
      this.server = this.app.listen(this.port, () => {
        console.log(new Date(), `Server started on port ${this.port}.`);
        this.connector.initialize(this);
      });
      this.server.on("error", (msg) => {
        console.error(new Date(), msg);
      });
    };
    this.stop = async (err = void 0) => {
      console.log(new Date(), "Stopping the server.");
      await this.server.close(() => {
        if (err) {
          throw err;
        } else {
          import_process.default.exit();
        }
      });
    };
    this.port = port;
    this.configDefaults = configDefaults;
    let migrationsPath = import_path9.default.normalize(import_path9.default.join(__dirname, "/migrations/01_init.js"));
    if (!import_fs15.default.existsSync(migrationsPath)) {
      migrationsPath = import_path9.default.normalize(import_path9.default.join(__dirname, "../../dist/migrations/01_init.js"));
    }
    if (!import_fs15.default.existsSync(migrationsPath)) {
      migrationsPath = import_path9.default.normalize(import_path9.default.join(__dirname, "../../../dist/migrations/01_init.js"));
    }
    if (!import_fs15.default.existsSync(migrationsPath)) {
      console.log(__dirname);
      throw new Error(`Cannot find migrations file '${migrationsPath}'.`);
    }
    this.db = (0, import_knex4.default)({
      client: "pg",
      connection: databaseUrl,
      migrations: {
        directory: import_path9.default.dirname(migrationsPath)
      }
    });
    this.handlers = handlers;
    if (connector) {
      this.connector = connector;
    } else {
      this.connector = defaultConnector;
    }
  }
  async lastProcessID() {
    const ids = await this.db("processes").max("id").first();
    return ids ? ids.max : null;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ALLOWED_VAULT_VARIABLES,
  AskUI,
  BackendPlugin,
  BadState,
  BookkeeperImporter,
  CLI,
  CLIRunner,
  DB,
  DataPlugin,
  DatabaseError,
  EnvironmentVault,
  Exporter,
  GitRepo,
  ISPDemoServer,
  ImportPlugin,
  InvalidArgument,
  InvalidFile,
  NotFound,
  NotImplemented,
  Password,
  Process,
  ProcessFile,
  ProcessHandler,
  ProcessStep,
  ProcessingError,
  ProcessingSystem,
  ReportPlugin,
  SchemePlugin,
  ServicePlugin,
  SystemError,
  TasenorExporter,
  TextFileProcessHandler,
  TilitinExporter,
  ToolPlugin,
  TransactionImportHandler,
  TransactionRules,
  TransactionUI,
  TransferAnalyzer,
  Vault,
  cleanUrl,
  cli,
  createUuid,
  data2csv,
  defaultConnector,
  getVault,
  isAskUI,
  isDevelopment,
  isProduction,
  isTransactionImportConnector,
  nodeEnv,
  plugins,
  randomString,
  router,
  system,
  systemPiped,
  tasenorFinalStack,
  tasenorInitialStack,
  tasenorStack,
  tokens,
  vault
});
/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Licensed under the MIT License.
 */
/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */
/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */
/*!
 * to-regex-range <https://github.com/micromatch/to-regex-range>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */
/*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
/*! run-parallel. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
