import {Injectable} from '@angular/core';

import {Http, Response, Headers} from '@angular/http';

import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {APIS} from './api.constants';
import {UiCookie, UiSnackbar} from 'ng-smn-ui';

@Injectable()
export class ApiService {
    constructor(private http: Http) {
    }

    private extractData(res: Response) {
        let body;
        try {
            body = res.json();
        } catch (e) {
            console.error(res, e);
        }
        return body || {};
    }

    private handleError(error: Response | any) {
        let body: any;
        if (error instanceof Response) {
            body = error.json() || '';

            switch (error.status) {
                case 0:
                    UiSnackbar.show({
                        text: 'Um de nossos serviços está fora do ar e não foi possível processar sua requisição. Tente novamente mais' +
                        ' tarde.',
                        actionText: 'OK',
                        duration: Infinity,
                        action: close => close(),
                    });
                    break;
                case 400:
                    UiSnackbar.show({
                        text: 'Requisição inválida. Verifique as informações fornecidas.',
                        actionText: 'OK',
                        duration: Infinity,
                        action: close => close()
                    });
                    break;
                case 500:
                    UiSnackbar.show({
                        text: 'Ocorreu um erro interno. Já fomos informados do erro. Tente novamente mais tarde.',
                        actionText: 'OK',
                        duration: Infinity,
                        action: close => close()
                    });
            }
        } else {
            console.error(error);
            UiSnackbar.show({
                text: 'Ocorreu um erro desconhecido. Tente novamente mais tarde.',
                actionText: 'OK',
                duration: Infinity,
                action: close => close()
            });
        }
        return Observable.throw(body);
    }

    private _call(method: any): Function {
        return (data: {}, setHeaders?: {}) => {
            let url = method.url;

            const headers = new Headers();
            if (!method.isPublic) {
                headers.append('Authentication', UiCookie.get('RNB'));
            }
            if (setHeaders) {
                Object.keys(setHeaders).forEach((key) => {
                    headers.append(key, setHeaders[key]);
                });
            }

            let secondParam = data;
            let thirdParam = {
                headers
            };

            if (data) {
                const urlParams = jsonToParams(url, data);
                url = urlParams.url;
                data = urlParams.data;
            }

            if (method.method === 'get' || method.method === 'delete') {
                if (data) {
                    url = url + jsonToQueryString(data);
                }
                secondParam = thirdParam;
                thirdParam = undefined;
            }

            return this.http[method.method](url, secondParam, thirdParam)
                .map(this.extractData)
                .catch(this.handleError);
        }
    }

    public prep(functionality: string, method: string) {
        return {
            call: this._call(APIS[functionality][method])
        }
    }
}

function jsonToQueryString(json) {
    const params = Object.keys(json).map(function (key) {
        return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key]);
    });
    return (params.length ? '?' : '') + params.join('&');
}

function jsonToParams(url, data) {
    const dataClone = Object.assign({}, data);
    Object.keys(dataClone).forEach((key) => {
        if (url.includes(':' + key)) {
            url = url.replace(':' + key, dataClone[key]);
            delete dataClone[key];
        }
    });

    return {
        url: url,
        data: dataClone
    };
}
