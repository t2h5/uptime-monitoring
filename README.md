# uptime-monitoring

[![Actions Status](https://github.com/t2h5/uptime-monitoring/workflows/Actions/badge.svg)](https://github.com/t2h5/uptime-monitoring/actions)

Monitoring target endpoint health every 5 minutes.

Send notification via slack webhook, **only** if target state changed.

**NOTE**: **DO NOT** make too much access to any endpoint.

## requirements

- Node.js 14.x
- yarn
- aws profile

## setup

Install dependencies using yarn.

```sh
$ yarn install
```

Create `config.yml`.

```yaml
aws_profile:       # aws profile name
target_endpoint:   # target endpoint
slack_webhook_url: # see https://api.slack.com/incoming-webhooks
dynamo_db_table:   # DynamoDB table name
```

Deploy Lambda function using [serverless](https://serverless.com/).

```sh
$ yarn deploy
# aws resouces will be created or updated
```
