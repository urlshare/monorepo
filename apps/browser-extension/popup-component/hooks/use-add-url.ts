import { useMutation } from "@tanstack/react-query"
import axios from "axios"

import { API_BASE_URL } from "~popup-component/utils/constants"

export const useAddUrl = (apiKey: string) =>
  useMutation({
    mutationFn: ({ url, categoryIds }: any) =>
      axios.post(
        `${API_BASE_URL}/v1/url`,
        { url, categoryIds },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`
          }
        }
      )
  })
