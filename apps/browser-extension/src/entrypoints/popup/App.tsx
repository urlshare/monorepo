import axios from "axios"
import React, { useEffect, useState } from "react"

import { scrapMetadata, type ScrappedMetadata } from "@workspace/metadata-scrapper/scrap-metadata"

import { AddUrl } from "./add-url"
import { API_KEY_STORAGE_KEY } from "./constants/storage"
import { useLocalStorage } from "./hooks/use-local-storage"
import { Settings } from "./settings"
import { SettingsButton } from "./settings/settings-button"
import { isHtml } from "./utils/mime-type-detection"

const fetchHtml = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  if (!tab?.id) return

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      return document.documentElement.outerHTML
    }
  })

  return result
}

const PopupComponent = () => {
  const [canAddUrls, setCanAddUrls] = useState(false)
  const [showSettings, setShowSettings] = useState(true)
  const [currentUrl, setCurrentUrl] = useState("")
  const [metadata, setMetadata] = useState<ScrappedMetadata | null>(null)
  const [apiKey, setApiKey] = useLocalStorage<string>(API_KEY_STORAGE_KEY, "")

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

      axios
        .get(currentUrl)
        .then((response) => response.headers["content-type"])
        .then((contentTypeHeader) => {
          const contentType = contentTypeHeader.split(";")[0]

          console.log(contentType)

          if (isHtml(contentType)) {
            fetchHtml().then((html) => {
              if (html) {
                const document = new DOMParser().parseFromString(html, "text/html")
                const metadata = scrapMetadata({
                  document,
                  url: currentUrl
                })

                console.log(metadata)

                setMetadata(metadata)
              }
            })
          }
        })
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

export default PopupComponent
