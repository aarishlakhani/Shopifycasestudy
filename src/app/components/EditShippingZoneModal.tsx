import { useState } from 'react';
import { X, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface Region {
  id: string;
  name: string;
  abbreviation: string;
  flag?: string;
  status?: 'in-another-zone' | 'selected';
  count?: string;
  expanded?: boolean;
}

interface EditShippingZoneModalProps {
  zone: any;
  onClose: () => void;
}

export function EditShippingZoneModal({ zone, onClose }: EditShippingZoneModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [regions, setRegions] = useState<Region[]>([
    {
      id: 'asia',
      name: 'Asia',
      abbreviation: 'AS',
      status: 'in-another-zone'
    },
    {
      id: 'uae',
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      status: 'in-another-zone'
    },
    {
      id: 'na',
      name: 'North America',
      abbreviation: 'NA',
      status: 'selected',
      count: '62 of 62 states/provinces',
      expanded: true
    },
    {
      id: 'us',
      name: 'United States',
      flag: '🇺🇸',
      status: 'selected',
      count: '62 of 62 states'
    }
  ]);

  const toggleRegion = (regionId: string) => {
    setRegions(regions.map(r =>
      r.id === regionId
        ? { ...r, expanded: !r.expanded }
        : r
    ));
  };

  const toggleRegionSelection = (regionId: string) => {
    setRegions(regions.map(r =>
      r.id === regionId && r.status !== 'in-another-zone'
        ? { ...r, status: r.status === 'selected' ? undefined : 'selected' }
        : r
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg">Edit shipping zone</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Zone Name */}
          <div className="mb-6">
            <label className="block mb-2">Zone name</label>
            <input
              type="text"
              defaultValue={zone.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-600 mt-1">Customers won't see this</p>
          </div>

          {/* Regions */}
          <div>
            <label className="block mb-2">Regions</label>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Region List */}
            <div className="space-y-2">
              {regions.map((region) => (
                <div key={region.id}>
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={region.status === 'selected'}
                        disabled={region.status === 'in-another-zone'}
                        onChange={() => toggleRegionSelection(region.id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />

                      {region.flag ? (
                        <span className="text-xl">{region.flag}</span>
                      ) : (
                        <div className="w-8 h-6 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-600">
                          {region.abbreviation}
                        </div>
                      )}

                      <span className={region.status === 'in-another-zone' ? 'text-gray-400' : ''}>
                        {region.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {region.status === 'in-another-zone' ? (
                        <span className="text-sm text-gray-500">In another zone</span>
                      ) : region.count ? (
                        <span className="text-sm text-gray-600">{region.count}</span>
                      ) : null}

                      {region.count && (
                        <button
                          onClick={() => toggleRegion(region.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {region.expanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <a href="#" className="text-blue-600 hover:text-blue-700 text-sm mt-4 inline-block">
              Add more regions in Markets
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
