import React, { useEffect, useRef, useState } from 'react'
import backgroundForm from "../../asset/images/backgroudForm.jpg"
import Filed from '../../components/filed/Filed'
import Input from '../../components/input/Input'
import Button from '../../components/button/Button'
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion"

export default function EnterOtp() {
  const formik = useFormik({
    initialValues: {
      otp: ""
    },
    validationSchema: Yup.object({
      otp: Yup.string().max(6).required()
    }),
    onSubmit: (values, { setSubmitting }) => {
      console.log("check ", values);
      console.log("check ", time);
      stopTime()
      if (time <= 0) { // hết thời gian, gửi lại code
        setTime(10)
        startTime()
        setSubmitting(false)
        console.log("Gửi lại mã")
      } else {
        console.log("đầu vào oke")
        // call api nếu oke thì đi tiếp không thì setSubmitting(false) và gửi lại
      }

    }
  })
  const [time, setTime] = useState(10);
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
            name="otp"
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
