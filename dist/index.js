"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var dotenv = _interopRequireWildcard(require("dotenv"));
var _express = _interopRequireDefault(require("express"));
var _axios = _interopRequireWildcard(require("axios"));
var _qs = _interopRequireDefault(require("qs"));
var _nanocurrencyWeb = require("nanocurrency-web");
var _redis = require("redis");
var _uuid = require("uuid");
var _ws = _interopRequireWildcard(require("ws"));
var _app = require("firebase-admin/app");
var _messaging = require("firebase-admin/messaging");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
dotenv.config();
// import { credential } from "firebase-admin";
var admin = require("firebase-admin");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var serviceAccountKey = require("../keys/serviceAccountKey.json");
var firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "nautilus-a7345.firebaseapp.com",
  projectId: "nautilus-a7345",
  storageBucket: "nautilus-a7345.appspot.com",
  messagingSenderId: "871480363204",
  appId: "1:871480363204:web:ba46845c2981a6aa492191",
  measurementId: "G-8R7ZQR7D8F",
  credential: admin.credential.cert(serviceAccountKey)
};

// Initialize Firebase
var firebaseApp = (0, _app.initializeApp)(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
// Initialize Firebase Cloud Messaging and get a reference to the service
var messaging = (0, _messaging.getMessaging)(firebaseApp);
var app = (0, _express["default"])();
app.use(_express["default"].json());
var port = process.env.PORT || 6001;
app.listen(port, function () {
  return console.log("listening on port ".concat(port));
});
var HCAPTCHA_SECRET_KEY = process.env.HCAPTCHA_SECRET_KEY;
var REDIS_USERNAME = process.env.REDIS_USERNAME;
var REDIS_PASSWORD = process.env.REDIS_PASSWORD;
var REDIS_HOST = process.env.REDIS_HOST;
var REDIS_PORT = process.env.REDIS_PORT;
var redisClient = (0, _redis.createClient)({
  url: "rediss://".concat(REDIS_USERNAME, ":").concat(REDIS_PASSWORD, "@").concat(REDIS_HOST, ":").concat(REDIS_PORT)
});
redisClient.on("error", function (err) {
  return console.log("Redis Client Error", err);
});
redisClient.connect();
// database 2 is the prod database:
redisClient.select(2, function (err, res) {
  // you'll want to check that the select was successful here
  // if(err) return err;
  if (err) console.error(err);
  console.log("Redis DB 2 selected");
  // db.set('key', 'string'); // this will be posted to database 1 rather than db 0
});

var fcm_api_key = process.env.FCM_API_KEY;
var MONTH_IN_SECONDS = 2592000;
var nonce_timeout_seconds = 100;
var nonce_separator = '^';

// listen to nano node via websockets:

var testing = false;
var HTTP_URL = "http://node.perish.co:9076";
var WS_URL = "ws://node.perish.co:9078";
// const WORK_URL = "http://workers.perish.co:5555";
var WORK_URL = "https://pow.nano.to";
var REPRESENTATIVE = "nano_38713x95zyjsqzx6nm1dsom1jmm668owkeb9913ax6nfgj15az3nu8xkx579";
function rpc_call(_x) {
  return _rpc_call.apply(this, arguments);
}
function _rpc_call() {
  _rpc_call = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(data) {
    var res;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _axios["default"].post(HTTP_URL, data);
          case 2:
            res = _context6.sent;
            return _context6.abrupt("return", res.data);
          case 4:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _rpc_call.apply(this, arguments);
}
function get_work(_x2) {
  return _get_work.apply(this, arguments);
}
function _get_work() {
  _get_work = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(hash) {
    var _res$data;
    var res;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return _axios["default"].post(WORK_URL, {
              hash: hash
            }, {
              headers: {
                'Accept-Encoding': 'application/json'
              }
            });
          case 2:
            res = _context7.sent;
            return _context7.abrupt("return", (_res$data = res.data) === null || _res$data === void 0 ? void 0 : _res$data.work);
          case 4:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _get_work.apply(this, arguments);
}
function confirmation_handler(_x3) {
  return _confirmation_handler.apply(this, arguments);
}
function _confirmation_handler() {
  _confirmation_handler = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(message) {
    var _message$block, _message$block2;
    var send_amount, from_account, account, fcm_tokens_v2, shorthand_account, notification_title, notification_body;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            send_amount = BigInt(message === null || message === void 0 ? void 0 : message.amount);
            from_account = message === null || message === void 0 ? void 0 : (_message$block = message.block) === null || _message$block === void 0 ? void 0 : _message$block.account;
            account = message === null || message === void 0 ? void 0 : (_message$block2 = message.block) === null || _message$block2 === void 0 ? void 0 : _message$block2.link_as_account;
            _context8.next = 5;
            return get_fcm_tokens(account);
          case 5:
            fcm_tokens_v2 = _context8.sent;
            if (!(fcm_tokens_v2 == null || fcm_tokens_v2.length == 0)) {
              _context8.next = 8;
              break;
            }
            return _context8.abrupt("return");
          case 8:
            _context8.next = 10;
            return get_shorthand_account(from_account);
          case 10:
            shorthand_account = _context8.sent;
            // if int(send_amount) >= int(min_raw_receive):
            notification_title = "Received ".concat(raw_to_nano(send_amount), " NANO from ").concat(shorthand_account);
            notification_body = "Open Nautilus to view this transaction.";
            _context8.next = 15;
            return send_notification(fcm_tokens_v2, {
              "title": notification_title,
              "body": notification_body
              // "sound": "default",
              // "tag": account
            }, {
              "click_action": "FLUTTER_NOTIFICATION_CLICK",
              "account": "".concat(account)
            });
          case 15:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _confirmation_handler.apply(this, arguments);
}
var funding_addresses = ["nano_38713x95zyjsqzx6nm1dsom1jmm668owkeb9913ax6nfgj15az3nu8xkx579", "nano_3xnr31q9p8pce5j4qjwnhmfwkry1mgs67x63149zp6kdbcztfmfqjxwb9bw7", "nano_1u844awm5ch3ktwwzpzjfchj54ay5o6a7kyop5jycue7bw5jr117m15tx8oa", "nano_1f5z6gy3mf6gyyen79sidopxizcp59u6iahcmhtatti3qeh7q7m9w5s548nc", "nano_14qojirkhwgekfpf1jbqfd58ks7t6rrjtzuaetytkxmmuhdgx5cmjhgr5wu5", "nano_3mt48meumbxzw3nsnpq43nzrrnx8rb6sjrxtwqdix564htc73hhra4gbuipo", "nano_3uzdra7hdf9qb19a3g61jrsyt8zkthexrtyx186oc8auyegpir8ezm6y9sra", "nano_3wneupytd8wxgjrydiq4axoipr9wbpkdycd83bfibemjgmreere1tgnn7ajh", "nano_13ddtgi44o3on9j1d6ughjakoe3s9m515q8fasissky7snsomf93cywsiq68", "nano_1n8syxftoknbadk8k46ou7rstawfmfr8qh1jq1dkuuskrspb9yygkise9drr", "nano_16uomspu1foykg7mumh39i3iosi73fsy74xfsr6rupiw3wzcrea8tnpax67h", "nano_1rw4ybt4hagog4uyhqd7mnaogeu6e4ik4kdswfbh9g3zfiyp1hz968mufyni", "nano_3s9dyxh6qm5uody1ou9g6a6g7qseqer1mgrwwoctwdgs37qt3i57w1dwt7wh"];
function funding_balances() {
  return _funding_balances.apply(this, arguments);
} // get account balances once every 10 minutes:
function _funding_balances() {
  _funding_balances = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
    var _iterator3, _step3, address, response, balance;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _iterator3 = _createForOfIteratorHelper(funding_addresses);
            _context9.prev = 1;
            _iterator3.s();
          case 3:
            if ((_step3 = _iterator3.n()).done) {
              _context9.next = 14;
              break;
            }
            address = _step3.value;
            _context9.next = 7;
            return rpc_call({
              "action": "account_balance",
              "account": address
            });
          case 7:
            response = _context9.sent;
            if (!response) {
              _context9.next = 12;
              break;
            }
            balance = BigInt(response["balance"]) + BigInt(response["receivable"]);
            _context9.next = 12;
            return redisClient.hSet("funding_balances", address, balance.toString());
          case 12:
            _context9.next = 3;
            break;
          case 14:
            _context9.next = 19;
            break;
          case 16:
            _context9.prev = 16;
            _context9.t0 = _context9["catch"](1);
            _iterator3.e(_context9.t0);
          case 19:
            _context9.prev = 19;
            _iterator3.f();
            return _context9.finish(19);
          case 22:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[1, 16, 19, 22]]);
  }));
  return _funding_balances.apply(this, arguments);
}
setInterval(funding_balances, 10 * 60 * 1000);
funding_balances();
new_websocket(WS_URL, function (socket) {
  // onopen
  var params = {
    action: "subscribe",
    topic: "confirmation",
    ack: true
  };
  socket === null || socket === void 0 ? void 0 : socket.send(JSON.stringify(params));
}, function (response) {
  // onmessage
  var data = JSON.parse(response.data);
  if (data.topic != "confirmation") return; // discard ack
  var message = data.message;
  confirmation_handler(message);
});
function get_shorthand_account(_x4) {
  return _get_shorthand_account.apply(this, arguments);
}
function _get_shorthand_account() {
  _get_shorthand_account = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(account) {
    var shorthand_account;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return redisClient.hGet("usernames", "".concat(account));
          case 2:
            shorthand_account = _context10.sent;
            if (!shorthand_account) {
              // set username to abbreviated account name:
              shorthand_account = account.substring(0, 12);
            } else {
              shorthand_account = "@" + shorthand_account;
            }
            return _context10.abrupt("return", shorthand_account);
          case 5:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));
  return _get_shorthand_account.apply(this, arguments);
}
function new_websocket(url, ready_callback, message_callback) {
  var socket = new _ws["default"](url);
  socket.onopen = function () {
    console.log('WebSocket is now open');
    if (ready_callback !== undefined) ready_callback(this);
  };
  socket.onerror = function (e) {
    console.error('WebSocket error');
    console.error(e);
  };
  socket.onmessage = function (response) {
    if (message_callback !== undefined) {
      message_callback(response);
    }
  };
  return socket;
}
function send_notification(_x5, _x6, _x7) {
  return _send_notification.apply(this, arguments);
} // add rest route for /api
function _send_notification() {
  _send_notification = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(fcm_tokens_v2, notification, data) {
    var _iterator4, _step4, t2, message;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            // let fcm_tokens_v2 = await get_fcm_tokens(account);
            // if (fcm_tokens_v2 == null || fcm_tokens_v2.length == 0) {
            //     return {
            //         'error': 'fcm token error',
            //         'details': "no_tokens"
            //     };
            // }
            _iterator4 = _createForOfIteratorHelper(fcm_tokens_v2);
            _context11.prev = 1;
            _iterator4.s();
          case 3:
            if ((_step4 = _iterator4.n()).done) {
              _context11.next = 10;
              break;
            }
            t2 = _step4.value;
            message = {
              token: t2,
              notification: notification,
              data: data
            };
            _context11.next = 8;
            return messaging.send(message).then(function (response) {
              console.log('Successfully sent message:', response);
            })["catch"](function (error) {
              console.error('Error sending message:', error);
            });
          case 8:
            _context11.next = 3;
            break;
          case 10:
            _context11.next = 15;
            break;
          case 12:
            _context11.prev = 12;
            _context11.t0 = _context11["catch"](1);
            _iterator4.e(_context11.t0);
          case 15:
            _context11.prev = 15;
            _iterator4.f();
            return _context11.finish(15);
          case 18:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[1, 12, 15, 18]]);
  }));
  return _send_notification.apply(this, arguments);
}
app.get("/api", function (req, res) {
  // return json response
  res.json({
    message: "Hello World"
  });
});
app.get("/health", function (req, res) {
  // return OK
  res.json({
    message: "OK"
  });
});
app.get("/alerts/:lang", function (req, res) {
  res.json(get_active_alert(req.params.lang));
});
app.get("/funding/:lang", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var activeFunding, i, balanceRaw;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            activeFunding = get_active_funding(req.params.lang);
            i = 0;
          case 2:
            if (!(i < activeFunding.length)) {
              _context.next = 11;
              break;
            }
            if (!("address" in activeFunding[i])) {
              _context.next = 8;
              break;
            }
            _context.next = 6;
            return redisClient.hGet("funding_balances", activeFunding[i]["address"]);
          case 6:
            balanceRaw = _context.sent;
            if (!!balanceRaw) {
              activeFunding[i]["current_amount_raw"] = balanceRaw;
            }
          case 8:
            i++;
            _context.next = 2;
            break;
          case 11:
            res.json(activeFunding);
          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return function (_x8, _x9) {
    return _ref.apply(this, arguments);
  };
}());
var HIGH_PRIORITY = "high";
var LOW_PRIORITY = "low";
var ACTIVE_ALERTS = [{
  "id": 1,
  "active": false,
  "priority": HIGH_PRIORITY,
  // # yyyy, M,  D,  H,  M,  S, MS
  // "timestamp": int((datetime(2022, 5, 23, 0, 0, 0, 0, tzinfo=timezone.utc) - datetime(1970, 1, 1, tzinfo=timezone.utc)).total_seconds() * 1000),
  "timestamp": Date.now(),
  "link": "https://google.com",
  "en": {
    "title": "Network Issues",
    "short_description": "Due to ongoing issues with the Nano network, many transactions are delayed.",
    "long_description": "The Nano network is experiencing issues.\n\nSome transactions may be significantly delayed, up to several days. We will keep our users updated with new information as the Nano team provides it.\n\nYou can read more by tapping \"Read More\" below.\n\nAll issues in regards to transaction delays are due to the Nano network issues, not Nautilus. We are not associated with the Nano Foundation or its developers.\n\nWe appreciate your patience during this time."
  },
  "sv": {
    "title": "NÃ¤tverksproblem",
    "short_description": "PÃ¥ grund av pÃ¥gÃ¥ende problem med Nano-nÃ¤tverket, finns det mÃ¥nga fÃ¶rdrÃ¶jda transaktioner.",
    "long_description": "Nano-nÃ¤tverket upplever problem som beror pÃ¥ en lÃ¥ngvarig och pÃ¥gÃ¥ende period med spamtransaktioner.\n\nNÃ¥gra transaktioner kan drÃ¶ja avsevÃ¤rt, upp till flera dagar. Vi kommer att hÃ¥lla vÃ¥ra anvÃ¤ndare uppdaterade med ny information sÃ¥ snart Nano-teamet fÃ¶rmedlar den.\n\nDu kan lÃ¤sa mer genom att trycka pÃ¥ \"LÃ¤s Mer\" nedan.\n\nAlla problem som rÃ¶r fÃ¶rdrÃ¶jda transaktioner Ã¤r pÃ¥ grund av nÃ¤tverksproblem hos Nano. Vi Ã¤r inte associerade med Nano Foundation eller dess utvecklare och kan dÃ¤rfÃ¶r inte pÃ¥skynda lÃ¥ngsamma transaktioner.\n\nVi uppskattar ditt tÃ¥lamod under denna period."
  },
  "es": {
    "title": "Problemas de red",
    "short_description": "Debido a problemas continuos con la red Nano, muchas transacciones se retrasan.",
    "long_description": "La red Nano estÃ¡ experimentando problemas causados â€‹â€‹por un perÃ­odo prolongado y continuo de transacciones de spam.\n\nAlgunas transacciones pueden retrasarse significativamente, hasta varios dÃ­as. Mantendremos a nuestros usuarios actualizados con nueva informaciÃ³n a medida que el equipo de Nano la proporcione.\n\nPuede leer mÃ¡s apretando \"Leer MÃ¡s\" abajo\n\nTodos los problemas relacionados con las demoras en las transacciones se deben a problemas de la red Nano, no Natrium. No estamos asociados con la Nano Foundation o sus desarrolladores y no podemos hacer nada para acelerar las transacciones lentas.\n\nAgradecemos su paciencia durante este tiempo."
  },
  "tr": {
    "title": "AÄŸ Problemleri",
    "short_description": "Nano aÄŸÄ±nda devam eden spam problemi nedeniyle bir Ã§ok iÅŸlem gecikmekte.",
    "long_description": "Nano aÄŸÄ± bir sÃ¼redir devam eden spam nedeniyle problem yaÅŸÄ±yor.\n\nBazÄ± iÅŸlemleriniz bir kaÃ§ gÃ¼n sÃ¼ren gecikmelere maruz kalabilir. Nano takÄ±mÄ±nÄ±n vereceÄŸi gÃ¼ncel haberleri size ileteceÄŸiz.\n\nAÅŸaÄŸÄ±daki \"DetaylÄ± Bilgi\" butonuna dokunarak daha detaylÄ± bilgi alabilirsiniz.\n\nÄ°ÅŸlem gecikmeleriyle alakalÄ± bu problemler Natrium'dan deÄŸil, Nano aÄŸÄ±nÄ±n kendisinden kaynaklÄ±. Nano Foundation veya geliÅŸtiricileriyle bir baÄŸÄ±mÄ±z olmadÄ±ÄŸÄ± iÃ§in iÅŸlemlerinizi hÄ±zlandÄ±rabilmek iÃ§in ÅŸu noktada yapabileceÄŸimiz bir ÅŸey ne yazÄ±k ki yok.\n\nAnlayÄ±ÅŸÄ±nÄ±z ve sabrÄ±nÄ±z iÃ§in teÅŸekkÃ¼r ederiz."
  },
  "ja": {
    "title": "ãƒãƒƒãƒˆãƒ¯ãƒ¼ã‚¯ã‚¨ãƒ©ãƒ¼",
    "short_description": "Nanoãƒãƒƒãƒˆãƒ¯ãƒ¼ã‚¯ã®ç¶™ç¶šçš„ãªå•é¡Œã«ã‚ˆã‚Šã€å¤šãã®å–å¼•ãŒé…å»¶ã—ã¦ã„ã¾ã™ã€‚",
    "long_description": "Nanoãƒãƒƒãƒˆãƒ¯ãƒ¼ã‚¯ã§ã¯ã€ã‚¹ãƒ‘ãƒ ã®å–å¼•ãŒé•·æœŸé–“ç¶™ç¶šã™ã‚‹ã“ã¨ã«ã‚ˆã£ã¦å•é¡ŒãŒç™ºç”Ÿã—ã¦ã„ã¾ã™ã€‚\n\nä¸€éƒ¨ã®å–å¼•ã¯æœ€å¤§æ•°æ—¥é…ã‚Œã‚‹å ´åˆãŒã‚ã‚Šã¾ã™ã€‚Nanoãƒãƒ¼ãƒ ãŒæä¾›ã™ã‚‹æ–°ã—ã„æƒ…å ±ã§ã€çš†ã•ã‚“ã‚’æœ€æ–°ã®çŠ¶æ…‹ã«ä¿ã¡ã¾ã™ã€‚\n\n è©³ã—ãã¯\"è©³ã—ãã¯\"ãƒœã‚¿ãƒ³ã‚’ã‚¯ãƒªãƒƒã‚¯ã—ã¦ä¸‹ã•ã„ã€‚\n\nå–å¼•ã®é…å»¶ã«é–¢ã™ã‚‹ã™ã¹ã¦ã®å•é¡Œã¯ã€Natriumã§ã¯ãªãã€Nanoãƒãƒƒãƒˆãƒ¯ãƒ¼ã‚¯ã®å•é¡ŒãŒåŽŸå› ã§ã™ã€‚Natriumã¯Nano Foundationã‚„ãã®é–‹ç™ºè€…ã¨ã¯é–¢ä¿‚ãŒãªãã€é…ã„å–å¼•ã‚’ã‚¹ãƒ”ãƒ¼ãƒ‰ã‚¢ãƒƒãƒ—ã™ã‚‹ãŸã‚ã«ä½•ã‚‚ã™ã‚‹ã“ã¨ã¯ã§ãã¾ã›ã‚“ã€‚\n\nã”ç†è§£ãŠé¡˜ã„ã„ãŸã—ã¾ã™ã€‚"
  },
  "de": {
    "title": "Netzwerkprobleme",
    "short_description": "Aufgrund von anhaltenden Problemen mit dem Nano-Netzwerk sind aktuell viele Transaktionen verzÃ¶gert.",
    "long_description": "Das Nano-Netzwerk kÃ¤mpft derzeit mit Problemen, die durch eine lang andauernde Serie von Spam-Transaktionen verursacht wurden.\n\nManche Transaktionen kÃ¶nnen daher stark verzÃ¶gert sein, teilweise um bis zu mehrere Tage. Wir werden unsere Nutzer Ã¼ber wichtige Neuigkeiten informieren, sobald das Nano-Team diese verÃ¶ffentlicht.\n\nErfahre mehr, indem du auf \"Mehr Infos\" klickst.\n\nDie Probleme mit verzÃ¶gerten Transaktionen sind verursacht durch das Nano-Netzwerk, nicht durch Natrium. Wir stehen in keinem Zusammenhang mit der Nano Foundation oder ihren Entwicklern und kÃ¶nnen daher nichts tun, um die Transaktionen zu beschleunigen.\n\nVielen Dank fÃ¼r dein VerstÃ¤ndnis."
  },
  "fr": {
    "title": "ProblÃ¨mes de rÃ©seau",
    "short_description": "En raison des problÃ¨mes en cours avec le rÃ©seau Nano, de nombreuses transactions sont retardÃ©es.",
    "long_description": "Le rÃ©seau Nano connaÃ®t des problÃ¨mes causÃ©s par une pÃ©riode prolongÃ©e et continue de transactions de spam.\n\nCertaines transactions peuvent Ãªtre considÃ©rablement retardÃ©es, jusqu'Ã  plusieurs jours. Nous tiendrons nos utilisateurs Ã  jour avec de nouvelles informations au fur et Ã  mesure que l'Ã©quipe Nano les fournira.\n\nVous pouvez en savoir plus en appuyant sur \"Lire la suite\" ci-dessous.\n\nTous les problÃ¨mes liÃ©s aux retards de transaction sont dus aux problÃ¨mes de rÃ©seau Nano, et non Ã  Natrium. Nous ne sommes pas associÃ©s Ã  la Fondation Nano ou Ã  ses dÃ©veloppeurs et ne pouvons rien faire pour accÃ©lÃ©rer les transactions lentes.\n\nNous apprÃ©cions votre patience pendant cette pÃ©riode."
  },
  "nl": {
    "title": "Netwerkproblemen",
    "short_description": "Door aanhoudende problemen met het Nano-netwerk lopen veel transacties vertraging op.",
    "long_description": "Het Nano-netwerk ondervindt problemen die worden veroorzaakt door een langdurige, aanhoudende periode van spamtransacties.\n\nSommige transacties kunnen aanzienlijk worden vertraagd, tot enkele dagen. We houden onze gebruikers op de hoogte van nieuwe informatie zodra het Nano-team dit communiceert.\n\nJe kan meer lezen door hieronder op \"Meer lezen\" te klikken.\n\nAlle problemen met betrekking tot transactievertragingen zijn te wijten aan problemen met het Nano-netwerk, niet aan Natrium. We zijn niet geassocieerd met de Nano Foundation of hun ontwikkelaars en kunnen niets doen om langzame transacties te versnellen.\n\nWe stellen jouw geduld gedurende deze tijd op prijs."
  },
  "iDD": {
    "title": "Masalah Jaringan",
    "short_description": "Karena masalah yang sedang berlangsung dengan jaringan Nano, banyak transaksi yang tertunda.",
    "long_description": "Jaringan Nano mengalami masalah yang disebabkan oleh periode transaksi spam yang berkepanjangan dan berkelanjutan.\n\nBeberapa transaksi mungkin tertunda secara signifikan, hingga beberapa hari. Kami akan terus memperbarui informasi baru kepada pengguna kami saat tim Nano menyediakannya.\n\nAnda dapat membaca selengkapnya dengan mengetuk \"Baca Selengkapnya\" di bawah.\n\nSemua masalah terkait penundaan transaksi disebabkan oleh masalah jaringan Nano, bukan Natrium. Kami tidak terkait dengan Nano Foundation atau pengembangnya dan tidak dapat melakukan apa pun untuk mempercepat transaksi yang lambat.\n\nKami menghargai kesabaran anda selama ini."
  },
  "ru": {
    "title": "ÐŸÑ€Ð¾Ð±Ð»ÐµÐ¼Ñ‹ Ñ ÑÐµÑ‚ÑŒÑŽ",
    "short_description": "Ð˜Ð·-Ð·Ð° Ñ‚ÐµÐºÑƒÑ‰Ð¸Ñ… Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼ Ñ ÑÐµÑ‚ÑŒÑŽ Nano Ð¼Ð½Ð¾Ð³Ð¸Ðµ Ñ‚Ñ€Ð°Ð½Ð·Ð°ÐºÑ†Ð¸Ð¸ Ð·Ð°Ð´ÐµÑ€Ð¶Ð¸Ð²Ð°ÑŽÑ‚ÑÑ.",
    "long_description": "Ð’ ÑÐµÑ‚Ð¸ Nano Ð²Ð¾Ð·Ð½Ð¸ÐºÐ°ÑŽÑ‚ Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼Ñ‹, Ð²Ñ‹Ð·Ð²Ð°Ð½Ð½Ñ‹Ðµ Ð¿Ñ€Ð¾Ð´Ð¾Ð»Ð¶Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ð¼ Ð¿ÐµÑ€Ð¸Ð¾Ð´Ð¾Ð¼ ÑÐ¿Ð°Ð¼-Ñ‚Ñ€Ð°Ð½Ð·Ð°ÐºÑ†Ð¸Ð¹.\n\nÐÐµÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ñ‚Ñ€Ð°Ð½Ð·Ð°ÐºÑ†Ð¸Ð¸ Ð¼Ð¾Ð³ÑƒÑ‚ Ð±Ñ‹Ñ‚ÑŒ Ð·Ð½Ð°Ñ‡Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ Ð·Ð°Ð´ÐµÑ€Ð¶Ð°Ð½Ñ‹, Ð´Ð¾ Ð½ÐµÑÐºÐ¾Ð»ÑŒÐºÐ¸Ñ… Ð´Ð½ÐµÐ¹. ÐœÑ‹ Ð±ÑƒÐ´ÐµÐ¼ Ð´ÐµÑ€Ð¶Ð°Ñ‚ÑŒ Ð½Ð°ÑˆÐ¸Ñ… Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÐµÐ¹ Ð² ÐºÑƒÑ€ÑÐµ Ð½Ð¾Ð²Ð¾Ð¹ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸, Ð¿Ð¾ÑÐºÐ¾Ð»ÑŒÐºÑƒ ÐºÐ¾Ð¼Ð°Ð½Ð´Ð° Nano  Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÑ‚ ÐµÐ³Ð¾.\n\nÐ’Ñ‹ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ ÑƒÐ·Ð½Ð°Ñ‚ÑŒ Ð±Ð¾Ð»ÑŒÑˆÐµ, Ð½Ð°Ð¶Ð°Ð² \"ÐŸÐ¾Ð´Ñ€Ð¾Ð±Ð½ÐµÐµ\" Ð½Ð¸Ð¶Ðµ.\n\nÐ’ÑÐµ Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼Ñ‹, ÑÐ²ÑÐ·Ð°Ð½Ð½Ñ‹Ðµ Ñ Ð·Ð°Ð´ÐµÑ€Ð¶ÐºÐ°Ð¼Ð¸ Ñ‚Ñ€Ð°Ð½Ð·Ð°ÐºÑ†Ð¸Ð¹, Ð²Ñ‹Ð·Ð²Ð°Ð½Ñ‹ Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼Ð°Ð¼Ð¸ ÑÐµÑ‚Ð¸ Nano, Ð° Ð½Ðµ Natrium. ÐœÑ‹ Ð½Ðµ ÑÐ²ÑÐ·Ð°Ð½Ñ‹ Ñ Nano Foundation ÐµÐ³Ð¾ Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÐ¸ Ð½Ðµ Ð¼Ð¾Ð³ÑƒÑ‚ Ð½Ð¸Ñ‡ÐµÐ³Ð¾ ÑÐ´ÐµÐ»Ð°Ñ‚ÑŒ Ð´Ð»Ñ ÑƒÑÐºÐ¾Ñ€ÐµÐ½Ð¸Ñ Ð¼ÐµÐ´Ð»ÐµÐ½Ð½Ñ‹Ñ…  Ñ‚Ñ€Ð°Ð½Ð·Ð°ÐºÑ†Ð¸Ð¹.\n\nÐœÑ‹ Ð±Ð»Ð°Ð³Ð¾Ð´Ð°Ñ€Ð¸Ð¼ Ð²Ð°Ñ Ð·Ð° Ñ‚ÐµÑ€Ð¿ÐµÐ½Ð¸Ðµ Ð² ÑÑ‚Ð¾ Ð²Ñ€ÐµÐ¼Ñ."
  },
  "da": {
    "title": "NetvÃ¦rksproblemer",
    "short_description": "PÃ¥ grund af igangvÃ¦rende problemer med Nano-netvÃ¦rket er der mange forsinkede transaktioner.",
    "long_description": "Nano-netvÃ¦rket oplever problemer pÃ¥ grund af en lang og lÃ¸bende periode med spamtransaktioner.\n\nNogle transaktioner kan tage lang tid, op til flere dage. Vi holder vores brugere opdateret med nye oplysninger, sÃ¥ snart Nano-teamet giver dem.\n\nDu kan lÃ¦se mere ved at klikke \"LÃ¦s mere\" nedenfor.\n\nAlle problemer med hensyn til transaktionsforsinkelser skyldes problemer med Nano-netvÃ¦rket, ikke Natrium. Vi er ikke tilknyttet Nano Foundation eller dets udviklere og kan ikke gÃ¸re noget for at fremskynde langsomme transaktioner.\n\nVi sÃ¦tter pris pÃ¥ din tÃ¥lmodighed i denne periode."
  }
}, {
  "id": 2,
  "active": false,
  "priority": LOW_PRIORITY,
  // # yyyy, M,  D,  H,  M,  S, MS
  // "timestamp": int((datetime(2022, 6, 24, 0, 0, 0, 0, tzinfo=timezone.utc) - datetime(1970, 1, 1, tzinfo=timezone.utc)).total_seconds() * 1000),
  "timestamp": Date.now(),
  "en": {
    "title": "Planned Maintenance",
    "short_description": "Backend work",
    "long_description": "Backend work is being done, features of the app may stop working for the next few hours"
  }
}, {
  "id": 3,
  "active": false,
  "priority": LOW_PRIORITY,
  // # yyyy, M,  D,  H,  M,  S, MS
  // "timestamp": int((datetime(2022, 7, 3, 0, 0, 0, 0, tzinfo=timezone.utc) - datetime(1970, 1, 1, tzinfo=timezone.utc)).total_seconds() * 1000),
  "timestamp": Date.now(),
  "en": {
    "title": "Server Outage",
    "short_description": "Unknown PoW issue",
    "long_description": "Something is wrong with the PoW server, we are working on a fix"
  }
}, {
  "id": 4,
  "active": false,
  "priority": LOW_PRIORITY,
  "link": "https://www.reddit.com/r/nanocurrency/comments/zy6z1h/upcoming_nautilus_potassius_changes_backup_your/",
  // # yyyy, M,  D,  H,  M,  S, MS
  // "timestamp": int((datetime(2022, 7, 3, 0, 0, 0, 0, tzinfo=timezone.utc) - datetime(1970, 1, 1, tzinfo=timezone.utc)).total_seconds() * 1000),
  "timestamp": Date.now(),
  "en": {
    "title": "Backup your seed",
    "short_description": "Upcoming update will break magic link login credentials",
    "long_description": "In a coming update, existing login credentials will be invalidated, and you will have to make your account again, (if your seed is backed up you can ignore this alert), sorry for the inconvienience, but you can follow the link for more details."
  }
}];
var LOCALES = ["en", "sv", "es", "tr", "ja", "de", "fr", "nl", "iDD", "ru", "da"];
var ACTIVE_FUNDING = [{
  "id": 0,
  "active": true,
  "show_on_ios": false,
  "address": "nano_3xnr31q9p8pce5j4qjwnhmfwkry1mgs67x63149zp6kdbcztfmfqjxwb9bw7",
  "goal_amount_raw": "150000000000000000000000000000000",
  "current_amount_raw": "0",
  "en": {
    "title": "Monthly Server Costs",
    "short_description": "Keep the backend alive!",
    "long_description": "Help fund the backend server and node costs."
  }
}, {
  "id": 1,
  "active": false,
  "show_on_ios": false,
  "address": "nano_1u844awm5ch3ktwwzpzjfchj54ay5o6a7kyop5jycue7bw5jr117m15tx8oa",
  "goal_amount_raw": "500000000000000000000000000000000",
  "current_amount_raw": "0",
  "en": {
    "title": "Hardware Wallet Support",
    "short_description": "Starting with the Ledger Nano S/X"
  }
}, {
  "id": 2,
  "active": false,
  "show_on_ios": false,
  "address": "nano_1f5z6gy3mf6gyyen79sidopxizcp59u6iahcmhtatti3qeh7q7m9w5s548nc",
  "goal_amount_raw": "500000000000000000000000000000000",
  "current_amount_raw": "0",
  "en": {
    "title": "Offline Proof of Work",
    "short_description": "Add support for doing Proof of Work even if the server is offline.",
    "long_description": "This would include a progress bar of some kind on the home screen + a notification to let you know that the PoW is done."
  }
}, {
  "id": 3,
  "active": false,
  "show_on_ios": false,
  "address": "nano_14qojirkhwgekfpf1jbqfd58ks7t6rrjtzuaetytkxmmuhdgx5cmjhgr5wu5",
  "goal_amount_raw": "200000000000000000000000000000000",
  "current_amount_raw": "0",
  "en": {
    "title": "Login with Nautilus",
    "short_description": "Authentication scheme for logging in with Nautilus"
  }
}, {
  "id": 4,
  "active": false,
  "show_on_ios": false,
  "address": "nano_3mt48meumbxzw3nsnpq43nzrrnx8rb6sjrxtwqdix564htc73hhra4gbuipo",
  "goal_amount_raw": "2000000000000000000000000000000000",
  "current_amount_raw": "0",
  "en": {
    "title": "Security Audit",
    "short_description": "Get the code base audited by a security firm"
  }
}, {
  "id": 5,
  "active": false,
  "show_on_ios": false,
  "address": "nano_3uzdra7hdf9qb19a3g61jrsyt8zkthexrtyx186oc8auyegpir8ezm6y9sra ",
  "goal_amount_raw": "5000000000000000000000000000000000",
  "current_amount_raw": "0",
  "en": {
    "title": "Legal Financing",
    "short_description": "(i.e. On/Offramps + Monetary Services)",
    "long_description": "There are features and services I want to create, but just don't have the financial backing to make it happen.\nThis will go towards things like paying a lawyer, (corporation) registration fees, and any other costs involved with making these features possible.\n\nAn example of what this would help achieve: A Nautilus Debit Card that lets you spend your nano as fiat"
  }
}, {
  "id": 6,
  "active": false,
  "show_on_ios": false,
  "address": "nano_3wneupytd8wxgjrydiq4axoipr9wbpkdycd83bfibemjgmreere1tgnn7ajh",
  "goal_amount_raw": "5000000000000000000000000000000000",
  "current_amount_raw": "0",
  "en": {
    "title": "Perishable",
    "short_description": "Decentralized L2 Storage Network using nano",
    "long_description": "Still a WIP Business idea, but feel free to ask about it on the discord"
  }
}, {
  "id": 7,
  "active": false,
  "show_on_ios": false,
  "address": "nano_13ddtgi44o3on9j1d6ughjakoe3s9m515q8fasissky7snsomf93cywsiq68",
  "goal_amount_raw": "1000000000000000000000000000000000",
  "current_amount_raw": "0",
  "en": {
    "title": "Block Handoff Support",
    "short_description": "First Implementation of Block Handoff",
    "long_description": "This will be used to facilitate / replace the current payment requests system, though some details still need to be worked out"
  }
}, {
  "id": 8,
  "active": false,
  "show_on_ios": false,
  "address": "nano_1n8syxftoknbadk8k46ou7rstawfmfr8qh1jq1dkuuskrspb9yygkise9drr",
  "goal_amount_raw": "1000000000000000000000000000000000",
  "current_amount_raw": "0",
  "en": {
    "title": "Obscured Payments",
    "short_description": "Not true privacy but good enough for day to day use",
    "long_description": "Will work by mixing between random sub-addresses"
  }
}, {
  "id": 9,
  "active": true,
  "show_on_ios": false,
  "address": "nano_16uomspu1foykg7mumh39i3iosi73fsy74xfsr6rupiw3wzcrea8tnpax67h",
  "goal_amount_raw": "300000000000000000000000000000000",
  "current_amount_raw": "0",
  "en": {
    "title": "Memo and Request Caching",
    "short_description": "Better deliverability of memos and requests",
    "long_description": "This would cache memos and requests (Encrypted still) on the server until the recipient's device confirms that they've received the message"
  }
}, {
  "id": 10,
  "active": false,
  "show_on_ios": false,
  "address": "nano_1rw4ybt4hagog4uyhqd7mnaogeu6e4ik4kdswfbh9g3zfiyp1hz968mufyni",
  "goal_amount_raw": "500000000000000000000000000000000",
  "current_amount_raw": "0",
  "en": {
    "title": "Artist Fund",
    "short_description": "Help pay for a new logo and other assets",
    "long_description": "This is to help pay for a graphic designer to make a new logo or re-design the current one."
  }
}, {
  "id": 11,
  "active": false,
  "show_on_ios": false,
  "address": "nano_3s9dyxh6qm5uody1ou9g6a6g7qseqer1mgrwwoctwdgs37qt3i57w1dwt7wh",
  "goal_amount_raw": "5000000000000000000000000000000000",
  "current_amount_raw": "0",
  "en": {
    "title": "Desktop / Web Support",
    "short_description": "Just a *minor* rewrite",
    "long_description": "This involves rewriting major sections of the app to use more cross platform libraries, and may not be feasible / easier to just start from scratch."
  }
}];
function gen_for_locales(message) {
  var _final = {};
  for (var loc in LOCALES) {
    _final[loc] = message;
  }
  return _final;
}
function get_active_alert(lang) {
  var ret = [];
  var _iterator = _createForOfIteratorHelper(ACTIVE_ALERTS),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var a = _step.value;
      var active = a["active"];
      if (!active) continue;
      if (lang == 'id' && 'iDD' in a) {
        lang = 'iDD';
      } else if (!(lang in a)) {
        lang = 'en';
      }
      var retItem = {
        "id": a["id"],
        "priority": a["priority"],
        "active": a["active"]
      };
      if ("timestamp" in a) {
        retItem["timestamp"] = a["timestamp"];
      }
      if ("link" in a) {
        retItem["link"] = a["link"];
      }
      // for (let k, v in a[lang].items()) {
      //     retItem[k] = v
      // }

      for (var k in a[lang]) {
        retItem[k] = a[lang][k];
      }
      ret.push(retItem);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return ret;
}
function get_active_funding(lang) {
  var ret = [];
  var _iterator2 = _createForOfIteratorHelper(ACTIVE_FUNDING),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var a = _step2.value;
      var active = a["active"];
      if (!active) continue;
      if (lang == 'id' && 'iDD' in a) {
        lang = 'iDD';
      } else if (!(lang in a)) {
        lang = 'en';
      }
      var retItem = {
        "id": a["id"],
        "active": a["active"]
      };
      if ("timestamp" in a) {
        retItem["timestamp"] = a["timestamp"];
      }
      if ("link" in a) {
        retItem["link"] = a["link"];
      }
      if ("address" in a) {
        retItem["address"] = a["address"];
      }
      if ("goal_amount_raw" in a) {
        retItem["goal_amount_raw"] = a["goal_amount_raw"];
      }
      if ("current_amount_raw" in a) {
        retItem["current_amount_raw"] = a["current_amount_raw"];
      }
      if ("show_on_ios" in a) {
        retItem["show_on_ios"] = a["show_on_ios"];
      }
      for (var k in a[lang]) {
        retItem[k] = a[lang][k];
      }
      ret.push(retItem);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return ret;
}

