import { START_BREAK_HTML_PATH } from '../consts'
import { tabs } from '../utils/chrome'

const openNewTab = (): void => {
  tabs.create({
    url: 'start-break.html'
  })
}

const closeTabs = async (): Promise<void> => {
  await tabs.query({ url: START_BREAK_HTML_PATH }, async (result) => {
    result.forEach(async (tab) => {
      if (tab.id) {
        await tabs.remove(tab.id)
      }
    })
  })
}

export { openNewTab, closeTabs }
