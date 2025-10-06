
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY di Gemini non trovata. Assicurati che sia impostata nelle variabili d'ambiente.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const foodCategories = ['Frutta', 'Verdura', 'Carne', 'Pesce', 'Latticini', 'Uova', 'Panetteria', 'Dispensa', 'Bevande', 'Avanzi', 'Altro'];

export const categoryToIconMap: Record<string, string> = {
    'Frutta': 'fa-apple-whole',
    'Verdura': 'fa-carrot',
    'Carne': 'fa-drumstick-bite',
    'Pesce': 'fa-fish-fins',
    'Latticini': 'fa-cheese',
    'Uova': 'fa-egg',
    'Panetteria': 'fa-bread-slice',
    'Dispensa': 'fa-jar',
    'Bevande': 'fa-bottle-water',
    'Avanzi': 'fa-bowl-rice',
    'Altro': 'fa-utensils'
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        daysToExpiry: {
            type: Type.INTEGER,
            description: "La durata di conservazione tipica in giorni. Deve essere un numero intero.",
        },
        category: {
            type: Type.STRING,
            description: "La categoria dell'alimento.",
            enum: foodCategories,
        },
        icon: {
            type: Type.STRING,
            description: "Un'icona Font Awesome 6 adatta per l'alimento (es. 'fa-apple-whole', 'fa-cheese'). Inizia con 'fa-'."
        }
    },
    required: ['daysToExpiry', 'category', 'icon'],
};


export const getFoodItemDetails = async (foodName: string, isFrozen: boolean): Promise<{ daysToExpiry: number, category: string, icon: string }> => {
    const location = isFrozen ? "conservato in congelatore" : "conservato in frigorifero";
    const prompt = `Analizza l'alimento '${foodName}'. Fornisci la sua categoria (come Frutta, Carne, Pesce, ecc.), la durata di conservazione in giorni se ${location}, e un'icona Font Awesome appropriata. La categoria deve descrivere il tipo di cibo, non il metodo di conservazione.`;
    
    const fallbackResponse = { daysToExpiry: isFrozen ? 90: 5, category: 'Altro', icon: 'fa-utensils' };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.2,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });
        
        const jsonString = response.text.trim();
        
        if (jsonString) {
             const parsed = JSON.parse(jsonString);
             // Semplice validazione
             if (parsed.daysToExpiry && parsed.category && parsed.icon) {
                 return parsed;
             }
        }
        
        console.warn(`Risposta JSON di Gemini non valida o incompleta, utilizzo i valori predefiniti.`);
        return fallbackResponse;

    } catch (error) {
        console.error("Errore durante la chiamata a Gemini API:", error);
        return fallbackResponse;
    }
};
