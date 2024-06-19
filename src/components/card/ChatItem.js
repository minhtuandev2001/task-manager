import React, { useContext, useState } from 'react'
import moment from "moment"
import { IconLogout, IconWarning } from '../icons'
import imageGroup from "../../asset/images/imageGroup.png";
import { AuthContext } from "../../context/authContext";
import AlertWarning from '../alert/AlertWarning';

export default function ChatItem({ data, handleSelectedChat, handleExitsChat }) {
  const { currentUser } = useContext(AuthContext);
  const [showAlertWarningExits, setShowAlertWarningExits] = useState(false)
  return (
    <>
      <div className='flex gap-2 p-[6px] items-center cursor-pointer hover:bg-gray-100 rounded-md transition-all justify-between'>
        <div
          className='flex items-center justify-between w-full gap-2'
          onClick={() => handleSelectedChat(data)}>
          {data.isGroupChat ?
            (<img className={`object-cover h-10 rounded-full min-w-10 ${data.infoUsers?.filter((item) => item.statusOnline === true).length >= 2 ? "border-4 border-green-400" : ""}`} src={imageGroup} alt="" />)
            : (<img className={`object-cover h-10 rounded-full min-w-10 ${data.infoUser?.statusOnline ? "border-4 border-green-400" : ""}`} src={data.infoUser?.avatar} alt="" />)}
          <div className='flex-col flex-1'>
            <div className='flex items-center justify-between w-full gap-2'>
              <span className='text-sm font-medium line-clamp-1'>{data.isGroupChat ? data.chatName : (data.infoUser?.username ? data.infoUser?.username : "user exits")}</span>
              <span className='text-xs text-gray-400 line-clamp-1'>{moment(data?.latestMessage?.createdAt).fromNow()}</span>
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
          onClick={() => setShowAlertWarningExits(true)}
          className='w-5'></IconLogout>
      </div>
      <AlertWarning
        toggleShow={showAlertWarningExits}
        messages="Do you want to exits the chat room?"
        handleCancel={() => setShowAlertWarningExits(false)}
        handleContinue={() => handleExitsChat(data._id)}
      ><IconWarning className='block w-12 h-12'></IconWarning></AlertWarning>
    </>
  )
}
