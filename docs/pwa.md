# Home Screen app

Radar can be added to a phone's Home Screen and opened in standalone mode, which hides the browser address and navigation controls. The web app manifest requests portrait orientation and a dark appearance. iOS Home Screen apps use the Apple web app metadata and touch icon in `public/index.html`.

The manifest includes one wide desktop screenshot and one narrow phone screenshot for richer install prompts. It uses separate ordinary and maskable icons; the maskable artwork leaves the required safety margin around its edges.

Open `https://radar.purinton.us` on the phone and use the browser's **Add to Home Screen** action. Launch Radar from the new Home Screen icon. The app requires a network connection: it has no service worker and does not cache pages or live data for offline use.

Portrait orientation is requested through the manifest. Whether the phone enforces that request depends on its browser and operating system; the web app cannot override a platform that does not support orientation locking.

The manifest, icons, and screenshots are served by the Radar app at `/manifest.webmanifest`, `/icons/`, and `/screenshots/`.
