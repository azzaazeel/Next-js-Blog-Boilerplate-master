---
title: "CS2 Update: January 22, 2026"
date: "2026-01-22"
type: "Update"
marketImpact: "High"
---

[ PREMIER ]

Premier Season Four has begun

Added Anubis to the Active Duty Map Pool

Removed Train from the Active Duty Map Pool


[ COMPETITIVE ]

Adjusted underlying per-map competitive matchmaking rank values. Existing per-map competitive Skill Groups have been expired, and will be displayed again once the player obtains the required number of wins


[ GAMEPLAY ]

Minor adjustments to the MP7 and MP5-SD:

Slightly increased damage

Slightly reduced damage fall-off

Reduced price by $100.

Reduced price of the PP-Bizon by $100.

Jump changes:

Landing time is now calculated with subtick precision

Jumping and landing no longer affect stamina. The landing speed penalty is now a simple function of landing time

Any jump press within sv_bhop_time_window centered on the landing time that hasn't been penalized by sv_jump_spam_penalty_time will be treated as a successful bunnyhop

Legacy jump behavior can be restored on private servers with sv_legacy_jump

Map Guides can now be loaded in online games of casual and retakes (via the ESC menu)


[ SOUND ] 

Reduced audio output latency

Higher fidelity knife draw and inspect sounds

Weapon, knife and utility draw sounds no longer overlap when switching quickly between them

Knife impact sounds are now unique based on primary fire or alt fire swings as well as front and rear attacks. This reflects the different damage amounts dealt with each attack 

Ambient sounds no longer restart from the beginning when transitioning between zones


[ WEEKLY CARE PACKAGE ]

Added two all-new weapon collections to the Weekly Care Package drop list: Harlequin, Achroma

Removed four weapon collections from the Weekly Care Package drop list: Safehouse, Dust 2, 2018 Nuke Collection, and the 2018 Inferno Collection


[ ARMORY ]

Added a new Limited Edition Item: the AK47 | Aphrodite


[ MISC ]

Increased material fidelity on some of the base guns:

Ak47

Aug

AWP

Berettas

Deagle

Galil

Mac-10

MP7

P250

Tec9

USP-S

Bizon

Cz75a

Famas

MP9

Changed voice status behavior to always show a mic for local player if mic is open 

Fixed a bug related to Deathcam intersection

Fixed some cases where the player would collide with internal edges while sliding along a ramp in surf mode

Improved the resolution of the PVS for some static level geometry

Fixed some small interpenetrations in Butterfly Knife animations

Fixed a case where blood decals weren't appearing


[ MAP SCRIPTING ]

Fixed a bug where activator was sometimes incorrect for func_door outputs OnOpen, OnFullyOpen, OnClose, and OnFullyClosed

Added BaseModelEntity.GetModelName

Added BaseModelEntity.GetModelScale

Added BaseModelEntity.GetColor

Added BaseModelEntity.IsGlowing


[ ENGINE ]

Updated engine code to the latest version of Source 2.


[ MAPS ]

Removed community maps: Golden, Palacio, Agency, and Rooftop from all game modes

Added community maps Warden, Stronghold, and Alpine to Competitive, Casual, and Deathmatch modes

Added community maps Sanctum and Poseidon to Wingman mode


Anubis

Bridge drop moved near Mid Doors

Mid doors orientation reversed

Hole added between E-box and Back of B

Bombsite A crates moved up steps on to Walkway

Scaffolding added to pillar on Bombsite A