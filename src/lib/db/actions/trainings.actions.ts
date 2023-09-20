"use server"

import { revalidatePath } from "next/cache"
import { withValidation } from "~/lib/utils/server"
import {
  EditTrainingSchema,
  TrainingExercice,
  createTrainingSchema,
  editTrainingSchema,
  trainings,
  trainings_exercices,
  trainings_series,
  trainings_supersets,
  trainings_supersets_exercices,
  trainings_supersets_rounds,
  trainings_supersets_series,
} from "../schema/trainings.schema"
import { db } from ".."
import { InferModel, eq, inArray, sql } from "drizzle-orm"
import { z } from "zod"
import { redirect } from "next/navigation"

export async function getTraining(id: string, userId: string) {
  const training = await db.query.trainings.findFirst({
    with: {
      trainings_exercices: {
        with: { exercice: true, series: true },
        orderBy: (trainings_exercices, { asc }) => [
          asc(trainings_exercices.order),
        ],
      },
      trainings_supersets: {
        with: {
          exercices: {
            with: { exercice: true },
            orderBy: (trainings_supersets_exercices, { asc }) => [
              asc(trainings_supersets_exercices.order),
            ],
          },
          rounds: {
            with: {
              series: {
                orderBy: (trainings_supersets_series, { asc }) => [
                  asc(trainings_supersets_series.order),
                ],
              },
            },
            orderBy: (trainings_supersets_rounds, { asc }) => [
              asc(trainings_supersets_rounds.order),
            ],
          },
        },
        orderBy: (trainings_supersets, { asc }) => [
          asc(trainings_supersets.order),
        ],
      },
      sessions: true,
    },
    where: (trainings, { eq, and }) =>
      and(eq(trainings.id, id), eq(trainings.userId, userId)),
  })
  if (!training) throw new Error("Can't get the requested training.")
  return training
}

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

export const deleteTraining = withValidation(z.string(), async (id, user) => {
  const deletedExercices = await db
    .delete(trainings_exercices)
    .where(eq(trainings_exercices.trainingId, id))
    .returning({ id: trainings_exercices.id })
  await db.delete(trainings_series).where(
    inArray(
      trainings_series.trainingsExercicesId,
      deletedExercices.map((d) => d.id)
    )
  )

  const deletedSupersets = await db
    .delete(trainings_supersets)
    .where(eq(trainings_supersets.trainingId, id))
    .returning({ id: trainings_supersets.id })
  await db.delete(trainings_supersets_exercices).where(
    inArray(
      trainings_supersets_exercices.trainingSupersetId,
      deletedSupersets.map((d) => d.id)
    )
  )
  const deletedSupersetsRounds = await db
    .delete(trainings_supersets_rounds)
    .where(
      inArray(
        trainings_supersets_rounds.trainingSupersetId,
        deletedSupersets.map((d) => d.id)
      )
    )
    .returning({ id: trainings_supersets_rounds.id })
  await db.delete(trainings_supersets_series).where(
    inArray(
      trainings_supersets_series.trainingsSupersetsRoundsId,
      deletedSupersetsRounds.map((d) => d.id)
    )
  )

  await db.delete(trainings).where(eq(trainings.id, id))

  revalidatePath("/")
  revalidatePath(`/trainings/${id}`)
  redirect("/")
})

export const editTraining = withValidation(
  editTrainingSchema,
  async (data, user) => {
    const before = await getTraining(data.id, user.id)
    // UPDATE TRAINING
    await db
      .update(trainings)
      .set({
        title: data.title,
      })
      .where(eq(trainings.id, data.id))

    await updateExercices(data, before)
    await updateSupersets(data, before)

    revalidatePath("/")
    revalidatePath(`/trainings/${data.id}`)
    revalidatePath(`/trainings/${data.id}/edit`)
  }
)

async function updateExercices(
  data: EditTrainingSchema,
  training: Awaited<ReturnType<typeof getTraining>>
) {
  // INSERT NEW EXERCICE / UPDATE EXISTING EXERCICE
  await Promise.all(
    data.trainings_exercices?.map(async (tExercice) => {
      await createOrUpdateExercice(training, tExercice)
    }) ?? []
  )

  // DELETE REMOVED EXERCICE WITH SERIES
  const exercicesToDelete = training?.trainings_exercices.filter(
    (beforeTExercice) =>
      !data.trainings_exercices?.map((s) => s.id).includes(beforeTExercice.id)
  )
  for (const exerciceToDelete of exercicesToDelete) {
    await db
      .delete(trainings_exercices)
      .where(eq(trainings_exercices.id, exerciceToDelete.id))
    await db
      .delete(trainings_series)
      .where(eq(trainings_series.trainingsExercicesId, exerciceToDelete.id))
  }
}

