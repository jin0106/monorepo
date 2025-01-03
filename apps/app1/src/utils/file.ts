export const convertFileToString = async (file: File) => {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e?.target?.result) {
        resolve(e.target.result)
        return
      }
      reject()
    }
    reader.readAsDataURL(file)
  })
}

export const convertFileToBlob = async (file: File): Promise<Blob | undefined> => {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e?.target?.result) {
        resolve(new Blob([e.target.result]))
        return
      }
      reject()
    }
    reader.readAsDataURL(file)
  })
}
