import { config } from '@/config'
import type { Record as DescriptionRecord } from '@altbot/lexicon'
import { CredentialManager, XRPC } from '@atcute/client'
import { defineStore } from 'pinia'

export const useDescriptionsStore = defineStore('descriptions', {
  state: () => ({
    descriptions: [] as DescriptionRecord[],
    currentDescription: null as DescriptionRecord | null,
    relatedDescriptions: [] as DescriptionRecord[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    sortedDescriptions: (state) =>
      [...state.descriptions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
  },

  actions: {
    async fetchDescription(rkey: string) {
      this.loading = true
      this.error = null

      try {
        const manager = new CredentialManager({ service: config.bot.pds })
        const rpc = new XRPC({ handler: manager })
        const { data } = await rpc.get('com.atproto.repo.getRecord', {
          params: {
            repo: config.bot.did,
            collection: config.bot.collection,
            rkey,
          },
        })

        this.currentDescription = {
          uri: data.uri,
          ...(data as { value: DescriptionRecord }).value,
        } as DescriptionRecord
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Unknown error'
        this.currentDescription = null
      } finally {
        this.loading = false
      }
    },

    async fetchRelatedDescriptions(generation: string) {
      try {
        const manager = new CredentialManager({ service: config.bot.pds })
        const rpc = new XRPC({ handler: manager })

        const { data } = await rpc.get('com.atproto.repo.listRecords', {
          params: {
            repo: config.bot.did,
            collection: config.bot.collection,
          },
        })

        this.relatedDescriptions = (data.records as { uri: string; value: DescriptionRecord }[])
          .map((record) => ({
            uri: record.uri,
            ...record.value,
          }))
          .filter((desc) => desc.generation === generation)
          .sort((a, b) => a.image - b.image)

        return this.relatedDescriptions
      } catch (e) {
        console.error('failed to fetch related descriptions:', e)
        this.relatedDescriptions = []
        return []
      }
    },

    async fetchDescriptions() {
      this.loading = true
      this.error = null

      try {
        const manager = new CredentialManager({ service: config.bot.pds })
        const rpc = new XRPC({ handler: manager })

        const { data } = await rpc.get('com.atproto.repo.listRecords', {
          params: {
            repo: config.bot.did,
            collection: config.bot.collection,
          },
        })

        const records = data.records as {
          uri: string
          value: DescriptionRecord
        }[]

        this.descriptions = records.map((record) => ({
          uri: record.uri,
          ...record.value,
        }))
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Unknown error'
      } finally {
        this.loading = false
      }
    },

    clearCurrentDescription() {
      this.currentDescription = null
      this.relatedDescriptions = []
      this.error = null
    },
  },
})
