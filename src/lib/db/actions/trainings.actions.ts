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
import { trainings_supersets } from "../schema/training/trainings_supersets.schema"
import { trainings_series } from "../schema/training/trainings_series.schema"
import { trainings_exercices } from "../schema/training/trainings_exercices.schema"
import { db } from ".."
import { InferModel, and, eq, inArray, sql } from "drizzle-orm"
import { z } from "zod"
import { redirect } from "next/navigation"

export const getTraining = withValidation(
  trainingSchema.pick({ id: true }),
  async ({ id }, user) => {
    const training = await db.query.trainings.findFirst({
      with: {
        sessions: true,
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
    const before = await getTraining(data)
    // UPDATE TRAINING
    await db
      .update(trainings)
      .set({
        title: data.title,
      })
      .where(eq(trainings.id, data.id))

    revalidatePath("/")
    revalidatePath(`/trainings/${data.id}`)
    revalidatePath(`/trainings/${data.id}/edit`)
  }
)
