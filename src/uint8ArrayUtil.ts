/**
 * Merge an array of Uint8Array into a single Uint8Array
 * @param {Uint8Array[]} Array of Uint8Array to be merged
 * @returns {Uint8Array} Merged Uint8Array
 */
export function merge(arrays: Uint8Array[]): Uint8Array {
  const length = arrays.reduce((acc, array) => acc + array.length, 0);

  const mergedArray = new Uint8Array(length);
  arrays.reduce((offset, array) => {
    mergedArray.set(array, offset);
    return offset + array.length;
  }, 0);

  return mergedArray;
}

/**
 * Split an Uint8Array into an array of Uint8Array given a separator
 * @param {Uint8Array} value to be split
 * @param {Uint8Array} value to use as separator
 * @returns {Uint8Array[]} Array of splitted tokens
 */
export function split(data: Uint8Array, separator: Uint8Array): Uint8Array[] {
  if (separator.length === 0) {
    return [data];
  }

  const tokens: Uint8Array[] = [];
  let start = 0;
  for (let i = 0; i < data.length - separator.length + 1; i++) {
    let match = true;
    for (let j = 0; j < separator.length && match; j++) {
      if (data[i + j] !== separator[j]) {
        match = false;
      }
    }
    if (match) {
      tokens.push(data.slice(start, i));
      start = i + separator.length;
    }
  }
  if (start !== data.length) {
    tokens.push(data.slice(start));
  }
  return tokens;
}

/**
 * Trim zeroes at the end of an Uint8Array
 * @param {Uint8Array} Uint8Array to be trimmed
 * @returns {Uint8Array} Trimmed Uint8Array
 */
export function trim(data: Uint8Array): Uint8Array {
  let i = data.length - 1;
  while (i >= 0) {
    if (data[i] !== 0) {
      break;
    }
    i--;
  }
  return data.slice(0, i + 1);
}
