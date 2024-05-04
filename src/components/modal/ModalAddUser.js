import React from 'react';
import Portal from '../portal/Portal';
import Button from '../button/Button';
import Input from '../input/Input';
import { IconCancel } from '../icons';
const userFake = [
  {
    id: 0,
    email: "tuan@gmail.com"
  },
  {
    id: 1,
    email: "tuan1@gmail.com"
  },
  {
    id: 2,
    email: "tuan2@gmail.com"
  },
  {
    id: 3,
    email: "tuan3@gmail.com"
  },
  {
    id: 4,
    email: "tuan4@gmail.com"
  },
]
const ModalAddUser = ({ nameItemList, showSearchPortal, setShowSearchPortal, userListAdd, handleAddUser, handleRmoveUser }) => {

  return (
    <>
      <Portal
        visible={showSearchPortal}
        containerClassName="fixed inset-0 z-[9999] flex items-center justify-center"
        contentClassName="z-50 w-full max-w-[488px]"
        onClose={() => setShowSearchPortal(false)}
        classOverlay="bg-opacity-20"
      >
        <div className='bg-white p-6 shadow-md rounded-md'>
          <div className='flex justify-between items-center'>
            <span className='text-base font-medium'>Add user</span>
            <Button onClick={() => setShowSearchPortal(false)}><span className='text-blue-500 text-base font-medium'>Cancel</span></Button>
          </div>
          <Input
            type='text'
            name="search"
            className='w-full h-10 p-3 border rounded-md border-graycustom bg-input focus:border-bluecustom mt-3'
            placeholder="search..."
          ></Input>
          <div className="flex flex-wrap gap-2 mt-3">
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
          </div>
          <div className='mt-3'>
            <p className='mb-3 text-base font-medium'>Result</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {userFake.length > 0 && userFake.map((item, index) => {
                return (
                  <div key={item.id}
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
