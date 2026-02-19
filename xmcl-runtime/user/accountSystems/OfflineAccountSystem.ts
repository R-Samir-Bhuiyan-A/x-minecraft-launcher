import { AuthorityMetadata, GameProfileAndTexture, LoginOptions, RefreshUserOptions, SkinPayload, UserProfile, UserException, AUTHORITY_DEV } from '@xmcl/runtime-api'
import { offline } from '@xmcl/user'
import { UserAccountSystem } from './AccountSystem'

import { UserTokenStorage } from '../userTokenStore'

export class OfflineAccountSystem implements UserAccountSystem {
  constructor(private storage: UserTokenStorage) { }

  async login(options: LoginOptions, abortSignal: AbortSignal): Promise<UserProfile> {
    const { username, properties } = options
    const auth = offline(username, properties?.uuid)
    const profile: UserProfile = {
      id: auth.selectedProfile.id,
      username,
      invalidated: false,
      profiles: {
        [auth.selectedProfile.id]: {
          id: auth.selectedProfile.id,
          name: auth.selectedProfile.name,
          textures: {
            SKIN: { url: '' },
          },
        },
      },
      selectedProfile: auth.selectedProfile.id,
      expiredAt: Number.MAX_SAFE_INTEGER,
      authority: AUTHORITY_DEV,
    }
    await this.storage.put(profile, auth.accessToken)
    return profile
  }

  async refresh(userProfile: UserProfile, signal: AbortSignal, options: RefreshUserOptions): Promise<UserProfile> {
    return userProfile
  }

  async setSkin(userProfile: UserProfile, gameProfile: GameProfileAndTexture, payload: SkinPayload, signal: AbortSignal): Promise<UserProfile> {
    return userProfile
  }

  getSupporetedAuthorityMetadata(allowThirdparty: boolean): AuthorityMetadata[] {
    return [{
      authority: AUTHORITY_DEV,
      flow: ['password'], // Technically just username, but 'password' flow usually implies simple credentials
      emailOnly: false,
      kind: 'builtin',
    }]
  }
}
