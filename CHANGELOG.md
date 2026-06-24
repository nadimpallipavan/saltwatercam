# Changelog

All notable changes to the SaltwaterCam project will be documented in this file. The project adheres to Semantic Versioning.

## [1.1.0] - Staging (V2) - 2026-06-23

### Added
- **Biometric 360° FaceID System**: Integrated HTML5 camera viewport with rotational guidance (Yaw/Pitch/Roll) for 360° face profile enrollment.
- **Cryptographic Local Fallback Mode**: SHA-256 Web Crypto credentials hashing and local matching when Supabase credentials are not set.
- **Hybrid Biometric Caching**: Automatic browser database caching of biometric templates in local storage (`swc_local_users`) upon Supabase signUp/signIn.
- **Dynamic Header Avatars**: Replaces the header profile icon with the user's actual web-camera face template snapshot.
- **Webcam Resource Cleanup**: Explicitly terminates all camera media tracks (`track.stop()`) on modal close or scan completion to ensure webcam lights turn off immediately.
- **Staging cPanel Deployment**: Added staging-specific `.cpanel.yml` for automated deployment to the `/staging/` subdirectory.

### Removed
- Phone input and simulated SMS verification options to focus purely on biometrics and email auth.

---

## [1.0.0] - Production (V1) - 2026-06-21

### Added
- **Refined Navigation Layout**: Split multi-purpose views into standalone pages:
  - **Explore**: Interactive ecosystem map + Sightings Timeline.
  - **Marine Life**: Full species directory list.
  - **Education**: Local science and green light details + FAQs.
  - **Conservation**: Environmental resources management metrics with real Palm Beach County ERM reef data (55+ vessels, 100,000+ tons concrete, 133,000+ tons limestone).
- **Mobile Safari Compatibility**: Resolved mobile Safari rendering issue where brand logo collapsed to 0px width.
- **Robust Asset Bundling**: Bundled and dynamically imported brand logos and background graphics to guarantee deployment assets stay intact.
- **Production cPanel Deployment**: Configured `.cpanel.yml` to publish builds directly to `/public_html/`.

---

## [1.2.0] - Pending (V3) - Upcoming

### Planned / In Progress
- Pending features and feedback from the client.
