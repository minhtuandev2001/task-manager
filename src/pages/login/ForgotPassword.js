import React from 'react'
import backgroundForm from "../../asset/images/backgroudForm.jpg"
import Filed from '../../components/filed/Filed'
import Input from '../../components/input/Input'
import Button from '../../components/button/Button'
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion"

export default function ForgotPassword() {
  const formik = useFormik({
    initialValues: {
      email: ""
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required()
    }),
    onSubmit: (values) => {
      console.log("check ", values);
    }
  })
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
        <h2 className='flex flex-col mb-8 text-3xl font-bold text-center'>Forgot <span>
          Password
        </span></h2>
        <span className='block mb-6 text-xs text-center text-gray-400'>Enter your email to reset Password</span>
        <Filed>
          <Input
            type='email'
            name="email"
            className="w-full h-12 p-3 border rounded-md border-graycustom bg-input focus:border-bluecustom"
            {...formik.getFieldProps('email')}
          ></Input>
        </Filed>
        {formik.touched.email && formik.errors.email && <span className='text-xs italic font-medium text-red-500'>*{formik.errors.email}</span>}
        <Button className="mt-4 font-semibold text-white button-default bg-button">Send</Button>
      </motion.form>
    </div>
  )
}
