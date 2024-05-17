import React, { useEffect, useState } from 'react'
import { friendActionList } from '../../constans/status'
import { motion } from "framer-motion"
import Input from '../../components/input/Input'
import axios from 'axios'
import { BASE_URL } from '../../constans/url'
import lodash from "lodash";

export default function Users() {
  const [friendAction, setFriendAction] = useState("friends");
  const [friendsList, setFriendsList] = useState([]);
  const [search, setSearch] = useState("");
  const handleFriendsAction = (id) => {
    setFriendAction(id)
  }
  useEffect(() => {
    const getUser = () => {
      axios.get(`${BASE_URL}/user?keyword=${search}&limit=20`)
        .then((res) => {
          console.log("check ", res.data?.data)
          setFriendsList(res.data?.data || [])
        }).catch((err) => {
          console.log("check ", err)
        })
    }
    getUser()
  }, [search])
  const handleChangeInput = lodash.debounce((e) => {
    setSearch(e.target.value)
  }, 500)
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
      <div className='grid grid-cols-7 mt-3 gap-3'>
        {friendsList.length > 0 && friendsList.map((item, index) => {
          return (
            <div key={item._id}
              className='bg-gray-50 p-1 w-full max-w-[200px] rounded-md'
            >
              <img src={item.avatar} alt="" />
              <p className='text-base font-medium'>{item.username}</p>
              <div className='flex flex-col gap-2 mt-2'>
                <button className='bg-[#0866ff] rounded-md p-2 text-white font-medium h-9'>add friend</button>
                <button className='bg-[#e4e6eb] rounded-md p-2 text-black font-medium h-9'>Restricted</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
