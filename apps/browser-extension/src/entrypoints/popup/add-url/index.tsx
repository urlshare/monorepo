import { Check } from "lucide-react"
import React, { useCallback, useEffect, useState, type FC } from "react"

import type { CategoryVM } from "@workspace/category/models/category.vm"
import type { ScrappedMetadata } from "@workspace/metadata-scrapper/scrap-metadata"
import { Button } from "@workspace/ui/components/button"
import { LoadingIndicator } from "@workspace/ui/components/loading-indicator"
import { Separator } from "@workspace/ui/components/separator"

import { AddCategory } from "../add-category"
import { CategoryPicker } from "../category-picker"
import { CATEGORIES_STORAGE_KEY } from "../constants/storage"
import { useAddUrl } from "../hooks/use-add-url"
import { useCategories } from "../hooks/use-categories"
import { useLocalStorage } from "../hooks/use-local-storage"

type AddUrlProps = {
  apiKey: string
  url: string
  metadata: ScrappedMetadata | null
}

export const AddUrl: FC<AddUrlProps> = ({ apiKey, url, metadata }) => {
  const [categories, setCategories] = useLocalStorage<CategoryVM[]>(CATEGORIES_STORAGE_KEY, [])
  const { mutate, isPending, isSuccess, isError } = useAddUrl(apiKey)
  const { data, isSuccess: categoriesFetched, refetch } = useCategories(apiKey)

  useEffect(() => {
    if (categoriesFetched) {
      setCategories(data)
    }
  }, [categoriesFetched, data])

  const [selectedCategories, setSelectedCategories] = useState<CategoryVM["id"][]>([])

  const onCategorySelectionChange = useCallback(
    (categoryId: CategoryVM["id"]) => {
      const categoryListed = selectedCategories.indexOf(categoryId) !== -1
      const newSelection = categoryListed
        ? selectedCategories.filter((id) => categoryId !== id)
        : [...selectedCategories, categoryId]

      setSelectedCategories(newSelection)
    },
    [selectedCategories, setSelectedCategories]
  )

  const addUrl = useCallback(() => {
    mutate({ metadata, categoryIds: selectedCategories })
  }, [mutate, metadata, selectedCategories])

  return (
    <div className="flex flex-col gap-4 p-2">
      {categories.length > 0 ? (
        <div>
          <h2 className="text-lg font-medium">Categories</h2>
          <CategoryPicker
            description="optional"
            categories={categories}
            selectedCategories={selectedCategories}
            onCategorySelectionChange={onCategorySelectionChange}
          />
        </div>
      ) : (
        <div className="text-sm">No categories. Add some.</div>
      )}

      <AddCategory apiKey={apiKey} onSuccess={() => refetch()} />
      <Separator />

      {isError && <div>Could not add, try again.</div>}

      <div className="flex items-center gap-2">
        <Button onClick={addUrl} disabled={isPending || metadata === null}>
          Add URL
        </Button>
        {isPending ? <LoadingIndicator label="Adding the URL" className="text-gray-500" size={18} /> : null}
        {isSuccess ? <Check className="text-green-700" /> : null}
      </div>

      <p className="overflow-hidden text-ellipsis text-xs font-extralight">{url}</p>
    </div>
  )
}
