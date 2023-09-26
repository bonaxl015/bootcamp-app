import React, { useState, forwardRef } from 'react'
import { TextInput, TextInputProps } from 'react-native-paper'
import { View, Text, NativeSyntheticEvent, TextInputFocusEventData, TextInputChangeEventData } from 'react-native'

type IRules = {
  required: boolean
  message: string
} | {
  validator?: (value: any) => Promise<any> | undefined
}

type InputTextProps = TextInputProps & {
  rules?: IRules[]
  isValidate?: boolean
  validateTrigger?: 'blur' | 'change' | undefined
}

const InputText: React.FC<InputTextProps> = (
  props: InputTextProps
) => {
  const {
    onBlur,
    onChange,
    validateTrigger,
    rules,
    value
  } = props
  const [isError, setIsError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const validate = () => new Promise((resolve, reject) => {
    if (rules?.length) {
      for (const rule of rules) {
        if ('required' in rule && rule.required) {
          if (!value) {
            setIsError(true)
            setErrorMessage(rule.message)
            reject(rule.message)
            return
          }
        }
        if ('validator' in rule && rule.validator) {
          try {
            rule.validator(value)
          } catch (error) {
            setIsError(true)
            setErrorMessage(error as string)
            reject(error)
            return
          }
        }
      }
      resolve(null)
    } else {
      console.error('Rules must be provided')
      reject()
    }
  })

  const handleBlur = (
    e: NativeSyntheticEvent<TextInputFocusEventData>
  ) => {
    if (validateTrigger === 'blur') {
      validate()
    }
    if (onBlur) {
      onBlur?.(e)
    }
  }

  const handleChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    if (validateTrigger === 'change') {
      validate()
    }
    if (onChange) {
      onChange?.(e)
    }
  }

  return (
    <>
      <TextInput
        {...props}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {isError && (
        <View>
          <Text>{errorMessage}</Text>
        </View>
      )}
    </>
  )
}

const Input = forwardRef((props: InputTextProps, ref: React.Ref<any>) =>
  <InputText {...props} ref={ref} />
)

export default Input
