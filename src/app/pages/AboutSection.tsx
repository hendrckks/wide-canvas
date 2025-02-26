export default function AboutSection() {
  return (
    <main className="min-h-screen dark:bg-black bg-white p-20 dark:text-white text-black">
      {/* Hero Section with Video Background */}

      {/* About Section */}
      <div className="p-8 py-20">
        {/* About Content */}
        <section className="grid grid-cols-2 md:grid-cols-[200px,1fr] gap-16 mb-24">
          <h2 className="text-sm font-medium">ABOUT</h2>
          <div className="space-y-12 max-w-3xl">
            <p className="text-sm leading-relaxed font-semibold">
              I BELIEVE IN THE POWER OF VISUAL STORYTELLING AND AUTHENTICITY IN
              DOCUMENTARIES. EVERY FRAME SHOULD CAPTURE A MOMENT, EVERY SEQUENCE
              SHOULD REVEAL A TRUTH, AND EVERY STORY SHOULD TOUCH THE HEART. MY
              APPROACH COMBINES CINEMATIC ARTISTRY WITH JOURNALISTIC INTEGRITY,
              CREATING FILMS THAT ARE NOT JUST VISUALLY COMPELLING, BUT ALSO
              MEANINGFUL AND IMPACTFUL.
            </p>
            <p className="text-sm leading-relaxed font-semibold">
              I STRIVE TO UNCOVER THE DEPTH OF EACH SUBJECT'S STORY, TRANSLATING
              THEIR EXPERIENCES AND PERSPECTIVES INTO POWERFUL VISUAL NARRATIVES
              THAT RESONATE WITH AUDIENCES WORLDWIDE. FOR ME, GREAT DOCUMENTARY
              FILMMAKING IS NOT JUST ABOUT OBSERVATION—IT'S ABOUT CREATING
              AUTHENTIC CONNECTIONS AND INSPIRING SOCIAL CHANGE.
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section className="grid grid-cols-2 md:grid-cols-[200px,1fr] gap-16 mb-24">
          <h2 className="text-sm font-medium">MY SERVICES</h2>
          <div className="space-y-2 text-sm font-semibold">
            <p>DOCUMENTARY FILMMAKING</p>
            <p>PHOTOGRAPHY</p>
            <p>CINEMATOGRAPHY</p>
            <p>POST-PRODUCTION</p>
          </div>
        </section>
        <section className="grid grid-cols-2 md:grid-cols-[200px,1fr] gap-16 mb-24">
          <h2 className="text-sm font-medium">
            COMPANIES I HAVE WORKED <br />
            WITH / FOR
          </h2>
          <div className="space-y-2 text-sm font-semibold">
            <p>JHR AFRICA</p>
            <p>SPRITE KENYA</p>
            <p>GOGLA</p>
            <p>SHAMELESS PODCAST</p>
            <p>RIDGEWAYS BAPTIST</p>
          </div>
        </section>

        {/* Experience Section */}
        <section className="grid grid-cols-2 md:grid-cols-[200px,1fr] gap-16 items-end">
          <h2 className="text-sm font-medium">EXPERIENCE</h2>
          <div className="flex justify-between items-end text-sm">
            <div className="text-sm font-semibold">
              <p>FOUNDER</p>
              <p>WIDE CANVAS</p>
              <p>2022-PRESENT</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
