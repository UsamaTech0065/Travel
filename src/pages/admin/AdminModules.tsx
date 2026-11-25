import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  Plus,
  Search,
  Trash2,
  Check,
  X,
  Pencil,
  Globe2,
  Camera,
  Upload,
  MapPin,
  Table2,
  Eye,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/format';
import { LOCAL_IMAGES } from '../../data/images';
import { ADMIN_DESTINATION_SHARE, ADMIN_MONTHLY_REVENUE } from '../../data/reviewsAndAdmin';
import { BookingRecord, Destination, TourPackage } from '../../types';
import { Pakistan3DMap } from '../../components/maps/Pakistan3DMap';

// 1. Website Management
export const AdminWebsitePage: React.FC = () => {
  const { siteSettings, updateSiteSettings, showToast } = useApp();
  const [tab, setTab] = useState<'Homepage' | 'Banners' | 'Pages' | 'Menus' | 'Footer'>('Homepage');
  const [headline, setHeadline] = useState(siteSettings.heroHeadline);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Website Management</h1>
        <div className="flex flex-wrap gap-1.5">
          {(['Homepage', 'Banners', 'Pages', 'Menus', 'Footer'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                tab === t ? 'bg-[#102A43] text-white' : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#102A43]">{tab} Configuration</h2>
        {tab === 'Homepage' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateSiteSettings({ heroHeadline: headline });
            }}
            className="space-y-4 max-w-xl"
          >
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Hero Headline</label>
              <input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>
            <button type="submit" className="px-4 py-2 rounded-xl bg-[#102A43] text-white text-xs font-semibold">
              Publish Homepage Copy
            </button>
          </form>
        ) : (
          <div className="space-y-3 text-sm text-slate-600">
            <p>Active configuration for <strong>{tab}</strong> is synced with the public storefront.</p>
            <button
              type="button"
              onClick={() => showToast(`${tab} settings saved`)}
              className="px-4 py-2 rounded-xl bg-[#102A43] text-white text-xs font-semibold"
            >
              Save {tab} Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const PAKISTAN_IMAGE_PRESETS = [
  { label: 'Hunza Valley', url: LOCAL_IMAGES.heroHunza },
  { label: 'Skardu & Shangrila', url: LOCAL_IMAGES.skardu },
  { label: 'Fairy Meadows', url: LOCAL_IMAGES.fairyMeadows },
  { label: 'Attabad & Passu', url: LOCAL_IMAGES.attabadPassu },
  { label: 'Naran & Saif-ul-Muluk', url: LOCAL_IMAGES.naranKaghan },
  { label: 'Swat & Kalam', url: LOCAL_IMAGES.swatKalam },
  { label: 'Deosai Plains', url: LOCAL_IMAGES.deosai },
  { label: 'Lahore Heritage', url: LOCAL_IMAGES.lahore },
  { label: 'Gwadar & Hingol', url: LOCAL_IMAGES.gwadarHingol },
];

// 2. Destinations CRUD + Real 3D Map Coordinates & Gallery Manager
export const AdminDestinationsPage: React.FC = () => {
  const { destinations, addDestination, updateDestination, deleteDestination, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [regionTab, setRegionTab] = useState('All');
  const [adminView, setAdminView] = useState<'table' | 'map'>('table');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewDest, setPreviewDest] = useState<Destination | null>(null);

  // Location Form State
  const [name, setName] = useState('');
  const [region, setRegion] = useState<Destination['region']>('Northern Pakistan');
  const [category, setCategory] = useState<Destination['category']>('Mountains');
  const [bestSeason, setBestSeason] = useState('May – October');
  const [elevationOrClimate, setElevationOrClimate] = useState('2,450 m · Alpine');
  const [availableTours, setAvailableTours] = useState(3);
  const [featured, setFeatured] = useState(true);
  const [lat, setLat] = useState(36.3167);
  const [lng, setLng] = useState(74.65);
  const [altitude, setAltitude] = useState(2438);
  const [shortDesc, setShortDesc] = useState('');
  const [overview, setOverview] = useState('');
  const [attractionsText, setAttractionsText] = useState(
    'Main Valley Lookout: Panoramic Karakoram views.\nHeritage Bazaar: Artisan handicrafts and apricot cafés.'
  );
  const [thingsToDoText, setThingsToDoText] = useState('Guided Ridge Walk, Photography Tour, Village Immersion');
  const [gallery, setGallery] = useState<string[]>([LOCAL_IMAGES.heroHunza, LOCAL_IMAGES.attabadPassu]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setRegion('Northern Pakistan');
    setCategory('Mountains');
    setBestSeason('May – October');
    setElevationOrClimate('2,450 m · Alpine');
    setAvailableTours(3);
    setFeatured(true);
    setLat(36.3167);
    setLng(74.65);
    setAltitude(2438);
    setShortDesc('');
    setOverview('');
    setAttractionsText(
      'Main Valley Lookout: Panoramic Karakoram views.\nHeritage Bazaar: Artisan handicrafts and apricot cafés.'
    );
    setThingsToDoText('Guided Ridge Walk, Photography Tour, Village Immersion');
    setGallery([LOCAL_IMAGES.heroHunza, LOCAL_IMAGES.attabadPassu]);
    setNewPhotoUrl('');
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (d: Destination) => {
    setEditingId(d.id);
    setName(d.name);
    setRegion(d.region);
    setCategory(d.category);
    setBestSeason(d.bestSeason);
    setElevationOrClimate(d.elevationOrClimate);
    setAvailableTours(d.availableTours);
    setFeatured(d.featured);
    setLat(d.coordinates.lat);
    setLng(d.coordinates.lng);
    setAltitude(d.coordinates.altitude ?? 1200);
    setShortDesc(d.shortDescription);
    setOverview(d.overview);
    setAttractionsText(
      d.attractions.map((a) => `${a.name}: ${a.description}`).join('\n')
    );
    setThingsToDoText(d.thingsToDo.join(', '));
    const uniqueImgs = Array.from(new Set([d.image, ...(d.gallery || [])].filter(Boolean)));
    setGallery(uniqueImgs.length > 0 ? uniqueImgs : [LOCAL_IMAGES.heroHunza]);
    setNewPhotoUrl('');
    setShowModal(true);
  };

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const dataUrl = reader.result;
          setGallery((prev) => [...prev, dataUrl]);
          showToast('Photo added to location gallery', file.name);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddPhotoUrl = () => {
    const trimmed = newPhotoUrl.trim();
    if (!trimmed) return;
    setGallery((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setNewPhotoUrl('');
  };

  const handleSetCover = (url: string) => {
    setGallery((prev) => [url, ...prev.filter((item) => item !== url)]);
  };

  const handleRemovePhoto = (url: string) => {
    setGallery((prev) => {
      const next = prev.filter((item) => item !== url);
      return next.length > 0 ? next : [LOCAL_IMAGES.heroHunza];
    });
  };

  const filtered = destinations.filter((d) => {
    if (regionTab !== 'All' && d.region !== regionTab) return false;
    if (
      search &&
      !d.name.toLowerCase().includes(search.toLowerCase()) &&
      !d.category.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedAttractions = attractionsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [attrName, ...rest] = line.split(':');
        return {
          name: attrName.trim(),
          description: rest.join(':').trim() || 'Signature scenic spot in Pakistan.',
        };
      });

    const parsedTodos = thingsToDoText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const coverImage = gallery[0] || LOCAL_IMAGES.heroHunza;
    const cleanGallery = gallery.length > 0 ? gallery : [coverImage];

    const payload = {
      name: name.trim(),
      country: 'Pakistan',
      region,
      category,
      shortDescription: shortDesc.trim() || `Curated Pakistan expedition stop in ${name.trim()}.`,
      fullIntro: shortDesc.trim() || `Explore exact trails, peaks, and local heritage in ${name.trim()}.`,
      overview: overview.trim() || shortDesc.trim() || `Curated Pakistan expedition stop in ${name.trim()}.`,
      bestSeason: bestSeason.trim() || 'May – October',
      availableTours: Math.max(1, Number(availableTours) || 1),
      elevationOrClimate: elevationOrClimate.trim() || `${altitude.toLocaleString()} m ASL`,
      featured,
      image: coverImage,
      gallery: cleanGallery,
      attractions:
        parsedAttractions.length > 0
          ? parsedAttractions
          : [{ name: 'Scenic Overlook', description: 'Panoramic terrain viewpoint.' }],
      thingsToDo: parsedTodos.length > 0 ? parsedTodos : ['Guided Sightseeing', 'Photography Walk'],
      coordinates: {
        lat: Number(lat),
        lng: Number(lng),
        altitude: Math.max(0, Math.round(Number(altitude) || 0)),
      },
    };

    if (editingId) {
      updateDestination(editingId, payload);
    } else {
      addDestination({
        id: `dest-${Date.now()}`,
        slug: name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        popular: featured,
        travelTips: ['Carry original CNIC / Passport for northern checkpoints', 'Pack layered weatherproof gear'],
        weather: [
          { season: 'Spring / Summer', tempRange: '12°C – 24°C', condition: 'Clear peaks & lush valleys' },
          { season: 'Autumn / Winter', tempRange: '-4°C – 14°C', condition: 'Crisp mountain air' },
        ],
        ...payload,
      });
    }

    setShowModal(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#102A43]">
            Pakistan 3D Map Locations ({destinations.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage exact GPS coordinates, elevation, photos, and visitor details shown on the live 3D map.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setAdminView('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                adminView === 'table' ? 'bg-[#102A43] text-white' : 'text-slate-600'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" /> Table
            </button>
            <button
              type="button"
              onClick={() => setAdminView('map')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                adminView === 'map' ? 'bg-[#168AAD] text-white' : 'text-slate-600'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" /> Live 3D Map
            </button>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#102A43] text-white text-xs font-semibold hover:bg-[#168AAD]"
          >
            <Plus className="w-4 h-4" /> Add Location Pin
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-between bg-white border border-slate-200 rounded-2xl p-4">
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Pakistan locations..."
            className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['All', 'Northern Pakistan', 'Pakistan Heritage & Coast'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRegionTab(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                regionTab === r ? 'bg-[#102A43] text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {adminView === 'map' ? (
        <Pakistan3DMap locations={filtered} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <th className="py-3 px-4">Location &amp; Photo</th>
                <th className="py-3 px-4">Region / Category</th>
                <th className="py-3 px-4">Exact GPS &amp; Altitude</th>
                <th className="py-3 px-4">Gallery</th>
                <th className="py-3 px-4">Tours</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={d.image}
                        alt={d.name}
                        className="w-12 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-[#102A43]">{d.name}</p>
                        <p className="text-[11px] text-slate-500">{d.bestSeason}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-[#102A43]">{d.region}</p>
                    <p className="text-[11px] text-slate-500">{d.category}</p>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <p className="text-[#102A43] font-semibold">
                      {d.coordinates.lat.toFixed(4)}° N, {d.coordinates.lng.toFixed(4)}° E
                    </p>
                    <p className="text-[#168AAD]">
                      {d.coordinates.altitude !== undefined
                        ? `${d.coordinates.altitude.toLocaleString()} m ASL`
                        : d.elevationOrClimate}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-[#102A43] font-medium">
                      <Camera className="w-3 h-3 text-[#168AAD]" />
                      {Math.max(1, d.gallery.length)} photos
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#168AAD]">
                    {d.availableTours}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewDest(d)}
                        title="Preview on 3D Map"
                        className="p-1.5 text-[#168AAD] hover:bg-sky-50 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(d)}
                        title={`Edit ${d.name}`}
                        className="p-1.5 text-[#102A43] hover:bg-slate-100 rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteDestination(d.id)}
                        aria-label={`Delete ${d.name}`}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Admin 3D Preview Modal */}
      {previewDest && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="text-xs font-semibold text-[#168AAD]">Admin 3D Map Pin Verification</p>
                <h2 className="font-serif text-xl font-semibold text-[#102A43]">
                  {previewDest.name} — Live 3D View, Photos &amp; Info
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = previewDest;
                    setPreviewDest(null);
                    openEditModal(target);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#102A43] text-white text-xs font-semibold"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit Pin &amp; Photos
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDest(null)}
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <Pakistan3DMap locations={destinations} focusedSlug={previewDest.slug} />
          </div>
        </div>
      )}

      {/* Add / Edit Location, 3D Coordinates & Photos Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-6 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#102A43]">
                  {editingId ? `Edit Pakistan Location: ${name}` : 'Add New Pakistan Location Pin'}
                </h2>
                <p className="text-xs text-slate-500">
                  Changes sync live with the public 3D Map Explorer and Destination pages.
                </p>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Section 1: Basic Location Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Location Name *</label>
                <input
                  required
                  placeholder="e.g. Kalash Valley"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Pakistan Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as Destination['region'])}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="Northern Pakistan">Northern Pakistan</option>
                  <option value="Pakistan Heritage & Coast">Pakistan Heritage &amp; Coast</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Destination['category'])}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="Mountains">Mountains</option>
                  <option value="Lakes & Valleys">Lakes &amp; Valleys</option>
                  <option value="Heritage & Culture">Heritage &amp; Culture</option>
                  <option value="Coast & Desert">Coast &amp; Desert</option>
                  <option value="Luxury & City">Luxury &amp; City</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Best Season</label>
                <input
                  value={bestSeason}
                  onChange={(e) => setBestSeason(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Elevation / Climate Label</label>
                <input
                  value={elevationOrClimate}
                  onChange={(e) => setElevationOrClimate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">Tours Count</label>
                  <input
                    type="number"
                    min={1}
                    value={availableTours}
                    onChange={(e) => setAvailableTours(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
                <label className="inline-flex items-center gap-1.5 pb-2.5 text-xs font-semibold text-[#102A43]">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  Featured
                </label>
              </div>
            </div>

            {/* Section 2: Interactive 3D Map Coordinate Picker */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#102A43]">
                  <MapPin className="w-4 h-4 text-[#168AAD]" />
                  Exact 3D Map Coordinates &amp; Terrain Picker
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                    Lat:
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={lat}
                      onChange={(e) => setLat(Number(e.target.value))}
                      className="w-24 rounded-lg border border-slate-300 bg-white px-2 py-1 font-mono text-xs"
                    />
                  </label>
                  <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                    Lng:
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={lng}
                      onChange={(e) => setLng(Number(e.target.value))}
                      className="w-24 rounded-lg border border-slate-300 bg-white px-2 py-1 font-mono text-xs"
                    />
                  </label>
                  <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                    Alt (m):
                    <input
                      type="number"
                      step="10"
                      value={altitude}
                      onChange={(e) => setAltitude(Number(e.target.value))}
                      className="w-20 rounded-lg border border-slate-300 bg-white px-2 py-1 font-mono text-xs"
                    />
                  </label>
                </div>
              </div>

              <Pakistan3DMap
                pickMode
                pickedCoordinates={{ lat, lng, altitude }}
                onPickCoordinates={(coords) => {
                  setLat(coords.lat);
                  setLng(coords.lng);
                  if (coords.altitude !== undefined) setAltitude(coords.altitude);
                }}
                heightClass="h-[260px]"
              />
            </div>

            {/* Section 3: Location Photos & Gallery Manager */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#102A43]">
                  <Camera className="w-4 h-4 text-[#168AAD]" />
                  Location Photos ({gallery.length}) — Shown on 3D Map Card
                </div>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#168AAD] text-white text-xs font-semibold cursor-pointer hover:bg-[#102A43] transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Upload Photo(s)
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleUploadPhoto} />
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="Or paste photo URL..."
                  className="flex-1 min-w-[200px] rounded-xl border border-slate-200 px-3 py-1.5 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddPhotoUrl}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-[#102A43] text-xs font-semibold hover:bg-slate-200"
                >
                  Add URL
                </button>
                <select
                  aria-label="Add curated Pakistan photo preset"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      setGallery((prev) => (prev.includes(e.target.value) ? prev : [...prev, e.target.value]));
                    }
                  }}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-[#102A43]"
                >
                  <option value="">+ Add Curated Pakistan Scene...</option>
                  {PAKISTAN_IMAGE_PRESETS.map((p) => (
                    <option key={p.url} value={p.url}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {gallery.map((url, idx) => (
                  <div key={`${url}-${idx}`} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-100">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(url)}
                          className="p-1 rounded bg-rose-600 text-white"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(url)}
                          className="w-full py-1 rounded bg-white text-[#102A43] text-[10px] font-semibold"
                        >
                          Set as Cover
                        </button>
                      )}
                    </div>
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#E5AD50] text-[#102A43] text-[10px] font-bold">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Descriptions, Landmarks & Things To Do */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Concise summary displayed on map cards..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Full Overview</label>
                <textarea
                  rows={2}
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  placeholder="Detailed character, valleys, passes & cultural context..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Landmarks / Attractions (one per line: Name: Description)
                </label>
                <textarea
                  rows={3}
                  value={attractionsText}
                  onChange={(e) => setAttractionsText(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Things To Do (comma-separated)
                </label>
                <textarea
                  rows={3}
                  value={thingsToDoText}
                  onChange={(e) => setThingsToDoText(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#102A43] text-white text-xs font-semibold hover:bg-[#168AAD]"
              >
                {editingId ? 'Save Location Updates' : 'Publish Location to 3D Map'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// 3. Tour Management CRUD
export const AdminToursPage: React.FC = () => {
  const { packages, addPackage, deletePackage } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [destName, setDestName] = useState('Hunza Valley');
  const [price, setPrice] = useState(1150);
  const [days, setDays] = useState(5);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newPkg: TourPackage = {
      id: `pkg-${Date.now()}`,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      title: title.trim(),
      destinationId: 'dest-hunza',
      destinationName: destName,
      country: 'Pakistan',
      region: 'Northern Pakistan',
      category: 'Expedition',
      packageType: 'Group Tour',
      durationDays: days,
      durationLabel: `${days} Days · ${Math.max(1, days - 1)} Nights`,
      price,
      rating: 4.9,
      reviewCount: 1,
      availableSeats: 12,
      departureDates: ['2027-06-15'],
      featured: true,
      trending: true,
      shortDescription: `Curated ${days}-day expedition in ${destName}.`,
      overview: `Curated ${days}-day expedition in ${destName} with boutique hotels and private transport.`,
      image: LOCAL_IMAGES.heroHunza,
      gallery: [LOCAL_IMAGES.heroHunza],
      itinerary: [{ day: 1, title: 'Arrival & Orientation', description: 'Welcome dinner and hotel check-in.', meals: 'Dinner', accommodation: 'Boutique Lodge' }],
      included: ['Hotels', '4x4 Transport', 'Breakfasts'],
      excluded: ['Airfare'],
      hotelInfo: { name: 'Curated Mountain Lodge', category: '4-Star Boutique', location: destName },
      transportDetails: 'Toyota Prado 4x4',
      pickupPoints: ['Islamabad'],
      importantInfo: ['Carry CNIC / Passport'],
      cancellationPolicy: 'Full refund 14 days prior.',
    };
    addPackage(newPkg);
    setTitle('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Tour Management ({packages.length})</h1>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#102A43] text-white text-xs font-semibold hover:bg-[#168AAD]"
        >
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <th className="py-3 px-4">Package Title</th>
              <th className="py-3 px-4">Destination</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4 text-right">Price</th>
              <th className="py-3 px-4 text-right">Seats</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {packages.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-semibold text-[#102A43]">{p.title}</td>
                <td className="py-3 px-4">{p.destinationName}</td>
                <td className="py-3 px-4">{p.durationLabel}</td>
                <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums">{formatCurrency(p.price)}</td>
                <td className="py-3 px-4 text-right font-mono tabular-nums">{p.availableSeats}</td>
                <td className="py-3 px-4 text-right">
                  <button type="button" onClick={() => deletePackage(p.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl font-semibold text-[#102A43]">Create Tour Package</h2>
              <button type="button" onClick={() => setShowModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <input required placeholder="Package Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <input required placeholder="Destination" value={destName} onChange={(e) => setDestName(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" min={200} value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Price USD" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <input type="number" min={1} value={days} onChange={(e) => setDays(Number(e.target.value))} placeholder="Days" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-[#102A43] text-white text-xs font-semibold">
              Publish Package
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

// 4. Bookings Management
export const AdminBookingsPage: React.FC = () => {
  const { bookings, updateBookingStatus } = useApp();
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = bookings.filter((b) => {
    if (statusFilter !== 'All' && b.status !== statusFilter) return false;
    if (search && !b.reference.toLowerCase().includes(search.toLowerCase()) && !b.customerName.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Bookings Workflow</h1>
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ref or customer..."
          className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs w-64"
        />
        <div className="flex flex-wrap gap-1.5">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Refund Requested'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                statusFilter === st ? 'bg-[#102A43] text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <th className="py-3 px-4">Reference</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Package</th>
              <th className="py-3 px-4">Departure</th>
              <th className="py-3 px-4 text-right">Total</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((b) => (
              <tr key={b.id}>
                <td className="py-3 px-4 font-mono font-semibold text-[#102A43]">{b.reference}</td>
                <td className="py-3 px-4">{b.customerName}</td>
                <td className="py-3 px-4 font-medium">{b.packageTitle}</td>
                <td className="py-3 px-4 font-mono tabular-nums">{formatDate(b.departureDate)}</td>
                <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">{formatCurrency(b.totalAmount)}</td>
                <td className="py-3 px-4">
                  <select
                    aria-label={`Status for ${b.reference}`}
                    value={b.status}
                    onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingRecord['status'])}
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-[#102A43]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Refund Requested">Refund Requested</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 5. Customers
export const AdminCustomersPage: React.FC = () => {
  const { customers } = useApp();
  const [tier, setTier] = useState('All');
  const filtered = customers.filter((c) => tier === 'All' || c.tier === tier);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Customers &amp; Loyalty Groups</h1>
        <div className="flex gap-1.5">
          {['All', 'Summit Club', 'Gold Voyager', 'Explorer'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTier(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                tier === t ? 'bg-[#102A43] text-white' : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <th className="py-3 px-4">Traveler</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Group</th>
              <th className="py-3 px-4 text-right">Bookings</th>
              <th className="py-3 px-4 text-right">Lifetime Spend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr key={c.id}>
                <td className="py-3 px-4 font-semibold text-[#102A43]">{c.name}</td>
                <td className="py-3 px-4 text-slate-600">{c.email}</td>
                <td className="py-3 px-4">{c.city}, {c.country}</td>
                <td className="py-3 px-4 font-semibold text-[#168AAD]">{c.tier}</td>
                <td className="py-3 px-4 text-right font-mono tabular-nums">{c.totalBookings}</td>
                <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">{formatCurrency(c.totalSpent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 6. Hotels & Flights Admin
export const AdminHotelsPage: React.FC = () => {
  const { hotels } = useApp();
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Partner Hotels &amp; Room Inventory</h1>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <th className="py-3 px-4">Property</th>
              <th className="py-3 px-4">Destination</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">Rooms</th>
              <th className="py-3 px-4 text-right">Base Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {hotels.map((h) => (
              <tr key={h.id}>
                <td className="py-3 px-4 font-semibold text-[#102A43]">{h.name}</td>
                <td className="py-3 px-4">{h.destination}, {h.country}</td>
                <td className="py-3 px-4">{h.category}</td>
                <td className="py-3 px-4 text-right font-mono tabular-nums">{h.rooms.length} suites</td>
                <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">{formatCurrency(h.pricePerNight)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminFlightsPage: React.FC = () => {
  const { showToast } = useApp();
  const [requests, setRequests] = useState([
    { id: 'fr-1', traveler: 'Usama Goraya', route: 'ISB → GIL (PK-605)', date: '2027-04-12', status: 'Ticketed' },
    { id: 'fr-2', traveler: 'Amna Mansoor', route: 'LHE → KDU (PA-270)', date: '2027-06-20', status: 'Pending Issue' },
    { id: 'fr-3', traveler: 'Zainab Tariq', route: 'KHI → GWD (PK-503)', date: '2027-01-20', status: 'Ticketed' },
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Domestic Flight Requests &amp; Ticketing</h1>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <th className="py-3 px-4">Traveler</th>
              <th className="py-3 px-4">Sector</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((r) => (
              <tr key={r.id}>
                <td className="py-3 px-4 font-semibold text-[#102A43]">{r.traveler}</td>
                <td className="py-3 px-4 font-mono">{r.route}</td>
                <td className="py-3 px-4 font-mono tabular-nums">{r.date}</td>
                <td className="py-3 px-4 font-semibold text-[#168AAD]">{r.status}</td>
                <td className="py-3 px-4 text-right">
                  {r.status !== 'Ticketed' && (
                    <button
                      type="button"
                      onClick={() => {
                        setRequests((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: 'Ticketed' } : x)));
                        showToast('E-Ticket Issued', r.route);
                      }}
                      className="px-3 py-1 rounded-lg bg-[#102A43] text-white font-semibold"
                    >
                      Issue Ticket
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 7. Permits & E-Visa Management
export const AdminVisaPage: React.FC = () => {
  const { visaApplications, updateVisaStatus } = useApp();
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Permits, NOCs &amp; E-Visa Desk</h1>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <th className="py-3 px-4">Tracking ID</th>
              <th className="py-3 px-4">Applicant</th>
              <th className="py-3 px-4">Permit Region</th>
              <th className="py-3 px-4">Tier</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visaApplications.map((v) => (
              <tr key={v.id}>
                <td className="py-3 px-4 font-mono font-semibold text-[#102A43]">{v.trackingCode}</td>
                <td className="py-3 px-4">{v.applicantName}</td>
                <td className="py-3 px-4">{v.country}</td>
                <td className="py-3 px-4">{v.visaType}</td>
                <td className="py-3 px-4">
                  <select
                    aria-label={`Visa status for ${v.trackingCode}`}
                    value={v.status}
                    onChange={(e) => updateVisaStatus(v.id, e.target.value as typeof v.status)}
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Documents Verified">Documents Verified</option>
                    <option value="Embassy Processing">Embassy Processing</option>
                    <option value="Approved">Approved</option>
                    <option value="Action Required">Action Required</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 8. Blog Management
export const AdminBlogPage: React.FC = () => {
  const { blogPosts, addBlogPost, deleteBlogPost } = useApp();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addBlogPost({
      id: `blog-${Date.now()}`,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      title: title.trim(),
      category: 'Pakistan Travel Guides',
      destination: 'Hunza Valley',
      tags: ['Expedition', 'Field Guide'],
      excerpt: excerpt || 'New field dispatch published from the Karakoram editorial desk.',
      coverImage: LOCAL_IMAGES.heroHunza,
      author: { name: 'Editorial Desk', role: 'Karakoram Voyages', avatar: LOCAL_IMAGES.avatarWoman, bio: 'Expedition editorial team.' },
      publishDate: new Date().toISOString().slice(0, 10),
      readingTime: '5 min read',
      views: 1,
      featured: false,
      trending: false,
      sections: [{ id: 'intro', heading: 'Overview', paragraphs: [excerpt || 'Editorial travel guide content.'] }],
      relatedPackageIds: ['pkg-hunza-grand'],
      relatedDestinationSlugs: ['hunza-valley'],
      comments: [],
    });
    setTitle('');
    setExcerpt('');
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Blog Management ({blogPosts.length})</h1>
      <form onSubmit={handleCreate} className="rounded-2xl border border-slate-200 bg-white p-5 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input required placeholder="New article title" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        <input placeholder="Short excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        <button type="submit" className="px-4 py-2 rounded-xl bg-[#102A43] text-white text-xs font-semibold hover:bg-[#168AAD]">
          Publish New Article
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Author</th>
              <th className="py-3 px-4 text-right">Views</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {blogPosts.map((p) => (
              <tr key={p.id}>
                <td className="py-3 px-4 font-semibold text-[#102A43]">{p.title}</td>
                <td className="py-3 px-4">{p.category}</td>
                <td className="py-3 px-4">{p.author.name}</td>
                <td className="py-3 px-4 text-right font-mono tabular-nums">{p.views.toLocaleString()}</td>
                <td className="py-3 px-4 text-right">
                  <button type="button" onClick={() => deleteBlogPost(p.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 9. Reviews Moderation
export const AdminReviewsPage: React.FC = () => {
  const { reviews, updateReviewStatus } = useApp();
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Reviews Moderation</h1>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-semibold text-sm text-[#102A43]">
                {r.customerName} · {r.rating}★ · <span className="text-[#168AAD]">{r.packageName}</span>
              </p>
              <p className="text-xs text-slate-600">{r.text}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => updateReviewStatus(r.id, r.status === 'Approved' ? 'Pending' : 'Approved')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  r.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}
              >
                <Check className="w-3.5 h-3.5" /> {r.status}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 10. Marketing & Coupons
export const AdminMarketingPage: React.FC = () => {
  const { coupons, addCoupon, toggleCoupon, newsletterEmails } = useApp();
  const [code, setCode] = useState('');
  const [pct, setPct] = useState(10);

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Marketing, Coupons &amp; Subscribers</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!code.trim()) return;
          addCoupon({
            id: `cp-${Date.now()}`,
            code: code.trim().toUpperCase(),
            discountPercent: pct,
            description: `${pct}% seasonal promotion`,
            validUntil: '2027-12-31',
            active: true,
            usageCount: 0,
          });
          setCode('');
        }}
        className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-wrap gap-3 items-end"
      >
        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1">Coupon Code</label>
          <input required value={code} onChange={(e) => setCode(e.target.value)} placeholder="SKARDU20" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono uppercase" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1">Discount %</label>
          <input type="number" min={5} max={50} value={pct} onChange={(e) => setPct(Number(e.target.value))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm w-28" />
        </div>
        <button type="submit" className="px-4 py-2 rounded-xl bg-[#102A43] text-white text-xs font-semibold h-[38px]">
          Create Coupon
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <h2 className="text-sm font-semibold text-[#102A43]">Active Promo Codes</h2>
          {coupons.map((c) => (
            <div key={c.id} className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
              <div>
                <p className="font-mono font-bold text-[#102A43]">{c.code} ({c.discountPercent}%)</p>
                <p className="text-slate-500">{c.description}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleCoupon(c.id)}
                className={`px-2.5 py-1 rounded-md font-semibold ${
                  c.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {c.active ? 'Active' : 'Paused'}
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <h2 className="text-sm font-semibold text-[#102A43]">Newsletter Subscribers ({newsletterEmails.length})</h2>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {newsletterEmails.map((em) => (
              <li key={em} className="py-1 border-b border-slate-100">{em}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// 11. Finance, Employees, Communication, Reports, Settings
export const AdminFinancePage: React.FC = () => {
  const { bookings } = useApp();
  const collected = bookings.reduce((s, b) => s + b.paidAmount, 0);
  const outstanding = bookings.reduce((s, b) => s + (b.totalAmount - b.paidAmount), 0);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Finance, Ledger &amp; Invoices</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Collected (Active Bookings)</p>
          <p className="font-mono text-2xl font-bold text-emerald-700 mt-1 tabular-nums">{formatCurrency(collected)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Outstanding Balance</p>
          <p className="font-mono text-2xl font-bold text-[#102A43] mt-1 tabular-nums">{formatCurrency(outstanding)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Operating Expenses (MTD)</p>
          <p className="font-mono text-2xl font-bold text-[#102A43] mt-1 tabular-nums">$18,450</p>
        </div>
      </div>
    </div>
  );
};

export const AdminEmployeesPage: React.FC = () => {
  const { employees } = useApp();
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Staff, Tour Directors &amp; Roles</h1>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Assigned Region</th>
              <th className="py-3 px-4 text-right">Active Tours</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((e) => (
              <tr key={e.id}>
                <td className="py-3 px-4 font-semibold text-[#102A43]">{e.name}</td>
                <td className="py-3 px-4">{e.role}</td>
                <td className="py-3 px-4 text-slate-600">{e.region}</td>
                <td className="py-3 px-4 text-right font-mono tabular-nums">{e.activeTours}</td>
                <td className="py-3 px-4 font-semibold text-emerald-700">{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminCommunicationPage: React.FC = () => {
  const { tickets, showToast } = useApp();
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Communication &amp; Support Queue</h1>
      <div className="space-y-3">
        {tickets.map((t) => (
          <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-sm text-[#102A43]">{t.subject}</p>
              <p className="text-xs text-slate-600 mt-1">{t.message}</p>
            </div>
            <button
              type="button"
              onClick={() => showToast('Reply dispatched to guest')}
              className="px-3.5 py-2 rounded-xl bg-[#102A43] text-white text-xs font-semibold shrink-0"
            >
              Send Reply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-[#102A43]">Executive Performance Reports</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-[#102A43] mb-4">Destination Revenue Share (USD)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_DESTINATION_SHARE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#168AAD" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-[#102A43] mb-4">Annual Monthly Revenue</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_MONTHLY_REVENUE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#102A43" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminSettingsPage: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useApp();
  const [brandName, setBrandName] = useState(siteSettings.brandName);
  const [supportPhone, setSupportPhone] = useState(siteSettings.supportPhone);
  const [supportEmail, setSupportEmail] = useState(siteSettings.supportEmail);
  const [currency, setCurrency] = useState(siteSettings.currency);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateSiteSettings({ brandName, supportPhone, supportEmail, currency });
      }}
      className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5 max-w-2xl"
    >
      <h1 className="font-serif text-2xl font-semibold text-[#102A43]">System &amp; Brand Settings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1">Brand Name</label>
          <input value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1">Default Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm">
            <option>USD ($)</option>
            <option>PKR (₨)</option>
            <option>GBP (£)</option>
            <option>EUR (€)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1">Support Phone</label>
          <input value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1">Support Email</label>
          <input value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" />
        </div>
      </div>
      <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#102A43] text-white text-xs font-semibold hover:bg-[#168AAD]">
        Save System Settings
      </button>
    </form>
  );
};
