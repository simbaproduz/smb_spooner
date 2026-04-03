var peds = [];
var pedVisibleModels = [];
var vehicleVisibleModels = [];
var objectVisibleModels = [];
var propsetVisibleModels = [];
var personalPlantasVisibleModels = [];
var personalObjetosVisibleModels = [];
var personalOyateVisibleModels = [];
var personalCustomPropsetVisibleModels = [];
var personalPedsVisibleModels = [];
var vehicles = [];
var objects = [];
var customPropsets = [];
var listSelectionSyncState = {};
var objectListCacheKey = null;
var pedListCacheKey = null;
var propsetListCacheKey = null;
var scenarioListCacheKey = null;
var _objectSearchDebounce = null;

// --- Auto-save ---
var autoSaveEnabled = false;
var autoSaveInterval = null;
var autoSavePath = '';

// --- fim Auto-save ---
// Cache de referências DOM para updateSpoonerHud — evita querySelector por frame
var _els = null;
function _getEls() {
	if (_els) return _els;
	_els = {
		crosshair: document.getElementById('crosshair'),
		entityInfo: document.getElementById('entity-info'),
		entityId: document.getElementById('entity-id'),
		entityNetId: document.getElementById('entity-net-id'),
		basicControls: document.getElementById('basic-controls'),
		entityControls: document.getElementById('entity-controls'),
		spawnInfo: document.getElementById('spawn-info'),
		spawnId: document.getElementById('spawn-id'),
		speed: document.getElementById('speed'),
		adjustMode: document.getElementById('adjust-mode'),
		rotateMode: document.getElementById('rotate-mode'),
		placeOnGroundCont: document.getElementById('place-on-ground-container'),
		placeOnGround: document.getElementById('place-on-ground'),
		camX: document.getElementById('cam-x'),
		camY: document.getElementById('cam-y'),
		camZ: document.getElementById('cam-z'),
		camHeading: document.getElementById('cam-heading'),
		cursorX: document.getElementById('cursor-x'),
		cursorY: document.getElementById('cursor-y'),
		cursorZ: document.getElementById('cursor-z'),
		adjustSpeed: document.getElementById('adjust-speed'),
		rotateSpeed: document.getElementById('rotate-speed'),
		modelName: document.getElementById('model-name'),
		entityType: document.getElementById('entity-type'),
		focusInfo: document.getElementById('focus-info'),
		focusTarget: document.getElementById('focus-target'),
		focusMode: document.getElementById('focus-mode'),
		pedMenu: document.getElementById('ped-menu'),
		vehicleMenu: document.getElementById('vehicle-menu'),
		objectMenu: document.getElementById('object-menu'),
		propsetMenu: document.getElementById('propset-menu'),
		pickupMenu: document.getElementById('pickup-menu'),
		personalPlantasMenu: document.getElementById('personal-plantas-menu'),
		personalObjetosMenu: document.getElementById('personal-objetos-menu'),
		personalOyateMenu: document.getElementById('personal-oyate-menu'),
		personalPropsetsCustMenu: document.getElementById('personal-propsets-custom-menu'),
		personalPedsMenu: document.getElementById('personal-peds-menu'),
	};
	return _els;
}

// Escreve textContent só se o valor mudou — evita reflow desnecessário
function _setText(el, val) {
	var s = val == null ? '' : String(val);
	if (el.textContent !== s) el.textContent = s;
}

