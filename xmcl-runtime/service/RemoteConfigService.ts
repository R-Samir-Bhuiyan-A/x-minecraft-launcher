
import { RemoteConfig, RemoteConfigService as IRemoteConfigService, RemoteConfigServiceKey, RemoteConfigState } from '@xmcl/runtime-api'
import { LauncherApp } from '../app/LauncherApp'
import { AbstractService, ExposeServiceKey, Singleton, StatefulService } from './Service'
import { Inject, LauncherAppKey } from '~/app'

@ExposeServiceKey(RemoteConfigServiceKey)
export class RemoteConfigService extends StatefulService<RemoteConfigState> implements IRemoteConfigService {
  constructor(@Inject(LauncherAppKey) app: LauncherApp) {
    super(app, () => new RemoteConfigState(), async () => {
      await this.refresh()
    })
  }

  @Singleton()
  async refresh(): Promise<void> {
    const url = 'https://raw.githubusercontent.com/R-Samir-Bhuiyan-A/info/refs/heads/main/xslauncher.json'
    try {
      const resp = await this.app.fetch(url)
      if (resp.ok) {
        const config = await resp.json() as RemoteConfig
        this.log(`Loaded remote config from ${url}`)
        this.state.app = config.app
        this.state.social = config.social
        this.state.features = config.features
        this.state.announcement = config.announcement
      } else {
        this.warn(`Failed to load remote config: ${resp.statusText}`)
      }
    } catch (e) {
      this.error(new Error(`Failed to load remote config`, { cause: e }))
    }
  }

  @Singleton()
  async getRemoteConfig() {
    return this.state
  }
}
