import Link from "next/link";
import styles from "../styles/Navbar.module.css"

export const Navbar = () => {
    return (
    
    <nav className={styles.navbar}>
    <div className="container flex flex-wrap items-center justify-between mx-auto">
    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Ft_Transcendence</span>
    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
      <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white">
        <li>
          <a href="." className={styles.link}>Home</a>
        </li>
        <li>
          <a href="pong" className={styles.link}>
            Play</a>
        </li>
        <li>
          <a href="#" className={styles.link}>
            Stats</a>
        </li>
        <li>
          <a href="#" className={styles.link}>
            Login</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
    );
}