"use server"

import { ulid } from "ulid"
import { revalidatePath } from "next/cache"
import { withValidation } from "~/lib/utils/server"
import { db } from ".."
import { createProfileWeightSchema, profile_weights } from "../schema"

export const createWeight = withValidation(
  createProfileWeightSchema,
  async (data, user) => {
    const newId = ulid()
    await db.insert(profile_weights).values({
      id: newId,
      userId: user.id,
      ...data,
    })

    revalidatePath("/profile")

    return newId
  }
)
