import axios, {
  AxiosResponse,
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios'

const BASE_URL = 'https://bootcamper.xyz/api/bootcamper/admin'

// create axios instance
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000
})

// request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error)
)

// response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<any, any>) => {
    if (response.status === 200) {
      return Promise.resolve(response)
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// attach token in request header
export function setAuthorization(token: string) {
  console.log('request token', token)
  axiosInstance.defaults.headers.common['Authorization'] = token
}

// create get requets
export function createGetRequest<T>(
  url: string,
  params: any
): Promise<AxiosResponse<any, any>> {
  return axiosInstance
    .get<T>(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      params
    })
    .then((res: AxiosResponse) => res)
}

// create post request
export function createPostRequest<T>(
  url: string,
  params: any
): Promise<AxiosResponse<any, any>> {
  return axiosInstance
    .post<T>(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      params
    })
    .then((res: AxiosResponse) => res)
}

export default axiosInstance
