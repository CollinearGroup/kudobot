import { KudoRecordFileDbGateway } from "../db/KudoRecordFileDbGateway";
import { TeamsGatewayImpl } from "../teams/TeamsGatewayImpl";
import { GetLeaderboardUseCase } from "../kudo/GetLeaderboardUseCase";
import { GiveKudoUseCase } from "../kudo/GiveKudoUseCase";
import { GetHelpUseCase } from "./GetHelpTextUseCase";
import { KudoBot } from "./KudoBot";
import { KudoRecordDBGateway } from "../kudo/KudoRecordDBGateway";
import { TeamsGateway } from "../kudo/TeamsGateway";

export function createBot(
  dbGateway: KudoRecordDBGateway,
  teamsGateway: TeamsGateway
) {
  const getLeaderboardUseCase = new GetLeaderboardUseCase(
    dbGateway,
    teamsGateway
  );
  const giveKudoUseCase = new GiveKudoUseCase(dbGateway);
  const getHelpUseCase = new GetHelpUseCase();
  return new KudoBot(getLeaderboardUseCase, giveKudoUseCase, getHelpUseCase);
}
