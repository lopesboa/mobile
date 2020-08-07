type Params = Record<'params', Record<string, string>>;

type Navigation = {
  route: Params;
  navigate: () => void;
  goBack: () => void;
  dispatch: () => void;
  popToTop: () => void;

  addListener: (eventName: string, eventHandler: () => void) => () => void;
  setOptions: () => void;
};

export const createNavigation = ({params}: Params): Navigation => ({
  route: {
    params,
  },
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  popToTop: jest.fn(),
  addListener: jest.fn((event, cb) => {
    cb();
    return jest.fn;
  }),
  setOptions: jest.fn(),
});
