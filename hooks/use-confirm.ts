"use client"

import { useState, useCallback } from "react"
import { ConfirmDialog } from "@/components/confirm/confirm-dialog"

interface ConfirmOptions {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "default" | "destructive"
}

export function useConfirm() {
  const [state, setState] = useState<{
    open: boolean
    options: ConfirmOptions | null
    resolve: ((value: boolean) => void) | null
  }>({
    open: false,
    options: null,
    resolve: null,
  })

  const confirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({
          open: true,
          options,
          resolve,
        })
      })
    },
    []
  )

  const handleConfirm = useCallback(() => {
    if (state.resolve) {
      state.resolve(true)
    }
    setState({ open: false, options: null, resolve: null })
  }, [state])

  const handleCancel = useCallback(() => {
    if (state.resolve) {
      state.resolve(false)
    }
    setState({ open: false, options: null, resolve: null })
  }, [state])

  const ConfirmComponent = state.options ? (
    <ConfirmDialog
      open={state.open}
      onOpenChange={(open) => {
        if (!open) handleCancel()
      }}
      title={state.options.title}
      description={state.options.description}
      confirmLabel={state.options.confirmLabel}
      cancelLabel={state.options.cancelLabel}
      variant={state.options.variant}
      onConfirm={handleConfirm}
    />
  ) : null

  return {
    confirm,
    ConfirmComponent,
  }
}

