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
CREATE TABLE IF NOT EXISTS "lift_trainings_exercices" (
	"id" "ulid" PRIMARY KEY DEFAULT gen_ulid() NOT NULL,
	"training_id" "ulid" NOT NULL,
	"exercice_id" "ulid" NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lift_trainings_exercices_series" (
	"id" "ulid" PRIMARY KEY DEFAULT gen_ulid() NOT NULL,
	"trainings_exercices_id" "ulid" NOT NULL,
	"weight" real,
	"repetition" integer,
	"time" integer,
	"rest" integer NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lift_trainings_supersets" (
	"id" "ulid" PRIMARY KEY DEFAULT gen_ulid() NOT NULL,
	"training_id" "ulid" NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lift_trainings_supersets_exercices" (
	"id" "ulid" PRIMARY KEY DEFAULT gen_ulid() NOT NULL,
	"trainings_supersets_id" "ulid" NOT NULL,
	"exercice_id" "ulid" NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lift_trainings_supersets_rounds" (
	"id" "ulid" PRIMARY KEY DEFAULT gen_ulid() NOT NULL,
	"trainings_supersets_id" "ulid" NOT NULL,
	"order" integer NOT NULL,
	"rest" integer NOT NULL,
	"interval_rest" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lift_trainings_supersets_series" (
	"id" "ulid" PRIMARY KEY DEFAULT gen_ulid() NOT NULL,
	"trainings_supersets_rounds_id" "ulid" NOT NULL,
	"weight" real,
	"repetition" integer,
	"time" integer,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lift_sessions" (
	"id" "ulid" PRIMARY KEY DEFAULT gen_ulid() NOT NULL,
	"training_id" "ulid" NOT NULL,
	"user_id" varchar(32) NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lift_sessions_exercices" (
	"id" "ulid" PRIMARY KEY DEFAULT gen_ulid() NOT NULL,
	"session_id" "ulid" NOT NULL,
	"exercice_id" "ulid" NOT NULL,
	"order" integer NOT NULL,
	CONSTRAINT "lift_sessions_exercices_id_exercice_id_session_id_unique" UNIQUE("id","exercice_id","session_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lift_sessions_exercices_series" (
	"id" "ulid" PRIMARY KEY DEFAULT gen_ulid() NOT NULL,
	"sessions_exercices_id" "ulid" NOT NULL,
	"weight" real,
	"repetition" integer NOT NULL,
	"rest" integer NOT NULL,
	"order" integer NOT NULL,
	CONSTRAINT "lift_sessions_exercices_series_id_sessions_exercices_id_unique" UNIQUE("id","sessions_exercices_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lift_profile_weights" (
	"id" "ulid" PRIMARY KEY DEFAULT gen_ulid() NOT NULL,
	"value" integer NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(32) NOT NULL
);
