import { useCallback, type FC } from "react"
import type { FieldValues } from "react-hook-form"

import { AddCategoryForm } from "~popup-component/add-category/add-category-form"
import { useAddCategory } from "~popup-component/hooks/use-add-category"

type AddCategoryProps = {
  apiKey: string
  onSuccess: () => void
}

export const AddCategory: FC<AddCategoryProps> = ({ apiKey, onSuccess }) => {
  const { mutate, isPending, isSuccess, isError, reset, error, data, failureReason } = useAddCategory(apiKey, onSuccess)

  const addCategory = useCallback(
    (values: FieldValues) => {
      const name = values.name as string

      mutate({ name })
    },
    [mutate]
  )

  const onBlur = useCallback(() => {
    reset()
  }, [reset])

  console.dir({ isPending, isSuccess, isError, error, data, failureReason }, { depth: Infinity })

  return (
    <AddCategoryForm
      onSubmit={addCategory}
      onBlur={onBlur}
      isSubmitting={isPending}
      size="small"
      resetForm={isSuccess}
      errorResponse={isError && "Could not add category, try again."}
    />
  )
}
