# smb_spooner

Fork autoral do Spooner mantido por `SIMBAproduz` para RedM.

Sou um entusiasta de worldbuilding e tooling de runtime, com um perfil criativo e metodico. O `smb_spooner` nasce desse recorte: uma versao do Spooner ajustada para atender diretamente as minhas necessidades de composicao de cena, previsibilidade operacional e iteracao rapida.

Este resource parte do [kibook/spooner](https://github.com/kibook/spooner) e evolui essa base com patches de performance, persistencia local, menus pessoais e fluxo SMB para worldbuilding.

## Fork lineage e creditos

`smb_spooner` nao nasce do zero.

- upstream original: [kibook/spooner](https://github.com/kibook/spooner)
- linha de comparacao local usada durante o desenvolvimento: `spooni_spooner`
- fork operacional atual: `smb_spooner`

Creditos:

- `kibook`: arquitetura original do spooner
- `Spooni-Development`: overhaul da linha `spooni_spooner` usada como referencia local de comparacao
- `SIMBAproduz / SMB`: integracoes, refactors, menus SMB, persistencia, autosave, custom propsets, otimizacoes e ajustes de runtime

## O que faz

- Spawn e manipulacao de peds, veiculos, objetos, pickups e propsets
- Freecam + cursor de placement para montagem de cena em runtime
- Preview local de modelos antes do spawn
- Custom propsets com preview e spawn ancorado no mundo
- Menus pessoais `personalOyate`, `personalPeds`, `personalObjetos`, `personalPlantas`
- Save/load de database local e autosave integrado
- Troca de idioma em runtime (`pt-BR` / `en-US`) com persistencia local por cliente
- Hotkeys/commands adaptados ao runtime RedM do projeto
- Tecla `3` para spawnar objeto com rotacao zerada nos tres eixos

## Dependencias

- `uiprompt` (RedM)

> File writer integrado: a logica de escrita de arquivos (autosave, propsets) esta
> embutida em `filewriter.js`. Nao e necessario instalar `smb_filewriter` separadamente.

- FXServer/RedM com NUI habilitada
- FXServer/RedM com NUI habilitada

## Estrutura

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

## Configuraveis principais

Veja `config.lua`:

- `shared/config.lua`
- `Config.DevAllowAllPermissions`
- `Config.ToggleControl`
- `Config.SpawnMenuControl`
- `Config.PropMenuControl`
- `Config.SaveLoadDbMenuControl`
- `Config.HelpMenuControl`

Autosave:

- intervalo atual do autosave integrado: `3 minutos`
- o path do autosave e definido pela UI do spooner e persistido em KVP local

Idioma:

- seletor `PTBR | EN US` no menu `J`
- a escolha fica salva em KVP local do resource
- prompts, notifies, HUD e NUI acompanham o ultimo idioma escolhido

## Comandos

- `/spooner` - abre/fecha o spooner
- `/spooner_spawn` - spawna a selecao atual no cursor
- `/spooner_db` - abre o menu de database
- `/spooner_savedb` - abre o menu de save/load
- `/spooner_propset_anchor` - insere/substitui o marcador de ancora do propset
- `/spooner_migrate_old_dbs` - migra databases antigas
- `spooner_refresh_perms` - refresh de permissoes no server

## Controles

| Tecla | Funcao |
|---|---|
| `W/A/S/D` | mover camera |
| `Space` / `Shift` | subir / descer |
| `E` | spawnar selecao atual |
| `3` | spawnar objeto com rotacao zerada nos tres eixos |
| `Left click` | selecionar / anexar |
| `Right click` | deletar |
| `C/V` | rotacionar |
| `B` | trocar eixo de rotacao |
| `Q/Z/Arrow keys` | ajustar posicao |
| `I` | alternar modo de ajuste |
| `U` | toggle place on ground |
| `7` | desligar ajuste |
| `8` | voltar para ajuste livre |
| `G` | clonar |
| `PgUp/PgDn` ou wheel | ajustar velocidade |
| `R` | trocar o tipo de velocidade editada |
| `F` | abrir menu de spawn |
| `X` | abrir database |
| `Tab` | abrir propriedades |
| `J` | abrir save/load |
| `PTBR / EN US` | alternar idioma da NUI/runtime no menu `J` |
| `H` | abrir ajuda |
| `1` | mostrar/ocultar painel de controles |
| `2` | toggle frozen do proximo spawn |
| `M` | mostrar/ocultar handles |
| `Alt` | focar entidade |
| `Ctrl` | alternar modo de foco |
| `Del` | toggle do spooner em runtime |
| `F11` | key mapping opcional para `/spooner` |
| `F12` | inserir marcador de ancora do propset custom |

## Diferencas principais vs spooni_spooner

- recurso renomeado e reorganizado como `smb_spooner`
- fork agora e RedM-only no empacotamento e no manifesto
- `filewriter.js` integrado; nao depende mais de `smb_filewriter`
- suporte a custom propsets persistidos na propria resource
- autosave integrado com path persistido em KVP local
- locale switcher `pt-BR` / `en-US` com persistencia da escolha do cliente
- menus pessoais SMB: `personalPlantas`, `personalObjetos`, `personalOyate`, `personalPeds`, `personalPropsets`
- otimizacoes de performance na NUI: lazy load, caches de listas, debounce, cleanup de DOM, `contain: content`
- `SMB_ModelHashLookup` para `GetModelName()` O(1)
- preview e spawn de objeto com rotacao sincronizada; tecla `3` zera rotacao
- retorno ao ultimo submenu com item selecionado/enquadrado
- remocao da superficie `Spooni` dedicada e foco no workflow de worldbuilding do fork

## Eventos e fluxo

| Nome | Direcao | Descricao |
|---|---|---|
| `spooner:init` | Client -> Server -> Client | Carrega permissoes e snapshot inicial |
| `spooner:toggle` | Client -> Server -> Client | Namespace legado mantido para compatibilidade |
| `spooner:openDatabaseMenu` | Client -> Server -> Client | Abre o DB menu |
| `spooner:openSaveDbMenu` | Client -> Server -> Client | Abre o menu de save/load |
| `spooner:autoSave` | Client -> Server | Persiste autosave via `smb:writeFile` |
| `spooner:saveCustomPropset` | Client -> Server | Salva preset custom no servidor |
| `spooner:customPropsetsSnapshot` | Server -> Client | Snapshot completo dos propsets custom |
| `spooner:customPropsetsChanged` | Server -> Client | Invalida/atualiza catalogo local |

## Adicoes SMB

- `SMB_ModelHashLookup` para `GetModelName()` O(1)
- `smb_ResolveCustomPropsetAnchorSpawnPosition`
- `smb_RotatePropsetOffset`
- `smb_GetCurrentSpawnResolvedPreviewYaw`
- `smb_InsertCustomPropsetGroundMarkerAtPreview`
- `smb_BuildCustomPropsetsSnapshot` / `smb_SendCustomPropsetsSnapshot`
- Menus pessoais e catalogos custom da linha SMB
- `smb:writeFile` para escrita fora do sandbox do FXServer

## SQL

- Nenhuma tabela propria

## Dados de runtime

- `custom_propsets/index.json` e `custom_propsets/presets/*.json` sao gerados em runtime
- para publicacao, o repo deve manter a estrutura vazia e ignorar os presets locais do autor

## Excecoes ao padrao SMB

- O nome da pasta/resource foi renomeado para `smb_spooner`.
- O namespace publico legado `spooner:*` foi mantido para compatibilidade com o fork atual e com contratos internos ja existentes.
- Os novos helpers SMB seguem `smb_` / `SMB_`.
- Os helpers privados de NUI adicionados na otimizacao (`_getEls`, `_setText`) usam underscore local por serem internos ao arquivo e nao integrarem interface publica.
