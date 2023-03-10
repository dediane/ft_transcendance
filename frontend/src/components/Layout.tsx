import { Navbar } from './Navbar'
import { BackgroundAnimation } from '../components/BackgroundAnimation';

export default function Layout({ children } : {children: any}) {
  return (
    <>
      {/* <div id='layoutDiv'> */}
      <Navbar />
      <main>{children}</main>
      {/* <main style={{flex:1, overflow: children.displayName === "Game" ? "hidden" : undefined}}>{children}</main> */}
      {/* </div> */}
    </>
  )
}