export const formatCoordinates = (latitude?: number | null, longitude?: number | null) => {
  if (!latitude || !longitude) {
    return '-'
  }
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
}
