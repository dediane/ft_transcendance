import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '@/components/Layout';
import Home from '.';
import { BackgroundAnimation } from '@/components/BackgroundAnimation';
import HomeGame from './home_game';
import Pong from './pong';
import { Context } from 'react';
import { ContextProviderGame } from '../game/GameContext'



function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <BackgroundAnimation />
      <Layout {...pageProps}>

      <ContextProviderGame>
        <Component {...pageProps} />
      </ContextProviderGame>

      {/* pour mettre home_game et pong dans un componement pour pouvoir partager la data (pour pas perdre mes sockets) */}
      </Layout>
    </div>
  );
}

export default App;
