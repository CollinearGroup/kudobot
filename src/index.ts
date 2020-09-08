// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as path from "path";
import { config } from "dotenv";
import express = require("express");
import { BotFrameworkAdapter } from "botbuilder";
import { TeamsGatewayImpl } from "./teams/TeamsGatewayImpl";
import { PointRecordFileDbGateway } from "./db/PointRecordFileDbGateway";
import { createBot } from "./bot/BotConfiguration";

config();

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
});

// Catch-all for errors.
const onTurnErrorHandler = async (context, error) => {
  // This check writes out errors to console log .vs. app insights.
  // NOTE: In production environment, you should consider logging this to Azure
  //       application insights.
  console.error(`\n [onTurnError] unhandled error: ${error}`);

  // Send a trace activity, which will be displayed in Bot Framework Emulator
  await context.sendTraceActivity(
    "OnTurnError Trace",
    `${error}`,
    "https://www.botframework.com/schemas/error",
    "TurnError"
  );

  // Send a message to the user
  await context.sendActivity("The bot encountered an error or bug.");
  await context.sendActivity(
    "To continue to run this bot, please fix the bot source code."
  );
};

// Set the onTurnError for the singleton BotFrameworkAdapter.
adapter.onTurnError = onTurnErrorHandler;

// Bot initialization
const pointFileDbGateway = new PointRecordFileDbGateway();
const teamsGateway = new TeamsGatewayImpl();
const kudoBot = createBot(pointFileDbGateway, teamsGateway);

const app: express.Application = express();
const server = app.listen(process.env.PORT || 3978, () => {
  console.log(`App is listening on port ${process.env.PORT || 3978}!`);
});

app.post("/api/messages", (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    // Route to main dialog.
    await kudoBot.run(context);
  });
});

// Listen for Upgrade requests for Streaming.
server.on("upgrade", (req, socket, head) => {
  // Create an adapter scoped to this WebSocket connection to allow storing session data.
  const streamingAdapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
  });

  // Set onTurnError for the BotFrameworkAdapter created for each connection.
  streamingAdapter.onTurnError = onTurnErrorHandler;

  streamingAdapter.useWebSocket(req, socket, head, async (context) => {
    // After connecting via WebSocket, run this logic for every request sent over
    // the WebSocket connection.
    await kudoBot.run(context);
  });
});
