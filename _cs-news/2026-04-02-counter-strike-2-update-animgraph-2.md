---
title: "CS2 Update: April 2, 2026"
date: "2026-04-02"
type: "Update"
marketImpact: "High"
---

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