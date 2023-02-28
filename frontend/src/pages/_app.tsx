import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '@/components/Layout';
import Home from '.';
import { BackgroundAnimation } from '@/components/BackgroundAnimation';


function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <BackgroundAnimation />
      <Layout {...pageProps}>
      <Component {...pageProps} />
      </Layout>
    </div>
  );
}

export default App;
