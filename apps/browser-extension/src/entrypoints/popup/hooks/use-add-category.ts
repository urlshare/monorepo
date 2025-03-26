import { useMutation } from "@tanstack/react-query"
import type { AddCategoryBody, AddCategorySuccessResponse } from "@workspace/category/api/v1/add-category.schema"
import axios, { type AxiosError } from "axios"

import { API_BASE_URL } from "../utils/constants"

export const useAddCategory = (apiKey: string, onSuccess?: () => void) => {
  return useMutation<AddCategorySuccessResponse, AxiosError, AddCategoryBody>({
    mutationFn: (data: AddCategoryBody): Promise<AddCategorySuccessResponse> => {
      return axios.post(`${API_BASE_URL}/v1/category`, data, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      })
    },
    onSuccess
  })
}
