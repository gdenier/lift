"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { redirect } from "next/navigation"
import { ReactElement, useTransition } from "react"
import { useForm } from "react-hook-form"
import { SubmitButton } from "~/components/SubmitButton"
import { Form } from "~/components/ui/form"
import {
  deleteTraining,
  editTraining,
} from "~/lib/db/actions/trainings.actions"
import { EditTraining, Exercice, editTrainingSchema } from "~/lib/db/schema"
import { MetadataFormPart } from "./EditTrainingForm/MetadataFormPart"
import { ExercicesFormPart } from "./EditTrainingForm/ExercicesFormPart"
import { buttonVariants } from "~/components/ui/button"
import Link from "next/link"
import { EditTrainingHeader } from "./EditTrainingForm/EditTrainingHeader"

export const EditTrainingForm = ({
  onSubmit,
  defaultValues,
  exercices,
  deletion,
}: {
  onSubmit: typeof editTraining
  deletion: typeof deleteTraining
  defaultValues: EditTraining
  exercices: Exercice[]
}): ReactElement => {
  const form = useForm<EditTraining>({
    resolver: zodResolver(editTrainingSchema as any), // FIXME: remove cast when solution for Zod Readonly
    defaultValues,
  })

  const [isUpdatePending, startUpdateTransition] = useTransition()

  const handleSubmit = (values: EditTraining) => {
    startUpdateTransition(async () => {
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
        <EditTrainingHeader
          training={defaultValues}
          isLoading={isUpdatePending}
        />
        <MetadataFormPart />
        <ExercicesFormPart exercices={exercices} />
        <div className="flex w-full justify-end gap-2">
          <Link
            href={`/trainings/${defaultValues.id}`}
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Annuler
          </Link>
          <SubmitButton isLoading={isUpdatePending} />
        </div>
      </form>
    </Form>
  )
}
