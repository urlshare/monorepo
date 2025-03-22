import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { StrictMode } from "react"

import { PopupComponent } from "~popup-component"

const queryClient = new QueryClient()

const Popup = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <PopupComponent />
      </QueryClientProvider>
    </StrictMode>
  )
}

export default Popup
