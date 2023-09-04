import { Edit } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { getTraining } from "~/lib/db/actions/trainings.actions"
import { formatTime, formatWeight } from "~/lib/utils"

export const TrainingHeader = ({
  training,
}: {
  training: Awaited<ReturnType<typeof getTraining>>
}) => {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{training.title}</CardTitle>
        <Link
          href={`/trainings/${training.id}/edit`}
          className={buttonVariants()}
        >
          <Edit />
          Modifier
        </Link>
      </CardHeader>
      <CardContent className="flex flex-wrap justify-between gap-2">
        <p>Réalisé {training?.sessions?.length ?? "X"} fois</p>
        {training.sessions?.[0]?.createdAt ? (
          <p>
            Réalisé {training.sessions?.[0]?.createdAt.toLocaleString()} la
            derniere fois
          </p>
        ) : null}
        <p>{training.trainings_exercices.length} exercice(s)</p>
        <p>
          {training.trainings_exercices.reduce(
            (total, tExercice) => total + tExercice.series.length,
            0
          )}{" "}
          série(s)
        </p>
        <p>
          {formatWeight(
            training.trainings_exercices.reduce(
              (total, tExercice) =>
                total +
                tExercice.series.reduce(
                  (tWeight, serie) =>
                    tWeight + (serie?.weight ?? 0) * (serie.repetition ?? 1),
                  0
                ),
              0
            )
          )}{" "}
          soulevé
        </p>
        <p>
          ~
          {formatTime(
            training.trainings_exercices.reduce(
              (total, tExercice) =>
                total +
                tExercice.series.reduce(
                  // 60 represent the average execution time
                  // TODO: set default time on account level
                  (tTime, serie) => tTime + (serie?.rest ?? 120) + 60,
                  0
                ),
              0
            )
          )}{" "}
          d&apos;entrainement
        </p>
      </CardContent>
    </Card>
  )
}
