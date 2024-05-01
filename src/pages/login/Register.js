import React, { useState } from 'react'
import Filed from '../../components/filed/Filed'
import Input from '../../components/input/Input'
import Label from '../../components/label/Label'
import Button from '../../components/button/Button'
import backgroundForm from "../../asset/images/backgroudForm.jpg"
import iconGoogle from "../../asset/images/Google.png"
import { NavLink } from 'react-router-dom'
import { useFormik } from "formik"
import * as Yup from "yup";
import { IconEyeClose, IconEyeOpen } from '../../components/icons'
import { motion } from "framer-motion"

export default function Register() {
  const formikRegister = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      passwordcf: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().min(4).max(40).required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(8).required(),
      passwordcf: Yup.string().oneOf([Yup.ref("password"), null], "Password must match").required()
    }),
    onSubmit: (values) => {
      console.log("check ", values)
    }
  })
  const [togglePassword, setTogglePassword] = useState(true);
  const [togglePasswordCf, setTogglePasswordCf] = useState(true);

  return (
    <div className='flex items-center justify-center h-screen bg-center'
      style={{
        backgroundImage: `url(${backgroundForm})`
      }}
    >
      <motion.form
        animate={{ y: [70, 0], opacity: [0, 1] }}
        transition={{ duration: 1 }}
        className='bg-white w-full max-w-[454px] p-7 px-8 rounded-md'>
        <h2 className='mb-8 text-3xl font-bold text-center'>Register</h2>
        <Filed className="flex flex-col w-full gap-2 mt-3 mb-2 filed">
          <Label htmlFor='username' className="font-medium">Username</Label>
          <Input
            type='text'
            name="username"
            className='w-full h-12 p-3 border rounded-md border-graycustom bg-input focus:border-bluecustom'
            placeholder="Enter your username"
            {...formikRegister.getFieldProps("username")}
          ></Input>
        </Filed>
        {formikRegister.touched.username && formikRegister.errors.username && <span
          className='text-xs italic font-medium text-red-500'
        >*{formikRegister.errors.username}</span>}
        <Filed className="flex flex-col w-full gap-2 mt-3 mb-2 filed">
          <Label htmlFor='email' className="font-medium">Email</Label>
          <Input
            type='email'
            name="email"
            className='w-full h-12 p-3 border rounded-md border-graycustom bg-input focus:border-bluecustom'
            placeholder="Enter your email"
            {...formikRegister.getFieldProps('email')}
          ></Input>
        </Filed>
        {formikRegister.touched.email && formikRegister.errors.email && <span
          className='text-xs italic font-medium text-red-500'
        >{formikRegister.errors.email}</span>}
        <Filed className="flex flex-col w-full gap-2 mt-3 mb-2 filed">
          <Label htmlFor='password' className="font-medium">Password</Label>
          <Input
            name="password"
            type={togglePassword ? "password" : "text"}
            className='w-full h-12 p-3 border rounded-md border-graycustom bg-input focus:border-bluecustom'
            placeholder=""
            {...formikRegister.getFieldProps('password')}
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
        {formikRegister.touched.password && formikRegister.errors.password && <span
          className='text-xs italic font-medium text-red-500'
        >{formikRegister.errors.password}</span>}
        <Filed className="flex flex-col w-full gap-2 mt-3 mb-2 filed">
          <Label htmlFor='passwordcf' className="font-medium">Confirm Password</Label>
          <Input
            name="passwordcf"
            type={togglePasswordCf ? "password" : "text"}
            className='w-full h-12 p-3 border rounded-md border-graycustom bg-input focus:border-bluecustom'
            placeholder=""
            {...formikRegister.getFieldProps('passwordcf')}
          >
            {togglePasswordCf ? <IconEyeClose
              className='absolute -translate-y-1/2 cursor-pointer right-3 top-1/2'
              onClick={() => setTogglePasswordCf(false)}
            ></IconEyeClose>
              : <IconEyeOpen
                className='absolute -translate-y-1/2 cursor-pointer right-3 top-1/2'
                onClick={() => setTogglePasswordCf(true)}
              ></IconEyeOpen>}
          </Input>
        </Filed>
        {formikRegister.touched.passwordcf && formikRegister.errors.passwordcf && <span
          className='text-xs italic font-medium text-red-500'
        >{formikRegister.errors.passwordcf}</span>}
        <Button className='mt-4 text-base font-bold text-white cursor-pointer button-default bg-button'>Sign Up</Button>
        <Button className='border button-default border-graycustom'>
          <img className='object-cover w-7 h-7' src={iconGoogle} alt="" />
          <span className='text-xs font-medium'>Login with google</span>
        </Button>
        <span className='block text-xs font-medium text-center'>You already have an account, <NavLink className="text-blue-500" to="/login">sign in</NavLink></span>
      </motion.form>
    </div>
  )
}
