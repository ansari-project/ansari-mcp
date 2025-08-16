import axios from 'axios';

async function testMCP() {
    const mcpUrl = 'http://localhost:8089/mcp';
    
    // MCP protocol request to call the tool
    const request = {
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
            name: "answer_islamic_question",
            arguments: {
                question: "What is zakat?"
            }
        },
        id: 1
    };
    
    console.log('Testing MCP endpoint:', mcpUrl);
    console.log('Request:', JSON.stringify(request, null, 2));
    
    try {
        const response = await axios.post(mcpUrl, request, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 35000 // Give it time to call the Ansari API
        });
        
        console.log('\nMCP Response:');
        console.log(JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

testMCP();
