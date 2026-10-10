# Radar web background task

## Purpose

Run the Radar web app as a hidden Windows scheduled task.

## Current task

- Task name: `Radar Web`.
- Trigger: system startup.
- Account: `SYSTEM` with highest privileges.
- Program: Node.js with `bin/radar.mjs` as the argument.
- Start folder: the Radar repository root.
- Web address: `http://127.0.0.1:3000`.

The task reads `.env` from the repository root. The `SYSTEM` account needs read access to the repository and `.env`.

## Restart from the desktop

Run `Restart Radar Web.bat` on the desktop. The batch file uses SSH to stop and start the task.

## Start, stop, and check

Run these commands through the local SSH connection.

Start the task:

```powershell
ssh mir4@localhost 'Start-ScheduledTask -TaskName "Radar Web"'
```

Stop the task:

```powershell
ssh mir4@localhost 'Stop-ScheduledTask -TaskName "Radar Web"'
```

Check the task state:

```powershell
ssh mir4@localhost 'Get-ScheduledTask -TaskName "Radar Web" | Select-Object TaskName,State'
```

Check the web health route:

```powershell
curl.exe http://127.0.0.1:3000/health
```
