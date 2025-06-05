
import React from 'react';
import { Users, Clock } from 'lucide-react';

const Collaborations2 = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Gelica, serif' }}>
            Collaborations
          </h3>
          <p className="text-gray-600 mb-4" style={{ fontFamily: 'Figtree, sans-serif' }}>
            This section is currently under development. Soon you'll be able to manage partnerships and collaborations with other businesses.
          </p>
        </div>
        
        <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
          <div className="flex items-center justify-center mb-3">
            <Clock className="h-5 w-5 text-accent mr-2" />
            <span className="text-accent font-medium" style={{ fontFamily: 'Figtree, sans-serif' }}>
              Coming Soon
            </span>
          </div>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Figtree, sans-serif' }}>
            We're working hard to bring you collaboration management tools that will help you partner with other businesses effectively.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Collaborations2;
