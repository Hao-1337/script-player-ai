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
 import { 
  system, world, G, ActionFormData
} from "./main.js";

core(G.modules, G.modules);

let time = Date.now(),
    bootTime = time;

function timeMarker(str) {
    let _ = Date.now(),
        c = _ - time;
   time = _;
   console.warn(`§a[Boot Loader]§r ${str} §f(§e${c}ms§f)`);
}

async function core(modules = {}, addons = {}) {try{
  console.warn("Modules starting up....");
//=====================================================÷===============
//                          CORE MODULES
//=====================================================÷===============
  if (modules.command) {
    var {
        default: CommandBuilder,
        ChatHandle
    } = await import("./modules/command.js");
    /*update config*/
    CommandBuilder.updateConfig(G.ChatHandle);
    /*event sub*/
    world.beforeEvents.chatSend.subscribe(_ => {
      var {message, sender} = _;
      _.setTargets([]);
      _.cancel = true;
      system.run(() => ChatHandle({message, sender}));
    });
    /* You command must be on here */
    try {
      new CommandBuilder({
        command: "gamemode",
        alias: ["gm"],
        error_show: "both",
        usage: `${CommandBuilder.prefix()}gamemode <gamemode>`,
        permission: player => player.hasTag("admin"),
        args: {
          1: {
            type: "string",
            valid_value: ["a", "s", "c", "sp"]
          }
        },
        callBack: ({player, pData}) => {
          let gm = pData[1];
          if (gm === "sp") gm = "spectator";
          player.runCommandAsync(`gamemode ${gm}`);
        }
      });
      new CommandBuilder({
        command: "database",
        alias: ["dbs"],
        error_show: "both",
        usage: `${CommandBuilder.prefix()}database`,
        permission: player => player.hasTag("admin"),
        args: {
          0: {
            type: "string"
          }
        },
        callBack: () => 0,
        openForm: () => ({
          form: (new ActionFormData().title("Database").body(JSON.colorStringify(database.getAll())).button("OK")),
          callBack: () => 0
        })
      });
      
      new CommandBuilder({
        command: "sound",
        permission: player => player.hasTag(G.admin_tag),
        help_permission: player => player.hasTag(G.admin_tag),
        usage: `${CommandBuilder.prefix()}sound <player: selector>: Play some random sound`,
        args: {
          0: { type: "string" },
          1: {
            type: "selector",
            can_empty: true,
            default_value: "@s"
          }
        },
        callBack: ({player, pData}) => {
          const song = soundTrack.random();
          for (let entity of pData[1]) {
            if (!entity instanceof Player) return player.sendMessage("§cSelector must be a player");
            player.onScreenDisplay.setActionBar(`§aNow play:§e ${song.id}§r (${song.pitch === 1 ? "§bnormal version" : song.pitch < 1 ? "§eslow down" : "§cspeed up"}§r)`);
            player.playSound(song.id, {
              pitch: song.pitch,
              volume: song.volume
            });
          }
        }
      });
      new CommandBuilder({
        command: "import",
        alias: ["i"],
        permission: player => player.hasTag(G.admin_tag),
        usage: `${CommandBuilder.prefix}import <file_path_from_root: String>: Import js file`,
        args: {
          1: {
            type: "string"
          }
        },
        callBack: async ({pData, player}) => {
          let time = Date.now();
          try {
            await import(pData[1]).catch(e => world.debug(e));
          } catch (e) {
            world.debug(e);
            return;
          }
          player.sendMessage(`§aSuccessfully imported file with path:§e ${pData[1]}§a in§e ${Date.now() - time}ms`)
        }
      });
    } catch (e) {
      console.warn(`§c[Commands]- Error: ${e} ${e.stack}`);
    }
    timeMarker("§nModule command loadded");
  }
  if (modules.console) {
      var { ScriptDocument, ScriptConsole } = await import("./modules/console.js");
      
      world.beforeEvents.itemUse.subscribe(async ({source: player, itemStack: item}) => {
         if (player.typeId !== "minecraft:player" || !item) return;
         await new Promise(r => system.runTimeout(() => r(), 1));
         if (item.typeId === "choigame:script_document_book") new ScriptDocument(player);
         if (item.typeId === "choigame:script_console_book") new ScriptConsole(player);
      });

      timeMarker("§nScript console loaded!");
  }

  if (modules.playerAI) {
      await import("./beta/player-ai.js");

      timeMarker("§nScript console loaded!");
  }
//=====================================================÷===============
//                          CORE MODULES
//=====================================================÷===============
  if (modules.thirstBar) {
      await import("./addons/thrist-bar.js");
      timeMarker("§n[Addons] Thirst bar loadded");
  }
  if (modules.veinmine) {
     var { default: veinmine } = await import("./modules/veinmine.js");
     world.afterEvents.blockBreak.subscribe(veinmine);
     timeMarker("§n[Addons] Veinmine loadded");
  }
  if (modules.dash) {
      await import("./addons/dash.js");
      timeMarker("§n[Addons] Dash loadded");
  }
  if (modules.healthIndicator) {
      await import("./addons/health-indicator.js");
      timeMarker("§n[Addons] Health indicator loadded");
  }
  if (modules.redstoneInterface) {
     var { $: redstoneBuild } = await import("./addons/redstone.js");
     timeMarker("§n[External Addons] Redstone interface loadded");
  }
  if (modules.chestPicker) {
      await import("./addons/chest-picker.js");
      timeMarker("§n[Addons] Chest picker loadded");
  }

   console.warn(`§aAll modules and addons load in§e ${Date.now() - bootTime}ms§r`);
} catch (e) {
    console.warn(`§a[Boot Loader]§4 ERROR§c ${e}\n${e.stack}`);
}}