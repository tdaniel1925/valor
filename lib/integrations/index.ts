// Integration service factory
import { WinFlexIntegration } from "./winflex"
import { IPipelineIntegration } from "./ipipeline"
import { RateWatchIntegration } from "./ratewatch"

export function getWinFlexIntegration(config: any) {
  return new WinFlexIntegration(config)
}

export function getIPipelineIntegration(config: any) {
  return new IPipelineIntegration(config)
}

export function getRateWatchIntegration(config: any) {
  return new RateWatchIntegration(config)
}

// Integration configuration from environment variables
export function getIntegrationConfigs() {
  return {
    winflex: {
      apiKey: process.env.WINFLEX_API_KEY,
      apiUrl: process.env.WINFLEX_API_URL,
    },
    ipipeline: {
      apiKey: process.env.IPIPELINE_API_KEY,
      apiUrl: process.env.IPIPELINE_API_URL,
      gaid: process.env.IPIPELINE_GAID,
    },
    ratewatch: {
      apiKey: process.env.RATEWATCH_API_KEY,
      apiUrl: process.env.RATEWATCH_API_URL,
    },
  }
}

