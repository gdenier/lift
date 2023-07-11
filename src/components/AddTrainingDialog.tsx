"use client"
import { ReactElement, ReactNode, useState, useTransition } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createTrainingSchema } from "~/lib/db/schema/trainings"
import { zodResolver } from "@hookform/resolvers/zod"
import { createTraining } from "~/lib/db/actions/trainings"
import { createFormData } from "~/lib/utils"
import { redirect } from "next/navigation"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { SubmitButton } from "./SubmitButton"
import { RotateCw, SaveIcon } from "lucide-react"
import { PlusSquare } from "lucide-react"

export const AddTrainingDialog = ({
  trigger,
  onSubmit,
}: {
  trigger?: ReactNode
  onSubmit: typeof createTraining
}): ReactElement => {
  const form = useForm<z.infer<typeof createTrainingSchema>>({
    resolver: zodResolver(createTrainingSchema),
    defaultValues: {
      title: "",
    },
  })

  const [isPending, startTransition] = useTransition()

  const handleSubmit = (values: z.infer<typeof createTrainingSchema>) => {
    startTransition(async () => {
      const id = await onSubmit(createFormData(values))
      redirect(`/trainings/${id}`)
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <PlusSquare className="h-5 w-5" />
            Créer un entrainement
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouvel entrainement</DialogTitle>
          <DialogDescription>
            Vous pourrez ensuite ajouter des exercices et modifier les
            paramètres de routines.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
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
            <SubmitButton isPending={isPending} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
