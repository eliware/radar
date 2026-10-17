# Home Screen app

Radar can be added to a phone's Home Screen and opened in standalone mode, which hides the browser address and navigation controls. The web app manifest requests portrait orientation and a dark appearance. iOS Home Screen apps use the Apple web app metadata and touch icon in `public/index.html`.

The manifest includes a wide desktop screenshot and a narrow phone screenshot for expanded install prompts. It uses separate ordinary and maskable icons. The maskable artwork leaves the required safety margin around its edges.

Open `https://radar.purinton.us` on the phone and use the browser's **Add to Home Screen** action. Launch Radar from the new Home Screen icon. The app requires a network connection. No `ServiceWorker` is active, and pages or live data are not cached for offline use.

Portrait orientation is requested through the manifest. Phone support depends on its browser and operating system. The web app cannot override platforms without orientation locking.

The manifest, icons, and screenshots are served by the Radar app at `/manifest.webmanifest`, `/icons/`, and `/screenshots/`.
