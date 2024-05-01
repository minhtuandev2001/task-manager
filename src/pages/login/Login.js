import React, { useState } from 'react'
import Filed from '../../components/filed/Filed'
import Label from '../../components/label/Label'
import Input from '../../components/input/Input'
import Button from '../../components/button/Button'
import backgroundForm from "../../asset/images/backgroudForm.jpg"
import iconGoogle from "../../asset/images/Google.png"
import { NavLink } from 'react-router-dom'
import { useFormik } from "formik"
import * as Yup from "yup"
import { IconEyeClose, IconEyeOpen } from '../../components/icons'
import { motion } from "framer-motion";

export default function Login() {
  const formikLogin = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().min(8).required()
    }),
    onSubmit: (values) => {
      console.log("check ", values)
    }
  })
  const [togglePassword, setTogglePassword] = useState(true);
  return (
    <div className='flex items-center justify-center h-screen bg-center'
      style={{
        backgroundImage: `url(${backgroundForm})`
      }}
    >
      <motion.form
        animate={{ y: [70, 0], opacity: [0, 1] }}
        transition={{ duration: 1 }}
        onSubmit={formikLogin.handleSubmit} className='bg-white w-full max-w-[454px] p-7 px-8 rounded-md'>
        <h2 className='mb-8 text-3xl font-bold text-center'>Login</h2>
        <Filed className="flex flex-col w-full gap-2 mt-3 mb-2 filed">
          <Label htmlFor='email' className="font-medium">Email</Label>
          <Input
            type='email'
            name="email"
            className='w-full h-12 p-3 border rounded-md border-graycustom bg-input focus:border-bluecustom'
            placeholder="Enter your email"
            {...formikLogin.getFieldProps('email')}
          ></Input>
        </Filed>
        {formikLogin.touched.email && formikLogin.errors.email && <span
          className='text-xs italic font-medium text-red-500'>* {formikLogin.errors.email}</span>}
        <Filed className="flex flex-col w-full gap-2 mt-3 mb-2 filed">
          <Label htmlFor='password' className="font-medium">Password</Label>
          <Input
            type={togglePassword ? "password" : "text"}
            name="password"
            className='w-full h-12 p-3 border rounded-md border-graycustom bg-input focus:border-bluecustom'
            placeholder=""
            {...formikLogin.getFieldProps('password')}
          >
            {togglePassword ? <IconEyeClose
              className='absolute -translate-y-1/2 cursor-pointer right-3 top-1/2'
              onClick={() => setTogglePassword(false)}
            ></IconEyeClose>
              : <IconEyeOpen
                className='absolute -translate-y-1/2 cursor-pointer right-3 top-1/2'
                onClick={() => setTogglePassword(true)}
              ></IconEyeOpen>}
          </Input>
        </Filed>
        {formikLogin.touched.password && formikLogin.errors.password && <span
          className='text-xs italic font-medium text-red-500'>* {formikLogin.errors.password}</span>}
        <NavLink className="inline-block my-2 text-sm font-medium text-blue-600 float-end" to="/forgot-password">Forgot password ?</NavLink>
        <Button className='text-base font-bold text-white cursor-pointer button-default bg-button'>Login</Button>
        <Button className='border button-default border-graycustom'>
          <img className='object-cover w-7 h-7' src={iconGoogle} alt="" />
          <span className='text-xs font-medium'>Register with google</span>
        </Button>
        <span className='block text-xs font-medium text-center'>You don't have an account yet, <NavLink className="text-blue-500" to="/register">sign up</NavLink></span>
      </motion.form>
    </div>
  )
}
