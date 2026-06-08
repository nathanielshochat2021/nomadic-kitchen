import { BuildProvider } from "@/components/BuildProvider";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Feature from "@/components/Feature";
import Configurator from "@/components/Configurator";
import Commission from "@/components/Commission";
import Gallery from "@/components/Gallery";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <BuildProvider>
      <Nav />
      <main>
        <Hero />
        <Feature />
        <Configurator />
        <Commission />
        <Gallery />
        <HowItWorks />
        <FAQ />
        <QuoteForm />
      </main>
      <Footer />
    </BuildProvider>
  );
}
