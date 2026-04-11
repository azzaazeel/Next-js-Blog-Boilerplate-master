---
title: "CS2 Update: January 30, 2026"
date: "2026-01-30"
type: "Update"
marketImpact: "Low"
---

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