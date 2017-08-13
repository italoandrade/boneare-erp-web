import {environment} from '../../../environments/environment';

export const APIS = {
    user: {
        login: {
            method: 'post',
            url: `${environment.host}user/login`,
            isPublic: true
        },
        relogin: {
            method: 'get',
            url: `${environment.host}user/relogin`
        },
        recover: {
            method: 'post',
            url: `${environment.host}user/recover`,
            isPublic: true
        },
        recoverConfirm: {
            method: 'post',
            url: `${environment.host}user/recover/confirm`,
            isPublic: true
        }
    },
    client: {
        select: {
            method: 'get',
            url: `${environment.host}client`
        },
        selectById: {
            method: 'get',
            url: `${environment.host}client/:id`
        },
        insert: {
            method: 'post',
            url: `${environment.host}client`
        },
        update: {
            method: 'put',
            url: `${environment.host}client/:id`
        },
        delete: {
            method: 'delete',
            url: `${environment.host}client/:id`
        }
    },
    typeClient: {
        select: {
            method: 'get',
            url: `${environment.host}type-client`,
            isPublic: true
        }
    },
    typeRecurring: {
        select: {
            method: 'get',
            url: `${environment.host}type-recurring`,
            isPublic: true
        }
    },
    regions: {
        select: {
            method: 'get',
            url: `${environment.host}region`,
            isPublic: true
        }
    }
};
