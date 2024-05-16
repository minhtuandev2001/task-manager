import React from 'react'
import Alert from './Alert'
import Button from '../button/Button'

export default function AlertWarning({ toggleShow = false, messages = "", handleContinue = () => { }, handleCancel = () => { }, children }) {
  return (
    <Alert
      showAlert={toggleShow}
    >
      <div
        transition={{ type: "spring", duration: 0.15 }}
        className='flex flex-col items-center w-full h-full gap-3 p-6 bg-white rounded-md'>
        {children}
        <p className='text-base font-semibold text-center'>{messages}</p>
        <div className='flex items-center justify-between w-full mt-3'>
          <Button onClick={handleContinue} className="px-4 py-2 font-medium text-white rounded-md bg-button">continue</Button>
          <Button onClick={handleCancel} className="px-4 py-2 font-medium text-[#E80000] rounded-md bg-gray-300 bg-opacity-50">Cancel</Button>
        </div>
      </div>
    </Alert>
  )
}
// Do you want to delete the project?