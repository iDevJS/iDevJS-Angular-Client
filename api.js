"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('angular2/core');
var http_1 = require('angular2/http');
var Observable_1 = require('rxjs/Observable');
var AuthConfig = (function () {
    function AuthConfig(options) {
        this.baseUrl = options.baseUrl || 'http://api.idevjs.com:4000';
        this.version = options.version || 'v1';
        this.tokenName = options.tokenName || 'idevjs_token';
        this.headerName = options.headerName || 'Authorization';
        this.headerPrefix = (options.tokenPrefix || 'Bearer') + ' ';
    }
    AuthConfig.prototype.getConfig = function () {
        return {
            baseUrl: this.baseUrl,
            version: this.version,
            tokenName: this.tokenName,
            headerName: this.headerName,
            headerPrefix: this.headerPrefix
        };
    };
    AuthConfig = __decorate([
        core_1.Injectable()
    ], AuthConfig);
    return AuthConfig;
}());
exports.AuthConfig = AuthConfig;
var Client = (function () {
    function Client(options, http) {
        this.http = http;
        var headers = new http_1.Headers({
            'Content-type': 'application/json;charset=utf-8;'
        });
        this.defaultOptions = new http_1.RequestOptions({
            headers: headers
        });
        this._config = options.getConfig();
        this.API_ENDPOINT = this._config.baseUrl + "/" + this._config.version;
    }
    Client.prototype._request = function (options, auth) {
        if (auth) {
            if (localStorage.getItem(this._config.tokenName)) {
                this.defaultOptions.headers.append('Authorization', 'Bearer ' + localStorage.getItem(this._config.tokenName));
            }
            else {
            }
        }
        options.url = "" + this.API_ENDPOINT + options.url;
        return this.http.request(new http_1.Request(this.defaultOptions.merge(options)))
            .map(function (res) { return res.json(); });
    };
    // post
    Client.prototype.getPostList = function (start, count) {
        if (start === void 0) { start = 0; }
        if (count === void 0) { count = 30; }
        return this._request({
            url: '/post',
            search: "start=" + start + "&count=" + count,
            method: http_1.RequestMethod.Get
        });
    };
    Client.prototype.getNodePostList = function (node, start, count) {
        if (start === void 0) { start = 0; }
        if (count === void 0) { count = 30; }
        return this._request({
            url: "/node/" + node + "/post",
            search: "start=" + start + "&count=" + count,
            method: http_1.RequestMethod.Get
        });
    };
    Client.prototype.getPost = function (id) {
        return this._request({
            url: "/post/" + id,
            method: http_1.RequestMethod.Get
        });
    };
    Client.prototype.getPostRaw = function (id) {
        return this._request({
            url: "/post/" + id,
            search: 'content_format=markdown',
            method: http_1.RequestMethod.Get
        });
    };
    Client.prototype.getUserPostList = function (id, start, count) {
        if (start === void 0) { start = 0; }
        if (count === void 0) { count = 30; }
        return this._request({
            url: "/user/" + id + "/post",
            search: "start=" + start + "&count=" + count,
            method: http_1.RequestMethod.Get
        });
    };
    Client.prototype.updatePost = function (id, data) {
        var body = JSON.stringify(data);
        return this._request({
            url: "/post/" + id,
            body: body,
            method: http_1.RequestMethod.Post
        }, true);
    };
    // comment
    Client.prototype.getPostCommentList = function (id, start, count) {
        if (start === void 0) { start = 0; }
        if (count === void 0) { count = 30; }
        return this._request({
            url: "/post/" + id + "/comment",
            search: "start=" + start + "&count=" + count,
            method: http_1.RequestMethod.Get
        });
    };
    Client.prototype.addPostComment = function (id, content) {
        var body = JSON.stringify({ content: content });
        return this._request({
            url: "/post/" + id + "/comment",
            body: body,
            method: http_1.RequestMethod.Post
        }, true);
    };
    Client.prototype.getUserCommentList = function (id, start, count) {
        if (start === void 0) { start = 0; }
        if (count === void 0) { count = 30; }
        return this._request({
            url: "/user/" + id + "/comment",
            search: "start=" + start + "&count=" + count,
            method: http_1.RequestMethod.Get
        });
    };
    // node
    Client.prototype.getNodeList = function () {
        return this._request({
            url: "/node",
            method: http_1.RequestMethod.Get
        });
    };
    Client.prototype.getNode = function (name) {
        return this._request({
            url: "/node/" + name,
            method: http_1.RequestMethod.Get
        });
    };
    // user 
    Client.prototype.getUser = function () {
        return this._request({
            url: '/me',
            method: http_1.RequestMethod.Get
        }, true);
    };
    Client.prototype.updateUserProfile = function (data) {
        var body = JSON.stringify(data);
        return this._request({
            url: '/me',
            method: http_1.RequestMethod.Post
        }, true);
    };
    Client.prototype.getUserSetting = function () {
        return this._request({
            url: '/setting',
            method: http_1.RequestMethod.Get
        }, true);
    };
    Client.prototype.updateUserSetting = function (data) {
        var body = JSON.stringify(data);
        return this._request({
            url: '/setting',
            method: http_1.RequestMethod.Post
        }, true);
    };
    __decorate([
        Auth('idevjs_token')
    ], Client.prototype, "updatePost", null);
    __decorate([
        Auth('idevjs_token')
    ], Client.prototype, "getUser", null);
    __decorate([
        Auth('idevjs_token')
    ], Client.prototype, "updateUserProfile", null);
    __decorate([
        Auth('idevjs_token')
    ], Client.prototype, "getUserSetting", null);
    __decorate([
        Auth('idevjs_token')
    ], Client.prototype, "updateUserSetting", null);
    Client = __decorate([
        core_1.Injectable()
    ], Client);
    return Client;
}());
exports.Client = Client;
function unAuthorizedResponse() {
    return new Observable_1.Observable((function (observer) {
        observer.onError(new http_1.Response(new http_1.ResponseOptions({
            status: 403,
            statusText: 'unAuthorized',
            type: http_1.ResponseType.Error
        })));
    }));
}
exports.unAuthorizedResponse = unAuthorizedResponse;
function Auth(tokenName) {
    return function (target, propertyKey, descriptor) {
        var originalMethod = descriptor.value;
        if (!localStorage.getItem(tokenName)) {
            descriptor.value = function () {
                return new Observable_1.Observable((function (observer) {
                    observer.onError(new http_1.Response(new http_1.ResponseOptions({
                        status: 403,
                        statusText: 'unAuthorized',
                        type: http_1.ResponseType.Error
                    })));
                }));
            };
        }
        // descriptor.value = unAuthorizedResponse
        return descriptor;
    };
}
exports.Auth = Auth;
