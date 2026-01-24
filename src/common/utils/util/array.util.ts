export function compareTwoFlatArrays(arr1: any[], arr2: any | any[]) {
  const matchedItems: any[] = [];
  const unmatchedItems: any[] = [];

  arr1.forEach((item) => {
    if (arr2.includes(item)) {
      matchedItems.push(item);
    } else {
      unmatchedItems.push(item);
    }
  });

  return {
    isMatched: unmatchedItems.length === 0,
    matchedItems,
    unmatchedItems,
  };
}
