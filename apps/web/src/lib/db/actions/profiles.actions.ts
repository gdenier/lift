"use server"

import { revalidatePath } from "next/cache"
import { withValidation } from "~/lib/utils/server"
import { db } from ".."
import { createProfileWeightSchema, profile_weights } from "../schema"

export const createWeight = withValidation(
  createProfileWeightSchema,
  async (data, user) => {
    const inserted = (await db.insert(profile_weights).values({
      userId: user.id,
      ...data,
    }).returning())[0]

    revalidatePath("/profile")

    return inserted.id
  }
)
