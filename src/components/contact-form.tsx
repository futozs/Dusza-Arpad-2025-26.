'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Küldjön üzenetet</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-neutral-300">Név</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500"
            placeholder="Az Ön neve"
          />
        </div>
        
        <div>
          <Label htmlFor="email" className="text-neutral-300">Email cím</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500"
            placeholder="pelda@email.com"
          />
        </div>
        
        <div>
          <Label htmlFor="message" className="text-neutral-300">Üzenet</Label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Írja le üzenetét..."
            className="mt-1 w-full min-h-[150px] rounded-md border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200"
        >
          Üzenet küldése
        </Button>
      </form>
    </div>
  );
}