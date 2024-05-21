import { shouldOpenModal, closeModal } from '@/lib/utils/modalUtils';
import { useMainContext } from '@/providers/mainContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { AvatarSelect } from '../auth/AvatarSelect';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { handleError } from '@/lib/utils/utils';
import { loginSchema, signupSchema } from '@/lib/validationSchema';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { authenticate, setCookie } from '@/lib/utils/authUtils';
import toast from 'react-hot-toast';
import { createUser, loginUser } from '@/lib/controllers/apiController';
import {
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const PlayModal = () => {

  const t = useTranslations();
  const context = useMainContext();

  type FormType = 'login' | 'signup'
  const [formType, setFormType] = useState<FormType>('login')
  const [selectedAvatar, setSelectedAvatar] = useState('avatar1')

  const thisLoginSchema = loginSchema(t)
  const thisSignupSchema = signupSchema(t)

  const form = useForm<z.infer<typeof thisLoginSchema>>({
    resolver: zodResolver(thisLoginSchema)
  })

  useEffect(() => {
    form.setValue('nickname', '');
    form.setValue('password', '');
    form.reset();

  }, [formType,form])

  async function onSubmitLogin(values: z.infer<typeof thisLoginSchema>) {
    console.log('onSubmitLogin', values)

    await loginUser(values, (data: any) => {
      // Save token and user details
      authenticate(data)

      showToaster('loginSuccess')

      onCloseModal()

      context.setSceneState('lobbyScene');
      
    }
      , (error: any) => {
        const { message, fieldErrors } = error.response.data;
        //handleError(error);
        if (fieldErrors) {
          Object.keys(fieldErrors).forEach(field => {
            form.setError(field as keyof typeof values, {
              type: 'server',
              message: fieldErrors[field],
            });
          });

          console.log('form errors', form.formState.errors)
        }
      }
    )
  }

  async function onSubmitSignup(values: z.infer<typeof thisSignupSchema>) {

    console.log('onSubmitLogin', values)

    await createUser({ ...values, avatar: selectedAvatar }, (data: any) => {
      // Save token and user details
      setCookie('access_token', data.token);
      localStorage.setItem('access_token', data.token);

      showToaster('signupSuccess')
      setFormType('login')

    }
      , (error: any) => {
        const { message, fieldErrors } = error.response.data;
        //handleError(error);
        if (fieldErrors) {
          Object.keys(fieldErrors).forEach(field => {
            form.setError(field as keyof typeof values, {
              type: 'server',
              message: fieldErrors[field],
            });
          });
        }
      }
    )

  }

  const onCloseModal = () => {
    form.reset()
    setFormType('login')
    closeModal(context, 'playModal');
  }

  const showToaster = (type: 'loginSuccess' | 'signupSuccess') => {

    let msg = ''
    switch (type) {
      case 'loginSuccess':
        msg = t('ToastMsg.loginSuccess')
        break;
      case 'signupSuccess':
        msg = t('ToastMsg.signupSuccess')
        break;
      default:
        return;
    }

    toast.success(msg);
  }

  const shouldOpen = shouldOpenModal(context, 'playModal');

  return shouldOpen ? (
    <div>
      <Form {...form} >
        <AlertDialog open={true} onOpenChange={() => onCloseModal()}>
<AlertDialogOverlay />

          <AlertDialogContent className="sm:max-w-[425px]" >
   
            <AlertDialogHeader>
            <AlertDialogCancel className={`w-12 h-12 border-none items-center text-center font-bold justify-center mx-auto mr-2 ${form.formState.isSubmitting ? 'hidden': 'block'}`}  type='button' >X</AlertDialogCancel>
              <AlertDialogTitle>{formType === 'login' ? t('PlayModal.title-login') : t('PlayModal.title-signup')}</AlertDialogTitle>
              <AlertDialogDescription>
                {formType === 'login' ? t('PlayModal.desc-login') : t('PlayModal.desc-signup')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
              {formType === 'signup' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="avatar" className="text-right">
                    {t('PlayModal.avatar')}
                  </Label>
                  <div className='ml-16 col-span-2'><AvatarSelect onSelect={setSelectedAvatar} /></div>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nickname" className="text-right">
                  {t('PlayModal.nickname')}
                </Label>
                <Input
                  className="col-span-3"
                  placeholder={t('PlayModal.nickname')}
                  {...form.register("nickname")}
                />
                <div className="col-span-4 text-center">
                  <FormMessage className="w-full">{form.formState.errors.nickname?.type === 'server' ? t(`ZodErrors.server${form.formState.errors.nickname?.message}`) : form.formState.errors.nickname?.message}</FormMessage>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  {t('PlayModal.password')}
                </Label>
                <Input
                  className="col-span-3"
                  placeholder="*****"
                  {...form.register("password")}
                  type='password'
                />
                <div className="col-span-4 text-center">
                  <FormMessage className="w-full">{form.formState.errors.password?.type === 'server' ? t(`ZodErrors.server${form.formState.errors.password?.message}`) : form.formState.errors.password?.message}</FormMessage>
                </div>
              </div>
            </div>
            <AlertDialogFooter>
              <div className='flex justify-between items-center w-full px-4'>
                <Button
                  type='button'
                  onClick={() => setFormType(formType === 'login' ? 'signup' : 'login')}
                  variant='link'
                  disabled={form.formState.isSubmitting}
                  className='font-semibold cursor-pointer justify-start'
                >
                  {formType === 'login' ? t('PlayModal.span-signup') : t('PlayModal.span-login')}
                </Button>

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  onClick={formType === 'login' ? form.handleSubmit(onSubmitLogin) : form.handleSubmit(onSubmitSignup)}
                  className='justify-end'
                >
                  {formType === 'login' ? t('PlayModal.submitBtn-login') : t('PlayModal.submitBtn-signup')}
                </Button>
              </div>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Form>
    </div>
  ) : null;
}

export default PlayModal