CREATE TABLE "computer_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"def_boot_img_id" integer,
	"def_wb_disk_id" integer
);
--> statement-breakpoint
CREATE TABLE "computers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"mac" varchar(17) NOT NULL,
	"ip" varchar(15),
	"created_at" timestamp DEFAULT now(),
	"boot_img_id" integer,
	"wb_disk_id" integer,
	"group_id" integer
);
--> statement-breakpoint
CREATE TABLE "storage_resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"resource_type" varchar(50) NOT NULL,
	"path" varchar(255) NOT NULL,
	"iqn_suffix" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "computer_groups" ADD CONSTRAINT "computer_groups_def_boot_img_id_storage_resources_id_fk" FOREIGN KEY ("def_boot_img_id") REFERENCES "public"."storage_resources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "computer_groups" ADD CONSTRAINT "computer_groups_def_wb_disk_id_storage_resources_id_fk" FOREIGN KEY ("def_wb_disk_id") REFERENCES "public"."storage_resources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "computers" ADD CONSTRAINT "computers_boot_img_id_storage_resources_id_fk" FOREIGN KEY ("boot_img_id") REFERENCES "public"."storage_resources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "computers" ADD CONSTRAINT "computers_wb_disk_id_storage_resources_id_fk" FOREIGN KEY ("wb_disk_id") REFERENCES "public"."storage_resources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "computers" ADD CONSTRAINT "computers_group_id_computer_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."computer_groups"("id") ON DELETE set null ON UPDATE no action;