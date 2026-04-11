---
title: "CS2 Update: March 5, 2026"
date: "2026-03-05"
type: "Update"
marketImpact: "High"
---

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