import AboutBox from "./AboutBox";

const aboutSections = [
  {
    title: "EXPLAIN CODE",
    points: [
      "Understand complex code with AI-powered explanations.",
      "Break down logic step by step for better clarity.",
      "Perfect for beginners and professionals alike!",
    ],
  },
  {
    title: "ANALYZE CODE",
    points: [
      "Detect inefficiencies and potential bugs instantly.",
      "Get AI-driven insights on performance and security.",
      "Optimize your code for better readability and execution!",
    ],
  },
  {
    title: "REFACTOR CODE",
    points: [
      "Enhance maintainability with AI-suggested improvements.",
      "Remove redundant code and optimize logic effortlessly.",
      "Improve scalability and keep your codebase clean!",
    ],
  },
];

function AboutContainer(): JSX.Element {
  return (
    <section className="w-full min-h-screen flex flex-wrap justify-center items-center gap-x-8 p-4">
      <AboutBox />
      <AboutBox />
      <AboutBox />
    </section>
  );
}

export default AboutContainer;
