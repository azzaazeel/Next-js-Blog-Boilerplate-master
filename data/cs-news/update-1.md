April 2, 2026
Counter-Strike 2 Update
The following changes are available in the animgraph_2_beta build. To opt into the beta build, follow the instructions here: https://help.steampowered.com/en/faqs/view/5A86-0DF4-C59E-8C4A


To report bugs or provide feedback about the beta build, please email csgoteamfeedback@valvesoftware.com with the subject "AG2 Beta".


[ ANIMGRAPH 2 ]

The CS2 animation system has been updated to Animgraph 2, which reduces CPU and networking costs associated with animation.

All third-person animations have been re-authored, and in several cases adjusted in response to player feedback.

Smoothed in-air crouching transitions in first and third-person.

In support of Animgraph 2, the logic adjusting player height on sloped surfaces has been refactored.

Player height on ramps is now consistent and no longer depends on approach direction.

As a result of this change, grenade lineups on sloped surfaces may have changed.


[ ENGINE ]

Updated engine code to the latest version of Source 2.


[ CS SCRIPT ]

Added function GetRoundRemainingTime.


[ GAMEPLAY ] 

Player occlusion now uses a GPU query to prevent players clipping through thin walls when none of their bounding volume is visible.


[ SOUND ]

Mix adjustments to help accentuate jump landing sounds during combat.

New c4 equip sound.

Minor adjustments to ambient sound levels.

Fixed missing ambient sounds on team selection and end of match screens.

Fixed missing sounds in the main menu UI

Mix tweaks while taking damage

Fixed bug where DeathCam music cue was causing volume ducking for too long. 

Vertical occlusion is now more gradual at the edges of transition points in Nuke and Vertigo.

Various map audio adjustments in Baggage, Shoots, Ancient, Nuke, and Vertigo.


[ KNOWN ISSUES ]

In some rare cases, when you turn your head there will be a slight unintended camera shift.

The Karambit crouch animation has a strange wrist rotation.

Certain combinations of graphics settings result in many things rendering as solid black.

Some materials are missing their normal tint.

The Default T shirt is missing its pattern.

Overpass has broken shadows at Fountain, Playground and Long.

Rapid hand switching just shows up as a blinking weapon.

The third-person Shadow Daggers deploy animation is misbehaving.

Third-person idle animations stop during first-person weapon inspects.

The Paracord Knife is missing a deploy animation.

March 19, 2026
Counter-Strike 2 Update
[ GAMEPLAY ]
Reloading has been refactored to encourage more careful consideration of the use of ammo. When you reload a magazine-fed weapon, all remaining ammo in the magazine is discarded and a new, full magazine is taken from the reserves.
Reserve ammunition is now represented either as number of magazines, shells, or bullets, depending on the weapon.
The fill-level of the current weapon is now displayed below the ammo count.
Tuned reserve magazine counts per-weapon.

[ MAP GUIDES ]
Limited map guides are now available in Competitive and Retakes (first 5 rounds of the half, 30 node max).
sv_allow_annotations_access_level supports 3 values: 0 – disabled. 1 – limited view. 2 – full and editable.
sv_annotation_limits_max_rounds_per_half (default 5) determines how many rounds into the half guides are allowed. -1 for unlimited.
Minimal starter map guides have been added for all Active Duty maps.

[ WORKSHOP MAPS ]
Friends playing a Practice or Workshop map can be joined through the friends menu if they have Open Party set.
March 17, 2026
Counter-Strike 2 Update
[ X-Ray Scanner ]

Players in Germany and Netherlands will have an X-Ray Scanner tab in their Inventory. For those players, containers can only be opened via X-ray Scanner. The X-Ray Scanner will come preloaded with a one-time exclusive non-tradable "Genuine P250 | X-ray", which must be claimed before using the X-Ray Scanner to reveal items in other containers.

Keyless Containers, like Souvenir Packages, can be opened without the X-Ray Scanner.

March 12, 2026
Counter-Strike 2 Update
[ DEAD HAND COLLECTION ]

The Dead Hand Collection is now available, featuring 17 finishes from community contributors, and including 22 all-new gloves as rare special items.

Access items in the Dead Hand Collection via the Dead Hand Terminal, available as a weekly drop.


[ MAPS ]

Dust II

Fixed a pixel gap in a door Outside Long. 

Alpine

Updated to the latest version from the Community Workshop (Update Notes)

March 5, 2026
Counter-Strike 2 Update
[ MISC ]

Starting today, items listed for sale on Steam Community Market will remain in your inventory for use while they are listed (e.g., your weapon can be equipped in your loadout while it is listed). While listed, items cannot be consumed or modified. You can cancel your listings at any time.

Added ability to set your max offer limit for items in the Terminal, and the Arms Dealer will only show offers up to that limit.

Fixed a slight tilt in the chicken running animation.


[ MAPS ]

Inferno

Balcony at Bombsite A has been extended.

Graveyard at Bombsite A has been closed to the public. 

Clipping adjusted at small window next to Second Mid Balcony.

Warden

Updated to the latest version from the Community Workshop (Update Notes)

Sanctum

Updated to the latest version from the Community Workshop (Update Notes)


[ MAP SCRIPTING ]

Added hitEntity to OnBulletImpact event data

Added Entity.GetAbsAngularVelocity()

Added Entity.GetLocalAngularVelocity()

Added angularVelocity to Entity.Teleport()

