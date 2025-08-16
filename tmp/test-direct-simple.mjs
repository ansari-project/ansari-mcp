import axios from 'axios';

async function testDirect() {
    const apiUrl = 'https://staging-api.ansari.chat/api/v2/mcp-complete';
    
    console.log(`Testing direct connection to: ${apiUrl}`);
    
    try {
        // Test with the simplest possible request
        const response = await axios.post(apiUrl, {
            messages: [{
                role: "user",
                content: "Hello"
            }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 10000,
            maxRedirects: 0,
            validateStatus: (status) => true // Accept any status
        });
        
        console.log('\n✓ Connection successful!');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('Headers:', JSON.stringify(response.headers, null, 2));
        
        if (response.data) {
            console.log('\nResponse data:');
            if (typeof response.data === 'string') {
                console.log('Type: string');
                console.log('Content:', response.data.substring(0, 200));
            } else {
                console.log('Type: object');
                console.log('Content:', JSON.stringify(response.data, null, 2));
            }
        }
        
    } catch (error) {
        console.error('\n✗ Connection failed');
        console.error('Error:', error.message);
        if (error.code) console.error('Code:', error.code);
        if (error.response) {
            console.error('HTTP Status:', error.response.status);
        }
    }
}

testDirect();
