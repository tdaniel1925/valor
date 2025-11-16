// Batch operation utility functions

/**
 * Processes items in batches
 */
export async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(processor))
    results.push(...batchResults)
  }

  return results
}

/**
 * Processes items in batches with delay between batches
 */
export async function processBatchWithDelay<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10,
  delayMs: number = 1000
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(processor))
    results.push(...batchResults)

    // Delay before next batch (except for last batch)
    if (i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  return results
}

/**
 * Chunks array into batches
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Processes batches sequentially
 */
export async function processBatchesSequentially<T, R>(
  batches: T[][],
  processor: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const results: R[] = []

  for (const batch of batches) {
    const batchResults = await processor(batch)
    results.push(...batchResults)
  }

  return results
}

/**
 * Validates batch size
 */
export function validateBatchSize(size: number, maxSize: number = 100): number {
  if (size <= 0) return 1
  if (size > maxSize) return maxSize
  return size
}

