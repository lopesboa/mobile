import {getMostAccurateRef} from './reference';

describe('Reference', () => {
  it('should return the universal ref if exists', () => {
    const ref = 'foo';
    const universalRef = 'tourte';
    const itemWithRef = {
      ref,
      universalRef,
    };
    const result = getMostAccurateRef(itemWithRef);
    expect(result).toEqual(universalRef);
  });

  it('should return the ref if the universal ref does not exists', () => {
    const ref = 'foo';

    const itemWithRef = {
      ref,
    };
    const result = getMostAccurateRef(itemWithRef);
    expect(result).toEqual(ref);
  });

  it('should throw an error if no universal ref nor ref is providerd', () => {
    const itemWithRef = {foo: 'baz'};
    // @ts-ignore this case should never happend
    expect(() => getMostAccurateRef(itemWithRef)).toThrow();
  });
});
