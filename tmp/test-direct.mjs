import axios from 'axios';

async function testDirect() {
    const apiUrl = 'https://staging-api.ansari.chat/api/v2/mcp-complete';
    const data = {
        "messages": [
            {
                "role": "user", 
                "content": "What are the five pillars of Islam?"
            }
        ]
    };
    
    console.log(`Testing API at: ${apiUrl}`);
    console.log('Request data:', JSON.stringify(data, null, 2));
    
    try {
        const response = await axios.post(apiUrl, data, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000,
            validateStatus: function (status) {
                return status < 500; // Accept any status code less than 500
            }
        });
        
        console.log('\nResponse status:', response.status);
        console.log('Response headers:', response.headers);
        console.log('Response data type:', typeof response.data);
        console.log('Response data:', response.data);
        
    } catch (error) {
        console.error('\nError occurred:', error.message);
        if (error.code) {
            console.error('Error code:', error.code);
        }
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
            console.error('Response data:', error.response.data);
        }
    }
}

testDirect();
