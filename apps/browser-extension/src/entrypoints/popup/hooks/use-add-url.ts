import { useMutation } from "@tanstack/react-query"
import type { CategoryId } from "@workspace/category/id/category-id.schema"
import type { ScrappedMetadata } from "@workspace/metadata-scrapper/scrap-metadata"
import type { ApiKey } from "@workspace/user/api-key/api-key.schema"
import axios from "axios"

import { API_BASE_URL } from "../utils/constants"

export const useAddUrl = (apiKey: ApiKey) =>
  useMutation({
    mutationFn: ({ metadata, categoryIds }: { metadata: ScrappedMetadata; categoryIds: CategoryId[] }) =>
      axios.post(
        `${API_BASE_URL}/v1/url`,
        { metadata, categoryIds },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`
          }
        }
      )
  })
