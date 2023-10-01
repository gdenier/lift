"use server"

import { revalidatePath } from "next/cache"
import { withValidation } from "~/lib/utils/server"
import {
  EditTraining,
  createTrainingSchema,
  editTrainingSchema,
  trainingSchema,
  trainings,
} from "../schema/training/trainings.schema"
import {
  EditTrainingSuperset,
  TrainingSuperset,
  trainings_supersets,
} from "../schema/training/trainings_supersets.schema"
import {
  TrainingSerie,
  trainings_series,
} from "../schema/training/trainings_series.schema"
import {
  TrainingExercice,
  trainings_exercices,
} from "../schema/training/trainings_exercices.schema"
import { db } from ".."
import { and, asc, eq, sql } from "drizzle-orm"
import { redirect } from "next/navigation"
import { EditTrainingStep, TrainingStep, trainings_steps } from "../schema"

export const getTraining = withValidation(
  trainingSchema.pick({ id: true }),
  async ({ id }, user) => {
    const training = await db.query.trainings.findFirst({
      with: {
        steps: {
          with: {
            exercice: {
              with: {
                exercice: true,
                series: {
                  orderBy: [asc(trainings_series.order)],
                },
              },
            },
            superset: {
              with: {
                exercices: {
                  with: {
                    exercice: true,
                    series: {
                      orderBy: [asc(trainings_series.order)],
                    },
                  },
                  orderBy: [asc(trainings_exercices.order)],
                },
              },
            },
          },
          orderBy: [asc(trainings_steps.order)],
        },
      },
      where: (trainings, { eq, and }) =>
        and(eq(trainings.id, id), eq(trainings.userId, user.id)),
    })
    if (!training) throw new Error("Can't get the requested training.")
    return training
  }
)

export const createTraining = withValidation(
  createTrainingSchema,
  async (data, user) => {
    const inserted = (
      await db
        .insert(trainings)
        .values({
          title: data.title,
          userId: user.id,
        })
        .returning()
    )[0]

    revalidatePath("/")
    revalidatePath(`/trainings/${inserted.id}`)

    return inserted.id
  }
)

export const deleteTraining = withValidation(
  trainingSchema.pick({ id: true }),
  async ({ id }, user) => {
    await db
      .delete(trainings)
      .where(and(eq(trainings.id, id), eq(trainings.userId, user.id)))

    revalidatePath("/")
    revalidatePath(`/trainings/${id}`)
    redirect("/")
  }
)

export const editTraining = withValidation(
  editTrainingSchema,
  async (data, user) => {
    await updateTraining(data)

    const savedSteps = await upsertSteps(data)
    if (!savedSteps) return updateCache(data)

    data.steps = data.steps?.map<(typeof data.steps)[0]>((step) => ({
      ...step,
      ...(savedSteps.find(
        (savedStep) => savedStep.order === step.order
      ) as (typeof savedSteps)[0]),
    }))

    const savedSupersets = await upsertSuperset(data)

    data.steps = data.steps?.map<(typeof data.steps)[0]>((step) => {
      if (step.superset)
        return {
          ...step,
          superset: {
            ...step.superset,
            ...(
              savedSupersets?.find(
                (savedSuperset) => savedSuperset.trainingStepId === step.id
              ) as typeof savedSupersets
            )?.[0],
          },
        }

      return step
    })

    const savedExercices = await upsertExercice(data)
    if (!savedExercices) return updateCache(data)

    data.steps = data.steps?.map<(typeof data.steps)[0]>((step) => {
      if (step.exercice)
        return {
          ...step,
          exercice: {
            ...step.exercice,
            id: savedExercices.find(
              (savedExercice) => savedExercice.trainingStepId === step.id
            )?.id,
          },
        }
      return {
        ...step,
        superset: {
          ...(step.superset as TrainingSuperset),
          exercices: step.superset?.exercices?.map((exercice) => ({
            ...exercice,
            id: savedExercices.find(
              (savedExercice) => savedExercice.supersetId === step.superset?.id
            )?.id,
          })),
        },
      }
    })

    await upsertSeries(data)

    updateCache(data)
  }
)

const updateTraining = async (data: EditTraining) => {
  await db
    .update(trainings)
    .set({
      title: data.title,
    })
    .where(eq(trainings.id, data.id))
}

const upsertSteps = async (data: EditTraining) => {
  if (data.steps?.length)
    return await db
      .insert(trainings_steps)
      .values(
        data.steps?.map<TrainingStep>((step) => ({
          id: step.id as string,
          order: step.order,
          trainingId: data.id,
        })) ?? []
      )
      .onConflictDoUpdate({
        target: trainings_steps.id,
        set: {
          order: sql`excluded.order`,
        },
      })
      .returning()
}

const upsertSuperset = async (data: EditTraining) => {
  if (data.steps?.filter((step) => !!step.superset)?.length)
    return await db
      .insert(trainings_supersets)
      .values(
        data.steps
          ?.filter(
            (
              step
            ): step is EditTrainingStep & { superset: EditTrainingSuperset } =>
              !!step.superset
          )
          .map<EditTrainingSuperset>(({ id, superset }) => ({
            id: superset.id as string,
            intervalRest: superset.intervalRest,
            nbRound: superset.nbRound,
            rest: superset.rest,
            trainingStepId: id,
          })) ?? []
      )
      .onConflictDoUpdate({
        target: trainings_supersets.id,
        set: {
          intervalRest: sql`excluded.intervalRest`,
          nbRound: sql`excluded.nbRound`,
          rest: sql`excluded.rest`,
        },
      })
      .returning()
}

const upsertExercice = async (data: EditTraining) => {
  const values = data.steps?.flatMap<Partial<TrainingExercice>>(
    ({ id, exercice, superset }) => {
      if (exercice) return { ...exercice, series: [], trainingStepId: id }
      return (
        superset?.exercices?.map((exercice) => ({
          ...exercice,
          series: [],
          supersetId: superset.id,
        })) ?? []
      )
    }
  )
  if (values?.length)
    return db
      .insert(trainings_exercices)
      .values([...values] as any) // FIXME: typing any
      .onConflictDoUpdate({
        target: trainings_exercices.id,
        set: { order: sql`excluded.order` },
      })
      .returning()
}

const upsertSeries = async (data: EditTraining) => {
  return await db
    .insert(trainings_series)
    .values(
      data.steps?.flatMap<TrainingSerie>((step) => {
        if (step.exercice)
          return (
            step.exercice.series?.map((serie) => ({
              ...(serie as TrainingSerie),
              trainingExerciceId: step.exercice!.id!,
            })) ?? []
          )

        return (
          step.superset?.exercices?.flatMap(
            (exercice) =>
              exercice.series?.map((serie) => ({
                ...(serie as TrainingSerie),
                trainingExerciceId: exercice.id!,
              })) ?? []
          ) ?? []
        )
      }) ?? []
    )
    .onConflictDoUpdate({
      target: trainings_series.id,
      set: {
        order: sql`excluded.order`,
        repetition: sql`excluded.repetition`,
        rest: sql`excluded.rest`,
        time: sql`excluded.time`,
        weight: sql`excluded.weight`,
      },
    })
    .returning()
}

function updateCache(data: EditTraining) {
  revalidatePath("/")
  revalidatePath(`/trainings/${data.id}`)
  revalidatePath(`/trainings/${data.id}/edit`)
}
