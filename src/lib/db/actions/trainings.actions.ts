"use server"

import { revalidatePath } from "next/cache"
import { log, withValidation } from "~/lib/utils/server"
import { db } from ".."
import { and, asc, eq, notInArray, sql } from "drizzle-orm"
import { redirect } from "next/navigation"
import {
  trainingSchema,
  createTrainingSchema,
  editTrainingSchema,
} from "../validation/training.validator"
import { trainings, EditTraining } from "../schema/training/trainings.schema"
import {
  trainings_exercices,
  TrainingExercice,
} from "../schema/training/trainings_exercices.schema"
import {
  trainings_series,
  TrainingSerie,
} from "../schema/training/trainings_series.schema"
import {
  trainings_steps,
  TrainingStep,
  EditTrainingStep,
} from "../schema/training/trainings_steps.schema"
import {
  TrainingSuperset,
  trainings_supersets,
  EditTrainingSuperset,
} from "../schema/training/trainings_supersets.schema"

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
    const snapshot = await getTraining({ id: data.id })
    await updateTraining(data)
    log(data)

    const savedSteps = await upsertSteps(data)
    if (!savedSteps) return updateCache(data)
    data.steps = data.steps?.map<(typeof data.steps)[0]>((step) => ({
      ...step,
      ...(savedSteps.find(
        (savedStep) => savedStep.order === step.order
      ) as (typeof savedSteps)[0]),
    }))

    log(data)
    const savedSupersets = await upsertSuperset(data)

    data.steps = data.steps?.map<(typeof data.steps)[0]>((step) => {
      if (step.superset)
        return {
          ...step,
          superset: {
            ...step.superset,
            ...(savedSupersets?.find(
              (savedSuperset) => savedSuperset.trainingStepId === step.id
            ) as typeof savedSupersets),
          },
        }

      return step
    })

    log(data)
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
              (savedExercice) =>
                savedExercice.supersetId === step.superset?.id &&
                savedExercice.order === exercice.order
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
  await db
    .delete(trainings_steps)
    .where(
      notInArray(
        trainings_steps.id,
        (data.steps?.filter((step) => !!step.id)?.map((step) => step.id) ??
          []) as string[]
      )
    )
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
  const toDeleteIds = (data.steps
    ?.filter((step) => !!step.superset && !!step.superset.id)
    ?.map((step) => step.superset?.id) ?? []) as string[]
  if (toDeleteIds.length)
    await db
      .delete(trainings_supersets)
      .where(notInArray(trainings_supersets.id, toDeleteIds))

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
          intervalRest: sql`excluded.interval_rest`,
          nbRound: sql`excluded.nb_round`,
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

  const toDeleteIds = (values
    ?.filter((exercice) => !!exercice.id)
    ?.map((exercice) => exercice.id) ?? []) as string[]
  if (toDeleteIds.length)
    await db
      .delete(trainings_exercices)
      .where(notInArray(trainings_exercices.id, toDeleteIds))

  if (values?.length)
    return db
      .insert(trainings_exercices)
      .values(values as any) // FIXME: typing any
      .onConflictDoUpdate({
        target: trainings_exercices.id,
        set: { order: sql`excluded.order` },
      })
      .returning()
}

const upsertSeries = async (data: EditTraining) => {
  log(data)
  const values =
    data.steps?.flatMap<TrainingSerie>((step) => {
      if (step.exercice)
        return (
          step.exercice.series?.map((serie) => ({
            ...(serie as TrainingSerie),
            trainingExerciceId: step.exercice!.id!,
          })) ?? []
        )

      return (
        step.superset?.exercices?.flatMap((exercice) => {
          log(exercice.id)
          return (
            exercice.series?.map((serie) => ({
              ...(serie as TrainingSerie),
              trainingExerciceId: exercice.id!,
            })) ?? []
          )
        }) ?? []
      )
    }) ?? []

  log(values)

  const toDeleteIds = (values
    ?.filter((serie) => !!serie.id)
    ?.map((serie) => serie.id) ?? []) as string[]
  if (toDeleteIds.length)
    await db
      .delete(trainings_series)
      .where(notInArray(trainings_series.id, toDeleteIds))

  return await db
    .insert(trainings_series)
    .values(values)
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
