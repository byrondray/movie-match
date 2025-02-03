CREATE TABLE `genres` (
	`id` text PRIMARY KEY NOT NULL,
	`genre` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`email` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE TABLE `userGenres` (
	`id` text PRIMARY KEY NOT NULL,
	`genre` text NOT NULL,
	`user` text NOT NULL,
	FOREIGN KEY (`genre`) REFERENCES `genres`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
