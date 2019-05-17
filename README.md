# uptime-monitoring

Monitoring target endpoint health every 5 minutes.

Send notification via slack webhook, if target isn't healthy.

## setup

Install dependencies using yarn (or npm).

```sh
$ yarn install
```

Create `config.yml`.

```yaml
aws_profile: # aws profile 
target_endpoint: # target endpoint
slack_webhook_url: # see https://api.slack.com/incoming-webhooks
```

Deploy Lambda function via [serverless](https://serverless.com/).

```sh
# specify stage using `-s` option
$ yarn deploy -s dev
```
