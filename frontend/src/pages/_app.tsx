import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import{ ChakraProvider,extendTheme } from '@chakra-ui/react'

const colors = {
  bands : {
    900: "#f88922",
    800: "#c4f8f9",
    700: "#750733",
  } 
}

const theme = extendTheme({ colors })

export default function App({ Component, pageProps }: AppProps) {
  return <ChakraProvider theme={theme}>
   <Component {...pageProps} />
  </ChakraProvider>
}
