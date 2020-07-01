jest.mock('react-native-email-link', () => ({
  openInbox: jest.fn(() => {}),
}));

describe('Inbox', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should call native module', () => {
    const {openInbox: _openInbox} = require('react-native-email-link');

    const {openInbox} = require('./inbox');

    openInbox();
    expect(_openInbox).toHaveBeenCalledTimes(1);
    expect(_openInbox).toHaveBeenCalledWith({
      removeText: true,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
