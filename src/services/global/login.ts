import { createGetRequest, createPostRequest } from '../axios'

// login user
export function login(params: any) {
  return createPostRequest(
    '/auth/vi/login',
    params
  )
}

// register user
export function register(params: any) {
  return createPostRequest(
    '/auth/v1/register',
    params
  )
}

// get user information
export function getUserInfo(params: any) {
  return createGetRequest(
    '/auth/v1/getUserInfo',
    params
  )
}

// forgot password
export function forgotPassword(params: any) {
  return createPostRequest(
    '/auth/v1/forgotPassword',
    params
  )
}

// reset password
export function resetPassword(params: any) {
  return createPostRequest(
    '/auth/v1/resetPassword',
    params
  )
}

// update user information
export function updateUserInfo(params: any) {
  return createPostRequest(
    '/auth/v1/updateUserInfo',
    params
  )
}

// update password
export function updatePassword(params: any) {
  return createPostRequest(
    '/auth/v1/updatePassword',
    params
  )
}

// logout
export function logout(params: any) {
  return createPostRequest(
    '/auth/v1/logout',
    params
  )
}
