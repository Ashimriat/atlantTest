export const isInRange = (val: number, fromVal: number, toVal: number, mode: string = 'easy') => {
  if (mode === 'easy') {
    return val >= fromVal && val <= toVal;
  } else {
    return val > fromVal && val < toVal;
  }
};
