type ReferencableItem =
  | {
      universalRef: string;
    }
  | {
      ref: string;
    };

export const getMostAccurateRef = (item: ReferencableItem): string => {
  if (typeof item.universalRef === 'string') {
    return item.universalRef;
  }

  if (typeof item.ref === 'string') {
    return item.ref;
  }

  throw new Error('the object has no universalRef nor Ref');
};