var personal = [
	// arvores
	"p_sap_fir_aa_sim",
	"p_tree_angel_oak",
	"p_tree_baldcypress_03_script",
	"p_tree_baldcypress_04_sm_a",
	"p_tree_baldcypress_06a",
	"p_tree_baldcypress_06b",
	"p_tree_baldcypress_grave",
	"p_tree_blue_oak_01",
	"p_tree_hangingtree_moss",
	"p_tree_hangingtreeoak01",
	"p_tree_liveoak_01",
	"p_tree_liveoak_moss_01",
	"p_tree_log_06a_m",
	"p_tree_log_09",
	"p_tree_log_09_m",
	"p_tree_log_12_dead",
	"p_tree_log_redwood_01",
	"p_tree_magnolia_01",
	"p_tree_magnolia_02_lg",
	"p_tree_magnolia_02_md",
	"p_tree_mangrove_02",
	"p_tree_maple_bent_03",
	"p_tree_oak_01",
	"p_tree_poor_joe_oak",
	"p_tree_riodel_01",
	"p_tree_riv_maple_01",
	"p_tree_riv_maple_04",
	"p_tree_riv_poplar_01",
	"p_tree_riv_poplar_02",
	"p_tree_stump_08_bc",
	"p_tree_stump_08_bc_l004",
	"p_tree_stump_cut_01_m",
	"p_tree_stump_cut_02_m",
	"p_tree_willow_02",
	"rdr2_tree_beech",
	"rdr2_tree_brokentree",
	"rdr2_tree_gimlet",
	"rdr2_tree_sycamore",
	"rdr2_tree_utahjuniper",
	// plantas / ervas
	"s_inv_huckleberry01x",
	"s_inv_rhubarb01bx",
	"s_inv_rhubarb01x",
	"s_inv_thyme01bx",
	"s_inv_thyme01x"
];
var personalObjetos = [
	{ category: "Tipis (spooni_tippi)", items: [
		"tippi2",
		"tippi3"
	]},
	{ category: "Decoracao Indigena / Sonhos", items: [
		"p_charmscreepy01x",
		"p_charmscreepy01x_a",
		"p_charmscreepy01x_b",
		"p_charmscreepy01x_small",
		"p_disdreamcatcherwind01x",
		"p_disdreamcatcherwind02x",
		"p_disdreamcatcherwind03x",
		"p_disdreamcatcherwind04x",
		"p_disdreamcatcherwind05x",
		"p_indianartifact01x",
		"p_indianartifact03x",
		"p_indianbackrest01x",
		"p_indiandream01x",
		"p_indiandream01x_a",
		"p_indiandream02x",
		"p_indiandream03x",
		"p_indianfan01x",
		"p_indianfan02x",
		"p_arrowdisplay01x",
		"p_arrowdisplay02x",
		"p_bowdisplay01x",
		"p_targetarchery01x",
		"p_targetlarge01x",
		"p_targetsmall01x",
		"p_staffindian03x",
		"p_cs_indianpipebag01x",
		"p_potteryindian01x",
		"p_potteryindian02x",
		"p_potteryindian10x",
		"p_basketindian01x",
		"p_basketindian02x",
		"p_basketindian03x",
		"p_graveindian01x",
		"p_mptenttrack301x"
	]},
	{ category: "Cranios / Ossos / Macabro", items: [
		"p_spookynative01x",
		"p_spookynative02x",
		"p_spookynative03x",
		"p_spookynative04x",
		"p_spookynative05x",
		"p_spookynative07x",
		"p_spookynative09x",
		"p_spookynative11x",
		"p_spookynative11x_a",
		"p_spookynative12x",
		"p_spookyskulls01x",
		"p_spookyskulls02x_a",
		"p_spookyskulls03x",
		"p_spookyskulls04x",
		"p_spookyskulls05x",
		"p_spookyskulls06x",
		"p_spookyskulls07ax",
		"p_spookyskulls07bx",
		"p_spookyskulls08x",
		"p_skullpost01x",
		"p_skullpost02x",
		"p_skullpost03x",
		"p_bonesskeleton02x",
		"p_bonesskeleton03x",
		"p_bonesskeleton04x",
		"p_humanskeleton02x_arml",
		"p_humanskeleton02x_calfr",
		"p_humanskeleton02x_footr",
		"p_humanskeleton02x_forearmr",
		"p_humanskeleton02x_handr",
		"p_humanskeleton02x_legl",
		"p_humanskeleton02x_thighr",
		"p_humanskeleton02x_torso",
		"p_humanskeleton02x_upperarmr",
		"s_male_skeleton01",
		"s_male_skeleton03",
		"p_dis_scm_deadsnake",
		"p_voodoodrum01x"
	]},
	{ category: "Fogueiras / Tochas", items: [
		"p_campfire02x",
		"p_campfirecombined02x",
		"p_campfirecombined03x",
		"p_campfirecook01x",
		"p_campfireembers01x",
		"p_campfirefresh01x",
		"p_campfireprop02x",
		"p_campfirerock01x",
		"p_campfirewhitefish03x",
		"p_cs_campfirecmbnd01x",
		"p_scoutfireelkantlers01x",
		"p_torchpost01x",
		"p_torchpostalwayson01x",
		"s_campfire01x",
		"s_interact_torch",
		"s_interact_torch_crowd"
	]},
	{ category: "Acampamento / Mobilia", items: [
		"p_ambbed01x",
		"p_ambbundle01x",
		"p_ambcart02x",
		"p_ambclothhang01x",
		"p_ambfloorfur02x",
		"p_ambfloorroll01x",
		"p_ambfloorrug04x",
		"p_ambfloorrug07x",
		"p_ambpeltstack01x",
		"p_ambsticks01x",
		"p_ambwoodpile01x",
		"p_bench_log01x",
		"p_bench_log02x",
		"p_bench_log05x",
		"p_bench_log06x",
		"p_bench_log07x",
		"p_chair_barrel04b",
		"p_stool04x",
		"p_tableset01x",
		"p_trunk06x",
		"p_clothesline01x",
		"p_hathang01x",
		"p_ropewall_cs02x",
		"s_awningsur",
		"s_bedrollfurlined01x",
		"s_bedrollopen01x"
	]},
	{ category: "Comida / Cozinha", items: [
		"p_basketonion02x",
		"p_basketpotato01x",
		"p_camp_cup_01x",
		"p_camp_plate_03x",
		"p_cookgrate02x",
		"p_cuttingboard01x",
		"p_driedmushroom01x",
		"p_fishhanging01x",
		"p_fishhanging10x",
		"p_meatfilet01x",
		"p_meatpile01x",
		"p_panlg01x",
		"p_whitefishfilet01xb",
		"p_woodspoon01x",
		"p_main_lamb_heart01x",
		"p_preybunny01x",
		"p_shopbait01x",
		"p_deerhanging02x",
		"s_meatbit_chunck_large01x",
		"s_meatbit_chunck_small01x",
		"prop_deadfish_01",
		"mp001_p_mp_fishhangi01x",
		"mp007_p_fishhanging01x_catfish"
	]},
	{ category: "Madeira / Estrutura", items: [
		"p_cordwood03x",
		"p_gangwood01x",
		"p_kindling02x",
		"p_woodpiece02x",
		"p_woodpiece05x",
		"p_woodpile02x",
		"p_woodpilechopped01x",
		"p_treestump02x",
		"p_app_stablefence01x",
		"p_app_stablefence02x",
		"p_app_stablefence04x",
		"p_app_stablefence06x",
		"p_barricade03x",
		"s_splitfirelog01x",
		"s_splitfirelog02x",
		"mp001_s_splitfirelog01x"
	]},
	{ category: "Pelts / Caca", items: [
		"p_antlers04x",
		"p_cs_pelt_xlarge_buffalo",
		"p_shoppeltbuffalo01x",
		"p_bobcatbloodpools01x",
		"p_pantherblood01x",
		"mp005_p_mp_predhunt_skull03x",
		"mp005_p_mp_predhunt_skull05x",
		"mp005_s_posse_goodsbundle01x"
	]},
	{ category: "Agua / Utilidades", items: [
		"p_basin01sm",
		"p_basin01x",
		"p_basinwater01x",
		"p_boiler02x",
		"p_bucket03x",
		"p_can06x",
		"p_canoe01x",
		"p_cs_bucket01bx",
		"p_wheelbarrow01x",
		"p_boat_oar_01_s"
	]},
	{ category: "Armadilhas / Ferramentas", items: [
		"p_trap01x",
		"p_trap01x_damaged",
		"p_trap02x",
		"p_cleaver01x",
		"p_rag02x",
		"p_cs_rag01x",
		"p_package05x",
		"p_prisoncage01x",
		"s_ropehogtiehands01x"
	]},
	{ category: "Vegetacao Extra", items: [
		"rdr_bush_arec_ab_sim",
		"rdr_bush_fern_ba_sim",
		"rdr_bush_fern_mix_da_sim",
		"rdr_bush_fern_tall_cb_sim",
		"rdr_bush_junip_ab_sim"
	]},
	{ category: "Outros", items: [
		"p_vfxbloodspatter",
		"p_washtubblood02x_cloth",
		"p_bloodywedgestick01x",
		"p_bottlebeer01a",
		"p_bottlecrate_hob",
		"p_debrispile04x",
		"p_debrispile08x",
		"p_decapitated_head01x_2",
		"p_decapitated_head02x_2",
		"p_decapitated_head03x",
		"p_decapitated_head3x_2",
		"p_jorgemontezhead01x",
		"mp_big_rock_scan_07",
		"mp001_p_mp_kettle03_fire01x",
		"s_bucketoblood01x",
		"s_headsevered01x",
		"s_kieranhead01x",
		"s_murdervic01x",
		"_test_campfire_interact_log_b"
	]}
];
var personalOyate = [
	{ master: "Acampamento", category: "Cordas / Amarracao", items: [
		"p_ropecoil01x",
		"p_ambropedraped01x",
		"p_ambropeloop01x",
		"p_ambropepile01x",
		"p_ambropepile02x",
		"p_ambtentrope01x",
		"p_ambtentrope02x",
		"p_campropetie02x",
		"p_campropetie03x",
		"p_rope_frayed01x",
		"p_ropegroup01x",
		"s_ropebundle01x",
		"s_hangingropes01x",
		"p_basketrope01x",
		"p_gen_ropetie01x",
		"p_clothesline01x",
		"s_ropehogtiehands01x",
		"p_ropehook_01x",
		"p_ropewall_cs02x",
		"p_grp_w_tra_ropewall01x",
		"p_ambcordfresh01x",
		"aur_wikup_a_ropes01",
		"aur_wikup_a_ropes02",
		"aur_wikup_c_ropes02",
		"aur_wikup_c_ropes004",
	]},
	{ master: "Acampamento", category: "Estabulo / Curral", items: [
		"p_haypile01x",
		"p_haypile02x",
		"p_haypile03x",
		"p_haypile04x",
		"p_handfulofhay",
		"p_haypilepitchfork01x",
		"p_gndblnd_hay01x",
		"p_gndblnd_hay02x",
		"p_gndblnd_hay03x",
		"mp001_p_mp_haybalecover01x",
		"mp001_p_mp_haybalecover03x",
		"s_haybale01x",
		"s_horsnack_haycube01x",
		"p_feedtrough01x",
		"p_feedtroughsml01x",
		"p_watertrough01x",
		"p_watertrough01x_new",
		"p_watertrough02x",
		"p_watertroughsml01x",
		"p_feedbag01x",
		"p_feedbag01bx",
		"p_feedbags01x",
		"p_feedbags02x",
		"s_leatherfeedbucket01x",
		"p_feed_scoop_001",
		"p_bucketpigfeed02x",
		"p_cs_saddle01x",
		"p_cs_saddle02x",
		"p_cs_saddle03x",
		"p_cs_saddle_bag01x",
		"p_cs_saddlebundle01x",
		"p_saddlestand01x",
		"p_saddlestand02x",
		"p_saddlestand03x",
		"p_horsesaddle01x",
		"p_horseshoe01x",
		"p_horseshoestake01x",
		"s_oldhorseshoe01x",
		"p_stableprops01x",
		"p_stableprops01xhooks",
		"p_stableprops02x",
		"p_stableprops03x",
		"p_stableprops04x",
		"p_app_stablegate01x",
		"p_app_stablegate02x",
		"p_app_stablepost01x",
		"p_barnanimalgate01x",
		"p_barnanimalgate02x",
		"p_doorcorral01x",
		"p_gate_stable02x",
		"p_pro_stabledoor01x",
		"p_pro_stabledoor02x",
		"p_pitchfork01x",
		"p_pitchfork02x",
		"p_pitchfork03x",
		"p_shovel01x",
		"p_shovel02x",
		"p_shovel03x",
		"p_fence_cattle01x",
		"p_fence_cattle02x",
		"p_fence_cattle03x",
		"p_fence_cattle04x",
		"p_fence_cattle05x",
		"p_fence_lorge01x",
		"p_fence_lorge02x",
		"val_fencepen01_ax",
		"val_fencepen01_bx",
		"val_fencepen01_cx",
		"val_fencepen01_dx",
		"val_fencepen01_ex",
		"val_fencepen01_fx",
	]},
	{ master: "Acampamento", category: "Pontes / Escadas / Rampas", items: [
		"p_dis_ropebridge",
		"p_dis_ropebridge2",
		"p_dis_ropebridge3",
		"p_dis_ropebridge4",
		"p_van_rope_bridge",
		"p_devilcave_bridge",
		"p_ladder01x",
		"p_ladder02x",
		"p_stepstool01x",
		"s_gallowsstairs01x",
		"s_gallowsstairs02x",
		"s_gallowsstairs03x",
		"s_gallowsstairs04x",
		"s_gallowsstairs05x",
		"s_gallowsstairs_03x",
		"mp007_p_backdrop_stairs01x",
		"mp007_p_backdrop_stairs01x_s",
		"p_gen_ramp",
		"p_gen_ramp_b",
		"new_p_gen_ramp_static",
		"p_boatramp01x",
		"p_woodramp01x_sea",
		"s_serramp01x",
		"p_woodplank01x",
		"p_woodplank03x",
		"p_woodplank04x",
		"mp006_p_mp_gankplank01x",
		"p_plank_caster01x",
		"p_plank_caster02x",
		"p_fence_plank01",
		"p_fence_plank02",
		"p_fence_plank03",
		"p_fence_plank04",
		"p_fence_plank_post01",
		"p_plankwall_01",
		"p_plankwall_01a",
		"p_plankwall_02",
		"p_plankbrk_01a",
		"p_plankrise_h",
		"p_planks1_h",
		"woodtramp01",
	]},
	{ master: "Acampamento", category: "Tendas / Abrigos", items: [
		"s_tentbison01x",
		"p_tentplain01x",
		"p_tentmexican01x",
		"p_ambtenthide01x",
		"p_ambtenthide01b",
		"p_ambtentbark01b",
		"p_indiantipibag01x",
		"tippi2",
		"tippi3",
		"p_ambtentgrass01x",
		"p_ambtentdebris01x",
		"p_ambtentdebris02x",
		"p_ambtentdebris03x",
		"tippi1",
		"s_tentcaravanpartsa",
		"s_tentcaravanpartscrate",
	]},
	{ master: "Acampamento", category: "Tochas / Lanternas / Luz", items: [
		"p_torch01x",
		"p_torch_02x",
		"p_torchholder01x",
		"p_torchpost01x",
		"p_torchpostalwayson01x",
		"p_lantern05x",
		"p_lantern05xhang",
		"p_lantern05xhang02",
		"p_lantern07x",
		"p_lantern07newx",
		"p_lantern09x",
		"p_lantern09xhang",
		"p_lanternstick09x",
		"p_dislantern01x",
		"s_interact_lantern01x",
		"s_interact_lantern02x",
		"s_interact_lantern03x",
		"p_candlebot01x",
		"p_candlegroup06x",
		"p_candlelamp01x",
		"s_interact_torch",
		"s_interact_torch_crowd",
		"p_candlegroup04x",
	]},
	{ master: "Artesanato & Adornos", category: "Ceramica / Cestas / Gourds", items: [
		"p_basketindian01x",
		"p_basketindian02x",
		"p_basketindian03x",
		"p_potteryindian01x",
		"p_potteryindian02x",
		"p_potteryindian03x",
		"p_potteryindian04x",
		"p_potteryindian05x",
		"p_potteryindian07x",
		"p_potteryindian08x",
		"p_potteryindian09x",
		"p_potteryindian10x",
		"p_potclay01x",
		"p_potclay02x",
		"p_potclay03x",
		"p_potclay04x",
		"p_potclay05x",
		"p_potclayshard01x",
		"p_gourdwater01x",
		"p_gourdsbundle01x",
		"p_gen_gourdwater01x",
		"p_basket09x",
		"p_basket12x",
		"p_jug01x",
	]},
	{ master: "Artesanato & Adornos", category: "Trinkets / Colares / Joias", items: [
		"s_necklacebearclaw",
		"s_charmsnecklace01x",
		"p_corpsenecklace01x",
		"s_inv_necklace01x",
		"s_inv_necklace02x",
		"s_inv_necklace03x",
		"s_eaglefeathertrinket01x",
		"s_cranefeathertrinket01x",
		"s_hawktalontrinket01x",
		"s_inv_cougarfangtrinket01x",
		"s_bearhearttrinket01x",
		"s_badgerclawtrinket01x",
		"s_batwingtrinket01x",
		"s_beavertoothtrinket01x",
		"s_bullhorntrinket01x",
		"s_turtleshelltrinket01x",
		"s_javelinatusktrinket01x",
		"s_toadlegtrinket01x",
		"s_pantherclawtrinket01x",
		"s_giantboartrinket01x",
		"s_inv_trinket_buck_antler",
		"s_inv_trinket_rabtft01x",
		"s_inv_trinket_ramhorn01x",
		"s_mayantrinket01x",
		"p_owlfeathertrinket",
		"s_heronfeathertrinket",
		"s_condorbeaktrinket",
	]},
	{ master: "Caca & Pesca", category: "Cranios / Chifres / Antlers", items: [
		"p_skullelk01x",
		"p_skulldeer01x",
		"p_skullmoose01x",
		"p_skullram01x",
		"p_skullram02x",
		"p_skullcattle02x",
		"p_skullcattle03x",
		"p_humanskull01x",
		"p_humanskull02x",
		"p_alligatorskull01x",
		"p_pronghornskull01x",
		"p_skullhang",
		"p_skullpost01x",
		"p_skullpost02x",
		"p_skullpost03x",
		"p_spookyskulls01x",
		"p_spookyskulls02x",
		"p_spookyskulls03x",
		"p_voodooskull01x",
		"s_wolfskull01x",
		"s_buckskull01x",
		"s_ramskull01x",
		"s_alligatorskull01x",
		"mp005_p_mp_predhunt_skull01x",
		"mp005_p_mp_predhunt_skull02x",
		"mp005_p_mp_predhunt_skull03x",
		"p_antler01x",
		"p_antlers01x",
		"p_antlers04x",
		"p_mooseantler01x",
		"p_mooseantler02x",
		"p_mooseantler03x",
		"p_mooseantler04x",
		"s_mountedmooseantlers01x",
		"p_scoutfireelkantlers01x",
		"mp005_p_mp_predhunt_skull05x",
		"mp005_p_mp_predhunt_skull04x",
		"mp005_p_mp_predhunt_skull06x",
		"mp005_p_mp_predhunt_skull07x",
		"mp005_p_mp_predhunt_skull08x",
		"mp005_p_mp_predhunt_skull09x",
		"p_monkeyskull66x",
	]},
	{ master: "Caca & Pesca", category: "Pesca / Rio", items: [
		"p_canoe01x",
		"p_canoeconst01x",
		"p_canoepole01x",
		"p_veh_canoe01x",
		"p_veh_canoe02x",
		"s_ropecanoeend01x",
		"s_ropecanoeend02x",
		"p_fishingpole01x",
		"p_fishingpole01bx",
		"p_fishingpole02x",
		"p_fishingpole03x",
		"p_netfish01x",
		"mp007_p_fishnet_damage01x",
		"mp007_p_fishnet_damage02x",
		"p_basketfish01x",
		"p_bucketfish01x",
		"p_fishhook01x",
		"p_fishhook02x",
		"p_fishhook03x",
		"p_fishhanging01x",
		"p_fishhanging10x",
		"p_fishhangings1x",
		"p_fishhangings2x",
		"p_fish01x",
		"p_fishguts01x",
		"p_ambfishbone02x",
		"p_ambfishgut02x",
		"p_baitcrawfish01x",
		"p_crayfish01x",
		"p_potcrawfish01x",
		"prop_deadfish_01",
		"prop_deadfish_02",
		"prop_deadfish_03",
		"p_campfirewhitefish03x",
		"p_friedcatfish01x",
		"mp007_p_fishhanging01x_catfish",
		"p_raftpole02x",
		"mp001_p_mp_fishhangi01x",
		"p_deadfish_01",
		"p_whitefishfilet01xb",
		"p_shopbait01x",
		"p_boat_oar_01_s",
	]},
	{ master: "Caca & Pesca", category: "Taxidermia / Animais Montados", items: [
		"p_taxidermydeer01x",
		"p_taxidermycoyote01x",
		"p_taxidermycoyote02x",
		"p_taxidermycoyote03x",
		"p_taxidermyhawk01x",
		"p_taxidermyhawk02x",
		"p_taxidermyhawk03x",
		"p_taxidermyowl01x",
		"p_taxidermypheasant02x",
		"p_taxidermyvulture01x",
		"p_taxidermyvulture02x",
		"p_taxidermyvulture03x",
		"p_taxidermyvulture04x",
		"s_seatingwolfhead01x",
		"p_deerhanging01x",
		"p_deerhanging02x",
		"p_deerhanging03x",
		"p_deerantchandelier01x",
		"mp007_p_taxidermy_base01x",
		"mp007_p_taxidermy_base02x",
		"mp007_p_taxidermy_base03x",
		"s_taxidermydiorama01x",
		"s_taxidermydiorama02x",
		"s_taxidermydiorama03x",
		"s_taxidermydiorama04x",
		"s_taxidermydiorama05x",
		"s_taxidermydiorama06x",
		"s_taxidermydiorama07x",
		"s_taxidermydiorama08x",
		"s_taxidermydiorama09x",
		"p_buffalohorn01x",
		"p_buffalohorn02x",
		"p_buffalohorn03x",
		"s_tatankabuffalohorn01x",
		"p_sculpturedeer01x",
	]},
	{ master: "Caca & Pesca", category: "Treino / Area de Combate", items: [
		"p_targetarchery01x",
		"p_targetarchery01x_2",
		"p_targetarchery01x_3",
		"p_targetarchery02x",
		"p_targetarchery02x_2",
		"p_targetarchery02x_3",
		"p_targetarchery03x",
		"p_targetarchery03x_2",
		"p_targetarchery03x_3",
		"p_targetarcheryframe02x",
		"p_targetframe01x",
		"p_target01x",
		"p_target02x",
		"p_target05x",
		"p_target06x",
		"p_targetlarge01x",
		"p_targetsmall01x",
		"p_scarecrow01x",
		"p_scarecrow03x",
		"p_scarecrow04x",
		"p_scarecrow05x",
		"p_scarecrow_06",
		"s_scarecrow02x",
		"p_woodstake01x",
		"p_metalstake01x",
		"p_ambstake01x",
		"p_stake01x",
		"p_haybale01x",
		"p_haybale03x",
		"p_haybale04x",
		"p_haybalestack01x",
		"p_haybalestack02x",
		"p_skullpost01x",
		"p_skullpost02x",
		"p_skullpost03x",
		"p_ambtentburlap01x",
		"p_ambtentburlap01b",
		"s_confedtarget",
		"p_barricade03x",
		"p_fortmercerbarricade01x",
		"mp005_p_mp_predhunt_post01x",
		"p_barricade05x",
	]},
	{ master: "Natureza", category: "Arvores — Planices / New Austin", items: [
		"p_tree_joshua_01a",
		"p_tree_joshua_01b",
		"p_tree_joshua_01c",
		"p_tree_joshua_01d",
		"p_tree_joshua_01e",
		"p_tree_joshua_02a",
		"p_tree_joshua_02b",
		"p_tree_joshua_02c",
		"p_tree_joshua_02d",
		"p_tree_joshua_02e",
		"p_tree_cottonwood_01",
		"p_tree_cottonwood_02",
		"p_tree_cottonwood_03",
		"p_tree_cottonwood_04",
		"p_tree_willow_01",
		"p_tree_willow_02",
		"p_tree_liveoak_01",
		"p_tree_liveoak_moss_01",
		"p_tree_blue_oak_01",
		"p_tree_poor_joe_oak",
		"p_tree_white_oak_01",
		"p_tree_white_oak_02",
		"p_tree_hangingtree_moss",
		"p_tree_hangingtreeoak01",
		"p_tree_riv_maple_01",
		"p_tree_riv_maple_04",
		"p_tree_riv_poplar_01",
		"p_tree_riv_poplar_02",
		"p_tree_riodel_01",
		"rdr2_tree_utahjuniper",
		"rdr2_tree_sycamore",
		"rdr2_tree_riverbirch",
		"rdr2_tree_beech",
		"rdr2_tree_gimlet",
		"p_tree_baldcypress_03_script",
		"p_tree_baldcypress_04_sm_a",
		"p_tree_baldcypress_06a",
		"p_tree_baldcypress_06b",
		"p_tree_baldcypress_grave",
		"p_tree_apple_01",
		"p_tree_orange_01",
		"p_tree_engoak_dead",
	]},
	{ master: "Natureza", category: "Cultivos / Colheita", items: [
		"crp_cornstalks_aa_sim",
		"crp_cornstalks_ab_sim",
		"crp_cornstalks_ac_sim",
		"crp_cornstalks_ba_sim",
		"crp_cornstalks_bb_sim",
		"crp_cornstalks_bc_sim",
		"crp_cornstalks_bd_sim",
		"crp_tobaccoplant_aa_sim",
		"crp_tobaccoplant_ab_sim",
		"crp_tobaccoplant_ac_sim",
		"crp_tobaccoplant_ba_sim",
		"crp_tobaccoplant_bb_sim",
		"crp_tobaccoplant_bc_sim",
		"crp_ginseng_aa_sim",
		"crp_ginseng_ab_sim",
		"crp_berry_aa_sim",
		"crp_berry_har_aa_sim",
		"crp_berry_sap_aa_sim",
		"crp_potato_aa_sim",
		"crp_potato_har_aa_sim",
		"crp_tomatoes_aa_sim",
		"crp_tomatoes_har_aa_sim",
		"crp_wheat_dry_aa_sim",
		"crp_wheat_dry_long_aa_sim",
		"crp_sugarcane_aa_sim",
		"crp_sugarcane_ab_sim",
		"crp_sugarcane_ac_sim",
		"rdr2_bush_bigberrymanzanita",
		"p_ancienthoe01x",
		"p_basketonion02x",
		"p_basketpotato01x",
		"p_strawbundle01x",
	]},
	{ master: "Natureza", category: "Ervas / Plantas Medicinais", items: [
		"p_herbsdry01x",
		"p_herbsdry02x",
		"p_herbsdry03x",
		"p_herbsdry04x",
		"desertsage_p",
		"humbirdsage_p",
		"redsage_p",
		"milkweed_p",
		"yarrow01_p",
		"yarrow02_p",
		"yarrow03_p",
		"yarrow04_p",
		"wildmint_p",
		"thyme_p",
		"oregano_p",
		"feverfew_p",
		"ginseng_p",
		"burdock_p",
		"bulrush_p",
		"crowsgarlic_p",
		"wildcarrot_p",
		"goldencurrant_p",
		"blackcurrant_p",
		"indiantobacco_p",
		"s_inv_desertsage01x",
		"s_inv_yarrow01x",
		"s_inv_bulrush01x",
		"s_inv_burdock01x",
		"s_inv_wildmint01x",
		"s_inv_humbirdsage01x",
		"s_inv_redsage01x",
		"s_inv_milkweed01x",
		"s_inv_huckleberry01x",
		"s_inv_blackberry01x",
		"s_inv_raspberry01x",
		"s_inv_goldencurrant01x",
		"s_inv_ginseng01x",
		"s_inv_oregano01x",
		"s_inv_thyme01x",
		"s_inv_feverfew01x",
		"s_inv_crowsgarlic01x",
		"s_inv_wildcarrot01x",
		"s_inv_rhubarb01x",
		"p_tobaccoleavesdried01x",
		"p_tobaccoleavesdried02x",
		"s_inv_tabacco01x",
	]},
	{ master: "Ritual & Cultura", category: "Sacrificio / Tortura / Macabro", items: [
		"s_ropehogtiehandslarge01x",
		"s_ropehogtiehandsmedium01x",
		"s_ropehogtiehandsmedium01x_a",
		"s_ropehogtiehandssmall01x",
		"s_ropehogtielegs01x",
		"s_ropehogtielegslarge01x",
		"s_ropehogtielegsmedium01x",
		"s_ropehogtielegsmedium01x_a",
		"p_noose01x",
		"p_noose02x",
		"p_noose03x",
		"p_noose03x_a",
		"p_cs_noose01x",
		"p_cs_noose01x_norope",
		"p_cs_noose01xb",
		"p_cs_nooseshort01x",
		"p_gen_noose01x",
		"p_rabbitnoose_01x",
		"mp004_p_mp_gallows_rope01x",
		"s_noosestand01x",
		"mp005_p_mp_wildanimalcage01",
		"mp007_p_mp_wildanimalcage02",
		"mp007_p_mp_wildanimalcage02b",
		"mp007_p_mp_wildanimalcage03",
		"mp007_p_mp_wildanimalcage03b",
		"mp007_p_mp_wildanimalcage04",
		"mp007_p_mp_wildanimalcage04b",
		"mp007_p_mp_wildanimalcage05",
		"mp007_p_mp_wildanimalcage05b",
		"mp007_p_mp_wildanimalcage06",
		"mp007_p_nat_fancycage01x",
		"mp007_p_nat_fancycage02x",
		"p_bodypartarm01x",
		"p_bodypartarm02x",
		"p_bodyparthead01x",
		"p_bodyparthead02x",
		"p_cs_severedhand01x",
		"s_severedleg_l",
		"s_severedleg_r",
		"s_meatbit_organ_large01x",
		"s_meatbit_organ_medium01x",
		"s_meatbit_organ_small01x",
		"p_corpse01x",
		"p_corpse02x",
		"p_corpse03x",
		"p_corpse04x",
		"p_corpse05x",
		"p_corpse06x",
		"p_corpsepile01x",
		"p_corpsepile02x",
		"p_corpsepile03x",
		"s_corpsepit01x",
		"p_basinblood01x",
		"p_bloodyhangrag01x",
		"p_bloodyhangrag02x",
		"mp005_s_inv_bloodflw01x",
		"mp005_s_inv_bloodflw01bx",
		"s_inv_bloodflower01x",
		"s_inv_bloodflower_bunch01x",
		"p_torturetest01x",
		"p_torturetest02x",
		"p_rackropechains01x",
		"p_cs_chain01x",
		"p_cs_chainlink01x",
		"p_cs_chainlink02x",
		"s_chainlink01x_inst",
		"p_group_hanging01",
		"p_group_hanging02",
		"p_group_hanging03",
		"p_hanging_badger01x",
		"p_hanging_coyote01x",
		"p_hanging_fox01x",
		"p_ambburnbarrel01x",
		"s_crossburning01x",
		"p_haybalebloody01x",
		"amb_tal_cannibal_branchpile006",
		"amb_tal_calog005",
		"amb_tal_calog008",
		"amb_tal_calog007",
		"amb_tal_chains02x012",
		"amb_tal_p_chains01x001",
		"amb_tal_cacloth007",
		"amb_tal_cacloth008",
		"amb_tal_grsome_008",
		"amb_tal_grsome_007",
		"s_armmale01x",
		"s_murdercamphead01x",
		"amb_tal_cloth01x",
		"p_table31x",
		"p_prybar01x",
		"p_gardentool01x",
		"p_candle01x",
		"p_scissors01x",
		"amb_tal_p_tableblood01x001",
		"p_sawhand01x",
		"p_saw01",
		"p_sawmeat01x",
		"p_gunpart01x",
		"p_gunpart02x",
		"p_crate03x",
		"p_ambcart01x",
		"p_trowel01x",
		"amb_tal_prison_wagon001",
		"p_barrel11x",
		"amb_tal_prison001",
		"amb_tal_cannibal_cage086",
		"amb_tal_cannibal_cage058",
		"p_stick04x",
		"p_stickfirepoker01x",
	]},
	{ master: "Acampamento", category: "Mobilia / Descanso / Tecidos", items: [
		"mp005_s_posse_trad_blanket01x",
		"p_ambbed01x",
		"p_ambblanketroll01x",
		"p_ambcart02x",
		"p_ambchair01x",
		"p_ambchair02x",
		"p_ambclothhang01x",
		"p_ambfloorfur01x",
		"p_ambfloorfur02x",
		"p_ambfloorplantent01x",
		"p_ambfloorroll01x",
		"p_ambfloorrug04x",
		"p_ambfloorrug07x",
		"p_ambstake01x",
		"p_bedindian01x",
		"p_bedindian02x",
		"p_bedindian04x",
		"p_bedrollclosed01x",
		"p_bedrollclosed_sml01x",
		"p_bedrollopen01x",
		"p_bedrollopen03x",
		"p_bench_log01x",
		"p_bench_log02x",
		"p_bench_log03x",
		"p_bench_log05x",
		"p_bench_log06x",
		"p_bench_log07x",
		"p_blanket07x",
		"p_blanket08x",
		"p_blanket10x",
		"p_blanketfolded01x",
		"p_blanketground02x",
		"p_blanketground05x",
		"p_blankets01x",
		"p_chair_barrel04b",
		"p_chairrustic01x",
		"p_chairrustic02x",
		"p_chairrustic05x",
		"p_chairrusticsav01x",
		"p_cs_rag01x",
		"p_foldedblanket01x",
		"p_foldedblanket02x",
		"p_gen_bedrollopen01x",
		"p_haybalecover02x",
		"p_indianbackrest01x",
		"p_indianbedrollclosed01x",
		"p_rag02x",
		"p_stake01x",
		"p_stool04x",
		"p_table05x",
		"proc_bedrollclosed01x",
		"proc_bedrollopen01x",
		"s_bedrollfurlined01x",
		"s_bedrollopen01x",
		"s_blankethang01x",
		"s_blanketrolled01x",
		"s_furhorseblanket01x",
		"s_furhorseblanket02x",
		"p_chair_crate02x",
		"p_sidetable08x",
		"p_cratetable01x",
		"p_tablesix01",
		"p_clothbalconyc01x",
		"p_apronground01x",
	]},
	{ master: "Acampamento", category: "Postes / Estrutura", items: [
		"mp007_p_nat_ropehangin01x",
		"p_app_stablefence01x",
		"p_app_stablefence02x",
		"p_app_stablefence04x",
		"p_app_stablefence06x",
		"p_camphitchhook01x",
		"p_clt_post01b",
		"p_fence_lorgepost01x",
		"p_fenceac",
		"p_fenceapost",
		"p_fpole01x",
		"p_gen_fence_xpost01b",
		"p_hitchingpost01x",
		"p_hitchingpost01x_dmg",
		"p_hitchingpost04x",
		"p_hitchingpost05x",
		"p_horsehitchnbd01x",
		"p_mp_feedbaghang01x",
		"p_mptenttrack301x",
		"p_prisoncage01x",
		"p_prisoncage02x",
		"p_tree_branch_01",
		"p_tree_hangingtreebranch",
		"p_tree_lodgepole_01",
		"p_tree_lodgepole_02",
		"p_tree_lodgepole_02_bv",
		"p_tree_lodgepole_03",
		"p_tree_lodgepole_04",
		"p_tree_lodgepole_05",
		"p_tree_lodgepole_06",
		"p_tree_lodgepole_07",
		"p_tree_lodgepole_07a",
		"p_tree_lodgepole_roots_01",
		"p_val_fencez_falla",
		"p_waterpump01x",
		"p_watertrough03x",
		"p_woodplank02x",
		"p_woodramp01x",
		"p_woodramp02x",
		"s_hitchpo01x",
		"s_hitchpo02x",
		"s_hitchpo03x",
		"val_p_fenceac",
		"val_p_fenceaa",
		"val_p_fenceab",
		"val_p_fenceagate",
		"val_p_fenceagate_h",
		"val_p_fenceagate_post",
		"val_p_fenceapost",
		"p_woodpiece04x",
	]},
	{ master: "Acampamento", category: "Caixas / Barris / Carga / Entulho", items: [
		"p_debris02x",
		"p_debris03x",
		"p_debris07x",
		"p_crate14x",
		"p_crate05x",
		"p_barrel05b",
		"s_gen_barrelhalf02x",
		"s_clothpile01x",
		"p_floursack02x",
		"p_cs_stolen05x",
		"p_cart01x",
		"p_wagon01x",
		"p_sandbags04x",
	]},
	{ master: "Artesanato & Adornos", category: "Mesas / Ferramentas", items: [
		"p_anvil01x",
		"p_beechers_ladder01x",
		"p_bellows01x",
		"p_benchwork01x",
		"p_chicken_coop_post01x",
		"p_craftedtable01x",
		"p_cratetools01x",
		"p_cs_grindingwheelx",
		"p_cs_makeshiftstretcher01x",
		"p_debrispile04x",
		"p_dressinglcmtool02x",
		"p_forge01x",
		"p_grindingwheel01x",
		"p_grp_lathetool02x_car_sd",
		"p_hammer01x",
		"p_hammer02x",
		"p_hammer03x",
		"p_knifesharpener01x",
		"p_machete01x",
		"p_mortar_01",
		"p_mortarpestle01x",
		"p_mortarpestle02bx",
		"p_mortarpestle02x",
		"p_pestle_01",
		"p_spinningwheel01x",
		"p_spinningwheel02x",
		"p_tableset01x",
		"p_tablesur01x",
		"p_toolpegboard01x",
		"p_wheelbarrow01x",
		"p_workbench01x",
		"p_workbench02x",
		"p_workbenchdesk01x",
		"s_mortarpestle01x",
	]},
	{ master: "Artesanato & Adornos", category: "Couros / Sacolas / Bolsas", items: [
		"mp005_draped_hide01x",
		"mp005_draped_hide02x",
		"mp005_draped_hide03x",
		"mp005_p_mp_hideframe02x",
		"mp005_p_mp_trader_gen_bag01x",
		"mp005_p_mp_trader_gen_bag02x",
		"mp005_s_posse_fleshingboard01x",
		"mp005_s_posse_goodsbundle01x",
		"mp005_s_posse_leatherbag_01x",
		"mp005_s_posse_leatherbag_02x",
		"p_ambbundle01x",
		"p_ambpack04x",
		"p_ambpelt01x",
		"p_ambpelt02x",
		"p_ambpelt03x",
		"p_ambpeltstack01x",
		"p_ambpeltstring01x",
		"p_ambsack02x",
		"p_bag01x",
		"p_baghang01x",
		"p_baghang02x",
		"p_boxlrgbirch01x",
		"p_cs_pelt_large",
		"p_dressinglblcamp01x",
		"p_dryingrack02x",
		"p_hangracklrg01x",
		"p_hangrackmed01x",
		"p_hangrackmix01x",
		"p_hangracksml01x",
		"p_hidedisplay01x",
		"p_hidedisplay02x",
		"p_hidedisplay03x",
		"p_hidedisplay05x",
		"p_hidedisplay06x",
		"p_hidedisplay07x",
		"p_hidedisplay09x",
		"p_hidedisplay10x",
		"p_hidedraped02x",
		"p_hideframe01x",
		"p_hideframe02x",
		"p_hidepile01x",
		"p_hidepile02x",
		"p_ihide02x",
		"p_ihide03x",
		"p_ihide04x",
		"p_ihide05x",
		"p_ihide06x",
		"p_ihide10x",
		"p_package05x",
		"p_sack_01x",
		"p_sack_02x",
		"p_sackcorn01x",
		"p_skinscraper01x",
		"p_skinscraper01x_2",
		"p_trapperbackpack01x",
		"s_herbalpouch01x",
		"s_herbalpouch02x",
		"s_herbalpouch03x",
		"s_herbalpouch04x",
		"s_knapsack01x",
		"s_knapsack_static01x",
		"p_hide02x",
		"wap_t_hide_099",
		"wap_t_hide_100",
	]},
	{ master: "Caca & Pesca", category: "Caca / Flechas / Armadilhas", items: [
		"mp007_p_beartrapmp01x",
		"mp007_p_nat_trap01x",
		"mp007_p_nat_trap02x",
		"mp007_p_nat_trapcloth01x",
		"mp008_p_knife_ceremonial01",
		"p_ancientarrowhead01x",
		"p_ancientarrowhead02x",
		"p_ancientarrowhead03x",
		"p_arrow01x",
		"p_arrowbundle01x",
		"p_arrowbundle02x",
		"p_arrowdisplay01x",
		"p_arrowdisplay02x",
		"p_beartrap01x",
		"p_bow01x",
		"p_bowdisplay01x",
		"p_bowdisplay02x",
		"p_butcherknife01x",
		"p_cs_arrow01x",
		"p_cs_arrowfletchsting",
		"p_filletknife01x",
		"p_fleshingknife01x",
		"p_knife01x",
		"p_knife02x",
		"p_knife03x",
		"p_knife04x",
		"p_knivesbundle02x",
		"p_powderhorn01x",
		"p_quiver01x",
		"p_re_beartrapgroup01x",
		"p_re_beartrapgroup02x",
		"p_spike01x",
		"p_targetarchery01x",
		"p_trap01x",
		"p_trap01x_damaged",
		"p_trap02x",
		"p_trap03x",
		"p_trap04x",
		"p_trap05x",
		"p_traprope01x",
		"p_whittleknifedressing",
		"p_woodentrap01x",
		"s_boobytrap01xb",
		"s_cft_arrow_dynamite",
		"s_cft_arrow_fire",
		"s_inv_arrowammo01p",
		"s_inv_arrowammo01x",
		"s_inv_arrowammo02x",
		"s_whittlingknife01x",
	]},
	{ master: "Caca & Pesca", category: "Carcacas / Peles", items: [
		"mp005_s_posse_paintedhide01x",
		"mp005_s_posse_raccoonpelt01x",
		"mp007_p_nat_pelt_bearlegend01x",
		"mp007_p_nat_pelt_bearlegend02x",
		"mp007_p_nat_pelt_bearlegend03x",
		"mp007_p_nat_pelt_beaverlegend01x",
		"mp007_p_nat_pelt_bighornlegend01x",
		"mp007_p_nat_pelt_boarlegend01x",
		"mp007_p_nat_pelt_buffalolegend01x",
		"mp007_p_nat_pelt_buffalolegend02x",
		"mp007_p_nat_pelt_cougarlegend01x",
		"mp007_p_nat_pelt_cougarlegend02x",
		"mp007_p_nat_pelt_coyotelegend01x",
		"mp007_p_nat_pelt_elklegend01x",
		"mp007_p_nat_pelt_elklegend02x",
		"mp007_p_nat_pelt_foxlegend01x",
		"mp007_p_nat_pelt_gatorlegend01x",
		"mp007_p_nat_pelt_mooselegend01x",
		"mp007_p_nat_pelt_wolflegend01x",
		"mp007_p_nat_pelt_wolflegend02x",
		"mp007_p_nat_pelt_wolflegend03x",
		"p_alligatorpelt01x",
		"p_bearskin01x",
		"p_beartuftsfur01x",
		"p_bisontuftsfur01x",
		"p_bobcattuftsfur01x",
		"p_carcassboneslg01x",
		"p_carcassbonesmd01x",
		"p_carcassbonessm01x",
		"p_carcassbonesxl01x",
		"p_carcasscow01x",
		"p_carcasselk01x",
		"p_carcasshangfish01a",
		"p_carcasshanglrg01x",
		"p_carcasshanglrg02x",
		"p_carcasshangmed01a",
		"p_carcasshangmed01b",
		"p_carcasshangmed01x",
		"p_carcasshangsml01x",
		"p_carcasshangsml02x",
		"p_carcasshorse01x",
		"p_carcasshorse02x",
		"p_carcasslarge01x",
		"p_carcassmedium01x",
		"p_carcasssmall01x",
		"p_coyotetuftsfur_01x",
		"p_cs_carcasselk01x",
		"p_cs_deercarcass",
		"p_cs_deerskin01x",
		"p_cs_deerskin02x",
		"p_cs_pelt_wolf",
		"p_cs_pelt_wolf_roll",
		"p_cs_pelt_xlarge_bear",
		"p_cs_pelt_xlarge_buffalo",
		"p_cs_pelt_xlarge_elk",
		"p_cs_pelt_xlarge_tbuffalo",
		"p_cs_pelt_xlarge_wbuffalo",
		"p_deerdeadcarcass01x",
		"p_deertuftsfur01x",
		"p_dis_scm_deadsnake",
		"p_elktuftsfur01x",
		"p_foxtuftsfur01x",
		"p_hidewolf01x",
		"p_moosetuftsfur01x",
		"p_peltbeaver01x",
		"p_preybunny01x",
		"p_shoppeltbuffalo01x",
		"p_wolfskin01x",
		"p_wolftuftsfur01x",
	]},
	{ master: "Cozinha & Fogo", category: "Fogueiras / Lenha", items: [
		"i_gen_cordwood01x",
		"mp001_s_splitfirelog01x",
		"mp001_s_splitfirelog02x",
		"p_ambsticks01x",
		"p_ambwoodpile01x",
		"p_ambwoodstack01x",
		"p_axe01x",
		"p_axe02x",
		"p_campfire01x",
		"p_campfire02x",
		"p_campfire02x_dynamic",
		"p_campfire02x_script",
		"p_campfire03x",
		"p_campfire04x",
		"p_campfire05x",
		"p_campfire_06x",
		"p_campfirecombined01x",
		"p_campfirecombined02x",
		"p_campfirecombined03x",
		"p_campfirecook01x",
		"p_campfirecook02x",
		"p_campfireembers01x",
		"p_campfirefresh01x",
		"p_campfireprop02x",
		"p_campfirerock01x",
		"p_campfirerock02x",
		"p_cordwood01x",
		"p_cordwood02x",
		"p_cordwood03x",
		"p_cs_campfirecmbnd01x",
		"p_cs_kindling01x",
		"p_cs_log01x",
		"p_firesticks01x",
		"p_group_logpile01",
		"p_hatchet01x",
		"p_kindling02x",
		"p_kindlingpile01x",
		"p_loghalf01x",
		"p_loghalf02x",
		"p_logstack01x",
		"p_scoutfireelkantlers01x",
		"p_stumpwoodsplit01x",
		"p_stumpwoodsplit02x",
		"p_woodpile01x",
		"p_woodpile02x",
		"p_woodpile03x",
		"p_woodpile04x",
		"p_woodpile05x",
		"p_woodpile06x",
		"p_woodpilechopped01x",
		"s_campfire01x",
		"s_campfireset01x",
		"s_campfireset02x",
		"s_cookfire01x",
		"s_firestick01x",
		"s_splitfirelog01x",
		"s_splitfirelog01x_nofire",
		"s_splitfirelog02x",
		"s_splitfirelog02x_nofire",
		"s_woodpile01x",
	]},
	{ master: "Natureza", category: "Pedras / Rochas", items: [
		"alp_rock_01",
		"alp_rock_02",
		"alp_rock_03",
		"alp_rock_04",
		"alp_rock_05",
		"alp_rock_06",
		"alp_rock_07",
		"alp_rock_08",
		"alp_rock_09",
		"alp_rock_10",
		"gap_rock_01",
		"gap_rock_02",
		"gap_rock_03",
		"gap_rock_04",
		"gap_rock_05",
		"gap_rock_06",
		"gap_rock_07",
		"gap_rock_08",
		"gap_rock_09",
		"grp_rock_01",
		"grp_rock_02",
		"grp_rock_03",
		"grp_rock_04",
		"grp_rock_05",
		"grp_rock_06",
		"grp_rock_07",
		"grp_rock_08",
		"grp_rock_09",
		"grp_rock_10",
		"grp_rock_11",
		"grp_rock_scree_01",
		"grp_rock_scree_02",
		"grp_rock_scree_03",
		"grp_rock_scree_04",
		"grp_rock_scree_05",
		"grp_rock_scree_06",
		"grp_rock_stones_aa",
		"grp_rock_stones_ab",
		"hea_rock_01",
		"hea_rock_02",
		"hea_rock_03",
		"hea_rock_04",
		"hea_rock_05",
		"hea_rock_stones_aa",
		"hea_rock_stones_ab",
		"mp001_s_mp_stone_marker01a",
		"mp001_s_mp_stone_marker02a",
		"mp001_s_mp_stone_marker03a",
		"mp001_s_mp_stone_marker04a",
		"pun_rock_01a",
		"pun_rock_03a",
		"pun_rock_08",
		"rio_red_rock_01",
		"rio_red_rock_03",
		"rio_red_rock_04",
		"rio_red_rock_06",
		"rio_red_rock_07",
		"rio_red_rock_08",
		"rio_red_rock_09",
		"s_mp_stone_marker03a",
		"s_mp_stone_marker04a",
		"sca_rock_01",
		"sca_rock_02",
		"sca_rock_03",
		"sca_rock_04",
		"sca_rock_05",
		"sca_rock_06",
		"sca_rock_shelve_01",
		"sca_rock_shelve_02",
		"sca_rock_shelve_03",
	]},
	{ master: "Natureza", category: "Cactos / Arbustos / Deserto", items: [
		"desertsage_p",
		"p_scoachstop_tumbleweed",
		"p_tree_cactus_01a",
		"p_tree_cactus_01b",
		"p_tree_cactus_01c",
		"p_tree_cactus_01d",
		"p_tree_cactus_01e",
		"p_tree_mesquite_01",
		"p_tree_mesquite_01_dead",
		"proc_desertweed_01",
		"proc_desertweed_02",
		"proc_desertweed_03",
		"proc_desertweed_04",
		"proc_desertweed_05",
		"proc_desertweed_06",
		"prop_proc_bush_01",
		"prop_proc_bush_02",
		"prop_proc_bush_03",
		"prop_proc_bush_04",
		"prop_proc_bush_05",
		"prop_proc_cactus_01",
		"rdr2_bush_beavertailcactus",
		"rdr2_bush_beavertailcactus_02",
		"rdr2_bush_catclaw",
		"rdr2_bush_chollocactus",
		"rdr2_bush_creosotebush",
		"rdr2_bush_creosotebush_2",
		"rdr2_bush_desertbroom",
		"rdr2_bush_desertbroom_2",
		"rdr2_bush_desertironwood",
		"rdr2_bush_pricklypearcactus",
		"rdr2_bush_sagebrush",
		"rdr2_bush_scruboak",
		"rdr2_bush_snakeweed",
		"rdr2_bush_snakeweedflower",
		"rdr2_bush_snakeweedflower_2",
		"rdr_bush_agave_aa_sim",
		"rdr_bush_agave_ab_sim",
		"rdr_bush_aloe_aa_sim",
		"rdr_bush_arec_ab_sim",
		"rdr_bush_bram_aa_sim",
		"rdr_bush_bram_dead_aa_sim",
		"rdr_bush_brush_dead_aa_sim",
		"rdr_bush_brush_dead_ba_sim",
		"rdr_bush_brush_dead_ca_sim",
		"rdr_bush_brush_grn_aa_sim",
		"rdr_bush_cat_tail_aa_sim",
		"rdr_bush_cat_tail_ab_sim",
		"rdr_bush_dry_thin_aa_sim",
		"rdr_bush_dry_thin_ba_sim",
		"rdr_bush_fern_aa_sim",
		"rdr_bush_fern_ab_sim",
		"rdr_bush_fern_ba_sim",
		"rdr_bush_junip_aa_sim",
		"rdr_bush_junip_ab_sim",
		"rdr_bush_junip_ac_sim",
		"rdr_bush_low_aa",
		"rdr_bush_low_ab",
		"rdr_bush_low_ba",
		"rdr_bush_low_bb",
		"rdr_bush_sage_aa",
		"rdr_bush_sage_ab",
		"rdr_bush_scrub_aa_sim",
		"rdr_bush_sumac_aa_sim",
		"rdr_bush_tall_reeds_aa_sim",
		"rdr_bush_thorn_aa_sim",
		"rdr_bush_yucca_aa_sim",
		"rdr_bush_yucca_dead_aa_sim",
		"s_desertsage01x",
	]},
	{ master: "Natureza", category: "Troncos / Vegetacao", items: [
		"p_cedar_log_01x",
		"p_cedar_log_03x",
		"p_cedar_log_04x",
		"p_cedar_log_06x",
		"p_cedar_log_07x",
		"p_cedar_log_08x",
		"p_cedar_log_09x",
		"p_cedar_stump_01x",
		"p_stump_01bx",
		"p_stump_01x",
		"p_tree_burntstump_01",
		"p_tree_burntstump_03",
		"p_tree_fallen_01",
		"p_tree_fallen_01_trunk",
		"p_tree_fallen_pine_01",
		"p_tree_fallen_pine_01bc",
		"p_tree_fallen_pine_02",
		"p_tree_log_06a_m",
		"p_tree_log_09",
		"p_tree_log_09_m",
		"p_tree_log_12_dead",
		"p_tree_log_redwood_01",
		"p_tree_stump_03",
		"p_tree_stump_04",
		"p_tree_stump_05",
		"p_tree_stump_06",
		"p_tree_stump_08_bc",
		"p_tree_stump_08_bc_l004",
		"p_tree_stump_cut_01",
		"p_tree_stump_cut_01_m",
		"p_tree_stump_cut_02",
		"p_tree_stump_cut_02_m",
		"p_treestump02x",
		"p_trunk06x",
		"proc_desertweed_01",
		"proc_desertweed_02",
		"proc_desertweed_03",
		"proc_desertweed_04",
		"proc_desertweed_05",
		"proc_desertweed_06",
		"proc_fern_01",
		"proc_fern_02",
		"proc_lowfoliage_01",
		"proc_reeds_01",
		"proc_reeds_02",
		"proc_seedlings_01",
		"proc_stick_01",
		"proc_stick_02",
		"proc_stick_03",
		"prop_proc_bushgrp_01",
		"prop_proc_bushgrp_02",
		"prop_proc_leaves_01",
		"prop_proc_leaves_02",
		"prop_proc_smlbush_01",
		"rdr_bush_broad_aa_sim",
		"rdr_bush_broad_ab_sim",
		"rdr_bush_ear_aa_sim",
		"rdr_bush_ear_ab_sim",
		"rdr_bush_fern_dead_ba_sim",
		"rdr_bush_fern_mix_da_sim",
		"rdr_bush_fern_tall_ca_sim",
		"rdr_bush_fern_tall_cb_sim",
		"rdr_bush_fern_tall_cc_sim",
		"rdr_bush_leafy_aa_sim",
		"rdr_bush_lrg_aa_sim",
		"rdr_bush_lrg_dead_aa_sim",
		"rdr_bush_thick_aa_sim",
		"rdr_bush_thingreen_aa_sim",
		"rdr_bush_wandering_aa_sim",
	]},
	{ master: "Ritual & Cultura", category: "Cerimonial / Ritual / Voodoo", items: [
		"p_ancientmayanhead01x",
		"p_bag_voodoo01x",
		"p_charmscreepy01x",
		"p_charmscreepy01x_a",
		"p_charmscreepy01x_b",
		"p_charmscreepy01x_small",
		"p_cs_drumkit01x",
		"p_cs_eaglefeather01x",
		"p_cs_eaglefeather02x",
		"p_cs_eaglefeather03x",
		"p_cs_eaglefeather04x",
		"p_cs_indianpipebag01x",
		"p_disdreamcatcherwind01x",
		"p_disdreamcatcherwind02x",
		"p_disdreamcatcherwind03x",
		"p_disdreamcatcherwind04x",
		"p_disdreamcatcherwind05x",
		"p_drumstick01x",
		"p_eaglefeathers01x",
		"p_feather01x",
		"p_firesignal01x",
		"p_hawkfeathers01x",
		"p_heronfeathers01x",
		"p_indianartifact01x",
		"p_indianartifact03x",
		"p_indiandream01x",
		"p_indiandream01x_a",
		"p_indiandream02x",
		"p_indiandream03x",
		"p_indianfan01x",
		"p_indianfan02x",
		"p_indianpipebag01x",
		"p_indianrattle01x",
		"p_indiansweetgrass01x",
		"p_mask02x",
		"p_peacepipe01x",
		"p_sha_man_fireplace01",
		"p_snakevoodoo01x",
		"p_staffindian01x",
		"p_staffindian03x",
		"p_tablevoodoo01x",
		"p_turkeyfeathers01x",
		"p_voodoochalice01x",
		"p_voodoodoll01x",
		"p_voodoodrum01x",
		"p_voodooskull01x",
		"s_cranefeathertrinket01x",
		"s_eaglefeathertrinket01x",
		"s_indiantobacco01x",
		"s_indiantobaccopicked01x",
		"s_inv_voodoodoll01x",
		"s_masknative01x",
		"s_scalpfemale01x",
		"s_scalpfemale02x",
		"s_scalpmale01x",
		"s_scalpmale02x",
		"p_indiangarlic01x",
		"p_peacepipe02x",
	]},
	{ master: "Ritual & Cultura", category: "Ossos / Fosseis / Macabro", items: [
		"dis_grz_mammoth01_lod",
		"p_ambfishbone02x",
		"p_bloodywedgestick01x",
		"p_bobcatbloodpools01x",
		"p_boneshorse01x",
		"p_boneshorse02x",
		"p_boneshuman01x",
		"p_boneshuman02x",
		"p_boneshuman03x",
		"p_boneshuman04x",
		"p_boneshuman05x",
		"p_bonesskeleton01x",
		"p_bonesskeleton02x",
		"p_bonesskeleton03x",
		"p_bonesskeleton04x",
		"p_corpseburnedfemale01x",
		"p_corpseburnedmale01x",
		"p_decapitated_head01x_2",
		"p_decapitated_head02x_2",
		"p_decapitated_head03x",
		"p_decapitated_head3x_2",
		"p_dinobone01x",
		"p_dinobonesskel01x",
		"p_dis_bgv_giant_remains",
		"p_graveindian01x",
		"p_hangingbones01x",
		"p_humanskeleton02x_arml",
		"p_humanskeleton02x_calfr",
		"p_humanskeleton02x_footr",
		"p_humanskeleton02x_forearmr",
		"p_humanskeleton02x_handr",
		"p_humanskeleton02x_legl",
		"p_humanskeleton02x_thighr",
		"p_humanskeleton02x_torso",
		"p_humanskeleton02x_upperarmr",
		"p_jorgemontezhead01x",
		"p_main_lamb_heart01x",
		"p_pantherblood01x",
		"p_spookynative01x",
		"p_spookynative02x",
		"p_spookynative03x",
		"p_spookynative04x",
		"p_spookynative05x",
		"p_spookynative06x",
		"p_spookynative06x_a",
		"p_spookynative07x",
		"p_spookynative08x",
		"p_spookynative09x",
		"p_spookynative10x",
		"p_spookynative10x_a",
		"p_spookynative11x",
		"p_spookynative11x_a",
		"p_spookynative12x",
		"p_spookyskulls02x_a",
		"p_spookyskulls02x_b",
		"p_spookyskulls04x",
		"p_spookyskulls05x",
		"p_spookyskulls06x",
		"p_spookyskulls07ax",
		"p_spookyskulls07bx",
		"p_spookyskulls08x",
		"p_washtubblood02x",
		"p_washtubblood02x_cloth",
		"s_alligatorlimb_collectable",
		"s_bucketoblood01x",
		"s_catfishtail01_collectable",
		"s_catfishtail02_collectable",
		"s_cowrib_collectable",
		"s_cowspine_collectable",
		"s_dearantlers_collectable",
		"s_edsauruship_collectible",
		"s_edsaurustail_collectable",
		"s_headsevered01x",
		"s_horsearm02_collectable",
		"s_horsearrm01_collectable",
		"s_humnahand01_collectable",
		"s_kieranhead01x",
		"s_male_skeleton01",
		"s_male_skeleton03",
		"s_murdervic01x",
		"s_prehistoricmanskull_01x",
		"s_pumajaw_collectable",
		"s_pumalimb01_collectable",
		"s_pumalimb02_collectable",
		"s_racoonhand_collectable",
		"s_racoonskull_collectable",
		"s_slotharm01_collectable",
		"s_slotharm02_collectable",
		"s_slothhip_collectable",
		"s_slothlimb01_collectable",
		"s_slothlimb02_collectable",
		"s_slothlimb03_collectable",
		"s_slothlimb_collectable",
		"s_slothribs_collectable",
		"s_spinosaurus_collectable",
		"s_turtleshell_collectable",
		"s_walrus_collectable",
	]},
	{ master: "Cozinha & Fogo", category: "Cozinha / Utensílios", items: [
		"mp001_p_mp_kettle03_fire01x",
		"p_barrelhalf01x",
		"p_barrelhalf02x",
		"p_barrelwater01x",
		"p_basin01sm",
		"p_basin01x",
		"p_basinwater01x",
		"p_bowl01x",
		"p_bowl02x",
		"p_bowl03x",
		"p_bowl03x_stew",
		"p_bowlna01x",
		"p_bowlna03x",
		"p_bowlna04x",
		"p_bowlstack01x",
		"p_bowlterracotta01x",
		"p_bucket01x",
		"p_bucket02x",
		"p_bucket03x",
		"p_bucket04x",
		"p_bucketcampcul01x",
		"p_bucketcamphob01x",
		"p_camp_cup_01x",
		"p_camp_plate_01x",
		"p_camp_plate_02x",
		"p_camp_plate_03x",
		"p_cask01x",
		"p_cauldron01x",
		"p_cauldron02x",
		"p_cauldron03x",
		"p_cleaver01x",
		"p_cookgrate02x",
		"p_craftingpot01x",
		"p_cs_bucket01bx",
		"p_cs_duckmeat01x",
		"p_cs_meatbowl01x",
		"p_cs_meathanger01x",
		"p_cs_meatstew01x",
		"p_cs_rabbitmeat01x",
		"p_cs_rabbitmeatbowl01x",
		"p_cs_turtlemeat01x",
		"p_cuptin01x",
		"p_cuttingboard01x",
		"p_driedmushroom01x",
		"p_dryingmeat01x",
		"p_fishbasin01x",
		"p_fishstew01x",
		"p_meatchunk_sm01x",
		"p_meatchunk_sm02x",
		"p_meatchunks01x",
		"p_meatchunks01x_raw",
		"p_meatcuttingboard01x",
		"p_meatfilet01x",
		"p_meatpile01x",
		"p_panlg01x",
		"p_plateterracotta01x",
		"p_spoon01x",
		"p_spoonlg01x",
		"p_spoonmid01x",
		"p_spoonshell01x",
		"p_waterbucket01x",
		"p_woodbowl01x",
		"p_woodspoon01x",
		"s_canpeas01x",
		"s_cornedbeef01x",
		"s_meatbit_chunck_large01x",
		"s_meatbit_chunck_small01x",
		"p_pumpkin_01x",
		"p_watermelon01bx",
		"p_watermelon01x",
	]},
	{ master: "SIMBA", category: "TIPIS & HUTS", items: [
		// Hut padrao A
		"smb_hut_a_structure",
		"smb_hut_a_sticks01",
		"smb_hut_a_sticks02",
		"smb_hut_a_thatch",
		"smb_hut_a_thatch_desert",
		"smb_hut_a_thatch_snow",
		"smb_hut_a_blankets",
		// Hut padrao B
		"smb_hut_b_structure",
		"smb_hut_b_sticks",
		"smb_hut_b_thatch",
		"smb_hut_b_blankets",
		// Hut padrao C
		"smb_hut_c_structure",
		"smb_hut_c_sticks",
		"smb_hut_c_thatch",
		// Hutskins
		"smb_hutskin1",
		"smb_hutskin2",
		// Hut Aurora A
		"smb_aur_hut_a_structure",
		"smb_aur_hut_a_sticks01",
		"smb_aur_hut_a_sticks02",
		"smb_aur_hut_a_thatch",
		"smb_aur_hut_a_blankets",
		// Hut Aurora B
		"smb_aur_hut_b_structure",
		"smb_aur_hut_b_sticks",
		"smb_aur_hut_b_thatch",
		"smb_aur_hut_b_blankets",
		// Hut Aurora C
		"smb_aur_hut_c_structure",
		"smb_aur_hut_c_sticks",
		"smb_aur_hut_c_thatch",
		// Tipis base
		"smb_tipi1",
		"smb_tipi2",
		"smb_tipi3",
		"smb_tipi4",
		"smb_tipi5",
		"smb_tipi6",
		"smb_tipi7",
		"smb_tipi8",
		"smb_tipi9",
		// Tipis G (com variante sem porta)
		"smb_tipi_g1",
		"smb_tipi_g1_dr",
		"smb_tipi_g2",
		"smb_tipi_g2_dr",
		"smb_tipi_g3",
		"smb_tipi_g3_dr",
		"smb_tipi_g4",
		"smb_tipi_g4_dr",
		"smb_tipi_g5",
		"smb_tipi_g5_dr",
		"smb_tipi_g6",
		"smb_tipi_g6_dr",
		"smb_tipi_g7",
		"smb_tipi_g7_dr",
		"smb_tipi_g8",
		"smb_tipi_g8_dr",
		"smb_tipi_g9",
		"smb_tipi_g9_dr",
		// Tipis GG (com variante sem porta)
		"smb_tipi_gg1",
		"smb_tipi_gg1_dr",
		"smb_tipi_gg2",
		"smb_tipi_gg2_dr",
		"smb_tipi_gg3",
		"smb_tipi_gg3_dr",
		"smb_tipi_gg4",
		"smb_tipi_gg4_dr",
		"smb_tipi_gg5",
		"smb_tipi_gg5_dr",
		"smb_tipi_gg6",
		"smb_tipi_gg6_dr",
		"smb_tipi_gg7",
		"smb_tipi_gg7_dr",
		"smb_tipi_gg8",
		"smb_tipi_gg8_dr",
		"smb_tipi_gg9",
		"smb_tipi_gg9_dr",
		// WAP Tipi
		"smb_wap_tipi17",
	]}
];
var personalPeds = [
  { master: "🐾 Animais", category: "Cavalos", items: [
    "a_c_horse_americanpaint_greyovero",
    "a_c_horse_americanpaint_overo",
    "a_c_horse_americanpaint_splashedwhite",
    "a_c_horse_americanpaint_tobiano",
    "a_c_horse_americanstandardbred_black",
    "a_c_horse_americanstandardbred_buckskin",
    "a_c_horse_americanstandardbred_lightbuckskin",
    "a_c_horse_americanstandardbred_palominodapple",
    "a_c_horse_americanstandardbred_silvertailbuckskin",
    "a_c_horse_andalusian_darkbay",
    "a_c_horse_andalusian_perlino",
    "a_c_horse_andalusian_rosegray",
    "a_c_horse_appaloosa_blacksnowflake",
    "a_c_horse_appaloosa_blanket",
    "a_c_horse_appaloosa_brownleopard",
    "a_c_horse_appaloosa_fewspotted_pc",
    "a_c_horse_appaloosa_leopard",
    "a_c_horse_appaloosa_leopardblanket",
    "a_c_horse_arabian_black",
    "a_c_horse_arabian_grey",
    "a_c_horse_arabian_redchestnut",
    "a_c_horse_arabian_redchestnut_pc",
    "a_c_horse_arabian_rosegreybay",
    "a_c_horse_arabian_warpedbrindle_pc",
    "a_c_horse_arabian_white",
    "a_c_horse_ardennes_bayroan",
    "a_c_horse_ardennes_irongreyroan",
    "a_c_horse_ardennes_strawberryroan",
    "a_c_horse_belgian_blondchestnut",
    "a_c_horse_belgian_mealychestnut",
    "a_c_horse_breton_grullodun",
    "a_c_horse_breton_mealydapplebay",
    "a_c_horse_breton_redroan",
    "a_c_horse_breton_sealbrown",
    "a_c_horse_breton_sorrel",
    "a_c_horse_breton_steelgrey",
    "a_c_horse_buell_warvets",
    "a_c_horse_criollo_baybrindle",
    "a_c_horse_criollo_bayframeovero",
    "a_c_horse_criollo_blueroanovero",
    "a_c_horse_criollo_dun",
    "a_c_horse_criollo_marblesabino",
    "a_c_horse_criollo_sorrelovero",
    "a_c_horse_dutchwarmblood_chocolateroan",
    "a_c_horse_dutchwarmblood_sealbrown",
    "a_c_horse_dutchwarmblood_sootybuckskin",
    "a_c_horse_eagleflies",
    "a_c_horse_gang_bill",
    "a_c_horse_gang_charles",
    "a_c_horse_gang_charles_endlesssummer",
    "a_c_horse_gang_dutch",
    "a_c_horse_gang_hosea",
    "a_c_horse_gang_javier",
    "a_c_horse_gang_john",
    "a_c_horse_gang_karen",
    "a_c_horse_gang_kieran",
    "a_c_horse_gang_lenny",
    "a_c_horse_gang_micah",
    "a_c_horse_gang_sadie",
    "a_c_horse_gang_sadie_endlesssummer",
    "a_c_horse_gang_sean",
    "a_c_horse_gang_trelawney",
    "a_c_horse_gang_uncle",
    "a_c_horse_gang_uncle_endlesssummer",
    "a_c_horse_gypsycob_palominoblagdon",
    "a_c_horse_gypsycob_piebald",
    "a_c_horse_gypsycob_skewbald",
    "a_c_horse_gypsycob_splashedbay",
    "a_c_horse_gypsycob_splashedpiebald",
    "a_c_horse_gypsycob_whiteblagdon",
    "a_c_horse_hungarianhalfbred_darkdapplegrey",
    "a_c_horse_hungarianhalfbred_flaxenchestnut",
    "a_c_horse_hungarianhalfbred_liverchestnut",
    "a_c_horse_hungarianhalfbred_piebaldtobiano",
    "a_c_horse_john_endlesssummer",
    "a_c_horse_kentuckysaddle_black",
    "a_c_horse_kentuckysaddle_buttermilkbuckskin_pc",
    "a_c_horse_kentuckysaddle_chestnutpinto",
    "a_c_horse_kentuckysaddle_grey",
    "a_c_horse_kentuckysaddle_silverbay",
    "a_c_horse_kladruber_black",
    "a_c_horse_kladruber_cremello",
    "a_c_horse_kladruber_dapplerosegrey",
    "a_c_horse_kladruber_grey",
    "a_c_horse_kladruber_silver",
    "a_c_horse_kladruber_white",
    "a_c_horse_missourifoxtrotter_amberchampagne",
    "a_c_horse_missourifoxtrotter_blacktovero",
    "a_c_horse_missourifoxtrotter_blueroan",
    "a_c_horse_missourifoxtrotter_buckskinbrindle",
    "a_c_horse_missourifoxtrotter_dapplegrey",
    "a_c_horse_missourifoxtrotter_sablechampagne",
    "a_c_horse_missourifoxtrotter_silverdapplepinto",
    "a_c_horse_morgan_bay",
    "a_c_horse_morgan_bayroan",
    "a_c_horse_morgan_flaxenchestnut",
    "a_c_horse_morgan_liverchestnut_pc",
    "a_c_horse_morgan_palomino",
    "a_c_horse_mp_mangy_backup",
    "a_c_horse_murfreebrood_mange_01",
    "a_c_horse_murfreebrood_mange_02",
    "a_c_horse_murfreebrood_mange_03",
    "a_c_horse_mustang_blackovero",
    "a_c_horse_mustang_buckskin",
    "a_c_horse_mustang_chestnuttovero",
    "a_c_horse_mustang_goldendun",
    "a_c_horse_mustang_grullodun",
    "a_c_horse_mustang_reddunovero",
    "a_c_horse_mustang_tigerstripedbay",
    "a_c_horse_mustang_wildbay",
    "a_c_horse_nokota_blueroan",
    "a_c_horse_nokota_reversedappleroan",
    "a_c_horse_nokota_whiteroan",
    "a_c_horse_norfolkroadster_black",
    "a_c_horse_norfolkroadster_dappledbuckskin",
    "a_c_horse_norfolkroadster_piebaldroan",
    "a_c_horse_norfolkroadster_rosegrey",
    "a_c_horse_norfolkroadster_speckledgrey",
    "a_c_horse_norfolkroadster_spottedtricolor",
    "a_c_horse_shire_darkbay",
    "a_c_horse_shire_lightgrey",
    "a_c_horse_shire_ravenblack",
    "a_c_horse_suffolkpunch_redchestnut",
    "a_c_horse_suffolkpunch_sorrel",
    "a_c_horse_tennesseewalker_blackrabicano",
    "a_c_horse_tennesseewalker_chestnut",
    "a_c_horse_tennesseewalker_dapplebay",
    "a_c_horse_tennesseewalker_flaxenroan",
    "a_c_horse_tennesseewalker_goldpalomino_pc",
    "a_c_horse_tennesseewalker_mahoganybay",
    "a_c_horse_tennesseewalker_redroan",
    "a_c_horse_thoroughbred_blackchestnut",
    "a_c_horse_thoroughbred_bloodbay",
    "a_c_horse_thoroughbred_brindle",
    "a_c_horse_thoroughbred_dapplegrey",
    "a_c_horse_thoroughbred_reversedappleblack",
    "a_c_horse_turkoman_black",
    "a_c_horse_turkoman_chestnut",
    "a_c_horse_turkoman_darkbay",
    "a_c_horse_turkoman_gold",
    "a_c_horse_turkoman_grey",
    "a_c_horse_turkoman_perlino",
    "a_c_horse_turkoman_silver",
    "a_c_horse_winter02_01",
    "a_c_horsemule_01",
    "a_c_horsemulepainted_01",
  ] },
  { master: "🐾 Animais", category: "Cachorros", items: [
    "a_c_dogamericanfoxhound_01",
    "a_c_dogaustraliansheperd_01",
    "a_c_dogbluetickcoonhound_01",
    "a_c_dogcatahoulacur_01",
    "a_c_dogchesbayretriever_01",
    "a_c_dogcollie_01",
    "a_c_doghobo_01",
    "a_c_doghound_01",
    "a_c_doghusky_01",
    "a_c_doglab_01",
    "a_c_doglion_01",
    "a_c_dogpoodle_01",
    "a_c_dogrufus_01",
    "a_c_dogstreet_01",
  ] },
  { master: "🐾 Animais", category: "Aves", items: [
    "a_c_bluejay_01",
    "a_c_californiacondor_01",
    "a_c_cardinal_01",
    "a_c_carolinaparakeet_01",
    "a_c_cedarwaxwing_01",
    "a_c_cormorant_01",
    "a_c_cranewhooping_01",
    "a_c_crow_01",
    "a_c_duck_01",
    "a_c_eagle_01",
    "a_c_egret_01",
    "a_c_goosecanada_01",
    "a_c_hawk_01",
    "a_c_heron_01",
    "a_c_raven_01",
    "a_c_songbird_01",
  ] },
  { master: "🐾 Animais", category: "Predadores & Caça Grande", items: [
    "a_c_alligator_01",
    "a_c_alligator_02",
    "a_c_alligator_03",
    "a_c_bear_01",
    "a_c_bearblack_01",
    "a_c_boar_01",
    "a_c_boarlegendary_01",
    "a_c_buck_01",
    "a_c_buffalo_01",
    "a_c_buffalo_tatanka_01",
    "a_c_cougar_01",
    "a_c_deer_01",
    "a_c_elk_01",
    "a_c_wolf",
    "a_c_wolf_medium",
    "a_c_wolf_small",
  ] },
  { master: "🐾 Animais", category: "Fauna Menor", items: [
    "a_c_armadillo_01",
    "a_c_badger_01",
    "a_c_bat_01",
    "a_c_beaver_01",
    "a_c_bighornram_01",
    "a_c_bull_01",
    "a_c_cat_01",
    "a_c_chicken_01",
    "a_c_chipmunk_01",
    "a_c_cow",
    "a_c_coyote_01",
    "a_c_donkey_01",
    "a_c_fox_01",
    "a_c_goat_01",
    "a_c_pig_01",
    "a_c_pigeon",
    "a_c_prairiechicken_01",
    "a_c_sheep_01",
    "a_c_squirrel_01",
  ] },
  { master: "🐾 Animais", category: "Répteis & Anfíbios", items: [
    "a_c_frogbull_01",
    "a_c_gilamonster_01",
    "a_c_snake_01",
    "a_c_snake_pelt_01",
    "a_c_snakeblacktailrattle_01",
    "a_c_snakeblacktailrattle_pelt_01",
    "a_c_snakeferdelance_01",
    "a_c_snakeferdelance_pelt_01",
    "a_c_snakeredboa10ft_01",
    "a_c_snakeredboa_01",
    "a_c_snakeredboa_pelt_01",
    "a_c_snakewater_01",
    "a_c_snakewater_pelt_01",
    "a_c_toad_01",
  ] },
  { master: "🐾 Animais", category: "Peixes & Aquáticos", items: [
    "a_c_crab_01",
    "a_c_crawfish_01",
    "a_c_fishbluegil_01_ms",
    "a_c_fishbluegil_01_sm",
    "a_c_fishbullheadcat_01_ms",
    "a_c_fishbullheadcat_01_sm",
    "a_c_fishchainpickerel_01_ms",
    "a_c_fishchainpickerel_01_sm",
    "a_c_fishchannelcatfish_01_lg",
    "a_c_fishchannelcatfish_01_xl",
    "a_c_fishlakesturgeon_01_lg",
    "a_c_fishlargemouthbass_01_lg",
    "a_c_fishlargemouthbass_01_ms",
    "a_c_fishlongnosegar_01_lg",
    "a_c_fishmuskie_01_lg",
    "a_c_fishnorthernpike_01_lg",
    "a_c_fishperch_01_ms",
    "a_c_fishperch_01_sm",
    "a_c_fishrainbowtrout_01_lg",
    "a_c_fishrainbowtrout_01_ms",
    "a_c_fishredfinpickerel_01_ms",
    "a_c_fishredfinpickerel_01_sm",
    "a_c_fishrockbass_01_ms",
    "a_c_fishrockbass_01_sm",
    "a_c_fishsalmonsockeye_01_lg",
    "a_c_fishsalmonsockeye_01_ml",
    "a_c_fishsalmonsockeye_01_ms",
    "a_c_fishsmallmouthbass_01_lg",
    "a_c_fishsmallmouthbass_01_ms",
  ] },
  { master: "🪶 Nativos / Wapiti", category: "Personagens Nativos", items: [
    "cs_wapitiboy",
  ] },
  { master: "🎭 Personagens", category: "Gang Van der Linde", items: [
    "cs_charlessmith",
    "cs_dutch",
    "cs_edith_john",
    "cs_hoseamatthews",
    "cs_javierescuella",
    "cs_johnmarston",
    "cs_johnthebaptisingmadman",
    "cs_johnweathers",
    "cs_karensjohn_01",
    "cs_sean",
  ] },
  { master: "🎭 Personagens", category: "Família Marston", items: [
    "cs_abigailroberts",
    "cs_jackmarston",
    "cs_jackmarston_teen",
  ] },
  { master: "🎭 Personagens", category: "Antagonistas", items: [
    "cs_edgarross",
    "cs_leostrauss",
    "cs_micahbell",
    "cs_micahsnemesis",
    "cs_professorbell",
    "cs_rainsfall",
    "cs_thomasdown",
  ] },
  { master: "🎭 Personagens", category: "Gray & Braithwaite", items: [
    "cs_adamgray",
    "cs_bartholomewbraithwaite",
    "cs_beaugray",
    "cs_braithwaitebutler",
    "cs_braithwaitemaid",
    "cs_braithwaiteservant",
    "cs_catherinebraithwaite",
    "cs_garethbraithwaite",
    "cs_geraldbraithwaite",
    "cs_iangray",
    "cs_jockgray",
    "cs_leighgray",
    "cs_penelopebraithwaite",
    "cs_scottgray",
    "cs_tavishgray",
  ] },
  { master: "🎭 Personagens", category: "NPCs Nomeados", items: [
    "cs_abe",
    "cs_aberdeenpigfarmer",
    "cs_aberdeensister",
    "cs_acrobat",
    "cs_agnesdowd",
    "cs_albertcakeesquire",
    "cs_albertmason",
    "cs_andershelgerson",
    "cs_angel",
    "cs_angryhusband",
    "cs_angusgeddes",
    "cs_ansel_atherton",
    "cs_antonyforemen",
    "cs_archerfordham",
    "cs_archibaldjameson",
    "cs_archiedown",
    "cs_artappraiser",
    "cs_asbdeputy_01",
    "cs_ashton",
    "cs_balloonoperator",
    "cs_bandbassist",
    "cs_banddrummer",
    "cs_bandpianist",
    "cs_bandsinger",
    "cs_baptiste",
    "cs_bathingladies_01",
    "cs_beatenupcaptain",
    "cs_billwilliamson",
    "cs_bivcoachdriver",
    "cs_blwphotographer",
    "cs_blwwitness",
    "cs_brendacrawley",
    "cs_bronte",
    "cs_brontesbutler",
    "cs_brotherdorkins",
    "cs_brynntildon",
    "cs_bubba",
    "cs_cabaretmc",
    "cs_cajun",
    "cs_cancan_01",
    "cs_cancan_02",
    "cs_cancan_03",
    "cs_cancan_04",
    "cs_cancanman_01",
    "cs_captainmonroe",
    "cs_cassidy",
    "cs_cattlerustler",
    "cs_cavehermit",
    "cs_chainprisoner_01",
    "cs_chainprisoner_02",
    "cs_chelonianmaster",
    "cs_cigcardguy",
    "cs_clay",
    "cs_cleet",
    "cs_clive",
    "cs_colfavours",
    "cs_colmodriscoll",
    "cs_cooper",
    "cs_cornwalltrainconductor",
    "cs_crackpotinventor",
    "cs_crackpotrobot",
    "cs_creepyoldlady",
    "cs_creolecaptain",
    "cs_creoledoctor",
    "cs_creoleguy",
    "cs_dalemaroney",
    "cs_daveycallender",
    "cs_davidgeddes",
    "cs_desmond",
    "cs_didsbury",
    "cs_dinoboneslady",
    "cs_disguisedduster_01",
    "cs_disguisedduster_02",
    "cs_disguisedduster_03",
    "cs_doroetheawicklow",
    "cs_drhiggins",
    "cs_drmalcolmmacintosh",
    "cs_duncangeddes",
    "cs_dusterinformant_01",
    "cs_eagleflies",
    "cs_edithdown",
    "cs_edmundlowry",
    "cs_escapeartist",
    "cs_escapeartistassistant",
    "cs_evelynmiller",
    "cs_exconfedinformant",
    "cs_exconfedsleader_01",
    "cs_exoticcollector",
    "cs_famousgunslinger_01",
    "cs_famousgunslinger_02",
    "cs_famousgunslinger_03",
    "cs_famousgunslinger_04",
    "cs_famousgunslinger_05",
    "cs_famousgunslinger_06",
    "cs_featherstonchambers",
    "cs_featsofstrength",
    "cs_fightref",
    "cs_fire_breather",
    "cs_fishcollector",
    "cs_forgivenhusband_01",
    "cs_forgivenwife_01",
    "cs_formyartbigwoman",
    "cs_francis_sinclair",
    "cs_frenchartist",
    "cs_frenchman_01",
    "cs_fussar",
    "cs_gavin",
    "cs_genstoryfemale",
    "cs_genstorymale",
    "cs_germandaughter",
    "cs_germanfather",
    "cs_germanmother",
    "cs_germanson",
    "cs_gilbertknightly",
    "cs_gloria",
    "cs_grizzledjon",
    "cs_guidomartelli",
    "cs_hamish",
    "cs_hectorfellowes",
    "cs_henrilemiux",
    "cs_herbalist",
    "cs_hercule",
    "cs_hestonjameson",
    "cs_hobartcrawley",
    "cs_jamie",
    "cs_janson",
    "cs_jeb",
    "cs_jimcalloway",
    "cs_joe",
    "cs_joebutler",
    "cs_josiahtrelawny",
    "cs_jules",
    "cs_karen",
    "cs_kieran",
    "cs_laramie",
    "cs_lemiuxassistant",
    "cs_lenny",
    "cs_leon",
    "cs_levisimon",
    "cs_leviticuscornwall",
    "cs_lillianpowell",
    "cs_lillymillet",
    "cs_londonderryson",
    "cs_lucanapoli",
    "cs_magnifico",
    "cs_mamawatson",
    "cs_marshall_thurwell",
    "cs_marybeth",
    "cs_marylinton",
    "cs_meditatingmonk",
    "cs_meredith",
    "cs_meredithsmother",
    "cs_mickey",
    "cs_miltonandrews",
    "cs_missmarjorie",
    "cs_mixedracekid",
    "cs_moira",
    "cs_mollyoshea",
    "cs_mp_agent_hixon",
    "cs_mp_alfredo_montez",
    "cs_mp_allison",
    "cs_mp_amos_lansing",
    "cs_mp_bessie_adair",
    "cs_mp_bonnie",
    "cs_mp_bountyhunter",
    "cs_mp_camp_cook",
    "cs_mp_cliff",
    "cs_mp_cripps",
    "cs_mp_dannylee",
    "cs_mp_grace_lancing",
    "cs_mp_gus_macmillan",
    "cs_mp_hans",
    "cs_mp_harriet_davenport",
    "cs_mp_henchman",
    "cs_mp_horley",
    "cs_mp_jeremiah_shaw",
    "cs_mp_jessica",
    "cs_mp_jorge_montez",
    "cs_mp_langston",
    "cs_mp_lee",
    "cs_mp_lem",
    "cs_mp_mabel",
    "cs_mp_maggie",
    "cs_mp_marshall_davies",
    "cs_mp_moonshiner",
    "cs_mp_mradler",
    "cs_mp_oldman_jones",
    "cs_mp_policechief_lambert",
    "cs_mp_revenge_marshall",
    "cs_mp_samson_finch",
    "cs_mp_senator_ricard",
    "cs_mp_seth",
    "cs_mp_shaky",
    "cs_mp_sherifffreeman",
    "cs_mp_teddybrown",
    "cs_mp_terrance",
    "cs_mp_the_boy",
    "cs_mp_travellingsaleswoman",
    "cs_mp_went",
    "cs_mradler",
    "cs_mrdevon",
    "cs_mrlinton",
    "cs_mrpearson",
    "cs_mrs_calhoun",
    "cs_mrs_sinclair",
    "cs_mrsadler",
    "cs_mrsfellows",
    "cs_mrsgeddes",
    "cs_mrslondonderry",
    "cs_mrsweathers",
    "cs_mrwayne",
    "cs_mud2bigguy",
    "cs_mysteriousstranger",
    "cs_nbxdrunk",
    "cs_nbxexecuted",
    "cs_nbxpolicechiefformal",
    "cs_nbxreceptionist_01",
    "cs_nial_whelan",
    "cs_nicholastimmins",
    "cs_nils",
    "cs_norrisforsythe",
    "cs_obediahhinton",
    "cs_oddfellowspinhead",
    "cs_odprostitute",
    "cs_operasinger",
    "cs_paytah",
    "cs_pinkertongoon",
    "cs_poisonwellshaman",
    "cs_poorjoe",
    "cs_priest_wedding",
    "cs_princessisabeau",
    "cs_ramon_cortez",
    "cs_reverendfortheringham",
    "cs_revswanson",
    "cs_rhodeputy_01",
    "cs_rhodeputy_02",
    "cs_rhodesassistant",
    "cs_rhodeskidnapvictim",
    "cs_rhodessaloonbouncer",
    "cs_ringmaster",
    "cs_rockyseven_widow",
    "cs_samaritan",
    "cs_sd_streetkid_01",
    "cs_sd_streetkid_01a",
    "cs_sd_streetkid_01b",
    "cs_sd_streetkid_02",
    "cs_sddoctor_01",
    "cs_sdpriest",
    "cs_sdsaloondrunk_01",
    "cs_sdstreetkidthief",
    "cs_sherifffreeman",
    "cs_sheriffowens",
    "cs_sistercalderon",
    "cs_slavecatcher",
    "cs_soothsayer",
    "cs_strawberryoutlaw_01",
    "cs_strawberryoutlaw_02",
    "cs_strdeputy_01",
    "cs_strdeputy_02",
    "cs_strsheriff_01",
    "cs_sunworshipper",
    "cs_susangrimshaw",
    "cs_swampfreak",
    "cs_swampweirdosonny",
    "cs_sworddancer",
    "cs_taxidermist",
    "cs_theodorelevin",
    "cs_tigerhandler",
    "cs_tilly",
    "cs_timothydonahue",
    "cs_tinyhermit",
    "cs_tomdickens",
    "cs_towncrier",
    "cs_treasurehunter",
    "cs_twinbrother_01",
    "cs_twinbrother_02",
    "cs_twingroupie_01",
    "cs_twingroupie_02",
    "cs_uncle",
    "cs_unidusterjail_01",
    "cs_valauctionboss_01",
    "cs_valdeputy_01",
    "cs_valprayingman",
    "cs_valprostitute_01",
    "cs_valprostitute_02",
    "cs_valsheriff",
    "cs_vampire",
    "cs_vht_bathgirl",
    "cs_warvet",
    "cs_watson_01",
    "cs_watson_02",
    "cs_watson_03",
    "cs_welshfighter",
    "cs_wintonholmes",
    "cs_wrobel",
  ] },
  { master: "🏘️ Civis", category: "Outros", items: [
    "a_f_m_armcholeracorpse_01",
    "a_f_m_armtownfolk_01",
    "a_f_m_armtownfolk_02",
    "a_f_m_asbtownfolk_01",
    "a_f_m_bivfancytravellers_01",
    "a_f_m_blwtownfolk_01",
    "a_f_m_blwtownfolk_02",
    "a_f_m_blwupperclass_01",
    "a_f_m_btchillbilly_01",
    "a_f_m_btcobesewomen_01",
    "a_f_m_bynfancytravellers_01",
    "a_f_m_familytravelers_cool_01",
    "a_f_m_familytravelers_warm_01",
    "a_f_m_gamhighsociety_01",
    "a_f_m_grifancytravellers_01",
    "a_f_m_guatownfolk_01",
    "a_f_m_htlfancytravellers_01",
    "a_f_m_lagtownfolk_01",
    "a_f_m_lowersdtownfolk_01",
    "a_f_m_lowersdtownfolk_02",
    "a_f_m_lowersdtownfolk_03",
    "a_f_m_lowertrainpassengers_01",
    "a_f_m_middlesdtownfolk_01",
    "a_f_m_middlesdtownfolk_02",
    "a_f_m_middlesdtownfolk_03",
    "a_f_m_middletrainpassengers_01",
    "a_f_m_nbxslums_01",
    "a_f_m_nbxupperclass_01",
    "a_f_m_nbxwhore_01",
    "a_f_m_rhdprostitute_01",
    "a_f_m_rhdtownfolk_01",
    "a_f_m_rhdtownfolk_02",
    "a_f_m_rhdupperclass_01",
    "a_f_m_rkrfancytravellers_01",
    "a_f_m_roughtravellers_01",
    "a_f_m_sclfancytravellers_01",
    "a_f_m_sdchinatown_01",
    "a_f_m_sdfancywhore_01",
    "a_f_m_sdobesewomen_01",
    "a_f_m_sdserversformal_01",
    "a_f_m_sdslums_02",
    "a_f_m_skpprisononline_01",
    "a_f_m_strtownfolk_01",
    "a_f_m_tumtownfolk_01",
    "a_f_m_tumtownfolk_02",
    "a_f_m_unicorpse_01",
    "a_f_m_uppertrainpassengers_01",
    "a_f_m_valprostitute_01",
    "a_f_m_valtownfolk_01",
    "a_f_m_vhtprostitute_01",
    "a_f_m_vhttownfolk_01",
    "a_f_m_waptownfolk_01",
    "a_f_o_blwupperclass_01",
    "a_f_o_btchillbilly_01",
    "a_f_o_guatownfolk_01",
    "a_f_o_lagtownfolk_01",
    "a_f_o_sdchinatown_01",
    "a_f_o_sdupperclass_01",
    "a_f_o_waptownfolk_01",
    "a_m_m_armcholeracorpse_01",
    "a_m_m_armtownfolk_01",
    "a_m_m_armtownfolk_02",
    "a_m_m_asbboatcrew_01",
    "a_m_m_asbminer_01",
    "a_m_m_asbminer_02",
    "a_m_m_asbminer_03",
    "a_m_m_asbminer_04",
    "a_m_m_asbtownfolk_01",
    "a_m_m_asbtownfolk_01_laborer",
    "a_m_m_bivfancydrivers_01",
    "a_m_m_bivfancytravellers_01",
    "a_m_m_bivroughtravellers_01",
    "a_m_m_bivworker_01",
    "a_m_m_blwforeman_01",
    "a_m_m_blwlaborer_01",
    "a_m_m_blwlaborer_02",
    "a_m_m_blwobesemen_01",
    "a_m_m_blwtownfolk_01",
    "a_m_m_blwupperclass_01",
    "a_m_m_btchillbilly_01",
    "a_m_m_btcobesemen_01",
    "a_m_m_bynfancydrivers_01",
    "a_m_m_bynfancytravellers_01",
    "a_m_m_bynroughtravellers_01",
    "a_m_m_bynsurvivalist_01",
    "a_m_m_cardgameplayers_01",
    "a_m_m_chelonian_01",
    "a_m_m_deliverytravelers_cool_01",
    "a_m_m_deliverytravelers_warm_01",
    "a_m_m_dominoesplayers_01",
    "a_m_m_emrfarmhand_01",
    "a_m_m_familytravelers_cool_01",
    "a_m_m_familytravelers_warm_01",
    "a_m_m_farmtravelers_cool_01",
    "a_m_m_farmtravelers_warm_01",
    "a_m_m_fivefingerfilletplayers_01",
    "a_m_m_foreman",
    "a_m_m_gamhighsociety_01",
    "a_m_m_grifancydrivers_01",
    "a_m_m_grifancytravellers_01",
    "a_m_m_griroughtravellers_01",
    "a_m_m_grisurvivalist_01",
    "a_m_m_guatownfolk_01",
    "a_m_m_htlfancydrivers_01",
    "a_m_m_htlfancytravellers_01",
    "a_m_m_htlroughtravellers_01",
    "a_m_m_htlsurvivalist_01",
    "a_m_m_huntertravelers_cool_01",
    "a_m_m_huntertravelers_warm_01",
    "a_m_m_lagtownfolk_01",
    "a_m_m_lowersdtownfolk_01",
    "a_m_m_lowersdtownfolk_02",
    "a_m_m_lowertrainpassengers_01",
    "a_m_m_middlesdtownfolk_01",
    "a_m_m_middlesdtownfolk_02",
    "a_m_m_middlesdtownfolk_03",
    "a_m_m_middletrainpassengers_01",
    "a_m_m_moonshiners_01",
    "a_m_m_nbxdockworkers_01",
    "a_m_m_nbxlaborers_01",
    "a_m_m_nbxslums_01",
    "a_m_m_nbxupperclass_01",
    "a_m_m_nearoughtravellers_01",
    "a_m_m_rancher_01",
    "a_m_m_ranchertravelers_cool_01",
    "a_m_m_ranchertravelers_warm_01",
    "a_m_m_rhdforeman_01",
    "a_m_m_rhdobesemen_01",
    "a_m_m_rhdtownfolk_01",
    "a_m_m_rhdtownfolk_01_laborer",
    "a_m_m_rhdtownfolk_02",
    "a_m_m_rhdupperclass_01",
    "a_m_m_rkrfancydrivers_01",
    "a_m_m_rkrfancytravellers_01",
    "a_m_m_rkrroughtravellers_01",
    "a_m_m_rkrsurvivalist_01",
    "a_m_m_sclfancydrivers_01",
    "a_m_m_sclfancytravellers_01",
    "a_m_m_sclroughtravellers_01",
    "a_m_m_sdchinatown_01",
    "a_m_m_sddockforeman_01",
    "a_m_m_sddockworkers_02",
    "a_m_m_sdfancytravellers_01",
    "a_m_m_sdlaborers_02",
    "a_m_m_sdobesemen_01",
    "a_m_m_sdroughtravellers_01",
    "a_m_m_sdserversformal_01",
    "a_m_m_sdslums_02",
    "a_m_m_skpprisoner_01",
    "a_m_m_skpprisonline_01",
    "a_m_m_strfancytourist_01",
    "a_m_m_strlaborer_01",
    "a_m_m_strtownfolk_01",
    "a_m_m_tumtownfolk_01",
    "a_m_m_tumtownfolk_02",
    "a_m_m_uniboatcrew_01",
    "a_m_m_unicorpse_01",
    "a_m_m_unigunslinger_01",
    "a_m_m_uppertrainpassengers_01",
    "a_m_m_valfarmer_01",
    "a_m_m_vallaborer_01",
    "a_m_m_valtownfolk_01",
    "a_m_m_valtownfolk_02",
    "a_m_m_vhtboatcrew_01",
    "a_m_m_vhttownfolk_01",
    "a_m_m_wapwarriors_01",
    "a_m_o_blwupperclass_01",
    "a_m_o_btchillbilly_01",
    "a_m_o_guatownfolk_01",
    "a_m_o_lagtownfolk_01",
    "a_m_o_sdchinatown_01",
    "a_m_o_sdupperclass_01",
    "a_m_o_waptownfolk_01",
    "a_m_y_asbminer_01",
    "a_m_y_asbminer_02",
    "a_m_y_asbminer_03",
    "a_m_y_asbminer_04",
    "a_m_y_nbxstreetkids_01",
    "a_m_y_nbxstreetkids_slums_01",
    "a_m_y_sdstreetkids_slums_02",
    "a_m_y_unicorpse_01",
  ] },
  { master: "💀 Gangs", category: "Dusters/O'Driscolls", items: [
    "a_m_m_smhthug_01",
    "a_m_m_valcriminals_01",
    "a_m_m_vhtthug_01",
  ] },
  { master: "⚖️ Lei & Ordem", category: "Lawmen Rurais", items: [
    "a_m_m_armdeputyresident_01",
    "a_m_m_asbdeputyresident_01",
    "a_m_m_rhddeputyresident_01",
    "a_m_m_strdeputyresident_01",
    "a_m_m_valdeputyresident_01",
  ] },
  { master: "⚖️ Lei & Ordem", category: "Pinkertons & Guards", items: [
    "a_m_m_jamesonguard_01",
    "a_m_m_unicoachguards_01",
  ] },
  { master: "🎲 Eventos Aleatórios", category: "Eventos", items: [
    "re_animalattack_females_01",
    "re_animalattack_males_01",
    "re_animalmauling_males_01",
    "re_approach_males_01",
    "re_beartrap_males_01",
    "re_boatattack_males_01",
    "re_burningbodies_males_01",
    "re_checkpoint_males_01",
    "re_coachrobbery_females_01",
    "re_coachrobbery_males_01",
    "re_consequence_males_01",
    "re_corpsecart_females_01",
    "re_corpsecart_males_01",
    "re_crashedwagon_males_01",
    "re_darkalleyambush_males_01",
    "re_darkalleybum_males_01",
    "re_darkalleystabbing_males_01",
    "re_deadbodies_males_01",
    "re_deadjohn_females_01",
    "re_deadjohn_males_01",
    "re_disabledbeggar_males_01",
    "re_domesticdispute_females_01",
    "re_domesticdispute_males_01",
    "re_drownmurder_females_01",
    "re_drownmurder_males_01",
    "re_drunkcamp_males_01",
    "re_drunkdueler_males_01",
    "re_duelboaster_males_01",
    "re_duelwinner_females_01",
    "re_duelwinner_males_01",
    "re_escort_females_01",
    "re_executions_males_01",
    "re_fleeingfamily_females_01",
    "re_fleeingfamily_males_01",
    "re_footrobbery_males_01",
    "re_friendlyoutdoorsman_males_01",
    "re_frozentodeath_females_01",
    "re_frozentodeath_males_01",
    "re_fundraiser_females_01",
    "re_fussarchase_males_01",
    "re_goldpanner_males_01",
    "re_horserace_females_01",
    "re_horserace_males_01",
    "re_hostagerescue_females_01",
    "re_hostagerescue_males_01",
    "re_inbredkidnap_females_01",
    "re_inbredkidnap_males_01",
    "re_injuredrider_males_01",
    "re_kidnappedvictim_females_01",
    "re_laramiegangrustling_males_01",
    "re_loneprisoner_males_01",
    "re_lostdog_dogs_01",
    "re_lostdog_teens_01",
    "re_lostdrunk_females_01",
    "re_lostdrunk_males_01",
    "re_lostfriend_males_01",
    "re_lostman_males_01",
    "re_moonshinecamp_males_01",
    "re_murdercamp_males_01",
    "re_murdersuicide_females_01",
    "re_murdersuicide_males_01",
    "re_nakedswimmer_males_01",
    "re_ontherun_males_01",
    "re_outlawlooter_males_01",
    "re_parlorambush_males_01",
    "re_peepingtom_females_01",
    "re_peepingtom_males_01",
    "re_pickpocket_males_01",
    "re_pisspot_females_01",
    "re_pisspot_males_01",
    "re_playercampstrangers_females_01",
    "re_playercampstrangers_males_01",
    "re_poisoned_males_01",
    "re_policechase_males_01",
    "re_prisonwagon_females_01",
    "re_prisonwagon_males_01",
    "re_publichanging_females_01",
    "re_publichanging_males_01",
    "re_publichanging_teens_01",
    "re_rally_males_01",
    "re_rallydispute_males_01",
    "re_rallysetup_males_01",
    "re_ratinfestation_males_01",
    "re_rowdydrunks_males_01",
    "re_savageaftermath_females_01",
    "re_savageaftermath_males_01",
    "re_savagefight_females_01",
    "re_savagefight_males_01",
    "re_savagewagon_females_01",
    "re_savagewagon_males_01",
    "re_savagewarning_males_01",
    "re_sharpshooter_males_01",
    "re_showoff_males_01",
    "re_skippingstones_males_01",
    "re_skippingstones_teens_01",
    "re_slumambush_females_01",
    "re_snakebite_males_01",
    "re_stalkinghunter_males_01",
    "re_strandedrider_males_01",
    "re_street_fight_males_01",
    "re_taunting_01",
    "re_taunting_males_01",
    "re_torturingcaptive_males_01",
    "re_townburial_males_01",
    "re_townconfrontation_females_01",
    "re_townconfrontation_males_01",
    "re_townrobbery_males_01",
    "re_townwidow_females_01",
    "re_trainholdup_females_01",
    "re_trainholdup_males_01",
    "re_trappedwoman_females_01",
    "re_treasurehunter_males_01",
    "re_voice_females_01",
    "re_wagonthreat_females_01",
    "re_wagonthreat_males_01",
    "re_washedashore_males_01",
    "re_wealthycouple_females_01",
    "re_wealthycouple_males_01",
    "re_wildman_01",
  ] },
  { master: "🌐 Multiplayer", category: "Civis MP", items: [
    "mp_a_c_alligator_01",
    "mp_a_c_bear_01",
    "mp_a_c_beaver_01",
    "mp_a_c_bighornram_01",
    "mp_a_c_boar_01",
    "mp_a_c_buck_01",
    "mp_a_c_buffalo_01",
    "mp_a_c_chicken_01",
    "mp_a_c_cougar_01",
    "mp_a_c_coyote_01",
    "mp_a_c_deer_01",
    "mp_a_c_dogamericanfoxhound_01",
    "mp_a_c_elk_01",
    "mp_a_c_fox_01",
    "mp_a_c_horsecorpse_01",
    "mp_a_c_moose_01",
    "mp_a_c_owl_01",
    "mp_a_c_panther_01",
    "mp_a_c_possum_01",
    "mp_a_c_pronghorn_01",
    "mp_a_c_rabbit_01",
    "mp_a_c_sheep_01",
    "mp_a_c_wolf_01",
    "mp_a_f_m_cardgameplayers_01",
    "mp_a_f_m_protect_endflow_blackwater_01",
    "mp_a_f_m_saloonband_females_01",
    "mp_a_f_m_saloonpatrons_01",
    "mp_a_f_m_saloonpatrons_02",
    "mp_a_f_m_saloonpatrons_03",
    "mp_a_f_m_saloonpatrons_04",
    "mp_a_f_m_saloonpatrons_05",
    "mp_a_f_m_unicorpse_01",
    "mp_a_m_m_asbminers_01",
    "mp_a_m_m_asbminers_02",
    "mp_a_m_m_coachguards_01",
    "mp_a_m_m_fos_coachguards_01",
    "mp_a_m_m_jamesonguard_01",
    "mp_a_m_m_laboruprisers_01",
    "mp_a_m_m_lom_asbminers_01",
    "mp_a_m_m_moonshinemakers_01",
    "mp_a_m_m_protect_endflow_blackwater_01",
    "mp_a_m_m_saloonband_males_01",
    "mp_a_m_m_saloonpatrons_01",
    "mp_a_m_m_saloonpatrons_02",
    "mp_a_m_m_saloonpatrons_03",
    "mp_a_m_m_saloonpatrons_04",
    "mp_a_m_m_saloonpatrons_05",
    "mp_a_m_m_unicorpse_01",
    "mp_asn_benedictpoint_females_01",
    "mp_asn_benedictpoint_males_01",
    "mp_asn_blackwater_males_01",
    "mp_asn_braithwaitemanor_males_01",
    "mp_asn_braithwaitemanor_males_02",
    "mp_asn_braithwaitemanor_males_03",
    "mp_asn_civilwarfort_males_01",
    "mp_asn_gaptoothbreach_males_01",
    "mp_asn_pikesbasin_males_01",
    "mp_asn_sdpolicestation_males_01",
    "mp_asn_sdwedding_females_01",
    "mp_asn_sdwedding_males_01",
    "mp_asn_shadybelle_females_01",
    "mp_asn_stillwater_males_01",
    "mp_asntrk_elysianpool_males_01",
    "mp_asntrk_grizzlieswest_males_01",
    "mp_asntrk_hagenorchard_males_01",
    "mp_asntrk_isabella_males_01",
    "mp_asntrk_talltrees_males_01",
    "mp_beau_bink_females_01",
    "mp_beau_bink_males_01",
    "mp_bink_ember_of_the_east_males_01",
    "mp_campdef_bluewater_females_01",
    "mp_campdef_bluewater_males_01",
    "mp_campdef_chollasprings_females_01",
    "mp_campdef_chollasprings_males_01",
    "mp_campdef_eastnewhanover_females_01",
    "mp_campdef_eastnewhanover_males_01",
    "mp_campdef_gaptoothbreach_females_01",
    "mp_campdef_gaptoothbreach_males_01",
    "mp_campdef_gaptoothridge_females_01",
    "mp_campdef_gaptoothridge_males_01",
    "mp_campdef_greatplains_males_01",
    "mp_campdef_grizzlies_males_01",
    "mp_campdef_heartlands1_males_01",
    "mp_campdef_heartlands2_females_01",
    "mp_campdef_heartlands2_males_01",
    "mp_campdef_hennigans_females_01",
    "mp_campdef_hennigans_males_01",
    "mp_campdef_littlecreek_females_01",
    "mp_campdef_littlecreek_males_01",
    "mp_campdef_radleyspasture_females_01",
    "mp_campdef_radleyspasture_males_01",
    "mp_campdef_riobravo_females_01",
    "mp_campdef_riobravo_males_01",
    "mp_campdef_roanoke_females_01",
    "mp_campdef_roanoke_males_01",
    "mp_campdef_talltrees_females_01",
    "mp_campdef_talltrees_males_01",
    "mp_campdef_tworocks_females_01",
    "mp_carmela_bink_victim_males_01",
    "mp_cd_revengemayor_01",
    "mp_chu_kid_armadillo_males_01",
    "mp_chu_kid_diabloridge_males_01",
    "mp_chu_kid_emrstation_males_01",
    "mp_chu_kid_greatplains2_males_01",
    "mp_chu_kid_greatplains_males_01",
    "mp_chu_kid_heartlands_males_01",
    "mp_chu_kid_lagras_males_01",
    "mp_chu_kid_lemoyne_females_01",
    "mp_chu_kid_lemoyne_males_01",
    "mp_chu_kid_recipient_males_01",
    "mp_chu_kid_rhodes_males_01",
    "mp_chu_kid_saintdenis_females_01",
    "mp_chu_kid_saintdenis_males_01",
    "mp_chu_kid_scarlettmeadows_males_01",
    "mp_chu_kid_tumbleweed_males_01",
    "mp_chu_kid_valentine_males_01",
    "mp_chu_rob_ambarino_males_01",
    "mp_chu_rob_annesburg_males_01",
    "mp_chu_rob_benedictpoint_females_01",
    "mp_chu_rob_benedictpoint_males_01",
    "mp_chu_rob_blackwater_males_01",
    "mp_chu_rob_caligahall_males_01",
    "mp_chu_rob_coronado_males_01",
    "mp_chu_rob_cumberland_males_01",
    "mp_chu_rob_fortmercer_females_01",
    "mp_chu_rob_fortmercer_males_01",
    "mp_chu_rob_greenhollow_males_01",
    "mp_chu_rob_macfarlanes_females_01",
    "mp_chu_rob_macfarlanes_males_01",
    "mp_chu_rob_macleans_males_01",
    "mp_chu_rob_millesani_males_01",
    "mp_chu_rob_montanariver_males_01",
    "mp_chu_rob_paintedsky_males_01",
    "mp_chu_rob_rathskeller_males_01",
    "mp_chu_rob_recipient_males_01",
    "mp_chu_rob_rhodes_males_01",
    "mp_chu_rob_strawberry_males_01",
    "mp_clay",
    "mp_convoy_recipient_females_01",
    "mp_convoy_recipient_males_01",
    "mp_cs_antonyforemen",
    "mp_de_u_f_m_bigvalley_01",
    "mp_de_u_f_m_bluewatermarsh_01",
    "mp_de_u_f_m_braithwaite_01",
    "mp_de_u_f_m_doverhill_01",
    "mp_de_u_f_m_greatplains_01",
    "mp_de_u_f_m_hangingrock_01",
    "mp_de_u_f_m_heartlands_01",
    "mp_de_u_f_m_hennigansstead_01",
    "mp_de_u_f_m_silentstead_01",
    "mp_de_u_m_m_aurorabasin_01",
    "mp_de_u_m_m_barrowlagoon_01",
    "mp_de_u_m_m_bigvalleygraves_01",
    "mp_de_u_m_m_centralunionrr_01",
    "mp_de_u_m_m_pleasance_01",
    "mp_de_u_m_m_rileyscharge_01",
    "mp_de_u_m_m_vanhorn_01",
    "mp_de_u_m_m_westernhomestead_01",
    "mp_dr_u_f_m_bayougatorfood_01",
    "mp_dr_u_f_m_bigvalleycave_01",
    "mp_dr_u_f_m_bigvalleycliff_01",
    "mp_dr_u_f_m_bluewaterkidnap_01",
    "mp_dr_u_f_m_colterbandits_01",
    "mp_dr_u_f_m_colterbandits_02",
    "mp_dr_u_f_m_missingfisherman_01",
    "mp_dr_u_f_m_missingfisherman_02",
    "mp_dr_u_f_m_mistakenbounties_01",
    "mp_dr_u_f_m_plaguetown_01",
    "mp_dr_u_f_m_quakerscove_01",
    "mp_dr_u_f_m_quakerscove_02",
    "mp_dr_u_f_m_sdgraveyard_01",
    "mp_dr_u_m_m_bigvalleycave_01",
    "mp_dr_u_m_m_bigvalleycliff_01",
    "mp_dr_u_m_m_bluewaterkidnap_01",
    "mp_dr_u_m_m_canoeescape_01",
    "mp_dr_u_m_m_hwyrobbery_01",
    "mp_dr_u_m_m_mistakenbounties_01",
    "mp_dr_u_m_m_pikesbasin_01",
    "mp_dr_u_m_m_pikesbasin_02",
    "mp_dr_u_m_m_plaguetown_01",
    "mp_dr_u_m_m_roanokestandoff_01",
    "mp_dr_u_m_m_sdgraveyard_01",
    "mp_dr_u_m_m_sdmugging_01",
    "mp_dr_u_m_m_sdmugging_02",
    "mp_female",
    "mp_fm_multitrack_victims_males_01",
    "mp_fm_stakeout_corpses_males_01",
    "mp_fm_stakeout_poker_males_01",
    "mp_fm_stakeout_target_males_01",
    "mp_fm_track_prospector_01",
    "mp_fm_track_sd_lawman_01",
    "mp_fm_track_targets_males_01",
    "mp_freeroam_tut_females_01",
    "mp_freeroam_tut_males_01",
    "mp_g_f_m_armyoffear_01",
    "mp_g_f_m_cultguards_01",
    "mp_g_f_m_cultmembers_01",
    "mp_g_f_m_laperlevips_01",
    "mp_g_f_m_owlhootfamily_01",
    "mp_g_m_m_animalpoachers_01",
    "mp_g_m_m_armoredjuggernauts_01",
    "mp_g_m_m_armyoffear_01",
    "mp_g_m_m_cultguards_01",
    "mp_g_m_m_cultmembers_01",
    "mp_g_m_m_fos_vigilantes_01",
    "mp_g_m_m_mercs_01",
    "mp_g_m_m_mountainmen_01",
    "mp_g_m_m_owlhootfamily_01",
    "mp_g_m_m_riflecronies_01",
    "mp_g_m_m_unibanditos_01",
    "mp_g_m_m_unibraithwaites_01",
    "mp_g_m_m_unibrontegoons_01",
    "mp_g_m_m_unicornwallgoons_01",
    "mp_g_m_m_uniduster_01",
    "mp_g_m_m_uniduster_02",
    "mp_g_m_m_uniduster_03",
    "mp_g_m_m_unigrays_01",
    "mp_g_m_m_uniinbred_01",
    "mp_g_m_m_unilangstonboys_01",
    "mp_g_m_m_unimountainmen_01",
    "mp_g_m_m_uniranchers_01",
    "mp_g_m_m_uniswamp_01",
    "mp_g_m_o_uniexconfeds_01",
    "mp_g_m_o_uniexconfeds_cap_01",
    "mp_g_m_y_uniexconfeds_01",
    "mp_guidomartelli",
    "mp_gunvoutd2_males_01",
    "mp_gunvoutd3_bht_01",
    "mp_gunvoutd3_males_01",
    "mp_horse_owlhootvictim_01",
    "mp_intercept_recipient_females_01",
    "mp_intercept_recipient_males_01",
    "mp_intro_females_01",
    "mp_intro_males_01",
    "mp_jailbreak_males_01",
    "mp_jailbreak_recipient_males_01",
    "mp_lbm_carmela_banditos_01",
    "mp_lbt_m3_males_01",
    "mp_lbt_m6_females_01",
    "mp_lbt_m6_males_01",
    "mp_lbt_m7_males_01",
    "mp_lm_stealhorse_buyers_01",
    "mp_male",
    "mp_oth_recipient_males_01",
    "mp_post_multipackage_females_01",
    "mp_post_multipackage_males_01",
    "mp_post_multirelay_females_01",
    "mp_post_multirelay_males_01",
    "mp_post_relay_females_01",
    "mp_post_relay_males_01",
    "mp_predator",
    "mp_prsn_asn_males_01",
    "mp_re_animalattack_females_01",
    "mp_re_animalattack_males_01",
    "mp_re_duel_females_01",
    "mp_re_duel_males_01",
    "mp_re_graverobber_females_01",
    "mp_re_graverobber_males_01",
    "mp_re_hobodog_females_01",
    "mp_re_hobodog_males_01",
    "mp_re_kidnapped_females_01",
    "mp_re_kidnapped_males_01",
    "mp_re_moonshinecamp_males_01",
    "mp_re_photography_females_01",
    "mp_re_photography_females_02",
    "mp_re_photography_males_01",
    "mp_re_rivalcollector_males_01",
    "mp_re_runawaywagon_females_01",
    "mp_re_runawaywagon_males_01",
    "mp_re_slumpedhunter_females_01",
    "mp_re_slumpedhunter_males_01",
    "mp_re_suspendedhunter_males_01",
    "mp_re_treasurehunter_females_01",
    "mp_re_treasurehunter_males_01",
    "mp_re_wildman_males_01",
    "mp_recover_recipient_females_01",
    "mp_recover_recipient_males_01",
    "mp_repo_recipient_females_01",
    "mp_repo_recipient_males_01",
    "mp_repoboat_recipient_females_01",
    "mp_repoboat_recipient_males_01",
    "mp_rescue_bottletree_females_01",
    "mp_rescue_bottletree_males_01",
    "mp_rescue_colter_males_01",
    "mp_rescue_cratersacrifice_males_01",
    "mp_rescue_heartlands_males_01",
    "mp_rescue_loftkidnap_males_01",
    "mp_rescue_lonniesshack_males_01",
    "mp_rescue_moonstone_males_01",
    "mp_rescue_mtnmanshack_males_01",
    "mp_rescue_recipient_females_01",
    "mp_rescue_recipient_males_01",
    "mp_rescue_rivalshack_males_01",
    "mp_rescue_scarlettmeadows_males_01",
    "mp_rescue_sddogfight_females_01",
    "mp_rescue_sddogfight_males_01",
    "mp_resupply_recipient_females_01",
    "mp_resupply_recipient_males_01",
    "mp_revenge1_males_01",
    "mp_s_m_m_cornwallguard_01",
    "mp_s_m_m_fos_harborguards_01",
    "mp_s_m_m_pinlaw_01",
    "mp_s_m_m_revenueagents_01",
    "mp_s_m_m_revenueagents_cap_01",
    "mp_stealboat_recipient_males_01",
    "mp_stealhorse_recipient_males_01",
    "mp_stealwagon_recipient_males_01",
    "mp_tattoo_female",
    "mp_tattoo_male",
    "mp_u_f_m_buyer_improved_01",
    "mp_u_f_m_buyer_improved_02",
    "mp_u_f_m_buyer_regular_01",
    "mp_u_f_m_buyer_regular_02",
    "mp_u_f_m_buyer_special_01",
    "mp_u_f_m_buyer_special_02",
    "mp_u_f_m_cultpriest_01",
    "mp_u_f_m_gunslinger3_rifleman_02",
    "mp_u_f_m_gunslinger3_sharpshooter_01",
    "mp_u_f_m_laperlevipmasked_01",
    "mp_u_f_m_laperlevipmasked_02",
    "mp_u_f_m_laperlevipmasked_03",
    "mp_u_f_m_laperlevipmasked_04",
    "mp_u_f_m_laperlevipunmasked_01",
    "mp_u_f_m_laperlevipunmasked_02",
    "mp_u_f_m_laperlevipunmasked_03",
    "mp_u_f_m_laperlevipunmasked_04",
    "mp_u_f_m_lbt_owlhootvictim_01",
    "mp_u_f_m_nat_traveler_01",
    "mp_u_f_m_nat_worker_01",
    "mp_u_f_m_nat_worker_02",
    "mp_u_f_m_protect_mercer_01",
    "mp_u_f_m_revenge2_passerby_01",
    "mp_u_f_m_saloonpianist_01",
    "mp_u_m_m_animalpoacher_01",
    "mp_u_m_m_animalpoacher_02",
    "mp_u_m_m_animalpoacher_03",
    "mp_u_m_m_animalpoacher_04",
    "mp_u_m_m_animalpoacher_05",
    "mp_u_m_m_animalpoacher_06",
    "mp_u_m_m_animalpoacher_07",
    "mp_u_m_m_animalpoacher_08",
    "mp_u_m_m_animalpoacher_09",
    "mp_u_m_m_armsheriff_01",
    "mp_u_m_m_asbdeputy_01",
    "mp_u_m_m_bankprisoner_01",
    "mp_u_m_m_binkmercs_01",
    "mp_u_m_m_buyer_default_01",
    "mp_u_m_m_buyer_improved_01",
    "mp_u_m_m_buyer_improved_02",
    "mp_u_m_m_buyer_improved_03",
    "mp_u_m_m_buyer_improved_04",
    "mp_u_m_m_buyer_improved_05",
    "mp_u_m_m_buyer_improved_06",
    "mp_u_m_m_buyer_improved_07",
    "mp_u_m_m_buyer_improved_08",
    "mp_u_m_m_buyer_regular_01",
    "mp_u_m_m_buyer_regular_02",
    "mp_u_m_m_buyer_regular_03",
    "mp_u_m_m_buyer_regular_04",
    "mp_u_m_m_buyer_regular_05",
    "mp_u_m_m_buyer_regular_06",
    "mp_u_m_m_buyer_regular_07",
    "mp_u_m_m_buyer_regular_08",
    "mp_u_m_m_buyer_special_01",
    "mp_u_m_m_buyer_special_02",
    "mp_u_m_m_buyer_special_03",
    "mp_u_m_m_buyer_special_04",
    "mp_u_m_m_buyer_special_05",
    "mp_u_m_m_buyer_special_06",
    "mp_u_m_m_buyer_special_07",
    "mp_u_m_m_buyer_special_08",
    "mp_u_m_m_cultpriest_01",
    "mp_u_m_m_dockrecipients_01",
    "mp_u_m_m_dropoff_bronte_01",
    "mp_u_m_m_dropoff_josiah_01",
    "mp_u_m_m_dyingpoacher_01",
    "mp_u_m_m_dyingpoacher_02",
    "mp_u_m_m_dyingpoacher_03",
    "mp_u_m_m_dyingpoacher_04",
    "mp_u_m_m_dyingpoacher_05",
    "mp_u_m_m_fos_bagholders_01",
    "mp_u_m_m_fos_coachholdup_recipient_01",
    "mp_u_m_m_fos_cornwall_bandits_01",
    "mp_u_m_m_fos_cornwallguard_01",
    "mp_u_m_m_fos_dockrecipients_01",
    "mp_u_m_m_fos_dockworker_01",
    "mp_u_m_m_fos_dropoff_01",
    "mp_u_m_m_fos_harbormaster_01",
    "mp_u_m_m_fos_interrogator_01",
    "mp_u_m_m_fos_interrogator_02",
    "mp_u_m_m_fos_musician_01",
    "mp_u_m_m_fos_railway_baron_01",
    "mp_u_m_m_fos_railway_driver_01",
    "mp_u_m_m_fos_railway_foreman_01",
    "mp_u_m_m_fos_railway_guards_01",
    "mp_u_m_m_fos_railway_hunter_01",
    "mp_u_m_m_fos_railway_recipient_01",
    "mp_u_m_m_fos_recovery_recipient_01",
    "mp_u_m_m_fos_roguethief_01",
    "mp_u_m_m_fos_saboteur_01",
    "mp_u_m_m_fos_sdsaloon_gambler_01",
    "mp_u_m_m_fos_sdsaloon_owner_01",
    "mp_u_m_m_fos_sdsaloon_recipient_01",
    "mp_u_m_m_fos_sdsaloon_recipient_02",
    "mp_u_m_m_fos_town_vigilante_01",
    "mp_u_m_m_gunforhireclerk_01",
    "mp_u_m_m_gunslinger3_rifleman_01",
    "mp_u_m_m_gunslinger3_sharpshooter_02",
    "mp_u_m_m_gunslinger3_shotgunner_01",
    "mp_u_m_m_gunslinger3_shotgunner_02",
    "mp_u_m_m_gunslinger4_warner_01",
    "mp_u_m_m_harbormaster_01",
    "mp_u_m_m_hctel_arm_hostage_01",
    "mp_u_m_m_hctel_arm_hostage_02",
    "mp_u_m_m_hctel_arm_hostage_03",
    "mp_u_m_m_hctel_sd_target_01",
    "mp_u_m_m_hctel_sd_target_02",
    "mp_u_m_m_hctel_sd_target_03",
    "mp_u_m_m_interrogator_01",
    "mp_u_m_m_lawcamp_lawman_01",
    "mp_u_m_m_lawcamp_lawman_02",
    "mp_u_m_m_lawcamp_leadofficer_01",
    "mp_u_m_m_lawcamp_prisoner_01",
    "mp_u_m_m_lbt_accomplice_01",
    "mp_u_m_m_lbt_barbsvictim_01",
    "mp_u_m_m_lbt_bribeinformant_01",
    "mp_u_m_m_lbt_coachdriver_01",
    "mp_u_m_m_lbt_hostagemarshal_01",
    "mp_u_m_m_lbt_owlhootvictim_01",
    "mp_u_m_m_lbt_owlhootvictim_02",
    "mp_u_m_m_lbt_philipsvictim_01",
    "mp_u_m_m_lom_asbmercs_01",
    "mp_u_m_m_lom_dockworker_01",
    "mp_u_m_m_lom_dropoff_bronte_01",
    "mp_u_m_m_lom_head_security_01",
    "mp_u_m_m_lom_rhd_dealers_01",
    "mp_u_m_m_lom_rhd_sheriff_01",
    "mp_u_m_m_lom_rhd_smithassistant_01",
    "mp_u_m_m_lom_saloon_drunk_01",
    "mp_u_m_m_lom_sd_dockworker_01",
    "mp_u_m_m_lom_train_barricade_01",
    "mp_u_m_m_lom_train_clerk_01",
    "mp_u_m_m_lom_train_conductor_01",
    "mp_u_m_m_lom_train_lawtarget_01",
    "mp_u_m_m_lom_train_prisoners_01",
    "mp_u_m_m_lom_train_wagondropoff_01",
    "mp_u_m_m_musician_01",
    "mp_u_m_m_nat_farmer_01",
    "mp_u_m_m_nat_farmer_02",
    "mp_u_m_m_nat_farmer_03",
    "mp_u_m_m_nat_farmer_04",
    "mp_u_m_m_nat_photographer_01",
    "mp_u_m_m_nat_photographer_02",
    "mp_u_m_m_nat_rancher_01",
    "mp_u_m_m_nat_rancher_02",
    "mp_u_m_m_nat_townfolk_01",
    "mp_u_m_m_prisonwagon_01",
    "mp_u_m_m_prisonwagon_02",
    "mp_u_m_m_prisonwagon_03",
    "mp_u_m_m_prisonwagon_04",
    "mp_u_m_m_prisonwagon_05",
    "mp_u_m_m_prisonwagon_06",
    "mp_u_m_m_protect_armadillo_01",
    "mp_u_m_m_protect_blackwater_01",
    "mp_u_m_m_protect_friendly_armadillo_01",
    "mp_u_m_m_protect_halloween_ned_01",
    "mp_u_m_m_protect_macfarlanes_contact_01",
    "mp_u_m_m_protect_mercer_contact_01",
    "mp_u_m_m_protect_strawberry",
    "mp_u_m_m_protect_strawberry_01",
    "mp_u_m_m_protect_valentine_01",
    "mp_u_m_m_revenge2_handshaker_01",
    "mp_u_m_m_revenge2_passerby_01",
    "mp_u_m_m_saloonbrawler_01",
    "mp_u_m_m_saloonbrawler_02",
    "mp_u_m_m_saloonbrawler_03",
    "mp_u_m_m_saloonbrawler_04",
    "mp_u_m_m_saloonbrawler_05",
    "mp_u_m_m_saloonbrawler_06",
    "mp_u_m_m_saloonbrawler_07",
    "mp_u_m_m_saloonbrawler_08",
    "mp_u_m_m_saloonbrawler_09",
    "mp_u_m_m_saloonbrawler_10",
    "mp_u_m_m_saloonbrawler_11",
    "mp_u_m_m_saloonbrawler_12",
    "mp_u_m_m_saloonbrawler_13",
    "mp_u_m_m_saloonbrawler_14",
    "mp_u_m_m_strwelcomecenter_02",
    "mp_u_m_m_trader_01",
    "mp_u_m_m_traderintroclerk_01",
    "mp_u_m_m_tvlfence_01",
    "mp_u_m_o_blwpolicechief_01",
    "mp_u_m_o_lom_asbforeman_01",
    "mp_wgnbrkout_recipient_males_01",
    "mp_wgnthief_recipient_males_01",
  ] },
  { master: "🌐 Multiplayer", category: "Gangs MP", items: [
    "mp_g_f_m_laperlegang_01",
    "mp_g_m_m_fos_debtgang_01",
    "mp_g_m_m_fos_debtgangcapitali_01",
    "mp_g_m_m_redbengang_01",
    "mp_g_m_m_uniafricanamericangang_01",
    "mp_g_m_m_unicriminals_01",
    "mp_g_m_m_unicriminals_02",
    "mp_g_m_m_unicriminals_03",
    "mp_g_m_m_unicriminals_04",
    "mp_g_m_m_unicriminals_05",
    "mp_g_m_m_unicriminals_06",
    "mp_g_m_m_unicriminals_07",
    "mp_g_m_m_unicriminals_08",
    "mp_g_m_m_unicriminals_09",
    "mp_outlaw1_males_01",
    "mp_outlaw2_males_01",
    "mp_u_f_m_outlaw3_warner_01",
    "mp_u_f_m_outlaw3_warner_02",
    "mp_u_f_m_outlaw_societylady_01",
    "mp_u_m_m_fos_town_outlaw_01",
    "mp_u_m_m_hctel_sd_gang_01",
    "mp_u_m_m_outlaw3_prisoner_01",
    "mp_u_m_m_outlaw3_prisoner_02",
    "mp_u_m_m_outlaw3_warner_01",
    "mp_u_m_m_outlaw3_warner_02",
    "mp_u_m_m_outlaw_arrestedthief_01",
    "mp_u_m_m_outlaw_coachdriver_01",
    "mp_u_m_m_outlaw_covington_01",
    "mp_u_m_m_outlaw_mpvictim_01",
    "mp_u_m_m_outlaw_rhd_noble_01",
  ] },
  { master: "🌐 Multiplayer", category: "Bounty & Eventos MP", items: [
    "mp_fm_bounty_caged_males_01",
    "mp_fm_bounty_ct_corpses_01",
    "mp_fm_bounty_hideout_males_01",
    "mp_fm_bounty_horde_law_01",
    "mp_fm_bounty_horde_males_01",
    "mp_fm_bounty_infiltration_males_01",
    "mp_fm_bountytarget_females_dlc008_01",
    "mp_fm_bountytarget_males_dlc008_01",
    "mp_fm_knownbounty_guards_01",
    "mp_fm_knownbounty_informants_females_01",
    "mp_fm_knownbounty_informants_males_01",
    "mp_g_m_m_bountyhunters_01",
    "mp_u_f_m_bountytarget_001",
    "mp_u_f_m_bountytarget_002",
    "mp_u_f_m_bountytarget_003",
    "mp_u_f_m_bountytarget_004",
    "mp_u_f_m_bountytarget_005",
    "mp_u_f_m_bountytarget_006",
    "mp_u_f_m_bountytarget_007",
    "mp_u_f_m_bountytarget_008",
    "mp_u_f_m_bountytarget_009",
    "mp_u_f_m_bountytarget_010",
    "mp_u_f_m_bountytarget_011",
    "mp_u_f_m_bountytarget_012",
    "mp_u_f_m_bountytarget_013",
    "mp_u_f_m_bountytarget_014",
    "mp_u_f_m_legendarybounty_001",
    "mp_u_f_m_legendarybounty_002",
    "mp_u_f_m_legendarybounty_03",
    "mp_u_m_m_bountyinjuredman_01",
    "mp_u_m_m_bountytarget_001",
    "mp_u_m_m_bountytarget_002",
    "mp_u_m_m_bountytarget_003",
    "mp_u_m_m_bountytarget_005",
    "mp_u_m_m_bountytarget_008",
    "mp_u_m_m_bountytarget_009",
    "mp_u_m_m_bountytarget_010",
    "mp_u_m_m_bountytarget_011",
    "mp_u_m_m_bountytarget_012",
    "mp_u_m_m_bountytarget_013",
    "mp_u_m_m_bountytarget_014",
    "mp_u_m_m_bountytarget_015",
    "mp_u_m_m_bountytarget_016",
    "mp_u_m_m_bountytarget_017",
    "mp_u_m_m_bountytarget_018",
    "mp_u_m_m_bountytarget_019",
    "mp_u_m_m_bountytarget_020",
    "mp_u_m_m_bountytarget_021",
    "mp_u_m_m_bountytarget_022",
    "mp_u_m_m_bountytarget_023",
    "mp_u_m_m_bountytarget_024",
    "mp_u_m_m_bountytarget_025",
    "mp_u_m_m_bountytarget_026",
    "mp_u_m_m_bountytarget_027",
    "mp_u_m_m_bountytarget_028",
    "mp_u_m_m_bountytarget_029",
    "mp_u_m_m_bountytarget_030",
    "mp_u_m_m_bountytarget_031",
    "mp_u_m_m_bountytarget_032",
    "mp_u_m_m_bountytarget_033",
    "mp_u_m_m_bountytarget_034",
    "mp_u_m_m_bountytarget_035",
    "mp_u_m_m_bountytarget_036",
    "mp_u_m_m_bountytarget_037",
    "mp_u_m_m_bountytarget_038",
    "mp_u_m_m_bountytarget_039",
    "mp_u_m_m_bountytarget_044",
    "mp_u_m_m_bountytarget_045",
    "mp_u_m_m_bountytarget_046",
    "mp_u_m_m_bountytarget_047",
    "mp_u_m_m_bountytarget_048",
    "mp_u_m_m_bountytarget_049",
    "mp_u_m_m_bountytarget_050",
    "mp_u_m_m_bountytarget_051",
    "mp_u_m_m_bountytarget_052",
    "mp_u_m_m_bountytarget_053",
    "mp_u_m_m_bountytarget_054",
    "mp_u_m_m_bountytarget_055",
    "mp_u_m_m_legendarybounty_001",
    "mp_u_m_m_legendarybounty_002",
    "mp_u_m_m_legendarybounty_003",
    "mp_u_m_m_legendarybounty_004",
    "mp_u_m_m_legendarybounty_005",
    "mp_u_m_m_legendarybounty_006",
    "mp_u_m_m_legendarybounty_007",
    "mp_u_m_m_legendarybounty_08",
    "mp_u_m_m_legendarybounty_09",
    "mp_u_m_m_rhd_bountytarget_01",
    "mp_u_m_m_rhd_bountytarget_02",
    "mp_u_m_m_rhd_bountytarget_03",
    "mp_u_m_m_rhd_bountytarget_03b",
  ] },
  { master: "⚡ Únicos", category: "Únicos Masculinos", items: [
    "u_f_m_bht_wife",
    "u_f_m_circuswagon_01",
    "u_f_m_emrdaughter_01",
    "u_f_m_fussar1lady_01",
    "u_f_m_htlwife_01",
    "u_f_m_lagmother_01",
    "u_f_m_nbxresident_01",
    "u_f_m_rhdnudewoman_01",
    "u_f_m_rkshomesteadtenant_01",
    "u_f_m_story_blackbelle_01",
    "u_f_m_story_nightfolk_01",
    "u_f_m_tljbartender_01",
    "u_f_m_tumgeneralstoreowner_01",
    "u_f_m_valtownfolk_01",
    "u_f_m_valtownfolk_02",
    "u_f_m_vhtbartender_01",
    "u_m_m_announcer_01",
    "u_m_m_apfdeadman_01",
    "u_m_m_armgeneralstoreowner_01",
    "u_m_m_armtrainstationworker_01",
    "u_m_m_armundertaker_01",
    "u_m_m_armytrn4_01",
    "u_m_m_asbgunsmith_01",
    "u_m_m_asbprisoner_01",
    "u_m_m_asbprisoner_02",
    "u_m_m_bht_banditomine",
    "u_m_m_bht_banditoshack",
    "u_m_m_bht_benedictallbright",
    "u_m_m_bht_blackwaterhunt",
    "u_m_m_bht_exconfedcampreturn",
    "u_m_m_bht_laramiesleeping",
    "u_m_m_bht_lover",
    "u_m_m_bht_mineforeman",
    "u_m_m_bht_nathankirk",
    "u_m_m_bht_odriscolldrunk",
    "u_m_m_bht_odriscollmauled",
    "u_m_m_bht_odriscollsleeping",
    "u_m_m_bht_oldman",
    "u_m_m_bht_outlawmauled",
    "u_m_m_bht_saintdenissaloon",
    "u_m_m_bht_shackescape",
    "u_m_m_bht_skinnerbrother",
    "u_m_m_bht_skinnersearch",
    "u_m_m_bht_strawberryduel",
    "u_m_m_bivforeman_01",
    "u_m_m_blwtrainstationworker_01",
    "u_m_m_bulletcatchvolunteer_01",
    "u_m_m_bwmstablehand_01",
    "u_m_m_cabaretfirehat_01",
    "u_m_m_cajhomestead_01",
    "u_m_m_chelonianjumper_01",
    "u_m_m_chelonianjumper_02",
    "u_m_m_chelonianjumper_03",
    "u_m_m_chelonianjumper_04",
    "u_m_m_circuswagon_01",
    "u_m_m_cktmanager_01",
    "u_m_m_cornwalldriver_01",
    "u_m_m_crdhomesteadtenant_01",
    "u_m_m_crdhomesteadtenant_02",
    "u_m_m_crdwitness_01",
    "u_m_m_creolecaptain_01",
    "u_m_m_czphomesteadfather_01",
    "u_m_m_dorhomesteadhusband_01",
    "u_m_m_emrfarmhand_03",
    "u_m_m_emrfather_01",
    "u_m_m_executioner_01",
    "u_m_m_fatduster_01",
    "u_m_m_finale2_aa_upperclass_01",
    "u_m_m_galastringquartet_01",
    "u_m_m_galastringquartet_02",
    "u_m_m_galastringquartet_03",
    "u_m_m_galastringquartet_04",
    "u_m_m_gamdoorman_01",
    "u_m_m_hhrrancher_01",
    "u_m_m_htlforeman_01",
    "u_m_m_htlhusband_01",
    "u_m_m_htlrancherbounty_01",
    "u_m_m_islbum_01",
    "u_m_m_lnsoutlaw_01",
    "u_m_m_lnsoutlaw_02",
    "u_m_m_lnsoutlaw_03",
    "u_m_m_lnsoutlaw_04",
    "u_m_m_lnsworker_01",
    "u_m_m_lnsworker_02",
    "u_m_m_lnsworker_03",
    "u_m_m_lnsworker_04",
    "u_m_m_lrshomesteadtenant_01",
    "u_m_m_mfrrancher_01",
    "u_m_m_mud3pimp_01",
    "u_m_m_nbxbankerbounty_01",
    "u_m_m_nbxbartender_01",
    "u_m_m_nbxbartender_02",
    "u_m_m_nbxboatticketseller_01",
    "u_m_m_nbxbronteasc_01",
    "u_m_m_nbxbrontegoon_01",
    "u_m_m_nbxbrontesecform_01",
    "u_m_m_nbxgeneralstoreowner_01",
    "u_m_m_nbxgraverobber_01",
    "u_m_m_nbxgraverobber_02",
    "u_m_m_nbxgraverobber_03",
    "u_m_m_nbxgraverobber_04",
    "u_m_m_nbxgraverobber_05",
    "u_m_m_nbxgunsmith_01",
    "u_m_m_nbxliveryworker_01",
    "u_m_m_nbxmusician_01",
    "u_m_m_nbxpriest_01",
    "u_m_m_nbxresident_01",
    "u_m_m_nbxresident_02",
    "u_m_m_nbxresident_03",
    "u_m_m_nbxresident_04",
    "u_m_m_nbxriverboatpitboss_01",
    "u_m_m_nbxriverboattarget_01",
    "u_m_m_nbxshadydealer_01",
    "u_m_m_nbxskiffdriver_01",
    "u_m_m_oddfellowparticipant_01",
    "u_m_m_odriscollbrawler_01",
    "u_m_m_orpguard_01",
    "u_m_m_racforeman_01",
    "u_m_m_racquartermaster_01",
    "u_m_m_rhdbackupdeputy_01",
    "u_m_m_rhdbackupdeputy_02",
    "u_m_m_rhdbartender_01",
    "u_m_m_rhddoctor_01",
    "u_m_m_rhdfiddleplayer_01",
    "u_m_m_rhdgenstoreowner_01",
    "u_m_m_rhdgenstoreowner_02",
    "u_m_m_rhdgunsmith_01",
    "u_m_m_rhdpreacher_01",
    "u_m_m_rhdsheriff_01",
    "u_m_m_rhdtrainstationworker_01",
    "u_m_m_rhdundertaker_01",
    "u_m_m_riodonkeyrider_01",
    "u_m_m_rkfrancher_01",
    "u_m_m_rkrdonkeyrider_01",
    "u_m_m_rwfrancher_01",
    "u_m_m_sdbankguard_01",
    "u_m_m_sdcustomvendor_01",
    "u_m_m_sdexoticsshopkeeper_01",
    "u_m_m_sdphotographer_01",
    "u_m_m_sdpolicechief_01",
    "u_m_m_sdstrongwomanassistant_01",
    "u_m_m_sdtrapper_01",
    "u_m_m_sdwealthytraveller_01",
    "u_m_m_shackserialkiller_01",
    "u_m_m_shacktwin_01",
    "u_m_m_shacktwin_02",
    "u_m_m_skinnyoldguy_01",
    "u_m_m_story_armadillo_01",
    "u_m_m_story_cannibal_01",
    "u_m_m_story_chelonian_01",
    "u_m_m_story_copperhead_01",
    "u_m_m_story_creeper_01",
    "u_m_m_story_emeraldranch_01",
    "u_m_m_story_hunter_01",
    "u_m_m_story_manzanita_01",
    "u_m_m_story_murfee_01",
    "u_m_m_story_pigfarm_01",
    "u_m_m_story_princess_01",
    "u_m_m_story_redharlow_01",
    "u_m_m_story_rhodes_01",
    "u_m_m_story_sdstatue_01",
    "u_m_m_story_spectre_01",
    "u_m_m_story_treasure_01",
    "u_m_m_story_tumbleweed_01",
    "u_m_m_story_valentine_01",
    "u_m_m_strfreightstationowner_01",
    "u_m_m_strgenstoreowner_01",
    "u_m_m_strsherriff_01",
    "u_m_m_strwelcomecenter_01",
    "u_m_m_tumbartender_01",
    "u_m_m_tumbutcher_01",
    "u_m_m_tumgunsmith_01",
    "u_m_m_tumtrainstationworker_01",
    "u_m_m_unibountyhunter_01",
    "u_m_m_unibountyhunter_02",
    "u_m_m_unidusterhenchman_01",
    "u_m_m_unidusterhenchman_02",
    "u_m_m_unidusterhenchman_03",
    "u_m_m_unidusterleader_01",
    "u_m_m_uniexconfedsbounty_01",
    "u_m_m_unionleader_01",
    "u_m_m_unionleader_02",
    "u_m_m_unipeepingtom_01",
    "u_m_m_valauctionforman_01",
    "u_m_m_valauctionforman_02",
    "u_m_m_valbarber_01",
    "u_m_m_valbartender_01",
    "u_m_m_valbeartrap_01",
    "u_m_m_valbutcher_01",
    "u_m_m_valdoctor_01",
    "u_m_m_valgenstoreowner_01",
    "u_m_m_valgunsmith_01",
    "u_m_m_valhotelowner_01",
    "u_m_m_valpokerplayer_01",
    "u_m_m_valpokerplayer_02",
    "u_m_m_valpoopingman_01",
    "u_m_m_valsheriff_01",
    "u_m_m_valtheman_01",
    "u_m_m_valtownfolk_01",
    "u_m_m_valtownfolk_02",
    "u_m_m_vhtstationclerk_01",
    "u_m_m_walgeneralstoreowner_01",
    "u_m_m_wapofficial_01",
    "u_m_m_wtccowboy_04",
    "u_m_o_armbartender_01",
    "u_m_o_asbsheriff_01",
    "u_m_o_bht_docwormwood",
    "u_m_o_blwbartender_01",
    "u_m_o_blwgeneralstoreowner_01",
    "u_m_o_blwphotographer_01",
    "u_m_o_blwpolicechief_01",
    "u_m_o_cajhomestead_01",
    "u_m_o_cmrcivilwarcommando_01",
    "u_m_o_mapwiseoldman_01",
    "u_m_o_oldcajun_01",
    "u_m_o_pshrancher_01",
    "u_m_o_rigtrainstationworker_01",
    "u_m_o_valbartender_01",
    "u_m_o_vhtexoticshopkeeper_01",
    "u_m_y_cajhomestead_01",
    "u_m_y_czphomesteadson_01",
    "u_m_y_czphomesteadson_02",
    "u_m_y_czphomesteadson_03",
    "u_m_y_czphomesteadson_04",
    "u_m_y_czphomesteadson_05",
    "u_m_y_duellistbounty_01",
    "u_m_y_emrson_01",
    "u_m_y_htlworker_01",
    "u_m_y_htlworker_02",
    "u_m_y_shackstarvingkid_01",
  ] },
  { master: "⚡ Únicos", category: "Únicos Femininos", items: [
    "u_f_o_hermit_woman_01",
    "u_f_o_wtctownfolk_01",
    "u_f_y_braithwaitessecret_01",
    "u_f_y_czphomesteaddaughter_01",
  ] },
];
var scenarios = [];
var weapons = [];
var animations = {};
var propsets = [];
var pickups = [];
var walkStyleBases = [];
var walkStyles = [];

