import { Edit } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { getTraining } from "~/lib/db/actions/trainings.actions"
import { Training } from "~/lib/db/schema"
import { formatTime, formatWeight } from "~/lib/utils"

export const TrainingHeader = ({ training }: { training: Training }) => {
  const nbSeries =
    training.steps?.reduce(
      (total, step) =>
        total +
        (step.exercice?.series?.length ??
          (step.superset?.exercices?.length ?? 0) *
            (step.superset?.nbRound ?? 0)),
      0
    ) ?? 0
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
        <p>{training.steps?.length ?? 0} exercice(s)</p>
        <p>{nbSeries} série(s)</p>
        <p>
          {formatWeight(
            training.steps?.reduce(
              (total, step) =>
                total +
                (step.exercice?.series?.reduce(
                  (tt, serie) => tt + (serie.weight ?? 0),
                  0
                ) ??
                  step.superset?.exercices?.reduce(
                    (tt, exercice) =>
                      tt +
                      (exercice?.series?.reduce(
                        (ttt, serie) => ttt + (serie.weight ?? 0),
                        0
                      ) ?? 0),
                    0
                  ) ??
                  0),
              0
            ) ?? 0
          )}{" "}
          soulevé
        </p>
        <p>
          ~
          {formatTime(
            (training.steps?.reduce(
              (total, step) =>
                total +
                (step.exercice?.series?.reduce(
                  (tt, serie) => tt + (serie.rest ?? 0),
                  0
                ) ??
                  (step.superset?.exercices?.length ?? 0) *
                    (step.superset?.rest ?? 0) +
                    ((step.superset?.exercices?.length ?? 0) *
                      (step.superset?.nbRound ?? 0) -
                      (step.superset?.exercices?.length ?? 0)) *
                      (step.superset?.intervalRest ?? 0)),
              0
            ) ?? 0) + (nbSeries * 30 ?? 0)
          )}{" "}
          d&apos;entrainement
        </p>
      </CardContent>
    </Card>
  )
}
