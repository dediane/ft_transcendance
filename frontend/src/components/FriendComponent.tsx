import React, { useState, useEffect } from "react";
import friendService from "@/services/friend-service";
import userService from "@/services/user-service";
import styles from "@/styles/Profile.module.css";
import _, { remove } from "lodash";

export const Friends = () => {
  //FRIEND
  const [friend, setFriend] = useState([]);
  useEffect(() => {
    const fetch_friends = async () => {
      const result = await userService.find_friend();
      setFriend(result.friends);
    };
    fetch_friends();
  }, []);

  //SETFRIEND REFRESH
  const refresh = async (id: number) => {
    await remove_friend(id);
    setFriend(friend.filter((obj: any) => obj.id !== id));
  };
  return (
    <div className="">
      <h2 className="text-pink-600 text-lg">My friends</h2>
      {friend.map((current: any, key: any) => {
        const { username, id } = current;
        return (
          <div key={key} className="">
            <div className={styles.listelement}>
              {username}
              {/* <button onClick={() => add_friend(id)} className={styles.button}>
                            add friends
                        </button> */}
              <button
                onClick={() => refresh(id)}
                className={styles.littlebutton}
              >
                remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Searchbar = () => {
  const [inputValue, setInputValue] = useState("");
  const [users, setUsers] = useState([]);

  //FRIEND
  const [friend, setFriend] = useState([]);
  useEffect(() => {
    const find = async () => {
      const re = await userService.find_friend();
      setFriend(re.friends);
    };
    find();
  }, []);

  //SEARCH
  const handleInputChange = _.debounce(async (value) => {
    const result = await userService.search(value);
    const updatedUserList = result.map((user: any) => {
      const tmp = friend.find((curr: any) => curr.id === user.id);
      if (tmp) {
        user.isFriend = true;
      }
      return user;
    });
    setUsers(updatedUserList);
    // setUsers(result)
  }, 500);

  const handleInput = (event: any) => {
    const value = event.target.value;
    setInputValue(value);
    handleInputChange(value);
  };
  return (
    <div className="my-4">
      <input
        value={inputValue}
        onChange={handleInput}
        type="text"
        placeholder="search your friends"
        className={styles.inputbox}
      ></input>
      <Searchresult users={users} setUsers={setUsers} />
    </div>
  );
};

const add_friend = async (id: number) => {
  await userService.add_friend(id);
};

const remove_friend = async (id: number) => {
  await userService.remove_friend(id);
};

const Searchresult = ({ users, setUsers }: { users: any; setUsers: any }) => {
  const refresh_users = async (action: string, id: number) => {
    action == "add" ? await add_friend(id) : await remove_friend(id);

    const index = users.map((user: any) => {
      if (user.id === id) user.isFriend = !user.isFriend;
      return user;
    });
    setUsers(index);
  };
  return (
    <div>
      {users.map((current: any, key: any) => {
        const { username, id, isFriend } = current;
        return (
          <div key={key} className="">
            <div className={styles.listelement}>
              {username}
              {!isFriend && (
                <button
                  onClick={() => refresh_users("add", id)}
                  className={styles.littlebuttongreen}
                >
                  add friends
                </button>
              )}
              {isFriend && (
                <button
                  onClick={() => refresh_users("remove", id)}
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
  );
};