var lastSpawnMenu = -1;

var propertiesMenuUpdate;

const favouriteTypes = [
	'peds',
	'vehicles',
	'objects',
	'propsets',
	'pickups',
	'scenarios',
	'animations',
	'weapons',
	'walkStyles',
	'playerModels'
];

var favourites = {};
var currentDatabase = {};
var databaseRecentFirst = true;
var currentPreviewModel = null;
var currentPreviewType = null;
var currentPreviewIndex = null;
var currentPreviewTotal = null;
var currentPreviewMenu = null;

function sendMessage(name, params) {
	return fetch('https://' + GetParentResourceName() + '/' + name, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(params)
	});
}

function copyToClipboard(text) {
	var e = document.createElement('textarea');
	e.textContent = text;
	document.body.appendChild(e);

	var selection = document.getSelection();
	selection.removeAllRanges();

	e.select();
	document.execCommand('copy');

	selection.removeAllRanges();
	e.remove();
}

function showSpoonerHud() {
	document.querySelector('#hud').style.display = 'block';
}

function hideSpoonerHud() {
	document.querySelector('#hud').style.display = 'none';
}

function updateSpoonerHud(data) {
	var e = _getEls();

	// Crosshair
	var crossClass = data.attachedEntity ? 'attached' : (data.entity ? 'active' : 'inactive');
	if (e.crosshair.className !== crossClass) e.crosshair.className = crossClass;

	// Entity info
	if (data.entity) {
		var idText = data.netId
			? data.entity.toString() + ' [' + data.netId.toString() + ']'
			: data.entity.toString();
		_setText(e.entityId, idText);
		if (e.entityInfo.style.display !== 'block') e.entityInfo.style.display = 'block';
		if (e.basicControls.style.display !== 'none') e.basicControls.style.display = 'none';
		if (e.entityControls.style.display !== 'flex') e.entityControls.style.display = 'flex';
	} else {
		if (e.entityInfo.style.display !== 'none') e.entityInfo.style.display = 'none';
		if (e.entityControls.style.display !== 'none') e.entityControls.style.display = 'none';
		if (e.basicControls.style.display !== 'flex') e.basicControls.style.display = 'flex';
	}

	// Preview model tracking
	if (data.currentSpawnType === 1 || data.currentSpawnType === 2 ||
		data.currentSpawnType === 3 || data.currentSpawnType === 4 ||
		data.currentSpawnType === 5 ||
		data.currentSpawnType === 6) {
		currentPreviewModel = data.currentSpawn || null;
		currentPreviewType = data.currentSpawnType || null;
		currentPreviewIndex = data.currentSpawnIndex || null;
		currentPreviewTotal = data.currentSpawnTotal || null;
		currentPreviewMenu = data.currentSpawnMenu;
	} else {
		currentPreviewModel = null;
		currentPreviewType = null;
		currentPreviewIndex = null;
		currentPreviewTotal = null;
		currentPreviewMenu = null;
	}

	// Sync list selection para menus visíveis
	if (e.pedMenu.style.display === 'flex')
		syncListSelection('#ped-list', 'peds', 0, false);
	if (e.vehicleMenu.style.display === 'flex')
		syncListSelection('#vehicle-list', 'vehicles', 1, false);
	if (e.objectMenu.style.display === 'flex')
		syncListSelection('#object-list', 'objects', 2, false);
	if (e.propsetMenu.style.display === 'flex')
		syncListSelection('#propset-list', 'propsets', 3, false);
	if (e.pickupMenu.style.display === 'flex')
		syncListSelection('#pickup-list', 'pickups', 4, false);
	if (e.personalPlantasMenu.style.display === 'flex')
		syncListSelection('#personal-plantas-list', null, 11, false);
	if (e.personalObjetosMenu.style.display === 'flex')
		syncListSelection('#personal-objetos-list', null, 12, false);
	if (e.personalOyateMenu.style.display === 'flex')
		syncListSelection('#personal-oyate-list', null, 13, false);
	if (e.personalPropsetsCustMenu.style.display === 'flex')
		syncListSelection('#personal-propsets-custom-list', null, 14, false);
	if (e.personalPedsMenu.style.display === 'flex')
		syncListSelection('#personal-peds-list', 'peds', 15, false);

	// Spawn info
	if (data.currentSpawn) {
		var spawnText = (data.currentSpawnIndex && data.currentSpawnTotal)
			? data.currentSpawn + ' (' + data.currentSpawnIndex + '/' + data.currentSpawnTotal + ')'
			: data.currentSpawn;
		_setText(e.spawnId, spawnText);
		if (e.spawnInfo.style.display !== 'block') e.spawnInfo.style.display = 'block';
	} else {
		if (e.spawnInfo.style.display !== 'none') e.spawnInfo.style.display = 'none';
	}

	// Speed
	var speedText = data.speedMode === 0 ? '[' + data.speed + ']' : data.speed;
	_setText(e.speed, speedText);

	// Adjust mode
	var adjustModes = ['X', 'Y', 'Z', 'Rotacao', 'Livre', 'Desligado'];
	_setText(e.adjustMode, adjustModes[data.adjustMode] || '');

	// Rotate mode
	var rotateModes = ['Pitch', 'Roll', 'Yaw'];
	_setText(e.rotateMode, rotateModes[data.rotateMode] || '');

	// Place on ground
	var plgDisplay = data.adjustMode === 4 ? 'none' : 'block';
	if (e.placeOnGroundCont.style.display !== plgDisplay) e.placeOnGroundCont.style.display = plgDisplay;
	_setText(e.placeOnGround, data.placeOnGround ? 'Ligado' : 'Desligado');

	// Camera / cursor coords
	_setText(e.camX, data.camX);
	_setText(e.camY, data.camY);
	_setText(e.camZ, data.camZ);
	_setText(e.camHeading, data.camHeading);
	_setText(e.cursorX, data.cursorX);
	_setText(e.cursorY, data.cursorY);
	_setText(e.cursorZ, data.cursorZ);

	// Speeds
	var adjSpeedText = data.speedMode === 1
		? '[' + data.adjustSpeed.toFixed(3) + ']'
		: data.adjustSpeed.toFixed(3);
	_setText(e.adjustSpeed, adjSpeedText);

	var rotSpeedText = data.speedMode === 2
		? '[' + data.rotateSpeed.toFixed(1) + ']'
		: data.rotateSpeed.toFixed(1);
	_setText(e.rotateSpeed, rotSpeedText);

	// Entity type / model
	_setText(e.modelName, data.modelName);
	var entityTypes = { 1: 'Ped', 2: 'Veiculo', 3: 'Objeto' };
	_setText(e.entityType, entityTypes[data.entityType] || 'Entidade');

	// Focus
	if (data.focusTarget) {
		_setText(e.focusTarget, data.focusTarget.toString());
		_setText(e.focusMode, data.freeFocus ? 'Livre' : 'Fixo');
		if (e.focusInfo.style.display !== 'block') e.focusInfo.style.display = 'block';
	} else {
		if (e.focusInfo.style.display !== 'none') e.focusInfo.style.display = 'none';
	}
}

