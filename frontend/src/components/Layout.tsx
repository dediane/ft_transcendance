import { Navbar } from './Navbar'
import { useRouter } from 'next/router';

export default function Layout({ children } : {children: any}) {

  const router = useRouter();
  const { pathname } = router;

  return (
    <>
      {/* <div id='layoutDiv'> */}
      {/* {pathname !== '/login' && <Navbar />} */}
      <Navbar/>
      <main>{children}</main>
      {/* <main style={{flex:1, overflow: children.displayName === "Game" ? "hidden" : undefined}}>{children}</main> */}
      {/* </div> */}
    </>
  )
}