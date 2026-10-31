import AboutSection from './about-section'
import HomeFooter from './home-footer'
import ProfileSection from './profile-section'

export default function HomePage() {
  return (
    <>
      <section className="mx-auto w-full max-w-[550px] px-4 pt-8 pb-28 font-serif md:px-0 md:pt-[116px] md:pb-[110px]">
        <ProfileSection />
        <AboutSection />
      </section>

      <HomeFooter />
    </>
  )
}
