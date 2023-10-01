import { db } from "~/lib/db"
import { EditTrainingForm } from "./EditTrainingForm"
import {
  editTraining,
  deleteTraining,
  getTraining,
} from "~/lib/db/actions/trainings.actions"
import { notFound } from "next/navigation"
import { EditTraining } from "~/lib/db/schema"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function EditTrainingPage({
  params,
}: {
  params: { id: string }
}) {
  const training = await getTraining(params)

  const exercices = await db.query.exercices.findMany()

  if (!training) return notFound()

  return (
    <>
      <EditTrainingForm
        defaultValues={training as EditTraining}
        onSubmit={editTraining}
        exercices={exercices}
        deletion={deleteTraining}
      />
    </>
  )
}
