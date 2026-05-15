import { Background } from "@/components/ui/Background";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { Building } from "@/components/sections/Building";
import { FeaturedBuilds } from "@/components/sections/FeaturedBuilds";
import { Hackathons } from "@/components/sections/Hackathons";
import { Work } from "@/components/sections/Work";
import { Education } from "@/components/sections/Education";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Background />
      <Nav />
      <main className="relative flex flex-1 flex-col">
        <Hero />
        <Building />
        <FeaturedBuilds />
        <Hackathons />
        <Work />
        <Education />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
