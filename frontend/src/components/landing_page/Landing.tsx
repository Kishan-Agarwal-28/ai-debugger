import { Bug, Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const messages = [
  "Debug smarter, not harder with AI-powered assistance.",
  "Fix bugs faster and optimize your code effortlessly.",
  "Write cleaner, more efficient code with intelligent insights.",
  "Leverage AI-driven debugging for seamless development.",
];

function Landing(): JSX.Element {
  const [index, setIndex] = useState(0);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  //   useEffect(() => {
  //     if (textRef.current) {
  //       textRef.current.style.opacity = "0";
  //       textRef.current.style.transition = "opacity 0.5s ease-in-out";

  //       setTimeout(() => {
  //         if (textRef.current) textRef.current.style.opacity = "1";
  //       }, 50);
  //     }
  //   }, [index]); // Run when index changes

  return (
    <section className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center p-8 max-w-3xl h-[80vh] flex flex-col justify-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Bug className="h-10 w-10 text-primary" />
          <h1 className="text-7xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            DebugAI
          </h1>
          <Zap className="h-10 w-10 text-primary" />
        </div>

        {/* Text with fade-in effect */}
        <p
          ref={textRef}
          className="text-xl mb-8 text-foreground/60 italic font-light"
        >
          {messages[index]}
        </p>
      </div>
    </section>
  );
}

export default Landing;
