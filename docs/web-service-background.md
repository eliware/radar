# Radar web background task

Use Windows Task Scheduler to run the Radar web app after system startup.

## Create the task

Create a task named `Radar Web`. Run these steps with administrator rights.

1. Select **Create Task**.
2. Set the task account to `SYSTEM`.
3. Select `Run whether user is logged on or not`.
4. Select **Run with highest privileges**.
5. Add an **At startup** trigger.
6. Add an action that starts Node.js with `bin/radar.mjs` as its argument.
7. Set **Start in** to the Radar repository folder.
8. Save and start the task.

The task reads `.env` from the repository folder. Give the task account read access to the folder and `.env` file. The app listens on `0.0.0.0:3000` by default.

## Start and stop both tasks

If you use the Radar desktop batch files, run `Start Radar Services.bat` to start RTL1090, then Radar Web. Run `Stop Radar Services.bat` to stop Radar Web, then RTL1090.

## Check the task

Run this command in PowerShell to check the task:

```powershell
Get-ScheduledTask -TaskName 'Radar Web' | Select-Object TaskName,State
```

Run this command to check server status:

```powershell
curl.exe http://127.0.0.1:3000/health
```

Run `ipconfig` to find the computer's Wi-Fi IPv4 address. Open `http://<computer-ip>:3000` on a second device on the same network. Allow inbound TCP endpoint `3000` in Windows Firewall for the trusted local network.
