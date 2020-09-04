import { GetBuildNumUseCase } from "../../src/kudo/GetBuildNumUseCase";

test("Should return the current build number", async () => {
  const getBuildNumUseCase = new GetBuildNumUseCase();
  const buildText = getBuildNumUseCase.get();

  expect(buildText).toContain(`Currently running build number...`);
});
