"use client"

import React, { useEffect, useRef } from "react"
import { SkinViewer, WalkingAnimation } from "skinview3d"
import * as THREE from "three"

interface MinecraftSkinViewerProps {
  username?: string
  skinUrl?: string
  width?: number
  height?: number
  showSword?: boolean
  transparent?: boolean
}

export default function MinecraftSkinViewer({
  username = "SenpaiSpider",
  skinUrl,
  width = 300,
  height = 400,
  showSword = true,
  transparent = false,
}: MinecraftSkinViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    const actualSkinUrl = skinUrl || (username ? `https://minotar.net/skin/${username}` : undefined)

    const viewer = new SkinViewer({
      canvas: document.createElement("canvas"),
      width,
      height,
      skin: actualSkinUrl
    })

    container.innerHTML = ""
    container.appendChild(viewer.canvas)

    // Configure viewer
    viewer.fov = 60
    viewer.zoom = 0.9
    viewer.camera.position.x = -15
    viewer.camera.position.y = 10
    viewer.camera.position.z = 40

    // Add animation
    viewer.animation = new WalkingAnimation()

    // Static camera for fighting scene
    viewer.autoRotate = false
    viewer.zoom = 0.5 // Ensure model is completely visible
    viewer.camera.position.x = -15
    viewer.camera.position.y = 10
    viewer.camera.position.z = 50
    viewer.camera.lookAt(0, 0, 0)

    return () => {
      viewer.dispose()
    }
  }, [username, skinUrl, width, height, showSword])

  return (
    <div 
      ref={containerRef} 
      className={`flex items-center justify-center overflow-hidden ${transparent ? '' : 'rounded-2xl bg-gradient-to-b from-white/5 to-black/20 border border-white/10 shadow-2xl'}`}
      style={{ width, height }}
    />
  )
}
