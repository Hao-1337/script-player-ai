/*
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 *         _    _  __            ____                          
 *        | |  | | \_\          / __ \                         
 *        | |__| | __ _  ___   | |  | |_   _  __ _ _ __   __ _ 
 *        |  __  |/ _` |/ _ \  | |  | | | | |/ _` | '_ \ / _` |
 *        | |  | | (_| | (_) | | |__| | |_| | (_| | | | | (_| |
 *        |_|  |_|\__,_|\___/   \___\_\\__,_|\__,_|_| |_|\__, |
 *                                                        __/ |
 *                                                        |___/ 
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 *
 * Minecraft Scripting API
 * @author Choigame123 (Choigame123#5666)
 * @helper no one
 *
 * @supporter NTTRedstone (NTTRedstone#2349)
 * @supporter NovaStak1245
 * @supporter DucDuck
 *
 * Do not steal without my permission
 */

const modules = {
        command: false,
        worldEdit: false,
        veinmine: false,
        leaderboard: false,
        dash: false,
        thirstBar: false,
        veinmine: false,
        healthIndicator: false,
        redstoneInterface: false,
        chestPicker: false,
        console: true,
        playerAI: true
};

const G = {...config, modules, time: 0};

import { Player, system, world } from "@minecraft/server";
import "./prototype.js";
import * as mc from "@minecraft/server";
import * as mcui from "@minecraft/server-ui";
import { Method, VECTOR3 as vector } from "./modules/method.js";
import Timer from "./modules/timer.js";
import lodash from "./lodash.min.js";

import Database from "./modules/database.js";
import Spinnet from "./modules/spinnet.js";

export { G };
export * from "./prototype.js";
export * from "./vanilla-data/lib/index.js";
export * from "@minecraft/server";
export * from "@minecraft/server-ui";
export * from "./modules/method.js";
export * from "./config.js";

MainThread(modules, G, false);

/**
 * make a debug
 * @param {any} t data need debug
 * @param {EntityQuerryOption} e
 * @return {void}
 */
world.debug= (t,e={},r=false) => {
    if (!G["enabled-debug"]) return;
    const tell = m => {
      for (let d of world.getPlayers(e)) d.sendMessage(m);
    },
    o = t?.constructor?.name;
    let line;
    try {
        let u = void 0;
        u.clear();
    } catch (e) {
        line = `${e.stack}`.match(/\d+/g)[1];
    }
    
    let data = o?.includes("Error") ? `§4[Debugger Error]§c ${t}\n${t.stack}` : `§4[Debugger<§eLine: §f${line}§c> - Class: ${o ?? "None"}]§r ${JSON.colorStringify(t)}`;
    return r ? data : tell(data);
}
export function EvalThread(chat, player, config) {
  try {
    var save, err, o = chat.slice(config.evalPrefix.length);
    eval(`
        try {
            save = ${o};
        } catch (e) {
            err = e;
        }
    `);
    player.sendMessage(`§l<§r§7 ${o.replace(/\"([\w\W]+)\"/g, '§a"$1"§r§7')}\n§r§l>§r ${err ? world.debug(err) : JSON.colorStringify(save)}`);
  } catch (e) {
      eval(o);
      player.sendMessage(`§l<§r§7 ${o.replace(/\"([\w\W]+)\"/g, '§a"$1"§r§7')}\n§r§l>§6Undefined`); 
  }
}
async function MainThread(modules, config, freeze = false) {
  /* Config won't be change in runtime */
  if (freeze) (function freeze(obj) {
    Object.freeze(obj);
    for (let key in obj) if (typeof obj[key] === "object") freeze(obj[key]);
  })(config);

  await import("./core.js");
  
  console.warn("§aConfig and interface load complete!")
}