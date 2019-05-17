import { Context, ScheduledEvent, ScheduledHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as httpm from 'typed-rest-client/HttpClient';
import {
  IHeaders,
  IRequestHandler,
  IRequestOptions,
} from 'typed-rest-client/Interfaces';

const targetEndpoint = process.env.targetEndpoint;
const slackWebhookUrl = process.env.slackWebhookUrl;

export const main: ScheduledHandler = async (
  event: ScheduledEvent,
  _: Context,
) => {
  console.log(event);
  const options: IRequestOptions = {
    allowRetries: false,
    socketTimeout: 5000,
  } as IRequestOptions;
  const http: httpm.HttpClient = new httpm.HttpClient(
    'uptime-monitoring',
    [] as IRequestHandler[],
    options,
  );
  let res: httpm.HttpClientResponse;
  try {
    res = await http.get(targetEndpoint);
    const status = res.message.statusCode;
    if (status === 200) {
      console.log('target is healthy');
    } else {
      console.log(`target is not healthy: ${status}`);
      const message: string = JSON.stringify({
        attachments: [
          {
            color: 'danger',
            text: `<!here> health check failed (status: ${status})`,
            title: 'uptime-monitoring',
          },
        ],
      });
      await http.post(slackWebhookUrl, message, {
        'Content-type': 'application/json',
      } as IHeaders);
    }
  } catch (err) {
    console.error('Failed: ' + err.message);
  }
};
