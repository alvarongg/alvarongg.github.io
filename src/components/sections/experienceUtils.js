/**
 * Sorts an array of experience objects with support for manual ordering.
 *
 * Items with a numeric `order` field are sorted first (ascending by order),
 * followed by items without `order`, sorted by startDate descending (most recent first).
 *
 * @param {Array} experiences - Array of experience objects with startDate (e.g. '2021-10') and optional order (number)
 * @returns {Array} New sorted array (does not mutate the original)
 */
export function sortExperiences(experiences) {
  return [...experiences].sort((a, b) => {
    const aHasOrder = typeof a.order === 'number'
    const bHasOrder = typeof b.order === 'number'
    if (aHasOrder && bHasOrder) return a.order - b.order
    if (aHasOrder) return -1
    if (bHasOrder) return 1
    if (b.startDate > a.startDate) return 1
    if (b.startDate < a.startDate) return -1
    return 0
  })
}
