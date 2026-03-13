CREATE TABLE "tarifs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"time" integer NOT NULL,
	"price" integer NOT NULL
);
