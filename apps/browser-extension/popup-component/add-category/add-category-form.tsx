import { zodResolver } from "@hookform/resolvers/zod"
import { addCategoryBodySchema, type AddCategoryBody } from "@workspace/category/api/v1/add-category.schema"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { Plus } from "lucide-react"
import React, { useEffect, type FC } from "react"
import { useForm, type FieldValues } from "react-hook-form"

export type Size = "default" | "small"

type AddCategoryFormProps = {
  onSubmit: (values: FieldValues) => void
  onBlur: () => void
  isSubmitting?: boolean
  size?: Size
  errorResponse?: string
  defaultValues?: AddCategoryBody
  resetForm?: boolean
}

export const AddCategoryForm: FC<AddCategoryFormProps> = ({
  defaultValues,
  errorResponse,
  isSubmitting,
  onBlur,
  onSubmit,
  resetForm,
  size
}) => {
  const {
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    reset,
    resetField,
    setFocus
  } = useForm<AddCategoryBody>({
    resolver: zodResolver(addCategoryBodySchema),
    mode: "onChange",
    defaultValues
  })

  useEffect(() => {
    if (typeof errorResponse === "string" && errorResponse !== "") {
      setFocus("name")
    }
  }, [setFocus, errorResponse])

  useEffect(() => {
    if (resetForm) {
      reset()
    }
  }, [resetForm, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="categories">
      <div className="flex items-center gap-2">
        <Input
          {...register("name")}
          type="text"
          inputMode="text"
          disabled={isSubmitting}
          placeholder="Category name..."
          onBlur={() => {
            onBlur()

            const { name } = getValues()

            if (name === "") {
              resetField("name")
            }
          }}
          className={cn({
            "h-8": size === "small",
            "placeholder:font-light": size === "small"
          })}
        />
        <Button
          type="submit"
          form="categories"
          disabled={isSubmitting}
          className={cn("h-9 gap-1", { loading: isSubmitting, "h-8": size === "small" })}>
          <Plus size={18} />
          <span>Add</span>
        </Button>
      </div>
      {errors?.name?.message || errorResponse !== "" ? (
        <p className="absolute mt-1 rounded-md bg-red-50 px-2 py-1 text-sm text-red-600">
          {errors?.name?.message || errorResponse}
        </p>
      ) : null}
    </form>
  )
}
