"use client"

import { Check, ChevronDown, Coins } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Currency, useCurrency } from "./ui/InrPricing"

const options: Array<{ code: Currency; symbol: string; label: string }> = [
  { code: "INR", symbol: "\u20b9", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "\u20ac", label: "Euro" },
]

export default function CurrencySelector({ mobile = false }: { mobile?: boolean }) {
  const { currency, setCurrency, rateSource } = useCurrency()
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const current = options.find((option) => option.code === currency) || options[0]

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  return (
    <div ref={root} className={`relative ${mobile ? "w-full" : ""}`}>
      <button type="button" onClick={() => setOpen((value) => !value)} aria-haspopup="listbox" aria-expanded={open} className={`flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.035] text-xs font-black text-gray-200 transition hover:border-white/30 hover:bg-white/[0.06] ${mobile ? "w-full px-4 py-3" : "px-3 py-2.5"}`}>
        <span className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-white">{current.symbol}</span>
          {currency}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-gray-500 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div role="listbox" aria-label="Select currency" className={`absolute z-[150] mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#0d0f17] p-1.5 shadow-2xl ${mobile ? "bottom-full left-0 mb-2 w-full" : "right-0 w-56"}`}>
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-[9px] font-black uppercase tracking-wider text-gray-500">Currency</span>
            <span className="text-[8px] text-gray-600">{rateSource === "live" ? "Live rates" : "Fallback rates"}</span>
          </div>
          {options.map((option) => (
            <button key={option.code} role="option" aria-selected={currency === option.code} type="button" onClick={() => { setCurrency(option.code); setOpen(false) }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${currency === option.code ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/[0.04] hover:text-white"}`}>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/20 text-sm font-black">{option.symbol}</span>
              <span className="flex-1">
                <span className="block text-xs font-black">{option.code}</span>
                <span className="block text-[9px] text-gray-600">{option.label}</span>
              </span>
              {currency === option.code && <Check className="h-4 w-4 text-white" />}
            </button>
          ))}
          <p className="flex items-center gap-1.5 px-3 py-2 text-[8px] leading-3 text-gray-600"><Coins className="h-3 w-3" />Converted prices are estimates. Checkout currency may differ.</p>
        </div>
      )}
    </div>
  )
}
