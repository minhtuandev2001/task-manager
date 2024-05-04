import React, { useState } from 'react';
import { IconCancel } from '../icons';
import Button from '../button/Button';
import ModalAddUser from './ModalAddUser';

const AddUser = ({ nameItemList, userListAdd, handleAddUser, handleRmoveUser }) => {
  const [showSearchPortal, setShowSearchPortal] = useState(false);
  return (
    <div className="">
      <p className='mb-3 text-base font-medium'>{nameItemList.charAt(0).toUpperCase() + nameItemList.slice(1)}</p>
      <div className="flex flex-wrap gap-2">
        {userListAdd[nameItemList].length > 0 && userListAdd[nameItemList].map((item, index) => {
          return (
            <div key={item.id} className="flex items-center gap-2 h-[30px] bg-graycustom bg-opacity-20 p-1 px-2 rounded-md">
              <span className='text-sm font-medium'>{item.email}</span>
              <IconCancel
                onClick={() => handleRmoveUser(nameItemList, item.id)}
                className='w-[15px] cursor-pointer'></IconCancel>
            </div>
          )
        })}
        <Button
          onClick={() => setShowSearchPortal(true)}
          className="button-default w-auto bg-button h-auto px-4 py-[6px] text-white font-medium">+ add</Button>
      </div>
      <ModalAddUser nameItemList={nameItemList} showSearchPortal={showSearchPortal} setShowSearchPortal={setShowSearchPortal} userListAdd={userListAdd} handleAddUser={handleAddUser} handleRmoveUser={handleRmoveUser}></ModalAddUser>
    </div>
  );
}

export default AddUser;
