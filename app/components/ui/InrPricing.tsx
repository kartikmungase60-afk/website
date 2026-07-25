"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Currency = "INR" | "USD" | "EUR"
type Rates = Record<Currency, number>
interface CurrencyContextValue { currency: Currency; setCurrency: (currency: Currency) => void; convertPrice: (price: string | number, sourceCurrency?: Currency) => string; rateSource: "live" | "fallback" }

const STORAGE_KEY = "hostlixo_currency"
const FALLBACK_RATES: Rates = { INR: 1, USD: 0.012, EUR: 0.011 }
const euroRegions = new Set(["AT", "BE", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES"])
const CurrencyContext = createContext<CurrencyContextValue | null>(null)

function detectCurrency(): Currency {
  const locale = navigator.languages?.[0] || navigator.language || "en-US"
  const region = locale.match(/[-_]([A-Z]{2})$/i)?.[1]?.toUpperCase()
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  if (region === "IN" || timezone === "Asia/Kolkata" || timezone === "Asia/Calcutta") return "INR"
  if ((region && euroRegions.has(region)) || (timezone.startsWith("Europe/") && timezone !== "Europe/London")) return "EUR"
  return "USD"
}

function toInr(price: string | number, sourceCurrency?: Currency) {
  if (typeof price === "number") return sourceCurrency === "USD" ? price * 83 : sourceCurrency === "EUR" ? price * 90 : price
  const numeric = Number.parseFloat(price.replace(/[^0-9.]/g, ""))
  if (Number.isNaN(numeric)) return 0
  if (sourceCurrency === "USD" || price.includes("$")) return numeric * 83
  if (sourceCurrency === "EUR" || price.includes("\u20ac")) return numeric * 90
  if (price.includes("\u00a3")) return numeric * 105
  return numeric
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, updateCurrency] = useState<Currency>("INR")
  const [rates, setRates] = useState<Rates>(FALLBACK_RATES)
  const [rateSource, setRateSource] = useState<"live" | "fallback">("fallback")

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Currency | null
    updateCurrency(stored && ["INR", "USD", "EUR"].includes(stored) ? stored : detectCurrency())
    const controller = new AbortController()
    fetch("https://api.frankfurter.app/latest?from=INR&to=USD,EUR", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("rate request failed")))
      .then((data) => {
        if (Number.isFinite(data?.rates?.USD) && Number.isFinite(data?.rates?.EUR)) {
          setRates({ INR: 1, USD: data.rates.USD, EUR: data.rates.EUR })
          setRateSource("live")
        }
      })
      .catch(() => undefined)
    return () => controller.abort()
  }, [])

  const setCurrency = (next: Currency) => {
    updateCurrency(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }
  const value = useMemo<CurrencyContextValue>(() => ({
    currency,
    setCurrency,
    rateSource,
    convertPrice: (price, sourceCurrency) => {
      const converted = toInr(price, sourceCurrency) * rates[currency]
      return new Intl.NumberFormat(currency === "INR" ? "en-IN" : currency === "EUR" ? "de-DE" : "en-US", { style: "currency", currency, maximumFractionDigits: currency === "INR" ? 0 : 2 }).format(converted)
    },
  }), [currency, rates, rateSource])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const value = useContext(CurrencyContext)
  if (!value) throw new Error("useCurrency must be used inside CurrencyProvider")
  return value
}
