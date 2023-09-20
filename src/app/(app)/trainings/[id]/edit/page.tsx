import { db } from "~/lib/db"
import { EditTrainingForm } from "./EditTrainingForm"
import {
  editTraining,
  deleteTraining,
  getTraining,
} from "~/lib/db/actions/trainings.actions"
import { EditTrainingSchema } from "~/lib/db/schema"
import { z } from "zod"
import { auth } from "@clerk/nextjs"
import { notFound, redirect } from "next/navigation"
import { sortByOrder } from "~/lib/utils"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function EditTrainingPage({
  params,
}: {
  params: { id: string }
}) {
  const { userId } = auth()
  if (!userId) redirect("/sign-in")
  const training = await getTraining(params.id, userId)

  const exercices = await db.query.exercices.findMany()

  if (!training) return notFound()

  const defaultValues: EditTrainingSchema = {
    ...training,
    trainings_exercices: sortByOrder(training.trainings_exercices).map(
      (tExercice) => ({
        exerciceId: tExercice.exercice.id,
        id: tExercice.id,
        order: tExercice.order,
        series: sortByOrder(tExercice.series).map((serie) => ({
          repetition: serie.repetition ?? undefined,
          time: serie.time ?? undefined,
          id: serie.id,
          weight: serie?.weight ?? undefined,
          rest: serie.rest ?? undefined,
          order: serie.order,
        })),
      })
    ),
    trainings_supersets: sortByOrder(training.trainings_supersets).map(
      (tSuperset) => ({
        ...tSuperset,
        exercices: sortByOrder(tSuperset.exercices).map((sExercice) => ({
          id: sExercice.id,
          order: sExercice.order,
          exerciceId: sExercice.exerciceId,
        })),
        rounds: sortByOrder(tSuperset.rounds).map((round) => ({
          order: round.order,
          series: sortByOrder(round.series).map((serie) => ({
            order: serie.order,
            id: serie.id,
            weight: serie.weight ?? undefined,
            repetition: serie.repetition ?? undefined,
            time: serie.time ?? undefined,
          })),
          id: round.id,
        })),
      })
    ),
  }

  return (
    <>
      <EditTrainingForm
        defaultValues={defaultValues}
        onSubmit={editTraining}
        exercices={exercices}
        deletion={deleteTraining}
      />
    </>
  )
}
