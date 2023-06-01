import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import Home from ".";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import HomeGame from "./home_game";
import Pong from "./pong";
import { Context, useEffect, useMemo, useState } from "react";
import { ContextProviderGame } from "../game/GameContext";
import Pastille from "@/components/Pastille";
import { useRouter } from "next/router";
import authenticationService from "@/services/authentication-service";

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { pathname } = router;
  return (
    <div>
      <BackgroundAnimation />
      <ContextProviderGame>
        {pathname !== "/home_game" &&
          pathname !== "/pong" &&
          pathname !== "/pong_chat" &&
          pathname !== "/pong_extra" &&
          pathname !== "/login" &&
          pathname !== "/auth" && <Pastille />}
        {/* {shouldRenderPastille && <Pastille />} */}
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ContextProviderGame>

      {/* pour mettre home_game et pong dans un componement pour pouvoir partager la data (pour pas perdre mes sockets) */}
    </div>
  );
}

export default App;