function openSpawnMenu() {
	switch (lastSpawnMenu) {
		case 0:
			document.querySelector('#ped-menu').style.display = 'flex';
			syncListSelection('#ped-list', 'peds', 0, true);
			break;
		case 1:
			document.querySelector('#vehicle-menu').style.display = 'flex';
			syncListSelection('#vehicle-list', 'vehicles', 1, true);
			break;
		case 2:
			openObjectMenu();
			break;
		case 3:
			document.querySelector('#propset-menu').style.display = 'flex';
			syncListSelection('#propset-list', 'propsets', 3, true);
			break;
		case 4:
			document.querySelector('#pickup-menu').style.display = 'flex';
			syncListSelection('#pickup-list', 'pickups', 4, true);
			break;
		case 10:
			document.querySelector('#personal-menu').style.display = 'flex';
			break;
		case 11:
			document.querySelector('#personal-plantas-menu').style.display = 'flex';
			syncListSelection('#personal-plantas-list', null, 11, true);
			break;
		case 12:
			document.querySelector('#personal-objetos-menu').style.display = 'flex';
			syncListSelection('#personal-objetos-list', null, 12, true);
			break;
		case 13:
			document.querySelector('#personal-oyate-menu').style.display = 'flex';
			syncListSelection('#personal-oyate-list', null, 13, true);
			break;
		case 14:
			document.querySelector('#personal-propsets-custom-menu').style.display = 'flex';
			syncListSelection('#personal-propsets-custom-list', null, 14, true);
			break;
		case 15:
			document.querySelector('#personal-peds-menu').style.display = 'flex';
			syncListSelection('#personal-peds-list', 'peds', 15, true);
			break;
		default:
			document.querySelector('#spawn-menu').style.display = 'flex';
			break;
	}
}

