import { RotateCwIcon, TrashIcon, Undo2Icon } from "lucide-react"
import Link from "next/link"
import { ReactElement, useTransition } from "react"
import { SubmitButton } from "~/components/SubmitButton"
import { Button, buttonVariants } from "~/components/ui/button"
import { deleteTraining } from "~/lib/db/actions/trainings.actions"
import { EditTraining } from "~/lib/db/schema/training/trainings.schema"

export const EditTrainingHeader = ({
  training,
  isLoading,
}: {
  training: EditTraining
  isLoading: boolean
}): ReactElement => {
  const [isDeletePending, startDeleteTransition] = useTransition()

  const onDelete = () => {
    startDeleteTransition(async () => {
      await deleteTraining(training)
    })
  }

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <h2 className="w-full text-2xl font-semibold leading-none tracking-tight">
        {training.title}
      </h2>
      <div className="flex w-full justify-end gap-2">
        <Link
          href={`/trainings/${training.id}`}
          className={buttonVariants({
            variant: "outline",
            size: "icon",
          })}
        >
          <Undo2Icon />
        </Link>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          disabled={isDeletePending}
          onClick={onDelete}
        >
          {isDeletePending ? (
            <RotateCwIcon className="h-5 w-5 animate-spin" />
          ) : (
            <TrashIcon />
          )}
        </Button>
        <SubmitButton text={false} isLoading={isLoading} />
      </div>
    </div>
  )
}
