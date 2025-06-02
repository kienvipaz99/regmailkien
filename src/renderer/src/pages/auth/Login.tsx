const Login = (): JSX.Element => {
  return <></>
  // const { t } = useTranslation()
  // const { mutate: Login, isPending } = useAuthLogin()
  // const { user } = useAuthProvider()
  // const { data: his } = useGetHis()
  // const validateSchemaLogin = object().shape({
  //   username: string().required(t('please_enter_email')).email(t('email_invalid')),
  //   password: string().required(t('please_enter_password'))
  // })
  // const submitForm = async (
  //   value: ILogin,
  //   { setValues, setFieldTouched }: FormikHelpers<ILogin>
  // ): Promise<void> => {
  //   Login(value, {
  //     onSettled: (result) => {
  //       if (result?.status === 'error') {
  //         setValues({ ...value, password: '' })
  //         setFieldTouched('password', false)
  //       }
  //     }
  //   })
  // }

  // const formik = useFormik<ILogin>({
  //   initialValues: { username: user?.email ?? '', password: user?.password ?? '' },
  //   validationSchema: validateSchemaLogin,
  //   onSubmit: submitForm
  // })

  // return (
  //   <LayoutBannerRules>
  //     <LayoutAuthForm>
  //       <form className="mt-5 space-y-4 w-full" onSubmit={formik.handleSubmit}>
  //         <InputField formik={formik} name="username" placeholder={`${t(`enter_email`)}`} />
  //         <InputPasswordField formik={formik} name="password" placeholder={`${t(`enter_pass`)}`} />

  //         <ButtonFlowbite
  //           type="submit"
  //           color="blue"
  //           isProcessing={isPending}
  //           className="min-w-[250px] f w-full mx-auto font-semibold"
  //         >
  //           {t('login')}
  //         </ButtonFlowbite>
  //         <Link
  //           to={'https://quanly.phanmemmkt.vn/vi/forgot-password'}
  //           className="text-right w-full block text-blue-500 text-[14px]"
  //           target="_blank"
  //         >
  //           {t('forgot_pass')}
  //         </Link>

  //         <div className="flex flex-nowrap gap-2 justify-center">
  //           <p className="whitespace-nowrap text-[14px]">{t('don_have_account')}</p>
  //           <Link to={'/'} className="text-blue-500 text-[14px]">
  //             {t('create_acc')}
  //           </Link>
  //         </div>
  //         <InputCopy
  //           name="his"
  //           value={his && typeof his === 'string' ? his : ''}
  //           readOnly
  //           disabled
  //         />
  //       </form>
  //     </LayoutAuthForm>
  //   </LayoutBannerRules>
  // )
}

export default Login
