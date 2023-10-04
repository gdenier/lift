"use server"

import { auth, currentUser } from "@clerk/nextjs"
import { User } from "@clerk/nextjs/dist/types/server"
import { ZodType, z } from "zod"

export const withValidation = <Schema extends ZodType<any, any, any>, Return>(
  schema: Schema,
  action: (body: z.infer<Schema>, user: User) => Promise<Return>
) => {
  return async (data: z.infer<Schema>): Promise<Return> => {
    const { userId } = auth()
    const user = await currentUser()
    if (!userId || !user)
      throw new Error("Cannot executed for disconnected user")
    try {
      const parsedData = schema.parse(data)
      return action(parsedData, user)
    } catch (error) {
      console.error(error)
      throw new Error("Payload incorrect")
    }
  }
}

export const log = (data: any) => {
  console.log("----------\n")
  console.log(JSON.stringify(data, null, 2))
  console.log("----------\n")
}
