import { NotFound } from "~/components/NotFound"
import { db } from "~/lib/db"
import { EditTrainingForm } from "./EditTrainingForm"
import { editTraining, deleteTraining } from "~/lib/db/actions/trainings"
import { editTrainingSchema } from "~/lib/db/schema"
import { z } from "zod"
import { auth } from "@clerk/nextjs"
import { notFound, redirect } from "next/navigation"

export default async function EditTrainingPage({
  params,
}: {
  params: { id: string }
}) {
  const { userId } = auth()
  if (!userId) redirect("/sign-in")
  const training = await db.query.trainings.findFirst({
    with: {
      trainings_exercices: {
        with: {
          exercice: true,
          series: true,
        },
        orderBy: (trainings_exercices, { asc }) => [
          asc(trainings_exercices.order),
        ],
      },
    },
    where: (trainings, { eq, and }) =>
      and(eq(trainings.id, params.id), eq(trainings.userId, userId)),
  })

  const exercices = await db.query.exercices.findMany()

  if (!training) return notFound()

  const defaultValues: z.infer<typeof editTrainingSchema> = {
    ...training,
    trainings_exercices: training.trainings_exercices.map((tExercice) => ({
      exerciceId: tExercice.exercice.id,
      id: tExercice.id,
      order: tExercice.order,
      series: tExercice.series.map((serie) => ({
        repetition: serie.repetition ?? undefined,
        time: serie.time ?? undefined,
        id: serie.id,
        weight: serie?.weight ?? undefined,
        rest: serie.rest ?? undefined,
        order: serie.order,
      })),
    })),
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
