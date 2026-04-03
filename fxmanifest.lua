-- _|_   (_ ||\/|__) /\\ _ _ _ _|   _
--  |    __)||  |__)/--|_| (_(_||_|/_
--                     |
-- smb_spooner - Fork autoral do Spooner mantido por SIMBAproduz
-- Depende de: uiprompt (filewriter integrado — sem dependência externa)
-- Criado: 2026-04-03

fx_version "cerulean"
game "rdr3"
lua54 "yes"
rdr3_warning "I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships."

name "smb_spooner"
author "kibukj / SMB"
description "Author-maintained Spooner fork for RedM by SIMBAproduz"
repository "https://github.com/kibook/spooner"

files {
	"ui/index.html",
	"ui/style.css",
	"ui/script.js",
	"ui/keyboard.ttf",
	"ui/chineserocks.ttf",
	"ui/rdr3.css"
}

ui_page "ui/index.html"

shared_scripts {
	"shared/config.lua",
	"shared/slaxml.lua"
}

server_scripts {
	"server/main.lua",
	"server/filewriter.js"
}

dependency "uiprompt"

client_script "@uiprompt/uiprompt.lua"

client_scripts {
	"data/rdr3/personal.lua",
	"data/rdr3/animations.lua",
	"data/rdr3/bones.lua",
	"data/rdr3/objects.lua",
	"data/rdr3/pedConfigFlags.lua",
	"data/rdr3/peds.lua",
	"data/rdr3/pickups.lua",
	"data/rdr3/propsets.lua",
	"data/rdr3/scenarios.lua",
	"data/rdr3/vehicles.lua",
	"data/rdr3/walkstyles.lua",
	"data/rdr3/weapons.lua"
}

client_script "client/main.lua"
