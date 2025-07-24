import axios from 'axios';

export async function askAnsari(question: string, log?): Promise<string> {
    try {
        const data = {
            "messages": [
                {
                    "role": "user", 
                    "content": question
                }
            ]
        }
        const response = await axios.post(`https://api.ansari.chat/api/v1/complete`, data);
        log.info("response", response.status)
        //log.info("response", response.data)
        return response.data ?? "No answer from Ansari.";
    } catch (error) {
        console.error("Ansari API error:", error);
        return "Failed to fetch answer from Ansari API.";
    }
}


async function askAnsari2(question: string): Promise<string> {
    try {
        return "Answer from Ansari.";
    } catch (error) {
        console.error("Ansari API error:", error);
        return "Failed to fetch answer from Ansari API.";
    }
}