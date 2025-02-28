import "../styles/globals.css"

import React, { useEffect, useState } from "react"

import { scrapMetadata, type ScrappedMetadata } from "@workspace/metadata-scrapper/scrap-metadata"

import { AddUrl } from "./add-url"
import { API_KEY_STORAGE_KEY } from "./constants/storage"
import { useSyncStorage } from "./hooks/use-sync-storage"
import { Settings } from "./settings"
import { SettingsButton } from "./settings/settings-button"

const fetchHtml = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  if (!tab?.id) return

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => document.documentElement.outerHTML
  })

  return result
}

export const PopupComponent = () => {
  const [canAddUrls, setCanAddUrls] = useState(false)
  const [showSettings, setShowSettings] = useState(true)
  const [currentUrl, setCurrentUrl] = useState("")
  const [metadata, setMetadata] = useState<ScrappedMetadata | null>(null)
  const [apiKey, setApiKey] = useSyncStorage(API_KEY_STORAGE_KEY, "")

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentUrl = tabs[0].url || ""

      if (currentUrl) {
        setCurrentUrl(currentUrl)
      }
    })
  }, [])

  useEffect(() => {
    if (apiKey.trim() !== "") {
      const canAddUrls = apiKey !== ""

      setCanAddUrls(canAddUrls)
      setShowSettings(!canAddUrls)
    }
  }, [apiKey])

  useEffect(() => {
    if (canAddUrls && currentUrl) {
      setMetadata(null)

      // TODO: memoize this if needed
      fetchHtml()
        .then((html) => {
          const document = new DOMParser().parseFromString(html, "text/html")

          return scrapMetadata({
            document,
            url: currentUrl
          })
        })
        .then(setMetadata)
    }
  }, [canAddUrls, currentUrl])

  const saveApiKey = (apiKey: string) => {
    setCanAddUrls(apiKey !== "")
    setApiKey(apiKey)
  }

  return (
    <div className="w-96 p-2">
      {showSettings && (
        <Settings
          values={{ apiKey }}
          onClose={() => setShowSettings(false)}
          onSubmit={(formData) => {
            saveApiKey(formData.apiKey)
            setShowSettings(false)
          }}
        />
      )}
      {!showSettings && canAddUrls && currentUrl && (
        <>
          <SettingsButton className="absolute right-2" onClick={() => setShowSettings(true)} />
          <AddUrl apiKey={apiKey} url={currentUrl} metadata={metadata} />
        </>
      )}
    </div>
  )
}
