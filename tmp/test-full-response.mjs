import axios from 'axios';

async function testDirect() {
    const apiUrl = 'https://staging-api.ansari.chat/api/v2/mcp-complete';
    
    console.log(`Testing: ${apiUrl}`);
    
    try {
        const response = await axios.post(apiUrl, {
            messages: [{
                role: "user",
                content: "What is the first pillar of Islam?"
            }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 15000
        });
        
        console.log('Status:', response.status);
        console.log('\nFull Response:');
        console.log(response.data);
        console.log('\nResponse type:', typeof response.data);
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testDirect();
