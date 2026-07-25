"use client"

import { useState } from "react"
import { Loader2, UploadCloud, CheckCircle2 } from "lucide-react"

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("submitting")
    setErrorMessage("")

    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to submit message")
      }

      setStatus("success")
    } catch (error) {
      console.error(error)
      setStatus("error")
      setErrorMessage("An error occurred while sending your message. Please try again.")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-white/10 bg-[#0a0a0e] p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Message Sent Successfully</h3>
        <p className="text-gray-400">Our support team will review your message and get back to you shortly.</p>
        <button 
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-white/10 bg-[#0a0b0f] p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-gray-300">Full Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-colors"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-colors"
            placeholder="john@example.com"
          />
        </div>
      </div>
      
      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm font-medium text-gray-300">Message / Issue Details</label>
        <textarea 
          id="message" 
          name="message" 
          required 
          rows={4}
          className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-colors resize-none"
          placeholder="Describe your issue or inquiry in detail..."
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="attachment" className="text-sm font-medium text-gray-300">Attach Image or Video (Optional)</label>
        <div className="relative group">
          <input 
            type="file" 
            id="attachment" 
            name="attachment" 
            accept="image/*,video/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 bg-black/30 px-3 py-6 text-sm text-gray-400 group-hover:bg-white/5 group-hover:border-white/30 transition-all">
            <UploadCloud className="h-5 w-5" />
            <span>Click or drag to upload media</span>
          </div>
        </div>
      </div>

      {status === "error" && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 border border-red-500/20">
          {errorMessage}
        </div>
      )}

      <button 
        type="submit" 
        disabled={status === "submitting"}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending Message...
          </>
        ) : (
          "Submit Support Ticket"
        )}
      </button>
    </form>
  )
}
