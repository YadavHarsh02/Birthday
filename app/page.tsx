"use client"
import { HeroSection } from '@/components/sections/HeroSection'
import { MilestoneSection } from '@/components/sections/MilestoneSection'
import { MemoryFrames } from '@/components/sections/MemoryFrames'
import { LetterSection } from '@/components/sections/LetterSection'
import { GameSection } from '@/components/sections/GameSection'
import { CakeStudio } from '@/components/sections/CakeStudio'
import { HomePageWrapper } from '@/components/HomePageWrapper'
import { ScrollBackground } from '@/components/ScrollBackground'
import { AudioPlayer } from '@/components/AudioPlayer'
import { SmoothScroll } from '@/components/SmoothScroll'
import { DepthSection } from '@/components/DepthSection'

export default function Page() {
  return (
    <HomePageWrapper>
      <SmoothScroll>
        <ScrollBackground />
        <AudioPlayer />
        <main className="text-foreground relative z-10 bg-transparent">
          <DepthSection><HeroSection /></DepthSection>
          <DepthSection><MilestoneSection /></DepthSection>
          
          {/* MemoryFrames has multiple internal screens, so we just render it directly. 
              We will wrap the internal pages of MemoryFrames in DepthSections. */}
          <MemoryFrames />
          
          <DepthSection><LetterSection /></DepthSection>
          <DepthSection><GameSection /></DepthSection>
          <DepthSection><CakeStudio /></DepthSection>
        </main>
      </SmoothScroll>
    </HomePageWrapper>
  )
}








