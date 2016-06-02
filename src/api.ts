import {provide, Provider, Injectable} from '@angular/core'
import {Http, URLSearchParams, Headers, Request, RequestMethod, RequestOptions, RequestOptionsArgs, Response, ResponseOptions, ResponseOptionsArgs, ResponseType} from '@angular/http'
import 'rxjs/add/operator/map'
import {Observable} from 'rxjs/Observable'

interface AuthConfigInterface {
    baseUrl: string,
    version: string,
    tokenName: string,
    headerName: string,
    headerPrefix: string
}

@Injectable()
export class AuthConfig {
    baseUrl: string
    version: string
    tokenName: string
    headerName: string
    headerPrefix: string
    constructor(options?: any) {
        this.baseUrl = options.baseUrl || 'http://api.idevjs.com'
        this.version = options.version || 'v1'
        this.tokenName = options.tokenName || 'idevjs_token'
        this.headerName = options.headerName || 'Authorization'
        this.headerPrefix = (options.tokenPrefix || 'Bearer') + ' '
    }

    getConfig() {
        return {
            baseUrl: this.baseUrl,
            version: this.version,
            tokenName: this.tokenName,
            headerName: this.headerName,
            headerPrefix: this.headerPrefix
        }
    }
}

@Injectable()
export class Client {
    public API_ENDPOINT: string
    private _config: AuthConfigInterface
    private defaultOptions: RequestOptions

    constructor(options: AuthConfig, public http: Http) {
        let headers = new Headers({
            'Content-type': 'application/json;charset=utf-8;'
        })
        this.defaultOptions = new RequestOptions({
            headers: headers
        })
        this._config = options.getConfig()
        this.API_ENDPOINT = `${this._config.baseUrl}/${this._config.version}`
    }

    _request(options: RequestOptionsArgs, auth?: boolean) {
        if (auth) {
            if (localStorage.getItem(this._config.tokenName)) {
                this.defaultOptions.headers.set('Authorization', 'Bearer ' + localStorage.getItem(this._config.tokenName))
            } else {

            }
        }
        options.url = `${this.API_ENDPOINT}${options.url}`
        return this.http.request(new Request(this.defaultOptions.merge(options)))
            .map(res => res.json())
    }

    // post
    getPostList(params) {
        let searchParams = new URLSearchParams()
        Object.keys(params || {}).forEach(key => { searchParams.append(key, params[key]) })

        return this._request({
            url: '/post',
            search: searchParams,
            method: RequestMethod.Get
        })
    }
    getNodePostList(node: string, params?: Object) {
        let searchParams = new URLSearchParams()
        Object.keys(params || {}).forEach(key => { searchParams.append(key, params[key]) })

        return this._request({
            url: `/node/${node}/post`,
            search: searchParams,
            method: RequestMethod.Get
        })
    }
    getUserPostList(name: string, params?: Object) {
        let searchParams = new URLSearchParams()
        Object.keys(params || {}).forEach(key => { searchParams.append(key, params[key]) })

        return this._request({
            url: `/user/${name}/post`,
            search: searchParams,
            method: RequestMethod.Get
        })
    }
    getPost(id: string, params?: Object) {
        let searchParams = new URLSearchParams()
        Object.keys(params || {}).forEach(key => { searchParams.append(key, params[key]) })

        return this._request({
            url: `/post/${id}`,
            search: searchParams,
            method: RequestMethod.Get
        })
    }
    @Auth('idevjs_token')
    updatePost(id, data) {
        let body = JSON.stringify(data)
        return this._request({
            url: `/post/${id}`,
            body: body,
            method: RequestMethod.Post
        }, true)
    }
    @Auth('idevjs_token')
    addPost(data) {
        let body = JSON.stringify(data)
        return this._request({
            url: `/post`,
            body: body,
            method: RequestMethod.Post
        }, true)
    }

    // comment
    getPostCommentList(id: string, params?: Object) {
        let searchParams = new URLSearchParams()
        Object.keys(params || {}).forEach(key => { searchParams.append(key, params[key]) })

        return this._request({
            url: `/post/${id}/comment`,
            search: searchParams,
            method: RequestMethod.Get
        })
    }
    @Auth('idevjs_token')
    addPostComment(id, content) {
        let body = JSON.stringify({ content: content })
        return this._request({
            url: `/post/${id}/comment`,
            body: body,
            method: RequestMethod.Post
        }, true)
    }
    getUserCommentList(name, params?: Object) {
        let searchParams = new URLSearchParams()
        Object.keys(params || {}).forEach(key => { searchParams.append(key, params[key]) })

        return this._request({
            url: `/user/${name}/comment`,
            search: searchParams,
            method: RequestMethod.Get
        })
    }

    // node
    getNodeList() {
        return this._request({
            url: `/node`,
            method: RequestMethod.Get
        })
    }
    getNode(name) {
        return this._request({
            url: `/node/${name}`,
            method: RequestMethod.Get
        })
    }

    // user 
    getUser(name: string) {
        return this._request({
            url: `/user/${name}`,
            method: RequestMethod.Get
        })
    }
    @Auth('idevjs_token')
    getSelf() {
        return this._request({
            url: '/me',
            method: RequestMethod.Get
        }, true)
    }

    @Auth('idevjs_token')
    updateUserProfile(data) {
        let body = JSON.stringify(data)
        return this._request({
            url: '/me',
            method: RequestMethod.Post
        }, true)
    }

    @Auth('idevjs_token')
    getUserSetting() {
        return this._request({
            url: '/setting',
            method: RequestMethod.Get
        }, true)
    }

    @Auth('idevjs_token')
    updateUserSetting(data) {
        let body = JSON.stringify(data)
        return this._request({
            url: '/setting',
            method: RequestMethod.Post
        }, true)
    }
    @Auth('idevjs_token')
    uploadImage(data) {
        let body = JSON.stringify(data)
        return this._request({
            url: '/images',
            method: RequestMethod.Post,
            headers: new Headers({
                'Content-type': 'multipart/form-data;'
            })
        }, true)
    }
}

export function unAuthorizedResponse() {
    return new Observable((observer => {
        observer.onError(new Response(new ResponseOptions({
            status: 403,
            statusText: 'unAuthorized',
            type: ResponseType.Error
        })))
    }))
}

export function Auth(tokenName) {
    return function (target: Client, propertyKey: string, descriptor: any) {
        let originalMethod = descriptor.value

        if (!localStorage.getItem(tokenName)) {
            descriptor.value = () => {
                return new Observable((observer => {
                    observer.onError(new Response(new ResponseOptions({
                        status: 403,
                        statusText: 'unAuthorized',
                        type: ResponseType.Error
                    })))
                }))
            }
        }

        // descriptor.value = unAuthorizedResponse
        return descriptor
    }
}
