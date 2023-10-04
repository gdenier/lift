import { z } from "zod"
import { integerSchema } from "../schema/utils"
import { exerciceSchema } from "../schema/exercices.schema"

//---- Series

export var trainingSerieSchema = z.object({
  id: z.string().ulid(),
  weight: integerSchema(0).optional().nullable(),
  repetition: integerSchema(0).optional().nullable(),
  time: integerSchema(0).optional().nullable(),
  rest: integerSchema(0).optional().nullable(),
  order: integerSchema(0),
  trainingExerciceId: z.string().ulid(),
})

export var editTrainingSerieSchema = trainingSerieSchema.partial({
  id: true,
  trainingExerciceId: true,
})

//---- Exercices

export var trainingExerciceSchema = z.object({
  id: z.string().ulid(),
  order: integerSchema(0).optional().nullable(),
  exerciceId: z.string().ulid(),
  supersetId: z.string().ulid().optional().nullable(),
  trainingStepId: z.string().ulid().optional().nullable(),
  exercice: exerciceSchema,
  series: z.array(trainingSerieSchema).optional(),
})

export var editTrainingExerciceSchema = trainingExerciceSchema
  .omit({ series: true })
  .partial({ id: true })
  .extend({
    series: z.array(editTrainingSerieSchema).optional(),
  })

//---- Supersets

export var trainingSupersetSchema = z.object({
  id: z.string().ulid(),
  rest: integerSchema(0),
  intervalRest: integerSchema(0),
  nbRound: integerSchema(),
  trainingStepId: z.string().ulid(),
  exercices: z.array(trainingExerciceSchema).optional().nullable(),
})

export var editTrainingSupersetSchema = trainingSupersetSchema
  .omit({ exercices: true })
  .partial({ id: true, trainingStepId: true })
  .extend({
    exercices: z.array(editTrainingExerciceSchema).optional(),
  })

//---- Steps

export var trainingStepSchema = z.object({
  id: z.string().ulid(),
  order: integerSchema(0),
  trainingId: z.string().ulid(),
  exercice: trainingExerciceSchema.optional().nullable(),
  superset: trainingSupersetSchema.optional().nullable(),
})

export var editTrainingStepSchema = trainingStepSchema
  .omit({ exercice: true, superset: true })
  .partial({ id: true, trainingId: true })
  .extend({
    exercice: editTrainingExerciceSchema.optional().nullable(),
    superset: editTrainingSupersetSchema.optional().nullable(),
  })

//---- Trainings

export var trainingSchema = z.object({
  id: z.string().ulid(),
  title: z.string(),
  userId: z.string(),
  steps: z.array(trainingStepSchema).optional(),
})

export var createTrainingSchema = trainingSchema.omit({
  id: true,
  steps: true,
  userId: true,
})

export var editTrainingSchema = trainingSchema
  .omit({
    userId: true,
    steps: true,
  })
  .extend({
    steps: z.array(editTrainingStepSchema).optional(),
  })
