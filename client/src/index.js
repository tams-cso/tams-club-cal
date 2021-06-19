import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { Provider } from 'react-redux';
import store from './redux/store';
import makeServer from './server';

if (process.env.NODE_ENV !== 'production') {
    makeServer();
}

console.log(process.env.NODE_ENV);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
