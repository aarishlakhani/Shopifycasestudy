import { useState } from 'react';
import { ChevronRight, MapPin, MoreVertical, Package, Plus, Truck, Globe, X, ChevronDown, ChevronUp, AlertCircle, Search, Sparkles } from 'lucide-react';
import { EditShippingZoneModal } from './EditShippingZoneModal';
import { EditShippingOptionModal } from './EditShippingOptionModal';
import { ShippingWizard } from './ShippingWizard';

interface ShippingOption {
  id: string;
  name: string;
  price: string;
  transitTime: string;
  freeShipping?: boolean;
  minOrderAmount?: string;
  rateType: 'flat' | 'carrier' | 'order-amount' | 'weight';
}

interface ShippingZone {
  id: string;
  name: string;
  icon: 'flag' | 'truck' | 'globe';
  flagEmoji?: string;
  description: string;
  warning?: string;
  shippingOptions: ShippingOption[];
}

export function ShippingProfilePage() {
  const [showWizard, setShowWizard] = useState(true);
  const [wizardCompleted, setWizardCompleted] = useState(false);
  const [editingZone, setEditingZone] = useState<string | null>(null);
  const [editingOption, setEditingOption] = useState<{ zoneId: string; optionId: string | null } | null>(null);

  const [zones, setZones] = useState<ShippingZone[]>([
    {
      id: 'domestic',
      name: 'Domestic',
      icon: 'flag',
      flagEmoji: '🇺🇸',
      description: 'United States',
      shippingOptions: [
        {
          id: 'standard',
          name: 'Standard',
          price: '$10.00',
          transitTime: '1 to 2 business days',
          freeShipping: true,
          minOrderAmount: '$200.00',
          rateType: 'flat'
        }
      ]
    },
    {
      id: 'international',
      name: 'International',
      icon: 'globe',
      description: 'Austria, Australia, Belgium, 23 more',
      warning: 'To start selling to 25 countries/regions in this zone, include them in a market',
      shippingOptions: [
        {
          id: 'intl-standard',
          name: 'International',
          price: '$70.00',
          transitTime: '',
          rateType: 'flat'
        }
      ]
    }
  ]);

  const handleWizardComplete = (config: {
    shippingRegion: string;
    recommendations: {
      flatRate: number;
      internationalFlatRate: number;
      freeShippingThreshold: number;
      transitTime: string;
    };
  }) => {
    const { shippingRegion, recommendations } = config;

    const updatedZones = zones.map((zone) => {
      if (zone.id === 'domestic') {
        return {
          ...zone,
          shippingOptions: zone.shippingOptions.map((option) =>
            option.id === 'standard'
              ? {
                  ...option,
                  price: `$${recommendations.flatRate}.00`,
                  minOrderAmount: `$${recommendations.freeShippingThreshold}.00`,
                  transitTime: recommendations.transitTime,
                  freeShipping: true,
                }
              : option
          ),
        };
      }

      if (
        zone.id === 'international' &&
        (shippingRegion === 'international' || shippingRegion === 'north-america')
      ) {
        return {
          ...zone,
          shippingOptions: zone.shippingOptions.map((option) =>
            option.id === 'intl-standard'
              ? {
                  ...option,
                  price: `$${recommendations.internationalFlatRate}.00`,
                  transitTime: recommendations.transitTime,
                  freeShipping: undefined,
                  minOrderAmount: undefined,
                }
              : option
          ),
        };
      }

      return zone;
    });

    setZones(updatedZones);
    setWizardCompleted(true);
    setShowWizard(false);
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <h1 className="text-xl">General profile</h1>
          </div>
          {wizardCompleted && (
            <button
              onClick={() => setShowWizard(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Sparkles className="w-4 h-4" />
              Run Setup Wizard Again
            </button>
          )}
        </div>

        {/* Wizard Banner (if not completed) */}
        {!wizardCompleted && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">Get Started in 2 Minutes</h2>
                </div>
                <p className="text-blue-50 mb-4">
                  Answer a few quick questions and we'll set up shipping rates that work for your business.
                  Based on insights from 500,000+ similar stores.
                </p>
                <button
                  onClick={() => setShowWizard(true)}
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50"
                >
                  Start Setup Wizard
                </button>
              </div>
              <button
                onClick={() => setWizardCompleted(true)}
                className="text-white/80 hover:text-white ml-4"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Products Card */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <h2 className="mb-4">Products</h2>

          <button className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors mb-3">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-gray-600" />
              <span>All products not in other profiles</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          <p className="text-gray-600 text-sm">New products are added by default</p>
        </div>

        {/* Fulfillment Location Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="mb-4">Fulfillment location</h2>

          {/* Shop Location */}
          <div className="flex items-start justify-between p-4 mb-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <div className="font-medium mb-1">Shop location</div>
                <div className="text-sm text-gray-600"> Mississauga Ontario, Canada</div>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Shipping Zones */}
          <h3 className="mb-4">Shipping zones</h3>

          {zones.map((zone) => (
            <div key={zone.id} className="mb-4">
              <div className="border border-gray-300 rounded-lg">
                {/* Zone Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    {zone.icon === 'flag' && zone.flagEmoji ? (
                      <span className="text-2xl">{zone.flagEmoji}</span>
                    ) : zone.icon === 'globe' ? (
                      <Globe className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Truck className="w-5 h-5 text-gray-600" />
                    )}
                    <div>
                      <div className="font-medium">{zone.name}</div>
                      <div className="text-sm text-gray-600">{zone.description}</div>
                    </div>
                  </div>
                  <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={() => setEditingZone(zone.id)}
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Warning */}
                {zone.warning && (
                  <div className="bg-amber-50 border-b border-gray-200 p-4 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-800">
                      To start selling to <span className="font-medium">25 countries/regions</span> in this zone, include them in a{' '}
                      <a href="#" className="underline">market</a>
                    </p>
                  </div>
                )}

                {/* Shipping Options */}
                <div className="p-4 space-y-3">
                  {zone.shippingOptions.map((option) => (
                    <div key={option.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium">{option.name}</div>
                          {option.freeShipping && option.minOrderAmount ? (
                            <div className="text-sm text-gray-600">
                              Free for orders {option.minOrderAmount} and up • {option.transitTime}
                            </div>
                          ) : option.transitTime ? (
                            <div className="text-sm text-gray-600">{option.transitTime}</div>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{option.price}</span>
                        <button
                          className="p-2 hover:bg-gray-100 rounded"
                          onClick={() => setEditingOption({ zoneId: zone.id, optionId: option.id })}
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 pt-2"
                    onClick={() => setEditingOption({ zoneId: zone.id, optionId: null })}
                  >
                    <Plus className="w-4 h-4" />
                    Add shipping option
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mt-4">
            <Plus className="w-4 h-4" />
            Add zone
          </button>
        </div>
      </div>

      {/* Modals */}
      {showWizard && (
        <ShippingWizard
          onComplete={handleWizardComplete}
          onClose={() => setShowWizard(false)}
        />
      )}

      {editingZone && (
        <EditShippingZoneModal
          zone={zones.find(z => z.id === editingZone)!}
          onClose={() => setEditingZone(null)}
        />
      )}

      {editingOption && (
        <EditShippingOptionModal
          option={
            editingOption.optionId
              ? zones.find(z => z.id === editingOption.zoneId)?.shippingOptions.find(o => o.id === editingOption.optionId)
              : undefined
          }
          onClose={() => setEditingOption(null)}
        />
      )}
    </div>
  );
}
