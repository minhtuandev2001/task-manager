import React, { useContext, useEffect, useRef, useState } from 'react'
import { IconCancel, IconFile, IconImage, IconSend, IconSmile } from '../../components/icons'
import ChatItem from '../../components/card/ChatItem'
import Button from '../../components/button/Button';
import ThumbnailFile from '../../components/thumbnail/ThumbnailFile';
import axios from "axios";
import { BASE_URL } from '../../constans/url';
import { AuthContext } from "../../context/authContext"
import { toast } from 'react-toastify';
import imageGroup from "../../asset/images/imageGroup.png";
import noMessage from "../../asset/images/noMessage.png"

export default function Chat() {
  const { currentUser } = useContext(AuthContext)
  const [imagesUpload, setImageUpload] = useState(null);
  const [filesUpload, setFilesUpload] = useState(null);
  const [inputMessage, setInputMessage] = useState("");

  // xử lý việc upload, preview, remove image
  const handleUploadImage = (e) => {
    setImageUpload(prevImage => {
      if (prevImage !== null) {
        const dt = new DataTransfer();
        for (let i = 0; i < prevImage.length; i++) {
          const file = prevImage[i];
          dt.items.add(file)
        }
        for (let i = 0; i < e.target.files.length; i++) {
          const file = e.target.files[i];
          dt.items.add(file)
        }
        return dt.files;
      }
      return e.target.files
    })
  }
  const handleRemoveImageUpload = (index) => {
    const dt = new DataTransfer();
    for (let i = 0; i < imagesUpload.length; i++) {
      const file = imagesUpload[i];
      if (index !== i) {
        dt.items.add(file)
      }
    }
    setImageUpload(dt.files)
  }
  // xử lý việc upload, preview, remove image

  // tiền xử lý việc Upload file
  const handleUploadFile = (e) => {
    setFilesUpload(prevFiles => {
      if (prevFiles !== null) {
        const dt = new DataTransfer();
        for (let i = 0; i < prevFiles.length; i++) {
          const file = prevFiles[i];
          dt.items.add(file)
        }
        for (let i = 0; i < e.target.files.length; i++) {
          const file = e.target.files[i];
          dt.items.add(file)
        }
        return dt.files;
      }
      return e.target.files
    })
  }
  const handleRemoveFilesUpload = (index) => {
    const dt = new DataTransfer();
    for (let i = 0; i < filesUpload.length; i++) {
      const file = filesUpload[i];
      if (index !== i) {
        dt.items.add(file)
      }
    }
    setFilesUpload(dt.files)
  }
  // kết thúc tiền xử lý việc Upload file driver

  const loadChatRef = useRef(null)
  const [chats, setChats] = useState([]);
  const [loadingLoadUser, setLoadingLoadUser] = useState(false)
  loadChatRef.current = () => {
    setLoadingLoadUser(true)
    axios.get(`${BASE_URL}/chat`, {
      headers: {
        "Authorization": `Bearer ${currentUser.token}`
      }
    }).then((res) => {
      console.log("check ", res)
      setChats(res.data?.data || [])
      setLoadingLoadUser(false)
    }).catch((err) => {
      setLoadingLoadUser(false)
      console.log("check ", err)
      toast.error(err.data?.data.messages)
    })
  }
  useEffect(() => {
    loadChatRef.current();
  }, [])

  const [selectedChat, setSelectedChat] = useState(null)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [messages, setMessages] = useState([])
  // tải message
  const handleSelectedChat = (item) => {
    setSelectedChat(item)
    setLoadingMessages(true)
    setMessages([]);
    axios.get(`${BASE_URL}/message/${item._id}`, {
      headers: {
        "Authorization": `Bearer ${currentUser.token}`,
      }
    }).then((res) => {
      console.log("check ", res)
      setMessages(res.data?.data || [])
      setLoadingMessages(false)
    }).catch((err) => {
      toast.error(err.response.data.messages)
      setLoadingMessages(false)
    })
  }
  // kết thúc tải message

  // gửi tin nhắn
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (selectedChat) {
      const formData = new FormData();
      formData.append("sender", currentUser.id);
      formData.append("content", inputMessage);
      formData.append("room_chat_id", selectedChat._id);
      if (imagesUpload) {
        for (let i = 0; i < imagesUpload.length; i++) {
          formData.append("images", imagesUpload[i])
        }
      }
      if (filesUpload) {
        for (let i = 0; i < filesUpload.length; i++) {
          formData.append("files", filesUpload[i])
        }
      }
      axios.post(`${BASE_URL}/message/create`, formData, {
        headers: {
          "Authorization": `Bearer ${currentUser.token}`,
          "Content-Type": "multipart/form-data"
        }
      }).then((res) => {
        console.log("check ", res)
      }).catch((err) => {
        toast.error(err.response.data.messages)
      })
    }
  }
  // kết thúc gửi tin nhắn
  return (
    <div className='min-h-[calc(100vh-56px-24px)]'>
      <div className='flex gap-3'>
        <div className='flex-1 bg-white rounded-md'>
          <div className="px-4 py-2 shadow-sm">
            <div className='flex items-center gap-3 min-h-9'>
              {selectedChat && (
                <>
                  <img className='object-cover rounded-full h-9 w-9' src={selectedChat.isGroupChat ? imageGroup : selectedChat.infoUser?.avatar} alt="" />
                  <span className='text-sm font-semibold'>{selectedChat.isGroupChat ? selectedChat.chatName : selectedChat.infoUser?.username}</span>
                </>
              )}
            </div>
          </div>
          <div className="px-4 w-full h-[calc(100vh-56px-24px-52px-40px-18px)] flex flex-col gap-2 overflow-scroll no-scrollbar">
            {messages.length > 0 ? (
              messages.map((item, index) => {
                return (<div key={item._id} className={`${currentUser.id === item.infoSender._id ? "self-end" : ""}`}>
                  {messages[index - 1] ? (
                    item.infoSender._id !== messages[index - 1].infoSender._id && (
                      <p className='text-sm font-semibold'>{currentUser.id === item.infoSender._id ? "" : item.infoSender?.username}</p>
                    )
                  ) : (
                    <p className='text-sm font-semibold'>{currentUser.id === item.infoSender._id ? "" : item.infoSender?.username}</p>
                  )}
                  <p className={`max-w-[350px] p-2 rounded-md text-base mt-1 inline-block ${currentUser.id === item.infoSender._id ? "bg-blue-500 text-white" : "bg-gray-100"}`}>{item?.content}</p>
                </div>)
              }))
              : (<img className='w-[200px] mx-auto mt-20' src={noMessage} alt="" />)}
            <div className='flex flex-wrap gap-2 '>
              {imagesUpload !== null && Array(imagesUpload.length).fill(null).map((item, index) => {
                return (
                  <div key={index} className='relative w-[70px] h-[70px]'>
                    <img className='object-cover w-full h-full' src={URL.createObjectURL(imagesUpload[index])} alt="" />
                    <Button
                      onClick={() => handleRemoveImageUpload(index)}
                      className="w-5 absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-gray-300 p-[2px] h-5 rounded-full flex justify-center items-center"><IconCancel></IconCancel></Button>
                  </div>
                )
              })}
            </div>
            <div className='grid grid-cols-4 gap-2 '>
              {filesUpload !== null && Array(filesUpload.length).fill(null).map((item, index) => {
                return (
                  <div key={index} className='flex items-center gap-2 p-2 bg-gray-200 rounded-md'>
                    <div className='min-w-[22px] min-h-[29px]'>
                      <ThumbnailFile fileExtension={filesUpload[index].name.split(".")[1]}></ThumbnailFile>
                    </div>
                    <span className='flex-1 text-sm font-medium line-clamp-1'>{filesUpload[index].name}</span>
                    <Button
                      onClick={() => handleRemoveFilesUpload(index)}
                      className="flex items-center justify-center w-full h-full max-w-4 max-h-4"><IconCancel></IconCancel></Button>
                  </div>
                )
              })}
            </div>
          </div>
          <form onSubmit={handleSendMessage} className="flex items-center w-full gap-2 px-4 my-2">
            <input type="text"
              onChange={(e) => setInputMessage(e.target.value)}
              className="rounded-lg border border-[#D9D9D9] h-10 px-2 bg-[#F6F7F9] flex-1 focus:border-blue-500"
            />
            <label htmlFor='image' className='cursor-pointer w-10 h-10 rounded-md bg-[#F6F8FD] flex justify-center items-center hover:bg-slate-200 transition-all '><IconImage></IconImage></label>
            <input
              hidden
              onChange={handleUploadImage}
              type="file" id="image" accept="image/png, image/jpeg" multiple />
            <label htmlFor='files' className='cursor-pointer w-10 h-10 rounded-md bg-[#F6F8FD] flex justify-center items-center hover:bg-slate-200 transition-all '><IconFile></IconFile></label>
            <input
              hidden
              onChange={handleUploadFile}
              type="file" id="files" multiple />
            <button type="button" className='w-10 h-10 rounded-md bg-[#F6F8FD] flex justify-center items-center hover:bg-slate-200 transition-all '><IconSmile></IconSmile></button>
            <button
              type='submit' className='w-10 h-10 rounded-md bg-[#F6F8FD] flex justify-center items-center hover:bg-slate-200 transition-all '><IconSend></IconSend></button>
          </form>
        </div>
        <div className='w-full max-w-[300px] bg-white rounded-md p-4'>
          <input type="text"
            className="rounded-lg border border-[#D9D9D9] h-10 px-2 bg-[#F6F7F9] w-full focus:border-blue-500"
          />
          <div className='flex flex-col mt-3 gap-2 overflow-scroll max-h-[calc(100vh-56px-24px-52px-50px)] no-scrollbar'>
            {loadingLoadUser && <div className='w-5 h-5 rounded-full border-4 border-blue-600 border-r-4 border-r-transparent animate-spin mx-auto mt-2'></div>}
            {chats.length > 0 ? chats.map((item) => {
              return (<ChatItem key={item._id} data={item} handleSelectedChat={handleSelectedChat}></ChatItem>)
            })
              : (
                null
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
