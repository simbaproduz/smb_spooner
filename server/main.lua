RegisterNetEvent('spooner:init')
RegisterNetEvent('spooner:toggle')
RegisterNetEvent('spooner:openDatabaseMenu')
RegisterNetEvent('spooner:openSaveDbMenu')
RegisterNetEvent('spooner:autoSave')
RegisterNetEvent('spooner:saveCustomPropset')
RegisterNetEvent('spooner:requestCustomPropsetsSnapshot')

local function SpoonerSanitizeCustomPropsetName(name)
	local slug = string.lower(name or '')
	slug = slug:gsub('[^%w%s%-_]', '')
	slug = slug:gsub('%s+', '_')
	slug = slug:gsub('_+', '_')
	slug = slug:gsub('^_+', '')
	slug = slug:gsub('_+$', '')

	if slug == '' then
		slug = 'propset'
	end

	return slug
end

local function LoadCustomPropsetsIndex()
	local raw = LoadResourceFile(GetCurrentResourceName(), 'custom_propsets/index.json')
	if not raw or raw == '' then
		return {}
	end

	local ok, decoded = pcall(json.decode, raw)
	if ok and type(decoded) == 'table' then
		return decoded
	end

	return {}
end

local function SaveCustomPropsetsIndex(index)
	table.sort(index, function(a, b)
		return tostring(a.name or '') < tostring(b.name or '')
	end)

	local resourcePath = GetResourcePath(GetCurrentResourceName())
	local filePath = resourcePath .. '/custom_propsets/index.json'
	TriggerEvent('smb:writeFile', filePath, json.encode(index))
end

local function smb_BuildCustomPropsetsSnapshot()
	local snapshot = {
		index = LoadCustomPropsetsIndex(),
		presets = {}
	}

	for _, entry in ipairs(snapshot.index) do
		if type(entry) == 'table' and type(entry.name) == 'string' and type(entry.file) == 'string' then
			local raw = LoadResourceFile(GetCurrentResourceName(), 'custom_propsets/presets/' .. entry.file)
			if raw and raw ~= '' then
				local ok, decoded = pcall(json.decode, raw)
				if ok and type(decoded) == 'table' and type(decoded.items) == 'table' then
					snapshot.presets[entry.name] = decoded
				end
			end
		end
	end

	return snapshot
end

local function smb_SendCustomPropsetsSnapshot(target)
	TriggerClientEvent('spooner:customPropsetsSnapshot', target, smb_BuildCustomPropsetsSnapshot())
end

local function BuildDevPermissions()
	local permissions = {
		maxEntities = nil,
		spawn = {
			ped = true,
			vehicle = true,
			object = true,
			propset = true,
			pickup = true,
			byName = true
		},
		delete = {
			own = {
				networked = true,
				nonNetworked = true
			},
			other = {
				networked = true,
				nonNetworked = true
			}
		},
		modify = {
			own = {
				networked = true,
				nonNetworked = true
			},
			other = {
				networked = true,
				nonNetworked = true
			}
		},
		properties = {
			freeze = true,
			position = true,
			rotation = true,
			goTo = true,
			health = true,
			invincible = true,
			visible = true,
			gravity = true,
			collision = true,
			clone = true,
			attachments = true,
			lights = true,
			registerAsNetworked = true,
			focus = true,
			ped = {
				changeModel = true,
				outfit = true,
				group = true,
				scenario = true,
				animation = true,
				clearTasks = true,
				weapon = true,
				mount = true,
				enterVehicle = true,
				resurrect = true,
				ai = true,
				knockOffProps = true,
				walkStyle = true,
				clone = true,
				cloneToTarget = true,
				lookAtEntity = true,
				clean = true,
				scale = true,
				configFlags = true,
				goToWaypoint = true,
				goToEntity = true,
				attack = true
			},
			vehicle = {
				repair = true,
				getin = true,
				engine = true,
				lights = true
			}
		}
	}

	return permissions
end

