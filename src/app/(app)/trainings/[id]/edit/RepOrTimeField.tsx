"use client"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { EditTrainingSchema } from "~/lib/db/schema"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

export const RepOrTimeField = ({ name }: { name: string }) => {
  const form = useFormContext<EditTrainingSchema>()

  const [selected, setSelected] = useState(
    form.getValues(`${name}.time` as any) !== undefined ? "time" : "repetition"
  )
  const [open, setOpen] = useState(false)

  const onChange = (value: string) => {
    if (value === "repetition") {
      form.setValue(`${name}.time` as any, undefined)
    } else {
      form.setValue(`${name}.repetition` as any, undefined)
    }
    setSelected(value)
  }

  return (
    <div className="flex w-[110px] min-w-[110px] max-w-[110px] flex-col">
      <Select
        defaultValue={selected}
        onValueChange={onChange}
        open={open}
        onOpenChange={() => {
          // hack for radix select on touch device
          // issue: https://github.com/radix-ui/primitives/issues/1658
          if (open)
            setTimeout(() => {
              setOpen((open) => !open)
            }, 50)
          else setOpen((open) => !open)
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="repetition">Répétition</SelectItem>
          <SelectItem value="time">Temps</SelectItem>
        </SelectContent>
      </Select>
      {selected === "repetition" ? (
        <>
          <FormField
            control={form.control}
            name={`${name}.repetition` as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Répétition</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ) : (
        <>
          <FormField
            control={form.control}
            name={`${name}.time` as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Temps d&apos;exercice</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="120" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  )
}
