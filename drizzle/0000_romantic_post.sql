CREATE TABLE "client_pcs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"mac" varchar(17) NOT NULL,
	"ip" varchar(15) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "client_pcs_mac_unique" UNIQUE("mac")
);
