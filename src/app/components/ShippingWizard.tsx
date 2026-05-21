import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, CheckCircle2, TrendingUp, Package, MapPin, DollarSign, AlertTriangle, Info, Shield } from 'lucide-react';

interface WizardStep {
  id: number;
  title: string;
  question: string;
}

interface ShippingWizardProps {
  onComplete: (config: any) => void;
  onClose: () => void;
}

export function ShippingWizard({ onComplete, onClose }: ShippingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [productType, setProductType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [shippingRegion, setShippingRegion] = useState('domestic');
  const [productWeight, setProductWeight] = useState('light');
  const [showSavePrompt, setShowSavePrompt] = useState(false);

  // Auto-save progress
  useEffect(() => {
    const progress = { currentStep, productType, priceRange, shippingRegion, productWeight };
    localStorage.setItem('shipping-wizard-progress', JSON.stringify(progress));
  }, [currentStep, productType, priceRange, shippingRegion, productWeight]);

  // Load saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem('shipping-wizard-progress');
    if (saved) {
      const progress = JSON.parse(saved);
      if (progress.currentStep > 1) {
        setShowSavePrompt(true);
      }
    }
  }, []);

  const loadSavedProgress = () => {
    const saved = localStorage.getItem('shipping-wizard-progress');
    if (saved) {
      const progress = JSON.parse(saved);
      setCurrentStep(progress.currentStep);
      setProductType(progress.productType);
      setPriceRange(progress.priceRange);
      setShippingRegion(progress.shippingRegion);
      setProductWeight(progress.productWeight);
    }
    setShowSavePrompt(false);
  };

  const steps: WizardStep[] = [
    { id: 1, title: 'Product Type', question: 'What are you selling?' },
    { id: 2, title: 'Pricing', question: 'What\'s your average product price?' },
    { id: 3, title: 'Shipping Scope', question: 'Where will you ship?' },
    { id: 4, title: 'Product Weight', question: 'How heavy are your products?' }
  ];

  // Calculate recommendations based on inputs
  const getRecommendations = () => {
    let flatRate = 10;
    let internationalFlatRate = 35;
    let freeShippingThreshold = 60;
    let transitTime = '3 to 5 business days';

    // Adjust based on price range
    if (priceRange === 'under-20') {
      flatRate = 7;
      freeShippingThreshold = 40;
      internationalFlatRate = 25;
    } else if (priceRange === '20-50') {
      flatRate = 10;
      freeShippingThreshold = 60;
      internationalFlatRate = 35;
    } else if (priceRange === '50-100') {
      flatRate = 12;
      freeShippingThreshold = 75;
      internationalFlatRate = 45;
    } else if (priceRange === 'over-100') {
      flatRate = 15;
      freeShippingThreshold = 100;
      internationalFlatRate = 55;
    }

    // Adjust based on weight
    if (productWeight === 'heavy') {
      flatRate += 5;
      internationalFlatRate += 10;
    } else if (productWeight === 'medium') {
      internationalFlatRate += 5;
    }

    // Regional adjustments for international / North America
    if (shippingRegion === 'north-america') {
      internationalFlatRate = flatRate + 8;
    } else if (shippingRegion === 'international') {
      internationalFlatRate = Math.max(internationalFlatRate, flatRate + 20);
      transitTime = '7 to 14 business days';
    }

    return { flatRate, internationalFlatRate, freeShippingThreshold, transitTime };
  };

  const getBenchmarkData = () => {
    const productTypeLabels: Record<string, string> = {
      'apparel': 'Apparel & Fashion',
      'electronics': 'Electronics',
      'home': 'Home & Living',
      'beauty': 'Beauty & Personal Care',
      'other': 'General Retail'
    };

    const priceRangeLabels: Record<string, string> = {
      'under-20': 'Under $20',
      '20-50': '$20 - $50',
      '50-100': '$50 - $100',
      'over-100': 'Over $100'
    };

    if (currentStep === 2 && priceRange) {
      return {
        stores: '125,000',
        avgRate: '$8-12',
        freeShippingThreshold: '$50-75',
        conversionLift: '15-20%'
      };
    }

    return null;
  };

  // Confidence scoring logic
  const getConfidenceScore = (): { level: 'high' | 'medium' | 'low'; message: string; issues: string[] } => {
    const issues: string[] = [];

    if (currentStep < 2) {
      return { level: 'medium', message: 'Just getting started', issues: [] };
    }

    // Check for risky configurations
    if (priceRange === 'under-20' && productWeight === 'heavy') {
      issues.push('Heavy items with low prices may have tight shipping margins');
    }

    if (shippingRegion === 'international' && !productWeight) {
      issues.push('International shipping for heavy items needs careful rate setting');
    }

    if (priceRange === 'over-100' && shippingRegion === 'domestic') {
      issues.push('Premium products often benefit from international shipping');
    }

    const { flatRate } = getRecommendations();

    if (priceRange === 'under-20' && flatRate > 10) {
      issues.push('Shipping cost is high relative to product price - may reduce conversions');
    }

    // Determine confidence level
    if (issues.length === 0 && currentStep >= 3) {
      return { level: 'high', message: 'Excellent setup so far', issues: [] };
    } else if (issues.length <= 1) {
      return { level: 'medium', message: 'Good setup with minor considerations', issues };
    } else {
      return { level: 'low', message: 'Some risks detected in your configuration', issues };
    }
  };

  const getStepValidation = () => {
    const validations: { type: 'success' | 'warning' | 'info'; message: string }[] = [];

    if (currentStep === 2 && priceRange) {
      if (priceRange === 'under-20') {
        validations.push({
          type: 'info',
          message: 'Budget-friendly products typically work best with lower flat rates ($5-8) to keep total cost competitive'
        });
      } else if (priceRange === 'over-100') {
        validations.push({
          type: 'success',
          message: 'Premium products can support higher shipping rates. Many stores offer free shipping at this price point.'
        });
      }
    }

    if (currentStep === 3 && shippingRegion) {
      if (shippingRegion === 'international') {
        validations.push({
          type: 'warning',
          message: 'International shipping typically costs $20-40+. We\'ll set up separate rates for international zones.'
        });
      } else if (shippingRegion === 'domestic') {
        validations.push({
          type: 'success',
          message: 'Starting with domestic shipping is a safe approach. You can add international later.'
        });
      }
    }

    if (currentStep === 4 && productWeight === 'heavy') {
      validations.push({
        type: 'info',
        message: 'Heavy items benefit from weight-based rates. We can set this up for you if needed.'
      });
    }

    return validations;
  };

  const recommendations = getRecommendations();
  const benchmarks = getBenchmarkData();
  const confidence = getConfidenceScore();
  const stepValidations = getStepValidation();

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.removeItem('shipping-wizard-progress');
    onComplete({
      productType,
      priceRange,
      shippingRegion,
      productWeight,
      recommendations,
      confidence
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'apparel', label: 'Apparel & Fashion', icon: '👕' },
                { value: 'electronics', label: 'Electronics', icon: '📱' },
                { value: 'home', label: 'Home & Living', icon: '🏠' },
                { value: 'beauty', label: 'Beauty & Personal Care', icon: '💄' },
                { value: 'food', label: 'Food & Beverage', icon: '🍕' },
                { value: 'other', label: 'Other', icon: '📦' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setProductType(option.value)}
                  className={`p-3 border-2 rounded-lg text-left transition-all ${
                    productType === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">{option.icon}</div>
                  <div className="text-xs font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              {[
                { value: 'under-20', label: 'Under $20', desc: 'Budget-friendly items' },
                { value: '20-50', label: '$20 - $50', desc: 'Mid-range products' },
                { value: '50-100', label: '$50 - $100', desc: 'Premium items' },
                { value: 'over-100', label: 'Over $100', desc: 'Luxury products' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPriceRange(option.value)}
                  className={`w-full p-2.5 border-2 rounded-lg text-left transition-all ${
                    priceRange === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">{option.label}</div>
                  <div className="text-xs text-gray-600">{option.desc}</div>
                </button>
              ))}
            </div>

            {benchmarks && priceRange && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-start gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-purple-900">Industry Insights</div>
                    <div className="text-xs text-purple-800">Based on {benchmarks.stores}+ similar stores</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-white rounded p-2">
                    <div className="text-xs text-gray-600 mb-0.5">Typical shipping rate</div>
                    <div className="text-sm font-semibold text-purple-900">{benchmarks.avgRate}</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-xs text-gray-600 mb-0.5">Free shipping at</div>
                    <div className="text-sm font-semibold text-purple-900">{benchmarks.freeShippingThreshold}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step Validations */}
            {stepValidations.map((validation, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-2 flex items-start gap-2 ${
                  validation.type === 'success'
                    ? 'bg-green-50 border border-green-200'
                    : validation.type === 'warning'
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                {validation.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />}
                {validation.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />}
                {validation.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />}
                <p className={`text-xs ${
                  validation.type === 'success'
                    ? 'text-green-800'
                    : validation.type === 'warning'
                    ? 'text-amber-800'
                    : 'text-blue-800'
                }`}>
                  {validation.message}
                </p>
              </div>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-2">
            {[
              { value: 'domestic', label: 'Domestic only', desc: 'Ship within your country', icon: MapPin },
              { value: 'north-america', label: 'North America', desc: 'US, Canada, Mexico', icon: MapPin },
              { value: 'international', label: 'International', desc: 'Worldwide shipping', icon: MapPin }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setShippingRegion(option.value)}
                className={`w-full p-2.5 border-2 rounded-lg text-left transition-all flex items-start gap-2 ${
                  shippingRegion === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <option.icon className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium">{option.label}</div>
                  <div className="text-xs text-gray-600">{option.desc}</div>
                </div>
              </button>
            ))}

            {/* Step Validations */}
            {stepValidations.map((validation, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-2 flex items-start gap-2 mt-2 ${
                  validation.type === 'success'
                    ? 'bg-green-50 border border-green-200'
                    : validation.type === 'warning'
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                {validation.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />}
                {validation.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />}
                {validation.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />}
                <p className={`text-xs ${
                  validation.type === 'success'
                    ? 'text-green-800'
                    : validation.type === 'warning'
                    ? 'text-amber-800'
                    : 'text-blue-800'
                }`}>
                  {validation.message}
                </p>
              </div>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-2">
            {[
              { value: 'light', label: 'Light (under 1 lb)', desc: 'Apparel, accessories, small items', weight: '< 0.5 kg' },
              { value: 'medium', label: 'Medium (1-5 lbs)', desc: 'Books, shoes, electronics', weight: '0.5 - 2.5 kg' },
              { value: 'heavy', label: 'Heavy (over 5 lbs)', desc: 'Furniture, large items', weight: '> 2.5 kg' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setProductWeight(option.value)}
                className={`w-full p-2.5 border-2 rounded-lg text-left transition-all ${
                  productWeight === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium">{option.label}</div>
                <div className="text-xs text-gray-600">{option.desc}</div>
                <div className="text-xs text-gray-500 mt-0.5">{option.weight}</div>
              </button>
            ))}

            {/* Step Validations */}
            {stepValidations.map((validation, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-2 flex items-start gap-2 mt-2 ${
                  validation.type === 'success'
                    ? 'bg-green-50 border border-green-200'
                    : validation.type === 'warning'
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                {validation.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />}
                {validation.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />}
                {validation.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />}
                <p className={`text-xs ${
                  validation.type === 'success'
                    ? 'text-green-800'
                    : validation.type === 'warning'
                    ? 'text-amber-800'
                    : 'text-blue-800'
                }`}>
                  {validation.message}
                </p>
              </div>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="space-y-3">
            {/* Confidence Score Card */}
            <div className={`rounded-lg p-3 border-2 ${
              confidence.level === 'high'
                ? 'bg-green-50 border-green-500'
                : confidence.level === 'medium'
                ? 'bg-blue-50 border-blue-500'
                : 'bg-amber-50 border-amber-500'
            }`}>
              <div className="flex items-start gap-2 mb-2">
                {confidence.level === 'high' && <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />}
                {confidence.level === 'medium' && <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />}
                {confidence.level === 'low' && <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className={`text-sm font-semibold ${
                      confidence.level === 'high' ? 'text-green-900' : confidence.level === 'medium' ? 'text-blue-900' : 'text-amber-900'
                    }`}>
                      Setup Confidence: {confidence.level === 'high' ? 'High' : confidence.level === 'medium' ? 'Medium' : 'Needs Review'}
                    </div>
                    <div className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                      confidence.level === 'high' ? 'bg-green-600 text-white' : confidence.level === 'medium' ? 'bg-blue-600 text-white' : 'bg-amber-600 text-white'
                    }`}>
                      {confidence.level === 'high' ? '✓ Low Risk' : confidence.level === 'medium' ? 'Medium Risk' : 'Review Needed'}
                    </div>
                  </div>
                  <div className={`text-xs mb-1 ${
                    confidence.level === 'high' ? 'text-green-800' : confidence.level === 'medium' ? 'text-blue-800' : 'text-amber-800'
                  }`}>
                    {confidence.message}
                  </div>

                  {confidence.issues.length > 0 && (
                    <div className="space-y-0.5 mt-2">
                      <div className="text-xs font-medium text-gray-700">Considerations:</div>
                      {confidence.issues.map((issue, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs">
                          <span className="text-amber-600">•</span>
                          <span className="text-gray-700">{issue}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-2.5">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-blue-900 mb-0.5">Your recommended setup</div>
                  <div className="text-xs text-blue-800">Based on your answers and industry data from 500K+ stores</div>
                </div>
              </div>
            </div>

            {/* Recommended Configuration */}
            <div className="space-y-2">
              <div className="border border-gray-200 rounded-lg p-2.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">
                      {shippingRegion === 'international' || shippingRegion === 'north-america'
                        ? 'International shipping rate'
                        : 'Domestic shipping rate'}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">
                    ${shippingRegion === 'international' || shippingRegion === 'north-america'
                      ? recommendations.internationalFlatRate
                      : recommendations.flatRate}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  Flat rate for{' '}
                  {shippingRegion === 'domestic'
                    ? 'domestic'
                    : shippingRegion === 'north-america'
                    ? 'North America'
                    : 'international'}{' '}
                  shipping
                </div>

                {/* Real-time Impact Preview */}
                <div className="bg-gray-50 rounded-lg p-2 space-y-1">
                  <div className="text-xs font-medium text-gray-700 mb-1">Impact Preview</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Estimated shipping cost:</span>
                    <span className="font-medium text-green-600">
                      {shippingRegion === 'international' || shippingRegion === 'north-america'
                        ? `$${recommendations.internationalFlatRate - 12}-${recommendations.internationalFlatRate - 8}`
                        : '$7-9'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Your profit per order:</span>
                    <span className="font-medium text-green-600">
                      ${(shippingRegion === 'international' || shippingRegion === 'north-america'
                        ? recommendations.internationalFlatRate
                        : recommendations.flatRate) - 8} - $
                      {(shippingRegion === 'international' || shippingRegion === 'north-america'
                        ? recommendations.internationalFlatRate
                        : recommendations.flatRate) - 7}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Competitive position:</span>
                    <span className="font-medium text-blue-600">✓ Within industry range</span>
                  </div>
                </div>
              </div>

              {(shippingRegion === 'domestic' || shippingRegion === 'north-america') && (
              <div className="border border-gray-200 rounded-lg p-2.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">Free shipping threshold</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">${recommendations.freeShippingThreshold}</span>
                </div>
                <div className="text-xs text-gray-600 mb-2">Orders above this amount ship free (domestic)</div>

                <div className="bg-gray-50 rounded-lg p-2 space-y-1">
                  <div className="text-xs font-medium text-gray-700 mb-1">Why this works</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Break-even point:</span>
                    <span className="font-medium">${recommendations.freeShippingThreshold + 8}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Expected conversion lift:</span>
                    <span className="font-medium text-green-600">+15-20%</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    This threshold encourages customers to add more items while keeping you profitable
                  </div>
                </div>
              </div>
              )}

              {shippingRegion === 'international' && (
                <div className="border border-gray-200 rounded-lg p-2.5 bg-gray-50">
                  <div className="text-xs text-gray-600">
                    International orders use flat rates only — free shipping thresholds typically apply to domestic zones.
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <div className="text-xs text-blue-900">
                <strong>Good news:</strong> You can change these settings anytime. This is a safe starting point based on what works for similar stores.
              </div>
            </div>

            {/* Risk Mitigation Tips */}
            {confidence.level !== 'high' && (
              <div className="bg-white border border-gray-200 rounded-lg p-2.5">
                <div className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  Quick tips to reduce risk:
                </div>
                <ul className="space-y-1 text-xs text-gray-700">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Monitor your first 10 orders closely to ensure shipping costs align with your rates</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Consider adding a small handling fee ($1-2) as a buffer for unexpected costs</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>You can pause international shipping anytime if costs become too high</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return productType !== '';
      case 2: return priceRange !== '';
      case 3: return shippingRegion !== '';
      case 4: return productWeight !== '';
      case 5: return true;
      default: return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-full max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-0.5">Shipping Setup</h2>
            <p className="text-xs text-gray-600">
              {currentStep < 5 ? 'Answer a few questions to get started' : 'Review your setup'}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar with Confidence Indicator */}
        <div className="px-4 pt-3 pb-2 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-600">
              Step {currentStep} of 5
              {currentStep >= 3 && (
                <span className="text-gray-400 ml-2">• Almost done!</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {currentStep >= 2 && (
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  confidence.level === 'high'
                    ? 'bg-green-100 text-green-700'
                    : confidence.level === 'medium'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {confidence.level === 'high' && <Shield className="w-3 h-3" />}
                  {confidence.level === 'medium' && <CheckCircle2 className="w-3 h-3" />}
                  {confidence.level === 'low' && <AlertTriangle className="w-3 h-3" />}
                  <span className="hidden sm:inline">{confidence.message}</span>
                </div>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                confidence.level === 'high'
                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                  : confidence.level === 'medium'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600'
              }`}
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Saved Progress Prompt */}
        {showSavePrompt && (
          <div className="mx-4 mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2 flex-shrink-0">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-blue-900 mb-1.5">
                  Continue where you left off?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={loadSavedProgress}
                    className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    Continue
                  </button>
                  <button
                    onClick={() => setShowSavePrompt(false)}
                    className="px-2 py-0.5 bg-white text-blue-600 text-xs rounded border border-blue-300 hover:bg-blue-50"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
          {currentStep < 5 && (
            <div className="mb-4">
              <h3 className="text-base font-medium mb-0.5">{steps[currentStep - 1].question}</h3>
              <p className="text-xs text-gray-600">This helps us recommend the right shipping setup for you</p>
            </div>
          )}
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={currentStep === 1 ? onClose : handleBack}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          <button
            onClick={currentStep === 5 ? handleComplete : handleNext}
            disabled={!canProceed()}
            className={`px-5 py-1.5 text-sm rounded-lg font-medium ${
              canProceed()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentStep === 5 ? 'Complete Setup' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
