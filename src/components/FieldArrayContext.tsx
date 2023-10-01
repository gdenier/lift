import { ReactElement, ReactNode, createContext, useContext } from "react"
import {
  FieldArrayPath,
  FieldValues,
  UseFieldArrayReturn,
} from "react-hook-form"

type FieldArrayContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends
    FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = "id",
> = Record<
  TFieldArrayName,
  UseFieldArrayReturn<TFieldValues, TFieldArrayName, TKeyName>
>

const FieldArrayContext = createContext<{
  fields: FieldArrayContextValue
} | null>(null)

export const FieldArrayContextProvider = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends
    FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = "id",
>({
  children,
  fields,
}: {
  children: ReactNode
  fields: FieldArrayContextValue<TFieldValues, TFieldArrayName, TKeyName>
}): ReactElement => {
  return (
    <FieldArrayContext.Provider
      value={{ fields: fields as unknown as FieldArrayContextValue }}
    >
      {children}
    </FieldArrayContext.Provider>
  )
}

export const useFieldArrayContext = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends
    FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = "id",
>(
  name: TFieldArrayName
): UseFieldArrayReturn<TFieldValues, TFieldArrayName, TKeyName> => {
  const context = useContext(FieldArrayContext)
  if (!context)
    throw new Error(
      "Can't use useFieldArrayContext outside of FieldArrayContext"
    )

  return context.fields[name] as unknown as UseFieldArrayReturn<
    TFieldValues,
    TFieldArrayName,
    TKeyName
  >
}
