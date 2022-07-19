export type PerformanceReportEvent = {
	usedJSHeapSize: number,
	hasCapacity: boolean
}

export const PerformanceReportEventName = "report/performance";