function closeSpawnMenu() {
	document.querySelector('#spawn-menu').style.display = 'none';
	sendMessage('closeSpawnMenu', {})
}

function smb_OpenSelectionAncestors(selected) {
	if (!selected) {
		return;
	}

	var categoryItems = selected.closest('.oyate-category-items');
	if (categoryItems) {
		categoryItems.classList.add('open');
		var categoryHeader = categoryItems.previousElementSibling;
		if (categoryHeader && categoryHeader.classList.contains('oyate-category-header')) {
			categoryHeader.classList.add('open');
		}
	}

	var masterItems = selected.closest('.oyate-master-items');
	if (masterItems) {
		masterItems.classList.add('open');
		var masterHeader = masterItems.previousElementSibling;
		if (masterHeader && masterHeader.classList.contains('oyate-master-header')) {
			masterHeader.classList.add('open');
		}
	}
}

function syncListSelection(listSelector, favouriteBucket, menuId, scrollToSelected) {
	var selectionKey = currentPreviewMenu === menuId && currentPreviewModel ? currentPreviewModel : '';
	var stateKey = listSelector + '|' + menuId + '|' + selectionKey;
	if (!scrollToSelected && listSelectionSyncState[listSelector] === stateKey) {
		var currentSelected = document.querySelector(listSelector + ' .object.selected');
		if (!selectionKey) {
			if (!currentSelected) {
				return;
			}
		} else if (currentSelected && currentSelected.getAttribute('data-model') === selectionKey) {
			return;
		}
	}
	listSelectionSyncState[listSelector] = stateKey;

	var selected = null;

	document.querySelectorAll(listSelector + ' .object').forEach(e => {
		var model = e.getAttribute('data-model');
		if (favouriteBucket) {
			var isFav = favourites[favouriteBucket][model];
			e.className = isFav ? 'object favourite' : 'object';
		} else {
			e.className = 'object';
		}

		if (currentPreviewMenu === menuId && currentPreviewModel && model === currentPreviewModel) {
			e.className += ' selected';
			selected = e;
		}
	});

	if (scrollToSelected && selected) {
		smb_OpenSelectionAncestors(selected);
		selected.scrollIntoView({ block: 'center' });
	}
}

function openPedMenu() {
	document.querySelector('#spawn-menu').style.display = 'none';
	document.querySelector('#ped-menu').style.display = 'flex';
	populatePedList(document.querySelector('#ped-search-filter').value);
	syncListSelection('#ped-list', 'peds', 0, true);
	lastSpawnMenu = 0;
}

function openVehicleMenu() {
	document.querySelector('#spawn-menu').style.display = 'none';
	document.querySelector('#vehicle-menu').style.display = 'flex';
	populateVehicleList(document.querySelector('#vehicle-search-filter').value);
	syncListSelection('#vehicle-list', 'vehicles', 1, true);
	lastSpawnMenu = 1;
}

function openObjectMenu() {
	document.querySelector('#spawn-menu').style.display = 'none';
	document.querySelector('#object-menu').style.display = 'flex';
	populateObjectListCategorized(document.querySelector('#object-search-filter').value);
	syncListSelection('#object-list', 'objects', 2, true);
	lastSpawnMenu = 2;
}

function openPersonalMenu() {
	document.querySelector('#spawn-menu').style.display = 'none';
	document.querySelector('#personal-menu').style.display = 'flex';
	lastSpawnMenu = 10;
}

function openPersonalPlantasMenu() {
	document.querySelector('#personal-menu').style.display = 'none';
	document.querySelector('#personal-plantas-menu').style.display = 'flex';
	populatePersonalPlantasList(document.querySelector('#personal-plantas-filter').value);
	syncListSelection('#personal-plantas-list', null, 11, true);
	lastSpawnMenu = 11;
}

function openPersonalObjetosMenu() {
	document.querySelector('#personal-menu').style.display = 'none';
	document.querySelector('#personal-objetos-menu').style.display = 'flex';
	populatePersonalObjetosList(document.querySelector('#personal-objetos-filter').value);
	syncListSelection('#personal-objetos-list', null, 12, true);
	lastSpawnMenu = 12;
}

function openPropsetMenu() {
	document.querySelector('#spawn-menu').style.display = 'none';
	document.querySelector('#propset-menu').style.display = 'flex';
	populatePropsetList(document.querySelector('#propset-search-filter').value);
	syncListSelection('#propset-list', 'propsets', 3, true);
	lastSpawnMenu = 3;
}

function openPickupMenu() {
	document.querySelector('#spawn-menu').style.display = 'none';
	document.querySelector('#pickup-menu').style.display = 'flex';
	populatePickupList(document.querySelector('#pickup-search-filter').value);
	syncListSelection('#pickup-list', 'pickups', 4, true);
	lastSpawnMenu = 4;
}

function closePedMenu(selected) {
	document.querySelector('#ped-menu').style.display = 'none';

	if (selected) {
		var name = selected.getAttribute('data-model');

		sendMessage('closePedMenu', {
			modelName: name,
			list: pedVisibleModels,
			index: Math.max(1, pedVisibleModels.indexOf(name) + 1),
			menu: 0
		});

		document.querySelectorAll('#ped-list .object').forEach(e => {
			if (favourites.peds[e.getAttribute('data-model')]) {
				e.className = 'object favourite';
			} else {
				e.className = 'object';
			}
		});
		selected.className = 'object selected';
	} else {
		document.querySelector('#spawn-menu').style.display = 'flex';
		lastSpawnMenu = -1;
	}
}

function closeVehicleMenu(selected) {
	document.querySelector('#vehicle-menu').style.display = 'none';

	if (selected) {
		var name = selected.getAttribute('data-model');

		sendMessage('closeVehicleMenu', {
			modelName: name,
			list: vehicleVisibleModels,
			index: Math.max(1, vehicleVisibleModels.indexOf(name) + 1),
			menu: 1
		});

		document.querySelectorAll('#vehicle-list .object').forEach(e => {
			if (favourites.vehicles[e.getAttribute('data-model')]) {
				e.className = 'object favourite';
			} else {
				e.className = 'object';
			}
		});
		selected.className = 'object selected';
	} else {
		document.querySelector('#spawn-menu').style.display = 'flex';
		lastSpawnMenu = -1;
	}
}

function closeObjectMenu(selected) {
	document.querySelector('#object-menu').style.display = 'none';

	if (selected) {
		var name = selected.getAttribute('data-model');

		sendMessage('closeObjectMenu', {
			modelName: name,
			list: objectVisibleModels,
			index: Math.max(1, objectVisibleModels.indexOf(name) + 1),
			menu: 2
		});

		document.querySelectorAll('#object-list .object').forEach(e => {
			if (favourites.objects[e.getAttribute('data-model')]) {
				e.className = 'object favourite';
			} else {
				e.className = 'object';
			}
		});
		selected.className = 'object selected';
	} else {
		document.querySelector('#spawn-menu').style.display = 'flex';
		lastSpawnMenu = -1;
	}

	var list = document.getElementById('object-list');
	list.innerHTML = '';
	objectListCacheKey = null;
	objectVisibleModels = [];
}

function closePersonalMenu() {
	document.querySelector('#personal-menu').style.display = 'none';
	document.querySelector('#spawn-menu').style.display = 'flex';
	lastSpawnMenu = -1;
}

function closePersonalPlantasMenu(selected) {
	document.querySelector('#personal-plantas-menu').style.display = 'none';

	if (selected) {
		var name = selected.getAttribute('data-model');
		sendMessage('closePersonalMenu', {
			modelName: name,
			list: personalPlantasVisibleModels,
			index: Math.max(1, personalPlantasVisibleModels.indexOf(name) + 1),
			menu: 11
		});
		document.querySelectorAll('#personal-plantas-list .object').forEach(e => {
			e.className = 'object';
		});
		selected.className = 'object selected';
	} else {
		document.querySelector('#personal-menu').style.display = 'flex';
	}
}

function closePersonalObjetosMenu(selected) {
	document.querySelector('#personal-objetos-menu').style.display = 'none';

	if (selected) {
		var name = selected.getAttribute('data-model');
		sendMessage('closePersonalMenu', {
			modelName: name,
			list: personalObjetosVisibleModels,
			index: Math.max(1, personalObjetosVisibleModels.indexOf(name) + 1),
			menu: 12
		});
		document.querySelectorAll('#personal-objetos-list .object').forEach(e => {
			e.className = 'object';
		});
		selected.className = 'object selected';
	} else {
		document.querySelector('#personal-menu').style.display = 'flex';
	}
}

function populatePersonalPlantasList(filter) {
	var list = document.getElementById('personal-plantas-list');
	var favsOnly = document.getElementById('favourite-plantas').hasAttribute('data-active');
	var selected = null;
	personalPlantasVisibleModels = [];
	list.innerHTML = '';

	personal.forEach(function(name) {
		var isFav = favourites.objects[name];
		if (favsOnly && !isFav) return;
		if (filter && filter !== '' && !name.toLowerCase().includes(filter.toLowerCase())) return;

		personalPlantasVisibleModels.push(name);
		var div = document.createElement('div');
		div.className = isFav ? 'object favourite' : 'object';
		div.setAttribute('data-model', name);
		div.setAttribute('data-favourite-type', 'objects');
		div.setAttribute('data-favourite-name', name);
		div.innerHTML = name;
		if (currentPreviewMenu === 11 && currentPreviewModel === name) {
			div.className += ' selected';
			selected = div;
		}
		div.addEventListener('click', function(event) { closePersonalPlantasMenu(this); });
		if (isFav) {
			div.addEventListener('contextmenu', favouriteOnClick);
		} else {
			div.addEventListener('contextmenu', nonFavouriteOnClick);
		}
		list.appendChild(div);
	});

	if (selected) {
		selected.scrollIntoView({ block: 'center' });
	}
}

function populatePersonalObjetosList(filter) {
	var list = document.getElementById('personal-objetos-list');
	var favsOnly = document.getElementById('favourite-objetos').hasAttribute('data-active');
	var hasFilter = filter && filter !== '';
	var selected = null;
	personalObjetosVisibleModels = [];
	list.innerHTML = '';

	personalObjetos.forEach(function(group) {
		var matches = group.items.filter(function(name) {
			if (favsOnly && !favourites.objects[name]) return false;
			if (!hasFilter) return true;
			return name.toLowerCase().includes(filter.toLowerCase());
		});
		if (matches.length === 0) return;

		var header = document.createElement('div');
		header.className = 'oyate-category-header' + (hasFilter || favsOnly ? ' open' : '');
		header.innerHTML = '<span>' + group.category + ' (' + matches.length + ')</span><span class="oyate-toggle">▶</span>';

		var itemsContainer = document.createElement('div');
		itemsContainer.className = 'oyate-category-items' + (hasFilter || favsOnly ? ' open' : '');

		header.addEventListener('click', function() {
			var isOpen = itemsContainer.classList.contains('open');
			itemsContainer.classList.toggle('open', !isOpen);
			header.classList.toggle('open', !isOpen);
		});

		matches.forEach(function(name) {
			var isFav = favourites.objects[name];
			personalObjetosVisibleModels.push(name);
			var div = document.createElement('div');
			div.className = isFav ? 'object favourite' : 'object';
			div.setAttribute('data-model', name);
			div.setAttribute('data-favourite-type', 'objects');
			div.setAttribute('data-favourite-name', name);
			div.innerHTML = name;
			if (currentPreviewMenu === 12 && currentPreviewModel === name) {
				div.className += ' selected';
				selected = div;
			}
			div.addEventListener('click', function(event) { closePersonalObjetosMenu(this); });
			if (isFav) {
				div.addEventListener('contextmenu', favouriteOnClick);
			} else {
				div.addEventListener('contextmenu', nonFavouriteOnClick);
			}
			itemsContainer.appendChild(div);
		});

		list.appendChild(header);
		list.appendChild(itemsContainer);
	});

	if (selected) {
		selected.scrollIntoView({ block: 'center' });
	}
}

function openPersonalOyateMenu() {
	document.querySelector('#personal-menu').style.display = 'none';
	document.querySelector('#personal-oyate-menu').style.display = 'flex';
	populatePersonalOyateList(document.querySelector('#personal-oyate-filter').value);
	syncListSelection('#personal-oyate-list', 'objects', 13, true);
	lastSpawnMenu = 13;
}

function openPersonalCustomPropsetMenu() {
	document.querySelector('#personal-menu').style.display = 'none';
	document.querySelector('#personal-propsets-custom-menu').style.display = 'flex';
	populatePersonalCustomPropsetList(document.querySelector('#personal-propsets-custom-filter').value);
	syncListSelection('#personal-propsets-custom-list', null, 14, true);
	lastSpawnMenu = 14;
}

function closePersonalOyateMenu(selected) {
	document.querySelector('#personal-oyate-menu').style.display = 'none';

	if (selected) {
		var name = selected.getAttribute('data-model');
		sendMessage('closePersonalMenu', {
			modelName: name,
			list: personalOyateVisibleModels,
			index: Math.max(1, personalOyateVisibleModels.indexOf(name) + 1),
			menu: 13
		});
		document.querySelectorAll('#personal-oyate-list .object').forEach(e => {
			e.className = 'object';
		});
		selected.className = 'object selected';
	} else {
		document.querySelector('#personal-menu').style.display = 'flex';
	}
}

function closePersonalCustomPropsetMenu(selected) {
	document.querySelector('#personal-propsets-custom-menu').style.display = 'none';

	if (selected) {
		var name = selected.getAttribute('data-model');
		sendMessage('closePersonalCustomPropsetMenu', {
			modelName: name,
			list: personalCustomPropsetVisibleModels,
			index: Math.max(1, personalCustomPropsetVisibleModels.indexOf(name) + 1),
			menu: 14
		});
		document.querySelectorAll('#personal-propsets-custom-list .object').forEach(e => {
			e.className = 'object';
		});
		selected.className = 'object selected';
	} else {
		document.querySelector('#personal-menu').style.display = 'flex';
	}
}

function populatePersonalOyateList(filter) {
	var list = document.getElementById('personal-oyate-list');
	var favsOnly = document.getElementById('favourite-oyate').hasAttribute('data-active');
	var selected = null;
	personalOyateVisibleModels = [];
	list.innerHTML = '';

	var hasFilter = filter && filter !== '';

	// Agrupar categorias por master
	var masterMap = {};
	var masterOrder = [];
	personalOyate.forEach(function(group) {
		var m = group.master || 'Outros';
		if (!masterMap[m]) {
			masterMap[m] = [];
			masterOrder.push(m);
		}
		masterMap[m].push(group);
	});

	masterOrder.sort(function(a, b) { return a.localeCompare(b, 'pt'); });

	masterOrder.forEach(function(masterName) {
		var groups = masterMap[masterName];
		var masterTotal = 0;

		var masterItemsEl = document.createElement('div');
		masterItemsEl.className = 'oyate-master-items' + (hasFilter ? ' open' : '');

		var sortedGroups = groups.slice().sort(function(a, b) {
			return a.category.localeCompare(b.category, 'pt');
		});

		sortedGroups.forEach(function(group) {
			var normalizedItems = group.items.map(function(item) {
				if (typeof item === 'string') {
					return { label: item, model: item };
				}
				return {
					label: item.label || item.model || '',
					model: item.model || item.label || ''
				};
			});

			var matches = normalizedItems.filter(function(item) {
				if (favsOnly && !favourites.objects[item.model]) return false;
				if (!hasFilter) return true;
				var label = (item.label || '').toLowerCase();
				var model = (item.model || '').toLowerCase();
				var search = filter.toLowerCase();
				return label.includes(search) || model.includes(search);
			}).slice().sort(function(a, b) {
				return a.label.localeCompare(b.label, 'pt');
			});
			if (matches.length === 0) return;

			masterTotal += matches.length;

			var header = document.createElement('div');
			header.className = 'oyate-category-header' + (hasFilter || favsOnly ? ' open' : '');
			header.innerHTML = '<span>' + group.category + ' (' + matches.length + ')</span><span class="oyate-toggle">▶</span>';

			var itemsContainer = document.createElement('div');
			itemsContainer.className = 'oyate-category-items' + (hasFilter || favsOnly ? ' open' : '');

			header.addEventListener('click', function() {
				var isOpen = itemsContainer.classList.contains('open');
				if (isOpen) {
					itemsContainer.classList.remove('open');
					header.classList.remove('open');
				} else {
					itemsContainer.classList.add('open');
					header.classList.add('open');
				}
			});

			matches.forEach(function(item) {
				personalOyateVisibleModels.push(item.model);
				var isFav = favourites.objects[item.model];
				var div = document.createElement('div');
				div.className = isFav ? 'object favourite' : 'object';
				div.setAttribute('data-model', item.model);
				div.setAttribute('data-favourite-type', 'objects');
				div.setAttribute('data-favourite-name', item.model);
				div.innerHTML = item.label;
				if (currentPreviewMenu === 13 && currentPreviewModel === item.model) {
					div.className += ' selected';
					selected = div;
				}
				div.addEventListener('click', function(event) {
					closePersonalOyateMenu(this);
				});
				if (isFav) {
					div.addEventListener('contextmenu', favouriteOnClick);
				} else {
					div.addEventListener('contextmenu', nonFavouriteOnClick);
				}
				itemsContainer.appendChild(div);
			});

			masterItemsEl.appendChild(header);
			masterItemsEl.appendChild(itemsContainer);
		});

		if (masterTotal === 0) return;

		var masterHeader = document.createElement('div');
		masterHeader.className = 'oyate-master-header' + (hasFilter ? ' open' : '');
		masterHeader.innerHTML = '<span>' + masterName + ' (' + masterTotal + ')</span><span class="oyate-toggle">▶</span>';

		masterHeader.addEventListener('click', function() {
			var isOpen = masterItemsEl.classList.contains('open');
			if (isOpen) {
				masterItemsEl.classList.remove('open');
				masterHeader.classList.remove('open');
			} else {
				masterItemsEl.classList.add('open');
				masterHeader.classList.add('open');
			}
		});

		list.appendChild(masterHeader);
		list.appendChild(masterItemsEl);
	});

	if (selected) {
		selected.scrollIntoView({ block: 'center' });
	}
}

function populatePersonalCustomPropsetList(filter) {
	var list = document.getElementById('personal-propsets-custom-list');
	var favsOnly = document.getElementById('favourite-propsets-custom').hasAttribute('data-active');
	var selected = null;
	personalCustomPropsetVisibleModels = [];
	list.innerHTML = '';

	customPropsets.forEach(function(name) {
		var isFav = favourites.objects[name];
		if (favsOnly && !isFav) return;
		if (filter && filter !== '' && !name.toLowerCase().includes(filter.toLowerCase())) return;

		personalCustomPropsetVisibleModels.push(name);
		var div = document.createElement('div');
		div.className = isFav ? 'object favourite' : 'object';
		div.setAttribute('data-model', name);
		div.setAttribute('data-favourite-type', 'objects');
		div.setAttribute('data-favourite-name', name);
		div.innerHTML = name;

		if (currentPreviewMenu === 14 && currentPreviewModel === name) {
			div.className += ' selected';
			selected = div;
		}

		div.addEventListener('click', function(event) { closePersonalCustomPropsetMenu(this); });
		if (isFav) {
			div.addEventListener('contextmenu', favouriteOnClick);
		} else {
			div.addEventListener('contextmenu', nonFavouriteOnClick);
		}
		list.appendChild(div);
	});

	if (selected) {
		selected.scrollIntoView({ block: 'center' });
	}
}

function openPersonalPedsMenu() {
	document.querySelector('#spawn-menu').style.display = 'none';
	document.querySelector('#personal-peds-menu').style.display = 'flex';
	populatePersonalPedsList(document.querySelector('#personal-peds-filter').value);
	syncListSelection('#personal-peds-list', 'peds', 15, true);
	lastSpawnMenu = 15;
}

function closePersonalPedsMenu(selected) {
	document.querySelector('#personal-peds-menu').style.display = 'none';

	if (selected) {
		var name = selected.getAttribute('data-model');
		sendMessage('closePedMenu', {
			modelName: name,
			list: personalPedsVisibleModels,
			index: Math.max(1, personalPedsVisibleModels.indexOf(name) + 1),
			menu: 15
		});
		document.querySelectorAll('#personal-peds-list .object').forEach(e => {
			e.className = 'object';
		});
		selected.className = 'object selected';
	} else {
		document.querySelector('#spawn-menu').style.display = 'flex';
	}
}

function populatePersonalPedsList(filter) {
	var list = document.getElementById('personal-peds-list');
	var favsOnly = document.getElementById('favourite-peds-personal').hasAttribute('data-active');
	var selected = null;
	personalPedsVisibleModels = [];
	list.innerHTML = '';

	var hasFilter = filter && filter !== '';

	// Agrupar categorias por master
	var masterMap = {};
	var masterOrder = [];
	personalPeds.forEach(function(group) {
		var m = group.master || 'Outros';
		if (!masterMap[m]) {
			masterMap[m] = [];
			masterOrder.push(m);
		}
		masterMap[m].push(group);
	});

	masterOrder.sort(function(a, b) { return a.localeCompare(b, 'pt'); });

	masterOrder.forEach(function(masterName) {
		var groups = masterMap[masterName];
		var masterTotal = 0;

		var masterItemsEl = document.createElement('div');
		masterItemsEl.className = 'oyate-master-items' + (hasFilter ? ' open' : '');

		var sortedGroups = groups.slice().sort(function(a, b) {
			return a.category.localeCompare(b.category, 'pt');
		});

		sortedGroups.forEach(function(group) {
			var normalizedItems = group.items.map(function(item) {
				if (typeof item === 'string') {
					return { label: item, model: item };
				}
				return {
					label: item.label || item.model || '',
					model: item.model || item.label || ''
				};
			});

			var matches = normalizedItems.filter(function(item) {
				if (favsOnly && !favourites.peds[item.model]) return false;
				if (!hasFilter) return true;
				var label = (item.label || '').toLowerCase();
				var model = (item.model || '').toLowerCase();
				var search = filter.toLowerCase();
				return label.includes(search) || model.includes(search);
			}).slice().sort(function(a, b) {
				return a.label.localeCompare(b.label, 'pt');
			});
			if (matches.length === 0) return;

			masterTotal += matches.length;

			var header = document.createElement('div');
			header.className = 'oyate-category-header' + (hasFilter || favsOnly ? ' open' : '');
			header.innerHTML = '<span>' + group.category + ' (' + matches.length + ')</span><span class="oyate-toggle">▶</span>';

			var itemsContainer = document.createElement('div');
			itemsContainer.className = 'oyate-category-items' + (hasFilter || favsOnly ? ' open' : '');

			header.addEventListener('click', function() {
				var isOpen = itemsContainer.classList.contains('open');
				if (isOpen) {
					itemsContainer.classList.remove('open');
					header.classList.remove('open');
				} else {
					itemsContainer.classList.add('open');
					header.classList.add('open');
				}
			});

			matches.forEach(function(item) {
				personalPedsVisibleModels.push(item.model);
				var isFav = favourites.peds[item.model];
				var div = document.createElement('div');
				div.className = isFav ? 'object favourite' : 'object';
				div.setAttribute('data-model', item.model);
				div.setAttribute('data-favourite-type', 'peds');
				div.setAttribute('data-favourite-name', item.model);
				div.innerHTML = item.label;
				if (currentPreviewMenu === 15 && currentPreviewModel === item.model) {
					div.className += ' selected';
					selected = div;
				}
				div.addEventListener('click', function(event) {
					closePersonalPedsMenu(this);
				});
				if (isFav) {
					div.addEventListener('contextmenu', favouriteOnClick);
				} else {
					div.addEventListener('contextmenu', nonFavouriteOnClick);
				}
				itemsContainer.appendChild(div);
			});

			masterItemsEl.appendChild(header);
			masterItemsEl.appendChild(itemsContainer);
		});

		if (masterTotal === 0) return;

		var masterHeader = document.createElement('div');
		masterHeader.className = 'oyate-master-header' + (hasFilter ? ' open' : '');
		masterHeader.innerHTML = '<span>' + masterName + ' (' + masterTotal + ')</span><span class="oyate-toggle">▶</span>';

		masterHeader.addEventListener('click', function() {
			var isOpen = masterItemsEl.classList.contains('open');
			if (isOpen) {
				masterItemsEl.classList.remove('open');
				masterHeader.classList.remove('open');
			} else {
				masterItemsEl.classList.add('open');
				masterHeader.classList.add('open');
			}
		});

		list.appendChild(masterHeader);
		list.appendChild(masterItemsEl);
	});

	if (selected) {
		selected.scrollIntoView({ block: 'center' });
	}
}

