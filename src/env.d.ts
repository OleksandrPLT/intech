/// <reference types="astro/client" />

import type { SessionUser } from './lib/session';

declare global {
	namespace App {
		interface Locals {
			user: SessionUser | null;
		}
	}
}
