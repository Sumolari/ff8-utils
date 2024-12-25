export const setRemoving = <T>(set: Set<T>, removedElement: T): Set<T> => {
  const newSet = new Set(set);
  newSet.delete(removedElement);
  return newSet;
};
