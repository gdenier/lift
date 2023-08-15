"use client"
import { ReactElement, useEffect, useState } from "react"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import {
  ControllerProps,
  FieldPath,
  FieldValues,
  PathValue,
  useFormContext,
} from "react-hook-form"
import { Slider } from "./ui/slider"
import { formatWeight } from "~/lib/utils"

export const WeightInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  defaultValue,
  max,
  min,
}: Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  max?: number
  min?: number
}): ReactElement => {
  const form = useFormContext()

  const [internalValue, setInternalValue] = useState<number | undefined>(
    defaultValue ? +defaultValue : undefined
  )

  useEffect(() => {
    form.setValue(name, internalValue as NonNullable<typeof defaultValue>)
  }, [form, internalValue, name])

  return (
    <FormItem>
      <FormLabel>Poids</FormLabel>
      <FormControl>
        <>
          <p>{formatWeight(internalValue ?? 0)}</p>
          <div className="flex items-center gap-1">
            <Input
              type="number"
              placeholder="00"
              name={name}
              defaultValue={defaultValue}
              onChange={(e) => {
                console.log(e.target.value)
                const kg = +e.target.value.split(".")[0]
                let gramme = e.target.value.split(".")[1] ?? "0"
                gramme =
                  gramme.length === 1
                    ? `${gramme}00`
                    : gramme.length === 2
                    ? `${gramme}0`
                    : gramme
                const weight = +`${kg}${gramme}`
                setInternalValue(weight)
              }}
              value={formatWeight(internalValue ?? 0, { withUnit: false })}
            />
            <p className="rounded bg-muted p-2 text-muted-foreground">
              {(internalValue ?? 0) > 999 ? "kg" : "g"}
            </p>
          </div>
          <Slider
            defaultValue={[defaultValue ? +defaultValue : 0]}
            value={[internalValue ?? 0]}
            max={max}
            min={min}
            step={50}
            onValueChange={(value) => setInternalValue(value[0])}
          />
        </>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}
