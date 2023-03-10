import { Navbar } from './Navbar'

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