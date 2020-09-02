export class KudoRecord {
  constructor(
    public personId: string,
    public personName: string,
    public teamId: string,
    public kudos = 0
  ) {}

  exists() {
    return true;
  }
}

export class NoopKudoRecord extends KudoRecord {
  constructor() {
    super("", "", "", 0);
  }

  exists() {
    return false;
  }
}
