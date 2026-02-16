![](doc/logo-title-640x160.png)

# bifrost-hass-ha-bridge

Home Assistant focused Hue Bridge emulator, based on [chrivers/bifrost](https://github.com/chrivers/bifrost).

## Recommended (No-Nonsense) Setup: Docker Compose

This is the primary way to run it.

You only need:

- a Docker host on your LAN
- Home Assistant URL
- bridge IP/MAC settings

No manual config file editing is required for the standard setup.

## 1. Create a folder

```sh
mkdir -p bifrost-hass
cd bifrost-hass
```

## 2. Download compose template

```sh
curl -fsSL https://raw.githubusercontent.com/joeblack2k/bifrost-hass-ha-bridge/master/deploy/docker-compose.ghcr.yaml -o compose.yaml
```

## 3. Create `.env`

```env
# Required: LAN IP where this bridge should be reachable
# For host networking, set this to the Docker host LAN IP.
BRIDGE_IP=192.168.1.50

# Required: Home Assistant URL
HASS_URL=http://192.168.1.10:8123

# Optional but recommended (otherwise set token in UI)
HASS_TOKEN=

# Optional
BRIDGE_NAME=Bifrost
BRIDGE_NETMASK=255.255.255.0
BRIDGE_GATEWAY=192.168.1.1
BRIDGE_TZ=Europe/Amsterdam

# Optional: if empty, MAC is auto-derived from BRIDGE_IP
BRIDGE_MAC=
```

## 4. Start

```sh
docker compose up -d
```

## 5. Open the UI

- `http://<BRIDGE_IP>/bifrost/ui`

From the UI:

1. Setup tab: check HA URL/token and connect if needed
2. Press `Sync with Home Assistant`
3. Press `Press bridge button`
4. Pair from Hue app
5. Use `Lights`, `Switches`, `Sensors`, `Hidden` tabs to add entities

## What this exposes

- `light.*` -> Hue lights
- `switch.*` -> Hue plug-like lights
- `binary_sensor.*` -> Hue motion/contact (configurable)

Default behavior:

- entities are hidden by default
- add explicitly using `Add to Hue app`

## Docker image

- `ghcr.io/joeblack2k/bifrost-hass-ha-bridge:latest`

Package page:

- [GHCR package](https://github.com/users/joeblack2k/packages/container/package/bifrost-hass-ha-bridge)

## Auto build/publish

GitHub Actions publishes a new GHCR image on every push to `master`:

- Workflow: `.github/workflows/docker-publish.yml`

Tags include:

- `latest`
- short commit SHA
- `master-YYYY-MM-DD`

## Update

```sh
docker compose pull
docker compose up -d
```

## Troubleshooting

### Hue app cannot find bridge

- phone and bridge must be on same LAN
- `BRIDGE_IP` must be reachable and correct
- if bridge identity changed, remove old pairing in Hue app and pair again

### No devices in Hue app

- entities are hidden by default
- in `/bifrost/ui`, toggle `Add to Hue app`
- run `Sync with Home Assistant` after adding new HA entities

### HA auth errors

- set a valid long-lived HA token in `.env` or in Setup tab
- verify `HASS_URL` is reachable from container

## Wiki / Docs

- [Wiki Home](wiki/Home.md)
- [Wiki Deployment](wiki/Deployment.md)
- [Wiki Troubleshooting](wiki/Troubleshooting.md)
- [Wiki Sources and Credits](wiki/Sources-and-Credits.md)
- [Config reference](doc/config-reference.md)

## Credits

Massive thanks to:

- [chrivers/bifrost](https://github.com/chrivers/bifrost)
- [diyhue/diyHue](https://github.com/diyhue/diyHue)
- [openhue/openhue-api](https://github.com/openhue/openhue-api)

## Canonical repository

- [joeblack2k/bifrost-hass-ha-bridge](https://github.com/joeblack2k/bifrost-hass-ha-bridge)
