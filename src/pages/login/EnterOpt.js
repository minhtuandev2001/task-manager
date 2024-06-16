import React, { useEffect, useRef, useState } from 'react'
import backgroundForm from "../../asset/images/backgroudForm.jpg"
import Filed from '../../components/filed/Filed'
import Input from '../../components/input/Input'
import Button from '../../components/button/Button'
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../constans/url'
import { toast } from 'react-toastify'

export default function EnterOtp() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      otp: ""
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required(),
      otp: Yup.string().required()
    }),
    onSubmit: (values, { setSubmitting }) => {
      if (time <= 0) { // hết thời gian, gửi lại code
        navigate("/forgot-password");
      } else {
        console.log("đầu vào oke");
        // call api nếu oke thì đi tiếp không thì setSubmitting(false) và gửi lại
        axios.post(`${BASE_URL}/user/enter-otp`, {
          email: values.email,
          otp: values.otp,
        }).then((res) => {
          navigate("/new-password", { state: { email: values.email } });
        }).catch((err) => {
          toast.error(err.response?.data.messages)
        }).finally(() => {
          setSubmitting(false);
        })
      }
    }
  })
  const [time, setTime] = useState(180);
  const timeRef = useRef(null);
  useEffect(() => {
    startTime()
    return () => {
      stopTime()
    }
  }, [])
  const startTime = () => {
    timeRef.current = setInterval(() => {
      setTime(preTime => {
        if (preTime <= 0) {
          clearInterval(timeRef.current)
          return 0
        } else {
          return preTime - 1
        }
      })
    }, 1000)
  }
  const stopTime = () => {
    clearInterval(timeRef.current)
  }
  return (
    <div className='flex items-center justify-center h-screen bg-center'
      style={{
        backgroundImage: `url(${backgroundForm})`
      }}
    >
      <motion.form
        animate={{ y: [70, 0], opacity: [0, 1] }}
        transition={{ duration: 1 }}
        onSubmit={formik.handleSubmit} className='bg-white w-full max-w-[454px] p-5 px-8 rounded-md'>
        <h2 className='mb-3 text-3xl font-bold text-center'>Input OTP</h2>
        <span className='block mb-6 text-xs text-gray-400 w-full max-w-[300px]  text-center mx-auto'>We have sent the OTP Verification code to your tuan@gmail.com. Check your email and enter the code below</span>
        <Filed>
          <Input
            type='text'
            name="email"
            placeholder="Enter your email"
            className="w-full h-12 p-3 border rounded-md border-graycustom bg-input focus:border-bluecustom"
            {...formik.getFieldProps('email')}
          ></Input>
        </Filed>
        {formik.touched.email && formik.errors.email && <span className='text-xs italic font-medium text-red-500'>*{formik.errors.email}</span>}
        <div className='h-3'></div>
        <Filed>
          <Input
            type='text'
            name="otp"
            placeholder="Enter otp"
            className="w-full h-12 p-3 border rounded-md border-graycustom bg-input focus:border-bluecustom"
            {...formik.getFieldProps('otp')}
          ></Input>
        </Filed>
        {formik.touched.otp && formik.errors.otp && <span className='text-xs italic font-medium text-red-500'>*{formik.errors.otp}</span>}
        <span className='block mt-6 text-xs text-gray-400 w-full max-w-[300px]  text-center mx-auto'>You can resend code in {time} Second</span>
        <Button
          disabled={formik.isSubmitting}
          type="submit" className="mt-3 font-semibold text-white button-default bg-button">{time === 0 ? 'Resend Code' : 'Verify'}</Button>
      </motion.form>
    </div>
  )
}
