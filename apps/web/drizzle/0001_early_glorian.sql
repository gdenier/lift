ALTER TABLE "lift_trainings_exercices_series" ALTER COLUMN "rest" DROP NOT NULL;

CREATE TABLE IF NOT EXISTS "lift_pre_inscriptions" (
	"id" "ulid" PRIMARY KEY DEFAULT gen_ulid() NOT NULL,
	"email" varchar(256) NOT NULL UNIQUE,
	"created_at" timestamp NOT NULL DEFAULT NOW()
);