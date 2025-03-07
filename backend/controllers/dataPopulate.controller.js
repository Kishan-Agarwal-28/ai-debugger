import {GoogleGenerativeAI }  from "@google/generative-ai";
const getDataFromLLM=async(code,action,error)=>{
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    let promptPreset;
    switch(action){
        case 'analyze':
            promptPreset=`Please analyze the following code in a detailed and structured manner. Your analysis should include the following sections:

            Code Overview: A brief description of the overall purpose and functionality of the code.
            
            Code Structure: An outline of the code structure, including major components, classes, functions, or methods. Describe the flow of control in the program.
            
            Logic and Algorithms: Explain the main logic and algorithms implemented. Include any key steps, loops, or decision-making processes.
            
            Code Quality: Provide an evaluation of the code quality. Mention if the code follows best practices, includes appropriate comments, uses meaningful variable names, etc.
            
            Potential Issues: Identify any potential issues, inefficiencies, or bugs that could arise in the code. This could include problems with readability, performance, security, or edge cases not being handled.
            
            Improvements: Suggest any possible improvements or optimizations that could make the code more efficient, maintainable, or easier to understand.
            
            Edge Cases and Testing: Comment on whether the code handles edge cases appropriately. If testing or error handling is missing, mention that and suggest improvements.
            
            Once you've analyzed the code, provide a conclusion summarizing the key points, including any strengths or weaknesses of the code. Feel free to include any additional insights or recommendations you think are relevant.
            here is the relevant piece of code for you .Please answer in context to the code `
            break;
        case 'refactor':
            promptPreset=`Please refactor the following code to improve its readability, performance, and maintainability. After refactoring, provide a well-structured analysis that includes:

Code Structure: A breakdown of the changes you made to the code structure for clarity and efficiency.
Performance Improvements: Any optimizations or enhancements for better performance.
Maintainability Considerations: How the refactored code is easier to maintain in the long run, including best practices followed.
Complexity Analysis: A discussion of the complexity (both time and space) of the original code versus the refactored code.
Edge Cases Handled: Any edge cases or potential issues that were addressed in the refactored version.
Here is the code to refactor:`
            break;
        case 'explain':
            promptPreset=`Please explain the following code in simple terms, breaking it down into key sections. Start by describing the purpose of the code and then go step-by-step through each part, explaining what it does, how it works, and why it is necessary. Make the explanation clear and easy to understand for someone who is new to programming. Here's the code`
            break;
        default:
            promptPreset=``
            break;
    }
    let prompt;
    if(error){
     prompt = `${promptPreset}\n
${code} here is the error message we are getting ${error}`;
    }
    else{
        prompt=`${promptPreset}\n ${code}`;
    }
    const result = await model.generateContent(prompt);
   return result.response.text();
}
const executeCode=async(code,stdin,compiler)=>{
    const compileData = {
        code: code,
        options: '', 
        compiler: compiler,
        'compiler-option-raw': '', 
        stdin: stdin,
    };
    fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(compileData)
    })
    .then(response => {
        consoleOverlay("hide");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data)=>{
        if(data.program_output !=''){
correctOutput(data.program_output);
    }
    else{
        let compilerError=data.compiler_error;
        let programError=data.program_error;
        if(compilerError !=""){
            errorOutput(compilerError);
        }
        if(programError !=""){
errorOutput(programError);
        }
    }
    })
    .catch(error => console.error('Error:', error));
}
export const handleUser = (socket) => {
    //TODO: analyze explain refactor 
    socket.on('analyze',async(data)=>{
        const {code,action,error}=data;
        const result=await getDataFromLLM(code,action,error);
        console.log(result);
        socket.emit('analyze',result);
})
socket.on('explain',async(data)=>{
    const {code,action,error}=data;
    const result=await getDataFromLLM(code,action,error);
    console.log(result);
    socket.emit('explain',result);
})
socket.on('refactor',async(data)=>{
    const {code,action,error}=data;
    const result=await getDataFromLLM(code,action,error);
    console.log(result);
    socket.emit('refactor',result);
    socket.on('execute',async(data)=>{
        const {code,stdin,language}=data;
        let compiler;
        switch (language) {
            case "Java":
                compiler = 'openjdk-jdk-15.0.3+2';
                break;
            case "Python":
                compiler = 'cpython-3.12.1';
                break;
            case "C++":
                compiler = 'gcc-13.2.0';
                break;
            case "C":
                compiler = 'gcc-13.2.0-c';
                break;
            case "JS":
                compiler = 'nodejs-16.14.0';
                break;
            case "C#":
                compiler = 'mono-6.12.0.122';
                break;
            case "PHP":
                compiler = 'php-8.3.3';
                break;
            case "Ruby":
                compiler = 'ruby-3.3.1';
                break;
            case "Kotlin":
                compiler = 'kotlin-1.4.32';
                break;
            case "Dart":
                compiler = 'dart-2.13.4';
                break;
            case "Swift":
                compiler = 'swift-5.3.3';
                break;
            case "R":
                compiler = 'r-4.0.5';
                break;
            case "Go":
                compiler = 'go-1.16.3';
                break;
            case "TS":
                compiler = 'typescript-4.2.4';
                break;
            default:
                console.error('Unsupported language:', currentLanguage);
                return;
        }
        const result =await executeCode(code, stdin, compiler);
        socket.emit('execute',result);
    }
)
})
};