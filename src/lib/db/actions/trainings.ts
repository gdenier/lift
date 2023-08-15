"use server"

import { ulid } from "ulid"
import { revalidatePath } from "next/cache"
import { withValidation } from "~/lib/utils/server"
import {
  createTrainingSchema,
  editTrainingSchema,
  trainings,
  trainings_exercices,
  trainings_series,
} from "../schema/trainings"
import { db } from ".."
import { eq, inArray } from "drizzle-orm"
import { z } from "zod"
import { redirect } from "next/navigation"

export const createTraining = withValidation(
  createTrainingSchema,
  async (data, user) => {
    const newId = ulid()
    await db.insert(trainings).values({
      id: newId,
      title: data.title,
      userId: user.id,
    })

    revalidatePath("/")
    revalidatePath(`/trainings/${newId}`)

    return newId
  }
)

export const deleteTraining = withValidation(z.string(), async (id, user) => {
  await db.transaction(async (tx) => {
    const exercicesQuery = tx
      .select({ id: trainings_exercices.id })
      .from(trainings_exercices)
      .where(eq(trainings_exercices.trainingId, id))

    await tx
      .delete(trainings_series)
      .where(inArray(trainings_series.trainingsExercicesId, exercicesQuery))
    await tx
      .delete(trainings_exercices)
      .where(eq(trainings_exercices.trainingId, id))
    await tx.delete(trainings).where(eq(trainings.id, id))
  })
  revalidatePath("/")
  revalidatePath(`/trainings/${id}`)
  redirect("/")
})

export const editTraining = withValidation(
  editTrainingSchema,
  async (data, user) => {
    const before = await db.query.trainings.findFirst({
      with: {
        trainings_exercices: {
          with: { exercice: true, series: true },
        },
      },
    })
    // UPDATE TRAINING
    await db
      .update(trainings)
      .set({
        title: data.title,
      })
      .where(eq(trainings.id, data.id))

    // INSERT NEW EXERCICE
    data.trainings_exercices?.forEach(async (tExercice) => {
      const newId = ulid()
      if (!tExercice.id)
        await db.insert(trainings_exercices).values({
          id: newId,
          exerciceId: tExercice.exerciceId,
          trainingId: data.id,
          order: tExercice.order,
        })

      // UPSERT SERIE
      tExercice.series?.forEach(async (serie) => {
        await db
          .insert(trainings_series)
          .values({
            id: serie.id ?? ulid(),
            repetition: serie.repetition ?? null,
            time: serie.time ?? null,
            rest: serie.rest,
            weight: serie.weight ?? null,
            order: serie.order,
            trainingsExercicesId: tExercice.id ?? newId,
          })
          .onDuplicateKeyUpdate({
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
      const seriesToDelete = before?.trainings_exercices
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
    })

    //DELETE REMOVED EXERCICE WITH SERIES
    const exercicesToDelete = before?.trainings_exercices.filter(
      (beforeTExercice) =>
        !data.trainings_exercices?.map((s) => s.id).includes(beforeTExercice.id)
    )
    exercicesToDelete?.forEach(async (exerciceToDelete) => {
      await db
        .delete(trainings_exercices)
        .where(eq(trainings_exercices.id, exerciceToDelete.id))
      await db
        .delete(trainings_series)
        .where(eq(trainings_series.trainingsExercicesId, exerciceToDelete.id))
    })

    revalidatePath("/")
    revalidatePath(`/trainings/${data.id}`)
    revalidatePath(`/trainings/${data.id}/edit`)
  }
)
