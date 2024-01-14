import * as gt from "@minecraft/server-gametest";
import { world, system } from "./main.js";

export class SimulatedPlayerAI  {
  static spawnPos = {x: 0, y: 0, z: 3};
  
  constructor({name, gamemode}) {
    gt.register("hao1337", "test", this.setUp.bind(this)).maxTicks(2e9).structureName("hao1337:simPlayer");
    this.name = name,
    this.gamemode = gamemode;
    this.overworld = world.getDimension("overworld");
    this.overworld.runCommand("gametest run hao1337:test false 1 0");
  }

  setUp(_) {
    this.player = _.spawnSimulatedPlayer({x: 0, y: 0, z: 0}, this.name);
    this.player.setGameMode(this.gamemode)
  }

  lerpLocation({x, y, z}) {
    return {
      x: x - SimulatedPlayerAI.spawnPos.x,
      y: y - SimulatedPlayerAI.spawnPos.y,
      z: z - SimulatedPlayerAI.spawnPos.z
    }
  }
  inLocation({x, y, z}) {
    return Math.floor(this.player.location.x) === x &&
           Math.floor(this.player.location.y) === y &&
           Math.floor(this.player.location.z) === z
  }
  
  set autoJump(bool) {
    this.aJump = bool;
  }
  get autoJump() {
    return this.aJump;
  }

  async moveTo(loc) {
    try {
      let l = this.lerpLocation(loc)
    this.player.moveToLocation(l);
    
    await new Promise((r, j) => {
      let i = system.runInterval(() => {
        let d = this.player.getViewDirection();
        this.overworld.runCommand(`title @a actionbar ${this.player.getBlockFromViewDirection({maxDistance: 2})?.typeId || "air"}\n  At [${this.player.location.x}, ${this.player.location.y}, ${this.player.location.z}]\n Target [${loc.x}, ${loc.y}, ${loc.z}]\n View [${d.x}, ${d.y}, ${d.z}]`);
        
        if (this.inLocation(loc)) r(), system.clearRun(i), this.player.stopMoving();
        
      }, 1);
    });

    return true;
    } catch (e) {
      world.debug(e)
    }
  }
}
