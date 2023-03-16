import authenticationService from "@/services/authentication-service";
import userService from "@/services/user-service";
import { useEffect, useState } from "react";
import styles from "../styles/Profile.module.css"
import { useRouter } from "next/router";
import { LayoutGroupContext } from "framer-motion";
import _ from "lodash";

export default function Homepage() {
    return (
        <>
        <div className="">
        <Searchbar />
        <Friends />
        <Play />
        <Profil />
        </div>
        </>
    )
}

const Play = () => {
    const [user, setUser] = useState(false)

    useEffect(()=>{
        const fetch_profile = async() => {
           const result = await userService.profile()
            setUser({...result})
        }
        fetch_profile()
    }, [])
    const handlePlay = () => {
        console.log(user)
    }
    return (
    <div className="flex">
        <div className="m-4">
        <button className={styles.button}>
            Play PONG!
        </button>
        </div>
        <div className="m-4">
        <button className={styles.button}>
            Join Chat!
        </button>
        </div>
        <div className="m-4">
        <button className={styles.button}>
            See your Stats!
        </button>
        </div>
    </div>
    )
}

const Profil = () => {
    const [user, setUser] = useState({username: "", email: "", wins: 0, losses: 0})
    const router = useRouter();

    useEffect(()=>{
        const fetch_profile = async() => {

            //WHAT IF...I'm not logged in ?
           const result = await userService.profile()
            setUser({...result})
        }
        fetch_profile()
    }, [])

    const logout = () => {
        authenticationService.deleteToken()
        router.push('/login')
    }

    return (
         <div className={styles.profilecard}>
            <h3 className={styles.h1}>My profil</h3>
            <img src="https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGZhY2V8ZW58MHx8MHx8&w=1000&q=80" className={styles.profilepicture}>
            </img>
            <h4>My infos</h4>
            <hr/>
                <Asset title={'username'} value={user.username} />
                <Asset title={'email'} value={user.email} />
                <Asset title={'Wins:'} value={user.wins} />
                <Asset title={'Losses:'} value={user.losses} />
                <button onClick={() => logout()} className={styles.button}>Log out</button>
            <hr/>
        </div>
    )
}


const Asset = ({title , value} : {title: string, value :any}) => {
    return(
        <div className="p-3">
        <p className="text-xs text-gray-500 ">{title} </p>
        <p>{value}</p>
        </div>
    )
}

const Friends = () => {
        const [friend, setFriend] = useState([])
        useEffect(()=>{
            const fetch_friends = async() => {
                const result = await userService.find_friend()
                console.log(result)
                setFriend(result.friends)
            }
            fetch_friends()
        }, [])
    return(
        <div>
            <h2>My friends</h2>
            {friend.map((current :any, key :any) => {
                const {username, id} = current
                return (
                    <div key={key} className="flex justify-between flex-row">
                        <div  className={styles.listelement}>
                            {username}
                            {/* <button onClick={() => add_friend(id)} className={styles.button}> */}
                                {/* add friends
                            </button>
                            <button onClick={() => remove_friend(id)} className={styles.button}>
                                remove friends
                            </button> */}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

const Searchbar = () => {
    const [inputValue, setInputValue] = useState('');
    const [users, setUsers] = useState([]);
    const handleInputChange = _.debounce(async (value) => {
        const result = await userService.search(value)
        setUsers(result)
      console.log('Input value:', value, result);
    }, 500);
  
    const handleInput = (event: any) => {
      const value = event.target.value;
      setInputValue(value);
      handleInputChange(value);
    };
    return (
        <div className="">
            <input value={inputValue} onChange={handleInput}  
            type="text" placeholder="search your friends" className={styles.inputbox}></input>
            <Searchresult users={users}/>
        </div>
    )
}


const Searchresult = ({users} : {users :any}) => {
    const add_friend = async (id :number) => {
        await userService.add_friend(id)
    }
    const remove_friend = async (id :number) => {
        await userService.remove_friend(id)
    }

    return (
        <div>
        {users.map((current :any, key :any) => {
            const {username, id} = current
            return (
                <div key={key} className="flex justify-between flex-row">
                    <div  className={styles.listelement}>
                        {username}
                        <button onClick={() => add_friend(id)} className={styles.button}>
                            add friends
                        </button>
                        <button onClick={() => remove_friend(id)} className={styles.button}>
                            remove friends
                        </button>
                    </div>
                </div>
            )
        })}
    </div>
    )
} 