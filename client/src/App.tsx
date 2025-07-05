import React, { useState, useEffect } from "react";
import ChatCalculator from "./ChatCalculator";

function App() {
  const [showCalculator, setShowCalculator] = useState(false);
  
  const enterApp = () => {
    const logoPage = document.getElementById('logo-page');
    if (logoPage) {
      logoPage.style.animation = 'fadeOut 1s ease-in-out forwards';
      
      setTimeout(() => {
        setShowCalculator(true);
      }, 1000);
    }
  };

  // Interactive robot movement functionality
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      const robot = document.querySelector('.robot-container') as HTMLElement;
      if (robot && e.touches[0]) {
        const touch = e.touches[0];
        const rect = robot.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (touch.clientX - centerX) / 100;
        const deltaY = (touch.clientY - centerY) / 100;
        
        robot.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const robot = document.querySelector('.robot-container') as HTMLElement;
      if (robot) {
        const rect = robot.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) / 100;
        const deltaY = (e.clientY - centerY) / 100;
        
        robot.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      }
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (showCalculator) {
    return <ChatCalculator />;
  }

  return (
    <div id="logo-page" className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden px-4 py-8">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #6B88D3 0px, transparent 1px, transparent 30px, #6B88D3 31px), repeating-linear-gradient(90deg, #6B88D3 0px, transparent 1px, transparent 30px, #6B88D3 31px)'
          }}
        />
      </div>
      
      {/* Main Logo Container */}
      <div className="text-center z-10 w-full max-w-sm mx-auto">
        {/* Robot Character */}
        <div className="robot-container flex justify-center mb-6">
          <div className="relative scale-100">
            {/* Antenna Array */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <div className="flex flex-col items-center">
                <div className="w-1.5 h-8 bg-gradient-to-t from-primary to-accent rounded-full border border-dark-blue"></div>
                <div className="w-3 h-3 bg-accent rounded-full robot-antenna shadow-lg border-2 border-dark-blue"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-1.5 h-10 bg-gradient-to-t from-primary to-accent rounded-full border border-dark-blue"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full robot-antenna shadow-lg border-2 border-dark-blue"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-1.5 h-8 bg-gradient-to-t from-primary to-accent rounded-full border border-dark-blue"></div>
                <div className="w-3 h-3 bg-red-400 rounded-full robot-antenna shadow-lg border-2 border-dark-blue"></div>
              </div>
            </div>
            
            {/* Robot Head */}
            <div className="w-32 h-24 bg-gradient-to-b from-primary via-bg-card to-dark-blue rounded-3xl border-3 border-accent relative mb-2 shadow-2xl">
              {/* Eyes */}
              <div className="absolute top-4 left-5 w-6 h-6 robot-eye border-2 border-dark-blue shadow-lg"></div>
              <div className="absolute top-4 right-5 w-6 h-6 robot-eye border-2 border-dark-blue shadow-lg"></div>
              {/* Mouth Display */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-10 h-3 bg-accent rounded-full shadow-inner border-2 border-dark-blue flex items-center justify-center">
                <div className="w-6 h-0.5 bg-dark-blue rounded-full"></div>
              </div>
              {/* Head Details */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-accent rounded-full border-2 border-dark-blue robot-antenna"></div>
              <div className="absolute top-6 left-2 w-1.5 h-1.5 bg-green-400 rounded-full robot-antenna border border-dark-blue"></div>
              <div className="absolute top-6 right-2 w-1.5 h-1.5 bg-red-400 rounded-full robot-antenna border border-dark-blue"></div>
            </div>
            
            {/* Robot Body */}
            <div className="w-36 h-32 bg-gradient-to-b from-bg-card via-primary to-dark-blue rounded-2xl border-3 border-accent relative shadow-2xl">
              {/* Chest Panel */}
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-dark-blue border-3 border-accent rounded-xl flex items-center justify-center shadow-inner robot-chest">
                <i className="fas fa-calculator text-accent text-xl"></i>
              </div>
              
              {/* Control Panels */}
              <div className="absolute bottom-4 left-3 w-4 h-4 bg-accent rounded border-2 border-dark-blue shadow-lg robot-antenna"></div>
              <div className="absolute bottom-4 right-3 w-4 h-4 bg-green-400 rounded border-2 border-dark-blue shadow-lg robot-antenna"></div>
              <div className="absolute bottom-8 left-3 w-2 h-2 bg-red-400 rounded border border-dark-blue shadow-md robot-antenna"></div>
              <div className="absolute bottom-8 right-3 w-2 h-2 bg-blue-400 rounded border border-dark-blue shadow-md robot-antenna"></div>
              
              {/* Arms */}
              <div className="robot-arm-left absolute top-6 -left-6 w-4 h-16 bg-gradient-to-b from-primary to-dark-blue rounded-full border-3 border-accent shadow-xl">
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-accent rounded-full border-3 border-dark-blue shadow-lg"></div>
              </div>
              <div className="robot-arm-right absolute top-6 -right-6 w-4 h-16 bg-gradient-to-b from-primary to-dark-blue rounded-full border-3 border-accent shadow-xl">
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-accent rounded-full border-3 border-dark-blue shadow-lg"></div>
              </div>
            </div>
            
            {/* Robot Base */}
            <div className="w-30 h-8 bg-gradient-to-b from-primary to-dark-blue rounded-2xl border-3 border-accent mt-2 relative shadow-xl">
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full shadow-md robot-antenna border border-dark-blue"></div>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-md robot-antenna border border-dark-blue"></div>
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full shadow-md robot-antenna border border-dark-blue"></div>
              </div>
            </div>
            
            {/* Robot Legs */}
            <div className="flex justify-center space-x-6 mt-3">
              <div className="w-4 h-12 bg-gradient-to-b from-primary to-dark-blue rounded-full border-3 border-accent shadow-xl">
                <div className="w-6 h-4 bg-dark-blue rounded-full border-3 border-accent mt-8 -ml-1 shadow-lg"></div>
              </div>
              <div className="w-4 h-12 bg-gradient-to-b from-primary to-dark-blue rounded-full border-3 border-accent shadow-xl">
                <div className="w-6 h-4 bg-dark-blue rounded-full border-3 border-accent mt-8 -ml-1 shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Logo Text */}
        <div className="mb-5">
          <h1 className="logo-text text-2xl font-black text-accent tracking-wider mb-2">
            QUANTITY PRICE
          </h1>
          <h2 className="logo-text text-xl font-bold text-primary tracking-widest">
            CALCULATOR
          </h2>
        </div>
        
        {/* Subtitle */}
        <div className="subtitle-text mb-6">
          <p className="text-white text-xs font-medium tracking-wide opacity-90 leading-relaxed px-4">
            Calculate precise unit prices and quantities with our advanced retro calculator assistant
          </p>
        </div>
        
        {/* Enter Button */}
        <div className="enter-button mb-8">
          <button 
            onClick={enterApp}
            className="bg-gradient-to-r from-primary to-dark-blue hover:from-accent hover:to-primary text-white hover:text-dark-blue font-bold py-3 px-6 rounded-xl border-2 border-accent shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl tracking-widest text-sm"
          >
            <i className="fas fa-rocket mr-2"></i>
            ENTER CALCULATOR
          </button>
        </div>
        
        {/* Version Info */}
        <div className="text-center">
          <div className="text-primary text-xs font-medium tracking-wider opacity-80 mb-2">
            RETRO-BOT CALCULATOR v2.0
          </div>
          <div className="flex justify-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full robot-antenna"></div>
            <div className="w-1.5 h-1.5 bg-accent rounded-full robot-antenna"></div>
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full robot-antenna"></div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-8 left-6 w-3 h-3 bg-accent rounded-full robot-antenna opacity-40"></div>
      <div className="absolute top-16 right-6 w-2 h-2 bg-primary rounded-full robot-antenna opacity-40"></div>
      <div className="absolute bottom-16 left-4 w-1.5 h-1.5 bg-green-400 rounded-full robot-antenna opacity-40"></div>
      <div className="absolute bottom-24 right-8 w-2 h-2 bg-red-400 rounded-full robot-antenna opacity-40"></div>
    </div>
  );
}

export default App;
