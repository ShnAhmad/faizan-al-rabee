CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`payload` text NOT NULL,
	`created_at` integer NOT NULL
);