function closePropsetMenu(selected) {
	document.querySelector('#propset-menu').style.display = 'none';

	if (selected) {
		var name = selected.getAttribute('data-model');

		sendMessage('closePropsetMenu', {
			modelName: name,
			list: propsetVisibleModels,
			index: Math.max(1, propsetVisibleModels.indexOf(name) + 1),
			menu: 3
		});

		document.querySelectorAll('#propset-list .object').forEach(e => {
			if (favourites.propsets[e.getAttribute('data-model')]) {
				e.className = 'object favourite';
			} else {
				e.className = 'object';
			}
		});
		selected.className = 'object selected';
	} else {
		document.querySelector('#spawn-menu').style.display = 'flex';
		lastSpawnMenu = -1;
	}
}

function closePickupMenu(selected) {
	document.querySelector('#pickup-menu').style.display = 'none';

	if (selected) {
		var name = selected.getAttribute('data-model');

		sendMessage('closePickupMenu', {
			modelName: name
		});

		document.querySelectorAll('#pickup-list .object').forEach(e => {
			if (favourites.pickups[e.getAttribute('data-model')]) {
				e.className = 'object favourite';
			} else {
				e.className = 'object';
			}
		});
		selected.className = 'object selected';
	} else {
		document.querySelector('#spawn-menu').style.display = 'flex';
		lastSpawnMenu = -1;
	}
}

function performScenario(scenario) {
	document.querySelectorAll('#scenario-list .object').forEach(e => {
		if (favourites.scenarios[e.getAttribute('data-scenario')]) {
			e.className = 'object favourite';
		} else {
			e.className = 'object';
		}
	});
	scenario.className = 'object selected';

	sendMessage('performScenario', {
		handle: currentEntity(),
		scenario: scenario.getAttribute('data-scenario')
	});
}

function giveWeapon(weapon) {
	sendMessage('giveWeapon', {
		handle: currentEntity(),
		weapon: weapon.getAttribute('data-model')
	});
}

function playAnimation(animation) {
	document.querySelectorAll('#animation-list .object').forEach(e => {
		if (favourites.animations[e.getAttribute('data-dict') + ': ' + e.getAttribute('data-name')]) {
			e.className = 'object favourite';
		} else {
			e.className = 'object';
		}
	});
	animation.className = 'object selected';

	sendMessage('playAnimation', {
		handle: currentEntity(),
		dict: animation.getAttribute('data-dict'),
		name: animation.getAttribute('data-name'),
		blendInSpeed: parseFloat(document.querySelector('#animation-blend-in-speed').value),
		blendOutSpeed: parseFloat(document.querySelector('#animation-blend-out-speed').value),
		duration: parseInt(document.querySelector('#animation-duration').value),
		flag: parseInt(document.querySelector('#animation-flag').value),
		playbackRate: parseFloat(document.querySelector('#animation-playback-rate').value)
	});
}

function setWalkStyle(selected) {
	sendMessage('setWalkStyle', {
		handle: currentEntity(),
		base: selected.getAttribute('data-base'),
		style: selected.getAttribute('data-style')
	});

	document.querySelectorAll('#walk-style-list .object').forEach(e => {
		if (favourites.walkStyles[e.getAttribute('data-base') + ': ' + e.getAttribute('data-style')]) {
			e.className = 'object favourite';
		} else {
			e.className = 'object';
		}
	});
	selected.className = 'object selected';
}

function favouriteOnClick(event) {
	removeFavourite(this);
}

function nonFavouriteOnClick(event) {
	addFavourite(this);
}

function addFavourite(selected) {
	var type = selected.getAttribute('data-favourite-type');
	var name = selected.getAttribute('data-favourite-name');

	favourites[type][name] = true;

	sendMessage('saveFavourites', {
		favourites: favourites
	});

	selected.className = 'object favourite';
	selected.removeEventListener('contextmenu', nonFavouriteOnClick);
	selected.addEventListener('contextmenu', favouriteOnClick);
}

function removeFavourite(selected) {
	var type = selected.getAttribute('data-favourite-type');
	var name = selected.getAttribute('data-favourite-name');

	delete favourites[type][name];

	sendMessage('saveFavourites', {
		favourites: favourites
	});

	selected.className = 'object';
	selected.removeEventListener('contextmenu', favouriteOnClick);
	selected.addEventListener('contextmenu', nonFavouriteOnClick);
}

function populatePedList(filter) {
	var pedList = document.getElementById('ped-list');
	var favsOnly = document.getElementById('favourite-peds').hasAttribute('data-active');
	var _cacheKey = (filter || '') + '|' + (favsOnly ? '1' : '0');
	if (_cacheKey === pedListCacheKey && pedList.children.length > 0) {
		return;
	}
	pedListCacheKey = _cacheKey;
	pedVisibleModels = [];
	var selected = null;

	pedList.innerHTML = '';

	peds.forEach(name => {
		var isFav = favourites.peds[name];

		if (favsOnly && !isFav) {
			return;
		}

		if (!filter || filter == '' || name.toLowerCase().includes(filter.toLowerCase())) {
			pedVisibleModels.push(name);
			var div = document.createElement('div');

			if (isFav) {
				div.className = 'object favourite';
			} else {
				div.className = 'object';
			}

			div.setAttribute('data-model', name);
			div.setAttribute('data-favourite-type', 'peds');
			div.setAttribute('data-favourite-name', name);

			div.innerHTML = name;

			if (currentPreviewMenu === 0 && currentPreviewModel === name) {
				div.className += ' selected';
				selected = div;
			}

			div.addEventListener('click', function(event) {
				closePedMenu(this);
			});

			if (isFav) {
				div.addEventListener('contextmenu', favouriteOnClick);
			} else {
				div.addEventListener('contextmenu', nonFavouriteOnClick);
			}

			pedList.appendChild(div);
		}
	});

	if (selected) {
		selected.scrollIntoView({ block: 'center' });
	}
}

function setPlayerModel(modelName) {
	sendMessage('setPlayerModel', {
		modelName: modelName
	}).then(resp => resp.json()).then(resp => {
		document.getElementById('properties-menu-entity-id').setAttribute('data-handle', resp.handle);
		clearInterval(propertiesMenuUpdate);
		propertiesMenuUpdate = setInterval(function() {
			sendUpdatePropertiesMenuMessage(resp.handle, false);
		}, 500);
	});
}

function populatePlayerModelList(filter) {
	var pedList = document.getElementById('player-model-list');
	var favsOnly = document.getElementById('favourite-player-models').hasAttribute('data-active');

	pedList.innerHTML = '';

	peds.forEach(name => {
		var isFav = favourites.playerModels[name];

		if (favsOnly && !isFav) {
			return;
		}

		if (!filter || filter == '' || name.toLowerCase().includes(filter.toLowerCase())) {
			var div = document.createElement('div');

			if (isFav) {
				div.className = 'object favourite';
			} else {
				div.className = 'object';
			}

			div.setAttribute('data-model', name);
			div.setAttribute('data-favourite-type', 'playerModels');
			div.setAttribute('data-favourite-name', name);

			div.innerHTML = name;

			div.addEventListener('click', function(event) {
				pedList.querySelectorAll('.object').forEach(e => {
					if (favourites.playerModels[e.getAttribute('data-model')]) {
						e.className = 'object favourite';
					} else {
						e.className = 'object';
					}
				});
				this.className = 'object selected';
				setPlayerModel(this.getAttribute('data-model'));
			});

			if (isFav) {
				div.addEventListener('contextmenu', favouriteOnClick);
			} else {
				div.addEventListener('contextmenu', nonFavouriteOnClick);
			}

			pedList.appendChild(div);
		}
	});
}

function populateVehicleList(filter) {
	var vehicleList = document.getElementById('vehicle-list');
	var favsOnly = document.getElementById('favourite-vehicles').hasAttribute('data-active');
	var selected = null;
	vehicleVisibleModels = [];

	vehicleList.innerHTML = '';

	vehicles.forEach(name => {
		var isFav = favourites.vehicles[name];

		if (favsOnly && !isFav) {
			return;
		}

		if (!filter || filter == '' || name.toLowerCase().includes(filter.toLowerCase())) {
			vehicleVisibleModels.push(name);
			var div = document.createElement('div');

			if (isFav) {
				div.className = 'object favourite';
			} else {
				div.className = 'object';
			}

			div.setAttribute('data-model', name);
			div.setAttribute('data-favourite-type', 'vehicles');
			div.setAttribute('data-favourite-name', name);

			div.innerHTML = name;

			if (currentPreviewMenu === 1 && currentPreviewModel === name) {
				div.className += ' selected';
				selected = div;
			}

			div.addEventListener('click', function(event) {
				closeVehicleMenu(this);
			});

			if (isFav) {
				div.addEventListener('contextmenu', favouriteOnClick);
			} else {
				div.addEventListener('contextmenu', nonFavouriteOnClick);
			}

			vehicleList.appendChild(div);
		}
	});

	if (selected) {
		selected.scrollIntoView({ block: 'center' });
	}
}

function populateObjectList(filter) {
	var objectList = document.getElementById('object-list');
	var favsOnly = document.getElementById('favourite-objects').hasAttribute('data-active');
	var selected = null;
	objectVisibleModels = [];

	objectList.innerHTML = '';

	objects.forEach(name => {
		var isFav = favourites.objects[name];

		if (favsOnly && !isFav) {
			return;
		}

		if (!filter || filter == '' || name.toLowerCase().includes(filter.toLowerCase())) {
			objectVisibleModels.push(name);
			var div = document.createElement('div');

			if (isFav) {
				div.className = 'object favourite';
			} else {
				div.className = 'object';
			}

			div.setAttribute('data-model', name);
			div.setAttribute('data-favourite-type', 'objects');
			div.setAttribute('data-favourite-name', name);

			div.innerHTML = name;

			if (currentPreviewMenu === 2 && currentPreviewModel === name) {
				div.className += ' selected';
				selected = div;
			}

			div.addEventListener('click', function(event) {
				closeObjectMenu(this);
			});

			if (isFav) {
				div.addEventListener('contextmenu', favouriteOnClick);
			} else {
				div.addEventListener('contextmenu', nonFavouriteOnClick);
			}

			objectList.appendChild(div);
		}
	});

	if (selected) {
		selected.scrollIntoView({ block: 'center' });
	}
}

// Regras de categorização dinâmica para os ~16k objetos.
// Cada regra tem: master, category, e test(name) → boolean.
// A ORDEM IMPORTA: a primeira regra que retornar true vence.
var objectCategoryRules = [
	// ── MULTIPLAYER ─────────────────────────────────────────────────────────
	{ master: "🌐 Multiplayer", category: "Multiplayer Props",
		test: function(n) { return /^mp0/.test(n); } },

	// ── ARMAS & COMBATE ──────────────────────────────────────────────────────
	{ master: "🔫 Armas & Combate", category: "Armas",
		test: function(n) { return n.startsWith('w_'); } },
	{ master: "🔫 Armas & Combate", category: "Munição & Explosivos",
		test: function(n) { return n.startsWith('s_ammo') || n.startsWith('ammo_') || n.includes('grenade') || n.includes('dynamite') || n.includes('molotov'); } },

	// ── GORE & CADÁVERES ─────────────────────────────────────────────────────
	{ master: "💀 Gore & Cadáveres", category: "Partes do Corpo",
		test: function(n) { return /arm(left|right|male|female)|legmale|legleft|legright|s_head|decapitat|headsever|murdervic|s_blood|s_armleft|s_armright/.test(n); } },
	{ master: "💀 Gore & Cadáveres", category: "Ossos & Crânios",
		test: function(n) { return n.includes('skull') || n.includes('skeleton') || n.includes('bone') || n.includes('skel'); } },
	{ master: "💀 Gore & Cadáveres", category: "Peles & Troféus de Caça",
		test: function(n) { return n.includes('skin') || n.includes('pelt') || n.includes('trophy') || n.includes('alligatorlimb') || n.includes('claws'); } },

	// ── NATUREZA ─────────────────────────────────────────────────────────────
	{ master: "🌿 Natureza", category: "Árvores",
		test: function(n) { return n.startsWith('p_tree') || n.startsWith('rdr_tree') || n.includes('treefall'); } },
	{ master: "🌿 Natureza", category: "Arbustos & Fetos",
		test: function(n) { return n.startsWith('rdr_bush') || n.startsWith('p_bush') || n.includes('fern') || n.includes('junip') || n.includes('arec'); } },
	{ master: "🌿 Natureza", category: "Plantas & Ervas",
		test: function(n) { return n.endsWith('_p') || n.includes('herb') || n.includes('flower') || n.includes('mushroom') || n.includes('tobacco') || n.includes('ginseng') || n.includes('yarrow') || n.includes('weed') || n.includes('sage') || n.includes('mint') || n.includes('berry') || n.includes('s_inv_') && !n.includes('s_inv_ammo'); } },
	{ master: "🌿 Natureza", category: "Rochas & Pedras",
		test: function(n) { return n.includes('_rock') || n.startsWith('alp_') || n.startsWith('bgv_') || n.startsWith('dak_') || n.includes('stone') || n.includes('boulder') || n.includes('scree'); } },
	{ master: "🌿 Natureza", category: "Troncos & Madeira Morta",
		test: function(n) { return n.includes('p_tree_log') || n.includes('log_') || n.includes('stump'); } },
	{ master: "🌿 Natureza", category: "Grama & Chão Natural",
		test: function(n) { return n.startsWith('rdr_grass') || n.startsWith('p_grass') || n.includes('dirtpile') || n.includes('dirt_pile') || n.includes('mud'); } },

	// ── CONSTRUÇÃO ───────────────────────────────────────────────────────────
	{ master: "🏗️ Construção", category: "Portas",
		test: function(n) { return n.startsWith('p_door') || (n.includes('door') && !n.includes('outdoor')); } },
	{ master: "🏗️ Construção", category: "Janelas",
		test: function(n) { return n.startsWith('p_win') || (n.includes('window') && !n.includes('windowsill')); } },
	{ master: "🏗️ Construção", category: "Cercas & Portões",
		test: function(n) { return n.startsWith('p_fence') || n.startsWith('p_gate') || n.includes('fencetall') || n.includes('_fence') || n.includes('_gate'); } },
	{ master: "🏗️ Construção", category: "Paredes & Estruturas",
		test: function(n) { return n.startsWith('p_sto_') || n.includes('_wall') || n.includes('_arch') || n.includes('_column') || n.includes('plank') || n.includes('_boards') || n.includes('scaffold'); } },
	{ master: "🏗️ Construção", category: "Trilhos & Varandas",
		test: function(n) { return n.includes('railing') || n.includes('_rail') || n.includes('balcony') || n.includes('porch'); } },
	{ master: "🏗️ Construção", category: "Telhados & Chaminés",
		test: function(n) { return n.includes('roof') || n.includes('chimney') || n.includes('_shingle'); } },

	// ── MOBÍLIA ──────────────────────────────────────────────────────────────
	{ master: "🏠 Mobília & Interior", category: "Camas & Dormitório",
		test: function(n) { return n.includes('bed') || n.includes('mattress') || n.includes('bedroll') || n.includes('pillow') || n.includes('blanket'); } },
	{ master: "🏠 Mobília & Interior", category: "Cadeiras, Bancos & Sofás",
		test: function(n) { return n.includes('chair') || n.includes('bench') || n.includes('stool') || n.includes('sofa') || n.includes('couch'); } },
	{ master: "🏠 Mobília & Interior", category: "Mesas",
		test: function(n) { return /p_.*table|s_.*table|_table/.test(n) && !n.includes('tableware') && !n.includes('stable'); } },
	{ master: "🏠 Mobília & Interior", category: "Armários, Prateleiras & Gavetas",
		test: function(n) { return n.includes('cabinet') || n.includes('armoir') || n.includes('shelf') || n.includes('drawer') || n.includes('dresser') || n.includes('wardrobe') || n.includes('p_int_') || n.includes('commode'); } },
	{ master: "🏠 Mobília & Interior", category: "Baús & Cofres",
		test: function(n) { return n.includes('chest') || n.includes('_safe') || n.includes('strongbox') || n.includes('lockbox') || n.includes('vault'); } },
	{ master: "🏠 Mobília & Interior", category: "Decoração & Quadros",
		test: function(n) { return n.includes('_mirror') || n.includes('picture') || n.includes('_frame') || n.includes('_clock') || n.includes('_vase') || n.includes('_rug') || n.includes('_carpet') || n.includes('curtain') || n.includes('candelabra'); } },

	// ── COZINHA & ALIMENTOS ──────────────────────────────────────────────────
	{ master: "🍳 Cozinha & Alimentos", category: "Utensílios de Cozinha",
		test: function(n) { return n.includes('pot') || n.includes('kettle') || n.includes('pan') || n.includes('skillet') || n.includes('ladle') || n.includes('_stove') || n.includes('boiler') || n.includes('oven') || n.includes('butcher'); } },
	{ master: "🍳 Cozinha & Alimentos", category: "Louça & Talheres",
		test: function(n) { return n.includes('plate') || n.includes('bowl') || n.includes('cup') || n.includes('mug') || n.includes('glass') && !n.includes('_glass_') || n.includes('cutlery') || n.includes('fork') || n.includes('spoon') || n.includes('knife') || n.includes('pitcher') || n.includes('tray') || n.includes('tableware'); } },
	{ master: "🍳 Cozinha & Alimentos", category: "Garrafas & Jarros",
		test: function(n) { return n.includes('bottle') || n.includes('_jar') || n.includes('jug') || n.includes('flask') || n.includes('canteen'); } },
	{ master: "🍳 Cozinha & Alimentos", category: "Alimentos",
		test: function(n) { return n.includes('bread') || n.includes('meat') || n.includes('cheese') || n.includes('apple') || n.includes('orange') || n.includes('chicken') || n.includes('sausage') || n.includes('egg') || n.includes('bacon') || n.includes('corn') || n.includes('potato') || n.includes('carrot') || n.includes('fish') && n.startsWith('s_'); } },

	// ── ACAMPAMENTO & FOGO ───────────────────────────────────────────────────
	{ master: "🔥 Acampamento & Fogo", category: "Fogueiras",
		test: function(n) { return n.includes('campfire') || n.includes('fireplace') || n.includes('firelog') || n.includes('cookfire') || n.includes('firesign'); } },
	{ master: "🔥 Acampamento & Fogo", category: "Tendas & Abrigos",
		test: function(n) { return n.includes('tent') || n.includes('_tarp') || n.includes('canopy') || n.includes('_tipi') || n.includes('wikup') || n.includes('_lean') || n.includes('cnopy'); } },
	{ master: "🔥 Acampamento & Fogo", category: "Equipamento de Acampamento",
		test: function(n) { return n.startsWith('p_camp') || n.includes('bedroll') && !n.includes('mattress') || n.includes('saddlebag') || n.includes('p_ropecoil') || n.includes('p_lantern') || n.includes('_waterskin') || n.includes('canoe') || n.includes('p_trap') || n.includes('fishingrod'); } },

	// ── ILUMINAÇÃO ───────────────────────────────────────────────────────────
	{ master: "💡 Iluminação", category: "Lanternas & Lampiões",
		test: function(n) { return n.includes('lantern') || n.includes('lampstreet') || n.includes('lamp') || n.includes('lamppost') || n.includes('lampstand'); } },
	{ master: "💡 Iluminação", category: "Velas & Tochas",
		test: function(n) { return n.includes('candle') || n.includes('torch') || n.includes('candlestick'); } },

	// ── CONTÊINERES & CARGA ──────────────────────────────────────────────────
	{ master: "📦 Contêineres & Carga", category: "Barris",
		test: function(n) { return n.includes('barrel') || n.includes('keg') || n.includes('cask'); } },
	{ master: "📦 Contêineres & Carga", category: "Caixas & Engradados",
		test: function(n) { return n.startsWith('p_crd') || n.includes('crate') || n.includes('_box') || n.includes('_crate') || n.includes('ammobox') || n.includes('gunbox') || n.includes('p_int_') && n.includes('box'); } },
	{ master: "📦 Contêineres & Carga", category: "Sacos & Pacotes",
		test: function(n) { return n.includes('sack') || n.includes('_sack') || n.includes('_bag') || n.includes('_pack') || n.includes('bundle') || n.includes('package') || n.includes('cottanbale') || n.includes('haybale'); } },
	{ master: "📦 Contêineres & Carga", category: "Baús & Caixas de Dinheiro",
		test: function(n) { return n.includes('moneybag') || n.includes('bill_stack') || n.includes('coin') || n.includes('_loot') || n.includes('moneycase'); } },

	// ── FERRAMENTAS & TRABALHO ───────────────────────────────────────────────
	{ master: "🔨 Ferramentas & Trabalho", category: "Ferramentas",
		test: function(n) { return n.includes('_tool') || n.includes('shovel') || n.includes('pickaxe') || n.includes('axe') || n.includes('hammer') || n.includes('saw') || n.includes('drill') || n.includes('wrench') || n.includes('workbench') || n.includes('anvil') || n.includes('bellows'); } },
	{ master: "🔨 Ferramentas & Trabalho", category: "Fazenda & Ranch",
		test: function(n) { return n.includes('haypile') || n.includes('_hay') || n.includes('feedbag') || n.includes('watertrough') || n.includes('p_wheelbarrow') || n.includes('harness') || n.includes('saddle') && !n.includes('saddlebag') || n.includes('hitchingpost') || n.includes('corral') || n.includes('windmill') || n.includes('cowbell'); } },
	{ master: "🔨 Ferramentas & Trabalho", category: "Mineiro & Indústria",
		test: function(n) { return n.includes('minecar') || n.includes('minecart') || n.includes('coalchute') || n.includes('_coal') || n.includes('pickax') || n.includes('_crane') || n.includes('_pulley') || n.includes('pumpjack') || n.includes('drilling') || n.includes('factory'); } },
	{ master: "🔨 Ferramentas & Trabalho", category: "Médico",
		test: function(n) { return n.includes('doctor') || n.includes('medical') || n.includes('medicine') || n.includes('syringe') || n.includes('bandage') || n.includes('hospital') || n.includes('clinic') || n.includes('p_doc_'); } },
	{ master: "🔨 Ferramentas & Trabalho", category: "Lei & Punição",
		test: function(n) { return n.includes('badge') || n.includes('prison') || n.includes('gallows') || n.includes('jail') || n.includes('wanted') || n.includes('noose') || n.includes('scaffold') && n.includes('gallow') || n.includes('shackle') || n.includes('handcuff'); } },

	// ── TRANSPORTE ───────────────────────────────────────────────────────────
	{ master: "🚗 Transporte", category: "Carroças & Vagões",
		test: function(n) { return n.startsWith('p_veh') || n.includes('wagon') || n.includes('_cart') || n.includes('boxcar') || n.includes('carriage') || n.includes('_wheel') || n.includes('wagonwheel'); } },
	{ master: "🚗 Transporte", category: "Trens & Trilhos",
		test: function(n) { return n.includes('train') || n.includes('_rail') && !n.includes('railing') || n.includes('locomotive') || n.includes('_rail0'); } },
	{ master: "🚗 Transporte", category: "Barcos & Docas",
		test: function(n) { return n.includes('boat') || n.includes('dock') || n.includes('_pier') || n.includes('_jetty') || n.includes('canoe') || n.includes('raft') || n.includes('p_boat_'); } },

	// ── JOGOS & CASSINO ──────────────────────────────────────────────────────
	{ master: "🎲 Jogos & Cassino", category: "Fichas & Dominó",
		test: function(n) { return n.includes('chip') || n.includes('domino') || n.includes('p_chips'); } },
	{ master: "🎲 Jogos & Cassino", category: "Cartas & Mesas de Jogo",
		test: function(n) { return n.includes('playing') && n.includes('card') || n.includes('poker') || n.includes('cards') || n.includes('p_domino_table'); } },

	// ── RELIGIÃO & CEMITÉRIO ─────────────────────────────────────────────────
	{ master: "⛪ Religião & Morte", category: "Lápides & Cemitério",
		test: function(n) { return n.includes('grave') || n.includes('headstone') || n.includes('gravestone') || n.includes('tombstone') || n.includes('cemetery'); } },
	{ master: "⛪ Religião & Morte", category: "Cruz, Sino & Igreja",
		test: function(n) { return n.includes('cross') || n.includes('_bell') || n.includes('church') || n.includes('chapel') || n.includes('coffin') || n.includes('casket'); } },
	{ master: "⛪ Religião & Morte", category: "Bruxaria & Ritual",
		test: function(n) { return n.includes('witch') || n.includes('ritual') || n.includes('voodoo') || n.includes('occult') || n.includes('skull') && n.includes('altar'); } },

	// ── NATIVO ───────────────────────────────────────────────────────────────
	{ master: "🪶 Nativo", category: "Decoração Nativa",
		test: function(n) { return n.includes('dreamcatch') || n.includes('feather') && !n.includes('weather') || n.includes('_native') || n.includes('wap_') || n.includes('wikup') || n.includes('_totem') || n.includes('aur_'); } },
	{ master: "🪶 Nativo", category: "Armas Nativas",
		test: function(n) { return n.includes('w_me_') && (n.includes('tomahawk') || n.includes('hatchet') || n.includes('bow')); } },

	// ── DECORAÇÃO URBANA & SINALIZAÇÃO ───────────────────────────────────────
	{ master: "🏙️ Decoração & Sinalização", category: "Placas & Sinais",
		test: function(n) { return n.startsWith('p_sign') || n.includes('_sign') && !n.includes('design') || n.includes('signpost') || n.includes('sandwichboard') || n.includes('newspaper') || n.includes('poster') || n.includes('bulletin'); } },
	{ master: "🏙️ Decoração & Sinalização", category: "Estátuas & Monumentos",
		test: function(n) { return n.includes('statue') || n.includes('monument') || n.includes('bust_') || n.includes('figurine'); } },
	{ master: "🏙️ Decoração & Sinalização", category: "Props de Cidade",
		test: function(n) { return n.startsWith('p_val_') || n.startsWith('p_rho_') || n.startsWith('p_stden') || n.startsWith('p_ann_') || n.startsWith('p_bla_') || n.startsWith('p_sha_') || n.startsWith('p_doc_') || n.startsWith('val_') || n.startsWith('rho_') || n.startsWith('ann_'); } },
	{ master: "🏙️ Decoração & Sinalização", category: "Torres & Poços d'Água",
		test: function(n) { return n.includes('watertower') || n.includes('waterwell') || n.includes('p_well') || n.includes('_tower'); } },

	// ── PROPS DE CENA & SCRIPT ───────────────────────────────────────────────
	{ master: "🎭 Props de Cena", category: "Cutscene",
		test: function(n) { return n.startsWith('p_cs_') || n.startsWith('s_cs_'); } },
	{ master: "🎭 Props de Cena", category: "Grupos & Script",
		test: function(n) { return n.startsWith('p_group') || n.startsWith('p_grp') || n.startsWith('prop_') || n.startsWith('p_gen_') || n.startsWith('p_mp_'); } },
	{ master: "🎭 Props de Cena", category: "Veículos de Cena",
		test: function(n) { return n.startsWith('p_veh_') && (n.includes('_cs_') || n.includes('_script')); } },

	// ── TÊXTEIS & VESTUÁRIO ──────────────────────────────────────────────────
	{ master: "🧵 Têxteis & Vestuário", category: "Roupas & Chapéus",
		test: function(n) { return n.includes('_hat') || n.includes('_coat') || n.includes('_shirt') || n.includes('_boot') || n.includes('_glove') || n.includes('clothing') || n.includes('p_clt_') || n.includes('animatablegloves'); } },
	{ master: "🧵 Têxteis & Vestuário", category: "Tapetes & Cortinas",
		test: function(n) { return n.includes('_rug') || n.includes('_carpet') || n.includes('curtain') || n.includes('drape') || n.includes('tapestry'); } },
	{ master: "🧵 Têxteis & Vestuário", category: "Malas & Bolsas",
		test: function(n) { return n.includes('suitcase') || n.includes('luggage') || n.includes('briefcase') || n.includes('purse') || n.includes('_pouch'); } },

	// ── OUTROS ───────────────────────────────────────────────────────────────
	{ master: "🎲 Outros", category: "Props Diversos",
		test: function(n) { return true; } } // fallback — captura tudo que restou
];

function populateObjectListCategorized(filter) {
	var list = document.getElementById('object-list');
	var favsOnly = document.getElementById('favourite-objects').hasAttribute('data-active');
	var _cacheKey = (filter || '') + '|' + (favsOnly ? '1' : '0');
	if (_cacheKey === objectListCacheKey && list.children.length > 0) {
		return;
	}
	objectListCacheKey = _cacheKey;
	var selected = null;
	objectVisibleModels = [];
	list.innerHTML = '';

	var hasFilter = filter && filter !== '';
	var search = hasFilter ? filter.toLowerCase() : '';

	// Distribuir objetos nos buckets das regras
	var buckets = {};
	var bucketOrder = [];

	objects.forEach(function(name) {
		var isFav = favourites.objects[name];
		if (favsOnly && !isFav) return;
		if (hasFilter && !name.toLowerCase().includes(search)) return;

		for (var i = 0; i < objectCategoryRules.length; i++) {
			var rule = objectCategoryRules[i];
			if (rule.test(name)) {
				var key = rule.master + '||' + rule.category;
				if (!buckets[key]) {
					buckets[key] = { master: rule.master, category: rule.category, items: [] };
					bucketOrder.push(key);
				}
				buckets[key].items.push({ name: name, isFav: isFav });
				break;
			}
		}
	});

	// Agrupar buckets por master
	var masterMap = {};
	var masterOrder = [];
	bucketOrder.forEach(function(key) {
		var b = buckets[key];
		if (!masterMap[b.master]) {
			masterMap[b.master] = [];
			masterOrder.push(b.master);
		}
		masterMap[b.master].push(b);
	});

	masterOrder.forEach(function(masterName) {
		var groups = masterMap[masterName];
		var masterTotal = 0;

		var masterItemsEl = document.createElement('div');
		masterItemsEl.className = 'oyate-master-items' + (hasFilter ? ' open' : '');

		groups.forEach(function(group) {
			if (group.items.length === 0) return;
			masterTotal += group.items.length;

			var header = document.createElement('div');
			header.className = 'oyate-category-header' + (hasFilter ? ' open' : '');
			header.innerHTML = '<span>' + group.category + ' (' + group.items.length + ')</span><span class="oyate-toggle">▶</span>';

			var itemsContainer = document.createElement('div');
			itemsContainer.className = 'oyate-category-items' + (hasFilter ? ' open' : '');

			header.addEventListener('click', function() {
				var isOpen = itemsContainer.classList.contains('open');
				itemsContainer.classList.toggle('open', !isOpen);
				header.classList.toggle('open', !isOpen);
			});

			group.items.forEach(function(item) {
				objectVisibleModels.push(item.name);
				var div = document.createElement('div');
				div.className = item.isFav ? 'object favourite' : 'object';
				div.setAttribute('data-model', item.name);
				div.setAttribute('data-favourite-type', 'objects');
				div.setAttribute('data-favourite-name', item.name);
				div.innerHTML = item.name;
				if (currentPreviewMenu === 2 && currentPreviewModel === item.name) {
					div.className += ' selected';
					selected = div;
				}
				div.addEventListener('click', function(event) { closeObjectMenu(this); });
				if (item.isFav) {
					div.addEventListener('contextmenu', favouriteOnClick);
				} else {
					div.addEventListener('contextmenu', nonFavouriteOnClick);
				}
				itemsContainer.appendChild(div);
			});

			masterItemsEl.appendChild(header);
			masterItemsEl.appendChild(itemsContainer);
		});

		if (masterTotal === 0) return;

		var masterHeader = document.createElement('div');
		masterHeader.className = 'oyate-master-header' + (hasFilter ? ' open' : '');
		masterHeader.innerHTML = '<span>' + masterName + ' (' + masterTotal + ')</span><span class="oyate-toggle">▶</span>';

		masterHeader.addEventListener('click', function() {
			var isOpen = masterItemsEl.classList.contains('open');
			masterItemsEl.classList.toggle('open', !isOpen);
			masterHeader.classList.toggle('open', !isOpen);
		});

		list.appendChild(masterHeader);
		list.appendChild(masterItemsEl);
	});

	if (selected) {
		selected.scrollIntoView({ block: 'center' });
	}
}

function populateScenarioList(filter) {
	var scenarioList = document.getElementById('scenario-list');
	var favsOnly = document.getElementById('favourite-scenarios').hasAttribute('data-active');
	var _cacheKey = (filter || '') + '|' + (favsOnly ? '1' : '0');
	if (_cacheKey === scenarioListCacheKey && scenarioList.children.length > 0) {
		return;
	}
	scenarioListCacheKey = _cacheKey;

	scenarioList.innerHTML = '';

	scenarios.forEach(scenario => {
		var isFav = favourites.scenarios[scenario];

		if (favsOnly && !isFav) {
			return;
		}

		if (!filter || filter == '' || scenario.toLowerCase().includes(filter.toLowerCase())) {
			var div = document.createElement('div');

			if (isFav) {
				div.className = 'object favourite';
			} else {
				div.className = 'object';
			}

			div.setAttribute('data-scenario', scenario);
			div.setAttribute('data-favourite-type', 'scenarios');
			div.setAttribute('data-favourite-name', scenario);

			div.innerHTML = scenario;

			div.addEventListener('click', function(event) {
				performScenario(this);
			});

			if (isFav) {
				div.addEventListener('contextmenu', favouriteOnClick);
			} else {
				div.addEventListener('contextmenu', nonFavouriteOnClick);
			}

			scenarioList.appendChild(div);
		}
	});
}

function populateWeaponList(filter) {
	var weaponList = document.getElementById('weapon-list');
	var favsOnly = document.getElementById('favourite-weapons').hasAttribute('data-active');

	weaponList.innerHTML = '';

	weapons.forEach(weapon => {
		var isFav = favourites.weapons[weapon];

		if (favsOnly && !isFav) {
			return;
		}

		if (!filter || filter == '' || weapon.toLowerCase().includes(filter.toLowerCase())) {
			var div = document.createElement('div');

			if (isFav) {
				div.className = 'object favourite';
			} else {
				div.className = 'object';
			}

			div.setAttribute('data-model', weapon);
			div.setAttribute('data-favourite-type', 'weapons');
			div.setAttribute('data-favourite-name', weapon);

			div.innerHTML = weapon;

			div.addEventListener('click', function(event) {
				giveWeapon(this);
			});

			if (isFav) {
				div.addEventListener('contextmenu', favouriteOnClick);
			} else {
				div.addEventListener('contextmenu', nonFavouriteOnClick);
			}

			weaponList.appendChild(div);
		}
	});
}

