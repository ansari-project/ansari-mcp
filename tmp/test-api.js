const axios = require('axios');

async function test() {
    try {
        const data = {
            "messages": [
                {
                    "role": "user", 
                    "content": "What is zakat?"
                }
            ]
        }
        const response = await axios.post('https://staging-api.ansari.chat/api/v2/mcp-complete', data);
        console.log("Response:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
    }
}

test();
