import Header from "@/components/Header";
import Landing from "@/components/landing_page/Landing";

function LandingPage(): JSX.Element {
  return (
    <section className="w-screen h-screen flex flex-col items-center">
      <Header />
      <Landing />
    </section>
  );
}

export default LandingPage;
