import ChatBot from 'dingtalk-robot-sender';

const robot = new ChatBot({
  baseUrl: 'https://oapi.dingtalk.com/robot/send',
  accessToken: 'xxx',
  secret: 'xxx',
});

const sendText = async (str) => {
  await robot.text(str);
}

const sendMarkdown = async (content) => {
  await robot.markdown('API tips', content);
}


export { sendText, sendMarkdown }