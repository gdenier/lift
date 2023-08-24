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
import { createTrainingSchema } from "~/lib/db/schema/trainings.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createTraining } from "~/lib/db/actions/trainings.actions"
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
import { useNotify } from "~/lib/toast"
import useSound from "use-sound"

export const AddTrainingDialog = ({
  trigger,
  onSubmit,
}: {
  trigger?: ReactNode
  onSubmit: typeof createTraining
}): ReactElement => {
  const form = useForm<z.infer<typeof createTrainingSchema>>({
    resolver: zodResolver(createTrainingSchema as any), // FIXME: remove cast when solution for Zod Readonly
    defaultValues: {
      title: "",
    },
  })

  const [isPending, startTransition] = useTransition()

  const notify = useNotify()

  const handleSubmit = (values: z.infer<typeof createTrainingSchema>) => {
    const promise = onSubmit(values)
    notify({
      type: "promise",
      error: "Error",
      success: "Success",
      loading: "Loading",
      promise,
    })
    startTransition(async () => {
      const id = await promise
      redirect(`/trainings/${id}`)
    })
  }

  return (
    <Dialog>
      {trigger || (
        <>
          <Button className="hidden sm:flex" asChild>
            <DialogTrigger>
              <PlusSquare className="h-5 w-5" />
              <span>Créer un entrainement</span>
            </DialogTrigger>
          </Button>
          <Button className="flex sm:hidden" size="icon" asChild>
            <DialogTrigger>
              <PlusSquare className="h-5 w-5" />
              <span className="sr-only">Créer un entrainement</span>
            </DialogTrigger>
          </Button>
        </>
      )}
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
