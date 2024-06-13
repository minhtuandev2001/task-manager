import React, { useContext, useState } from 'react'
import banner from "../../asset/images/banner.png"
import { AuthContext } from "../../context/authContext";
export default function Profile() {
  const { currentUser } = useContext(AuthContext);
  const [userName, setUserName] = useState(currentUser?.name || "")
  const [phone, setPhone] = useState(currentUser?.phone || "")
  const [email, setEmail] = useState(currentUser?.email || "")
  const [address, setAddress] = useState(currentUser?.address || "")
  const [isUpdate, setIsUpdate] = useState(false);
  const toggleUpdate = () => {
    setIsUpdate(!isUpdate);
  }
  const handleUpdate = () => {
    setIsUpdate(!isUpdate);
  }
  const handleCancel = () => {
    setIsUpdate(!isUpdate);
  }
  return (
    <div className='bg-white rounded-md min-h-[calc(100vh-56px-24px)]'>
      <div className='w-full h-[470px] rounded-md overflow-hidden relative'>
        <img className='w-full h-full object-cover' src={banner} alt="" />
        <div className=' absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]'>
          <div className='w-[150px] h-[150px] rounded-full border-[5px] border-white overflow-hidden'>
            <img className='w-full h-full object-cover' src={currentUser?.avatar} alt="" />
          </div>
          <p className='text-base font-semibold text-center text-white mt-3'>Minh Tuan</p>
        </div>
      </div>
      <div className='flex justify-around mt-11'>
        <div className=''>
          <div className='w-[250px] h-[250px] rounded-full border-[5px] border-gray-200 overflow-hidden'>
            <img className='w-full h-full object-cover' src={currentUser?.avatar} alt="" />
          </div>
          <p className='text-base font-semibold text-center text-black mt-3'>Minh Tuan</p>
        </div>
        <div className='flex gap-y-6 gap-x-11'>
          <div className='min-w-[350px]'>
            <div className='h-[100px]'>
              <p className='text-base font-semibold mb-3'>User name</p>
              {isUpdate ?
                <> <input type="text"
                  defaultValue={userName}
                  name='subject'
                  onChange={(e) => setUserName(e.target.value)}
                  className='w-full h-10 p-3 mt-1 border rounded-md border-graycustom bg-input focus:border-bluecustom' />
                  {userName.length === 0 && <span className='text-sm italic text-red-500 font-medium'>*you must provide phone</span>}
                </> : <p className='text-base font-medium'>Minh tuan</p>
              }
            </div>
            <div className='h-[100px]'>
              <p className='text-base font-semibold mb-3'>Phone</p>
              {isUpdate ?
                <> <input type="text"
                  defaultValue={phone}
                  name='subject'
                  onChange={(e) => setPhone(e.target.value)}
                  className='w-full h-10 p-3 mt-1 border rounded-md border-graycustom bg-input focus:border-bluecustom' />
                  {phone.length === 0 && <span className='text-sm italic text-red-500 font-medium'>*you must provide phone</span>}
                </> : <p className='text-base font-medium'>Minh tuan</p>
              }
            </div>
          </div>
          <div className='flex flex-col min-w-[350px]'>
            <div className='h-[100px]'>
              <p className='text-base font-semibold mb-3'>Email</p>
              {isUpdate ? <><input type="text"
                defaultValue={email}
                name='subject'
                onChange={(e) => setEmail(e.target.value)}
                className='w-full h-10 p-3 mt-1 border rounded-md border-graycustom bg-input focus:border-bluecustom' />
                {email.length === 0 && <span className='text-sm italic text-red-500 font-medium'>*you must provide email</span>}</>
                : <p className='text-base font-medium'>Minh tuan</p>
              }
            </div>
            <div className='h-[100px]'>
              <p className='text-base font-semibold mb-3'>Address</p>
              {isUpdate ? <><input type="text"
                defaultValue={address}
                name='subject'
                onChange={(e) => setAddress(e.target.value)}
                className='w-full h-10 p-3 mt-1 border rounded-md border-graycustom bg-input focus:border-bluecustom' />
                {address.length === 0 && <span className='text-sm italic text-red-500 font-medium'>*you must provide subject</span>}</>
                : <p className='text-base font-medium'>Minh tuan</p>
              }
            </div>
            <div className='mt-auto self-end flex gap-3'>
              {isUpdate ?
                <>
                  <button
                    onClick={handleCancel}
                    className='w-[100px] button-default h-10 bg-gray-200 max-w-[100px] text-red-500 font-medium mb-0'
                  >Cancel</button>
                  <button
                    onClick={handleUpdate}
                    className='w-[100px] button-default h-10 bg-button max-w-[100px] text-white font-medium mb-0'
                  >Save</button>
                </> :
                <button
                  onClick={toggleUpdate}
                  className='w-[100px] button-default h-10 bg-button max-w-[100px] text-white font-medium mb-0'
                >Update</button>
              }

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
