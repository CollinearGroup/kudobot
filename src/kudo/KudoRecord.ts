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

  equals(other: KudoRecord): boolean {
    return this.personId === other.personId && this.teamId === other.teamId;
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
