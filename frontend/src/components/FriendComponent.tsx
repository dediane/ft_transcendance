import React, { useState, useEffect } from "react";
import userService from "@/services/user-service";
import styles from "@/styles/Profile.module.css";
import _, { remove } from "lodash";
import Link from "next/link";

export const Friends = () => {
  const [inputValue, setInputValue] = useState("");
  const [users, setUsers] = useState<any>([]);
  const [friends, setFriends] = useState<any>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const result = await userService.find_friend();
      setFriends(result.friends);
    };
    fetchFriends();
  }, []);

  const handleInputChange = _.debounce(async (value) => {
    const result = await userService.search(value);
    const updatedUserList = result.map((user: any) => {
      const tmp = friends.find((curr: any) => curr.id === user.id);
      if (tmp) {
        user.isFriend = true;
      }
      return user;
    });
    setUsers(updatedUserList);
  }, 500);

  const handleInput = (event: any) => {
    const value = event.target.value;
    setInputValue(value);
    handleInputChange(value);
  };

  const addFriend = async (id: number) => {
    const friend = await userService.add_friend(id);
    const updatedFriends = [...friends, friend];
    setFriends(updatedFriends);
  
    // Update the users state
    const updatedUsers = users.map((user : {id :any}) => {
      if (user.id === id) {
        return { ...user, isFriend: true };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const removeFriend = async (id: number) => {
    await userService.remove_friend(id);
    const updatedFriends = friends.filter((obj: any) => obj.id !== id);
    setFriends(updatedFriends);
  
    // Update the users state
    const updatedUsers = users.map((user : {id :any}) => {
      if (user.id === id) {
        return { ...user, isFriend: false };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  return (
    <div>
      {/* Friends List */}
      <h2 className={styles.h1}>My friends</h2>
      {friends && friends.length > 0 ? friends.map((current: any, key: any) => {
        const { username, id } = current;
        // console.log("FRIEND CURRENT", current)
        return (
          <div key={key} className="">
            <div className={styles.listelement}>
              <Link href={`/public?username=${username}`} className="hover:underline hover:font-medium hover:text-violet-600">
                  {username}
              </Link>
              <button
                onClick={() => removeFriend(id)}
                className={styles.littlebutton}
              >
                remove
              </button>
            </div>
          </div>
        );
      }) : <div>You don&apos;t have friends yet...</div>}

      {/* Search Bar */}
      <div className="my-4">
        <input
          value={inputValue}
          onChange={handleInput}
          type="text"
          placeholder="search your friends"
          className={styles.inputbox}
        ></input>
        {/* Search Results */}
        <div>
          {users.map((current: any, key: any) => {
            const { username, id, isFriend } = current;
            return (
              <div key={key} className="">
                <div className={styles.listelement}>
                  <Link href={`/public?username=${username}`} className="hover:underline hover:font-medium hover:text-violet-600">
                  {username}
                  </Link>
                  {!isFriend && (
                    <button
                      onClick={() => addFriend(id)}
                      className={styles.littlebuttongreen}
                    >
                      add friends
                    </button>
                  )}
                  {isFriend && (
                    <button
                      onClick={() => removeFriend(id)}
                      className={styles.littlebutton}
                    >
                      remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};