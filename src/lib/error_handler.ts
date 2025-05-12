import { AxiosError } from "axios"

interface ServerError {
    error: string
} 

export const parseError = (error: AxiosError) => {
    return ((error as AxiosError).response?.data as ServerError).error
}