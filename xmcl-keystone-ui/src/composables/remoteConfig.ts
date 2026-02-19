
import { useService } from '@/composables'
import { RemoteConfigServiceKey, RemoteConfigState } from '@xmcl/runtime-api'
import { InjectionKey } from 'vue'
import { useState } from './syncableState'

export const kRemoteConfig: InjectionKey<ReturnType<typeof useRemoteConfig>> = Symbol('RemoteConfig')

export function useRemoteConfig() {
  const { getRemoteConfig, refresh } = useService(RemoteConfigServiceKey)
  const { state, isValidating, error, revalidate } = useState(getRemoteConfig, RemoteConfigState)

  return {
    config: state,
    refresh,
    isValidating,
    error,
  }
}
