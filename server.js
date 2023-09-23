const express = require('express');
const OpenAI = require("openai");
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

async function sendMessage(data) {
  
  console.log(data)
  try {
 
    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: ` my name is Nived,Annual income is 15lakh, I prefer saving-type investments, I'm 20 years old, I live in mumbai , I have a current debt of 3LAKH with a 10% interest rate that i have to repay in 3 years, and I dont have a family 
      now return a json of the format : {
          "User Information": {
             "Age": 30,
             "Location": "Bangalore",
             "Annual Income": "10,00,000",
             "Monthly Income" : "",
             "Debt":
              {
                "Amount": "2,00,000",
                "Interest Rate": "10%"
             },
             "Family": "Yes",
             "Investment Type": "Saving"
          },
          "Expense Allocation": {
             "Debt Repayment": {
                "Monthly Allocation": "take from user input",
                "Priority": "take from user input"
             },
             "Emergency Fund": {
                "Monthly Allocation": "take from user input",
                "Priority": "take from user input"
             },
             "Savings and Investments": {
                "Monthly Allocation": "take from user input",
                "Priority": "take from user input"
             },
             "Living Expenses": {
                "Monthly Allocation": "take from user input",
                "Priority": "take from user input"
             },
             "Healthcare and Insurance": {
                "Monthly Allocation": "take from user input",
                "Priority": "take from user input"
             },
             "Miscellaneous": {
                "Monthly Allocation": "take from user input",
                "Priority": "take from user input"
             }
          }
       } 
       set priority as either "high" , "low", "medium" , living expense should change according to the location and also you should allocate the whole monthly income among these calculate the values using the statement givem above and return only the json 
      .`,
      temperature: 0, // Adjust the temperature as needed
      max_tokens: 500, // Adjust the max_tokens based on your desired response length
  });

    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}




app.use(bodyParser.json());

// Enable CORS for your frontend running on port 3000
app.use(cors({ origin: 'http://localhost:3001' }));

// Handle POST request to '/api/submit'
app.post('/api/user-info', async(req, res) => {
  const Data = req.body;
    try {
      const assistantResponse = await sendMessage(Data);
       // Process the form data here, e.g., save it to a database
  console.log('Received form data:', assistantResponse.choices[0].text);

  // Respond with a success message
  res.json(assistantResponse.choices[0].text);
    } catch (error) {
      console.log('error',error)
      // Handle errors here
      res.json('error');
    };

 
});

const port = 8000; // Backend server port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
