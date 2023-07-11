"use server"

import { auth, currentUser } from "@clerk/nextjs"
import { User } from "@clerk/nextjs/dist/types/server"
import { ZodType, z } from "zod"

export const withValidation = <Schema extends ZodType<any, any, any>, Return>(
  schema: Schema,
  action: (body: z.infer<Schema>, user: User) => Promise<Return>
) => {
  return async (formData: FormData | any): Promise<Return> => {
    const { userId } = auth()
    const user = await currentUser()
    if (!userId || !user)
      throw new Error("Cannot executed for disconnected user")
    // console.log(formData)
    // const formPayload = Object.fromEntries(formData)
    try {
      const parsedData = schema.parse(formData)
      return action(parsedData, user)
    } catch (error) {
      console.error(error)
      throw new Error("Payload incorrect")
    }
  }
}
