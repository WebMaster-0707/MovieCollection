import axios from 'axios'
import axiosRetry from 'axios-retry'
import { setupCache } from 'axios-cache-adapter'
import { environment } from '@/configs/environment'

const cache = setupCache({
  maxAge: 15 * 60 * 3000, // 15 minutes
})

export function createApiService(baseURL: string) {
  return axios.create({
    baseURL,
    timeout: 10000,
    adapter: cache.adapter,
  })
}

export const ApiService = createApiService(environment.apiUrl)
axiosRetry(ApiService, { retries: 1 })
