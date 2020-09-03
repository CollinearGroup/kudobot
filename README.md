# KudoBot

Bot Builder v4 echo bot sample

This bot has been created using [Bot Framework](https://dev.botframework.com), it shows how to create a simple bot that accepts input from the user and echoes it back.

## Test Coverage

| Statements                                                            | Branches                                                            | Functions                                                            | Lines                                                            |
| --------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/Coverage-71.01%25-red.svg) | ![Branches](https://img.shields.io/badge/Coverage-72.09%25-red.svg) | ![Functions](https://img.shields.io/badge/Coverage-74.47%25-red.svg) | ![Lines](https://img.shields.io/badge/Coverage-72.05%25-red.svg) |

## Running this code

    ngrok http -host-header=rewrite 3978
    copy the https URL and add /api/messages to the end of it
    paste that into azure Messaging endpoint box under your bot's settings page and save your changes
    dont forget to start your bot. ngrok is not your app, just a tunnel.

## Prerequisites

- [Node.js](https://nodejs.org) version 10.14.1 or higher

  ```bash
  # determine node version
  node --version
  ```

## To try this sample

- Clone the repository

  ```bash
  git clone https://github.com/microsoft/botbuilder-samples.git
  ```

- In a console, navigate to `samples/typescript_nodejs/02.echo-bot`

  ```bash
  cd samples/typescript_nodejs/02.echo-bot
  ```

- Install modules

  ```bash
  npm install
  ```

- Start the bot

  ```bash
  npm start
  ```

## Testing the bot using Bot Framework Emulator

[Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the Bot Framework Emulator version 4.3.0 or greater from [here](https://github.com/Microsoft/BotFramework-Emulator/releases)

### Connect to the bot using Bot Framework Emulator

- Launch Bot Framework Emulator
- File -> Open Bot
- Enter a Bot URL of `http://localhost:3978/api/messages`

## Deploy the bot to Azure

To learn more about deploying a bot to Azure, see [Deploy your bot to Azure](https://aka.ms/azuredeployment) for a complete list of deployment instructions.

## Further reading

- [Bot Framework Documentation](https://docs.botframework.com)
- [Bot Basics](https://docs.microsoft.com/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Activity processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)
- [Azure Bot Service Introduction](https://docs.microsoft.com/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)
- [Azure Bot Service Documentation](https://docs.microsoft.com/azure/bot-service/?view=azure-bot-service-4.0)
- [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest)
- [Azure Portal](https://portal.azure.com)
- [Language Understanding using LUIS](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/)
- [Channels and Bot Connector Service](https://docs.microsoft.com/en-us/azure/bot-service/bot-concepts?view=azure-bot-service-4.0)
- [TypeScript](https://www.typescriptlang.org)
- [Restify](https://www.npmjs.com/package/restify)
- [dotenv](https://www.npmjs.com/package/dotenv)
