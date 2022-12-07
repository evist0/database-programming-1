import type { FC } from 'react'
import React from 'react'

import type { User } from '/client/shared/api'
import { login } from '/client/shared/api'
import { isTooManyRequestsError } from '/client/shared/lib/error-utils'
import { FormInput } from '/client/shared/ui/form-input'

import { LoadingButton } from '@mui/lab'
import { Link, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'

import type { LoginData } from './model'
import { defaultValues, resolver, FIELD_NAME_USERNAME, FIELD_NAME_PASSWORD } from './model'

type Props = {
  onLogin?: (user: User) => void
}

export const LoginForm: FC<Props> = ({ onLogin }) => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    setError
  } = useForm<LoginData>({ defaultValues, resolver })

  const onSubmit = async ({ username, password }: LoginData): Promise<void> => {
    try {
      const user = await login(username, password)

      if (onLogin) {
        onLogin(user)
      }
    } catch (e: unknown) {
      if (isTooManyRequestsError(e)) {
        // TODO: тостер "Много запросов"
        return
      }

      setError(FIELD_NAME_USERNAME, {
        message: 'Неправильный логин или пароль'
      })
    }
  }

  return (
    <Stack width={'100%'} component={'form'} spacing={2} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <FormInput name={FIELD_NAME_USERNAME} control={control} label={'Имя пользователя'} />
        <FormInput name={FIELD_NAME_PASSWORD} control={control} label={'Пароль'} type={'password'} />
      </Stack>

      <Stack alignItems={'center'} spacing={2}>
        <LoadingButton type={'submit'} variant={'contained'} size={'large'} fullWidth={true} loading={isSubmitting}>
          Войти
        </LoadingButton>

        <Link href="#">Забыли пароль?</Link>
      </Stack>
    </Stack>
  )
}