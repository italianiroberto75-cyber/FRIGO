import React, { useState } from 'react';
import { getFoodItemDetails } from '../services/geminiService';
import { FoodItem } from '../types';

interface AddItemFormProps {
    onAddItem: (item: FoodItem) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem }) => {
    const [name, setName] = useState('');
    const [isFrozen, setIsFrozen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Il nome dell'alimento non può essere vuoto.");
            return;
        }
        
        setError(null);
        setIsLoading(true);

        try {
            const { daysToExpiry, category, icon } = await getFoodItemDetails(name, isFrozen);
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + daysToExpiry);

            const newItem: FoodItem = {
                id: crypto.randomUUID(),
                name: name.trim(),
                expiryDate: expiryDate.toISOString(),
                category,
                icon,
                isFrozen,
            };

            onAddItem(newItem);
            setName('');
            setIsFrozen(false);
        } catch (err) {
            setError("C'è stato un problema nel suggerire i dettagli dell'alimento.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if(error) setError(null);
                    }}
                    placeholder="Es. Mele, Latte, Uova..."
                    className="flex-grow p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    disabled={isLoading}
                    aria-label="Nome alimento"
                />
                 <button
                    type="button"
                    onClick={() => setIsFrozen(!isFrozen)}
                    className={`font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out flex-shrink-0
                        ${isFrozen 
                            ? 'bg-blue-200 text-blue-800 ring-blue-500' 
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                    aria-pressed={isFrozen}
                    title={isFrozen ? 'Nel congelatore' : 'Metti nel congelatore'}
                >
                    <i className="fas fa-snowflake" aria-hidden="true"></i>
                </button>
                <button
                    type="submit"
                    className="bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
                    disabled={isLoading || !name.trim()}
                >
                    {isLoading ? (
                        <>
                            <i className="fas fa-spinner fa-spin mr-2" aria-hidden="true"></i>
                            <span>Aggiungo...</span>
                        </>
                    ) : (
                        <>
                            <i className="fas fa-plus mr-2" aria-hidden="true"></i>
                            <span>Aggiungi</span>
                        </>
                    )}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2 w-full" role="alert">{error}</p>}
        </form>
    );
};

export default AddItemForm;