function populateAnimationList(filter) {
	var animationList = document.getElementById('animation-list');
	var animationMaxResults = parseInt(document.getElementById('animation-search-max-results').value);
	var favsOnly = document.getElementById('favourite-animations').hasAttribute('data-active');

	animationList.innerHTML = '';

	var results = [];

	Object.keys(animations).forEach(dict => {
		animations[dict].forEach(name => {
			var label = dict + ': ' + name;

			if (favsOnly && !favourites.animations[label]) {
				return;
			}

			if (!filter || filter == '' || label.toLowerCase().includes(filter.toLowerCase())) {
				results.push({
					label: label,
					dict: dict,
					name: name
				})
			}
		});
	});

	results.sort(function(a, b) {
		if (a.label < b.label) {
			return -1;
		}
		if (a.label > b.label) {
			return 1;
		}
		return 0;
	});

	document.getElementById('animation-search-total-results').innerHTML = results.length;

	for (var i = 0; i < results.length && i < animationMaxResults; ++i) {
		var isFav = favourites.animations[results[i].label];

		var div = document.createElement('div');

		if (isFav) {
			div.className = 'object favourite';
		} else {
			div.className = 'object';
		}

		div.setAttribute('data-dict', results[i].dict);
		div.setAttribute('data-name', results[i].name);
		div.setAttribute('data-favourite-type', 'animations');
		div.setAttribute('data-favourite-name', results[i].label);

		div.innerHTML = results[i].label;

		div.addEventListener('click', function() {
			playAnimation(this);
		});

		if (isFav) {
			div.addEventListener('contextmenu', favouriteOnClick);
		} else {
			div.addEventListener('contextmenu', nonFavouriteOnClick);
		}

		animationList.appendChild(div);
	}
}

function populatePropsetList(filter) {
	var propsetList = document.getElementById('propset-list');
	var favsOnly = document.getElementById('favourite-propsets').hasAttribute('data-active');
	var _cacheKey = (filter || '') + '|' + (favsOnly ? '1' : '0');
	if (_cacheKey === propsetListCacheKey && propsetList.children.length > 0) {
		return;
	}
	propsetListCacheKey = _cacheKey;
	var selected = null;
	propsetVisibleModels = [];

	propsetList.innerHTML = '';

	propsets.forEach(propset => {
		var isFav = favourites.propsets[propset];

		if (favsOnly && !isFav) {
			return;
		}

		if (!filter || filter == '' || propset.toLowerCase().includes(filter.toLowerCase())) {
			propsetVisibleModels.push(propset);
			var div = document.createElement('div');

			if (isFav) {
				div.className = 'object favourite';
			} else {
				div.className = 'object';
			}

			div.setAttribute('data-model', propset);
			div.setAttribute('data-favourite-type', 'propsets');
			div.setAttribute('data-favourite-name', propset);

			div.innerHTML = propset;

			if (currentPreviewMenu === 3 && currentPreviewModel === propset) {
				div.className += ' selected';
				selected = div;
			}

			div.addEventListener('click', function(event) {
				closePropsetMenu(this);
			});

			if (isFav) {
				div.addEventListener('contextmenu', favouriteOnClick);
			} else {
				div.addEventListener('contextmenu', nonFavouriteOnClick);
			}

			propsetList.appendChild(div);
		}
	});

	if (selected) {
		selected.scrollIntoView({ block: 'center' });
	}
}

function populatePickupList(filter) {
	var pickupList = document.getElementById('pickup-list');
	var favsOnly = document.getElementById('favourite-pickups').hasAttribute('data-active');

	pickupList.innerHTML = '';

	pickups.forEach(pickup => {
		var isFav = favourites.pickups[pickup];

		if (favsOnly && !isFav) {
			return;
		}

		if (!filter || filter == '' || pickup.toLowerCase().includes(filter.toLowerCase())) {
			var div = document.createElement('div');

			if (isFav) {
				div.className = 'object favourite';
			} else {
				div.className = 'object';
			}

			div.setAttribute('data-model', pickup);
			div.setAttribute('data-favourite-type', 'pickups');
			div.setAttribute('data-favourite-name', pickup);

			div.innerHTML = pickup;

			div.addEventListener('click', function(event) {
				closePickupMenu(this);
			});

			if (isFav) {
				div.addEventListener('contextmenu', favouriteOnClick);
			} else {
				div.addEventListener('contextmenu', nonFavouriteOnClick);
			}

			pickupList.appendChild(div);
		}
	});
}

function populateBoneNameList() {
	var boneList = document.getElementById('attachment-bone-name');

	boneList.innerHTML = '<option></option>';

	bones.forEach(bone => {
		var option = document.createElement('option');
		option.value = bone;
		option.innerHTML = bone;
		boneList.appendChild(option);
	});
}

function populateWalkStyleList(filter) {
	var walkStyleList = document.getElementById('walk-style-list');
	var favsOnly = document.getElementById('favourite-walk-styles').hasAttribute('data-active');

	walkStyleList.innerHTML = '';

	walkStyleBases.forEach(base => {
		walkStyles.forEach(style => {
			var name = base + ': ' + style;
			var isFav = favourites.walkStyles[name];

			if (favsOnly && !isFav) {
				return;
			}

			if (!filter || filter == '' || name.toLowerCase().includes(filter.toLowerCase())) {
				var div = document.createElement('div');

				if (isFav) {
					div.className = 'object favourite';
				} else {
					div.className = 'object';
				}

				div.setAttribute('data-base', base);
				div.setAttribute('data-style', style);
				div.setAttribute('data-favourite-type', 'walkStyles');
				div.setAttribute('data-favourite-name', name);

				div.innerHTML = name;

				div.addEventListener('click', function(event) {
					setWalkStyle(this);
				});

				if (isFav) {
					div.addEventListener('contextmenu', favouriteOnClick);
				} else {
					div.addEventListener('contextmenu', nonFavouriteOnClick);
				}

				walkStyleList.appendChild(div);
			}
		});
	});
}

function deleteEntity(object) {
	var handle = object.getAttribute('data-handle');

	object.remove();

	sendMessage('deleteEntity', {
		handle: parseInt(handle)
	}).then(resp => resp.json()).then(resp => openDatabase(resp));
}

function entityDisplayName(entity, props) {
	if (props.exists) {
		if (props.netId) {
			if (props.playerName) {
				return `${entity.toString()} [${props.netId.toString()}] ${props.name} (${props.playerName})`;
			} else {
				return `${entity.toString()} [${props.netId.toString()}] ${props.name}`;
			}
		} else {
			return `${entity.toString()} ${props.name}`
		}
	} else {
		return `(Invalid) ${entity.toString()} ${props.name}`
	}
}

function renderDatabase() {
	var objectList = document.querySelector('#object-database-list');
	var filter = document.getElementById('object-database-filter').value.toLowerCase();
	var keys = Object.keys(currentDatabase);

	var totalEntities = keys.length;
	var totalPeds = 0;
	var totalVehicles = 0;
	var totalObjects = 0;
	var totalNetworked = 0;

	objectList.innerHTML = '';

	keys.sort(function(a, b) {
		var aData = currentDatabase[a];
		var bData = currentDatabase[b];

		if (databaseRecentFirst) {
			return (bData.addedAt || 0) - (aData.addedAt || 0);
		}

		return entityDisplayName(parseInt(a), aData).localeCompare(entityDisplayName(parseInt(b), bData));
	});

	keys.forEach(function(handle) {
		var entityId = parseInt(handle);
		var props = currentDatabase[handle];
		var label = entityDisplayName(entityId, props);

		switch (props.type) {
			case 1:
				++totalPeds;
				break;
			case 2:
				++totalVehicles;
				break;
			case 3:
				++totalObjects;
				break;
		}

		if (props.netId) {
			++totalNetworked;
		}

		if (filter && !label.toLowerCase().includes(filter)) {
			return;
		}

		var div = document.createElement('div');

		if (props.isSelf) {
			div.className = 'object self';
		} else if (!props.exists) {
			div.className = 'object invalid';
		} else {
			div.className = 'object'
		}

		div.innerHTML = label;

		div.setAttribute('data-handle', handle);
		div.addEventListener('click', function(event) {
			document.querySelector('#object-database').style.display = 'none';
			sendMessage('openPropertiesMenuForEntity', {
				entity: entityId
			});
		});
		div.addEventListener('contextmenu', function(event) {
			deleteEntity(this);
		});
		objectList.appendChild(div);
	});

	document.getElementById('object-database-total-entities').innerHTML = keys.length;
	document.getElementById('object-database-total-peds').innerHTML = totalPeds;
	document.getElementById('object-database-total-vehicles').innerHTML = totalVehicles;
	document.getElementById('object-database-total-objects').innerHTML = totalObjects;
	document.getElementById('object-database-total-networked').innerHTML = totalNetworked;
}

function openDatabase(data) {
	currentDatabase = JSON.parse(data.database);
	renderDatabase();

	document.querySelector('#object-database').style.display = 'flex';
}

function closeDatabase() {
	document.querySelector('#object-database').style.display = 'none';

	sendMessage('closeDatabase', {});
}

function removeAllFromDatabase() {
	sendMessage('removeAllFromDatabase', {});

	closeDatabase()
}

function setFieldIfInactive(id, value) {
	var field = document.getElementById(id);

	if (document.activeElement != field) {
		field.value = value;
	}
}

function updatePropertiesMenu(data) {
	var properties = JSON.parse(data.properties);

	document.querySelectorAll('.player-property').forEach(e => e.style.display = 'none');
	document.querySelectorAll('.ped-property').forEach(e => e.style.display = 'none');
	document.querySelectorAll('.vehicle-property').forEach(e => e.style.display = 'none');
	document.querySelectorAll('.object-property').forEach(e => e.style.display = 'none');

	switch (properties.type) {
		case 1:
			document.querySelector('#properties-menu-entity-type').innerHTML = 'ped';
			document.querySelectorAll('.ped-property').forEach(e => e.style.display = 'block');
			break;
		case 2:
			document.querySelector('#properties-menu-entity-type').innerHTML = 'veiculo';
			document.querySelectorAll('.vehicle-property').forEach(e => e.style.display = 'block');
			break;
		case 3:
			document.querySelector('#properties-menu-entity-type').innerHTML = 'objeto';
			document.querySelectorAll('.object-property').forEach(e => e.style.display = 'block');
			break;
		case 4:
			document.querySelector('#properties-menu-entity-type').innerHTML = 'propset';
			break;
		case 5:
			document.querySelector('#properties-menu-entity-type').innerHTML = 'coleta';
			break;
		default:
			document.querySelector('#properties-menu-entity-type').innerHTML = 'entidade';
			break;
	}

	if (properties.playerName) {
		document.querySelectorAll('.player-property').forEach(e => e.style.display = 'block');
	}

	var entity = document.querySelector('#properties-menu-entity-id');
	entity.setAttribute('data-handle', data.entity);
	if (properties.netId) {
		if (properties.playerName) {
			entity.innerHTML = data.entity.toString() + ' [' + properties.netId.toString() + '] (' + properties.playerName + ')';
		} else {
			entity.innerHTML = data.entity.toString() + ' [' + properties.netId.toString() + ']';
		}
	} else {
		entity.innerHTML = data.entity.toString();
	}

	document.querySelector('#properties-model').innerHTML = properties.name;

	setFieldIfInactive('properties-x', properties.x);
	setFieldIfInactive('properties-y', properties.y);
	setFieldIfInactive('properties-z', properties.z);

	setFieldIfInactive('properties-pitch', properties.pitch);
	setFieldIfInactive('properties-roll', properties.roll);
	setFieldIfInactive('properties-yaw', properties.yaw);

	if (data.inDb) {
		document.querySelector('#properties-add-to-db').style.display = 'none';
		document.querySelector('#properties-remove-from-db').style.display = 'block';
	} else {
		document.querySelector('#properties-add-to-db').style.display = 'block';
		document.querySelector('#properties-remove-from-db').style.display = 'none';
	}

	setFieldIfInactive('properties-health', properties.health);

	setFieldIfInactive('properties-outfit', properties.outfit);

	if (properties.netId) {
		document.getElementById('properties-request-control').disabled = data.hasNetworkControl || properties.type == 0;
		document.getElementById('properties-register-as-networked').style.display = 'none';
		document.getElementById('properties-request-control').style.display = 'block';
	} else {
		document.getElementById('properties-request-control').style.display = 'none';
		document.getElementById('properties-register-as-networked').style.display = 'block';
	}

	if (properties.isFrozen) {
		document.getElementById('properties-freeze').style.display = 'none';
		document.getElementById('properties-unfreeze').style.display = 'block';
	} else {
		document.getElementById('properties-unfreeze').style.display = 'none';
		document.getElementById('properties-freeze').style.display = 'block';
	}

	if (properties.isInGroup) {
		document.querySelector('#properties-add-to-group').style.display = 'none';
		document.querySelector('#properties-remove-from-group').style.display = 'block';
	} else {
		document.querySelector('#properties-remove-from-group').style.display = 'none';
		document.querySelector('#properties-add-to-group').style.display = 'block';
	}

	if (properties.collisionDisabled) {
		document.querySelector('#properties-collision-off').style.display = 'none';
		document.querySelector('#properties-collision-on').style.display = 'block';
	} else {
		document.querySelector('#properties-collision-on').style.display = 'none';
		document.querySelector('#properties-collision-off').style.display = 'block';
	}

	if (properties.lightsIntensity) {
		setFieldIfInactive('properties-lights-intensity', properties.lightsIntensity);
	} else {
		setFieldIfInactive('properties-lights-intensity', 0);
	}

	if (properties.lightsColour) {
		setFieldIfInactive('properties-lights-red', properties.lightsColour.red);
		setFieldIfInactive('properties-lights-green', properties.lightsColour.green);
		setFieldIfInactive('properties-lights-blue', properties.lightsColour.blue);
	} else {
		setFieldIfInactive('properties-lights-red', 0);
		setFieldIfInactive('properties-lights-green', 0);
		setFieldIfInactive('properties-lights-blue', 0);
	}

	if (properties.lightsType) {
		setFieldIfInactive('properties-lights-type', properties.lightsType);
	} else {
		setFieldIfInactive('properties-lights-type', 0);
	}

	if (properties.isVisible) {
		document.getElementById('properties-visible').style.display = 'none';
		document.getElementById('properties-invisible').style.display = 'block';
	} else {
		document.getElementById('properties-invisible').style.display = 'none';
		document.getElementById('properties-visible').style.display = 'block';
	}

	if (properties.scale) {
		setFieldIfInactive('properties-scale', properties.scale);
	} else {
		setFieldIfInactive('properties-scale', 1.0)
	}
}

function sendUpdatePropertiesMenuMessage(handle, open) {
	sendMessage('updatePropertiesMenu', {
		handle: handle
	}).then(resp => resp.json()).then(function(resp){
		updatePropertiesMenu(resp);

		if (open) {
			document.querySelector('#properties-menu').style.display = 'flex';
		}
	});
}

function openPropertiesMenu(data) {
	sendUpdatePropertiesMenuMessage(data.entity, true);

	if (propertiesMenuUpdate) {
		clearInterval(propertiesMenuUpdate);
		propertiesMenuUpdate = null;
	}

	propertiesMenuUpdate = setInterval(function() {
		sendUpdatePropertiesMenuMessage(data.entity, false);
	}, 500);
}

function closePropertiesMenu(loseFocus) {
	document.querySelector('#properties-menu').style.display = 'none';
	document.querySelector('#ped-options-menu').style.display = 'none';
	document.querySelector('#vehicle-options-menu').style.display = 'none';

	clearInterval(propertiesMenuUpdate);

	if (loseFocus) {
		sendMessage('closePropertiesMenu', {});
	}
}

function loadDatabase(name) {
	var relative = document.querySelector('#load-db-relative').checked;
	var replace = document.querySelector('#replace-db').checked;

	sendMessage('loadDb', {
		name: name,
		relative: relative,
		replace: replace
	});
}

function updateDbList(data) {
	var databaseNames = JSON.parse(data);
	var dbList = document.querySelector('#db-list');

	dbList.innerHTML = '';

	databaseNames.forEach(function(name) {
		var div = document.createElement('div');
		div.className = 'database';
		div.innerHTML = name;
		div.addEventListener('click', function(event) {
			loadDatabase(this.innerHTML);
		});
		div.addEventListener('contextmenu', function(event) {
			sendMessage('deleteDb', {
				name: this.innerHTML
			});
			this.remove();
		});
		dbList.appendChild(div);
	});
}

function openSaveLoadDbMenu(databaseNames) {
	updateDbList(databaseNames)
	document.querySelector('#save-load-db-menu').style.display = 'flex';
}

function closeSaveLoadDbMenu() {
	document.querySelector('#save-load-db-menu').style.display = 'none';
	sendMessage('closeSaveLoadDbMenu', {});
}

function goToEntity(handle) {
	sendMessage('goToEntity', {
		handle: handle
	});
}

function openHelpMenu() {
	document.querySelector('#help-menu').style.display = 'flex';
	document.querySelector('#hud').style.display = 'none';
}

function closeHelpMenu() {
	document.querySelector('#help-menu').style.display = 'none';
	document.querySelector('#hud').style.display = 'block';
	sendMessage('closeHelpMenu', {});
}

function getIntoVehicle(handle) {
	sendMessage('getIntoVehicle', {
		handle: handle
	});
}

function attachTo(fromEntity, toEntity) {
	var boneName = document.getElementById('attachment-bone-name').value;
	var boneIndex = parseInt(document.getElementById('attachment-bone-index').value);

	sendMessage('attachTo', {
		from: fromEntity,
		to: toEntity,
		bone: boneName == '' ? boneIndex : boneName,
		x: parseFloat(document.getElementById('attachment-x').value),
		y: parseFloat(document.getElementById('attachment-y').value),
		z: parseFloat(document.getElementById('attachment-z').value),
		pitch: parseFloat(document.getElementById('attachment-pitch').value),
		roll: parseFloat(document.getElementById('attachment-roll').value),
		yaw: parseFloat(document.getElementById('attachment-yaw').value),
		keepPos: document.getElementById('attachment-keep-pos').checked,
		useSoftPinning: document.getElementById('attachment-use-soft-pinning').checked,
		collision: document.getElementById('attachment-collision').checked,
		vertex: parseInt(document.getElementById('attachment-vertex').value),
		fixedRot: document.getElementById('attachment-fixed-rot').checked
	});
	sendMessage('getDatabase', {handle: fromEntity}).then(resp => resp.json()).then(resp => openAttachToMenu(fromEntity, resp));
}

function openAttachToMenu(fromEntity, data) {
	var properties = JSON.parse(data.properties);
	var database = JSON.parse(data.database);

	var list = document.getElementById('attach-to-list');

	list.innerHTML = '';

	var addTo = true;

	Object.keys(database).forEach(function(handle) {
		var toEntity = parseInt(handle);

		if (toEntity == fromEntity) {
			return;
		}

		var div = document.createElement('div');

		if (properties.attachment.to == handle) {
			div.className = 'object selected';
			addTo = false;
		} else {
			div.className = 'object';
		}

		div.innerHTML = entityDisplayName(toEntity, database[handle]);

		div.setAttribute('data-handle', handle);
		div.addEventListener('click', function(event) {
			document.getElementById('attachment-options-menu').style.display = 'none';
			attachTo(fromEntity, toEntity);
		});
		list.appendChild(div);
	});

	if (addTo && properties.attachment.to) {
		var div = document.createElement('div');
		div.className = 'object selected';
		if (database[properties.attachment.to]) {
			div.innerHTML = database[properties.attachment.to].name;
		} else {
			div.innerHTML = properties.attachment.to.toString();
		}
		div.addEventListener('click', function(event) {
			document.getElementById('attachment-options-menu').style.display = 'none';
			attachTo(fromEntity, properties.attachment.to);
		});
		list.appendChild(div);
	}

	if (typeof properties.attachment.bone == 'number') {
		document.getElementById('attachment-bone-name').value = '';
		document.getElementById('attachment-bone-index').value = properties.attachment.bone;
	} else {
		document.getElementById('attachment-bone-index').value = '';
		document.getElementById('attachment-bone-name').value = properties.attachment.bone;
	}

	document.getElementById('attachment-x').value = properties.attachment.x;
	document.getElementById('attachment-y').value = properties.attachment.y;
	document.getElementById('attachment-z').value = properties.attachment.z;
	document.getElementById('attachment-pitch').value = properties.attachment.pitch;
	document.getElementById('attachment-roll').value = properties.attachment.roll;
	document.getElementById('attachment-yaw').value = properties.attachment.yaw;
	document.getElementById('attachment-use-soft-pinning').value = properties.attachment.useSoftPinning;
	document.getElementById('attachment-collision').value = properties.attachment.collision;
	document.getElementById('attachment-vertex').value = properties.attachment.vertex;
	document.getElementById('attachment-fixed-rot').value = properties.attachment.fixedRot;

	if (properties.attachment.to) {
		document.getElementById('attachment-options-detach').style.display = 'block';
	} else {
		document.getElementById('attachment-options-detach').style.display = 'none';
	}

	document.getElementById('attachment-options-menu').style.display = 'flex';
}

function updatePermissions(data) {
	var permissions = JSON.parse(data.permissions);

	document.getElementById('spawn-menu-peds').disabled = !permissions.spawn.ped;
	document.getElementById('spawn-menu-vehicles').disabled = !permissions.spawn.vehicle;
	document.getElementById('spawn-menu-objects').disabled = !permissions.spawn.object;
	document.getElementById('spawn-menu-propsets').disabled = !permissions.spawn.propset;
	document.getElementById('spawn-menu-pickups').disabled = !permissions.spawn.pickup;
	document.querySelectorAll('.spawn-by-name').forEach(e => e.disabled = !permissions.spawn.byName);

	document.getElementById('properties-freeze').disabled = !permissions.properties.freeze;
	document.getElementById('properties-unfreeze').disabled = !permissions.properties.freeze;
	document.getElementById('properties-x').disabled = !permissions.properties.position;
	document.getElementById('properties-y').disabled = !permissions.properties.position;
	document.getElementById('properties-z').disabled = !permissions.properties.position;
	document.getElementById('properties-place-here').disabled = !permissions.properties.position;
	document.getElementById('properties-goto').disabled = !permissions.properties.goTo;
	document.getElementById('properties-pitch').disabled = !permissions.properties.rotation;
	document.getElementById('properties-roll').disabled = !permissions.properties.rotation;
	document.getElementById('properties-yaw').disabled = !permissions.properties.rotation;
	document.getElementById('properties-reset-rotation').disabled = !permissions.properties.rotation;
	document.getElementById('properties-health').disabled = !permissions.properties.health;
	document.getElementById('properties-invincible-on').disabled = !permissions.properties.invincible;
	document.getElementById('properties-invincible-off').disabled = !permissions.properties.invincible;
	document.getElementById('properties-visible').disabled = !permissions.properties.visible;
	document.getElementById('properties-invisible').disabled = !permissions.properties.visible;
	document.getElementById('properties-gravity-on').disabled = !permissions.properties.gravity;
	document.getElementById('properties-gravity-off').disabled = !permissions.properties.gravity;
	document.getElementById('properties-collision-off').disabled = !permissions.properties.collision;
	document.getElementById('properties-collision-on').disabled = !permissions.properties.collision;
	document.getElementById('properties-clone').disabled = !permissions.properties.clone;
	document.getElementById('properties-attach').disabled = !permissions.properties.attachments;
	document.getElementById('properties-player-model').disabled = !permissions.properties.ped.changeModel;
	document.getElementById('properties-outfit').disabled = !permissions.properties.ped.outfit;
	document.getElementById('properties-add-to-group').disabled = !permissions.properties.ped.group;
	document.getElementById('properties-remove-from-group').disabled = !permissions.properties.ped.group;
	document.getElementById('properties-scenario').disabled = !permissions.properties.ped.scenario;
	document.getElementById('properties-animation').disabled = !permissions.properties.ped.animation;
	document.getElementById('properties-clear-ped-tasks').disabled = !permissions.properties.ped.clearTasks;
	document.getElementById('properties-clear-ped-tasks-immediately').disabled = !permissions.properties.ped.clearTasks;
	document.getElementById('properties-give-weapon').disabled = !permissions.properties.ped.weapon;
	document.getElementById('properties-remove-all-weapons').disabled = !permissions.properties.ped.weapon;
	document.getElementById('properties-set-on-mount').disabled = !permissions.properties.ped.mount;
	document.getElementById('properties-resurrect-ped').disabled = !permissions.properties.ped.resurrect;
	document.getElementById('properties-ai-on').disabled = !permissions.properties.ped.ai;
	document.getElementById('properties-ai-off').disabled = !permissions.properties.ped.ai;
	document.getElementById('properties-knock-off-props').disabled = !permissions.properties.ped.knockOffProps;
	document.getElementById('properties-clone-ped').disabled = !permissions.properties.clone;
	document.getElementById('properties-clone-to-target').disabled = !permissions.properties.ped.cloneToTarget;
	document.getElementById('properties-repair-vehicle').disabled = !permissions.properties.vehicle.repair;
	document.getElementById('properties-get-in').disabled = !permissions.properties.vehicle.getin
	document.getElementById('properties-engine-on').disabled = !permissions.properties.vehicle.engine
	document.getElementById('properties-engine-off').disabled = !permissions.properties.vehicle.engine
	document.getElementById('properties-vehicle-lights-on').disabled = !permissions.properties.vehicle.lights;
	document.getElementById('properties-vehicle-lights-off').disabled = !permissions.properties.vehicle.lights;
	document.getElementById('properties-register-as-networked').disabled = !permissions.properties.registerAsNetworked;
	document.getElementById('add-to-db-btn').disabled = permissions.maxEntities || !permissions.modify.other;
}

function currentEntity() {
	return parseInt(document.querySelector('#properties-menu-entity-id').getAttribute('data-handle'));
}

function openEntitySelect(menuId, onEntitySelect, ignoreEntity) {
	var menu = document.getElementById(menuId);

	var entitySelect = document.getElementById('entity-select-menu');
	entitySelect.innerHTML = '';

	var entitySelectClose = document.createElement('button');
	entitySelectClose.innerHTML = 'Voltar';
	entitySelectClose.addEventListener('click', event => {
		entitySelect.style.display = 'none';
		menu.style.display = 'flex';
	});

	var entitySelectList = document.createElement('div');
	entitySelectList.className = 'list';

	sendMessage('getDatabase', {}).then(resp => resp.json()).then(resp => {
		var database = JSON.parse(resp.database);

		Object.keys(database).forEach(key => {
			var handle = parseInt(key);

			if (handle != ignoreEntity) {
				var div = document.createElement('div');
				div.className = 'object';

				div.innerHTML = entityDisplayName(handle, database[key]);

				div.addEventListener('click', event => {
					onEntitySelect(handle);
					entitySelect.style.display = 'none';
					menu.style.display = 'flex';
				});

				entitySelectList.appendChild(div);
			}
		});

		entitySelect.appendChild(entitySelectList);
		entitySelect.appendChild(entitySelectClose);

		menu.style.display = 'none';
		entitySelect.style.display = 'flex';
	});
}

function showControls() {
	document.getElementById('controls').style.display = 'flex';
}

function hideControls() {
	document.getElementById('controls').style.display = 'none';
}

function populatePedConfigFlagsList(flags) {
	var configFlagsList = document.getElementById('config-flags-list');

	configFlagsList.innerHTML = '';

	Object.keys(flags).forEach(key => {
		var flag = flags[key];

		var div = document.createElement('div');
		if (flag.value) {
			div.className = 'config-flag on';
		} else {
			div.className = 'config-flag off';
		}

		var flagDiv = document.createElement('div');
		flagDiv.className = 'config-flag-number';
		flagDiv.innerHTML = key;

		var descrDiv = document.createElement('div');
		descrDiv.className = 'config-flag-descr';
		descrDiv.innerHTML = flag.descr;

		var setDiv = document.createElement('div');
		setDiv.className = 'config-flag-set';

		var setButton = document.createElement('button');
		if (flag.value) {
			setButton.innerHTML = '<i class="fas fa-toggle-on"></i>';
			setButton.addEventListener('click', event => {
				sendMessage('setPedConfigFlag', {
					handle: currentEntity(),
					flag: parseInt(key),
					value: false
				}).then(resp => resp.json()).then(resp => populatePedConfigFlagsList(resp));
			});
		} else {
			setButton.innerHTML = '<i class="fas fa-toggle-off"></i>';
			setButton.addEventListener('click', event => {
				sendMessage('setPedConfigFlag', {
					handle: currentEntity(),
					flag: parseInt(key),
					value: true
				}).then(resp => resp.json()).then(resp => populatePedConfigFlagsList(resp));
			});
		}

		setDiv.appendChild(setButton);

		div.appendChild(flagDiv);
		div.appendChild(descrDiv);
		div.appendChild(setDiv);

		configFlagsList.appendChild(div);
	});
}

window.addEventListener('message', function(event) {
	switch (event.data.type) {
		case 'showSpoonerHud':
			showSpoonerHud();
			break;
		case 'hideSpoonerHud':
			hideSpoonerHud();
			break;
		case 'updateSpoonerHud':
			updateSpoonerHud(event.data);
			break;
		case 'openSpawnMenu':
			openSpawnMenu();
			break;
		case 'openDatabase':
			openDatabase(event.data);
			break;
		case 'openPropertiesMenu':
			openPropertiesMenu(event.data);
			break;
		case 'openSaveLoadDbMenu':
			openSaveLoadDbMenu(event.data.databaseNames);
			break;
		case 'openHelpMenu':
			openHelpMenu();
			break;
		case 'updatePermissions':
			updatePermissions(event.data);
			break;
		case 'showControls':
			showControls();
			break;
		case 'hideControls':
			hideControls();
			break;
		case 'autoSaveTimestamp':
			var btn = document.querySelector('#autosave-toggle');
			if (btn && btn.classList.contains('on')) {
				var ts = event.data.time;
				if (!ts) {
					var now = new Date();
					var hh = now.getHours().toString().padStart(2, '0');
					var mm = now.getMinutes().toString().padStart(2, '0');
					ts = hh + ':' + mm;
				}
				btn.textContent = 'Auto-save: ON · ' + ts;
			}
			break;
		case 'spawnFrozenState':
			var frozenEl = document.getElementById('spawn-frozen-state');
			if (frozenEl) {
				if (event.data.frozen) {
					frozenEl.textContent = '\u2744 Congelado';
					frozenEl.style.color = '';
				} else {
					frozenEl.textContent = '\uD83C\uDF2C Descongelado';
					frozenEl.style.color = '#7dffb3';
				}
			}
			break;
		case 'updateCustomPropsets':
			customPropsets = JSON.parse(event.data.customPropsets || '[]');
			populatePersonalCustomPropsetList(document.querySelector('#personal-propsets-custom-filter').value);
			break;
	}
});

