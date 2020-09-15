import { Point } from "./Point";

export class PointRecord {
  constructor(
    public personId: string,
    public personName: string,
    public teamId: string,
    private points: Point[] = []
  ) {}

  addPoint(point: Point = new Point()) {
    this.points.push(point);
  }

  getScore(since: Date = null) {
    since = since || new Date(new Date().setDate(new Date().getDate() - 30));
    return this.points.filter((point) => point.createdAt > since).length;
  }

  exists() {
    return true;
  }

  equals(other: PointRecord): boolean {
    return this.personId === other.personId && this.teamId === other.teamId;
  }
}

export class NoopPointRecord extends PointRecord {
  constructor() {
    super("", "", "");
  }

  exists() {
    return false;
  }
}
