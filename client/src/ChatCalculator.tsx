import React, { useState, useRef, useEffect } from "react";

type CalculatorStep = 'category' | 'base-rate' | 'calculator';
type UnitCategory = 'weight' | 'volume' | null;
type RobotState = 'idle' | 'excited' | 'wave' | 'thinking' | 'calculating' | 'celebrating' | 'nodding' | 'scanning' | 'processing' | 'energizing' | 'confused' | 'amazed' | 'morphing' | 'exploding' | 'teleporting' | 'glitching' | 'levitating' | 'matrix' | 'hologram' | 'quantum' | 'cosmic' | 'dimensional' | 'weight-mode' | 'volume-mode' | 'calculator-mode' | 'result-mode' | 'reset-mode' | 'confirm-rate';

export default function ChatCalculator() {
  const [currentStep, setCurrentStep] = useState<CalculatorStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory>(null);
  const [robotState, setRobotState] = useState<RobotState>('idle');
  
  // Base rate configuration
  const [basePrice, setBasePrice] = useState<string>('');
  const [baseQuantity, setBaseQuantity] = useState<string>('');
  const [baseUnit, setBaseUnit] = useState<string>('kg');
  const [unitRate, setUnitRate] = useState<number>(0);
  
  // Calculator inputs
  const [calcPrice, setCalcPrice] = useState<string>('');
  const [calcQuantity, setCalcQuantity] = useState<string>('');
  const [calcUnit, setCalcUnit] = useState<string>('kg');
  const [priceResult, setPriceResult] = useState<string>('');
  const [quantityResult, setQuantityResult] = useState<string>('');
  const [robotStatus, setRobotStatus] = useState<string>('READY');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [calculatorTab, setCalculatorTab] = useState<'price-to-quantity' | 'quantity-to-price' | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const robotRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Offline calculation function
  const calculateOffline = (quantity: number, rate: number, category: UnitCategory): Promise<string> => {
    return new Promise((resolve) => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const channel = new MessageChannel();
        
        channel.port1.onmessage = (event) => {
          if (event.data.type === 'CALCULATION_RESULT') {
            resolve(event.data.result);
          }
        };
        
        navigator.serviceWorker.controller.postMessage({
          type: 'CALCULATE_OFFLINE',
          payload: { quantity, rate, category }
        }, [channel.port2]);
      } else {
        // Fallback calculation
        const result = quantity * rate;
        const formattedResult = category === 'weight' ? 
          result.toFixed(3) : 
          result.toFixed(2);
        resolve(`₹${formattedResult}`);
      }
    });
  };

  // Add haptic feedback for mobile (will work when built as APK)
  const triggerHaptic = async (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      // Vibration API fallback for web
      if ('vibrate' in navigator) {
        const duration = intensity === 'light' ? 50 : intensity === 'medium' ? 100 : 200;
        navigator.vibrate(duration);
      }
    } catch (error) {
      // Haptics not supported
    }
  };

  // Enhanced retro sound effects using Web Audio API
  const playRetroSound = (type: 'beep' | 'confirm' | 'calculate' | 'success' | 'select' | 'error' | 'swoosh' | 'digital' | 'laser' | 'coin' | 'power' | 'reset') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      switch(type) {
        case 'beep':
          // Classic computer beep
          const beepOsc = audioContext.createOscillator();
          const beepGain = audioContext.createGain();
          beepOsc.connect(beepGain);
          beepGain.connect(audioContext.destination);
          beepOsc.frequency.setValueAtTime(880, audioContext.currentTime);
          beepGain.gain.setValueAtTime(0.2, audioContext.currentTime);
          beepGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          beepOsc.start();
          beepOsc.stop(audioContext.currentTime + 0.1);
          break;
          
        case 'confirm':
          // Triumphant confirmation chord
          [440, 554, 659, 880].forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.08);
            gain.gain.setValueAtTime(0.15, audioContext.currentTime + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            osc.start(audioContext.currentTime + i * 0.08);
            osc.stop(audioContext.currentTime + 0.4);
          });
          break;
          
        case 'calculate':
          // Digital processing sound
          const calcOsc = audioContext.createOscillator();
          const calcGain = audioContext.createGain();
          calcOsc.connect(calcGain);
          calcGain.connect(audioContext.destination);
          calcOsc.type = 'square';
          calcOsc.frequency.setValueAtTime(300, audioContext.currentTime);
          calcOsc.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.3);
          calcGain.gain.setValueAtTime(0.1, audioContext.currentTime);
          calcGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          calcOsc.start();
          calcOsc.stop(audioContext.currentTime + 0.3);
          break;
          
        case 'success':
          // Victory fanfare
          [523, 659, 784, 1047].forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.12);
            gain.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
            osc.start(audioContext.currentTime + i * 0.12);
            osc.stop(audioContext.currentTime + 0.6);
          });
          break;
          
        case 'select':
          // Quick selection blip
          const selectOsc = audioContext.createOscillator();
          const selectGain = audioContext.createGain();
          selectOsc.connect(selectGain);
          selectGain.connect(audioContext.destination);
          selectOsc.type = 'sine';
          selectOsc.frequency.setValueAtTime(1200, audioContext.currentTime);
          selectGain.gain.setValueAtTime(0.15, audioContext.currentTime);
          selectGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.06);
          selectOsc.start();
          selectOsc.stop(audioContext.currentTime + 0.06);
          break;
          
        case 'error':
          // Error buzz
          const errorOsc = audioContext.createOscillator();
          const errorGain = audioContext.createGain();
          errorOsc.connect(errorGain);
          errorGain.connect(audioContext.destination);
          errorOsc.type = 'sawtooth';
          errorOsc.frequency.setValueAtTime(200, audioContext.currentTime);
          errorGain.gain.setValueAtTime(0.2, audioContext.currentTime);
          errorGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
          errorOsc.start();
          errorOsc.stop(audioContext.currentTime + 0.15);
          break;
          
        case 'swoosh':
          // Whoosh transition
          const swooshOsc = audioContext.createOscillator();
          const swooshGain = audioContext.createGain();
          swooshOsc.connect(swooshGain);
          swooshGain.connect(audioContext.destination);
          swooshOsc.type = 'triangle';
          swooshOsc.frequency.setValueAtTime(1500, audioContext.currentTime);
          swooshOsc.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.2);
          swooshGain.gain.setValueAtTime(0.1, audioContext.currentTime);
          swooshGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          swooshOsc.start();
          swooshOsc.stop(audioContext.currentTime + 0.2);
          break;
          
        case 'digital':
          // Digital glitch
          const digitalOsc = audioContext.createOscillator();
          const digitalGain = audioContext.createGain();
          digitalOsc.connect(digitalGain);
          digitalGain.connect(audioContext.destination);
          digitalOsc.type = 'square';
          digitalOsc.frequency.setValueAtTime(800, audioContext.currentTime);
          digitalOsc.frequency.setValueAtTime(400, audioContext.currentTime + 0.05);
          digitalOsc.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
          digitalGain.gain.setValueAtTime(0.12, audioContext.currentTime);
          digitalGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
          digitalOsc.start();
          digitalOsc.stop(audioContext.currentTime + 0.15);
          break;
          
        case 'laser':
          // Sci-fi laser
          const laserOsc = audioContext.createOscillator();
          const laserGain = audioContext.createGain();
          laserOsc.connect(laserGain);
          laserGain.connect(audioContext.destination);
          laserOsc.type = 'sawtooth';
          laserOsc.frequency.setValueAtTime(2000, audioContext.currentTime);
          laserOsc.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
          laserGain.gain.setValueAtTime(0.15, audioContext.currentTime);
          laserGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          laserOsc.start();
          laserOsc.stop(audioContext.currentTime + 0.3);
          break;
          
        case 'coin':
          // Coin collection sound
          [880, 1108, 1397].forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.05);
            gain.gain.setValueAtTime(0.15, audioContext.currentTime + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
            osc.start(audioContext.currentTime + i * 0.05);
            osc.stop(audioContext.currentTime + 0.25);
          });
          break;
          
        case 'power':
          // Power up sound
          const powerOsc = audioContext.createOscillator();
          const powerGain = audioContext.createGain();
          powerOsc.connect(powerGain);
          powerGain.connect(audioContext.destination);
          powerOsc.type = 'triangle';
          powerOsc.frequency.setValueAtTime(440, audioContext.currentTime);
          powerOsc.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.4);
          powerGain.gain.setValueAtTime(0.1, audioContext.currentTime);
          powerGain.gain.setValueAtTime(0.2, audioContext.currentTime + 0.2);
          powerGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
          powerOsc.start();
          powerOsc.stop(audioContext.currentTime + 0.4);
          break;
          
        case 'reset':
          // System reset
          const resetOsc = audioContext.createOscillator();
          const resetGain = audioContext.createGain();
          resetOsc.connect(resetGain);
          resetGain.connect(audioContext.destination);
          resetOsc.type = 'square';
          resetOsc.frequency.setValueAtTime(1000, audioContext.currentTime);
          resetOsc.frequency.linearRampToValueAtTime(200, audioContext.currentTime + 0.25);
          resetGain.gain.setValueAtTime(0.15, audioContext.currentTime);
          resetGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
          resetOsc.start();
          resetOsc.stop(audioContext.currentTime + 0.25);
          break;
      }
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const triggerRobotAnimation = (animation: RobotState) => {
    // Ensure clean state reset
    setRobotState('idle');
    
    // Force DOM update before applying animation
    setTimeout(() => {
      setRobotState(animation);
      
      const duration = animation === 'confirm-rate' ? 1600 : 
                      animation === 'excited' ? 4500 : 4800;
      
      setTimeout(() => {
        setRobotState('idle');
      }, duration);
    }, 50);
  };

  const selectCategory = (category: UnitCategory) => {
    playRetroSound('digital');
    triggerHaptic('light');
    setSelectedCategory(category);
    setCurrentStep('base-rate');
    // Category-specific robot behavior animations
    if (category === 'weight') {
      triggerRobotAnimation('weight-mode');
    } else if (category === 'volume') {
      triggerRobotAnimation('volume-mode');
    }
    
    if (category === 'weight') {
      setBaseUnit('kg');
      setCalcUnit('kg');
    } else {
      setBaseUnit('l');
      setCalcUnit('l');
    }
    
    // Add chatty robot response for category selection
    const categoryResponse = category === 'weight' ? 
      "Excellent choice! Weight calculations are perfect for solid items like grains, spices, or produce. Let's set up your rate!" :
      "Great selection! Volume calculations work wonderfully for liquids like oil, milk, or any fluid measurements. Let's configure your rate!";
    
    // Display chat response in header
    setTimeout(() => {
      const headerChat = document.querySelector('.header-chat');
      if (headerChat) {
        headerChat.innerHTML = `
          🤖 ${categoryResponse}<br />
          <span class="text-accent font-bold">Let's configure your ${category} calculations!</span><br />
          <span class="text-xs opacity-80">Enter your base price and quantity below.</span>
        `;
        // Keep the category message persistent - no revert
      }
    }, 500);
    
    setRobotStatus('PROCESSING');
    triggerRobotAnimation('excited');
    
    setTimeout(() => {
      setRobotStatus('READY');
    }, 2000);
  };

  const setBaseRate = () => {
    const price = parseFloat(basePrice);
    const quantity = parseFloat(baseQuantity);
    
    if (!price || !quantity || price <= 0 || quantity <= 0) {
      return;
    }
    
    const rate = price / quantity;
    setUnitRate(rate);
    setCurrentStep('calculator');
    
    setRobotStatus('CALCULATING');
    
    playRetroSound('power');
    triggerHaptic('medium');
    // Ensure robot is in idle state before triggering animation
    setRobotState('idle');
    
    // Delay animation trigger to ensure state is properly reset
    setTimeout(() => {
      triggerRobotAnimation('confirm-rate');
    }, 100);
    
    setTimeout(() => {
      setRobotStatus('READY');
    }, 3000);
  };

  useEffect(() => {
    if (robotRef.current) {
      robotRef.current.className = `robot-${robotState} relative scale-90`;
    }
  }, [robotState]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen h-screen flex flex-col bg-bg-dark text-white relative overflow-hidden">
      
      {/* Fixed Border Lines - Universal Position */}
      <div className="absolute top-44 left-0 w-full h-0.5 bg-primary z-30"></div>
      <div className="absolute top-44 left-1/2 bottom-0 w-0.5 bg-primary z-30"></div>
      
      {/* Chat Assistant Header */}
      <div className="h-44 bg-gradient-to-r from-bg-dark via-bg-card to-bg-dark p-4 relative">
        {/* Grid overlay for header */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            linear-gradient(rgba(239, 239, 187, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 239, 187, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '25px 25px'
        }}></div>
        <div className="flex items-start space-x-3 h-full">
          <div className="w-16 h-16 bg-gradient-to-b from-primary to-dark-blue rounded-xl border-2 border-accent flex items-center justify-center flex-shrink-0 shadow-lg relative">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-accent rounded-full robot-antenna border border-dark-blue"></div>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full robot-eye border border-dark-blue"></div>
              <div className="w-3 h-3 bg-accent rounded-full robot-eye border border-dark-blue"></div>
            </div>
            <div className="absolute -bottom-1 w-8 h-2 bg-accent rounded-full border border-dark-blue"></div>
          </div>
          
          <div className="flex-1 h-full flex flex-col min-h-0">
            <div className="text-accent text-xs sm:text-sm font-bold mb-2 tracking-wider flex items-center">
              <i className="fas fa-robot mr-2"></i>
              RETRO-BOT ASSISTANT
            </div>
            <div className="text-white text-sm sm:text-base font-semibold mb-1 tracking-wide break-words">
              Welcome to Quantity Price Calculator
            </div>
            <div className="flex-1 min-h-0">
              <div className="chat-bubble-retro w-full flex items-start">
                <div className="header-chat text-white text-xs font-medium leading-tight w-full overflow-hidden">
                  <div className="line-clamp-4">
                    🤖 Welcome to Quantity Price Calculator!<br />
                    <span className="text-accent font-bold">Select your unit category to begin calculations</span><br />
                    <span className="text-xs opacity-80">I'll help you calculate prices and quantities!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex">
        
        {/* Left Side - Enhanced Retro Robot */}
        <div className="w-1/2 bg-gradient-to-b from-bg-dark via-gray-900 to-bg-dark flex flex-col items-center justify-center p-4 relative">
          {/* Grid overlay for left side */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `
              linear-gradient(rgba(107, 136, 211, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(107, 136, 211, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}></div>
          
          {/* Rate Display - Digital Badge */}
          {currentStep === 'calculator' && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30">
              <div className="bg-black border-2 border-accent rounded-sm px-3 py-1 shadow-md relative">
                <div className="absolute inset-0 bg-accent opacity-10 rounded-sm"></div>
                <div className="relative">
                  <div className="text-accent text-xs font-mono font-bold tracking-wider">
                    ₹{unitRate.toFixed(2)}/{baseUnit}
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              </div>
            </div>
          )}

          {/* Retro Robot Character */}
          <div ref={robotRef} className="robot-idle relative scale-90">
            <div className="robot-body">
              
              {/* Antenna Array */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-8 bg-gradient-to-t from-primary to-accent rounded-full border border-dark-blue"></div>
                  <div className="w-3 h-3 bg-accent rounded-full robot-antenna shadow-md border border-dark-blue"></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-2 h-10 bg-gradient-to-t from-primary to-accent rounded-full border border-dark-blue"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full robot-antenna shadow-md border border-dark-blue"></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-2 h-8 bg-gradient-to-t from-primary to-accent rounded-full border border-dark-blue"></div>
                  <div className="w-3 h-3 bg-red-400 rounded-full robot-antenna shadow-md border border-dark-blue"></div>
                </div>
              </div>
              
              {/* Robot Head */}
              <div className="w-32 h-24 bg-gradient-to-b from-primary via-bg-card to-dark-blue rounded-2xl border-3 border-accent relative mb-2 shadow-xl">
                <div className="absolute top-4 left-4 w-6 h-6 robot-eye border-2 border-dark-blue shadow-md"></div>
                <div className="absolute top-4 right-4 w-6 h-6 robot-eye border-2 border-dark-blue shadow-md"></div>
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-accent rounded-full shadow-inner border-2 border-dark-blue"></div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-accent rounded-full border border-dark-blue robot-antenna"></div>
                <div className="absolute top-6 left-2 w-2 h-2 bg-green-400 rounded-full robot-antenna border border-dark-blue"></div>
                <div className="absolute top-6 right-2 w-2 h-2 bg-red-400 rounded-full robot-antenna border border-dark-blue"></div>
              </div>
              
              {/* Robot Body */}
              <div className="w-36 h-32 bg-gradient-to-b from-bg-card via-primary to-dark-blue rounded-xl border-3 border-accent relative shadow-xl">
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-dark-blue border-3 border-accent rounded-lg flex items-center justify-center shadow-inner robot-chest">
                  <i className="fas fa-calculator text-accent text-xl"></i>
                </div>
                
                <div className="absolute bottom-4 left-3 w-4 h-4 bg-accent rounded border-2 border-dark-blue shadow-md robot-antenna"></div>
                <div className="absolute bottom-4 right-3 w-4 h-4 bg-green-400 rounded border-2 border-dark-blue shadow-md robot-antenna"></div>
                <div className="absolute bottom-8 left-3 w-3 h-3 bg-red-400 rounded border border-dark-blue shadow-md robot-antenna"></div>
                <div className="absolute bottom-8 right-3 w-3 h-3 bg-blue-400 rounded border border-dark-blue shadow-md robot-antenna"></div>
                
                <div className="robot-arm robot-arm-left absolute top-6 -left-6 w-4 h-16 bg-gradient-to-b from-primary to-dark-blue rounded-full border-3 border-accent shadow-lg">
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-accent rounded-full border-3 border-dark-blue shadow-md"></div>
                </div>
                <div className="robot-arm robot-arm-right absolute top-6 -right-6 w-4 h-16 bg-gradient-to-b from-primary to-dark-blue rounded-full border-3 border-accent shadow-lg">
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-accent rounded-full border-3 border-dark-blue shadow-md"></div>
                </div>
              </div>
              
              {/* Robot Base */}
              <div className="w-32 h-8 bg-gradient-to-b from-primary to-dark-blue rounded-xl border-3 border-accent mt-2 relative shadow-xl">
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full shadow-md robot-antenna border border-dark-blue"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full shadow-md robot-antenna border border-dark-blue"></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full shadow-md robot-antenna border border-dark-blue"></div>
                </div>
              </div>
              
              {/* Robot Legs */}
              <div className="flex justify-center space-x-6 mt-3">
                <div className="w-4 h-12 bg-gradient-to-b from-primary to-dark-blue rounded-full border-3 border-accent shadow-lg">
                  <div className="w-6 h-4 bg-dark-blue rounded-full border-3 border-accent mt-8 -ml-1 shadow-md"></div>
                </div>
                <div className="w-4 h-12 bg-gradient-to-b from-primary to-dark-blue rounded-full border-3 border-accent shadow-lg">
                  <div className="w-6 h-4 bg-dark-blue rounded-full border-3 border-accent mt-8 -ml-1 shadow-md"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Robot Status Display */}
          <div className="mt-8 text-center">
            <div className="text-accent text-xs font-bold tracking-widest mb-2">⚡ {robotStatus}</div>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full robot-antenna shadow-md border border-dark-blue"></div>
              <div className="w-2 h-2 bg-accent rounded-full robot-antenna shadow-md border border-dark-blue"></div>
              <div className="w-2 h-2 bg-red-400 rounded-full robot-antenna shadow-md border border-dark-blue"></div>
            </div>
            <div className="text-primary text-xs mt-1 font-medium tracking-wide">CALC UNIT</div>
          </div>
          
          {/* Info Panel Below Robot - Only during category selection */}
          {currentStep === 'category' && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-40">
              <div className="bg-gradient-to-r from-bg-card to-bg-dark border border-primary rounded-md p-2 text-center">
                <div className="text-accent text-xs font-bold mb-1">SMART CALCULATOR</div>
                <div className="text-white text-xs opacity-80">Choose your unit type</div>
                <div className="text-primary text-xs mt-1">Start calculating</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Side - Interface */}
        <div className="w-1/2 bg-bg-card p-4 pt-4 relative overflow-y-auto" style={{ maxHeight: 'calc(100vh - 11rem)', zIndex: 10 }}>
          

          
          {/* Step 1: Category Selection */}
          {currentStep === 'category' && (
            <div className="space-y-4 mt-4">
              <div className="text-accent font-bold text-sm mb-6 flex items-center tracking-wide">
                <i className="fas fa-list-ul mr-2 text-base"></i>
                SELECT UNIT CATEGORY
              </div>
              <div className="space-y-4">
                <button 
                  onClick={() => selectCategory('weight')} 
                  className="btn-retro w-full p-4 rounded-lg text-white font-bold text-sm flex items-center group hover:scale-[1.02] transition-transform"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mr-4 border-2 border-dark-blue shadow-md">
                    <i className="fas fa-weight-hanging text-dark-blue text-lg"></i>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-base tracking-wide">WEIGHT</div>
                    <div className="text-xs opacity-90 font-medium">kilogram / gram</div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/50 flex items-center justify-center ml-3">
                    <i className="fas fa-chevron-right text-xs text-accent"></i>
                  </div>
                </button>
                <button 
                  onClick={() => selectCategory('volume')} 
                  className="btn-retro w-full p-4 rounded-lg text-white font-bold text-sm flex items-center group hover:scale-[1.02] transition-transform"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mr-4 border-2 border-dark-blue shadow-md">
                    <i className="fas fa-flask text-dark-blue text-lg"></i>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-base tracking-wide">VOLUME</div>
                    <div className="text-xs opacity-90 font-medium">litre / millilitre</div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/50 flex items-center justify-center ml-3">
                    <i className="fas fa-chevron-right text-xs text-accent"></i>
                  </div>
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Base Rate Setup */}
          {currentStep === 'base-rate' && (
            <div className="space-y-4 mt-4">
              <button
                onClick={() => {
                  setCurrentStep('category');
                  setSelectedCategory(null);
                }}
                className="flex items-center text-accent hover:text-primary transition-colors text-sm font-medium mb-3"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Categories
              </button>
              <div className="text-accent font-bold text-sm mb-6 flex items-center tracking-wide">
                <i className="fas fa-cogs mr-2 text-base"></i>
                BASE RATE CONFIG
              </div>
              <div className="retro-panel rounded-lg p-4 space-y-4">
                <div>
                  <label className="text-primary font-bold text-xs block mb-2 tracking-wide">PRICE (₹):</label>
                  <input 
                    type="number" 
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="input-retro w-full p-3 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-bg-card to-bg-dark border-2 border-primary focus:border-accent focus:outline-none transition-colors" 
                    placeholder="Enter base price"
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-primary font-bold text-xs block mb-2 tracking-wide">QUANTITY:</label>
                    <input 
                      type="number" 
                      value={baseQuantity}
                      onChange={(e) => setBaseQuantity(e.target.value)}
                      className="input-retro w-full p-3 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-bg-card to-bg-dark border-2 border-primary focus:border-accent focus:outline-none transition-colors" 
                      placeholder="Enter quantity"
                    />
                  </div>
                  
                  <div>
                    <label className="text-primary font-bold text-xs block mb-2 tracking-wide">SELECT UNIT:</label>
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="input-retro w-full p-3 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-bg-card to-bg-dark border-2 border-primary focus:border-accent focus:outline-none transition-colors flex items-center justify-between"
                      >
                        <span>{baseUnit}</span>
                        <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} text-xs`}></i>
                      </button>
                      
                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 w-full bg-gradient-to-r from-bg-card to-bg-dark border-2 border-primary rounded-lg shadow-lg z-[1000] mt-1">
                          {selectedCategory === 'weight' ? (
                            <>
                              <button
                                onClick={() => {
                                  setBaseUnit('g');
                                  setIsDropdownOpen(false);
                                  
                                  // Add chatty response for unit selection
                                  setTimeout(() => {
                                    const headerChat = document.querySelector('.header-chat');
                                    if (headerChat) {
                                      headerChat.innerHTML = `
                                        🤖 Nice choice! Grams selected.<br />
                                        <span class="text-accent font-bold">Perfect for precise small measurements like spices!</span><br />
                                        <span class="text-xs opacity-80">Great for detailed calculations!</span>
                                      `;
                                      setTimeout(() => {
                                        headerChat.innerHTML = `
                                          <div class="mb-1">🤖 Welcome to Quantity Price Calculator!</div>
                                          <div class="mb-1">Select your unit category to begin calculations</div>
                                          <div>I'll help you calculate prices and quantities!</div>
                                        `;
                                      }, 3000);
                                    }
                                  }, 300);
                                }}
                                className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${baseUnit === 'g' ? 'bg-primary/30' : ''}`}
                              >
                                g (gram)
                              </button>
                              <button
                                onClick={() => {
                                  setBaseUnit('kg');
                                  setIsDropdownOpen(false);
                                  
                                  // Add chatty response for unit selection
                                  setTimeout(() => {
                                    const headerChat = document.querySelector('.header-chat');
                                    if (headerChat) {
                                      headerChat.innerHTML = `
                                        <div class="mb-1">🤖 Perfect! Kilogram selected.</div>
                                        <div class="mb-1">Great standard unit for most weight calculations!</div>
                                        <div>Very practical choice!</div>
                                      `;
                                      setTimeout(() => {
                                        headerChat.innerHTML = `
                                          <div class="mb-1">🤖 Welcome to Quantity Price Calculator!</div>
                                          <div class="mb-1">Select your unit category to begin calculations</div>
                                          <div>I'll help you calculate prices and quantities!</div>
                                        `;
                                      }, 3000);
                                    }
                                  }, 300);
                                }}
                                className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${baseUnit === 'kg' ? 'bg-primary/30' : ''}`}
                              >
                                kg (kilogram)
                              </button>
                              <button
                                onClick={() => {
                                  setBaseUnit('quintal');
                                  setIsDropdownOpen(false);
                                  
                                  setTimeout(() => {
                                    const headerChat = document.querySelector('.header-chat');
                                    if (headerChat) {
                                      headerChat.innerHTML = `
                                        <div class="mb-1">🤖 Impressive! Quintal selected.</div>
                                        <div class="mb-1">Perfect for bulk agricultural products!</div>
                                        <div>Excellent for wholesale calculations!</div>
                                      `;
                                      setTimeout(() => {
                                        headerChat.innerHTML = `
                                          <div class="mb-1">🤖 Welcome to Quantity Price Calculator!</div>
                                          <div class="mb-1">Select your unit category to begin calculations</div>
                                          <div>I'll help you calculate prices and quantities!</div>
                                        `;
                                      }, 3000);
                                    }
                                  }, 300);
                                }}
                                className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${baseUnit === 'quintal' ? 'bg-primary/30' : ''}`}
                              >
                                quintal
                              </button>
                              <button
                                onClick={() => {
                                  setBaseUnit('ton');
                                  setIsDropdownOpen(false);
                                  
                                  setTimeout(() => {
                                    const headerChat = document.querySelector('.header-chat');
                                    if (headerChat) {
                                      headerChat.innerHTML = `
                                        <div class="mb-1">🤖 Wow! Ton selected.</div>
                                        <div class="mb-1">For heavy-duty industrial calculations!</div>
                                        <div>Perfect for construction materials!</div>
                                      `;
                                      setTimeout(() => {
                                        headerChat.innerHTML = `
                                          <div class="mb-1">🤖 Welcome to Quantity Price Calculator!</div>
                                          <div class="mb-1">Select your unit category to begin calculations</div>
                                          <div>I'll help you calculate prices and quantities!</div>
                                        `;
                                      }, 3000);
                                    }
                                  }, 300);
                                }}
                                className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${baseUnit === 'ton' ? 'bg-primary/30' : ''}`}
                              >
                                ton
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setBaseUnit('ml');
                                  setIsDropdownOpen(false);
                                  
                                  setTimeout(() => {
                                    const headerChat = document.querySelector('.header-chat');
                                    if (headerChat) {
                                      headerChat.innerHTML = `
                                        <div class="mb-1">🤖 Smart choice! Milliliters selected.</div>
                                        <div class="mb-1">Perfect for medicines and precise liquids!</div>
                                        <div>Very accurate measurements!</div>
                                      `;
                                      setTimeout(() => {
                                        headerChat.innerHTML = `
                                          <div class="mb-1">🤖 Welcome to Quantity Price Calculator!</div>
                                          <div class="mb-1">Select your unit category to begin calculations</div>
                                          <div>I'll help you calculate prices and quantities!</div>
                                        `;
                                      }, 3000);
                                    }
                                  }, 300);
                                }}
                                className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${baseUnit === 'ml' ? 'bg-primary/30' : ''}`}
                              >
                                ml (milliliter)
                              </button>
                              <button
                                onClick={() => {
                                  setBaseUnit('l');
                                  setIsDropdownOpen(false);
                                  
                                  setTimeout(() => {
                                    const headerChat = document.querySelector('.header-chat');
                                    if (headerChat) {
                                      headerChat.innerHTML = `
                                        <div class="mb-1">🤖 Excellent! Liters selected.</div>
                                        <div class="mb-1">Ideal for everyday liquids like milk and oil!</div>
                                        <div>A very practical standard unit!</div>
                                      `;
                                      setTimeout(() => {
                                        headerChat.innerHTML = `
                                          <div class="mb-1">🤖 Welcome to Quantity Price Calculator!</div>
                                          <div class="mb-1">Select your unit category to begin calculations</div>
                                          <div>I'll help you calculate prices and quantities!</div>
                                        `;
                                      }, 3000);
                                    }
                                  }, 300);
                                }}
                                className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${baseUnit === 'l' ? 'bg-primary/30' : ''}`}
                              >
                                l (liter)
                              </button>
                              <button
                                onClick={() => {
                                  setBaseUnit('gallon');
                                  setIsDropdownOpen(false);
                                  
                                  setTimeout(() => {
                                    const headerChat = document.querySelector('.header-chat');
                                    if (headerChat) {
                                      headerChat.innerHTML = `
                                        <div class="mb-1">🤖 Great! Gallons selected.</div>
                                        <div class="mb-1">Perfect for fuel tanks and water storage!</div>
                                        <div>Nice selection for large volumes!</div>
                                      `;
                                      setTimeout(() => {
                                        headerChat.innerHTML = `
                                          <div class="mb-1">🤖 Welcome to Quantity Price Calculator!</div>
                                          <div class="mb-1">Select your unit category to begin calculations</div>
                                          <div>I'll help you calculate prices and quantities!</div>
                                        `;
                                      }, 3000);
                                    }
                                  }, 300);
                                }}
                                className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${baseUnit === 'gallon' ? 'bg-primary/30' : ''}`}
                              >
                                gallon
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={setBaseRate}
                    className="btn-retro w-full p-3 rounded-lg text-white font-bold text-sm tracking-wide hover:scale-[1.02] transition-transform"
                  >
                    <i className="fas fa-check-circle mr-2"></i>
                    CONFIRM RATE
                  </button>
                  <button 
                    onClick={() => {
                      setBasePrice('');
                      setBaseQuantity('');
                      setBaseUnit(selectedCategory === 'weight' ? 'kg' : 'l');
                    }}
                    className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-medium hover:from-accent hover:to-accent/80 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <i className="fas fa-undo-alt"></i>
                    <span>CLEAR VALUES</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Calculator */}
          {currentStep === 'calculator' && (
            <div className="space-y-4">
              
              {calculatorTab === null && (
                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                  <button
                    onClick={() => setCurrentStep('base-rate')}
                    className="flex items-center text-accent hover:text-primary transition-colors text-sm font-medium mb-3"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Back to Rate Config
                  </button>
                  <button
                    onClick={() => {
                      playRetroSound('beep');
                      setCalculatorTab('price-to-quantity');
                      // Immediate chat response for price calculator
                      const headerChat = document.querySelector('.header-chat');
                      if (headerChat) {
                        headerChat.innerHTML = `
                          🤖 Price Calculator activated!<br />
                          <span class="text-accent font-bold">Enter your budget to find out how much you can buy</span><br />
                          <span class="text-xs opacity-80">Perfect for smart shopping decisions!</span>
                        `;
                        setTimeout(() => {
                          headerChat.innerHTML = `
                            🤖 Welcome to Quantity Price Calculator!<br />
                            <span class="text-accent font-bold">Select your unit category to begin calculations</span><br />
                            <span class="text-xs opacity-80">I'll help you calculate prices and quantities!</span>
                          `;
                        }, 3000);
                      }
                    }}
                    className="retro-card-hover w-full p-3 rounded-lg bg-gradient-to-r from-bg-card to-bg-dark border-2 border-primary hover:border-accent transition-colors group relative overflow-hidden"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mr-3 border-2 border-dark-blue shadow-md flex-shrink-0">
                        <i className="fas fa-money-bill-wave text-dark-blue text-sm"></i>
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="font-bold text-xs tracking-wide truncate">PRICE CALCULATOR</div>
                        <div className="text-xs opacity-90 font-medium truncate">Enter price to get quantity</div>
                      </div>
                      <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2"></i>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      playRetroSound('beep');
                      setCalculatorTab('quantity-to-price');
                      // Immediate chat response for quantity calculator
                      const headerChat = document.querySelector('.header-chat');
                      if (headerChat) {
                        headerChat.innerHTML = `
                          🤖 Quantity Calculator ready!<br />
                          <span class="text-accent font-bold">Enter quantity to find the total cost</span><br />
                          <span class="text-xs opacity-80">Great for bulk purchases and trading!</span>
                        `;
                        setTimeout(() => {
                          headerChat.innerHTML = `
                            🤖 Welcome to Quantity Price Calculator!<br />
                            <span class="text-accent font-bold">Select your unit category to begin calculations</span><br />
                            <span class="text-xs opacity-80">I'll help you calculate prices and quantities!</span>
                          `;
                        }, 3000);
                      }
                    }}
                    className="retro-card-hover w-full p-3 rounded-lg bg-gradient-to-r from-bg-card to-bg-dark border-2 border-primary hover:border-accent transition-colors group relative overflow-hidden"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mr-3 border-2 border-dark-blue shadow-md flex-shrink-0">
                        <i className="fas fa-balance-scale text-dark-blue text-sm"></i>
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="font-bold text-xs tracking-wide truncate">QUANTITY CALCULATOR</div>
                        <div className="text-xs opacity-90 font-medium truncate">Enter quantity to get price</div>
                      </div>
                      <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2"></i>
                    </div>
                  </button>
                </div>
              )}

              {/* Price Calculator Screen */}
              {calculatorTab === 'price-to-quantity' && (
                <div className="space-y-4">
                  <button
                    onClick={() => setCalculatorTab(null)}
                    className="flex items-center text-accent hover:text-primary transition-colors text-sm font-medium mb-3"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Back to Calculator Selection
                  </button>
                  <div className="retro-panel rounded-lg p-4 space-y-4">
                    <div className="text-accent font-bold text-sm mb-4 flex items-center tracking-wide">
                      <i className="fas fa-money-bill-wave mr-2 text-base"></i>
                      PRICE CALCULATOR
                    </div>
                    <div>
                      <label className="text-primary font-bold text-xs block mb-2 tracking-wide">PRICE (₹):</label>
                      <input 
                        type="number" 
                        value={calcPrice}
                        onChange={(e) => setCalcPrice(e.target.value)}
                        className="input-retro w-full p-3 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-bg-card to-bg-dark border-2 border-primary focus:border-accent focus:outline-none transition-colors" 
                        placeholder="Enter price"
                      />
                    </div>
                    <div className="space-y-3">
                      <button 
                        onClick={() => {
                          playRetroSound('calculate');
                          if (calcPrice && unitRate) {
                            const quantity = parseFloat(calcPrice) / unitRate;
                            
                            // Auto-convert to appropriate unit
                            let displayQuantity = quantity;
                            let displayUnit = baseUnit;
                            
                            if (selectedCategory === 'weight') {
                              // Weight conversions - both directions
                              if (baseUnit === 'g') {
                                if (quantity >= 1000000) {
                                  displayQuantity = quantity / 1000000;
                                  displayUnit = 'ton';
                                } else if (quantity >= 100000) {
                                  displayQuantity = quantity / 100000;
                                  displayUnit = 'quintal';
                                } else if (quantity >= 1000) {
                                  displayQuantity = quantity / 1000;
                                  displayUnit = 'kg';
                                }
                              } else if (baseUnit === 'kg') {
                                if (quantity >= 1000) {
                                  displayQuantity = quantity / 1000;
                                  displayUnit = 'ton';
                                } else if (quantity >= 100) {
                                  displayQuantity = quantity / 100;
                                  displayUnit = 'quintal';
                                } else if (quantity < 1) {
                                  displayQuantity = quantity * 1000;
                                  displayUnit = 'g';
                                }
                              } else if (baseUnit === 'quintal') {
                                if (quantity >= 10) {
                                  displayQuantity = quantity / 10;
                                  displayUnit = 'ton';
                                } else if (quantity < 1) {
                                  if (quantity * 100 >= 1) {
                                    displayQuantity = quantity * 100;
                                    displayUnit = 'kg';
                                  } else {
                                    displayQuantity = quantity * 100000;
                                    displayUnit = 'g';
                                  }
                                }
                              } else if (baseUnit === 'ton') {
                                if (quantity < 1) {
                                  if (quantity * 1000 >= 1) {
                                    displayQuantity = quantity * 1000;
                                    displayUnit = 'kg';
                                  } else if (quantity * 10 >= 1) {
                                    displayQuantity = quantity * 10;
                                    displayUnit = 'quintal';
                                  } else {
                                    displayQuantity = quantity * 1000000;
                                    displayUnit = 'g';
                                  }
                                }
                              }
                            } else if (selectedCategory === 'volume') {
                              // Volume conversions - both directions
                              if (baseUnit === 'ml') {
                                if (quantity >= 3785410) {
                                  displayQuantity = quantity / 3785.41;
                                  displayUnit = 'gallon';
                                } else if (quantity >= 1000) {
                                  displayQuantity = quantity / 1000;
                                  displayUnit = 'l';
                                }
                              } else if (baseUnit === 'l') {
                                if (quantity >= 3785.41) {
                                  displayQuantity = quantity / 3785.41;
                                  displayUnit = 'gallon';
                                } else if (quantity < 1) {
                                  displayQuantity = quantity * 1000;
                                  displayUnit = 'ml';
                                }
                              } else if (baseUnit === 'gallon') {
                                if (quantity < 1) {
                                  if (quantity * 3.785 >= 1) {
                                    displayQuantity = quantity * 3.785;
                                    displayUnit = 'l';
                                  } else {
                                    displayQuantity = quantity * 3785.41;
                                    displayUnit = 'ml';
                                  }
                                }
                              }
                            }
                            
                            const finalResult = selectedCategory === 'weight' ? 
                              `${displayQuantity.toFixed(3)} ${displayUnit}` :
                              displayQuantity >= 1 ? 
                              `${displayQuantity.toFixed(2)} ${displayUnit}` : 
                              `${displayQuantity.toFixed(4)} ${displayUnit}`;
                            
                            setQuantityResult(finalResult);
                            
                            // Immediate chat response for price calculation result
                            const headerChat = document.querySelector('.header-chat');
                            if (headerChat) {
                              headerChat.innerHTML = `
                                🤖 Excellent! For ₹${calcPrice}, you get ${finalResult}.<br />
                                <span class="text-accent font-bold">Price calculation completed!</span><br />
                                <span class="text-xs opacity-80">Rate: ₹${unitRate.toFixed(selectedCategory === 'weight' ? 3 : 2)} per ${baseUnit}. Great deal!</span>
                              `;
                              setTimeout(() => {
                                headerChat.innerHTML = `
                                  🤖 Welcome to Quantity Price Calculator!<br />
                                  <span class="text-accent font-bold">Select your unit category to begin calculations</span><br />
                                  <span class="text-xs opacity-80">I'll help you calculate prices and quantities!</span>
                                `;
                              }, 4000);
                            }
                            
                            triggerRobotAnimation('excited');
                          }
                        }}
                        className="btn-retro w-full p-3 rounded-lg text-white font-bold text-sm tracking-wide hover:scale-[1.02] transition-transform"
                      >
                        <i className="fas fa-calculator mr-2"></i>
                        CALCULATE QUANTITY
                      </button>
                      <button 
                        onClick={() => {
                          playRetroSound('reset');
                          setCalcPrice('');
                          setQuantityResult('');
                        }}
                        className="w-full py-1.5 px-3 rounded-md bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-normal hover:from-accent hover:to-accent/80 transition-all duration-200 flex items-center justify-center space-x-1"
                      >
                        <i className="fas fa-eraser text-xs"></i>
                        <span>CLEAR</span>
                      </button>
                    </div>
                    {quantityResult && (
                      <div className="mt-3 text-center p-2 rounded bg-accent/10 border border-accent/30">
                        <div className="text-accent text-xs font-bold">RESULT:</div>
                        <div className="text-white text-sm font-medium">{quantityResult}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quantity Calculator Screen */}
              {calculatorTab === 'quantity-to-price' && (
                <div className="space-y-4">
                  <button
                    onClick={() => setCalculatorTab(null)}
                    className="flex items-center text-accent hover:text-primary transition-colors text-sm font-medium mb-3"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Back to Calculator Selection
                  </button>
                  <div className="retro-panel rounded-lg p-4 space-y-4">
                    <div className="text-accent font-bold text-sm mb-4 flex items-center tracking-wide">
                      <i className="fas fa-balance-scale mr-2 text-base"></i>
                      QUANTITY CALCULATOR
                    </div>
                    <div>
                      <label className="text-primary font-bold text-xs block mb-2 tracking-wide">QUANTITY:</label>
                      <input 
                        type="number" 
                        value={calcQuantity}
                        onChange={(e) => setCalcQuantity(e.target.value)}
                        className="input-retro w-full p-3 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-bg-card to-bg-dark border-2 border-primary focus:border-accent focus:outline-none transition-colors" 
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-primary font-bold text-xs block mb-2 tracking-wide">SELECT UNIT:</label>
                        <div className="relative" ref={dropdownRef}>
                          <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="input-retro w-full p-3 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-bg-card to-bg-dark border-2 border-primary focus:border-accent focus:outline-none transition-colors flex items-center justify-between"
                          >
                            <span>{calcUnit}</span>
                            <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} text-xs`}></i>
                          </button>
                          
                          {isDropdownOpen && (
                            <div className="absolute top-full left-0 w-full bg-gradient-to-r from-bg-card to-bg-dark border-2 border-primary rounded-lg shadow-lg z-[1000] mt-1">
                              {selectedCategory === 'weight' ? (
                                <>
                                  <button
                                    onClick={() => {
                                      setCalcUnit('g');
                                      setIsDropdownOpen(false);
                                    }}
                                    className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${calcUnit === 'g' ? 'bg-primary/30' : ''}`}
                                  >
                                    g (gram)
                                  </button>
                                  <button
                                    onClick={() => {
                                      setCalcUnit('kg');
                                      setIsDropdownOpen(false);
                                    }}
                                    className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${calcUnit === 'kg' ? 'bg-primary/30' : ''}`}
                                  >
                                    kg (kilogram)
                                  </button>
                                  <button
                                    onClick={() => {
                                      setCalcUnit('quintal');
                                      setIsDropdownOpen(false);
                                    }}
                                    className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${calcUnit === 'quintal' ? 'bg-primary/30' : ''}`}
                                  >
                                    quintal
                                  </button>
                                  <button
                                    onClick={() => {
                                      setCalcUnit('ton');
                                      setIsDropdownOpen(false);
                                    }}
                                    className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${calcUnit === 'ton' ? 'bg-primary/30' : ''}`}
                                  >
                                    ton
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setCalcUnit('ml');
                                      setIsDropdownOpen(false);
                                    }}
                                    className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${calcUnit === 'ml' ? 'bg-primary/30' : ''}`}
                                  >
                                    ml (milliliter)
                                  </button>
                                  <button
                                    onClick={() => {
                                      setCalcUnit('l');
                                      setIsDropdownOpen(false);
                                    }}
                                    className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${calcUnit === 'l' ? 'bg-primary/30' : ''}`}
                                  >
                                    l (liter)
                                  </button>
                                  <button
                                    onClick={() => {
                                      setCalcUnit('gallon');
                                      setIsDropdownOpen(false);
                                    }}
                                    className={`w-full p-2 text-left text-white text-sm hover:bg-primary/20 transition-colors ${calcUnit === 'gallon' ? 'bg-primary/30' : ''}`}
                                  >
                                    gallon
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <button 
                        onClick={() => {
                          playRetroSound('calculate');
                          if (calcQuantity && unitRate) {
                            // Convert calcQuantity to base unit for calculation
                            let convertedQuantity = parseFloat(calcQuantity);
                            
                            // Convert to base unit
                            if (selectedCategory === 'weight') {
                              if (calcUnit === 'g') convertedQuantity = convertedQuantity / 1000;
                              else if (calcUnit === 'ton') convertedQuantity = convertedQuantity * 1000;
                            } else {
                              if (calcUnit === 'ml') convertedQuantity = convertedQuantity / 1000;
                              else if (calcUnit === 'gallon') convertedQuantity = convertedQuantity * 3.785;
                            }
                            
                            const price = convertedQuantity * unitRate;
                            setPriceResult(`₹${price.toFixed(selectedCategory === 'weight' ? 3 : 2)}`);
                            
                            // Immediate chat response for quantity calculation result
                            const headerChat = document.querySelector('.header-chat');
                            if (headerChat) {
                              headerChat.innerHTML = `
                                🤖 Perfect! ${calcQuantity} ${calcUnit} costs ₹${price.toFixed(selectedCategory === 'weight' ? 3 : 2)}.<br />
                                <span class="text-accent font-bold">Quantity calculation complete!</span><br />
                                <span class="text-xs opacity-80">Rate: ₹${unitRate.toFixed(selectedCategory === 'weight' ? 3 : 2)} per ${baseUnit}. Well calculated!</span>
                              `;
                              setTimeout(() => {
                                headerChat.innerHTML = `
                                  🤖 Welcome to Quantity Price Calculator!<br />
                                  <span class="text-accent font-bold">Select your unit category to begin calculations</span><br />
                                  <span class="text-xs opacity-80">I'll help you calculate prices and quantities!</span>
                                `;
                              }, 4000);
                            }
                            
                            triggerRobotAnimation('excited');
                          }
                        }}
                        className="btn-retro w-full p-3 rounded-lg text-white font-bold text-sm tracking-wide hover:scale-[1.02] transition-transform"
                      >
                        <i className="fas fa-calculator mr-2"></i>
                        CALCULATE PRICE
                      </button>
                      <button 
                        onClick={() => {
                          playRetroSound('reset');
                          setCalcQuantity('');
                          setPriceResult('');
                          setCalcUnit(selectedCategory === 'weight' ? 'kg' : 'l');
                        }}
                        className="w-full py-1.5 px-3 rounded-md bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-normal hover:from-accent hover:to-accent/80 transition-all duration-200 flex items-center justify-center space-x-1"
                      >
                        <i className="fas fa-eraser text-xs"></i>
                        <span>CLEAR</span>
                      </button>
                    </div>
                    {priceResult && (
                      <div className="mt-3 text-center p-2 rounded bg-accent/10 border border-accent/30">
                        <div className="text-accent text-xs font-bold">RESULT:</div>
                        <div className="text-white text-sm font-medium">{priceResult}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              

              
              <div className="border-t border-gray-600 pt-6 mt-6">
                <button 
                  onClick={() => {
                    setCurrentStep('category');
                    setSelectedCategory(null);
                    setBasePrice('');
                    setBaseQuantity('');
                    setBaseUnit('kg');
                    setUnitRate(0);
                    setCalcPrice('');
                    setCalcQuantity('');
                    setCalcUnit('kg');
                    setPriceResult('');
                    setQuantityResult('');
                    setCalculatorTab(null);
                  }}
                  className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-medium text-xs hover:from-red-500 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-power-off"></i>
                  <span>RESET CALCULATOR</span>
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}