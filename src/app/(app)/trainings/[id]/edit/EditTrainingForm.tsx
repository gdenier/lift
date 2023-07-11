"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { redirect } from "next/navigation"
import { ReactElement, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SubmitButton } from "~/components/SubmitButton"
import { Form } from "~/components/ui/form"
import { editTraining } from "~/lib/db/actions/trainings"
import { Exercice, editTrainingSchema } from "~/lib/db/schema"
import { createFormData } from "~/lib/utils"
import { MetadataFormPart } from "./MetadataFormPart"
import { ExercicesFormPart } from "./ExercicesFormPart"

export const EditTrainingForm = ({
  onSubmit,
  defaultValues,
  exercices,
}: {
  onSubmit: typeof editTraining
  defaultValues: z.infer<typeof editTrainingSchema>
  exercices: Exercice[]
}): ReactElement => {
  const form = useForm<z.infer<typeof editTrainingSchema>>({
    resolver: zodResolver(editTrainingSchema),
    defaultValues,
  })

  const [isPending, startTransition] = useTransition()

  const handleSubmit = (values: z.infer<typeof editTrainingSchema>) => {
    startTransition(async () => {
      await onSubmit(values)
      redirect(`/trainings/${values.id}`)
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-2"
      >
        <MetadataFormPart />
        <ExercicesFormPart exercices={exercices} />
        <SubmitButton isPending={isPending} />
      </form>
    </Form>
  )
}
