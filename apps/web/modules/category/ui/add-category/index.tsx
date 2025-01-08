import React, { FC, useCallback, useState } from "react";
import { FieldValues } from "react-hook-form";

import { AddCategoryForm, type Size } from "./add-category-form";
import { api } from "@/trpc/react";

type AddCategoryProps = {
  onCategoryAdd: () => void;
  size?: Size;
};

export const AddCategory: FC<AddCategoryProps> = ({ onCategoryAdd, size = "default" }) => {
  const [errorResponse, setErrorResponse] = useState("");

  const {
    mutate: addCategory,
    isPending,
    isSuccess,
  } = api.categories.createCategory.useMutation({
    onSuccess: () => {
      setErrorResponse("");
      onCategoryAdd();
    },
    onError: (error) => {
      setErrorResponse(error.message);
    },
  });

  const onSubmit = useCallback(
    (values: FieldValues) => {
      const name = values.name as string;

      addCategory({ name });
    },
    [addCategory],
  );

  const onBlur = useCallback(() => {
    setErrorResponse("");
  }, [setErrorResponse]);

  return (
    <AddCategoryForm
      onSubmit={onSubmit}
      onBlur={onBlur}
      isSubmitting={isPending}
      size={size}
      errorResponse={errorResponse}
      resetForm={isSuccess}
    />
  );
};
