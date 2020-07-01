/* eslint-disable no-console, unicorn/no-process-exit */
const {WebClient} = require('@slack/client');

const token = process.env.SLACK_TOKEN;
if (!token) {
  console.log("Pas d'bras, Pas d'chocolat! 😉");
  process.exit(1);
}
const channel = process.env.SLACK_CHANNEL;
if (!channel) {
  console.log('Mais à qui voulez vous parler? 😉');
  process.exit(3);
}
const web = new WebClient(token);

(async () => {
  const res = await web.chat.postMessage({
    channel,
    attachments: [
      {
        text:
          process.argv[2] ||
          'Someone want to tell us something, but he did not tell what! :postbox:',
        color: process.argv[3] || 'warning',
        title: process.argv[4],
      },
    ],
  });
  console.log('Message sent:', res.ts);
})();
