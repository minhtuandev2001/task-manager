import React, { useContext, useEffect, useState } from 'react'
import Portal from '../portal/Portal'
import Label from '../label/Label'
import Input from '../input/Input'
import Button from '../button/Button'
import { BASE_URL } from '../../constans/url';
import { AuthContext } from "../../context/authContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import lodash from "lodash";

export default function ShowModalSearchProject({ showDropdow, setShowDropdown, handleChooseProject }) {
  const { currentUser } = useContext(AuthContext);
  const [projectList, setProjectList] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    axios.get(`${BASE_URL}/project?keyword=${search}`,
      {
        headers: {
          "Authorization": `Bearer ${currentUser.token}`
        }
      }
    )
      .then((res) => {
        console.log("check ", res.data.data)
        setProjectList(res.data.data)
      }).catch((err) => {
        toast.error(err.response.data.messages)
      })
  }, [currentUser.token, search])

  const handleChangeInput = lodash.debounce((e) => {
    console.log("check ", e.target.value)
    setSearch(e.target.value)
  }, 500)

  return (
    <Portal
      visible={showDropdow}
      containerClassName="fixed inset-0 z-[999] flex items-center justify-center"
      contentClassName="z-50 w-full max-w-[439px]"
      onClose={() => setShowDropdown(false)}
      classOverlay="bg-opacity-10"
    >
      <div className='w-full h-full px-6 py-3 bg-white rounded-md shadow-md dark:text-white dark:bg-bgDarkItem'>
        <Label className="text-base font-medium" >Choose Project</Label>
        <Input
          onChange={handleChangeInput}
          placeholder="Enter name project"
          className="w-full h-10 p-3 my-3 border rounded-md border-graycustom bg-input focus:border-bluecustom dark:bg-bgDarkItem"></Input>
        <div className='flex flex-col items-start gap-1 h-full overflow-y-scroll no-scrollbar max-h-[300px]'>
          {projectList.length > 0 && projectList.map((item) => {
            return (
              <Button
                key={item._id}
                onClick={() => handleChooseProject(item)}
                className="flex items-center w-full px-2 transition-all rounded-md hover:bg-gray-100 min-h-10 max-h-10">
                <span className='text-sm font-medium line-clamp-1 text-start'>{item.title}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </Portal>
  )
}
