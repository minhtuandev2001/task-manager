import React, { useContext } from 'react'
import { IconLogout } from '../icons'
import imageGroup from "../../asset/images/imageGroup.png";
import { AuthContext } from "../../context/authContext";

export default function ChatItem({ data, handleSelectedChat, handleExitsChat }) {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className='flex gap-2 p-[6px] items-center cursor-pointer hover:bg-gray-100 rounded-md transition-all justify-between'>
      <div
        className='flex items-center justify-between w-full gap-2'
        onClick={() => handleSelectedChat(data)}>
        {data.isGroupChat ?
          (<img className={`object-cover h-10 rounded-full min-w-10 ${data.infoUsers?.some((item) => item.statusOnline === true) ? "border-4 border-green-400" : ""}`} src={imageGroup} alt="" />)
          : (<img className={`object-cover h-10 rounded-full min-w-10 ${data.infoUser?.statusOnline ? "border-4 border-green-400" : ""}`} src={data.infoUser?.avatar} alt="" />)}
        <div className='flex-col flex-1'>
          <div className='flex items-center justify-between w-full gap-2'>
            <span className='text-sm font-medium line-clamp-1'>{data.isGroupChat ? data.chatName : data.infoUser?.username}</span>
            <span className='text-xs text-gray-400'>20:23</span>
          </div>
          <p className={`line-clamp-1 text-sm h-5 font-semibold ${data.latestMessage ?
            data?.latestMessage?.usersRead.includes(currentUser.id) ? "text-gray-400" : "text-black"
            : ""
            }`}>{data?.latestMessageId ?
              (data.latestMessage ?
                (data.latestMessage?.infoSender.username + ' : ' + data?.latestMessage?.content)
                : "")
              : ""}</p>
        </div>
      </div>
      <IconLogout
        onClick={() => handleExitsChat(data._id)}
        className='w-5'></IconLogout>
    </div>
  )
}
