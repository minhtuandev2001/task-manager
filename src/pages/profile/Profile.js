import React, { useContext, useEffect, useState } from 'react'
import banner from "../../asset/images/banner.png"
import { AuthContext } from "../../context/authContext";
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../constans/url';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IconCamOn } from '../../components/icons';
export default function Profile() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [dataUser, setDataUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangeAvatar, setIsChangeAvatar] = useState(false);

  const getInforUser = () => {
    axios.get(`${BASE_URL}/user/get-info/${id}`, {
      headers: {
        "Authorization": `Bearer ${currentUser.token}`
      }
    })
      .then((res) => {
        setDataUser(res.data?.data);
      }).catch((err) => {
        toast.error(err.response.data.messages);
      })
  }
  useEffect(() => {
    getInforUser();
  }, [id])

  const toggleUpdate = () => {
    setIsUpdate(!isUpdate);
    setUserName(dataUser?.username || "");
    setPhone(dataUser?.phone || "");
    setEmail(dataUser.email || "");
    setAddress(dataUser.address || "");
  }
  const handleUpdate = () => {
    setIsSubmitting(true);
    axios.patch(`${BASE_URL}/user/update-info`, {
      username: userName,
      phone: phone,
      address: address
    }, {
      headers: {
        "Authorization": `Bearer ${currentUser.token}`
      }
    })
      .then((res) => {
        setDataUser(res.data?.data);
        let dataReturn = res.data?.data;
        console.log("check ", dataReturn)
        let infoUser = {
          avatar: dataReturn?.avatar,
          email: dataReturn?.email,
          friendsList: dataReturn?.friendsList,
          address: dataReturn?.address,
          phone: dataReturn?.phone,
          statusOnline: dataReturn?.statusOnline,
          name: dataReturn?.username,
        }
        setCurrentUser({ ...(JSON.parse(localStorage.getItem('user'))), ...infoUser })
        toast.success("Updated information success");
      }).catch((err) => {
        toast.error(err.response.data.messages);
      }).finally(() => {
        getInforUser()
        setIsSubmitting(false);
        setIsUpdate(!isUpdate);
      })
  }
  const handleCancel = () => {
    setIsUpdate(!isUpdate);
  }
  const handleChangeAvatar = (e) => {
    if (e.target.files[0]) {
      setIsChangeAvatar(true)
      const formData = new FormData();
      formData.append("avatar", e.target.files[0])
      axios.patch(`${BASE_URL}/user/change-avatar`, formData, {
        headers: {
          "Authorization": `Bearer ${currentUser.token}`
        }
      })
        .then((res) => {
          toast.success("Change avatar success");
          setCurrentUser({ ...(JSON.parse(localStorage.getItem('user'))), avatar: res.data?.data })
          getInforUser();
        }).catch((err) => {
          toast.error(err.response.data.messages);
        }).finally(() => {
          setIsChangeAvatar(false);
        })
    }
  }
  return (
    <div className='bg-white rounded-md min-h-[calc(100vh-56px-24px)]'>
      <div className='w-full h-[470px] rounded-md overflow-hidden relative'>
        <img className='w-full h-full object-cover' src={banner} alt="" />
        <div className=' absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]'>
          <div className='w-[150px] h-[150px] rounded-full border-[5px] border-white overflow-hidden'>
            <img className='w-full h-full object-cover' src={dataUser?.avatar} alt="" />
          </div>
          <p className='text-base font-semibold text-center text-white mt-3'>{dataUser?.username}</p>
        </div>
      </div>
      <div className='flex justify-around mt-11 phone:flex-col phone:items-center tablet2:flex-row tablet2:justify-around'>
        <div className=''>
          <div className='w-[250px] h-[250px] rounded-full border-[5px] border-gray-200 overflow-hidden relative'>
            <img className='w-full h-full object-cover' src={dataUser?.avatar} alt="" />
            {dataUser?._id === currentUser.id &&
              <label htmlFor='avatar' className='block absolute bottom-0 left-1/2 -translate-x-1/2 bg-gray-200 p-2 px-3 rounded-sm cursor-pointer'>
                {isChangeAvatar ? (<div className='w-5 h-5 rounded-full border-4 border-blue-500 border-r-4 border-r-transparent animate-spin'></div>)
                  : (<IconCamOn></IconCamOn>)}
              </label>}
            <input
              onChange={handleChangeAvatar}
              id='avatar' hidden type="file" accept="image/png, image/jpeg" />
          </div>
          <p className='text-base font-semibold text-center text-black mt-3'>{dataUser?.username}</p>
        </div>
        <div className='flex gap-y-6 gap-x-11 phone:flex-col phone:p-5 w-full phone2:flex-row'>
          <div className='phone:w-auto phone2:w-full tablet2:w-[400px]'>
            <div className='h-[100px]'>
              <p className='text-base font-semibold mb-3'>User name</p>
              {isUpdate ?
                <> <input type="text"
                  defaultValue={userName}
                  name='subject'
                  onChange={(e) => setUserName(e.target.value)}
                  className='w-full h-10 p-3 mt-1 border rounded-md border-graycustom bg-input focus:border-bluecustom' />
                  {userName.length === 0 && <span className='text-sm italic text-red-500 font-medium'>*you must provide phone</span>}
                </> : <p className='text-base font-medium'>{dataUser?.username}</p>
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
                </> : <p className='text-base font-medium'>{dataUser?.phone}</p>
              }
            </div>
          </div>
          <div className='flex flex-col phone2:w-full tablet2:w-[400px]'>
            <div className='h-[100px]'>
              <p className='text-base font-semibold mb-3'>Email</p>
              {isUpdate ? <><input type="text"
                defaultValue={email}
                disabled
                name='subject'
                onChange={(e) => setEmail(e.target.value)}
                className='w-full h-10 p-3 mt-1 border rounded-md border-graycustom bg-input focus:border-bluecustom' />
                {email.length === 0 && <span className='text-sm italic text-red-500 font-medium'>*you must provide email</span>}</>
                : <p className='text-base font-medium'>{dataUser?.email}</p>
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
                : <p className='text-base font-medium'>{dataUser?.address}</p>
              }
            </div>
          </div>
        </div>
      </div>
      {dataUser?._id === currentUser.id &&
        <div className='mt-auto float-right flex gap-3'>
          {isUpdate ?
            <>
              <button
                onClick={handleCancel}
                className='w-[100px] button-default h-10 bg-gray-200 max-w-[100px] text-red-500 font-medium mb-0'
              >Cancel</button>
              <button
                onClick={handleUpdate}
                className='w-[100px] button-default h-10 bg-button max-w-[100px] text-white font-medium mb-0'
              >{isSubmitting && <div className='w-5 h-5 rounded-full border-4 border-white border-r-4 border-r-transparent animate-spin'></div>}Save</button>
            </> :
            <button
              onClick={toggleUpdate}
              className='w-[100px] button-default h-10 bg-button max-w-[100px] text-white font-medium mb-0'
            >Update</button>
          }
        </div>
      }
    </div>
  )
}
