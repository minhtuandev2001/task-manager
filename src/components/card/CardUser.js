import React from 'react'

export default function CardUser({ data, statusFriend, handleButtonClick }) {
  return (
    <div
      className='bg-gray-100 p-1 w-full max-w-[200px] rounded-md'
    >
      <img src={data.avatar} alt="" />
      <p className='text-base font-medium'>{data.username}</p>
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
