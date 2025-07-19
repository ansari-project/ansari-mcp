import axios from 'axios';

export async function askAnsari(question: string): Promise<string> {
    try {
        const response = await axios.post(`https://api.ansari.chat/api/v2/ayah`, {
            "surah": 0,
            "ayah": 0,
            "question": question,
            "augment_question": false,
            "use_cache": true,
            "apikey": "string"
        });
        return response.data?.response?.output ?? "No answer from Ansari.";
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