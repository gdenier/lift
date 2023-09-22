BEGIN;
CREATE TABLE IF NOT EXISTS "lift_exercices" (
	"id" "ulid" PRIMARY KEY DEFAULT gen_ulid() NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lift_trainings" (
	"id" "ulid" PRIMARY KEY DEFAULT gen_ulid() NOT NULL,
	"title" varchar(256) NOT NULL,
	"user_id" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lift_trainings_steps" (
	"id" "ulid" PRIMARY KEY DEFAULT gen_ulid() NOT NULL,
	"order" integer NOT NULL,
	"training_id" "ulid" NOT NULL,
	CONSTRAINT "lift_trainings_steps_training_id_lift_trainings_id_fk" FOREIGN KEY ("training_id") REFERENCES "lift_trainings"("id") ON DELETE cascade ON UPDATE no action 
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lift_trainings_supersets" (
	"id" "ulid" PRIMARY KEY DEFAULT gen_ulid() NOT NULL,
	"rest" integer NOT NULL,
	"interval_rest" integer NOT NULL,
	"nb_round" integer DEFAULT 1 NOT NULL,
	"training_step_id" "ulid" NOT NULL,
	CONSTRAINT "lift_trainings_supersets_training_step_id_lift_trainings_steps_id_fk" FOREIGN KEY ("training_step_id") REFERENCES "lift_trainings_steps"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lift_trainings_exercices" (
	"id" "ulid" PRIMARY KEY DEFAULT gen_ulid() NOT NULL,
	"order" integer,
	"exercice_id" "ulid" NOT NULL,
	"superset_id" "ulid",
	"training_step_id" "ulid",
	CONSTRAINT "lift_trainings_exercices_exercice_id_lift_exercices_id_fk" FOREIGN KEY ("exercice_id") REFERENCES "lift_exercices"("id") ON DELETE set null ON UPDATE no action,
	CONSTRAINT "lift_trainings_exercices_superset_id_lift_trainings_supersets_id_fk" FOREIGN KEY ("superset_id") REFERENCES "lift_trainings_supersets"("id") ON DELETE cascade ON UPDATE no action,
	CONSTRAINT "lift_trainings_exercices_training_step_id_lift_trainings_steps_id_fk" FOREIGN KEY ("training_step_id") REFERENCES "lift_trainings_steps"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lift_trainings_exercices_series" (
	"id" "ulid" PRIMARY KEY DEFAULT gen_ulid() NOT NULL,
	"weight" real,
	"repetition" integer,
	"time" integer,
	"rest" integer NOT NULL,
	"order" integer NOT NULL,
	"training_exercice_id" "ulid" NOT NULL,
	CONSTRAINT "lift_trainings_exercices_series_training_exercice_id_lift_trainings_exercices_id_fk" FOREIGN KEY ("training_exercice_id") REFERENCES "lift_trainings_exercices"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lift_profile_weights" (
	"id" "ulid" PRIMARY KEY DEFAULT gen_ulid() NOT NULL,
	"value" integer NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(32) NOT NULL
);
COMMIT;