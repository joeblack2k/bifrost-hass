# Deployment

## Docker Compose (GHCR)

Image:

- `ghcr.io/joeblack2k/bifrost-hass-ha-bridge:latest`

### Recommended steps

1. Create a folder and download the ready-to-run compose template:

```sh
mkdir -p bifrost-hass
cd bifrost-hass
curl -fsSL https://raw.githubusercontent.com/joeblack2k/bifrost-hass-ha-bridge/master/deploy/docker-compose.ghcr.yaml -o compose.yaml
```

2. Create `.env` with at least:

```env
BRIDGE_IP=192.168.1.50
HASS_URL=http://192.168.1.10:8123
HASS_TOKEN=
```

3. Start:

```sh
docker compose up -d
```

4. Open:

- `http://<BRIDGE_IP>/bifrost/ui`

No manual `config.yaml` editing is required for the standard flow.
