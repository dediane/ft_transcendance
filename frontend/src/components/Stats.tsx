import authenticationService from "@/services/authentication-service";
import userService from "@/services/user-service";
import { useEffect, useState } from "react";
import styles from "../styles/Profile.module.css"
import { useRouter } from "next/router";
import { Activate2fa } from "@/components/TwoFactor";
import { AvatarUploader } from "@/components/Avatar";

export const Asset = ({title , value} : {title: string, value :any}) => {
    return(
        <div className="p-3">
        <p className="text-lg text-zinc-500 ">{title} </p>
        <p className="font-normal text-base">{value}</p>
        </div>
    )
}

export const Asset2 = ({title , value} : {title: string, value :any}) => {
    return(
        <div className={styles.minicard}>
            <div className="p-3">
                <p className="text-4xl">🚀</p>
                <p className="text-sm text-gray-800 ">{title} </p>
                <p className="text-3xl">{value}</p>
            </div>
        </div>
    )
}

export const Asset3 = ({title , value} : {title: string, value :any}) => {
    return(
        <div className={styles.minicard2}>
            <div className="p-3">
            <p className="text-4xl">😭</p>
                <p className="text-sm text-gray-800 ">{title} </p>
                <p className="text-3xl">{value}</p>
            </div>
        </div>
    )
}

export const Asset4 = ({title , value} : {title: string, value :any}) => {
    return(
        <div className={styles.minicard3}>
            <div className="p-3">
            <p className="text-4xl">🕹️</p>
                <p className="text-sm text-gray-800 ">{title} </p>
                <p className="text-3xl">{value}</p>
            </div>
        </div>
    )
}

export const Asset5 = ({title , value} : {title: string, value :any}) => {
    return(
        <div className={styles.minicard3}>
            <div className="p-3">
            <p className="text-4xl">🏆</p>
                <p className="text-sm text-gray-800 ">{title} </p>
                <p className="text-3xl">{value}</p>
            </div>
        </div>
    )
}

export const Asset6 = ({title , value} : {title: string, value :any}) => {
    return(
        <div className={styles.minicard3}>
            <div className="p-3">
            <p className="text-4xl">🏆</p>
                <p className="text-sm text-gray-800 ">{title} </p>
                <p className="text-3xl">{value} %</p>
            </div>
        </div>
    )
}

// const StackedBarChart = ({ percentage } :any) => {
//     const remainingPercentage = 100 - percentage;
  
//     return (
//       <div>
//         <div
//           style={{
//             width: `${percentage}%`,
//             backgroundColor: 'blue',
//             height: '50px',
//             margin: '2px 0',
//           }}
//         ></div>
//         <div
//           style={{
//             width: `${remainingPercentage}%`,
//             backgroundColor: 'lightgray',
//             height: '50px',
//             margin: '2px 0',
//           }}
//         ></div>
//       </div>
//     );
//   };
  
//   export default StackedBarChart;

export const Stats = () => {
    const [user, setUser] = useState({username: "", email: "", wins: 0, losses: 0, is2fa: false, avatar: ""})
    const router = useRouter();

    useEffect(()=>{
        const fetch_profile = async() => {

            //WHAT IF...I'm not logged in ?
           const result = await userService.profile()
            setUser({...result})
        }
        // if(!authenticationService.isAuthentificated()) 
        //     router.push('/login')
        fetch_profile()
    }, [router])
    return (
        <>
         <div>
            <h4 className={styles.h1}>My Stats</h4>
            <div className={styles.stats}>
                <div className={styles.row}>
                    <Asset4 title={'Games'} value={user.wins + user.losses} />
                    <Asset2 title={'Wins'} value={user.wins} />
                    <Asset3 title={'Losses'} value={user.losses} />
                </div>
                {/* <StackedBarChart percentage={user.wins + user.losses === 0 ? 0 : Math.round((user.wins / (user.wins + user.losses)) * 100)} /> */}
                <Asset5 title={'Points'} value={(user.wins * 50) + (user.losses * 10)}/>
                <Asset6 title={'Winrate'} value={user.wins + user.losses === 0 ? 0 : Math.round((user.wins / (user.wins + user.losses)) * 100)} />
            </div>
        </div>
        </>
    )
}