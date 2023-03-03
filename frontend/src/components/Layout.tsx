import { Navbar } from './Navbar'
import { BackgroundAnimation } from '../components/BackgroundAnimation';

export default function Layout({ children } : {children: any}) {
  return (
    <>

      <Navbar />
      <main>{children}</main>
    </>
  )
}