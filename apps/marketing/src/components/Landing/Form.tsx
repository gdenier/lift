import React, { useState, type ReactElement, type FormEvent } from "react";

export const Form = (): ReactElement | null => {
  const [isLoading, setLoading] = useState(false);
  const [formState, setFormState] = useState<{
    error: boolean | null;
    success: boolean | null;
  }>({ error: null, success: null });

  async function submit(e: FormEvent<HTMLFormElement>) {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    fetch("/api/register", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setFormState({ error: false, success: true });
      })
      .catch((err) => setFormState({ error: true, success: false }))
      .finally(() => setLoading(false));
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          placeholder="Adresse email"
          disabled={isLoading}
          required
          className="flex h-10 w-full rounded border border-input bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          disabled={isLoading}
          type="submit"
          className="min-w-fit h-10 px-4 py-2 bg-gray-900 text-gray-50 hover:bg-gray-900/90 inline-flex items-center justify-center rounded text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoading ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-spin"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            "Me prévenir"
          )}
        </button>
      </div>
      {formState.error ? (
        <p className="text-red-700">
          Une erreur c'est produite, réessayer plus tard.
        </p>
      ) : null}
      {formState.success ? (
        <p className="">Votre inscription a bien été pris en compte, merci !</p>
      ) : null}
    </form>
  );
};
