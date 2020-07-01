const MINOR = 'minor';
const PATCH = 'patch';

const getVersionIncrementType = (message) => {
  const firstLine = message.split('\n')[0];
  const containsPatchKeyWords = /bug|fix|tweak|plugging/i.test(firstLine);
  const tooShortMessage = firstLine.split(' ').length < 5; // 4 word + PR tag
  const hashtagMinor = /#minor\b/i.test(firstLine);
  const hashtagBug = /#bug\b/i.test(firstLine);
  const containsMinorKeyWords = /release|feature/i.test(firstLine);
  const isSquashOrMerge = /Merge pull request #\d+|\(#\D+\)/.test(firstLine);

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
