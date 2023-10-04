import { auth } from "@clerk/nextjs"
import { notFound, redirect } from "next/navigation"
import { NotFound } from "~/components/NotFound"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { getTraining } from "~/lib/db/actions/trainings.actions"
import { Exercice } from "~/lib/db/schema"
import { TrainingHeader } from "./TrainingHeader"
import { ExerciceRow } from "./ExerciceRow"
import { SupersetRow } from "./SupersetRow"

export default async function TrainingPage({
  params,
}: {
  params: { id: string }
}) {
  const training = await getTraining({ id: params.id })

  if (!training) return notFound()

  return (
    <div className="w-full">
      <TrainingHeader training={training} />

      <Card className="mt-2">
        <CardHeader>
          <CardTitle>Exercices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-4">
            {/* {training.steps.map((step, index) =>
              "superset" in step ? (
                <SupersetRow key={row.id} superset={row} index={index} />
              ) : (
                <ExerciceRow key={row.id} tExercice={row} />
              )
            )} */}
            {training.steps.map((step) =>
              step.superset != null ? (
                <SupersetRow key={step.superset!.id} step={step} />
              ) : (
                <ExerciceRow key={step.exercice!.id} step={step} />
              )
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
