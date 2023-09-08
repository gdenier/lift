ALTER TABLE "lift_trainings_supersets" ADD COLUMN "rest" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "lift_trainings_supersets" ADD COLUMN "interval_rest" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "lift_trainings_supersets_rounds" DROP COLUMN IF EXISTS "rest";--> statement-breakpoint
ALTER TABLE "lift_trainings_supersets_rounds" DROP COLUMN IF EXISTS "interval_rest";