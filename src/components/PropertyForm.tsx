
import React, { useState } from 'react';
import { CustomButton } from './ui/CustomButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PropertyForm: React.FC = () => {
  const [formState, setFormState] = useState({
    address: '',
    propertyType: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    yearBuilt: '',
    description: '',
    documents: [] as File[]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormState(prev => ({ ...prev, documents: [...prev.documents, ...filesArray] }));
    }
  };
  
  const handleRemoveFile = (index: number) => {
    setFormState(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formState);
      setIsSubmitting(false);
      // Here you would normally redirect or show a success message
    }, 1500);
  };
  
  return (
    <section id="properties" className="py-20 relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -bottom-[5%] -right-[5%] w-[30%] h-[30%] bg-real-estate-100/60 rounded-full blur-3xl" />
      </div>
      
      <div className="container px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-on-scroll animate-fade-in-up">
            Submit a Property
          </h2>
          <p className="text-muted-foreground animate-on-scroll animate-fade-in-up">
            Enter property details for AI analysis and receive a comprehensive underwriting report.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-on-scroll animate-fade-in-up">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Property Address</Label>
              <Input
                id="address"
                name="address"
                value={formState.address}
                onChange={handleChange}
                placeholder="Enter full property address"
                required
                className="bg-white/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('propertyType', value)}
                required
              >
                <SelectTrigger className="bg-white/50">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="singleFamily">Single Family</SelectItem>
                  <SelectItem value="multiFamily">Multi Family</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Asking Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formState.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
                className="bg-white/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                value={formState.bedrooms}
                onChange={handleChange}
                placeholder="Number of bedrooms"
                className="bg-white/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                step="0.5"
                value={formState.bathrooms}
                onChange={handleChange}
                placeholder="Number of bathrooms"
                className="bg-white/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="squareFeet">Square Feet</Label>
              <Input
                id="squareFeet"
                name="squareFeet"
                type="number"
                value={formState.squareFeet}
                onChange={handleChange}
                placeholder="Total square footage"
                className="bg-white/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="yearBuilt">Year Built</Label>
              <Input
                id="yearBuilt"
                name="yearBuilt"
                type="number"
                value={formState.yearBuilt}
                onChange={handleChange}
                placeholder="Year property was built"
                className="bg-white/50"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Property Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formState.description}
                onChange={handleChange}
                placeholder="Enter additional details about the property"
                rows={4}
                className="bg-white/50 resize-none"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="documents">Upload Documents</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 bg-white/50">
                <Input
                  id="documents"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <label 
                  htmlFor="documents" 
                  className="flex flex-col items-center justify-center cursor-pointer py-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-muted-foreground mb-2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span className="text-sm text-muted-foreground">Drag & drop files or click to browse</span>
                  <span className="text-xs text-muted-foreground mt-1">Upload property documents, images, and reports</span>
                </label>
              </div>
              
              {/* File list */}
              {formState.documents.length > 0 && (
                <ul className="mt-3 space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                  {formState.documents.map((file, index) => (
                    <li key={index} className="text-sm flex items-center justify-between bg-white/70 rounded-md p-2">
                      <span className="truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="md:col-span-2">
              <CustomButton 
                type="submit" 
                variant="accent" 
                size="lg" 
                className="w-full rounded-lg"
                loading={isSubmitting}
              >
                Submit for Analysis
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PropertyForm;
