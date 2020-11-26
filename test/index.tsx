import 'reflect-metadata';
import React from 'react';
import { Inject } from 'injection-js';
import { Component } from 'injection-react';
import { createServer } from 'http';
import { renderToStaticMarkup, renderToStaticNodeStream } from '../src/index';

class Utils {
    constructor(@Inject('request') public req: any) {}
    isAndroid() {
        return /android/g.test(this.req.headers['user-agent']);
    }
}

class App extends Component {
    render() {
        return <div>{this.get('Utils').isAndroid() ? 'android' : 'ios'}</div>;
    }
}

console.log(
    renderToStaticMarkup(
        [
            {
                provide: 'Utils',
                useClass: Utils
            },
            {
                provide: 'request',
                useValue: { headers: { 'user-agent': 'android' } }
            }
        ],
        <App />
    )
);

createServer(function (req, res) {
    const stream = renderToStaticNodeStream(
        [
            {
                provide: 'Utils',
                useClass: Utils
            },
            {
                provide: 'request',
                useValue: req
            }
        ],
        <App />
    );
    stream.pipe(res, {
        end: true
    });
}).listen(8888);
