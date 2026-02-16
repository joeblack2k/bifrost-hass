import { useMemo } from 'react'
import { Panel } from '../components/Panel'
import { SelectField } from '../components/SelectField'
import { ToggleSwitch } from '../components/ToggleSwitch'
import type {
  HassFakeCloudMode,
  HassPortalAction,
  HassPortalCommunication,
  HassPortalConnectionState,
  HassUiConfig,
} from '../lib/types'

const MODE_OPTIONS: Array<{ value: HassFakeCloudMode; label: string }> = [
  { value: 'off', label: 'Off (Local only)' },
  { value: 'connected', label: 'Fake cloud connected' },
  { value: 'outage', label: 'Simulate cloud outage' },
  { value: 'custom', label: 'Custom flags' },
]

const COMM_OPTIONS: Array<{ value: HassPortalCommunication; label: string }> = [
  { value: 'connected', label: 'connected' },
  { value: 'disconnected', label: 'disconnected' },
  { value: 'error', label: 'error' },
]

const CONN_OPTIONS: Array<{ value: HassPortalConnectionState; label: string }> = [
  { value: 'connected', label: 'connected' },
  { value: 'connecting', label: 'connecting' },
  { value: 'disconnected', label: 'disconnected' },
]

const ACTION_OPTIONS: Array<{ value: HassPortalAction; label: string }> = [
  { value: 'none', label: 'none' },
  { value: 'link_button', label: 'link_button' },
]

export function AdvancedPage(props: { config: HassUiConfig; onSaveConfig: (next: HassUiConfig) => Promise<void> }) {
  const cfg = props.config
  const custom = cfg.fake_cloud_custom
  const isCustom = cfg.fake_cloud_mode === 'custom'

  const haMeta = useMemo(
    () => [
      ['Timezone', cfg.hass_timezone || '-'],
      ['Latitude', cfg.hass_lat || '-'],
      ['Longitude', cfg.hass_long || '-'],
    ],
    [cfg.hass_lat, cfg.hass_long, cfg.hass_timezone],
  )

  function save(next: HassUiConfig) {
    void props.onSaveConfig(next)
  }

  return (
    <div className="space-y-4">
      <Panel title="Advanced" subtitle="Cloud emulation flags used by Hue app and third-party clients.">
        <div className="grid gap-2 sm:grid-cols-2">
          <SelectField
            label="Fake cloud mode"
            value={cfg.fake_cloud_mode}
            onChange={(v) => save({ ...cfg, fake_cloud_mode: v as HassFakeCloudMode })}
            options={MODE_OPTIONS}
            help="Default is Off. Use Connected/Outage presets or Custom for per-flag control."
          />
        </div>

        {isCustom ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <ToggleSwitch
              checked={custom.internet}
              onChange={(v) => save({ ...cfg, fake_cloud_custom: { ...custom, internet: v } })}
              label="internet"
              help="Top-level /api/<user>/config internet flag."
              wearKey="adv:internet"
            />
            <ToggleSwitch
              checked={custom.signedon}
              onChange={(v) => save({ ...cfg, fake_cloud_custom: { ...custom, signedon: v } })}
              label="portalstate.signedon"
              wearKey="adv:signedon"
            />
            <ToggleSwitch
              checked={custom.incoming}
              onChange={(v) => save({ ...cfg, fake_cloud_custom: { ...custom, incoming: v } })}
              label="portalstate.incoming"
              wearKey="adv:incoming"
            />
            <ToggleSwitch
              checked={custom.outgoing}
              onChange={(v) => save({ ...cfg, fake_cloud_custom: { ...custom, outgoing: v } })}
              label="portalstate.outgoing"
              wearKey="adv:outgoing"
            />
            <ToggleSwitch
              checked={custom.trusted}
              onChange={(v) => save({ ...cfg, fake_cloud_custom: { ...custom, trusted: v } })}
              label="portal.trust.trusted"
              wearKey="adv:trusted"
            />
            <ToggleSwitch
              checked={custom.legacy}
              onChange={(v) => save({ ...cfg, fake_cloud_custom: { ...custom, legacy: v } })}
              label="portal.legacy"
              wearKey="adv:legacy"
            />
            <SelectField
              label="portalstate.communication"
              value={custom.communication}
              onChange={(v) =>
                save({ ...cfg, fake_cloud_custom: { ...custom, communication: v as HassPortalCommunication } })
              }
              options={COMM_OPTIONS}
            />
            <SelectField
              label="portal.connectionstate"
              value={custom.connectionstate}
              onChange={(v) =>
                save({
                  ...cfg,
                  fake_cloud_custom: { ...custom, connectionstate: v as HassPortalConnectionState },
                })
              }
              options={CONN_OPTIONS}
            />
            <SelectField
              label="portal.action"
              value={custom.action}
              onChange={(v) =>
                save({
                  ...cfg,
                  fake_cloud_custom: { ...custom, action: v as HassPortalAction },
                })
              }
              options={ACTION_OPTIONS}
            />
          </div>
        ) : null}
      </Panel>

      <Panel title="Home Assistant Metadata" subtitle="Auto-synced from Home Assistant /api/config on sync/startup.">
        <div className="grid gap-2 sm:grid-cols-3">
          {haMeta.map(([k, v]) => (
            <div key={k} className="sub-panel rounded-control px-3 py-2">
              <div className="text-[11px] font-semibold tracking-[0.08em] text-ink-1/70 uppercase">{k}</div>
              <div className="mt-1 text-sm text-ink-0">{v}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
