import React, {
  useState,
  forwardRef,
  useImperativeHandle
} from 'react'
import { TextInput, TextInputProps } from 'react-native-paper'
import {
  View,
  Text,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputChangeEventData,
  StyleSheet
} from 'react-native'
import { globalColors } from '@/styles/colors'

type IRules = {
  required: boolean
  message: string
} | {
  validator?: (value: any) => Promise<any> | undefined
}

type IValidateTrigger = 'blur' | 'change' | undefined | IValidateTrigger[]

type InputTextProps = TextInputProps & {
  rules?: IRules[]
  isValidate?: boolean
  validateTrigger?: IValidateTrigger
}

const Input = forwardRef((
  props: InputTextProps,
  ref: React.Ref<any>
) => {
  const {
    onBlur,
    onChange,
    validateTrigger,
    rules
  } = props
  const [isError, setIsError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const validate = (text: string) => new Promise(async resolve => {
    if (rules?.length) {
      for (const rule of rules) {
        if ('required' in rule && rule.required) {
          if (!text || !text.trim()) {
            setIsError(true)
            setErrorMessage(rule.message)
            return
          }
        }
        if ('validator' in rule && rule.validator) {
          try {
            await rule.validator(text)
          } catch (error: any) {
            setIsError(true)
            setErrorMessage(error.message)
            return
          }
        }
      }
      setIsError(false)
      setErrorMessage('')
      resolve(null)
    } else {
      console.error('Rules must be provided')
    }
  })

  const handleBlur = (
    e: NativeSyntheticEvent<TextInputFocusEventData>
  ) => {
    if (validateTrigger?.includes('blur')) {
      validate(e.nativeEvent.text)
    }
    if (onBlur) {
      onBlur?.(e)
    }
  }

  const handleChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    if (validateTrigger?.includes('change')) {
      validate(e.nativeEvent.text)
    }
    if (onChange) {
      onChange?.(e)
    }
  }

  useImperativeHandle(ref, () => ({
    validate
  }))

  return (
    <>
      <View style={style.inputContainer}>
        <TextInput
          style={style.textInput}
          {...props}
          onBlur={handleBlur}
          onChange={handleChange}
          error={isError}
        />
        {isError && (
          <View style={style.errorContainer}>
            <Text style={style.errorText}>
              {errorMessage}
            </Text>
          </View>
        )}
      </View>
    </>
  )
})

const style = StyleSheet.create({
  inputContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  textInput: {
    marginBottom: 4,
  },
  errorContainer: {
    margin: 0,
    paddingHorizontal: 10
  },
  errorText: {
    color: globalColors.error,
    fontSize: 12
  }
})

export default Input