window.addEventListener('load', function() {
	sendMessage('init', {}).then(resp => resp.json()).then(function(resp) {
		if (resp.favourites) {
			favourites = resp.favourites;
		}

		favouriteTypes.forEach(type => {
			if (!favourites[type] || Array.isArray(favourites[type])) {
				favourites[type] = {};
			}
		});

		peds = JSON.parse(resp.peds);
		populatePlayerModelList();

		vehicles = JSON.parse(resp.vehicles);
		populateVehicleList();

		objects = JSON.parse(resp.objects);

		customPropsets = JSON.parse(resp.customPropsets || '[]');
		// Menus pesados e ocultos sobem sob demanda quando o usuario abre cada tela.

		scenarios = JSON.parse(resp.scenarios);

		weapons = JSON.parse(resp.weapons);
		populateWeaponList();

		propsets = JSON.parse(resp.propsets);

		pickups = JSON.parse(resp.pickups);
		populatePickupList();

		bones = JSON.parse(resp.bones);
		populateBoneNameList();

		walkStyleBases = JSON.parse(resp.walkStyleBases);
		walkStyles = JSON.parse(resp.walkStyles);
		populateWalkStyleList();

		document.querySelectorAll('.adjust-speed').forEach(e => e.value = resp.adjustSpeed);
		document.querySelectorAll('.adjust-input').forEach(e => e.step = resp.adjustSpeed);

		document.querySelectorAll('.rotate-speed').forEach(e => e.value = resp.rotateSpeed);
		document.querySelectorAll('.rotate-input').forEach(e => e.step = resp.rotateSpeed);
	});

	document.querySelector('#ped-search-filter').addEventListener('input', function(event) {
		populatePedList(this.value);
	});

	document.querySelector('#player-model-search-filter').addEventListener('input', function(event) {
		populatePlayerModelList(this.value);
	});

	document.querySelector('#vehicle-search-filter').addEventListener('input', function(event) {
		populateVehicleList(this.value);
	});

	document.querySelector('#object-search-filter').addEventListener('input', function(event) {
		var val = this.value;
		clearTimeout(_objectSearchDebounce);
		_objectSearchDebounce = setTimeout(function() {
			objectListCacheKey = null;
			populateObjectListCategorized(val);
		}, 200);
	});

	document.querySelector('#object-category-toggle').addEventListener('click', function(event) {
		var list = document.getElementById('object-list');
		var masters = list.querySelectorAll('.oyate-master-items');
		var anyOpen = Array.prototype.some.call(masters, function(el) { return el.classList.contains('open'); });
		// Se algum estiver aberto → colapsar tudo; senão → expandir tudo
		masters.forEach(function(el) { el.classList.toggle('open', !anyOpen); });
		list.querySelectorAll('.oyate-master-header').forEach(function(el) { el.classList.toggle('open', !anyOpen); });
		list.querySelectorAll('.oyate-category-items').forEach(function(el) { el.classList.toggle('open', !anyOpen); });
		list.querySelectorAll('.oyate-category-header').forEach(function(el) { el.classList.toggle('open', !anyOpen); });
	});

	document.getElementById('propset-search-filter').addEventListener('input', function(event) {
		populatePropsetList(this.value);
	});

	document.querySelector('#ped-spawn-by-name').addEventListener('click', function(event) {
		document.querySelector('#ped-menu').style.display = 'none';

		sendMessage('closePedMenu', {
			modelName: document.querySelector('#ped-search-filter').value,
			list: pedVisibleModels,
			index: Math.max(1, pedVisibleModels.indexOf(document.querySelector('#ped-search-filter').value) + 1)
		});
	});

	document.querySelector('#player-model-spawn-by-name').addEventListener('click', function(event) {
		setPlayerModel(document.querySelector('#player-model-search-filter').value);
	});

	document.querySelector('#vehicle-spawn-by-name').addEventListener('click', function(event) {
		document.querySelector('#vehicle-menu').style.display = 'none';

		sendMessage('closeVehicleMenu', {
			modelName: document.querySelector('#vehicle-search-filter').value,
			list: vehicleVisibleModels,
			index: Math.max(1, vehicleVisibleModels.indexOf(document.querySelector('#vehicle-search-filter').value) + 1),
			menu: 1
		});
	});

	document.querySelector('#object-spawn-by-name').addEventListener('click', function(event) {
		document.querySelector('#object-menu').style.display = 'none';

		sendMessage('closeObjectMenu', {
			modelName: document.querySelector('#object-search-filter').value,
			list: objectVisibleModels,
			index: Math.max(1, objectVisibleModels.indexOf(document.querySelector('#object-search-filter').value) + 1),
			menu: 2
		});

		document.getElementById('object-list').innerHTML = '';
		objectListCacheKey = null;
		objectVisibleModels = [];
	});

	document.querySelector('#propset-spawn-by-name').addEventListener('click', function(event) {
		document.querySelector('#propset-menu').style.display = 'none';

		sendMessage('closePropsetMenu', {
			modelName: document.querySelector('#propset-search-filter').value,
			list: propsetVisibleModels,
			index: Math.max(1, propsetVisibleModels.indexOf(document.querySelector('#propset-search-filter').value) + 1),
			menu: 3
		});
	});

	document.querySelector('#pickup-spawn-by-name').addEventListener('click', function(event) {
		document.querySelector('#pickup-menu').style.display = 'none';

		sendMessage('closePickupMenu', {
			modelName: document.querySelector('#pickup-search-filter').value,
			list: pickups,
			index: Math.max(1, pickups.indexOf(document.querySelector('#pickup-search-filter').value) + 1),
			menu: 4
		});
	});

	document.querySelector('#ped-menu-close-btn').addEventListener('click', function(event) {
		closePedMenu();
	});

	document.getElementById('player-model-menu-close-btn').addEventListener('click', function(event) {
		document.querySelector('#player-model-menu').style.display = 'none';
		document.querySelector('#ped-options-menu').style.display = 'flex';
	});

	document.querySelector('#vehicle-menu-close-btn').addEventListener('click', function(event) {
		closeVehicleMenu();
	});

	document.querySelector('#object-menu-close-btn').addEventListener('click', function(event) {
		closeObjectMenu();
	});

	var elPlantas = document.querySelector('#personal-menu-plantas');
	if (elPlantas) elPlantas.addEventListener('click', function(event) { openPersonalPlantasMenu(); });

	var elObjetos = document.querySelector('#personal-menu-objetos');
	if (elObjetos) elObjetos.addEventListener('click', function(event) { openPersonalObjetosMenu(); });

	document.querySelector('#personal-menu-close-btn').addEventListener('click', function(event) {
		closePersonalMenu();
	});

	document.querySelector('#personal-plantas-filter').addEventListener('input', function(event) {
		populatePersonalPlantasList(event.target.value);
	});

	document.querySelector('#personal-plantas-spawn-by-name').addEventListener('click', function(event) {
		document.querySelector('#personal-plantas-menu').style.display = 'none';
		sendMessage('closePersonalMenu', {
			modelName: document.querySelector('#personal-plantas-filter').value,
			list: personalPlantasVisibleModels,
			index: Math.max(1, personalPlantasVisibleModels.indexOf(document.querySelector('#personal-plantas-filter').value) + 1),
			menu: 11
		});
	});

	document.querySelector('#personal-plantas-close-btn').addEventListener('click', function(event) {
		closePersonalPlantasMenu();
	});

	document.querySelector('#personal-objetos-spawn-by-name').addEventListener('click', function(event) {
		document.querySelector('#personal-objetos-menu').style.display = 'none';
		sendMessage('closePersonalMenu', {
			modelName: document.querySelector('#personal-objetos-filter').value,
			list: personalObjetosVisibleModels,
			index: Math.max(1, personalObjetosVisibleModels.indexOf(document.querySelector('#personal-objetos-filter').value) + 1),
			menu: 12
		});
	});

	document.querySelector('#personal-objetos-filter').addEventListener('input', function(event) {
		populatePersonalObjetosList(event.target.value);
	});

	document.querySelector('#personal-objetos-close-btn').addEventListener('click', function(event) {
		closePersonalObjetosMenu();
	});

	document.querySelector('#personal-menu-oyate').addEventListener('click', function(event) {
		openPersonalOyateMenu();
	});

	document.querySelector('#personal-menu-propsets-custom').addEventListener('click', function(event) {
		openPersonalCustomPropsetMenu();
	});

	document.querySelector('#personal-oyate-spawn-by-name').addEventListener('click', function(event) {
		document.querySelector('#personal-oyate-menu').style.display = 'none';
		sendMessage('closePersonalMenu', {
			modelName: document.querySelector('#personal-oyate-filter').value,
			list: personalOyateVisibleModels,
			index: Math.max(1, personalOyateVisibleModels.indexOf(document.querySelector('#personal-oyate-filter').value) + 1),
			menu: 13
		});
	});

	document.querySelector('#personal-oyate-filter').addEventListener('input', function(event) {
		populatePersonalOyateList(event.target.value);
	});

	document.querySelector('#personal-oyate-close-btn').addEventListener('click', function(event) {
		closePersonalOyateMenu();
	});

	document.querySelector('#oyate-category-toggle').addEventListener('click', function() {
		var list = document.getElementById('personal-oyate-list');
		var anyOpen = Array.prototype.some.call(list.querySelectorAll('.oyate-master-items'), function(el) { return el.classList.contains('open'); });
		list.querySelectorAll('.oyate-master-items, .oyate-master-header, .oyate-category-items, .oyate-category-header').forEach(function(el) { el.classList.toggle('open', !anyOpen); });
	});

	document.querySelector('#objetos-category-toggle').addEventListener('click', function() {
		var list = document.getElementById('personal-objetos-list');
		var anyOpen = Array.prototype.some.call(list.querySelectorAll('.oyate-category-items'), function(el) { return el.classList.contains('open'); });
		list.querySelectorAll('.oyate-category-items, .oyate-category-header').forEach(function(el) { el.classList.toggle('open', !anyOpen); });
	});

	document.querySelector('#personal-peds-spawn-by-name').addEventListener('click', function(event) {
		document.querySelector('#personal-peds-menu').style.display = 'none';
		sendMessage('closePedMenu', {
			modelName: document.querySelector('#personal-peds-filter').value,
			list: personalPedsVisibleModels,
			index: Math.max(1, personalPedsVisibleModels.indexOf(document.querySelector('#personal-peds-filter').value) + 1),
			menu: 15
		});
	});

	document.querySelector('#personal-peds-filter').addEventListener('input', function(event) {
		populatePersonalPedsList(event.target.value);
	});

	document.querySelector('#personal-peds-close-btn').addEventListener('click', function(event) {
		closePersonalPedsMenu();
	});

	document.querySelector('#peds-category-toggle').addEventListener('click', function() {
		var list = document.getElementById('personal-peds-list');
		var anyOpen = Array.prototype.some.call(list.querySelectorAll('.oyate-master-items'), function(el) { return el.classList.contains('open'); });
		list.querySelectorAll('.oyate-master-items, .oyate-master-header, .oyate-category-items, .oyate-category-header').forEach(function(el) { el.classList.toggle('open', !anyOpen); });
	});

	document.querySelector('#personal-propsets-custom-spawn-by-name').addEventListener('click', function(event) {
		document.querySelector('#personal-propsets-custom-menu').style.display = 'none';
		sendMessage('closePersonalCustomPropsetMenu', {
			modelName: document.querySelector('#personal-propsets-custom-filter').value,
			list: personalCustomPropsetVisibleModels,
			index: Math.max(1, personalCustomPropsetVisibleModels.indexOf(document.querySelector('#personal-propsets-custom-filter').value) + 1),
			menu: 14
		});
	});

	document.querySelector('#personal-propsets-custom-filter').addEventListener('input', function(event) {
		populatePersonalCustomPropsetList(event.target.value);
	});

	document.querySelector('#personal-propsets-custom-close-btn').addEventListener('click', function(event) {
		closePersonalCustomPropsetMenu();
	});

	document.querySelector('#propset-menu-close-btn').addEventListener('click', function(event) {
		closePropsetMenu();
	});

	document.querySelector('#pickup-menu-close-btn').addEventListener('click', function(event) {
		closePickupMenu();
	});

	document.querySelector('#object-database-delete-all-btn').addEventListener('click', function(event) {
		removeAllFromDatabase();
	});

	document.getElementById('object-database-filter').addEventListener('input', function(event) {
		renderDatabase();
	});

	document.getElementById('object-database-sort-recent').addEventListener('click', function(event) {
		databaseRecentFirst = !databaseRecentFirst;
		if (databaseRecentFirst) {
			this.setAttribute('data-active', '');
			this.innerHTML = 'Recent';
		} else {
			this.removeAttribute('data-active');
			this.innerHTML = 'Name';
		}
		renderDatabase();
	});

	document.querySelector('#object-database-close-btn').addEventListener('click', function(event) {
		closeDatabase();
	});

	document.querySelector('#properties-add-to-db').addEventListener('click', function(event) {
		sendMessage('addEntityToDatabase', {
			handle: currentEntity()
		}).then(resp => resp.json()).then(function(resp) {
			document.querySelector('#properties-add-to-db').style.display = 'none';
			document.querySelector('#properties-remove-from-db').style.display = 'block';
		});
	});

	document.querySelector('#properties-remove-from-db').addEventListener('click', function(event) {
		sendMessage('removeEntityFromDatabase', {
			handle: currentEntity()
		}).then(resp => resp.json()).then(function(resp) {
			document.querySelector('#properties-add-to-db').style.display = 'block';
			document.querySelector('#properties-remove-from-db').style.display = 'none';
		});
	});

	document.querySelector('#properties-freeze').addEventListener('click', function(event) {
		sendMessage('freezeEntity', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-unfreeze').addEventListener('click', function(event) {
		sendMessage('unfreezeEntity', {
			handle: currentEntity()
		});
	});

	document.querySelectorAll('.set-coords').forEach(function(e) {
		e.addEventListener('input', function(event) {
			sendMessage('setEntityCoords', {
				handle: currentEntity(),
				x: parseFloat(document.querySelector('#properties-x').value),
				y: parseFloat(document.querySelector('#properties-y').value),
				z: parseFloat(document.querySelector('#properties-z').value)
			});
		});
	});

	document.querySelector('#properties-place-here').addEventListener('click', function(event) {
		sendMessage('placeEntityHere', {
			handle: currentEntity()
		}).then(resp => resp.json()).then(function(resp) {
			document.querySelector('#properties-x').value = resp.x;
			document.querySelector('#properties-y').value = resp.y;
			document.querySelector('#properties-z').value = resp.z;
			document.querySelector('#properties-pitch').value = resp.pitch;
			document.querySelector('#properties-roll').value = resp.roll;
			document.querySelector('#properties-yaw').value = resp.pitch;
		});
	});

	document.querySelector('#properties-goto').addEventListener('click', function(event) {
		closePropertiesMenu(true);
		goToEntity(currentEntity())
	});

	document.querySelectorAll('.set-rotation').forEach(function(e) {
		e.addEventListener('input', function(event) {
			sendMessage('setEntityRotation', {
				handle: currentEntity(),
				pitch: parseFloat(document.querySelector('#properties-pitch').value),
				roll: parseFloat(document.querySelector('#properties-roll').value),
				yaw: parseFloat(document.querySelector('#properties-yaw').value)
			});
		});
	});

	document.querySelector('#properties-reset-rotation').addEventListener('click', function(event) {
		sendMessage('resetRotation', {
			handle: currentEntity()
		});
		document.querySelector('#properties-pitch').value = 0.0;
		document.querySelector('#properties-roll').value = 0.0;
		document.querySelector('#properties-yaw').value = 0.0;
	});

	document.querySelector('#properties-invincible-on').addEventListener('click', function(event) {
		sendMessage('invincibleOn', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-invincible-off').addEventListener('click', function(event) {
		sendMessage('invincibleOff', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-clone').addEventListener('click', function(event) {
		sendMessage('cloneEntity', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-delete').addEventListener('click', function(event) {
		sendMessage('deleteEntity', {
			handle: currentEntity()
		});

		closePropertiesMenu(true);
	});

	document.querySelector('#properties-menu-close-btn').addEventListener('click', function(event) {
		closePropertiesMenu(true);
	});

	document.querySelector('#autosave-path').addEventListener('change', function() {
		autoSavePath = this.value.trim();
		sendMessage('setAutoSavePath', { path: autoSavePath });
	});

	document.querySelector('#autosave-toggle').addEventListener('click', function() {
		var fieldPath = document.querySelector('#autosave-path').value.trim();
		if (fieldPath) {
			autoSavePath = fieldPath;
			sendMessage('setAutoSavePath', { path: autoSavePath });
		}
		if (!autoSavePath) return;
		autoSaveEnabled = !autoSaveEnabled;
		sendMessage('setAutoSaveEnabled', { enabled: autoSaveEnabled });
		if (autoSaveEnabled) {
			this.classList.add('on');
			var now = new Date();
			var hh = now.getHours().toString().padStart(2, '0');
			var mm = now.getMinutes().toString().padStart(2, '0');
			this.textContent = 'Auto-save: ON · ' + hh + ':' + mm;
		} else {
			this.classList.remove('on');
			this.textContent = 'Auto-save: OFF';
		}
	});

	sendMessage('getAutoSavePath', {}).then(resp => resp.json()).then(function(resp) {
		autoSavePath = resp.path || '';
		document.querySelector('#autosave-path').value = autoSavePath;
		if (resp.enabled && autoSavePath) {
			autoSaveEnabled = true;
			var btn = document.querySelector('#autosave-toggle');
			var now = new Date();
			var hh = now.getHours().toString().padStart(2, '0');
			var mm = now.getMinutes().toString().padStart(2, '0');
			btn.classList.add('on');
			btn.textContent = 'Auto-save: ON · ' + hh + ':' + mm;
			sendMessage('setAutoSaveEnabled', { enabled: true });
		}
	});

	document.getElementById('spawn-frozen-state').addEventListener('click', function() {
		sendMessage('toggleSpawnFrozen', {});
	});

	document.querySelector('#save-db-btn').addEventListener('click', function(event) {
		sendMessage('saveDb', {
			name: document.querySelector('#save-db-name').value
		}).then(resp => resp.json()).then(resp => updateDbList(resp));
	});

	document.querySelector('#save-custom-propset-btn').addEventListener('click', function(event) {
		var nameField = document.querySelector('#save-custom-propset-name');
		var name = (nameField.value || '').trim();

		nameField.classList.remove('error');

		if (!name) {
			nameField.classList.add('error');
			nameField.value = '';
			nameField.placeholder = 'Defina um nome antes de salvar o propset';
			nameField.focus();
			return;
		}

		sendMessage('saveCustomPropset', {
			name: name
		}).then(resp => resp.json()).then(resp => {
			if (!resp.ok) {
				nameField.classList.add('error');
				nameField.value = '';
				nameField.placeholder = resp.error || 'Falha ao salvar propset';
				nameField.focus();
			} else {
				nameField.classList.remove('error');
			}
		});
	});

	document.querySelector('#import-export-db-btn').addEventListener('click', function(event) {
		document.querySelector('#save-load-db-menu').style.display = 'none';
		document.querySelector('#import-export-db').style.display = 'flex';
	});

	document.querySelector('#import-db').addEventListener('click', function(event) {
		var url = document.querySelector('#import-url').value;

		if (url) {
			fetch(url).then(resp => resp.text()).then(function(text) {
				document.querySelector('#import-export-content').value = text;

				sendMessage('importDb', {
					format: document.querySelector('#import-export-format').value,
					content: text
				});
			});
		} else {
			sendMessage('importDb', {
				format: document.querySelector('#import-export-format').value,
				content: document.querySelector('#import-export-content').value
			});
		}
	});

	document.querySelector('#export-db').addEventListener('click', function(event) {
		sendMessage('exportDb', {
			format: document.querySelector('#import-export-format').value
		}).then(resp => resp.json()).then(function(resp) {
			document.querySelector('#import-export-content').value = resp;
		});
	});

	document.querySelector('#import-export-db-close').addEventListener('click', function(event) {
		document.querySelector('#import-export-db').style.display = 'none';
		sendMessage('closeImportExportDbWindow', {});
	});

	document.querySelector('#save-load-db-menu-close-btn').addEventListener('click', function(event) {
		closeSaveLoadDbMenu();
	});

	document.querySelectorAll('.adjust-speed').forEach(e => e.addEventListener('input', function(event) {
		document.querySelectorAll('.adjust-speed').forEach(e => e.value = this.value);
		document.querySelectorAll('.adjust-input').forEach(e => e.step = this.value);

		sendMessage('setAdjustSpeed', {
			speed: this.value
		});
	}));

	document.querySelectorAll('.rotate-speed').forEach(e => e.addEventListener('input', function(event) {
		document.querySelectorAll('.rotate-speed').forEach(e => e.value = this.value);
		document.querySelectorAll('.rotate-input').forEach(e => e.step = this.value);

		sendMessage('setRotateSpeed', {
			speed: this.value
		});
	}));

	document.querySelector('#help-menu-close-btn').addEventListener('click', function(event) {
		closeHelpMenu();
	});

	document.querySelector('#spawn-menu-peds').addEventListener('click', function(event) {
		openPersonalPedsMenu();
	});

	document.querySelector('#spawn-menu-vehicles').addEventListener('click', function(event) {
		openVehicleMenu();
	});

	document.querySelector('#spawn-menu-objects').addEventListener('click', function(event) {
		openObjectMenu();
	});

	document.querySelector('#spawn-menu-propsets').addEventListener('click', function(event) {
		openPropsetMenu();
	});

	document.querySelector('#spawn-menu-pickups').addEventListener('click', function(event) {
		openPickupMenu();
	});

	document.querySelector('#spawn-menu-personal').addEventListener('click', function(event) {
		openPersonalMenu();
	});

	document.querySelector('#spawn-menu-close').addEventListener('click', function(event) {
		closeSpawnMenu();
	});

	document.querySelector('#properties-get-in').addEventListener('click', function(event) {
		closePropertiesMenu(true);
		getIntoVehicle(currentEntity())
	});

	document.querySelector('#properties-repair-vehicle').addEventListener('click', function(event) {
		sendMessage('repairVehicle', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-request-control').addEventListener('click', function(event) {
		sendMessage('requestControl', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-attach').addEventListener('click', function(event) {
		closePropertiesMenu(false);
		sendMessage('getDatabase', {handle: currentEntity()}).then(resp => resp.json()).then(resp => openAttachToMenu(currentEntity(), resp));
	});

	document.querySelector('#attachment-options-menu-close').addEventListener('click', function(event) {
		document.querySelector('#attachment-options-menu').style.display = 'none';
		sendMessage('openPropertiesMenuForEntity', {
			entity: currentEntity()
		});

	});

	document.querySelector('#attachment-options-detach').addEventListener('click', function(event) {
		document.querySelector('#attachment-options-menu').style.display = 'none';
		sendMessage('detach', {
			handle: currentEntity()
		});
		sendMessage('getDatabase', {handle: currentEntity()}).then(resp => resp.json()).then(resp => openAttachToMenu(currentEntity(), resp));
	});

	document.querySelectorAll('.set-attach').forEach(e => e.addEventListener('input', function(event) {
		var boneName = document.getElementById('attachment-bone-name').value;
		var boneIndex = parseInt(document.getElementById('attachment-bone-index').value);

		sendMessage('attachTo', {
			from: currentEntity(),
			to: null,
			bone: boneName == '' ? boneIndex : boneName,
			x: parseFloat(document.getElementById('attachment-x').value),
			y: parseFloat(document.getElementById('attachment-y').value),
			z: parseFloat(document.getElementById('attachment-z').value),
			pitch: parseFloat(document.getElementById('attachment-pitch').value),
			roll: parseFloat(document.getElementById('attachment-roll').value),
			yaw: parseFloat(document.getElementById('attachment-yaw').value),
			useSoftPinning: document.getElementById('attachment-use-soft-pinning').checked,
			collision: document.getElementById('attachment-collision').checked,
			vertex: parseInt(document.getElementById('attachment-vertex').value),
			fixedRot: document.getElementById('attachment-fixed-rot').checked,
			keepPos: false
		});
	}));

	document.querySelector('#properties-health').addEventListener('input', function(event) {
		sendMessage('setEntityHealth', {
			handle: currentEntity(),
			health: parseInt(this.value)
		});
	});

	document.querySelector('#properties-visible').addEventListener('click', function(event) {
		sendMessage('setEntityVisible', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-invisible').addEventListener('click', function(event) {
		sendMessage('setEntityInvisible', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-gravity-on').addEventListener('click', function(event) {
		sendMessage('gravityOn', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-gravity-off').addEventListener('click', function(event) {
		sendMessage('gravityOff', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-scenario').addEventListener('click', function(event) {
		document.querySelector('#ped-options-menu').style.display = 'none';
		document.querySelector('#scenario-menu').style.display = 'flex';
		populateScenarioList(document.querySelector('#scenario-search-filter').value);
	});

	document.querySelector('#scenario-menu-close').addEventListener('click', function(event) {
		document.querySelector('#scenario-menu').style.display = 'none';
		document.querySelector('#ped-options-menu').style.display = 'flex';
	});

	document.querySelector('#scenario-search-filter').addEventListener('input', function(event) {
		populateScenarioList(this.value);
	});

	document.querySelector('#properties-clear-ped-tasks').addEventListener('click', function(event) {
		sendMessage('clearPedTasks', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-clear-ped-tasks-immediately').addEventListener('click', function(event) {
		sendMessage('clearPedTasksImmediately', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-outfit').addEventListener('input', function(event) {
		sendMessage('setOutfit', {
			handle: currentEntity(),
			outfit: parseInt(this.value)
		});
	});

	document.querySelector('#properties-add-to-group').addEventListener('click', function(event) {
		sendMessage('addToGroup', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-remove-from-group').addEventListener('click', function(event) {
		sendMessage('removeFromGroup', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-collision-on').addEventListener('click', function(event) {
		sendMessage('collisionOn', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-collision-off').addEventListener('click', function(event) {
		sendMessage('collisionOff', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-ped-options').addEventListener('click', function(event) {
		document.querySelector('#properties-menu').style.display = 'none';
		document.querySelector('#ped-options-menu').style.display = 'flex';
	});

	document.querySelector('#ped-options-menu-close').addEventListener('click', function(event) {
		document.querySelector('#ped-options-menu').style.display = 'none';
		document.querySelector('#properties-menu').style.display = 'flex';
	});

	document.querySelector('#properties-vehicle-options').addEventListener('click', function(event) {
		document.querySelector('#properties-menu').style.display = 'none';
		document.querySelector('#vehicle-options-menu').style.display = 'flex';
	});

	document.querySelector('#vehicle-options-menu-close').addEventListener('click', function(event) {
		document.querySelector('#vehicle-options-menu').style.display = 'none';
		document.querySelector('#properties-menu').style.display = 'flex';
	});

	document.querySelector('#properties-give-weapon').addEventListener('click', function(event) {
		document.querySelector('#ped-options-menu').style.display = 'none';
		document.querySelector('#weapon-menu').style.display = 'flex';
	});

	document.querySelector('#weapon-search-filter').addEventListener('input', function(event) {
		populateWeaponList(this.value);
	});

	document.querySelector('#properties-remove-all-weapons').addEventListener('click', function(event) {
		sendMessage('removeAllWeapons', {
			handle: currentEntity()
		});
	});

	document.querySelector('#weapon-menu-close').addEventListener('click', function(event) {
		document.querySelector('#weapon-menu').style.display = 'none';
		document.querySelector('#ped-options-menu').style.display = 'flex';
	});

	document.querySelector('#properties-resurrect-ped').addEventListener('click', function(event) {
		sendMessage('resurrectPed', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-engine-on').addEventListener('click', function(event) {
		sendMessage('engineOn', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-engine-off').addEventListener('click', function(event) {
		sendMessage('engineOff', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-lights-options').addEventListener('click', function(event) {
		document.querySelector('#properties-menu').style.display = 'none';
		document.querySelector('#lights-options-menu').style.display = 'flex';
	});

	document.querySelector('#lights-options-menu-close').addEventListener('click', function(event) {
		document.querySelector('#lights-options-menu').style.display = 'none';
		document.querySelector('#properties-menu').style.display = 'flex';
	});

	document.querySelector('#properties-lights-intensity').addEventListener('input', function(event) {
		sendMessage('setLightsIntensity', {
			handle: currentEntity(),
			intensity: parseFloat(this.value)
		});
	});

	document.querySelectorAll('.lights-colour').forEach(e => e.addEventListener('input', function(event) {
		sendMessage('setLightsColour', {
			handle: currentEntity(),
			red: parseFloat(document.querySelector('#properties-lights-red').value),
			green: parseFloat(document.querySelector('#properties-lights-green').value),
			blue: parseFloat(document.querySelector('#properties-lights-blue').value)
		});
	}));

	document.querySelector('#properties-lights-type').addEventListener('click', function(event) {
		sendMessage('setLightsType', {
			handle: currentEntity(),
			type: parseInt(this.value)
		});
	});

	document.querySelector('#properties-vehicle-lights-on').addEventListener('click', function(event) {
		sendMessage('setVehicleLightsOn', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-vehicle-lights-off').addEventListener('click', function(event) {
		sendMessage('setVehicleLightsOff', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-ai-on').addEventListener('click', function(event) {
		sendMessage('aiOn', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-ai-off').addEventListener('click', function(event) {
		sendMessage('aiOff', {
			handle: currentEntity()
		});
	});

	document.querySelector('#properties-animation').addEventListener('click', function(event) {
		document.querySelector('#ped-options-menu').style.display = 'none';
		populateAnimationList(document.querySelector('#animation-search-filter').value);
		document.querySelector('#animation-menu').style.display = 'flex';
	});

	document.querySelector('#animation-menu-close').addEventListener('click', function(event) {
		document.querySelector('#animation-menu').style.display = 'none';
		document.querySelector('#ped-options-menu').style.display = 'flex';
	});

	document.querySelector('#animation-search-filter').addEventListener('input', function(event) {
		var self = this;
		if (!animations || Object.keys(animations).length === 0) {
			sendMessage('getAnimations', {}).then(r => r.json()).then(function(r) {
				animations = JSON.parse(r.animations);
				populateAnimationList(self.value);
			});
		} else {
			populateAnimationList(self.value);
		}
	});

	document.querySelector('#animation-search-max-results').addEventListener('input', function(event) {
		var filterVal = document.querySelector('#animation-search-filter').value;
		if (!animations || Object.keys(animations).length === 0) {
			sendMessage('getAnimations', {}).then(r => r.json()).then(function(r) {
				animations = JSON.parse(r.animations);
				populateAnimationList(filterVal);
			});
		} else {
			populateAnimationList(filterVal);
		}
	});

	document.querySelector('#pickup-search-filter').addEventListener('input', function(event) {
		populatePickupList(this.value);
	});

	document.getElementById('properties-player-model').addEventListener('click', function(event) {
		document.querySelector('#ped-options-menu').style.display = 'none';
		document.querySelector('#player-model-menu').style.display = 'flex';
	});

	document.getElementById('properties-knock-off-props').addEventListener('click', function(event) {
		sendMessage('knockOffProps', {
			handle: currentEntity()
		});
	});

	document.getElementById('walk-style-search-filter').addEventListener('input', function(event) {
		populateWalkStyleList(this.value);
	});

	document.getElementById('properties-walk-style').addEventListener('click', function(event) {
		document.getElementById('ped-options-menu').style.display = 'none';
		document.getElementById('walk-style-menu').style.display = 'flex';
	});

	document.getElementById('walk-style-menu-close').addEventListener('click', function(event) {
		document.getElementById('walk-style-menu').style.display = 'none';
		document.getElementById('ped-options-menu').style.display = 'flex';
	});

	document.getElementById('store-deleted').addEventListener('input', function(event) {
		sendMessage('setStoreDeleted', {
			toggle: this.checked
		});
	});

	document.getElementById('properties-clone-to-target').addEventListener('click', function(event) {
		var handle = currentEntity();
		openEntitySelect('ped-options-menu', function(entity) {
			sendMessage('clonePedToTarget', {
				handle: handle,
				target: entity
			});
		}, handle);
	});

	document.getElementById('properties-look-at-entity').addEventListener('click', function(event) {
		var handle = currentEntity();
		openEntitySelect('ped-options-menu', function(entity) {
			sendMessage('lookAtEntity', {
				handle: handle,
				target: entity
			});
		}, handle);
	});

	document.getElementById('properties-clear-look-at').addEventListener('click', function(event) {
		sendMessage('clearLookAt', {
			handle: currentEntity()
		});
	});

	document.getElementById('properties-set-on-mount').addEventListener('click', function(event) {
		var handle = currentEntity();
		openEntitySelect('ped-options-menu', function(entity) {
			sendMessage('setOnMount', {
				handle: handle,
				entity: entity
			});
		}, handle);
	});

	document.getElementById('properties-enter-vehicle').addEventListener('click', function(event) {
		var handle = currentEntity();
		openEntitySelect('ped-options-menu', function(entity) {
			sendMessage('enterVehicle', {
				handle: handle,
				entity: entity
			});
		}, handle);
	});

	document.getElementById('properties-register-as-networked').addEventListener('click', function(event) {
		sendMessage('registerAsNetworked', {
			handle: currentEntity()
		});
	});

	document.querySelectorAll('.favourites').forEach(e => e.addEventListener('click', function(event) {
		var active = this.hasAttribute('data-active');

		if (active) {
			this.removeAttribute('data-active');
			this.style.color = null;
		} else {
			this.setAttribute('data-active', '');
			this.style.color = 'gold';
		}

		switch (this.id) {
			case 'favourite-peds':
				populatePedList(document.getElementById('ped-search-filter').value);
				break;
			case 'favourite-peds-personal':
				populatePersonalPedsList(document.getElementById('personal-peds-filter').value);
				break;
			case 'favourite-oyate':
				populatePersonalOyateList(document.getElementById('personal-oyate-filter').value);
				break;
			case 'favourite-plantas':
				populatePersonalPlantasList(document.getElementById('personal-plantas-filter').value);
				break;
			case 'favourite-objetos':
				populatePersonalObjetosList(document.getElementById('personal-objetos-filter').value);
				break;
			case 'favourite-propsets-custom':
				populatePersonalCustomPropsetList(document.getElementById('personal-propsets-custom-filter').value);
				break;
			case 'favourite-vehicles':
				populateVehicleList(document.getElementById('vehicle-search-filter').value);
				break;
			case 'favourite-objects':
				populateObjectListCategorized(document.getElementById('object-search-filter').value);
				break;
			case 'favourite-player-models':
				populatePlayerModelList(document.getElementById('player-model-search-filter').value);
				break;
			case 'favourite-weapons':
				populateWeaponList(document.getElementById('weapon-search-filter').value);
				break;
			case 'favourite-scenarios':
				populateScenarioList(document.getElementById('scenario-search-filter').value);
				break;
			case 'favourite-animations':
				populateAnimationList(document.getElementById('animation-search-filter').value);
				break;
			case 'favourite-propsets':
				populatePropsetList(document.getElementById('propset-search-filter').value);
				break;
			case 'favourite-pickups':
				populatePickupList(document.getElementById('pickup-search-filter').value);
				break;
			case 'favourite-walk-styles':
				populateWalkStyleList(document.getElementById('walk-style-search-filter').value);
				break;
		}
	}));

	document.getElementById('import-export-format').addEventListener('input', function(event) {
		var importButton = document.getElementById('import-db');

		switch (this.value) {
			case 'spooner-db-json':
				importButton.disabled = false;
				break;
			case 'map-editor-xml':
				importButton.disabled = true;
				break;
			case 'propplacer':
				importButton.disabled = true;
				break;
			case 'backup':
				importButton.disabled = false;
				break;
		}
	});

	document.getElementById('properties-clean').addEventListener('click', function(event) {
		sendMessage('cleanPed', {
			handle: currentEntity()
		});
	});

	document.getElementById('properties-scale').addEventListener('input', function(event) {
		sendMessage('setScale', {
			handle: currentEntity(),
			scale: parseFloat(this.value)
		});
	});

	document.getElementById('properties-select').addEventListener('click', function(event) {
		sendMessage('selectEntity', {
			handle: currentEntity()
		});
	});

	document.getElementById('properties-clone-ped').addEventListener('click', function(event) {
		sendMessage('clonePed', {
			handle: currentEntity()
		});
	});

	document.getElementById('properties-config-flags').addEventListener('click', function(event) {
		sendMessage('getPedConfigFlags', {
			handle: currentEntity()
		}).then(resp => resp.json()).then(resp => {
			populatePedConfigFlagsList(resp);
			document.getElementById('ped-options-menu').style.display = 'none';
			document.getElementById('config-flags-menu').style.display = 'flex';
		});
	});

	document.getElementById('close-config-flags-menu').addEventListener('click', function(event) {
		document.getElementById('config-flags-menu').style.display = 'none';
		document.getElementById('ped-options-menu').style.display = 'flex';
	});

	document.getElementById('add-config-flag').addEventListener('click', function(event) {
		var flag = parseInt(document.getElementById('config-flag').value);

		sendMessage('setPedConfigFlag', {
			handle: currentEntity(),
			flag: flag,
			value: true
		}).then(resp => resp.json()).then(resp => populatePedConfigFlagsList(resp));
	});

	document.getElementById('animation-stop').addEventListener('click', function(event) {
		sendMessage('clearPedTasks', {
			handle: currentEntity()
		});
	});

	document.getElementById('scenario-stop').addEventListener('click', function(event) {
		sendMessage('clearPedTasks', {
			handle: currentEntity()
		});
	});

	document.getElementById('properties-go-to-waypoint').addEventListener('click', function(event) {
		sendMessage('goToWaypoint', {
			handle: currentEntity()
		});
	});

	document.getElementById('properties-go-to-entity').addEventListener('click', function(event) {
		var handle = currentEntity();
		openEntitySelect('ped-options-menu', function(entity) {
			sendMessage('pedGoToEntity', {
				handle: handle,
				entity: entity
			});
		}, handle);
	});

	document.getElementById('properties-focus').addEventListener('click', function(event) {
		sendMessage('focusEntity', {
			handle: currentEntity()
		});
	});

	document.getElementById('copy-position').addEventListener('click', function(event) {
		var x = document.getElementById('properties-x').value;
		var y = document.getElementById('properties-y').value;
		var z = document.getElementById('properties-z').value;

		copyToClipboard(x + ', ' + y + ', ' + z)
	});

	// SMB: clipboard interno de posição XYZ (somente X/Y/Z, sem rotação)
	var smbCopiedPosition = null;

	document.getElementById('smb-copy-position').addEventListener('click', function(event) {
		if (!currentEntity()) return;
		smbCopiedPosition = {
			x: parseFloat(document.getElementById('properties-x').value),
			y: parseFloat(document.getElementById('properties-y').value),
			z: parseFloat(document.getElementById('properties-z').value)
		};
	});

	document.getElementById('smb-paste-position').addEventListener('click', function(event) {
		if (!currentEntity() || !smbCopiedPosition) return;
		document.getElementById('properties-x').value = smbCopiedPosition.x;
		document.getElementById('properties-y').value = smbCopiedPosition.y;
		document.getElementById('properties-z').value = smbCopiedPosition.z;
		document.getElementById('properties-x').dispatchEvent(new Event('input'));
	});

	document.getElementById('copy-rotation').addEventListener('click', function(event) {
		var p = document.getElementById('properties-pitch').value;
		var r = document.getElementById('properties-roll').value;
		var y = document.getElementById('properties-yaw').value;

		copyToClipboard(p + ', ' + r + ', ' + y);
	});

	document.getElementById('copy-attachment-position').addEventListener('click', function(event) {
		var x = document.getElementById('attachment-x').value;
		var y = document.getElementById('attachment-y').value;
		var z = document.getElementById('attachment-z').value;

		copyToClipboard(x + ', ' + y + ', ' + z)
	});

	document.getElementById('copy-model-name').addEventListener('click', function(event) {
               var modelname = document.getElementById('properties-model').innerText;
               copyToClipboard(modelname)
       });

	document.getElementById('copy-attachment-rotation').addEventListener('click', function(event) {
		var p = document.getElementById('attachment-pitch').value;
		var r = document.getElementById('attachment-roll').value;
		var y = document.getElementById('attachment-yaw').value;

		copyToClipboard(p + ', ' + r + ', ' + y);
	});

	document.getElementById('add-to-db-btn').addEventListener('click', function(event) {
		document.getElementById('object-database').style.display = 'none';
		document.getElementById('add-to-db-menu').style.display = 'flex';
	});

	document.getElementById('add-to-db-menu-close').addEventListener('click', function(event) {
		document.getElementById('add-to-db-menu').style.display = 'none';
		document.getElementById('object-database').style.display = 'flex';
	});

	document.getElementById('add-custom-entity-btn').addEventListener('click', function(event) {
		sendMessage('addCustomEntityToDatabase', {
			handle: parseInt(document.getElementById('custom-entity-handle').value)
		}).then(resp => resp.json()).then(resp => {
			document.getElementById('add-to-db-menu').style.display = 'none';
			openDatabase(resp);
		});
	});

	document.getElementById('properties-attack').addEventListener('click', function(event) {
		let handle = currentEntity();

		openEntitySelect('ped-options-menu', function(entity) {
			sendMessage('attackPed', {
				handle: handle,
				ped: entity
			});
		}, handle);
	});
});
