import React from 'react'
import { IconDelete } from '../icons'
import imageGroup from "../../asset/images/imageGroup.png";

export default function ChatItem({ data, handleSelectedChat }) {
  return (
    <div onClick={() => handleSelectedChat(data)} className='flex gap-2 p-[6px] items-center cursor-pointer hover:bg-gray-100 rounded-md transition-all justify-between'>
      {data.isGroupChat ?
        (<img className='min-w-10 h-10 rounded-full object-cover' src={imageGroup} alt="" />)
        : (<img className='min-w-10 h-10 rounded-full object-cover' src={data.infoUser?.avatar} alt="" />)}
      <div className='flex-1 flex-col'>
        <div className='flex justify-between items-center gap-2 w-full'>
          <span className='text-sm font-medium line-clamp-1'>{data.isGroupChat ? data.chatName : data.infoUser?.username}</span>
          <span className='text-xs text-gray-400'>20:23</span>
        </div>
        <p className='line-clamp-1 text-sm text-gray-400 h-5'>{data?.latestMessageId ? data.latestMessage : ""}</p>
      </div>
      <IconDelete className='min-w-5'></IconDelete>
    </div>
  )
}
