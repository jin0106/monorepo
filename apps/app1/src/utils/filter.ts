// date -> ISO string
// 끝날짜의 시간,분,초는 00으로 세팅
const getCreatedAtString = ({ startDate, endDate }: { startDate?: Date; endDate?: Date }) => {
  if (!startDate || !endDate) {
    return {}
  }
  const createdAtAfter = startDate.toISOString()
  const createdAtBefore = new Date()
  createdAtBefore.setDate(endDate.getDate() + 1)
  createdAtBefore.setHours(0, 0, 0, 0)
  return {
    createdAtAfter,
    createdAtBefore: createdAtBefore.toISOString()
  }
}

export const FilterUtils = {
  getCreatedAtString
}
