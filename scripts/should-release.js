const semverRegex = /^v?\d+\.\d+\.\d+(-.*)?$/;

const shouldRealease = (msg) => msg && !semverRegex.test(msg);

if (!module.parent) {
  /* eslint-disable unicorn/no-process-exit, no-console */
  const commitMessage = process.argv[2];
  console.log(`current commit: '${commitMessage}'`);
  if (shouldRealease(commitMessage)) {
    console.log('Release needed!');
    process.exit(0);
  }
  console.log('Release not needed [avoiding infinite loop]');
  process.exit(1);
}
