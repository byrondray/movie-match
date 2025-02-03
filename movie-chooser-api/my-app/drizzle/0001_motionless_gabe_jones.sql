CREATE TABLE `friends` (
	`id` text PRIMARY KEY NOT NULL,
	`friend_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp),
	FOREIGN KEY (`friend_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `movies` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`poster_url` text
);
--> statement-breakpoint
CREATE TABLE `movie_selections` (
	`id` integer PRIMARY KEY NOT NULL,
	`session_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`movie_id` integer NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `movie_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `movie_sessions` (
	`id` integer PRIMARY KEY NOT NULL,
	`created_by` integer NOT NULL,
	`created_at` text DEFAULT '2025-02-03T02:43:35.067Z',
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `movie_session_users` (
	`id` integer PRIMARY KEY NOT NULL,
	`session_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `movie_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
