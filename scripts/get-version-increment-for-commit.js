const MINOR = 'minor';
const PATCH = 'patch';

const getVersionIncrementType = message => {
  const containsPatchKeyWords = /bug|fix|tweak|plugging/i.test(message);
  const tooShortMessage = message.split(' ').length < 5; // 4 word + PR tag
  const hashtagMinor = /#minor\b/i.test(message);
  const hashtagBug = /#bug\b/i.test(message);
  const containsMinorKeyWords = /release|feature/i.test(message);
  const isSquashOrMerge = /Merge pull request #\d+|\(#\D+\)/.test(message);

  if (hashtagBug || containsPatchKeyWords) return PATCH;
  if (hashtagMinor || containsMinorKeyWords) return MINOR;
  if (tooShortMessage) return PATCH;
  if (!isSquashOrMerge) return PATCH;
  return MINOR;
};

if (!module.parent) {
  /* eslint-disable unicorn/no-process-exit, no-console */
  const commitMessage = process.argv[2];
  if (!commitMessage) process.exit(1);
  console.log(getVersionIncrementType(commitMessage));
}
