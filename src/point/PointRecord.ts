export class PointRecord {
  constructor(
    public personId: string,
    public personName: string,
    public teamId: string,
    public points = 0
  ) {}

  exists() {
    return true;
  }

  equals(other: PointRecord): boolean {
    return this.personId === other.personId && this.teamId === other.teamId;
  }
}

export class NoopPointRecord extends PointRecord {
  constructor() {
    super("", "", "", 0);
  }

  exists() {
    return false;
  }
}
