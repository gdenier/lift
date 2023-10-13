import type { APIRoute } from "astro";
import { db, pre_inscriptions } from "../../lib/db";

const validateEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const email = data.get("email");
  // Validate the data - you'll probably want to do more than this
  console.log(email, email?.toString(), email?.valueOf());
  if (!email || !validateEmail(email as string)) {
    return new Response(undefined, { status: 400 });
  }
  // Do something with the data, then return a success response
  await db
    .insert(pre_inscriptions)
    .values({ email: email as string })
    .onConflictDoNothing({ target: pre_inscriptions.email });
  return new Response(undefined, { status: 200 });
};
