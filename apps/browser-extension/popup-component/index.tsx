import "../styles/globals.css"

import React, { useEffect, useState } from "react"

import { AddUrl } from "./add-url"
import { API_KEY_STORAGE_KEY } from "./constants/storage"
import { useSyncStorage } from "./hooks/use-sync-storage"
import { Settings } from "./settings"
import { SettingsButton } from "./settings/settings-button"

const fetchHTML = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  console.log("tab id:", tab?.id)

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
  const [apiKey, setApiKey] = useSyncStorage(API_KEY_STORAGE_KEY, "")

  useEffect(() => {
    fetchHTML().then((htmlString) => {
      const count = htmlString.split('class="markdown').length

      console.log("markdown class elements:", count)
    })

    if (apiKey.trim() !== "") {
      const canAddUrls = apiKey !== ""

      setCanAddUrls(canAddUrls)
      setShowSettings(!canAddUrls)
    }
  }, [apiKey])

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentUrl = tabs[0].url || ""

      if (currentUrl) {
        setCurrentUrl(currentUrl)
      }
    })
  }, [])

  const saveApiKey = (apiKey: string) => {
    setCanAddUrls(apiKey !== "")
    setApiKey(apiKey)
  }

  return (
    <div className="w-72 p-2">
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
          <AddUrl apiKey={apiKey} url={currentUrl} />
        </>
      )}
    </div>
  )
}
