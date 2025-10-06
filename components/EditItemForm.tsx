
import React, { useState } from 'react';
import { FoodItem } from '../types';
import { categoryToIconMap } from '../services/geminiService';

interface EditItemFormProps {
    item: FoodItem;
    onSave: (updatedData: { name: string, category: string, icon: string }) => void;
    onCancel: () => void;
    allCategories: string[];
}

const EditItemForm: React.FC<EditItemFormProps> = ({ item, onSave, onCancel, allCategories }) => {
    const [name, setName] = useState(item.name);
    const [category, setCategory] = useState(item.category);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        
        const newIcon = categoryToIconMap[category] || 'fa-utensils';
        onSave({ name: name.trim(), category, icon: newIcon });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between border-2 border-blue-500">
            <div className="flex-grow flex items-center gap-4">
                <div className="w-8 text-center">
                    <i className={`fa-solid ${item.icon || 'fa-utensils'} text-xl text-slate-400`} aria-hidden="true"></i>
                </div>
                <div className="flex-grow flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-grow p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                        aria-label="Nuovo nome alimento"
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                        aria-label="Nuova categoria alimento"
                    >
                        {allCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex items-center ml-4 space-x-2 flex-shrink-0">
                <button
                    type="submit"
                    className="text-green-600 hover:text-green-800 focus:outline-none"
                    aria-label="Salva modifiche"
                >
                    <i className="fas fa-check-circle fa-lg"></i>
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label="Annulla modifiche"
                >
                    <i className="fas fa-times-circle fa-lg"></i>
                </button>
            </div>
        </form>
    );
};

export default EditItemForm;
