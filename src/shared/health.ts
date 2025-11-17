/**
 * Check process/tooling health.
 * Returns an object with status and timestamp for simple runtime verification.
 */
export function isHealthy(): { status: 'ok'; timestamp: string } {
	return { status: 'ok', timestamp: new Date().toISOString() }
}

// convenience default export
export default isHealthy
