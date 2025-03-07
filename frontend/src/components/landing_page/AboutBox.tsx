function AboutBox(): JSX.Element {
  return (
    <section className="w-[27vw] min-h-[55vh] bg-editor-lighter bg-opacity-20 backdrop-blur-sm p-6 rounded-lg shadow-lg flex flex-col items-center text-center gap-4 border border-white/10">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
        MAIN TITLE
      </h2>
      <ul className="text-white text-base font-light list-disc list-inside space-y-2">
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing.</li>
        <li>Vestibulum ante ipsum primis in faucibus orci luctus.</li>
        <li>Curabitur tincidunt urna a felis hendrerit, at sagittis.</li>
        <li>Aliquam erat volutpat. Sed auctor turpis at elit.</li>
      </ul>
    </section>
  );
}

export default AboutBox;
