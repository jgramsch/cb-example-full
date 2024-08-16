"use server";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSendersAndReceivers = void 0;
var fs = require("fs");
var path = require("path");
var axios_1 = require("axios");
var fetchSenders = function () { return __awaiter(void 0, void 0, void 0, function () {
    var senders_url, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                senders_url = "https://elb.currencybird.cl/apigateway-cb/api/public/incomingCountries";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.get(senders_url, {
                        responseType: "json",
                    })];
            case 2: return [2 /*return*/, (_a.sent()).data];
            case 3:
                error_1 = _a.sent();
                console.error(error_1);
                return [2 /*return*/, []];
            case 4: return [2 /*return*/];
        }
    });
}); };
var fetchReceivers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var receivers_url, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                receivers_url = "https://elb.currencybird.cl/apigateway-cb/api/public/sendCountries";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.get(receivers_url, {
                        responseType: "json",
                    })];
            case 2: return [2 /*return*/, (_a.sent()).data];
            case 3:
                error_2 = _a.sent();
                console.error(error_2);
                return [2 /*return*/, []];
            case 4: return [2 /*return*/];
        }
    });
}); };
var fetchFlagAndCountry = function (cnt) { return __awaiter(void 0, void 0, void 0, function () {
    var flagsDir, getCountryNames, country_name, flagUrl, filePath, response, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                flagsDir = path.join(process.cwd(), "public", "flags");
                getCountryNames = new Intl.DisplayNames(["es"], { type: "region" });
                country_name = getCountryNames.of(cnt.isoCode);
                if (!fs.existsSync(flagsDir)) {
                    fs.mkdirSync(flagsDir, { recursive: true });
                }
                flagUrl = "https://flagcdn.com/w40/".concat(cnt.isoCode.toLowerCase(), ".png");
                filePath = path.join(flagsDir, "".concat(cnt.isoCode.toLowerCase(), ".png"));
                if (!!fs.existsSync(filePath)) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.get(flagUrl, {
                        responseType: "arraybuffer",
                    })];
            case 2:
                response = _a.sent();
                fs.writeFileSync(filePath, response.data);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                // TODO: arreglar bug isla ascencion y bandera
                if (country_name != cnt.isoCode) {
                    // console.log("TODO: this country is being left out ");
                    // console.log(country_name);
                    // console.log(cnt.isoCode);
                }
                else {
                    // console.log("Trick country? ", country_name);
                }
                return [2 /*return*/, {
                        currency: "",
                        country: "",
                        flagSrc: "",
                    }];
            case 4: return [2 /*return*/, {
                    currency: cnt.currency,
                    country: country_name ? country_name : "",
                    flagSrc: "/flags/".concat(cnt.isoCode.toLowerCase(), ".png"),
                }];
        }
    });
}); };
var prepareCountryData = function (countryInfo) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(countryInfo.map(function (country) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fetchFlagAndCountry(country)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                }); }))];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result.filter(function (value) { return !(value.currency === ""); })];
        }
    });
}); };
var getSendersAndReceivers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var senders, receivers;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, fetchSenders()];
            case 1:
                senders = _b.sent();
                return [4 /*yield*/, fetchReceivers()];
            case 2:
                receivers = _b.sent();
                _a = {};
                return [4 /*yield*/, prepareCountryData(senders)];
            case 3:
                _a.senders = _b.sent();
                return [4 /*yield*/, prepareCountryData(receivers)];
            case 4: return [2 /*return*/, (_a.receivers = _b.sent(),
                    _a)];
        }
    });
}); };
exports.getSendersAndReceivers = getSendersAndReceivers;
var ConversionController = /** @class */ (function () {
    function ConversionController(host, port, route) {
        if (host === void 0) { host = "http://127.0.0.1"; }
        if (port === void 0) { port = 8000; }
        if (route === void 0) { route = "api/"; }
        this._conversionTree = new Map();
        this.url = host + ":" + port.toString() + "/" + route;
    }
    Object.defineProperty(ConversionController.prototype, "countries", {
        get: function () {
            return this._countries;
        },
        set: function (countries) {
            this._countries = countries;
        },
        enumerable: false,
        configurable: true
    });
    ConversionController.prototype.fetchConversions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sender_set, receiver_set, sender_currencies, receiver_currencies, requestArray, conversionData;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._countries) {
                            throw Error("countries attribute hasn't been set");
                        }
                        sender_set = new Set();
                        receiver_set = new Set();
                        sender_currencies = this._countries.senders
                            .filter(function (value) {
                            if (sender_set.has(value.currency)) {
                                return false;
                            }
                            sender_set.add(value.currency);
                            return true;
                        })
                            .map(function (value) { return value.currency; });
                        receiver_currencies = this._countries.receivers
                            .filter(function (value) {
                            if (receiver_set.has(value.currency)) {
                                return false;
                            }
                            receiver_set.add(value.currency);
                            return true;
                        })
                            .map(function (value) { return value.currency; });
                        requestArray = sender_currencies.map(function (value) {
                            return {
                                input_currency: value,
                                output_currencies: ["CLP"],
                            };
                        });
                        requestArray.push({
                            input_currency: "CLP",
                            output_currencies: receiver_currencies,
                        });
                        return [4 /*yield*/, Promise.all(requestArray.map(function (value) { return __awaiter(_this, void 0, void 0, function () {
                                var response, error_4;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, axios_1.default.post(this.url, value, {
                                                    responseType: "json",
                                                })];
                                        case 1:
                                            response = _a.sent();
                                            return [2 /*return*/, response.data];
                                        case 2:
                                            error_4 = _a.sent();
                                            // console.log("failed to fetch conversion");
                                            // console.log(value.input_currency);
                                            // console.log(value.output_currencies);
                                            // console.log(error);
                                            return [2 /*return*/, {
                                                    date: "",
                                                    sender_code: "",
                                                    conversions: new Map(),
                                                }];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        conversionData = _a.sent();
                        if (conversionData.length <= 0) {
                            return [2 /*return*/];
                        }
                        //Popuate tree
                        conversionData.forEach(function (response) {
                            var senderCurrency = response.sender_code.toUpperCase();
                            if (!_this._conversionTree.has(senderCurrency)) {
                                _this._conversionTree.set(senderCurrency, new Map());
                            }
                            var outputCurrencies = _this._conversionTree.get(senderCurrency);
                            var conversions = new Map(Object.entries(response.conversions));
                            conversions.forEach(function (rate, receiverCurrency) {
                                outputCurrencies === null || outputCurrencies === void 0 ? void 0 : outputCurrencies.set(receiverCurrency.toUpperCase(), rate);
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ConversionController.prototype.convertCurrency = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var rate;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this._conversionTree.keys.length <= 0)) return [3 /*break*/, 2];
                        console.log("fetching conversions");
                        return [4 /*yield*/, this.fetchConversions()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        rate = (_a = this._conversionTree
                            .get(params.input.currency)) === null || _a === void 0 ? void 0 : _a.get(params.output_currency);
                        // return result
                        return [2 /*return*/, params.input.amount * rate * 0.95];
                }
            });
        });
    };
    return ConversionController;
}());
// Testing plus instance export construction
var Conversions = new ConversionController();
(0, exports.getSendersAndReceivers)().then(function (result) {
    // console.log(result.senders.length);
    // console.log(result.receivers.length);
    Conversions.countries = result;
    console.log("converting 1000 usd to clp and back");
    Conversions.convertCurrency({
        input: { currency: "USD", amount: 1000 },
        output_currency: "CLP",
    }).then(function (result) {
        console.log(result);
        Conversions.convertCurrency({
            input: { currency: "CLP", amount: 1000 },
            output_currency: "USD",
        }).then(function (result) {
            console.log(result);
        });
    });
});
console.log(Conversions._conversionTree);
