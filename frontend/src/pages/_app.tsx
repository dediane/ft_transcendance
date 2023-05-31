import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '@/components/Layout';
import Home from '.';
import { BackgroundAnimation } from '@/components/BackgroundAnimation';
import HomeGame from './home_game';
import Pong from './pong';
import { Context } from 'react';
import { ContextProviderGame } from '../game/GameContext'
import Pastille from '@/components/Pastille';



function App({ Component, pageProps }: AppProps) {

  const excludedPages = ['home_game', 'pong', 'pong_extra', 'pong_chat'];

  const shouldRenderPastille = !excludedPages.includes(Component.displayName || Component.name);
  return (
    <div>
      <BackgroundAnimation />
      <ContextProviderGame>
      {shouldRenderPastille && <Pastille />}
      <Layout {...pageProps}>
          <Component {...pageProps} />
      </Layout>
      </ContextProviderGame>

      {/* pour mettre home_game et pong dans un componement pour pouvoir partager la data (pour pas perdre mes sockets) */}
    </div>
  );
  
}

export default App;
