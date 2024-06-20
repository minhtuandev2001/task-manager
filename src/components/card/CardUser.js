import React from 'react'
import { NavLink } from 'react-router-dom'

export default function CardUser({ data, statusFriend, handleButtonClick }) {
  return (
    <div
      className='bg-gray-100 p-1 w-full rounded-md dark:text-white dark:bg-bgDarkItem'
    >
      <div className='w-full h-[200px]'>
        <img className='w-full h-full object-cover' src={data.avatar} alt="" />
      </div>
      <NavLink to={`/profile/${data._id}`}>
        <p className='text-base font-medium line-clamp-1 cursor-pointer'>{data.username}</p>
      </NavLink>
      <div className='flex flex-col gap-2 mt-2'>
        {statusFriend === "friends" && <button
          onClick={() => {
            handleButtonClick("request-friend", data._id)
          }}
          className='bg-[#0866ff] rounded-md p-2 text-white font-medium h-9'>Add friend</button>
        }
        {statusFriend === "myfriends" && <button
          onClick={() => handleButtonClick("delete-friend", data._id)}
          className='bg-[#0866ff] rounded-md p-2 text-white font-medium h-9'>Delete</button>
        }
        {statusFriend === "request" && <button
          onClick={() => handleButtonClick("cancel-request-friend", data._id)}
          className='bg-[#0866ff] rounded-md p-2 text-white font-medium h-9'>Cancel</button>
        }
        {statusFriend === "accept" && <button
          onClick={() => handleButtonClick("accept-friend", data._id)}
          className='bg-[#0866ff] rounded-md p-2 text-white font-medium h-9'>Add</button>
        }
        {statusFriend === "accept" && <button
          onClick={() => handleButtonClick("not-accept-friend", data._id)}
          className='p-2 font-medium text-red-400 bg-gray-300 rounded-md h-9'>Cancel</button>
        }
      </div>
    </div>
  )
}
