import { useState } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';

interface EditShippingOptionModalProps {
  option?: any;
  onClose: () => void;
}

export function EditShippingOptionModal({ option, onClose }: EditShippingOptionModalProps) {
  const [rateType, setRateType] = useState<'flat' | 'carrier' | 'order-amount' | 'weight'>(
    option?.rateType || 'flat'
  );
  const [name, setName] = useState(option?.name || 'Standard');
  const [price, setPrice] = useState(option?.price?.replace('$', '') || '10.00');
  const [transitTime, setTransitTime] = useState(option?.transitTime || '1 to 2 business days');
  const [offerFreeShipping, setOfferFreeShipping] = useState(option?.freeShipping || false);
  const [minOrderAmount, setMinOrderAmount] = useState(option?.minOrderAmount?.replace('$', '') || '200.00');
  const [showRateTypeMenu, setShowRateTypeMenu] = useState(false);

  const rateTypes = [
    { value: 'flat', label: 'Flat' },
    { value: 'carrier', label: 'Carrier or app calculated' },
    { value: 'order-amount', label: 'Order amount' },
    { value: 'weight', label: 'Weight' }
  ];

  const renderRateTypeFields = () => {
    switch (rateType) {
      case 'flat':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2">Transit time</label>
              <select
                value={transitTime}
                onChange={(e) => setTransitTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option>1 to 2 business days</option>
                <option>3 to 5 business days</option>
                <option>5 to 7 business days</option>
              </select>
            </div>
          </div>
        );

      case 'carrier':
        return (
          <div>
            <div className="mb-4">
              <label className="block text-sm mb-2">Carrier or app</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Canada Post (Discounted rates from Shopify)</option>
              </select>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm">Shipping services</label>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">At least 1 shipping service must be selected</p>
              </div>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <Plus className="w-4 h-4" />
                Add services
              </button>
              <label className="flex items-center gap-2 mt-3">
                <input type="checkbox" defaultChecked={false} className="rounded" />
                <span className="text-sm">Automatically include new services when they become available</span>
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-2">Handling fee</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="0"
                    className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">%</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                  <input
                    type="text"
                    defaultValue="0.00"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm mb-2">Example at checkout</p>
              <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div>
                    <div className="font-medium">Rate name</div>
                    <div className="text-sm text-gray-600">Fri, May 22</div>
                  </div>
                </div>
                <div className="font-medium">$10.00</div>
              </div>
              <p className="text-sm text-gray-600 mt-3">Price and transit time will be calculated at checkout</p>
            </div>
          </div>
        );

      case 'order-amount':
        return (
          <div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-2">Minimum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                  <input
                    type="text"
                    defaultValue="0.00"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">Maximum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                  <input
                    type="text"
                    placeholder="No limit"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                  <input
                    type="text"
                    defaultValue="0.00"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">Transit time</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-red-300">
                  <option>Select</option>
                  <option>1 to 2 business days</option>
                  <option>3 to 5 business days</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mb-4">
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-800">Transit time is required</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded">
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <Trash2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm mb-2">Example at checkout</p>
              <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div className="font-medium">Standard</div>
                </div>
                <div className="font-medium">FREE</div>
              </div>
            </div>
          </div>
        );

      case 'weight':
        return (
          <div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-2">Minimum</label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="0.0"
                    className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">kg</span>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">Maximum</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="No limit"
                    className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">kg</span>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                  <input
                    type="text"
                    defaultValue="0.00"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">Transit time</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-red-300">
                  <option>Select</option>
                  <option>1 to 2 business days</option>
                  <option>3 to 5 business days</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mb-4">
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-800">Transit time is required</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded">
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <Trash2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm mb-2">Example at checkout</p>
              <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div className="font-medium">Standard</div>
                </div>
                <div className="font-medium">FREE</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <h2 className="text-lg">Edit shipping option</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Discard
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Done
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Name */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="text-sm text-gray-600 hover:text-gray-800 mt-2">
              Add delivery details
            </button>
          </div>

          {/* Rate Type */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-4">
              <label className="block mb-2">Rate type</label>
              <div className="relative">
                <button
                  onClick={() => setShowRateTypeMenu(!showRateTypeMenu)}
                  className={`w-full px-3 py-2 border rounded-lg text-left flex items-center justify-between ${
                    rateType === 'weight' ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'
                  }`}
                >
                  <span>{rateTypes.find(rt => rt.value === rateType)?.label}</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showRateTypeMenu && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {rateTypes.map((rt) => (
                      <button
                        key={rt.value}
                        onClick={() => {
                          setRateType(rt.value as any);
                          setShowRateTypeMenu(false);
                        }}
                        className={`w-full px-3 py-2 text-left hover:bg-gray-50 ${
                          rateType === rt.value ? 'bg-gray-100' : ''
                        }`}
                      >
                        {rt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {renderRateTypeFields()}
          </div>

          {/* Free Shipping */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mt-4">
            <label className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                checked={offerFreeShipping}
                onChange={(e) => setOfferFreeShipping(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span>Offer free shipping</span>
            </label>

            {offerFreeShipping && (
              <div>
                <label className="block text-sm mb-2">Minimum order amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                  <input
                    type="text"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    className="w-full pl-7 pr-16 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">CAD</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
