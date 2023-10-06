import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from 'react-native'
import { Button, TextInput, Snackbar } from 'react-native-paper'
import Input from '@/components/input'
import { emailPattern, passwordPattern } from '@/utils/patterns'
import message from './error-message'
import { login, register } from '@/services/global/login'

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false)
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<any>({
    visible: false,
    message: ''
  })
  const emailRef = useRef<any>(null)
  const passwordRef = useRef<any>(null)
  const nameRef = useRef<any>(null)

  const navLoginRegister: () => void = () => {
    resetFields()
    setIsRegister(prevState => !prevState)
  }

  const submitLoginRegister = async (): Promise<void> => {
    try {
      const result: boolean = await validateEmail()
      let res: any
      if (!result) return
      setIsLoading(true)
      const params = {
        name: isRegister ? name : undefined,
        email,
        password
      }
      res = isRegister ? await register(params) : await login(params)
      setIsLoading(false)
    } catch(error: any) {
      setErrorMessage({
        visible: true,
        message: error.message
      })
      setIsLoading(false)
    }
  }

  const validateEmail = async (): Promise<boolean> => {
    const promiseArr = [
      emailRef?.current.validate(email),
      passwordRef?.current.validate(password),
      isRegister && nameRef?.current.validate(name)
    ]
    await Promise.all(promiseArr)
    if (isRegister) {
      return (
        !emailRef?.current.getErrorState() &&
        !passwordRef?.current.getErrorState() &&
        !nameRef?.current.getErrorState()
      )
    }
    return (
      !emailRef?.current.getErrorState() &&
      !passwordRef?.current.getErrorState()
    )
  }

  const resetFields = (): void => {
    setName('')
    setEmail('')
    setPassword('')
    emailRef?.current?.resetField()
    passwordRef?.current?.resetField()
    nameRef?.current?.resetField()
  }

  const dismissSnackbar = (): void => {
    setErrorMessage({
      visible: false,
      message: ''
    })
  }

  return (
    <SafeAreaView style={style.container}>
      <View style={style.formView}>
        <Text style={style.headerText}>
          {isRegister ? 'Sign Up' : 'Login'}
        </Text>
        <View style={style.formContainer}>
          {isRegister && (
            <Input
              ref={nameRef}
              mode="outlined"
              label="Name"
              placeholder="Name"
              value={name}
              onChangeText={value => setName(value)}
              validateTrigger="change"
              rules={[
                {
                  required: true,
                  message: message.nameNotEmpty
                }
              ]}
            />
          )}
          <Input
            ref={emailRef}
            mode="outlined"
            label="Email"
            placeholder="Email"
            value={email}
            onChangeText={value => setEmail(value)}
            validateTrigger="change"
            rules={[
              {
                required: true,
                message: message.emailNotEmpty
              },
              {
                validator: value => {
                  if (!emailPattern.test(value)) {
                    return Promise.reject(
                      new Error(message.emailInvalid)
                    )
                  }
                  return Promise.resolve()
                }
              }
            ]}
          />
          <Input
            ref={passwordRef}
            mode="outlined"
            label="Password"
            placeholder="Password"
            secureTextEntry={!isShowPassword}
            value={password}
            onChangeText={value => setPassword(value)}
            right={
              <TextInput.Icon
                onPress={() => setIsShowPassword(prev => !prev)}
                icon={isShowPassword ? 'eye' : 'eye-off'}
              />
            }
            validateTrigger="change"
            rules={[
              {
                required: true,
                message: message.passwordNotEmpty
              },
              {
                validator: value => {
                  if (!passwordPattern.test(value)) {
                    return Promise.reject(
                      new Error(message.passwordInvalid)
                    )
                  }
                  return Promise.resolve()
                }
              }
            ]}
          />
        </View>
      </View>
      <View style={style.buttonView}>
        <Button
          mode="contained"
          loading={isLoading}
          disabled={isLoading}
          onPress={submitLoginRegister}
          style={style.button}
        >
          <Text style={style.buttonText}>
            {isRegister? 'sign up' : 'login'}
          </Text>
        </Button>
        <View style={style.bottomText}>
          <Text>Already have an account?</Text>
          <TouchableOpacity
            onPress={navLoginRegister}
            activeOpacity={0.7}
          >
            <Text style={style.isRegisterText}>
              {isRegister ? 'Login' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Snackbar
        visible={errorMessage.visible}
        onDismiss={dismissSnackbar}
        action={{
          label: 'Close',
          onPress: () => dismissSnackbar(),
        }}>
        {errorMessage.message}
      </Snackbar>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 16,
    marginHorizontal: 24
  },
  formView: {
    flex: 3.5,
    paddingTop: 90
  },
  buttonView: {
    flex: 1
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 36,
    marginBottom: 20
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 20
  },
  button: {
    marginVertical: 20
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  bottomText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6
  },
  isRegisterText: {
    color: '#663399',
    fontWeight: 'bold'
  }
})

export default Login
