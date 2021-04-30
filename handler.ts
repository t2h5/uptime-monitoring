import { Context, ScheduledEvent, ScheduledHandler } from 'aws-lambda';
import axios, { AxiosRequestConfig } from 'axios';
import 'source-map-support/register';
import { getState, setState } from './dynamo';

const VERSION = process.env.VERSION;
const targetEndpoint = process.env.targetEndpoint;
const slackWebhookUrl = process.env.slackWebhookUrl;

let state: string;
let prevState: string;

const colors: { [key: string]: string } = {
  error: 'warning',
  healthy: 'good',
  unhealthy: 'danger',
};

export const main: ScheduledHandler = async (
  _event: ScheduledEvent,
  _context: Context,
) => {
  console.log(`uptime-monitoring v${VERSION}`);
  await getState()
    .then((value) => {
      prevState = value;
    })
    .catch((err) => {
      console.log(err);
      prevState = 'unknown';
    });
  const targetConfig: AxiosRequestConfig = {
    headers: { 'User-Agent': 'uptime-monitoring' },
    timeout: 5000,
    validateStatus: (_status) => {
      return true;
    },
  };
  await axios
    .get(targetEndpoint, targetConfig)
    .then((res) => {
      if (res.status === 200) {
        state = 'healthy';
      } else {
        state = 'unhealthy';
      }
    })
    .catch((err) => {
      console.log(err);
      state = 'error';
    });
  await setState(state);
  if (state !== prevState) {
    console.log(`state changed: ${prevState} to ${state}`);
    const message: string = JSON.stringify({
      attachments: [
        {
          color: colors[state],
          text: `<!here> health check state changed: ${prevState} to ${state}`,
          title: 'uptime-monitoring',
        },
      ],
    });
    const slackConfig: AxiosRequestConfig = {
      headers: { 'Content-type': 'application/json' },
      timeout: 2000,
    };
    await axios.post(slackWebhookUrl, message, slackConfig).catch((err) => {
      console.log(err);
    });
  } else {
    console.log(`state stayed ${state}`);
  }
};