AddEventHandler('spooner:init', function()
	if Config.DevAllowAllPermissions then
		TriggerClientEvent('spooner:init', source, BuildDevPermissions())
		smb_SendCustomPropsetsSnapshot(source)
		return
	end

	local permissions = {}

	if IsPlayerAceAllowed(source, 'spooner.noEntityLimit') then
		permissions.maxEntities = nil
	else
		permissions.maxEntities = Config.MaxEntities
	end

	permissions.spawn = {}
	permissions.spawn.ped = IsPlayerAceAllowed(source, 'spooner.spawn.ped')
	permissions.spawn.vehicle = IsPlayerAceAllowed(source, 'spooner.spawn.vehicle')
	permissions.spawn.object = IsPlayerAceAllowed(source, 'spooner.spawn.object')
	permissions.spawn.propset = IsPlayerAceAllowed(source, 'spooner.spawn.propset')
	permissions.spawn.pickup = IsPlayerAceAllowed(source, 'spooner.spawn.pickup')
	permissions.spawn.byName = IsPlayerAceAllowed(source, 'spooner.spawn.byName')

	permissions.delete = {}
	permissions.delete.own = {}
	permissions.delete.own.networked = IsPlayerAceAllowed(source, 'spooner.delete.own.networked')
	permissions.delete.own.nonNetworked = IsPlayerAceAllowed(source, 'spooner.delete.own.nonNetworked')
	permissions.delete.other = {}
	permissions.delete.other.networked = IsPlayerAceAllowed(source, 'spooner.delete.other.networked')
	permissions.delete.other.nonNetworked = IsPlayerAceAllowed(source, 'spooner.delete.other.nonNetworked')

	permissions.modify = {}
	permissions.modify.own = {}
	permissions.modify.own.networked = IsPlayerAceAllowed(source, 'spooner.modify.own.networked')
	permissions.modify.own.nonNetworked = IsPlayerAceAllowed(source, 'spooner.modify.own.nonNetworked')
	permissions.modify.other = {}
	permissions.modify.other.networked = IsPlayerAceAllowed(source, 'spooner.modify.other.networked')
	permissions.modify.other.nonNetworked = IsPlayerAceAllowed(source, 'spooner.modify.other.nonNetworked')

	permissions.properties = {}
	permissions.properties.freeze = IsPlayerAceAllowed(source, 'spooner.properties.freeze')
	permissions.properties.position = IsPlayerAceAllowed(source, 'spooner.properties.position')
	permissions.properties.rotation = IsPlayerAceAllowed(source, 'spooner.properties.rotation')
	permissions.properties.goTo = IsPlayerAceAllowed(source, 'spooner.properties.goTo')
	permissions.properties.health = IsPlayerAceAllowed(source, 'spooner.properties.health')
	permissions.properties.invincible = IsPlayerAceAllowed(source, 'spooner.properties.invincible')
	permissions.properties.visible = IsPlayerAceAllowed(source, 'spooner.properties.visible')
	permissions.properties.gravity = IsPlayerAceAllowed(source, 'spooner.properties.gravity')
	permissions.properties.collision = IsPlayerAceAllowed(source, 'spooner.properties.collision')
	permissions.properties.clone = IsPlayerAceAllowed(source, 'spooner.properties.clone')
	permissions.properties.attachments = IsPlayerAceAllowed(source, 'spooner.properties.attachments')
	permissions.properties.lights = IsPlayerAceAllowed(source, 'spooner.properties.lights')
	permissions.properties.registerAsNetworked = IsPlayerAceAllowed(source, 'spooner.properties.registerAsNetworked')
	permissions.properties.focus = IsPlayerAceAllowed(source, 'spooner.properties.focus')

	permissions.properties.ped = {}
	permissions.properties.ped.changeModel = IsPlayerAceAllowed(source, 'spooner.properties.ped.changeModel')
	permissions.properties.ped.outfit = IsPlayerAceAllowed(source, 'spooner.properties.ped.outfit')
	permissions.properties.ped.group = IsPlayerAceAllowed(source, 'spooner.properties.ped.group')
	permissions.properties.ped.scenario = IsPlayerAceAllowed(source, 'spooner.properties.ped.scenario')
	permissions.properties.ped.animation = IsPlayerAceAllowed(source, 'spooner.properties.ped.animation')
	permissions.properties.ped.clearTasks = IsPlayerAceAllowed(source, 'spooner.properties.ped.clearTasks')
	permissions.properties.ped.weapon = IsPlayerAceAllowed(source, 'spooner.properties.ped.weapon')
	permissions.properties.ped.mount = IsPlayerAceAllowed(source, 'spooner.properties.ped.mount')
	permissions.properties.ped.enterVehicle = IsPlayerAceAllowed(source, 'spooner.properties.ped.enterVehicle')
	permissions.properties.ped.resurrect = IsPlayerAceAllowed(source, 'spooner.properties.ped.resurrect')
	permissions.properties.ped.ai = IsPlayerAceAllowed(source, 'spooner.properties.ped.ai')
	permissions.properties.ped.knockOffProps = IsPlayerAceAllowed(source, 'spooner.properties.ped.knockOffProps')
	permissions.properties.ped.walkStyle = IsPlayerAceAllowed(source, 'spooner.properties.ped.walkStyle')
	permissions.properties.ped.clone = IsPlayerAceAllowed(source, 'spooner.properties.ped.clone')
	permissions.properties.ped.cloneToTarget = IsPlayerAceAllowed(source, 'spooner.properties.ped.cloneToTarget')
	permissions.properties.ped.lookAtEntity = IsPlayerAceAllowed(source, 'spooner.properties.ped.lookAtEntity')
	permissions.properties.ped.clean = IsPlayerAceAllowed(source, 'spooner.properties.ped.clean')
	permissions.properties.ped.scale = IsPlayerAceAllowed(source, 'spooner.properties.ped.scale')
	permissions.properties.ped.configFlags = IsPlayerAceAllowed(source, 'spooner.properties.ped.configFlags')
	permissions.properties.ped.goToWaypoint = IsPlayerAceAllowed(source, 'spooner.properties.ped.goToWaypoint')
	permissions.properties.ped.goToEntity = IsPlayerAceAllowed(source, 'spooner.properties.ped.goToEntity')
	permissions.properties.ped.attack = IsPlayerAceAllowed(source, 'spooner.properties.ped.attack')

	permissions.properties.vehicle = {}
	permissions.properties.vehicle.repair = IsPlayerAceAllowed(source, 'spooner.properties.vehicle.repair')
	permissions.properties.vehicle.getin = IsPlayerAceAllowed(source, 'spooner.properties.vehicle.getin')
	permissions.properties.vehicle.engine = IsPlayerAceAllowed(source, 'spooner.properties.vehicle.engine')
	permissions.properties.vehicle.lights = IsPlayerAceAllowed(source, 'spooner.properties.vehicle.lights')

	TriggerClientEvent('spooner:init', source, permissions)
	smb_SendCustomPropsetsSnapshot(source)
end)

