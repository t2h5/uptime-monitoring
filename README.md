# uptime-monitoring

[![Actions Status](https://github.com/t2h5/uptime-monitoring/workflows/Github%20Actions/badge.svg)](https://github.com/t2h5/uptime-monitoring/actions)

Monitoring target endpoint health every 5 minutes.

Send notification via slack webhook, if target state changed.

## setup

Install dependencies using yarn (or npm).

```sh
$ yarn install
```

Create `config.yml`.

```yaml
aws_profile:       # aws profile
target_endpoint:   # target endpoint
slack_webhook_url: # https://api.slack.com/incoming-webhooks
dynamo_db_table:   # dynamodb table name
```

Deploy Lambda function using [serverless](https://serverless.com/).

```sh
$ yarn deploy
# resouces will be created
```
