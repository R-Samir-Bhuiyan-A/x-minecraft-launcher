
import { ServiceKey, SharedState, StatefulService } from './Service'

export interface RemoteConfig {
  app: {
    latestVersion: string
    minVersion: string
    downloadUrl: string
    updateMessage: string
  }
  social: {
    discord: string
    github: string
    website: string
  }
  features: {
    sidebarStyle: boolean
    themeStore: boolean
    feedback: boolean
  }
  announcement: {
    message: string
    link: string
    type: 'info' | 'warning' | 'error'
  }
}

export class RemoteConfigState implements RemoteConfig {
  app = {
    latestVersion: '',
    minVersion: '',
    downloadUrl: '',
    updateMessage: '',
  }
  social = {
    discord: '',
    github: '',
    website: '',
  }
  features = {
    sidebarStyle: true,
    themeStore: true,
    feedback: true,
  }
  announcement = {
    message: '',
    link: '',
    type: 'info' as const,
  }
}

export interface RemoteConfigService extends StatefulService<RemoteConfigState> {
  refresh(): Promise<void>
  getRemoteConfig(): Promise<SharedState<RemoteConfigState>>
}

export const RemoteConfigServiceKey: ServiceKey<RemoteConfigService> = 'RemoteConfigService'
