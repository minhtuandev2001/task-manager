import React, { useEffect, useState } from 'react';
import Portal from '../portal/Portal';
import Button from '../button/Button';
import Input from '../input/Input';
import { IconCancel } from '../icons';
import axios from 'axios';
import { URL } from '../../constans/url';
import lodash from "lodash";

const ModalAddUser = ({ nameItemList, showSearchPortal, setShowSearchPortal, userListAdd, handleAddUser, handleRemoveUser }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(`${URL}/user?keyword=${search}`)
      setUsers(response.data.data)
      console.log("check ", response)
    }
    getUser()
  }, [search])
  const handleChangeInput = lodash.debounce((e) => {
    console.log("check ", e.target.value)
    setSearch(e.target.value)
  }, 500)
  return (
    <>
      <Portal
        visible={showSearchPortal}
        containerClassName="fixed inset-0 z-[9999] flex items-center justify-center"
        contentClassName="z-50 w-full max-w-[488px]"
        onClose={() => setShowSearchPortal(false)}
        classOverlay="bg-opacity-20"
      >
        <div className='p-6 bg-white rounded-md shadow-md'>
          <div className='flex items-center justify-between'>
            <span className='text-base font-medium'>Add user</span>
            <Button onClick={() => setShowSearchPortal(false)}><span className='text-base font-medium text-blue-500'>Cancel</span></Button>
          </div>
          <Input
            onChange={handleChangeInput}
            type='text'
            name="search"
            className='w-full h-10 p-3 mt-3 border rounded-md border-graycustom bg-input focus:border-bluecustom'
            placeholder="search..."
          ></Input>
          <div className="flex flex-wrap gap-2 mt-3">
            {userListAdd[nameItemList].length > 0 && userListAdd[nameItemList].map((item, index) => {
              return (
                <div key={item._id} className="flex items-center gap-2 h-[30px] bg-graycustom bg-opacity-20 p-1 px-2 rounded-md">
                  <span className='text-sm font-medium'>{item.email}</span>
                  <IconCancel
                    onClick={() => handleRemoveUser(nameItemList, item._id)}
                    className='w-[15px] cursor-pointer'></IconCancel>
                </div>
              )
            })}
          </div>
          <div className='mt-3'>
            <p className='mb-3 text-base font-medium'>Result</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {users.length > 0 && users.map((item, index) => {
                return (
                  <div key={item._id}
                    onClick={() => handleAddUser(nameItemList, item)}
                    className="inline-block h-[30px] gap-2 bg-graycustom bg-opacity-20 p-1 px-2 rounded-md cursor-pointer">
                    <span className='text-sm font-medium'>{item.email}</span>
                  </div>)
              })}
            </div>
          </div>
        </div>
      </Portal>
    </>
  );
}

export default ModalAddUser;
