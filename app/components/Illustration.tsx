import { Tile } from "~/components/Tile";

export function Illustration() {
  return (
      <div className="inline-block">
        <div className="grid grid-cols-6 gap-4">
          <Tile status="miss">W</Tile>
          <Tile status="miss">O</Tile>
          <Tile status="miss">R</Tile>
          <Tile status="match">D</Tile>
          <Tile status="include">L</Tile>
          <Tile status="match">E</Tile>
        </div>
      </div>
  );
}
