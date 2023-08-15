"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusSquare } from "lucide-react"
import { redirect } from "next/navigation"
import { ReactElement, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SubmitButton } from "~/components/SubmitButton"
import { WeightInput } from "~/components/WeightInput"
import { Button } from "~/components/ui/button"
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { createWeight } from "~/lib/db/actions/profiles.actions"
import { createProfileWeightSchema } from "~/lib/db/schema"
import { useNotify } from "~/lib/toast"

export const AddProfileWeightForm = ({
  onSubmit,
}: {
  onSubmit: typeof createWeight
}): ReactElement => {
  const form = useForm<z.infer<typeof createProfileWeightSchema>>({
    resolver: zodResolver(createProfileWeightSchema),
    defaultValues: {
      value: undefined,
    },
  })

  const [isPending, startTransition] = useTransition()

  const notify = useNotify()

  const handleSubmit = (values: z.infer<typeof createProfileWeightSchema>) => {
    const promise = onSubmit(values)
    notify({
      type: "promise",
      error: "Error",
      success: "Success",
      loading: "Loading",
      promise,
    })
    startTransition(async () => {
      await promise
      redirect(`/profile`)
    })
  }

  return (
    <Dialog>
      <Button className="hidden sm:flex" asChild>
        <DialogTrigger>
          <PlusSquare className="h-5 w-5" />
          <span>Ajouter une pesée</span>
        </DialogTrigger>
      </Button>
      <Button className="flex sm:hidden" size="icon" asChild>
        <DialogTrigger>
          <PlusSquare className="h-5 w-5" />
          <span className="sr-only">Ajouter une pesée</span>
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle pesée</DialogTitle>
          <DialogDescription>
            Vous pourrez ensuite voir l&apos;historique de votre poids avec la
            nouvelle valeur.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <WeightInput
              control={form.control}
              name="value"
              max={150000}
              min={30000}
            />
            <SubmitButton isPending={isPending} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
