import Header from "@/components/Header";
import Landing from "@/components/landing_page/Landing";
import AboutBox from "@/components/landing_page/AboutBox";
import AboutContainer from "@/components/landing_page/AboutContainer";

function LandingPage(): JSX.Element {
  return (
    <section className="w-screen h-screen flex flex-col items-center">
      <Header />
      <Landing />
      <AboutContainer />
    </section>
  );
}

export default LandingPage;
