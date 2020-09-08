export class GetBuildNumUseCase {
  get() {
    const version = process.env.npm_package_version;
    const replyText = `Currently running version number... ${version}`;
    return replyText;
  }
}
