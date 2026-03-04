CREATE TABLE "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"lease_time" integer NOT NULL
);
