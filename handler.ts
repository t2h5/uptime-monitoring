import { Context, ScheduledEvent, ScheduledHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as httpm from 'typed-rest-client/HttpClient';
import {
  IHeaders,
  IRequestHandler,
  IRequestOptions,
} from 'typed-rest-client/Interfaces';
import { getState, setState } from './dynamo';

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
  await getState()
    .then(value => {
      prevState = value;
    })
    .catch(err => {
      console.log(err);
      prevState = 'unknown';
    });
  const options: IRequestOptions = {
    allowRetries: false,
    socketTimeout: 5000,
  } as IRequestOptions;
  const http: httpm.HttpClient = new httpm.HttpClient(
    'uptime-monitoring',
    [] as IRequestHandler[],
    options,
  );
  await http
    .get(targetEndpoint)
    .then(resp => {
      if (resp.message.statusCode === 200) {
        state = 'healthy';
      } else {
        state = 'unhealthy';
      }
    })
    .catch(err => {
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
    await http.post(slackWebhookUrl, message, {
      'Content-type': 'application/json',
    } as IHeaders);
  }
};
