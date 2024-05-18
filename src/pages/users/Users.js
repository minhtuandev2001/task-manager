import React, { useContext, useEffect, useState } from 'react'
import { friendActionList } from '../../constans/status'
import { motion } from "framer-motion"
import Input from '../../components/input/Input'
import axios from 'axios'
import { BASE_URL } from '../../constans/url'
import lodash from "lodash";
import { AuthContext } from "../../context/authContext"
import CardUser from '../../components/card/CardUser'
import { toast } from 'react-toastify'
import { useSocket } from '../../context/socketContext'

export default function Users() {
  const socket = useSocket()
  const { currentUser } = useContext(AuthContext)
  const [friendAction, setFriendAction] = useState("friends");
  const [friendsList, setFriendsList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const getUser = () => {
      setLoading(true)
      axios.get(`${BASE_URL}/users?keyword=${search}&statusFriend=${friendAction}&limit=20`, {
        headers: {
          "Authorization": `Bearer ${currentUser.token}`
        }
      })
        .then((res) => {
          console.log("check ", res.data?.data)
          setFriendsList(res.data?.data || [])
          setLoading(false)
        }).catch((err) => {
          setLoading(false)
          console.log("check ", err)
        })
    }
    getUser()
  }, [search, friendAction, currentUser.token])

  const handleFriendsAction = (id) => {
    setFriendAction(prev => id)
  }

  const handleChangeInput = lodash.debounce((e) => {
    setSearch(e.target.value)
  }, 500)
  const handleClick = (pathAction, id) => {
    axios.get(`${BASE_URL}/users/${pathAction}/${id}`, {
      headers: {
        "Authorization": `Bearer ${currentUser.token}`
      }
    }).then((res) => {
      console.log("check ", pathAction)
      setFriendsList(prevUsers => prevUsers.filter((user) => user._id !== id))
      toast.success(res.data.messages)
    }).catch((err) => {
      toast.error(err.data.messages)
      console.log("check ", err)
      toast.error(err.data.messages)
    })
  }
  useEffect(() => {
    socket.on("CLIENT_ADD_FRIEND", (data) => {
      console.log("check ", friendAction)
      if (friendAction === "accept") {
        setFriendsList(preveFriend => [data.infoUser, ...preveFriend])
      } else {
        setFriendsList(preveFriend => preveFriend.filter((friend) => friend._id !== data.infoUser._id))
      }
    })
    socket.on("CLIENT_ACCEPT_FRIEND", (data) => {
      if (friendAction === "myfriends") {
        setFriendsList(preveFriend => [data.infoUser, ...preveFriend])
      } else {
        setFriendsList(preveFriend => preveFriend.filter((friend) => friend._id !== data.infoUser._id))
      }
    })
    return () => {
    }
  }, [friendAction, socket])
  return (
    <div className='bg-white rounded-md pt-6 px-4 min-h-[calc(100vh-56px-24px)]'>
      <div className="flex items-center justify-between">
        <div className='flex gap-8'>
          {friendActionList.map((item) => {
            return (
              <div key={item.id}
                className='cursor-pointer select-none'
                onClick={() => handleFriendsAction(item.id)}
              >
                <span className={`mb-2 text-base font-medium ${item.id === friendAction ? "text-black" : "text-[#717279]"}`}>{item.title}</span>
                {item.id === friendAction &&
                  <motion.div
                    layoutId='friendsAction'
                    transition={{ duration: 0.2 }}
                    className='w-full h-[2px] bg-black'></motion.div>}
              </div>
            )
          })}
        </div>
        <Input
          onChange={handleChangeInput}
          placeholder="search..."
          className="border border-graycustom p-2 rounded-md h-10 w-full max-w-[250px]"
        ></Input>
      </div>
      {/* danh sach user */}
      {loading ? (
        <div className='w-5 h-5 border-4 border-[#0866ff] border-r-4 border-r-transparent rounded-full animate-spin'></div>
      )
        : (
          <div className='grid grid-cols-7 gap-3 mt-3'>
            {friendsList.length > 0 && friendsList.map((item, index) => {
              return (
                <CardUser
                  key={item._id}
                  data={item}
                  statusFriend={friendAction}
                  // handleViewProfile={}
                  handleButtonClick={handleClick}
                ></CardUser>
              )
            })}
          </div>
        )}
    </div>
  )
}
