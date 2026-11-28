# Avelis Hub BL

Avelis Hub BL is an Android-only **BONELAB code mod** for standalone Meta Quest. It adds a page to BoneLib’s existing Bone Menu and an optional black-and-white, world-space panel with Lucide icons. Nothing runs outside the game at play time. Fusion is not required; the hub pauses gameplay overrides when it detects a Fusion session.

## Install on Quest

1. Back up your BONELAB data and OBBs before patching. Patch and launch BONELAB with **LemonLoader 0.6.5.1**, grant its requested file permissions, and let the first run finish.
2. Install a Quest build of **BoneLib** that already works with your game patch and loader. The supplied compile reference is BoneLib **3.2.2**; its Thunderstore manifest declares the upstream MelonLoader 0.6.6 package, not an on-device LemonLoader compatibility guarantee. Confirm Bone Menu opens with your Quest setup before adding the hub.
3. With BONELAB closed, put **only** `AvelisHubBL.dll` in the existing `/sdcard/MelonLoader/<package name>/Mods/` folder. Use the package folder created by LemonLoader. Do not put reference DLLs from this repository in `Mods`.
4. Start BONELAB and enter a single-player scene. Open **Bone Menu → Avelis Hub BL**, or press **X + Y** together on the left controller. Aim with the right controller and press **A** to select. X + Y closes the panel.

## Controls

| Page | Controls |
| --- | --- |
| Player | Game invincibility mode, restore health, reserve and magazine ammo, no recoil for compatible held weapons, jump boost, avatar speed, freeze. |
| Weapons | Held weapon information, scoped projectile damage and recoil, fire-rate multiplier, refill an empty magazine where supported, reset. Automatic refill replenishes an attached magazine; it does not physically insert a new magazine or rack the slide. |
| Spawning | Refresh the active Asset Warehouse, search by name or barcode, cycle through crates and tags, set distance, quantity and yaw, place on surfaces, and remove tracked spawns. Untagged content remains available through **All**. |
| Movement | Flight or noclip: left stick moves horizontally, right stick moves vertically. Teleport aims from the headset and checks for a walkable landing and headroom. Caution: move into open space before turning noclip off. |
| World | Gravity and time multipliers, move/scale/rotate tracked props, reset hub edits, and freeze or clear tracked NPCs. This is not a reset of the game’s save or scene state. |
| NPCs | Browse NPC crates, inspect and remove selected spawns, and freeze/unfreeze compatible bodies and puppet behaviours. |
| Utilities | Player/world reset, tracked-spawn cleanup, build information, and controller help. |
| Settings | Save, load, or restore defaults using LemonLoader’s preferences in UserData. Save explicitly to keep changes between launches. |

The two menus share settings. Movement and combat overrides start neutral unless you load or save different values. Changes are scoped to the local rig, compatible held guns, and this hub’s tracked spawns where possible. The warehouse does not guarantee tags on third-party crates. Crate resolution and spawning depend on the game patch and installed pallets.

## Build from source

Use the .NET 8 SDK. The project compiles a managed IL-only DLL, not an APK, EXE, or desktop mod. LemonLoader supplies the Quest ARM64 runtime. The source distribution does not redistribute BONELAB or its generated Unity/game references.

Extract the supplied reference bundle as `GameReferences/`, or pass `-p:GameReferencesDir=/path/to/GameReferences`. Match reference assemblies to your working target installation:

- `GameReferences/MelonLoader/net8/`: `MelonLoader.dll`, `Il2CppInterop.Runtime.dll`, and `0Harmony.dll` from `melon_data.zip` on the LemonLoader 0.6.5.1 release page.
- `GameReferences/MelonLoader/Il2CppAssemblies/`: `Il2Cppmscorlib.dll` from the patched Quest installation.
- `GameReferences/Unity/`: `UnityEngine.CoreModule.dll`, `UnityEngine.PhysicsModule.dll`, and `UnityEngine.TextRenderingModule.dll` from the target IL2CPP installation.
- `GameReferences/Mods/`: `BoneLib.dll` from the compatible Quest installation.

```sh
dotnet publish AvelisHubBL/AvelisHubBL.csproj -c Release
```

The output is `AvelisHubBL/bin/Release/net8.0/publish/AvelisHubBL.dll`. `bash scripts/package.sh` generates the downloadable DLL, a source archive, and checksums in `dist/` for distribution. It does not build or deploy the game.

## Verification and troubleshooting

- **Not device-tested.** The attached reference bundle did not include `Il2CppSLZ.Marrow.dll`, `Assembly-CSharp.dll`, a BONELAB patch identifier, or Quest runtime logs. The hub checks game API signatures at startup and locks unsupported controls instead of substituting guessed calls. Successful compilation does not verify Quest runtime compatibility.
- **No fall damage** is not implemented as a separate toggle: no fall-only damage hook was verified. The game’s invincibility mode is separate and may not prevent scripted deaths. Rapid fire preserves the gun’s supported firing mode; bolt-action and custom systems may ignore the timing override. NPC behavior control is limited to freeze and unfreeze.
- **Hub missing in Bone Menu:** Check that BoneLib and Bone Menu work without Avelis. Check the loader’s `Latest.log` for `Avelis Hub BL` and any loader or assembly errors. Remove older copies of the hub from `Mods`.
- **Control locked:** Read the startup capability line in `Latest.log`. Match BoneLib and generated interop libraries to the installed game patch. If settings prevent loading a scene, close the game and remove only the `[AvelisHubBL]` preference category from `MelonPreferences.cfg` after making a backup.
- **Search empty:** Refresh the warehouse after loading a level and try the **All** category. The game can reject unavailable assets or crates with spawn policies. The hub does not bypass those policies.
- **Quest smoke test:** Check both menus and closing/opening with X + Y; test one setting at a time in an offline sandbox; drop a modified weapon and check its original rate; spawn one prop and NPC, freeze/unfreeze and clean them up; turn noclip off in clear space; change scenes with overrides on; save, relaunch, load, then reset defaults. Check `Latest.log` after each failure.

## Upstream API references

- [LemonLoader 0.6.5.1](https://github.com/LemonLoader/MelonLoader/releases/tag/0.6.5.1): official Android installer bundle and net8 loader/Harmony references. The supplied loader and interop DLLs matched the release bundle byte-for-byte.
- [BoneLib](https://github.com/yowchap/BoneLib): `Player`, `BoneMenu.Page`, `HelperMethods`, and `Extensions.SetRpm` for rig/controller access, menu controls, load state and gun timing.
- [BONELAB Fusion](https://github.com/Lakatrazz/BONELAB-Fusion): `LocalAssetSpawner`, `CrateFilterer`, `PooleePatches`, `RigManagerExtensions`, and `NetworkInfo` for async crate lifecycle, pose APIs, and session detection.
- [Thunderstore BONELAB](https://thunderstore.io/c/bonelab/): InfiniteAmmo (WeatherElectric), GunTweaker (Adi), HyperJump (Evanaellio), TagtusVR AutoReload and DynamicFlight (Astronoz) were inspected to cross-check game member names and callback signatures.
- [Lucide](https://github.com/lucide-icons/lucide): SVGs and the upstream [license](AvelisHubBL/Menu/Icons/LICENSE) for the embedded monochrome UI glyphs.
