import React from 'react';
import CardTask from '../../components/card/cardTask';
import Button from '../../components/button/Button';
import { IconCol, IconFilter, IconList } from '../../components/icons';
import Input from '../../components/input/Input';

const Task = () => {
  return (
    <div className='bg-white rounded-md pt-6 px-4 min-h-[calc(100vh-56px-24px)]'>
      <div className="flex items-start justify-between">
        <div className='flex gap-8'>
          <div>
            <span className='mb-2 text-base font-medium'>All Task</span>
            <div className='w-full h-[2px] bg-black'></div>
          </div>
          <div>
            <span className='mb-2 text-base font-medium'>All Task</span>
            <div className='w-full h-[2px] bg-black'></div>
          </div>
          <div>
            <span className='mb-2 text-base font-medium'>All Task</span>
            <div className='w-full h-[2px] bg-black'></div>
          </div>
          <div>
            <span className='mb-2 text-base font-medium'>All Task</span>
            <div className='w-full h-[2px] bg-black'></div>
          </div>
        </div>
        <div className='flex gap-3'>
          <Button
            className='button-default bg-[#F6F7F9] w-10 h-10 text-white rounded-md font-medium mb-0'><IconList></IconList></Button>
          <Button
            className='button-default bg-[#F6F7F9] w-10 h-10 text-white rounded-md font-medium mb-0'><IconCol></IconCol></Button>
          <Button
            className='button-default bg-[#F6F7F9] w-10 h-10 text-white rounded-md font-medium mb-0'><IconFilter></IconFilter></Button>
        </div>
      </div>
      <div className='flex justify-end'>
        <Input
          placehoder="Search..."
          className="w-full max-w-[252px] h-10 p-3 mt-4 border rounded-md border-graycustom bg-input focus:border-bluecustom"
        ></Input>
      </div>
      <div className="grid gap-4 project-content sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <CardTask></CardTask>
      </div>
    </div>
  );
}

export default Task;
