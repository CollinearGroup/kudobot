# KudoBot

## Test Coverage

| Statements                                                            | Branches                                                            | Functions                                                            | Lines                                                            |
| --------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/Coverage-71.01%25-red.svg) | ![Branches](https://img.shields.io/badge/Coverage-72.09%25-red.svg) | ![Functions](https://img.shields.io/badge/Coverage-74.47%25-red.svg) | ![Lines](https://img.shields.io/badge/Coverage-72.05%25-red.svg) |

## Hosting your own KudoBot --

- Follow the steps provided by Microsoft at the link below, but clone this repository rather than their samples
  - https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/csharp_dotnetcore/57.teams-conversation-bot
  - Follow the steps to run the bot locally (with ngrok)
    - You will need to create an azure account (free), register a bot, and enable the teams channel for that bot (explained in the link above)
  - Create a .env file (based on the template provided)
    - Fill in the fields for MicrosoftAppId and MicrosoftAppPassword (Password can be created/found under "Certificates & secrets" or by clicking "manage" near the MicrosoftAppId field under settings)
  - Update the bot settings in Azure and set Messaging Endpoint to something like "https://6babb187151a.ngrok.io/api/messages" (Yes, you do need /api/messages)
    - Note: Every time you start ngrok, you'll need to update your Azure messaging endpoint
    - You can change this later if you decide to host your bot elsewhere
      - To learn more about deploying a bot to Azure, see [Deploy your bot to Azure](https://aka.ms/azuredeployment) for a complete list of deployment instructions.
- Follow the steps below to add your bot to a team

## Add the bot to a team --

- Update the Manifest file (included in the manifest zip) by replacing all instances of <<YOUR-MICROSOFT-APP-ID>> with your AppId
- In MSTeams, navigate to Manage Team
  - Click the "Apps" Tab
  - Click "Upload a custom app" (in the bottom right corner)
    - Select the zip (downloaded in step 1)
    - Click "Add". Wait... it might take a few seconds
- Voila!
- Test it out in a teams chat channel by typing @kudobot

## Modifying/Creating an app manifest

- Be sure to check out the one in this repo for the basics
- If you'd like to create your own, [check out Microsoft's documentation](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/apps-package)

## Further reading

- [Bot Framework](https://dev.botframework.com)
- [Bot Framework Documentation](https://docs.botframework.com)
- [Bot Basics](https://docs.microsoft.com/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Azure Bot Service Introduction](https://docs.microsoft.com/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)
- [Azure Bot Service Documentation](https://docs.microsoft.com/azure/bot-service/?view=azure-bot-service-4.0)
- [Channels and Bot Connector Service](https://docs.microsoft.com/en-us/azure/bot-service/bot-concepts?view=azure-bot-service-4.0)
