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
} from "~/lib/db/actions/trainings.actions.old"
import {
  EditTrainingSchema,
  Exercice,
  editTrainingSchema,
} from "~/lib/db/schema"
import { MetadataFormPart } from "./MetadataFormPart"
import { ExercicesFormPart } from "./ExercicesFormPart"
import { Button, buttonVariants } from "~/components/ui/button"
import Link from "next/link"
import { RotateCw, Trash, Undo2 } from "lucide-react"
import { infer } from "zod"

export const EditTrainingForm = ({
  onSubmit,
  defaultValues,
  exercices,
  deletion,
}: {
  onSubmit: typeof editTraining
  deletion: typeof deleteTraining
  defaultValues: EditTrainingSchema
  exercices: Exercice[]
}): ReactElement => {
  const form = useForm<EditTrainingSchema>({
    resolver: zodResolver(editTrainingSchema as any), // FIXME: remove cast when solution for Zod Readonly
    defaultValues,
  })

  const [isUpdatePending, startUpdateTransition] = useTransition()
  const [isDeletePending, startDeleteTransition] = useTransition()

  const handleSubmit = (values: EditTrainingSchema) => {
    startUpdateTransition(async () => {
      await onSubmit(values)
      redirect(`/trainings/${values.id}`)
    })
  }

  const onDelete = () => {
    startDeleteTransition(async () => {
      await deletion(defaultValues.id)
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-2"
      >
        <div className="flex w-full items-center justify-between gap-2">
          <h2 className="w-full text-2xl font-semibold leading-none tracking-tight">
            {defaultValues.title}
          </h2>
          <div className="flex w-full justify-end gap-2">
            <Link
              href={`/trainings/${defaultValues.id}`}
              className={buttonVariants({
                variant: "outline",
                size: "icon",
              })}
            >
              <Undo2 />
            </Link>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              disabled={isDeletePending}
              onClick={onDelete}
            >
              {isDeletePending ? (
                <RotateCw className="h-5 w-5 animate-spin" />
              ) : (
                <Trash />
              )}
            </Button>
            <SubmitButton isPending={isUpdatePending} text={false} />
          </div>
        </div>
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
          <SubmitButton isPending={isUpdatePending} />
        </div>
      </form>
    </Form>
  )
}
