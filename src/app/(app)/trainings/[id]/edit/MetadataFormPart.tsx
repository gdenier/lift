"use client"

import { ReactElement } from "react"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { EditTrainingSchema, editTrainingSchema } from "~/lib/db/schema"

export const MetadataFormPart = (): ReactElement => {
  const form = useFormContext<EditTrainingSchema>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l&apos;entrainement</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'entrainement" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
