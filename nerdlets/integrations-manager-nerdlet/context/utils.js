export const existsInArray = (arr, val, key) => {
  for (let z = 0; z < arr.length; z++) {
    if (key === null && z === val) {
      return true;
    } else if (key != null && arr[key] === val) {
      return true;
    }
  }
  return false;
};

export const arrayValueExistsInStr = (arr, val) => {
  for (let z = 0; z < arr.length; z++) {
    if (val.includes(arr[z])) {
      return true;
    }
  }
  return false;
};
