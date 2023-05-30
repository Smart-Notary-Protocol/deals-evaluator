export const getCurrentEpoch = (): number => {
    return Math.floor((Date.now() / 1000 - 1598306400) / 30)
  }