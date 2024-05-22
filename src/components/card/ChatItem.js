import React, { useContext } from 'react'
import { IconDelete } from '../icons'
import imageGroup from "../../asset/images/imageGroup.png";
import { AuthContext } from "../../context/authContext";

export default function ChatItem({ data, handleSelectedChat }) {
  const { currentUser } = useContext(AuthContext);
  return (
    <div onClick={() => handleSelectedChat(data)} className='flex gap-2 p-[6px] items-center cursor-pointer hover:bg-gray-100 rounded-md transition-all justify-between'>
      {data.isGroupChat ?
        (<img className='object-cover h-10 rounded-full min-w-10' src={imageGroup} alt="" />)
        : (<img className='object-cover h-10 rounded-full min-w-10' src={data.infoUser?.avatar} alt="" />)}
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
      <IconDelete className='min-w-5'></IconDelete>
    </div>
  )
}