// payments API:
function validate_signature(_x10, _x11, _x12) {
  return _validate_signature.apply(this, arguments);
}
function _validate_signature() {
  _validate_signature = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(requesting_account, request_signature, request_nonce) {
    var ret;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            // TODO:
            ret = null; // check if the nonce is valid
            // req_account_bin = unhexlify(util.address_decode(requesting_account));
            // nonce_fields = request_nonce.split(nonce_separator)
            // // make sure the nonce is recent:
            // request_epoch_time = int(nonce_fields[0], 16)
            // current_epoch_time = int(time.time())
            // if ((current_epoch_time - request_epoch_time) > nonce_timeout_seconds) {
            //     // nonce is too old
            //     ret = {
            //         'error':'nonce error',
            //         'details': 'nonce is too old'
            //     };
            //     return ret
            // }
            // vk = VerifyingKey(req_account_bin)
            // try {
            //     vk.verify(
            //         sig=unhexlify(request_signature),
            //         msg=unhexlify(request_nonce),
            //     )
            // } catch (e) {
            //     ret = json.dumps({
            //         'error':'sig error',
            //         'details': 'invalid signature'
            //     })
            // }
            return _context12.abrupt("return", ret);
          case 2:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));
  return _validate_signature.apply(this, arguments);
}
function raw_to_nano(amount) {
  var converted = _nanocurrencyWeb.tools.convert(amount, "RAW", "NANO");
  // return "" + parseFloat(Number(converted).toFixed(6));
  var n = converted;
  var r = (+n).toFixed(6).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1');
  return r;
}

