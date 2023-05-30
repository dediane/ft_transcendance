import { Navbar } from './Navbar'
import Pastille from './Pastille'

export default function Layout({ children } : {children: any}) {
  return (
    <>
      {/* <div id='layoutDiv'> */}
      <Navbar />
      {/* <Pastille /> */}
      <main>{children}</main>
      {/* <main style={{flex:1, overflow: children.displayName === "Game" ? "hidden" : undefined}}>{children}</main> */}
      {/* </div> */}
    </>
  )
}