import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { ParsedUrlQueryInput, stringify } from "querystring";

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; // include min, not include max
}

function appendSearch(url: string, parameters: ParsedUrlQueryInput) {
    if (!parameters || Object.keys(parameters).length <= 0) {
        return url;
    }
    const joiner = url.indexOf('?') >= 0 ? '&' : '?';
    return `${url}${joiner}${stringify(parameters)}`;
}

interface ClientOptions {
    clientId: string;
    secretKey: string;
    endPoint: string;
    tokenExpireSeconds?: number;
}

const defaultTokenExpireSeconds = 180;

function createToken(clientId: string, secretKey: string, tokenExpireSeconds?: number) {
    const random = getRandomInt(1000000000, 10000000000);
    return jwt.sign({ clientId, rnd: random }, secretKey, {
        expiresIn: tokenExpireSeconds ?? defaultTokenExpireSeconds,
    });
}

class Client {
    constructor(private readonly options: ClientOptions) {}

    public async call(
        path: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parameters: any = {},
        method: 'POST' | 'GET' = 'POST',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        options: any = {},
        isRawOutput = false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
        const { endPoint, clientId, secretKey, tokenExpireSeconds } = this.options;
        const url = `${endPoint}${path}`;
        const token = createToken(clientId, secretKey, tokenExpireSeconds);
        const headers = {
            Authorization: token,
            'Content-Type': 'application/json',
        };

        let response;
        if (method === 'GET') {
            response = await fetch(appendSearch(url, parameters), { ...options, headers });
        } else {
            response = await fetch(url, { method: 'POST', ...options, headers, body: JSON.stringify(parameters) });
        }

        if (isRawOutput) {
            return response.text();
        }
        return response.json();
    }
}

export { Client, ClientOptions };