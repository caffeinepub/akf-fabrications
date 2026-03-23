import { Toaster } from "@/components/ui/sonner";
import Contact from "./components/Contact";
import Feed from "./components/Feed";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Services from "./components/Services";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Feed />
        <Contact />
      </main>
      <Footer />
      <Toaster theme="dark" />
    </div>
  );
}
