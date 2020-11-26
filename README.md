# injection-react-server
[![Build Status](https://travis-ci.org/mgechev/injection-js.svg?branch=master)](https://travis-ci.org/mgechev/injection-react-server) ![Downloads](https://img.shields.io/npm/dm/injection-react-server.svg)

一个可以在react服务端渲染项目中使用的JavaScript和TypeScript依赖注入库。它是Angular依赖注入的一部分，这意味着它具有完整，快速，可靠且经过良好测试的功能。

# How to use?

```sh
$ npm i injection-react injection-react-server injection-js
# OR
$ yarn add injection-react injection-react-server injection-js
```

> **Note:**
>
> 对于ES6`Class`语法和TypeScript，您需要[Reflect API](http://www.ecma-international.org/ecma-262/6.0/#sec-reflection)的polyfill.
> You can use:
>
> - [reflection](https://www.npmjs.com/package/@abraham/reflection) (only 3kb 🔥)
> - [reflect-metadata](https://www.npmjs.com/package/reflect-metadata)
> - [core-js (`core-js/es7/reflect`)](https://www.npmjs.com/package/core-js)
>
>同样对于TypeScript，您将需要在您的`tsconfig.json`中设置`experimentalDecorators`和`emitDecoratorMetadata`为`true`。


## TypeScript

```tsx
import 'reflect-metadata';
import React from 'react';
import { Injectable, Inject } from 'injection-js';
import { Component } from 'injection-react';
import { renderToStaticMarkup, renderToStaticNodeStream } from 'injection-react-server';
import { createServer } from 'http';

// service
@Injectable()
class Utils {
    constructor(@Inject('request') public request: any) { }
    isAndroid() {
        return /android/g.test(this.request.headers['user-agent'])
    }
}

// component
class App extends Component {
    render() {
        return (
            <div>hello world!your phone is {this.get('Utils').isAndroid() ? 'android' : 'iphone'}</div>
        );
    }
}

// entry
console.log(renderToStaticMarkup([{ provide: 'Utils', useClass: Utils }, { provide: 'request', useValue: { headers: { 'user-agent': 'android' } } }], <App />));
// http-server entry
createServer(function (req, res) {
    const stream = renderToStaticNodeStream(
        [{
            provide: 'Utils',
            useClass: Utils
        }, {
            provide: 'request',
            useValue: req
        }],
        <App />
    );
    stream.pipe(res, {
        end: true
    })
}).listen(8888);
```
or
```tsx
import 'reflect-metadata';
import React from 'react';
import { Injectable, Injector, Inject } from 'injection-js';
import { stateLessComponentWithInjector } from 'injection-react';
import { renderToStaticMarkup, renderToStaticNodeStream } from 'injection-react-server';
import { createServer } from 'http';

// service
@Injectable()
class Utils {
  constructor(@Inject('request') public request: any) {}
  isAndroid() {
    return /android/g.test(this.request.headers['user-agent'])
  }
}

// component
const App = stateLessComponentWithInjector((_, injector: Injector) => (
  <div>hello world!your phone is {injector.get('Utils').isAndroid() ? 'android': 'iphone'}</div>
));

// entry
renderToStaticMarkup([{ provide: 'Utils', useClass: Utils }, { provide: 'request', useValue: { headers: { 'user-agent': 'android' } } }], <App />);
// http-server entry
createServer(function (req, res) {
    const stream = renderToStaticNodeStream(
        [{
            provide: 'Utils',
            useClass: Utils
        }, {
            provide: 'request',
            useValue: req
        }],
        <App />
    );
    stream.pipe(res, {
        end: true
    })
}).listen(8888);
```

# API

有关完整的文档，请查看Angular DI文档：

- [Dependency Injection](https://v4.angular.io/guide/dependency-injection)
- [Dependency Injection in action](https://v4.angular.io/guide/dependency-injection-in-action)
- [Dependency Injection without Typescript](https://v2.angular.io/docs/ts/latest/cookbook/ts-to-js.html#!#dependency-injection)

# License

MIT License