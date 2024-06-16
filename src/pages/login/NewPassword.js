import React, { useEffect, useState } from 'react'
import backgroundForm from "../../asset/images/backgroudForm.jpg"
import Filed from '../../components/filed/Filed'
import Input from '../../components/input/Input'
import Button from '../../components/button/Button'
import { useFormik } from "formik";
import * as Yup from "yup";
import { IconEyeClose, IconEyeOpen } from '../../components/icons'
import Label from '../../components/label/Label'
import { motion } from "framer-motion"
import iconSuccess from "../../asset/images/iconSuccess.png"
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../constans/url'
import { toast } from 'react-toastify'

export default function EnterOtp() {
  const location = useLocation();
  const [togglePassword, setTogglePassword] = useState(true);
  const [togglePasswordCf, setTogglePasswordCf] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [stateEmail, setStateEmail] = useState("");
  const formik = useFormik({
    initialValues: {
      password: "",
      passwordCf: ""
    },
    validationSchema: Yup.object({
      password: Yup.string().min(8).required(),
      passwordCf: Yup.string().oneOf([Yup.ref('password'), null], "Password must match").required()
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      // call api
      axios.post(`${BASE_URL}/user/reset-password`, {
        email: stateEmail,
        password: values.password,
      }).then((res) => {
        setResetSuccess(true);
      }).catch((err) => {
        toast.error(err.response?.data.messages)
      }).finally(() => {
        setSubmitting(false);
      })
    }
  })
  useEffect(() => {
    setStateEmail(location.state.email);
  }, [location])

  return (
    <div className='flex items-center justify-center h-screen bg-center'
      style={{
        backgroundImage: `url(${backgroundForm})`
      }}
    >
      {!resetSuccess &&
        (<motion.form
          animate={{ y: [70, 0], opacity: [0, 1] }}
          transition={{ duration: 1 }}
          onSubmit={formik.handleSubmit} className='bg-white w-full max-w-[454px] p-5 px-8 rounded-md'>
          <h2 className='mb-3 text-3xl font-bold text-center'>New Password</h2>
          <span className='block mb-6 text-xs text-gray-400 w-full max-w-[300px]  text-center mx-auto'>Please create a new password</span>
          <Filed className="flex flex-col w-full gap-2 mt-3 mb-4 filed" >
            <Label htmlFor='password' className="font-medium">Password</Label>
            <Input
              type={togglePassword ? 'password' : 'text'}
              name="password"
              className="w-full h-12 p-3 border rounded-md border-graycustom bg-input focus:border-bluecustom"
              {...formik.getFieldProps('password')}
            >
              {togglePassword ? <IconEyeClose
                className='absolute -translate-y-1/2 cursor-pointer right-3 top-1/2'
                onClick={() => setTogglePassword(false)}
              ></IconEyeClose>
                : <IconEyeOpen
                  className='absolute -translate-y-1/2 cursor-pointer right-3 top-1/2'
                  onClick={() => setTogglePassword(true)}
                ></IconEyeOpen>
              }
            </Input>
          </Filed>
          {formik.touched.password && formik.errors.password && <span className='text-xs italic font-medium text-red-500'>*{formik.errors.password}</span>}
          <Filed className="flex flex-col w-full gap-2 mt-3 mb-4 filed" >
            <Label htmlFor='passwordCf' className="font-medium">Password Confirm</Label>
            <Input
              type={togglePasswordCf ? 'password' : 'text'}
              name="passwordCf"
              className="w-full h-12 p-3 border rounded-md border-graycustom bg-input focus:border-bluecustom"
              {...formik.getFieldProps('passwordCf')}
            >
              {togglePasswordCf ? <IconEyeClose
                className='absolute -translate-y-1/2 cursor-pointer right-3 top-1/2'
                onClick={() => setTogglePasswordCf(false)}
              ></IconEyeClose>
                : <IconEyeOpen
                  className='absolute -translate-y-1/2 cursor-pointer right-3 top-1/2'
                  onClick={() => setTogglePasswordCf(true)}
                ></IconEyeOpen>
              }
            </Input>
          </Filed>
          {formik.touched.passwordCf && formik.errors.passwordCf && <span className='text-xs italic font-medium text-red-500'>*{formik.errors.passwordCf}</span>}
          <Button
            disabled={formik.isSubmitting}
            type="submit" className="mt-3 font-semibold text-white button-default bg-button">Reset Password</Button>
        </motion.form>)}
      {resetSuccess &&

        (
          <motion.div
            animate={{ opacity: [0, 1] }}
            className="bg-white w-full max-w-[400px] p-7 rounded-md flex flex-col items-center gap-6 shadow-md">
            <motion.img
              animate={{ scale: [0.2, 1.3, 1] }}
              transition={{ type: "spring", duration: 0.5 }}
              className='w-[100px] h-[100px] rounded-full'
              src={iconSuccess} alt="" />
            <h3 className='text-2xl font-semibold text-blue-600'>Congratulations!</h3>
            <p className='text-xs font-medium'>You successfully reset the password!</p>
            <NavLink to={"/login"} className="w-full">
              <Button className="mt-3 font-semibold text-white button-default bg-button">Go to Home</Button>
            </NavLink>
          </motion.div>
        )}
    </div>
  )
}
