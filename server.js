const express = require('express');
const OpenAI = require("openai");
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const app = express();
//const sendMessage = require('./too1');

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

async function sendMessage(data) {
    const Data = data['User Information']

  console.log(Data)
  try {

    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: ` my name is ${Data.Name},Annual income is ${Data['Annual Income']}, I prefer saving-type investments, I'm ${Data.Age} years old, I live in ${Data.Location} , I have a current debt of ${Data.Debt.Amount} with a ${Data.Debt['Interest Rate']}% interest rate that i have to repay in 3 years, and I have ${Data.Family} family
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




async function sendAdvancedMessage(riskTol) {
  try {
 
    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `if i give my risk tolerance is ${riskTol} in investing on a firm of scale of 0 to 1,where 0 represents low risk taking mentality and 1 represent high risk taking mentality. Predict what percentage of my investment should go to FD, Digital Gold,Debt Mutual fund,Mutual Fund  Give the result in json format only
      for an eg: 
      {
        "Fixed Deposit ": "",
        "Digital Gold": "",
        "Debt Mutual Fund": "",
        "Equity Mutual Fund": ""
      } 
      `,
      
      temperature: 0, // Adjust the temperature as needed
      max_tokens: 500, // Adjust the max_tokens based on your desired response length
  });

    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}


async function sendMutualFundsResponse(risk) {
  try {
 
    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `The standard deviation and sortino value of certain mutual funds are provided........
      small cap:
      Kotak small cap Fund - standard deviation = 15.54 , sortino = 3.59
      Quant small  cap Fund - Standard deviation = 19.27, sortino = 2.82
      SBI small  cap Fund - Standard deviation = 13.96, sortino = 3.52
      NIppon India small  cap Fund - Standard deviation = 16.5, sortino = 3.6
      Axis small  cap Fund - Standard deviation = 12.83, sortino = 3.57
      Large Cap :
      ICICI prudential Bluechip Fund - standard deviation = 13.24 , sortino = 2.9
      Canara Robeco Bluechip Equity Fund - standard deviation = 13 , sortino = 2.33
      Kotak  Bluechip Fund - standard deviation = 12.96 , sortino = 2.73
      Edelwelss Large cap Fund - standard deviation = 13.27 , sortino = 2.72
      Axis Bluechip Fund - standard deviation = 14.75 , sortino = 1.59

      Mid Cap:
      Quant Mid cap Fund - standard deviation = 17.23 , sortino = 3.21
      PGIM India Midcap - standard deviation = 15.72 , sortino = 3.27
      SBI Magnum Midcap Fund  - standard deviation = 14.76 , sortino = 3.33
      Kotak Emerging Equity Fund - standard deviation = 14.39 , sortino = 3.17
      sort the mutual funds in best to worst for an investor of risk tolerance ${risk} in the scale of 0 to 1 where 0 is less risk and 1 is high risk
      return the reult in json format
      return Large cap Midcap and smallcap separately
      eg: {
          "Investor_Risk_Tolerance": 0.8,
          "Mutual_Funds_Ranking": [
            {
              "Fund_Name": "Kotak Small Cap Fund",
              "Rank": 1
            },
            {
              "Fund_Name": "Axis Small Cap Fund",
              "Rank": 2
            },
            {
              "Fund_Name": "SBI Small Cap Fund",
              "Rank": 3
            },
            {
              "Fund_Name": "Nippon India Small Cap Fund",
              "Rank": 4
            },
            {
              "Fund_Name": "Quant Small Cap Fund",
              "Rank": 5
            }
          ]
        }
        `,
      
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




app.post('/api/user-advanced-info', async(req, res) => {
  const adData = req.body;
  const advData = adData['Survey Information']  
  console.log(advData)
  const risk = (advData.risk + advData.options + advData.dependency + advData.loseMoney + advData.riskOptions + advData.volatility )/6;
  const calculateRisk = risk.toFixed(1);
  console.log(calculateRisk) 

    try {
      // const assistant2Response = await sendAdvancedMessage(calculateRisk);
      // const data = JSON.parse(assistant2Response.choices[0].text);
      const assistant3Response = await sendMutualFundsResponse(calculateRisk);
      const data = JSON.parse(assistant3Response.choices[0].text)


       // Process the form data here, e.g., save it to a database
  console.log('Received form data:', data);
  


  // Respond with a success message
  res.json(data);
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
