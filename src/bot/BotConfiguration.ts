import { PointRecordFileDbGateway } from "../db/PointRecordFileDbGateway";
import { TeamsGatewayImpl } from "../teams/TeamsGatewayImpl";
import { GetLeaderboardUseCase } from "../point/GetLeaderboardUseCase";
import { GivePointUseCase } from "../point/GivePointUseCase";
import { GetHelpUseCase } from "./GetHelpTextUseCase";
import { KudoBot } from "./KudoBot";
import { PointRecordDBGateway } from "../point/PointRecordDBGateway";
import { TeamsGateway } from "../point/TeamsGateway";
import { GetBuildNumUseCase } from "../point/GetBuildNumUseCase";

export function createBot(
  dbGateway: PointRecordDBGateway,
  teamsGateway: TeamsGateway
) {
  const getLeaderboardUseCase = new GetLeaderboardUseCase(
    dbGateway,
    teamsGateway
  );
  const givePointUseCase = new GivePointUseCase(dbGateway);
  const getHelpUseCase = new GetHelpUseCase();
  const getBuildNumUseCase = new GetBuildNumUseCase();
  return new KudoBot(
    getLeaderboardUseCase,
    givePointUseCase,
    getHelpUseCase,
    getBuildNumUseCase
  );
}