AddEventHandler('spooner:toggle', function()
	if Config.DevAllowAllPermissions or IsPlayerAceAllowed(source, 'spooner.view') then
		TriggerClientEvent('spooner:toggle', source)
	end
end)

AddEventHandler('spooner:openDatabaseMenu', function()
	if Config.DevAllowAllPermissions or IsPlayerAceAllowed(source, 'spooner.view') then
		TriggerClientEvent('spooner:openDatabaseMenu', source)
	end
end)

AddEventHandler('spooner:openSaveDbMenu', function()
	if Config.DevAllowAllPermissions or IsPlayerAceAllowed(source, 'spooner.view') then
		TriggerClientEvent('spooner:openSaveDbMenu', source)
	end
end)

RegisterCommand('spooner_refresh_perms', function(source, args, raw)
	TriggerClientEvent('spooner:refreshPermissions', -1)
end, true)

AddEventHandler('spooner:autoSave', function(path, content)
	if not path or path == '' then return end
	if not (path:match('%.json$') or path:match('%.txt$')) then return end
	-- os.execute e io.open são sandboxeados no FXServer (EACCES em qualquer chamada)
	-- solução: delegar para filewriter.js integrado que usa Node.js fs sem sandbox
	local t = os.date('%d/%m/%Y %H:%M:%S')
	print('[smb_spooner] auto-save disparado: ' .. path .. ' - ' .. t)
	TriggerEvent('smb:writeFile', path, tostring(content or ''))
end)

AddEventHandler('spooner:requestCustomPropsetsSnapshot', function()
	smb_SendCustomPropsetsSnapshot(source)
end)

AddEventHandler('spooner:saveCustomPropset', function(displayName, content)
	local src = source
	local name = tostring(displayName or ''):gsub('^%s+', ''):gsub('%s+$', '')

	if name == '' or not content or content == '' then
		print(('[spooner] saveCustomPropset rejeitado: nome/conteudo invalido (source=%s)'):format(tostring(src)))
		TriggerClientEvent('spooner:customPropsetSaveResult', src, false, 'invalid_name_or_content')
		return
	end

	local ok, decoded = pcall(json.decode, content)
	if not ok or type(decoded) ~= 'table' or type(decoded.items) ~= 'table' or #decoded.items == 0 then
		print(('[spooner] saveCustomPropset rejeitado: propset vazio/invalido "%s" (source=%s)'):format(name, tostring(src)))
		TriggerClientEvent('spooner:customPropsetSaveResult', src, false, 'invalid_or_empty')
		return
	end

	print(('[spooner] saveCustomPropset recebido: "%s" (%s itens)'):format(name, tostring(#decoded.items)))

	local slug = SpoonerSanitizeCustomPropsetName(name)
	local fileName = slug .. '.json'
	local relativeFile = 'custom_propsets/presets/' .. fileName
	local resourcePath = GetResourcePath(GetCurrentResourceName())

	local index = LoadCustomPropsetsIndex()
	local updated = false

	for _, entry in ipairs(index) do
		if entry.name == name or entry.file == fileName then
			entry.name = name
			entry.file = fileName
			entry.itemCount = #decoded.items
			entry.updatedAt = os.date('!%Y-%m-%dT%H:%M:%SZ')
			updated = true
			break
		end
	end

	if not updated then
		table.insert(index, {
			name = name,
			file = fileName,
			itemCount = #decoded.items,
			updatedAt = os.date('!%Y-%m-%dT%H:%M:%SZ')
		})
	end

	TriggerEvent('smb:writeFile', resourcePath .. '/' .. relativeFile, tostring(content))
	SaveCustomPropsetsIndex(index)

	smb_SendCustomPropsetsSnapshot(-1)
	TriggerClientEvent('spooner:customPropsetsChanged', src, name)
	TriggerClientEvent('spooner:customPropsetSaveResult', src, true, name)
end)
