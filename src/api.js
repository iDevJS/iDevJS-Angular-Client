"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var Observable_1 = require('rxjs/Observable');
var AuthConfig = (function () {
    function AuthConfig(options) {
        this.baseUrl = options.baseUrl || 'http://api.idevjs.com';
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
        core_1.Injectable(), 
        __metadata('design:paramtypes', [Object])
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
                this.defaultOptions.headers.set('Authorization', 'Bearer ' + localStorage.getItem(this._config.tokenName));
            }
            else {
            }
        }
        options.url = "" + this.API_ENDPOINT + options.url;
        return this.http.request(new http_1.Request(this.defaultOptions.merge(options)))
            .map(function (res) { return res.json(); });
    };
    // post
    Client.prototype.getPostList = function (params) {
        var searchParams = new http_1.URLSearchParams();
        Object.keys(params || {}).forEach(function (key) { searchParams.append(key, params[key]); });
        return this._request({
            url: '/post',
            search: searchParams,
            method: http_1.RequestMethod.Get
        });
    };
    Client.prototype.getNodePostList = function (node, params) {
        var searchParams = new http_1.URLSearchParams();
        Object.keys(params || {}).forEach(function (key) { searchParams.append(key, params[key]); });
        return this._request({
            url: "/node/" + node + "/post",
            search: searchParams,
            method: http_1.RequestMethod.Get
        });
    };
    Client.prototype.getUserPostList = function (name, params) {
        var searchParams = new http_1.URLSearchParams();
        Object.keys(params || {}).forEach(function (key) { searchParams.append(key, params[key]); });
        return this._request({
            url: "/user/" + name + "/post",
            search: searchParams,
            method: http_1.RequestMethod.Get
        });
    };
    Client.prototype.getPost = function (id, params) {
        var searchParams = new http_1.URLSearchParams();
        Object.keys(params || {}).forEach(function (key) { searchParams.append(key, params[key]); });
        return this._request({
            url: "/post/" + id,
            search: searchParams,
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
    Client.prototype.addPost = function (data) {
        var body = JSON.stringify(data);
        return this._request({
            url: "/post",
            body: body,
            method: http_1.RequestMethod.Post
        }, true);
    };
    // comment
    Client.prototype.getPostCommentList = function (id, params) {
        var searchParams = new http_1.URLSearchParams();
        Object.keys(params || {}).forEach(function (key) { searchParams.append(key, params[key]); });
        return this._request({
            url: "/post/" + id + "/comment",
            search: searchParams,
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
    Client.prototype.getUserCommentList = function (name, params) {
        var searchParams = new http_1.URLSearchParams();
        Object.keys(params || {}).forEach(function (key) { searchParams.append(key, params[key]); });
        return this._request({
            url: "/user/" + name + "/comment",
            search: searchParams,
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
    Client.prototype.getUser = function (name) {
        return this._request({
            url: "/user/" + name,
            method: http_1.RequestMethod.Get
        });
    };
    Client.prototype.getSelf = function () {
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
    Client.prototype.uploadImage = function (data) {
        var body = JSON.stringify(data);
        return this._request({
            url: '/images',
            method: http_1.RequestMethod.Post,
            headers: new http_1.Headers({
                'Content-type': 'multipart/form-data;'
            })
        }, true);
    };
    __decorate([
        Auth('idevjs_token'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], Client.prototype, "updatePost", null);
    __decorate([
        Auth('idevjs_token'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], Client.prototype, "addPost", null);
    __decorate([
        Auth('idevjs_token'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], Client.prototype, "addPostComment", null);
    __decorate([
        Auth('idevjs_token'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], Client.prototype, "getSelf", null);
    __decorate([
        Auth('idevjs_token'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], Client.prototype, "updateUserProfile", null);
    __decorate([
        Auth('idevjs_token'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], Client.prototype, "getUserSetting", null);
    __decorate([
        Auth('idevjs_token'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], Client.prototype, "updateUserSetting", null);
    __decorate([
        Auth('idevjs_token'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], Client.prototype, "uploadImage", null);
    Client = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [AuthConfig, http_1.Http])
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
