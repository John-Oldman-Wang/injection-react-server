import React from 'react';
import { Provider } from 'injection-react';
import { renderToNodeStream, renderToStaticNodeStream, renderToStaticMarkup, renderToString } from 'react-dom/server';
import { Provider as InjectorProvider, ReflectiveInjector } from 'injection-js';

const injectionFactory = <T>(method: (ele: React.ReactElement) => T) => (providers: InjectorProvider[], element: React.ReactElement): T => {
    const rootInjector = ReflectiveInjector.resolveAndCreate(providers);
    return method(
        React.createElement(
            Provider,
            {
                value: rootInjector
            },
            element
        )
    );
};

export const injectionRenderToString = injectionFactory(renderToString);
export const injectionRenderToStaticMarkup = injectionFactory(renderToStaticMarkup);
export const injectionRenderToNodeStream = injectionFactory(renderToNodeStream);
export const injectionRenderToStaticNodeStream = injectionFactory(renderToStaticNodeStream);
