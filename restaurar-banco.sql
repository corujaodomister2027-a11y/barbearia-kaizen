CREATE TABLE `barber_credentials` (
	`id` text PRIMARY KEY NOT NULL,
	`salt` text NOT NULL,
	`hash` text NOT NULL,
	`revision` integer NOT NULL
);
CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`service` text NOT NULL,
	`date` text NOT NULL,
	`start` integer NOT NULL,
	`duration` integer NOT NULL,
	`price` integer NOT NULL,
	`status` text DEFAULT 'confirmed' NOT NULL,
	`created` integer NOT NULL
, `payment_expires` integer, `payment_reported` integer, `paid_at` integer, `manage_hash` text, `service_name` text, `price_cents` integer);
CREATE TABLE `service_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`price_cents` integer NOT NULL
, `duration` integer);
INSERT INTO "service_settings" VALUES('barba','Barba',2000,30);
INSERT INTO "service_settings" VALUES('combo','Corte + barba',4500,60);
INSERT INTO "service_settings" VALUES('corte','Corte',2000,30);
INSERT INTO "service_settings" VALUES('svc_a9579d9e-2cd5-4692-803f-17a377632355','Sombracelha',1500,30);
CREATE TABLE `site_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`is_public` integer DEFAULT 1 NOT NULL
);
INSERT INTO "site_settings" VALUES('site',1);
CREATE TABLE `slots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`minute` integer NOT NULL,
	`booking_id` text NOT NULL
);
CREATE TABLE `weekly_hours` (
	`weekday` integer PRIMARY KEY NOT NULL,
	`enabled` integer NOT NULL,
	`opens` integer NOT NULL,
	`closes` integer NOT NULL
);
CREATE INDEX `idx_bookings_date` ON `bookings` (`date`);
CREATE UNIQUE INDEX `idx_slots_date_minute` ON `slots` (`date`,`minute`);
CREATE INDEX `idx_slots_booking` ON `slots` (`booking_id`);
CREATE INDEX `idx_bookings_status` ON `bookings` (`status`);