// # allow sends with the original uuid if they are valid:
// # TODO:
function check_local_uuid(local_uuid) {
  // new_uuid = str(uuid.uuid4())
  // if local_uuid is None:
  //     return new_uuid
  // # TODO:
  // return new_uuid
  return (0, _uuid.v4)();
}
function push_payment_request(_x13, _x14, _x15, _x16, _x17) {
  return _push_payment_request.apply(this, arguments);
}
function _push_payment_request() {
  _push_payment_request = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(account, amount_raw, requesting_account, memo_enc, local_uuid) {
    var fcm_tokens_v2, shorthand_account, request_uuid, request_time, notification_title, notification_body;
    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            if (!(fcm_api_key == null)) {
              _context13.next = 2;
              break;
            }
            return _context13.abrupt("return", {
              'error': 'fcm token error',
              'details': "no_api_key"
            });
          case 2:
            _context13.next = 4;
            return get_fcm_tokens(account);
          case 4:
            fcm_tokens_v2 = _context13.sent;
            if (!(fcm_tokens_v2 == null || fcm_tokens_v2.length == 0)) {
              _context13.next = 7;
              break;
            }
            return _context13.abrupt("return", {
              'error': 'fcm token error',
              'details': "no_tokens"
            });
          case 7:
            _context13.next = 9;
            return get_shorthand_account(requesting_account);
          case 9:
            shorthand_account = _context13.sent;
            _context13.next = 12;
            return check_local_uuid(local_uuid);
          case 12:
            request_uuid = _context13.sent;
            request_time = parseInt(Date.now() / 1000); // Send notification with generic title, send amount as body. App should have localizations and use this information at its discretion
            notification_title = "Request for ".concat(raw_to_nano(amount_raw), " NANO from ").concat(shorthand_account);
            notification_body = "Open Nautilus to pay this request.";
            _context13.next = 18;
            return send_notification(fcm_tokens_v2, {
              "title": notification_title,
              "body": notification_body
            }, {
              "click_action": "FLUTTER_NOTIFICATION_CLICK",
              "account": "".concat(account),
              "payment_request": "true",
              "uuid": "".concat(request_uuid),
              "local_uuid": "".concat(local_uuid),
              "memo_enc": "".concat(memo_enc),
              "amount_raw": "".concat(amount_raw),
              "requesting_account": "".concat(requesting_account),
              "requesting_account_shorthand": "".concat(shorthand_account),
              "request_time": "".concat(request_time)
            });
          case 18:
            _context13.next = 20;
            return get_fcm_tokens(requesting_account);
          case 20:
            fcm_tokens_v2 = _context13.sent;
            if (!(fcm_tokens_v2 == null || fcm_tokens_v2.length == 0)) {
              _context13.next = 23;
              break;
            }
            return _context13.abrupt("return", {
              'error': 'fcm token error',
              'details': "no_tokens"
            });
          case 23:
            _context13.next = 25;
            return send_notification(fcm_tokens_v2, {}, {
              "account": "".concat(account),
              "payment_record": "true",
              "is_request": "true",
              "memo_enc": "".concat(memo_enc),
              "uuid": "".concat(request_uuid),
              "local_uuid": "".concat(local_uuid),
              "amount_raw": "".concat(amount_raw),
              "requesting_account": requesting_account,
              "requesting_account_shorthand": shorthand_account,
              "request_time": "".concat(request_time)
            });
          case 25:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));
  return _push_payment_request.apply(this, arguments);
}
function push_payment_ack(_x18, _x19, _x20) {
  return _push_payment_ack.apply(this, arguments);
}
function _push_payment_ack() {
  _push_payment_ack = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(request_uuid, account, requesting_account) {
    var fcm_tokens_v2, _iterator5, _step5, token, message;
    return _regeneratorRuntime().wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return get_fcm_tokens(account);
          case 2:
            fcm_tokens_v2 = _context14.sent;
            if (!(fcm_tokens_v2 == null || fcm_tokens_v2.length == 0)) {
              _context14.next = 5;
              break;
            }
            return _context14.abrupt("return", {
              'error': 'fcm token error',
              'details': "no_tokens"
            });
          case 5:
            // # Send notification
            _iterator5 = _createForOfIteratorHelper(fcm_tokens_v2);
            _context14.prev = 6;
            _iterator5.s();
          case 8:
            if ((_step5 = _iterator5.n()).done) {
              _context14.next = 16;
              break;
            }
            token = _step5.value;
            message = {
              token: token,
              data: {
                "account": account,
                "payment_ack": "true",
                "uuid": request_uuid,
                "requesting_account": requesting_account
              }
            };
            _context14.next = 13;
            return messaging.send(message).then(function (response) {
              console.log('Successfully sent message:', response);
            })["catch"](function (error) {
              console.error('Error sending message:', error);
            });
          case 13:
            return _context14.abrupt("return", null);
          case 14:
            _context14.next = 8;
            break;
          case 16:
            _context14.next = 21;
            break;
          case 18:
            _context14.prev = 18;
            _context14.t0 = _context14["catch"](6);
            _iterator5.e(_context14.t0);
          case 21:
            _context14.prev = 21;
            _iterator5.f();
            return _context14.finish(21);
          case 24:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[6, 18, 21, 24]]);
  }));
  return _push_payment_ack.apply(this, arguments);
}
function push_payment_memo(_x21, _x22, _x23, _x24, _x25) {
  return _push_payment_memo.apply(this, arguments);
}
function _push_payment_memo() {
  _push_payment_memo = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(account, requesting_account, memo_enc, block, local_uuid) {
    var fcm_tokens_v2, request_uuid, request_time;
    return _regeneratorRuntime().wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return get_fcm_tokens(account);
          case 2:
            fcm_tokens_v2 = _context15.sent;
            if (!(fcm_tokens_v2 == null || fcm_tokens_v2.length == 0)) {
              _context15.next = 5;
              break;
            }
            return _context15.abrupt("return", {
              'error': 'fcm token error',
              'details': "no_tokens"
            });
          case 5:
            _context15.next = 7;
            return check_local_uuid(local_uuid);
          case 7:
            request_uuid = _context15.sent;
            request_time = parseInt(Date.now() / 1000); // # send memo to the recipient
            _context15.next = 11;
            return send_notification(fcm_tokens_v2, {}, {
              // # "click_action": "FLUTTER_NOTIFICATION_CLICK",
              "account": account,
              "requesting_account": requesting_account,
              "payment_memo": "true",
              "memo_enc": "".concat(memo_enc),
              "block": "".concat(block),
              "uuid": request_uuid,
              "local_uuid": local_uuid,
              "request_time": "".concat(request_time)
            });
          case 11:
            _context15.next = 13;
            return get_fcm_tokens(requesting_account);
          case 13:
            fcm_tokens_v2 = _context15.sent;
            if (!(fcm_tokens_v2 == null || fcm_tokens_v2.length == 0)) {
              _context15.next = 16;
              break;
            }
            return _context15.abrupt("return", "no_tokens");
          case 16:
            _context15.next = 18;
            return send_notification(fcm_tokens_v2, {}, {
              // # "click_action": "FLUTTER_NOTIFICATION_CLICK",
              "account": "".concat(account),
              "requesting_account": "".concat(requesting_account),
              "payment_record": "true",
              "is_memo": "true",
              "memo_enc": "".concat(memo_enc),
              "uuid": "".concat(request_uuid),
              "local_uuid": "".concat(local_uuid),
              "block": "".concat(block),
              // # "amount_raw": str(send_amount),
              // # "requesting_account": requesting_account,
              // # "requesting_account_shorthand": shorthand_account,
              "request_time": "".concat(request_time)
            });
          case 18:
            return _context15.abrupt("return", null);
          case 19:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));
  return _push_payment_memo.apply(this, arguments);
}
function push_payment_message(_x26, _x27, _x28, _x29) {
  return _push_payment_message.apply(this, arguments);
}
function _push_payment_message() {
  _push_payment_message = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16(account, requesting_account, memo_enc, local_uuid) {
    var fcm_tokens_v2, request_uuid, request_time, shorthand_account, notification_title, notification_body, _iterator6, _step6, token, message, _iterator7, _step7, _token, _message;
    return _regeneratorRuntime().wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return get_fcm_tokens(account);
          case 2:
            fcm_tokens_v2 = _context16.sent;
            if (!(fcm_tokens_v2 == null || fcm_tokens_v2.length == 0)) {
              _context16.next = 5;
              break;
            }
            return _context16.abrupt("return", {
              'error': 'fcm token error',
              'details': "no_tokens"
            });
          case 5:
            _context16.next = 7;
            return check_local_uuid(local_uuid);
          case 7:
            request_uuid = _context16.sent;
            request_time = parseInt(Date.now() / 1000); // get username if it exists:
            _context16.next = 11;
            return get_shorthand_account(requesting_account);
          case 11:
            shorthand_account = _context16.sent;
            // Send notification with generic title, send amount as body. App should have localizations and use this information at its discretion
            notification_title = "Message from ".concat(shorthand_account);
            notification_body = "Open Nautilus to view.";
            _iterator6 = _createForOfIteratorHelper(fcm_tokens_v2);
            _context16.prev = 15;
            _iterator6.s();
          case 17:
            if ((_step6 = _iterator6.n()).done) {
              _context16.next = 24;
              break;
            }
            token = _step6.value;
            message = {
              token: token,
              notification: {
                "title": notification_title,
                "body": notification_body
                // "sound":"default",
                // "tag": account
              },

              data: {
                "click_action": "FLUTTER_NOTIFICATION_CLICK",
                "account": "".concat(account),
                "payment_message": "true",
                "uuid": "".concat(request_uuid),
                "local_uuid": "".concat(local_uuid),
                "memo_enc": "".concat(memo_enc),
                "requesting_account": "".concat(requesting_account),
                "requesting_account_shorthand": "".concat(shorthand_account),
                "request_time": "".concat(request_time)
              }
            };
            _context16.next = 22;
            return messaging.send(message).then(function (response) {
              console.log('Successfully sent message:', response);
            })["catch"](function (error) {
              console.error('Error sending message:', error);
            });
          case 22:
            _context16.next = 17;
            break;
          case 24:
            _context16.next = 29;
            break;
          case 26:
            _context16.prev = 26;
            _context16.t0 = _context16["catch"](15);
            _iterator6.e(_context16.t0);
          case 29:
            _context16.prev = 29;
            _iterator6.f();
            return _context16.finish(29);
          case 32:
            _context16.next = 34;
            return get_fcm_tokens(requesting_account);
          case 34:
            fcm_tokens_v2 = _context16.sent;
            if (!(fcm_tokens_v2 == null || fcm_tokens_v2.length == 0)) {
              _context16.next = 37;
              break;
            }
            return _context16.abrupt("return", "no_tokens");
          case 37:
            _iterator7 = _createForOfIteratorHelper(fcm_tokens_v2);
            _context16.prev = 38;
            _iterator7.s();
          case 40:
            if ((_step7 = _iterator7.n()).done) {
              _context16.next = 47;
              break;
            }
            _token = _step7.value;
            _message = {
              token: _token,
              data: {
                // # "click_action": "FLUTTER_NOTIFICATION_CLICK",
                "account": account,
                "payment_record": "true",
                "is_message": "true",
                "memo_enc": "".concat(memo_enc),
                "uuid": request_uuid,
                "local_uuid": local_uuid,
                "requesting_account": requesting_account,
                "requesting_account_shorthand": shorthand_account,
                "request_time": "".concat(request_time)
              }
            };
            _context16.next = 45;
            return messaging.send(_message).then(function (response) {
              console.log('Successfully sent message:', response);
            })["catch"](function (error) {
              console.error('Error sending message:', error);
            });
          case 45:
            _context16.next = 40;
            break;
          case 47:
            _context16.next = 52;
            break;
          case 49:
            _context16.prev = 49;
            _context16.t1 = _context16["catch"](38);
            _iterator7.e(_context16.t1);
          case 52:
            _context16.prev = 52;
            _iterator7.f();
            return _context16.finish(52);
          case 55:
            return _context16.abrupt("return", null);
          case 56:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[15, 26, 29, 32], [38, 49, 52, 55]]);
  }));
  return _push_payment_message.apply(this, arguments);
}
app.post("/payments", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var request_json, ret;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // get request json:
            request_json = req.body || {};
            _context2.t0 = request_json["action"];
            _context2.next = _context2.t0 === "payment_request" ? 4 : _context2.t0 === "payment_ack" ? 16 : _context2.t0 === "payment_memo" ? 23 : _context2.t0 === "payment_message" ? 35 : 47;
            break;
          case 4:
            _context2.next = 6;
            return validate_signature(request_json.requesting_account, request_json.request_signature, request_json.request_nonce);
          case 6:
            ret = _context2.sent;
            if (!(ret != null)) {
              _context2.next = 9;
              break;
            }
            return _context2.abrupt("break", 49);
          case 9:
            _context2.next = 11;
            return push_payment_request(request_json.account, request_json.amount_raw, request_json.requesting_account, request_json.memo_enc, request_json.local_uuid);
          case 11:
            ret = _context2.sent;
            if (!(ret != null)) {
              _context2.next = 14;
              break;
            }
            return _context2.abrupt("break", 49);
          case 14:
            ret = {
              'success': 'payment request sent'
            };
            return _context2.abrupt("break", 49);
          case 16:
            _context2.next = 18;
            return push_payment_ack(request_json.uuid, request_json.account, request_json.requesting_account);
          case 18:
            ret = _context2.sent;
            if (!(ret != null)) {
              _context2.next = 21;
              break;
            }
            return _context2.abrupt("break", 49);
          case 21:
            // send again to the sender:
            // ret = await push_payment_ack(r, request_json["uuid"], request_json["requesting_account"], request_json["requesting_account"])
            // if (ret != null) break;
            ret = {
              "success": "payment_ack sent"
            };
            return _context2.abrupt("break", 49);
          case 23:
            _context2.next = 25;
            return validate_signature(request_json.requesting_account, request_json.request_signature, request_json.request_nonce);
          case 25:
            ret = _context2.sent;
            if (!(ret != null)) {
              _context2.next = 28;
              break;
            }
            return _context2.abrupt("break", 49);
          case 28:
            _context2.next = 30;
            return push_payment_memo(request_json.account, request_json.requesting_account, request_json.memo_enc, request_json.block, request_json.local_uuid);
          case 30:
            ret = _context2.sent;
            if (!(ret != null)) {
              _context2.next = 33;
              break;
            }
            return _context2.abrupt("break", 49);
          case 33:
            ret = {
              "success": "payment memo sent"
            };
            return _context2.abrupt("break", 49);
          case 35:
            _context2.next = 37;
            return validate_signature(request_json.requesting_account, request_json.request_signature, request_json.request_nonce);
          case 37:
            ret = _context2.sent;
            if (!(ret != null)) {
              _context2.next = 40;
              break;
            }
            return _context2.abrupt("break", 49);
          case 40:
            _context2.next = 42;
            return push_payment_message(request_json.account, request_json.requesting_account, request_json.memo_enc, request_json.local_uuid);
          case 42:
            ret = _context2.sent;
            if (!(ret != null)) {
              _context2.next = 45;
              break;
            }
            return _context2.abrupt("break", 49);
          case 45:
            // todo: save the message struct for re-sending later:
            ret = {
              "success": "payment memo sent"
            };
            return _context2.abrupt("break", 49);
          case 47:
            ret = {
              "error": "invalid action"
            };
            return _context2.abrupt("break", 49);
          case 49:
            res.json(ret);
          case 50:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return function (_x30, _x31) {
    return _ref2.apply(this, arguments);
  };
}());
app.post("/notifications", /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var request_json, ret;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // get request json:
            request_json = req.body || {};
            ret = {};
            _context3.t0 = request_json.action;
            _context3.next = _context3.t0 === "fcm_update" ? 5 : 14;
            break;
          case 5:
            if (!request_json.enabled) {
              _context3.next = 11;
              break;
            }
            console.log("updating: " + request_json.account + " " + request_json.fcm_token_v2);
            _context3.next = 9;
            return update_fcm_token_for_account(request_json.account, request_json.fcm_token_v2);
          case 9:
            _context3.next = 13;
            break;
          case 11:
            _context3.next = 13;
            return delete_fcm_token_for_account(request_json.account, request_json.fcm_token_v2);
          case 13:
            return _context3.abrupt("break", 14);
          case 14:
            // returns nothing:
            res.json(ret);
          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return function (_x32, _x33) {
    return _ref3.apply(this, arguments);
  };
}());
app.post("/price", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var request_json, ret, price;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            // get request json:
            request_json = req.body || {};
            _context4.prev = 1;
            if (!currency_list.includes(request_json.currency.toUpperCase())) {
              _context4.next = 15;
              break;
            }
            _context4.prev = 3;
            _context4.next = 6;
            return redisClient.hGet("prices", "".concat(price_prefix, "-") + request_json.currency.toLowerCase());
          case 6:
            price = _context4.sent;
            ret = {
              'currency': request_json.currency.toLowerCase(),
              'price': "" + price
            };
            _context4.next = 13;
            break;
          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](3);
            // log.server_logger.error(
            //     'price data error, unable to get price;%s;%s', util.get_request_ip(r), uid)
            ret = {
              'error': 'price data error - unable to get price'
            };
          case 13:
            _context4.next = 16;
            break;
          case 15:
            // log.server_logger.error(
            //     'price data error, unknown currency;%s;%s', util.get_request_ip(r), uid)
            ret = {
              'error': 'unknown currency'
            };
          case 16:
            _context4.next = 21;
            break;
          case 18:
            _context4.prev = 18;
            _context4.t1 = _context4["catch"](1);
            // log.server_logger.error('price data error;%s;%s;%s', str(e), util.get_request_ip(r), uid)
            ret = {
              'error': 'price data error',
              'details': _context4.t1
            };
          case 21:
            res.json(ret);
          case 22:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 18], [3, 10]]);
  }));
  return function (_x34, _x35) {
    return _ref4.apply(this, arguments);
  };
}());

