import '@/styles/globals.css';
import type {AppProps} from 'next/app';
import {BasketProvider} from '@/context/Basket';

export default function App({Component, pageProps}: AppProps) {
    return <BasketProvider><Component {...pageProps} /></BasketProvider>;
}
