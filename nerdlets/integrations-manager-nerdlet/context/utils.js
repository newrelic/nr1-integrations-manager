export const existsInArray = (arr, val, key) => {
  for (let z = 0; z < arr.length; z++) {
    if (key === null && z === val) {
      return true;
    } else if (key != null && arr[key] === val) {
      return true;
    }
  }
};