Added CSWeaponBase.GetClipAmmo()

Added CSWeaponBase.SetClipAmmo()

Added CSWeaponBase.GetReserveAmmo()

Added CSWeaponBase.SetReserveAmmo()

Added CSWeaponData.GetMaxClipAmmo()

Added CSWeaponData.GetMaxReserveAmmo()

Fixed missing CSPlayerPawn.IsDucking()

Fixed missing CSPlayerPawn.IsDucked()

Fixed a bug where JUMP wouldn't trigger for WasInputJustPressed() and WasInputJustReleased() if the press didn't cross a tick boundary.

Fixed a bug where Entity methods GetEyePosition(), GetEyeAngles(), GetHealth(), GetMaxHealth(), and SetMaxHealth() would only work on CSPlayerPawns.

February 26, 2026
Counter-Strike 2 Update
[ MAP SCRIPTING ]

Added Instance.SetSaveData

Added Instance.GetSaveData

Workshop maps can write up to 1MB of save data.

Workshop saves leverage Steam Cloud and persist across installs.

Save data size limit can be configured with sv_workshop_map_save_data_max_filesize_mb.

Added Instance.OnModifyPlayerDamage

Called after all damage properties have been calculated, just before armor and health are modified

Replaces Instance.OnBeforePlayerDamage

Includes hitgroup in event data

Added hitgroup to OnPlayerDamage event data

Added CSDamageFlags.IGNORE_ARMOR

Added CSPlayerPawn.IsInputPressed

Added CSPlayerPawn.WasInputJustPressed

Added CSPlayerPawn.WasInputJustReleased

Added enum CSInputs

Fixed bug where CSDamageTypes was exported under the name CSDamageType

[ MISC ]

Map guides for de_ancient can now be used on de_ancient_night and vice versa.

February 24, 2026
Counter-Strike 2 Update
[ MISC ]

Mitigated a performance issue that primarily affected Windows 10 users with recent Intel CPUs.

Fixed a case where the Delete Item inventory option wasn't working.

Fixed a case of visual corruption using iron sights on AMD GPUs.

Expanding list of console variables addons are allowed to change.


[ MAPS ]

Overpass

Fixed the Party balloons.

February 10, 2026
Counter-Strike 2 Update
[ MISC ]

Localization code and text changes.

February 5, 2026
Counter-Strike 2 Update
[ MISC ]

Fixed a case where switching firstperson spectator targets would cause viewmodel animations to reset.

Fixed a case where physics calculations far from the origin were causing performance issues.


[ MAPS ]

Anubis

Adjusted player clipping around new drop.

Adjusted grenade clipping around connector (e-box :P) hole and old drop.

Poseidon

Updated to the latest version from the Community Workshop (Update Notes)

January 30, 2026
Counter-Strike 2 Update
[ GAMEPLAY ]

Damage from HE grenades that explode mid-air near the ground will no longer be calculated as if they exploded on the ground.


[ SOUND ]

Various knife sound adjustments.


[ MISC ]

Performance optimizations for exploding chickens.

Fixed a map scripting bug where Entity.SetOwner wasn't accepting undefined.

Added a method for community maps to save modified user settings. Running 'host_writeconfig_with_prompt' will prompt the user for permission to save. If accepted, some of the modified settings (radar, viewmodel, safezones, etc) will be kept after the map exits. 

Community maps are now restricted to a smaller list of allowed console commands. Use -disable_workshop_command_filtering to disable this filtering.


[ MAPS ]

Stronghold

Updated to the latest version from the Community Workshop (Update Notes)

January 27, 2026
Counter-Strike 2 Update
[ GAMEPLAY ]

Molotov/incendiary grenades that bounce off an enemy player have a one-time fuse extension added to prevent them from air-bursting when their has-never-hit-the-world timer elapses.


[ SOUND ]

Fixed a performance issue when running CS2 without a sound device.

Various knife sound adjustments.


[ MISC ]

Fixed broken cl_ent_bbox visualization for some classes of rigid dynamic entities.

Various stability improvements.


[ MAPS ]

Nuke

Adjusted hanging hard hat model render bounds to prevent shadow popping when model exited the view frustum.

Warden

Updated to the latest version from the Community Workshop (Update Notes)

Sanctum

Updated to the latest version from the Community Workshop (Update Notes)

January 23, 2026
Counter-Strike 2 Update
[ GAMEPLAY ]

Landing vertical velocity now affects landing speed penalties similar to sv_legacy_jump stamina.


[ MISC ]

Fixed an issue that led to a small number of users to erroneously receive a VAC ban. Those bans have been reversed.

Fixed a case where HUD safezone settings were not being applied.

Various server stability improvements.


[ MAPS ]

Anubis

Fixed a case where physics objects would interact with multiple overlapping convex water volumes.

Various player clipping adjustments.

Radar minimap updated to match recent changes.

January 22, 2026
Counter-Strike 2 Update
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

December 19, 2025
Counter-Strike 2 Update
[ MAJOR ]

Champions Autographs Capsule is now available for purchase, congratulations to Team Vitality!

Highlight Souvenir Packages can now be acquired for the Playoff matches.

December 9, 2025
Counter-Strike 2 Update
[ RENDERING ]

Improved shadow fidelity on view models.

Added local client icon cache for inventory items.

Fixed a case that caused a small number of users to receive an erroneous VAC ban. The bans will be removed.