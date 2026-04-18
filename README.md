# smb_spooner

Author-maintained Spooner fork for RedM by `SIMBAproduz`.

Portuguese (BR): see [README.pt-BR.md](README.pt-BR.md)

I am a worldbuilding and runtime tooling enthusiast with a creative, methodical workflow. `smb_spooner` comes from that perspective: a Spooner fork shaped to fit my own needs for scene composition, operational predictability, and fast iteration.

This resource builds on [kibook/spooner](https://github.com/kibook/spooner) and evolves that base with performance patches, local persistence, personal menus.

## Fork Lineage and Credits

`smb_spooner` did not start from scratch.

- original upstream: [kibook/spooner](https://github.com/kibook/spooner)
- local comparison branch used during development: `spooni_spooner`
- current operational fork: `smb_spooner`

Credits:

- `kibook`: original Spooner architecture
- `Spooni-Development`: overhaul work from the `spooni_spooner` branch used as a local comparison reference
- `SIMBAproduz / SMB`: integrations, refactors, SMB menus, persistence, autosave, custom propsets, optimizations, and runtime adjustments

## What It Does

- Spawn and manipulate peds, vehicles, objects, pickups, and propsets
- Freecam + placement cursor for runtime scene building
- Local preview flow before actual spawn
- Preview navigation with `Up/Down arrows` after clicking an item in a spawn list
- Yaw can be adjusted during preview before spawning, and `E` preserves that preview rotation
- Custom propsets with preview and anchored spawn flow
- Personal menus: `personalOyate`, `personalPeds`, `personalObjetos`, `personalPlantas`
- Local database save/load and integrated autosave
- Runtime language switching (`pt-BR` / `en-US`) with per-client local persistence
- Hotkeys and commands adapted to the current RedM runtime
- `3` key to spawn objects with zero rotation on all three axes

## Dependencies

- `uiprompt` (RedM)
- FXServer/RedM with NUI enabled

> Integrated file writer: file writing logic for autosave and custom propsets lives inside `filewriter.js`. Installing `smb_filewriter` separately is not required.

## Structure

```text
smb_spooner/
|-- client/
|   `-- main.lua
|-- server/
|   |-- main.lua
|   `-- filewriter.js
|-- shared/
|   |-- config.lua
|   `-- slaxml.lua
|-- permissions.cfg
|-- fxmanifest.lua
|-- custom_propsets/
|   |-- index.json
|   `-- presets/
|-- data/
|   `-- rdr3/
`-- ui/
    |-- index.html
    |-- script.js
    |-- style.css
    `-- *.ttf / *.otf
```

## Main Configurables

See `config.lua`:

- `shared/config.lua`
- `Config.DevAllowAllPermissions`
- `Config.ToggleControl`
- `Config.SpawnMenuControl`
- `Config.PropMenuControl`
- `Config.SaveLoadDbMenuControl`
- `Config.HelpMenuControl`

Autosave:

- current integrated autosave interval: `3 minutes`
- autosave path is set from the Spooner UI and persisted in local KVP

Language:

- `PTBR | EN US` selector in the `J` menu
- the selected language is stored in local resource KVP
- prompts, notifications, HUD, and NUI follow the last selected language

## Commands

- `/spooner` - open/close Spooner
- `/spooner_spawn` - spawn the current selection at the cursor
- `/spooner_db` - open the database menu
- `/spooner_savedb` - open the save/load menu
- `/spooner_propset_anchor` - insert/replace the custom propset anchor marker
- `/spooner_migrate_old_dbs` - migrate legacy databases
- `spooner_refresh_perms` - refresh server permissions

## Controls

| Key | Function |
|---|---|
| `W/A/S/D` | move camera |
| `Space` / `Shift` | move up / down |
| `E` | spawn current selection |
| `3` | spawn object with zero rotation on all three axes |
| `Left click` | select / attach |
| `Right click` | delete |
| `C/V` | rotate the current preview or selected entity |
| `B` | change rotation axis (`Pitch`, `Roll`, `Yaw`) |
| `Q/Z/Left/Right arrows` | adjust position |
| `Up/Down arrows` | once a preview is active after clicking an item, cycle the current preview list |
| `I` | toggle adjustment mode |
| `U` | toggle place on ground |
| `7` | disable adjustment |
| `8` | return to free adjustment |
| `G` | clone |
| `PgUp/PgDn` or wheel | adjust speed |
| `R` | change the edited speed type |
| `F` | open spawn menu |
| `X` | open database |
| `Tab` | open properties |
| `J` | open save/load |
| `PTBR / EN US` | switch NUI/runtime language from the `J` menu |
| `H` | open help |
| `1` | show/hide control panel |
| `2` | toggle frozen state for the next spawn |
| `M` | show/hide entity handles |
| `Alt` | focus entity |
| `Ctrl` | toggle focus mode |
| `Del` | toggle Spooner at runtime |
| `F11` | optional key mapping for `/spooner` |
| `F12` | insert the custom propset anchor marker |

## Main Differences vs `spooni_spooner`

- resource renamed and reorganized as `smb_spooner`
- fork is now RedM-only in packaging and manifest
- `filewriter.js` is integrated; it no longer depends on `smb_filewriter`
- custom propsets are persisted inside the resource
- autosave is integrated with path persistence in local KVP
- locale switcher for `pt-BR` / `en-US` with client preference persistence
- SMB personal menus: `personalPlantas`, `personalObjetos`, `personalOyate`, `personalPeds`, `personalPropsets`
- NUI performance work: lazy loading, list caches, debounce, DOM cleanup, and `contain: content`
- `SMB_ModelHashLookup` for `GetModelName()` in O(1)
- object preview and spawn rotation stay in sync, including preview yaw; key `3` forces zero rotation
- reopening returns to the last submenu with the last spawned item selected and framed
- dedicated `Spooni` surface removed in favor of this fork's worldbuilding workflow

## Events and Flow

| Name | Direction | Description |
|---|---|---|
| `spooner:init` | Client -> Server -> Client | Load permissions and initial snapshot |
| `spooner:toggle` | Client -> Server -> Client | Legacy namespace kept for compatibility |
| `spooner:openDatabaseMenu` | Client -> Server -> Client | Open DB menu |
| `spooner:openSaveDbMenu` | Client -> Server -> Client | Open save/load menu |
| `spooner:autoSave` | Client -> Server | Persist autosave through `smb:writeFile` |
| `spooner:saveCustomPropset` | Client -> Server | Save custom preset on the server |
| `spooner:customPropsetsSnapshot` | Server -> Client | Full custom propsets snapshot |
| `spooner:customPropsetsChanged` | Server -> Client | Invalidate/update local catalog |

## SMB Additions

- `SMB_ModelHashLookup` for `GetModelName()` in O(1)
- `smb_ResolveCustomPropsetAnchorSpawnPosition`
- `smb_RotatePropsetOffset`
- `smb_GetCurrentSpawnResolvedPreviewYaw`
- `smb_InsertCustomPropsetGroundMarkerAtPreview`
- `smb_BuildCustomPropsetsSnapshot` / `smb_SendCustomPropsetsSnapshot`
- SMB personal menus and custom catalogs
- `smb:writeFile` for writing outside the FXServer Lua sandbox

## SQL

- No custom table

## Runtime Data

- `custom_propsets/index.json` and `custom_propsets/presets/*.json` are generated at runtime
- for publication, the repository should keep the structure empty and ignore the author's local preset files
