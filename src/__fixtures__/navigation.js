// @flow strict

// @todo to be enhanced, incomplete object
export const createNavigation = <T>({
  params
}: {
  params?: T
}): ReactNavigation$ScreenPropsWithParams<T> => ({
  state: {
    params
  },
  navigate: jest.fn(),
  dispatch: jest.fn()
});