// giftcard API:
function generate_account_from_seed(_x36) {
  return _generate_account_from_seed.apply(this, arguments);
}
function _generate_account_from_seed() {
  _generate_account_from_seed = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17(seed) {
    var w;
    return _regeneratorRuntime().wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            w = _nanocurrencyWeb.wallet.fromLegacySeed(seed);
            return _context17.abrupt("return", w.accounts[0]);
          case 2:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  }));
  return _generate_account_from_seed.apply(this, arguments);
}
function branch_create_link(_x37) {
  return _branch_create_link.apply(this, arguments);
}
function _branch_create_link() {
  _branch_create_link = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee18(_ref5) {
    var paperWalletSeed, paperWalletAccount, memo, fromAddress, amountRaw, giftUUID, requireCaptcha, url, branch_api_key, giftDescription, data, resp;
    return _regeneratorRuntime().wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            paperWalletSeed = _ref5.paperWalletSeed, paperWalletAccount = _ref5.paperWalletAccount, memo = _ref5.memo, fromAddress = _ref5.fromAddress, amountRaw = _ref5.amountRaw, giftUUID = _ref5.giftUUID, requireCaptcha = _ref5.requireCaptcha;
            url = "https://api2.branch.io/v1/url";
            branch_api_key = process.env.BRANCH_API_KEY;
            giftDescription = "Get the app to open this gift card!";
            if (BigInt(amountRaw) > BigInt(1000000000000000000000000000000)) {
              // more than 1 NANO:
              // TEST:
              formattedAmount = BigInt(amountRaw) / BigInt(1000000000000000000000000000000);
              giftDescription = "Someone sent you ".concat(formattedAmount, " NANO! Get the app to open this gift card!");
            }
            data = {
              "branch_key": branch_api_key,
              "channel": "nautilus-backend",
              "feature": "splitgift",
              "stage": "new share",
              "data": {
                "seed": "".concat(paperWalletSeed),
                "address": "".concat(paperWalletAccount),
                "memo": "".concat(memo),
                "senderAddress": "".concat(fromAddress),
                "signature": "sig",
                "nonce": "nonce",
                "from_address": "".concat(fromAddress),
                "amount_raw": "".concat(amountRaw),
                "gift_uuid": "".concat(giftUUID),
                "require_captcha": "".concat(requireCaptcha),
                "$canonical_identifier": "server/splitgift/".concat(paperWalletSeed),
                "$og_title": "Nautilus Wallet",
                "$og_description": giftDescription
              }
            }; // resp = requests.post(url, headers=headers, data=data)
            // TODO: axios:
            _context18.next = 8;
            return _axios["default"].post(url, data);
          case 8:
            resp = _context18.sent;
            return _context18.abrupt("return", resp);
          case 10:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  }));
  return _branch_create_link.apply(this, arguments);
}
function gift_split_create(_x38) {
  return _gift_split_create.apply(this, arguments);
}
function _gift_split_create() {
  _gift_split_create = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee19(_ref6) {
    var _branchResponse$data, _branchResponse$data2;
    var seed, split_amount_raw, memo, requesting_account, require_captcha, giftUUID, giftData, paperWalletAccount, branchResponse, branchLink;
    return _regeneratorRuntime().wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            seed = _ref6.seed, split_amount_raw = _ref6.split_amount_raw, memo = _ref6.memo, requesting_account = _ref6.requesting_account, require_captcha = _ref6.require_captcha;
            giftUUID = (0, _uuid.v4)().slice(-12);
            giftData = {
              "seed": seed,
              "split_amount_raw": split_amount_raw,
              "memo": memo,
              "from_address": requesting_account,
              "gift_uuid": giftUUID,
              "require_captcha": require_captcha
            };
            _context19.next = 5;
            return redisClient.hSet("gift_data", giftUUID, JSON.stringify(giftData));
          case 5:
            if (!(BigInt(split_amount_raw) > BigInt(1000000000000000000000000000000000))) {
              _context19.next = 7;
              break;
            }
            return _context19.abrupt("return", {
              "error": "split_amount_raw is too large"
            });
          case 7:
            _context19.next = 9;
            return generate_account_from_seed(seed);
          case 9:
            paperWalletAccount = _context19.sent;
            _context19.next = 12;
            return branch_create_link({
              paperWalletSeed: seed,
              paperWalletAccount: paperWalletAccount,
              memo: memo,
              fromAddress: requesting_account,
              amountRaw: split_amount_raw,
              giftUUID: giftUUID,
              requireCaptcha: require_captcha
            });
          case 12:
            branchResponse = _context19.sent;
            if (!((branchResponse === null || branchResponse === void 0 ? void 0 : (_branchResponse$data = branchResponse.data) === null || _branchResponse$data === void 0 ? void 0 : _branchResponse$data.url) == null)) {
              _context19.next = 15;
              break;
            }
            return _context19.abrupt("return", {
              "error": "error creating branch link"
            });
          case 15:
            branchLink = (_branchResponse$data2 = branchResponse.data) === null || _branchResponse$data2 === void 0 ? void 0 : _branchResponse$data2.url;
            return _context19.abrupt("return", {
              success: true,
              link: branchLink,
              gift_data: giftData
            });
          case 17:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19);
  }));
  return _gift_split_create.apply(this, arguments);
}
var sleep = function sleep(time) {
  return new Promise(function (res) {
    return setTimeout(res, time);
  });
};
function gift_claim(_x39, _x40) {
  return _gift_claim.apply(this, arguments);
}
function _gift_claim() {
  _gift_claim = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee20(_ref7, headers) {
    var gift_uuid, requesting_account, requesting_device_uuid, giftData, giftUUID, seed, fromAddress, splitAmountRaw, amountRaw, memo, requireCaptcha, requestingDeviceUUID, hcaptchaToken, sendAmountRaw, splitID, claimed, giftSeed, giftAccount, giftPrivateKey, giftPublicKey, giftWalletBalanceInt, response, account_not_opened, frontier, receivable_resp, hash, item, blockData, _signedBlock, resp, _blockData, _signedBlock2, _resp, giftFrontier, frontiers_resp, returnedFrontiers, addr, newBalanceRaw, sendBlock, signedBlock, sendResp;
    return _regeneratorRuntime().wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            gift_uuid = _ref7.gift_uuid, requesting_account = _ref7.requesting_account, requesting_device_uuid = _ref7.requesting_device_uuid;
            _context20.next = 3;
            return redisClient.hGet("gift_data", gift_uuid);
          case 3:
            giftData = _context20.sent;
            giftData = JSON.parse(giftData);
            giftUUID = giftData.gift_uuid;
            seed = giftData.seed;
            fromAddress = giftData.from_address;
            splitAmountRaw = giftData.split_amount_raw;
            amountRaw = giftData.amount_raw;
            memo = giftData.memo;
            requireCaptcha = giftData.require_captcha;
            requestingDeviceUUID = requesting_device_uuid; // if 'app-version' in r.headers:
            //     appVersion = r.headers.get('app-version')
            //     appVersion = appVersion.replace(".", "")
            //     appVersion = int(appVersion)
            //     if appVersion < 60:
            //         return json.dumps({"error": "App version is too old!"})
            // else:
            //     return json.dumps({"error": "App version is too old!"})
            if (!requireCaptcha) {
              _context20.next = 22;
              break;
            }
            // TODO:

            console.log(headers);
            if (!headers["hcaptcha-token"]) {
              _context20.next = 21;
              break;
            }
            hcaptchaToken = headers["hcaptcha-token"]; // // post to hcaptcha to verify the token:
            // let resp = await axios.post("https://hcaptcha.com/siteverify", qs.stringify({
            //     "response": hcaptchaToken,
            //     "secret": HCAPTCHA_SECRET_KEY,
            // }), {
            //     headers: {
            //         'Accept-Encoding': 'application/json',
            //         'Content-Type': 'application/x-www-form-urlencoded'
            //     },
            // });
            // console.log(resp.data);
            // TODO:
            if (!(hcaptchaToken.length < 30)) {
              _context20.next = 19;
              break;
            }
            return _context20.abrupt("return", {
              "error": "hcaptcha-token invalid!"
            });
          case 19:
            _context20.next = 22;
            break;
          case 21:
            return _context20.abrupt("return", {
              "error": "no hcaptcha-token!"
            });
          case 22:
            sendAmountRaw = null;
            if (!!splitAmountRaw) {
              sendAmountRaw = splitAmountRaw;
            } else if (!!amountRaw) {
              sendAmountRaw = amountRaw;
            }
            if (sendAmountRaw) {
              _context20.next = 26;
              break;
            }
            return _context20.abrupt("return", {
              "error": "sendAmountRaw is None"
            });
          case 26:
            if (giftUUID) {
              _context20.next = 28;
              break;
            }
            return _context20.abrupt("return", {
              "error": "gift not found!"
            });
          case 28:
            if (!(!requestingDeviceUUID || requestingDeviceUUID == "")) {
              _context20.next = 30;
              break;
            }
            return _context20.abrupt("return", {
              "error": "requestingDeviceUUID is None"
            });
          case 30:
            // check if it was claimed by this user:
            // splitID = util.get_request_ip(r) + nonce_separator + giftUUID + nonce_separator + requestingAccount
            splitID = requestingDeviceUUID + nonce_separator + giftUUID; // splitID = util.get_request_ip(r) + nonce_separator + giftUUID
            _context20.next = 33;
            return redisClient.hGet("gift_claims", splitID);
          case 33:
            claimed = _context20.sent;
            if (!(!!claimed && !testing)) {
              _context20.next = 36;
              break;
            }
            return _context20.abrupt("return", {
              "error": "gift has already been claimed"
            });
          case 36:
            giftSeed = seed;
            _context20.next = 39;
            return generate_account_from_seed(giftSeed);
          case 39:
            giftAccount = _context20.sent.address;
            _context20.next = 42;
            return generate_account_from_seed(giftSeed);
          case 42:
            giftPrivateKey = _context20.sent.privateKey;
            _context20.next = 45;
            return generate_account_from_seed(giftSeed);
          case 45:
            giftPublicKey = _context20.sent.publicKey;
            // receive any receivable funds from the paper wallet first:
            giftWalletBalanceInt = null; // get account_info:
            _context20.next = 49;
            return rpc_call({
              "action": "account_info",
              "account": giftAccount
            });
          case 49:
            response = _context20.sent;
            account_not_opened = false;
            if (!(response.error == "Account not found")) {
              _context20.next = 55;
              break;
            }
            account_not_opened = true;
            _context20.next = 60;
            break;
          case 55:
            if (!response.error) {
              _context20.next = 59;
              break;
            }
            return _context20.abrupt("return", {
              "error": response.error
            });
          case 59:
            giftWalletBalanceInt = response.balance;
          case 60:
            frontier = null;
            if (!account_not_opened) {
              frontier = response.frontier;
            }

            // get the receivable blocks:
            _context20.next = 64;
            return rpc_call({
              "action": "receivable",
              "source": true,
              "count": 10,
              "include_active": true,
              "account": giftAccount
            });
          case 64:
            receivable_resp = _context20.sent;
            if (receivable_resp.blocks == "") {
              receivable_resp.blocks = {};
            }

            // receive each block:
            _context20.t0 = _regeneratorRuntime().keys(receivable_resp.blocks);
          case 67:
            if ((_context20.t1 = _context20.t0()).done) {
              _context20.next = 104;
              break;
            }
            hash = _context20.t1.value;
            item = receivable_resp.blocks[hash]; // we have a frontier, i.e. the account is already opened:
            if (!frontier) {
              _context20.next = 89;
              break;
            }
            giftWalletBalanceInt = item.amount;
            _context20.t2 = frontier;
            _context20.t3 = giftAccount;
            _context20.t4 = REPRESENTATIVE;
            _context20.t5 = giftWalletBalanceInt;
            _context20.t6 = item.amount;
            _context20.t7 = hash;
            _context20.next = 80;
            return get_work(hash);
          case 80:
            _context20.t8 = _context20.sent;
            blockData = {
              frontier: _context20.t2,
              toAddress: _context20.t3,
              representativeAddress: _context20.t4,
              walletBalanceRaw: _context20.t5,
              amountRaw: _context20.t6,
              transactionHash: _context20.t7,
              work: _context20.t8
            };
            _signedBlock = _nanocurrencyWeb.block.receive(blockData, giftPrivateKey);
            _context20.next = 85;
            return rpc_call({
              action: "process",
              json_block: true,
              subtype: "receive",
              block: _signedBlock
            });
          case 85:
            resp = _context20.sent;
            if (!!resp.hash) {
              frontier = resp.hash;
            }
            _context20.next = 102;
            break;
          case 89:
            _context20.t9 = giftAccount;
            _context20.t10 = REPRESENTATIVE;
            _context20.t11 = item.amount;
            _context20.t12 = hash;
            _context20.next = 95;
            return get_work(giftPublicKey);
          case 95:
            _context20.t13 = _context20.sent;
            _blockData = {
              frontier: "0000000000000000000000000000000000000000000000000000000000000000",
              toAddress: _context20.t9,
              representativeAddress: _context20.t10,
              walletBalanceRaw: "0",
              amountRaw: _context20.t11,
              transactionHash: _context20.t12,
              work: _context20.t13
            };
            _signedBlock2 = _nanocurrencyWeb.block.receive(_blockData, giftPrivateKey);
            _context20.next = 100;
            return rpc_call({
              action: "process",
              json_block: true,
              subtype: "receive",
              block: _signedBlock2
            });
          case 100:
            _resp = _context20.sent;
            if (!!_resp.hash) {
              frontier = _resp.hash;
            }
          case 102:
            _context20.next = 67;
            break;
          case 104:
            _context20.next = 106;
            return sleep(4000);
          case 106:
            // # get the gift frontier:
            giftFrontier = frontier;
            _context20.next = 109;
            return rpc_call({
              "action": "frontiers",
              "count": 1,
              "account": giftAccount
            });
          case 109:
            frontiers_resp = _context20.sent;
            if (!(frontiers_resp.frontiers == "")) {
              _context20.next = 114;
              break;
            }
            giftFrontier = frontier;
            _context20.next = 122;
            break;
          case 114:
            returnedFrontiers = frontiers_resp.frontiers;
            _context20.t14 = _regeneratorRuntime().keys(returnedFrontiers);
          case 116:
            if ((_context20.t15 = _context20.t14()).done) {
              _context20.next = 122;
              break;
            }
            addr = _context20.t15.value;
            giftFrontier = returnedFrontiers[addr];
            return _context20.abrupt("break", 122);
          case 122:
            // get account_info(again) so we can be 100 % sure of the balance:
            giftWalletBalanceInt = null;
            console.log(giftAccount);
            _context20.next = 126;
            return rpc_call({
              "action": "account_info",
              "account": giftAccount
            });
          case 126:
            response = _context20.sent;
            if (!response.error) {
              _context20.next = 131;
              break;
            }
            return _context20.abrupt("return", {
              "error": response.error
            });
          case 131:
            giftWalletBalanceInt = BigInt(response.balance);
          case 132:
            if (giftWalletBalanceInt) {
              _context20.next = 136;
              break;
            }
            return _context20.abrupt("return", {
              "error": "giftWalletBalanceInt shouldn't be None"
            });
          case 136:
            if (!(giftWalletBalanceInt == BigInt(0))) {
              _context20.next = 138;
              break;
            }
            return _context20.abrupt("return", {
              "error": "Gift wallet is empty!"
            });
          case 138:
            newBalanceRaw = BigInt(giftWalletBalanceInt) - BigInt(sendAmountRaw);
            if (!(newBalanceRaw == null)) {
              _context20.next = 143;
              break;
            }
            return _context20.abrupt("return", {
              "error": "newBalanceRaw is None"
            });
          case 143:
            if (BigInt(newBalanceRaw) < BigInt(0)) {
              // send whatever is left in the gift wallet:
              newBalanceRaw = "0";
            }
          case 144:
            _context20.t16 = giftWalletBalanceInt.toString();
            _context20.t17 = giftAccount;
            _context20.t18 = requesting_account;
            _context20.t19 = REPRESENTATIVE;
            _context20.t20 = giftFrontier;
            _context20.t21 = sendAmountRaw;
            _context20.next = 152;
            return get_work(giftFrontier);
          case 152:
            _context20.t22 = _context20.sent;
            sendBlock = {
              walletBalanceRaw: _context20.t16,
              fromAddress: _context20.t17,
              toAddress: _context20.t18,
              representativeAddress: _context20.t19,
              frontier: _context20.t20,
              amountRaw: _context20.t21,
              work: _context20.t22
            };
            signedBlock = _nanocurrencyWeb.block.send(sendBlock, giftPrivateKey);
            _context20.next = 157;
            return rpc_call({
              action: "process",
              json_block: true,
              subtype: "send",
              block: signedBlock
            });
          case 157:
            sendResp = _context20.sent;
            if (sendResp.hash) {
              _context20.next = 160;
              break;
            }
            return _context20.abrupt("return", {
              "error": "error sending to paper wallet: " + sendResp
            });
          case 160:
            _context20.next = 162;
            return redisClient.hSet("gift_claims", splitID, "claimed");
          case 162:
            return _context20.abrupt("return", {
              "success": true
            });
          case 163:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20);
  }));
  return _gift_claim.apply(this, arguments);
}
function gift_info(_x41) {
  return _gift_info.apply(this, arguments);
}
function _gift_info() {
  _gift_info = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee21(_ref8) {
    var gift_uuid, requesting_account, requesting_device_uuid, giftData, splitID, claimed, amount, returnable;
    return _regeneratorRuntime().wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            gift_uuid = _ref8.gift_uuid, requesting_account = _ref8.requesting_account, requesting_device_uuid = _ref8.requesting_device_uuid;
            _context21.next = 3;
            return redisClient.hGet("gift_data", gift_uuid);
          case 3:
            giftData = _context21.sent;
            if (giftData) {
              _context21.next = 6;
              break;
            }
            return _context21.abrupt("return", {
              "error": "gift does not exist"
            });
          case 6:
            giftData = JSON.parse(giftData);
            if (!(!requesting_device_uuid || requesting_device_uuid == "")) {
              _context21.next = 9;
              break;
            }
            return _context21.abrupt("return", {
              "error": "requesting_device_uuid is None"
            });
          case 9:
            // # check if it was claimed by this user:
            // # splitID = util.get_request_ip(r) + nonce_separator + giftUUID + nonce_separator + requestingAccount
            // # splitID = util.get_request_ip(r) + nonce_separator + giftUUID
            splitID = requesting_device_uuid + nonce_separator + gift_uuid;
            _context21.next = 12;
            return redisClient.hGet("gift_claims", splitID);
          case 12:
            claimed = _context21.sent;
            if (!(!!claimed && !testing)) {
              _context21.next = 15;
              break;
            }
            return _context21.abrupt("return", {
              "error": "gift has already been claimed"
            });
          case 15:
            // check the balance of the gift wallet:
            // let giftWalletSeed = giftData.seed;
            // let giftWalletAccount = (await generate_account_from_seed(giftWalletSeed)).address;
            // TODO: finish getting gift balance:
            // giftWalletBalance = await rpc.json_post({"action": "account_balance", "account": giftWalletAccount})
            amount = giftData.split_amount_raw;
            if (!amount) {
              amount = giftData.get("amount_raw");
            }
            returnable = {
              "gift_uuid": gift_uuid,
              "amount_raw": amount,
              "memo": giftData.memo,
              "from_address": giftData.from_address,
              require_captcha: giftData.require_captcha
            }; // if giftWalletBalance.get("balance") != None:
            //     returnable["gift_wallet_balance"] = giftWalletBalance.get("balance")
            return _context21.abrupt("return", {
              "success": true,
              "gift_data": returnable
            });
          case 19:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21);
  }));
  return _gift_info.apply(this, arguments);
}
app.post("/gift", /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var request_json, ret;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            // get request json:
            request_json = req.body || {};
            _context5.t0 = request_json.action;
            _context5.next = _context5.t0 === "gift_split_create" ? 4 : _context5.t0 === "gift_info" ? 8 : _context5.t0 === "gift_claim" ? 12 : 16;
            break;
          case 4:
            _context5.next = 6;
            return gift_split_create(request_json);
          case 6:
            ret = _context5.sent;
            return _context5.abrupt("break", 18);
          case 8:
            _context5.next = 10;
            return gift_info(request_json);
          case 10:
            ret = _context5.sent;
            return _context5.abrupt("break", 18);
          case 12:
            _context5.next = 14;
            return gift_claim(request_json, req.headers);
          case 14:
            ret = _context5.sent;
            return _context5.abrupt("break", 18);
          case 16:
            ret = {
              "error": "invalid action"
            };
            return _context5.abrupt("break", 18);
          case 18:
            console.log("RES:");
            console.log(ret);
            res.json(ret);
          case 21:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return function (_x42, _x43) {
    return _ref9.apply(this, arguments);
  };
}());

