import { Background } from "@/components/ui/Background";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { FeaturedBuilds } from "@/components/sections/FeaturedBuilds";
import { Hackathons } from "@/components/sections/Hackathons";
import { Work } from "@/components/sections/Work";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Background />
      <Nav />
      <main className="relative flex flex-1 flex-col">
        <Hero />
        <FeaturedBuilds />
        <Hackathons />
        <Work />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
