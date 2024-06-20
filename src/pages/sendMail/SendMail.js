import React, { useContext, useRef, useState } from 'react'
import { Editor } from "@tinymce/tinymce-react"
import ModalAddmember from '../../components/modal/ModalAddMember';
import { IconCancel } from '../../components/icons';
import axios from 'axios';
import { BASE_URL } from '../../constans/url';
import { toast } from 'react-toastify';
import { AuthContext } from "../../context/authContext"
export default function SendMail() {
  const { currentUser } = useContext(AuthContext);
  const [subject, setSubject] = useState("");
  const editorRef = useRef(null);
  const [showModalAddMember, setShowModalAddMember] = useState(false);
  const [userListAdd, setUserListAdd] = useState([]);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const handleAddUser = (data) => {
    setUserListAdd(preData => {
      let userExist = preData.some((item) => item.id === data.id)
      return userExist ? preData : [...preData, { id: data.id.toString(), email: data.email }]
    })
  }

  const handleRemoveUser = (id) => {
    setUserListAdd(preData => preData.filter((item) => item.id !== id))
  }
  const handleSendMail = () => {
    if (!isSubmiting) {
      if (subject.length === 0) {
        return;
      }
      if (editorRef.current) {
        if (editorRef.current.getContent().length === 0) {
          return;
        }
      }
      if (userListAdd.length === 0) {
        return;
      }
      setIsSubmiting(true);
      axios.post(`${BASE_URL}/sendMail/send`, {
        email: userListAdd.map(item => item.email).toString(),
        subject: subject,
        content: editorRef.current.getContent()
      }, {
        headers: {
          "Authorization": `Bearer ${currentUser.token}`
        }
      }).then((res) => {
        toast.success("Send email success")
        setIsSubmiting(false);
      }).catch((err) => {
        toast.error(err.response?.data?.messages);
        setIsSubmiting(false);
      })
    }
  }
  return (
    <div className='bg-white rounded-md pt-6 px-4 min-h-[calc(100vh-56px-24px)] dark:text-white dark:bg-bgDark'>
      <div className='mb-3'>
        <p className='text-base font-semibold mb-3'>Subject</p>
        <input type="text" name='subject'
          onChange={(e) => setSubject(e.target.value)}
          placeholder='Enter subject...'
          className='w-full h-10 p-3 mt-1 border rounded-md border-graycustom bg-input focus:border-bluecustom  dark:bg-bgDarkItem' />
        {subject.length === 0 && <span className='text-sm italic text-red-500 font-medium'>*you must provide subject</span>}
      </div>
      <p className='text-base font-semibold mb-3'>Content Email</p>
      <Editor
        apiKey='q3g7cpp4jjllretkd4rjmvd77i7x274u4w1hvttxum8rx8hb'
        onInit={(_evt, editor) => editorRef.current = editor}
        initialValue=""
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
      <p className='text-base font-semibold my-4'>Member</p>
      <div className="flex flex-wrap gap-2 mt-3">
        {userListAdd.length > 0 && userListAdd.map((item, index) => {
          return (
            <div key={item.id} className="flex items-center gap-2 h-[30px] bg-graycustom bg-opacity-20 p-1 px-2 rounded-md">
              <span className='text-sm font-medium'>{item.email}</span>
              <IconCancel
                onClick={() => handleRemoveUser(item.id)}
                className='w-[15px] cursor-pointer'></IconCancel>
            </div>
          )
        })}
      </div>
      <button
        onClick={() => setShowModalAddMember(true)}
        type='button' className='button-default h-10 bg-button max-w-[100px] text-white font-medium mb-0'>+ add</button>
      <ModalAddmember
        showSearchPortal={showModalAddMember}
        setShowSearchPortal={setShowModalAddMember}
        userListAdd={userListAdd}
        handleAddUser={handleAddUser}
        handleRemoveUser={handleRemoveUser}
      ></ModalAddmember>
      <button
        onClick={handleSendMail}
        type='button' className='button-default h-10 bg-button max-w-[100px] text-white font-medium mb-0 mt-auto absolute bottom-4 right-4'>
        {isSubmiting && <div className='w-5 h-5 border-4 border-white border-r-4 border-r-transparent rounded-full animate-spin'></div>}
        Send</button>
    </div>
  )
}