async function createOrUpdateExercice(
  training: Awaited<ReturnType<typeof getTraining>>,
  tExercice: NonNullable<EditTrainingSchema["trainings_exercices"]>[number]
) {
  let inserted: Partial<TrainingExercice>
  inserted = (
    await db
      .insert(trainings_exercices)
      .values({
        id: tExercice.id,
        exerciceId: tExercice.exerciceId,
        trainingId: training.id,
        order: tExercice.order,
      })
      .onConflictDoUpdate({
        target: trainings_exercices.id,
        set: {
          order: tExercice.order,
        },
      })
      .returning()
  )[0]

  // UPSERT SERIE
  tExercice.series?.forEach(async (serie) => {
    await db
      .insert(trainings_series)
      .values({
        id: serie.id,
        repetition: serie.repetition ?? null,
        time: serie.time ?? null,
        rest: serie.rest,
        weight: serie.weight ?? null,
        order: serie.order,
        trainingsExercicesId: tExercice.id ?? inserted.id,
      })
      .onConflictDoUpdate({
        target: trainings_series.id,
        set: {
          repetition: serie.repetition ?? null,
          time: serie.time ?? null,
          rest: serie.rest,
          weight: serie.weight ?? null,
          order: serie.order,
        },
      })
  })
  // DELETE REMOVED SERIES
  const seriesToDelete = training?.trainings_exercices
    .find((beforeTExercice) => beforeTExercice.id === tExercice.id)
    ?.series.filter(
      (serie) => !tExercice.series?.map((s) => s.id).includes(serie.id)
    )
  seriesToDelete?.forEach(
    async (serieToDelete) =>
      await db
        .delete(trainings_series)
        .where(eq(trainings_series.id, serieToDelete.id))
  )
}

async function updateSupersets(
  data: EditTrainingSchema,
  training: Awaited<ReturnType<typeof getTraining>>
) {
  await Promise.all(
    data.trainings_supersets?.map(async (tSuperset) => {
      // UPSERT SUPERSET
      const inserted = (
        await db
          .insert(trainings_supersets)
          .values({
            id: tSuperset.id,
            trainingId: training.id,
            order: tSuperset.order,
            intervalRest: tSuperset.intervalRest,
            rest: tSuperset.rest,
          })
          .onConflictDoUpdate({
            target: trainings_supersets.id,
            set: {
              order: tSuperset.order,
            },
          })
          .returning()
      )[0]
      // UPSERT EXERCICES
      await Promise.all(
        tSuperset.exercices.map(async (sExercice) => {
          await db
            .insert(trainings_supersets_exercices)
            .values({
              id: sExercice.id,
              order: sExercice.order,
              exerciceId: sExercice.exerciceId,
              trainingSupersetId: inserted.id,
            })
            .onConflictDoUpdate({
              target: trainings_supersets_exercices.id,
              set: {
                order: sExercice.order,
              },
            })
        })
      )
      // UPSERT ROUNDS
      await Promise.all(
        tSuperset.rounds.map(async (round) => {
          const insertedRound = (
            await db
              .insert(trainings_supersets_rounds)
              .values({
                id: round.id,
                order: round.order,
                trainingSupersetId: inserted.id,
              })
              .onConflictDoUpdate({
                target: trainings_supersets_rounds.id,
                set: {
                  order: round.order,
                },
              })
              .returning()
          )[0]
          //---- UPSERT SERIES
          round.series.forEach(async (serie) => {
            await db
              .insert(trainings_supersets_series)
              .values({
                id: serie.id,
                order: serie.order,
                repetition: serie.repetition,
                time: serie.time,
                weight: serie.weight,
                trainingsSupersetsRoundsId: insertedRound.id,
              })
              .onConflictDoUpdate({
                target: trainings_supersets_series.id,
                set: {
                  order: serie.order,
                  repetition: serie.repetition ?? null,
                  time: serie.time ?? null,
                  weight: serie.weight,
                },
              })
          })
        })
      )
    }) ?? []
  )

  // FIXME: ALL REMOVED CAN BE DELETED WHEN CASCADE DELETE WORK
  // DELETE REMOVED SUPERSET
  const supersetsToDelete = training?.trainings_supersets.filter(
    (beforeTSuperset) =>
      !data.trainings_supersets?.map((s) => s.id).includes(beforeTSuperset.id)
  )
  supersetsToDelete?.forEach(async (supersetToDelete) => {
    await db
      .delete(trainings_supersets)
      .where(eq(trainings_supersets.id, supersetToDelete.id))
  })
  // DELETE REMOVED EXERCICES
  const exercicesToDelete = training?.trainings_supersets.flatMap(
    (superset) => {
      return superset.exercices.filter(
        (exercice) =>
          !data.trainings_supersets
            ?.flatMap((tSuperset) => tSuperset.exercices.map((ex) => ex.id))
            .includes(exercice.id)
      )
    }
  )
  exercicesToDelete.forEach(async (exerciceToDelete) => {
    await db
      .delete(trainings_supersets_exercices)
      .where(eq(trainings_supersets_exercices.id, exerciceToDelete.id))
  })
  // DELETE REMOVED ROUNDS
  const roundsToDelete = training?.trainings_supersets.flatMap((superset) => {
    return superset.rounds.filter(
      (round) =>
        !data.trainings_supersets
          ?.flatMap((tSuperset) => tSuperset.rounds.map((r) => r.id))
          .includes(round.id)
    )
  })
  roundsToDelete.forEach(async (roundToDelete) => {
    await db
      .delete(trainings_supersets_rounds)
      .where(eq(trainings_supersets_rounds.id, roundToDelete.id))
  })
  // DELETE REMOVED SERIES
  const seriessToDelete = training?.trainings_supersets.flatMap((superset) => {
    return superset.rounds.flatMap((round) => {
      return round.series.filter(
        (serie) =>
          !data.trainings_supersets
            ?.flatMap((tSuperset) =>
              tSuperset.rounds.flatMap((round) => round.series.map((s) => s.id))
            )
            .includes(serie.id)
      )
    })
  })
  seriessToDelete.forEach(async (serieToDelete) => {
    await db
      .delete(trainings_supersets_series)
      .where(eq(trainings_supersets_series.id, serieToDelete.id))
  })
}