// Push notifications
function delete_fcm_token_for_account(_x44) {
  return _delete_fcm_token_for_account.apply(this, arguments);
}
function _delete_fcm_token_for_account() {
  _delete_fcm_token_for_account = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee22(token) {
    return _regeneratorRuntime().wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            _context22.next = 2;
            return redisClient.del(token);
          case 2:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22);
  }));
  return _delete_fcm_token_for_account.apply(this, arguments);
}
function update_fcm_token_for_account(_x45, _x46) {
  return _update_fcm_token_for_account.apply(this, arguments);
}
function _update_fcm_token_for_account() {
  _update_fcm_token_for_account = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee23(account, token) {
    var cur_list;
    return _regeneratorRuntime().wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            _context23.next = 2;
            return set_or_upgrade_token_account_list(account, token);
          case 2:
            _context23.next = 4;
            return redisClient.get(account);
          case 4:
            cur_list = _context23.sent;
            if (cur_list != null) {
              // cur_list = json.loads(cur_list.replace('\'', '"'))
              // CHECK:
              cur_list = JSON.parse(cur_list);
            } else {
              cur_list = {};
            }
            if (!("data" in cur_list)) {
              cur_list['data'] = [];
            }
            if (!cur_list['data'].includes(token)) {
              cur_list['data'].push(token);
            }
            _context23.next = 10;
            return redisClient.set(account, JSON.stringify(cur_list));
          case 10:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23);
  }));
  return _update_fcm_token_for_account.apply(this, arguments);
}
function get_or_upgrade_token_account_list(_x47, _x48) {
  return _get_or_upgrade_token_account_list.apply(this, arguments);
}
function _get_or_upgrade_token_account_list() {
  _get_or_upgrade_token_account_list = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee24(account, token) {
    var curTokenList, tokenList, _token2;
    return _regeneratorRuntime().wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            _context24.next = 2;
            return redisClient.get(token);
          case 2:
            curTokenList = _context24.sent;
            if (curTokenList) {
              _context24.next = 5;
              break;
            }
            return _context24.abrupt("return", []);
          case 5:
            _context24.prev = 5;
            tokenList = JSON.parse(curTokenList);
            return _context24.abrupt("return", tokenList);
          case 10:
            _context24.prev = 10;
            _context24.t0 = _context24["catch"](5);
            _token2 = curTokenList; // CHECK (expire):
            _context24.next = 15;
            return redisClient.set(_token2, JSON.stringify([_token2]), "EX", MONTH_IN_SECONDS);
          case 15:
            if (!(account != _token2)) {
              _context24.next = 17;
              break;
            }
            return _context24.abrupt("return", []);
          case 17:
            _context24.t1 = JSON;
            _context24.next = 20;
            return redisClient.get(token);
          case 20:
            _context24.t2 = _context24.sent;
            return _context24.abrupt("return", _context24.t1.parse.call(_context24.t1, _context24.t2));
          case 22:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee24, null, [[5, 10]]);
  }));
  return _get_or_upgrade_token_account_list.apply(this, arguments);
}
function set_or_upgrade_token_account_list(_x49, _x50) {
  return _set_or_upgrade_token_account_list.apply(this, arguments);
}
function _set_or_upgrade_token_account_list() {
  _set_or_upgrade_token_account_list = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee25(account, token) {
    var curTokenList, tokenList, _token3;
    return _regeneratorRuntime().wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            _context25.next = 2;
            return redisClient.get(token);
          case 2:
            curTokenList = _context25.sent;
            if (curTokenList) {
              _context25.next = 8;
              break;
            }
            _context25.next = 6;
            return redisClient.set(token, JSON.stringify([account]), "EX", MONTH_IN_SECONDS);
          case 6:
            _context25.next = 21;
            break;
          case 8:
            _context25.prev = 8;
            tokenList = JSON.parse(curTokenList);
            if (tokenList.includes(account)) {
              _context25.next = 14;
              break;
            }
            tokenList.push(account);
            _context25.next = 14;
            return redisClient.set(token, JSON.stringify(tokenList), "EX", MONTH_IN_SECONDS);
          case 14:
            _context25.next = 21;
            break;
          case 16:
            _context25.prev = 16;
            _context25.t0 = _context25["catch"](8);
            _token3 = curTokenList;
            _context25.next = 21;
            return redisClient.set(_token3, JSON.stringify([_token3]), "EX", MONTH_IN_SECONDS);
          case 21:
            _context25.t1 = JSON;
            _context25.next = 24;
            return redisClient.get(token);
          case 24:
            _context25.t2 = _context25.sent;
            return _context25.abrupt("return", _context25.t1.parse.call(_context25.t1, _context25.t2));
          case 26:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee25, null, [[8, 16]]);
  }));
  return _set_or_upgrade_token_account_list.apply(this, arguments);
}
function get_fcm_tokens(_x51) {
  return _get_fcm_tokens.apply(this, arguments);
}
function _get_fcm_tokens() {
  _get_fcm_tokens = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee26(account) {
    var tokens, new_token_list, _iterator8, _step8, t, account_list;
    return _regeneratorRuntime().wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            _context26.next = 2;
            return redisClient.get(account);
          case 2:
            tokens = _context26.sent;
            if (tokens) {
              _context26.next = 5;
              break;
            }
            return _context26.abrupt("return", []);
          case 5:
            tokens = JSON.parse(tokens);
            // Rebuild the list for this account removing tokens that dont belong anymore
            new_token_list = {
              data: []
            };
            if ('data' in tokens) {
              _context26.next = 9;
              break;
            }
            return _context26.abrupt("return", []);
          case 9:
            _iterator8 = _createForOfIteratorHelper(tokens['data']);
            _context26.prev = 10;
            _iterator8.s();
          case 12:
            if ((_step8 = _iterator8.n()).done) {
              _context26.next = 22;
              break;
            }
            t = _step8.value;
            _context26.next = 16;
            return get_or_upgrade_token_account_list(account, t);
          case 16:
            account_list = _context26.sent;
            if (account_list.includes(account)) {
              _context26.next = 19;
              break;
            }
            return _context26.abrupt("continue", 20);
          case 19:
            new_token_list['data'].push(t);
          case 20:
            _context26.next = 12;
            break;
          case 22:
            _context26.next = 27;
            break;
          case 24:
            _context26.prev = 24;
            _context26.t0 = _context26["catch"](10);
            _iterator8.e(_context26.t0);
          case 27:
            _context26.prev = 27;
            _iterator8.f();
            return _context26.finish(27);
          case 30:
            _context26.next = 32;
            return redisClient.set(account, JSON.stringify(new_token_list));
          case 32:
            return _context26.abrupt("return", _toConsumableArray(new Set(new_token_list['data'])));
          case 33:
          case "end":
            return _context26.stop();
        }
      }
    }, _callee26, null, [[10, 24, 27, 30]]);
  }));
  return _get_fcm_tokens.apply(this, arguments);
}