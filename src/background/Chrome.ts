import { StorageKey, StorageValue } from '../types'

const { runtime, commands, action, tabs, storage, notifications } = chrome

const getStorage = async (keys: StorageKey[]): Promise<any> => {
  return await new Promise((resolve) => {
    storage.local.get(keys, (data) => {
      resolve(data)
    })
  })
}

const setStorage = async (value: Partial<StorageValue>): Promise<void> => {
  await new Promise((resolve) => {
    storage.local.set(value)
  })
}

export {
  runtime,
  commands,
  action,
  tabs,
  notifications,
  getStorage,
  setStorage
}
