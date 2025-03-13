import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch'; // Ensure node-fetch is installed

// Function for interacting with Google Generative AI to analyze, refactor, or explain code
const getDataFromLLM = async (code, action, error) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  let promptPreset;
  switch (action) {
    case 'analyze':
      promptPreset = `Please analyze the following code in a detailed and structured manner. Your analysis should include the following sections:
      
      Code Overview: A brief description of the overall purpose and functionality of the code.

      Code Structure: An outline of the code structure, including major components, classes, functions, or methods. Describe the flow of control in the program.

      Logic and Algorithms: Explain the main logic and algorithms implemented. Include any key steps, loops, or decision-making processes.

      Code Quality: Provide an evaluation of the code quality. Mention if the code follows best practices, includes appropriate comments, uses meaningful variable names, etc.

      Potential Issues: Identify any potential issues, inefficiencies, or bugs that could arise in the code. This could include problems with readability, performance, security, or edge cases not being handled.

      Improvements: Suggest any possible improvements or optimizations that could make the code more efficient, maintainable, or easier to understand.

      Edge Cases and Testing: Comment on whether the code handles edge cases appropriately. If testing or error handling is missing, mention that and suggest improvements.

      Once you've analyzed the code, provide a conclusion summarizing the key points, including any strengths or weaknesses of the code. Feel free to include any additional insights or recommendations you think are relevant. also provide me the link to the resources you referred in giving the response and the one i can reffer to study more about the topics
      Here is the relevant piece of code for you: `;
      break;

    case 'refactor':
      promptPreset = `Please refactor the following code to improve its readability, performance, and maintainability. After refactoring, provide a well-structured analysis that includes:

      Code Structure: A breakdown of the changes you made to the code structure for clarity and efficiency.
      Performance Improvements: Any optimizations or enhancements for better performance.
      Maintainability Considerations: How the refactored code is easier to maintain in the long run, including best practices followed.
      Complexity Analysis: A discussion of the complexity (both time and space) of the original code versus the refactored code.
      Edge Cases Handled: Any edge cases or potential issues that were addressed in the refactored version.
      Here is the code to refactor: `;
      break;

    case 'explain':
      promptPreset = `Please explain the following code in simple terms, breaking it down into key sections. Start by describing the purpose of the code and then go step-by-step through each part, explaining what it does, how it works, and why it is necessary. Make the explanation clear and easy to understand for someone who is new to programming also provide me the link to the resources you referred in giving the response and the one i can reffer to study more about the topics. Here's the code: `;
      break;

    default:
      promptPreset = '';
      break;
  }

  // Define prompt based on the presence of errors
  let prompt;
  if (error) {
    prompt = `${promptPreset}\n${code} Here is the error message we are getting: ${error}`;
  } else {
    prompt = `${promptPreset}\n${code}`;
  }

  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Function to execute the code using the Judge0 API
const executeCode = async (code, stdin, languageId, socket) => {
  const compileData = {
    source_code: code,
    language_id: languageId,
    stdin: stdin,
    wait: false,
  };

  try {
    console.log("Submitting code for execution...");
    
    // Step 1: Submit code
    const submitResponse = await fetch(`${process.env.JUDGE0CE_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': process.env.JUDGE0CE_API_KEY,
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify(compileData),
    });

    if (!submitResponse.ok) {
      throw new Error(`Submission failed! Status: ${submitResponse.status}`);
    }

    const { token } = await submitResponse.json();
    console.log("Submission token:", token);

    // Step 2: Poll for results
    let attempts = 0;
    const maxAttempts = 10;
    let isCompleted = false;

    while (!isCompleted && attempts < maxAttempts) {
      attempts++;
      
      // Emit progress to client
      socket.emit('execute-status', {
        status: 'polling',
        attempt: attempts,
        message: `Checking execution status (attempt ${attempts}/${maxAttempts})...`
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      const statusResponse = await fetch(`${process.env.JUDGE0CE_URL}/submissions/${token}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.JUDGE0CE_API_KEY,
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        },
      });

      if (!statusResponse.ok) {
        throw new Error(`Status check failed! Status: ${statusResponse.status}`);
      }

      const resultData = await statusResponse.json();
      console.log("Execution status:", resultData.status.description);

      if (resultData.status.id >= 3) { // Status ID 3 or greater means processing is finished
        isCompleted = true;
        
        // Prepare execution result
        const result = {
          status: resultData.status.description,
          stdout: resultData.stdout || '',
          stderr: resultData.stderr || '',
          compile_output: resultData.compile_output || '',
          message: resultData.message || '',
          time: resultData.time || '',
          memory: resultData.memory || '',
          exit_code: resultData.exit_code || 0,
          error: null
        };

        // Handle different execution outcomes
        if (resultData.status.id === 3) {
          // Successful execution
          socket.emit('execute-result', {
            success: true,
            ...result
          });
        } else {
          // Execution finished with errors
          socket.emit('execute-result', {
            success: false,
            ...result,
            error: resultData.status.description
          });
        }
        return;
      }
    }

    if (!isCompleted) {
      throw new Error('Execution timed out after maximum attempts');
    }

  } catch (error) {
    console.error('Code execution error:', error);
    socket.emit('execute-result', {
      success: false,
      error: error.message,
      stdout: '',
      stderr: error.message,
      status: 'Error'
    });
  }
};

// Example of output handlers (you can replace these with actual handlers in your code)
const correctOutput = (output) => {
  console.log('Correct Output:', output);
};

const errorOutput = (error) => {
  console.error('Error Output:', error);
};

// Handling different user actions via socket (e.g., analyze, explain, refactor, execute)
export const handleUser = (socket) => {
  socket.on('analyze', async (data) => {
    const { code, action, error } = data;
    const result = await getDataFromLLM(code, action, error);
    console.log(result);
    socket.emit('analyze', result);
  });

  socket.on('explain', async (data) => {
    const { code, action, error } = data;
    const result = await getDataFromLLM(code, action, error);
    console.log(result);
    socket.emit('explain', result);
  });

  socket.on('refactor', async (data) => {
    const { code, action, error } = data;
    const result = await getDataFromLLM(code, action, error);
    console.log(result);
    socket.emit('refactor', result);
  });

  socket.on('execute', async (data) => {
    const { code, stdin, language } = data;
    let languageId;

    switch (language) {
      case 'Java':
        languageId = 91; // Language ID for Java in Judge0
        break;
      case 'Python':
        languageId = 70; // Language ID for Python in Judge0
        break;
      case 'C++':
        languageId = 76; // Language ID for C++ in Judge0
        break;
      case 'C':
        languageId = 104; // Language ID for C in Judge0
        break;
      case 'JS':
        languageId = 93; // Language ID for JS in Judge0
        break;
      case 'C#':
        languageId = 51; // Language ID for C# in Judge0
        break;
      case 'Go':
        languageId = 95; // Language ID for Go in Judge0
        break;
      case 'TS':
        languageId = 94; // Language ID for TypeScript in Judge0
        break;
      default:
        console.error('Unsupported language:', language);
        return;
    }

    try {
      await executeCode(code, stdin, languageId, socket);
    } catch (error) {
      socket.emit('execute-result', {
        success: false,
        error: error.message,
        status: 'Error'
      });
    }
  });
};
