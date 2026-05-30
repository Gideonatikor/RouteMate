/**
 * Comprehensive list of popular Kumasi areas/neighborhoods.
 * Used for autocomplete suggestions in both the origin and destination inputs.
 */

export type KumasiPlace = {
  name: string;
  area: string; // General area description
  aliases?: string[];
};

export const kumasiPlaces: KumasiPlace[] = [
  // ── KNUST Campus Areas ──
  { name: "KNUST Main Gate", area: "KNUST Campus", aliases: ["knust", "main gate", "tech"] },
  { name: "Conti Bus Stop", area: "KNUST Campus", aliases: ["conti", "unity hall", "commercial area"] },
  { name: "Engineering Gate", area: "KNUST Campus", aliases: ["engineering", "eng gate"] },
  { name: "Ayeduase Gate", area: "KNUST Campus", aliases: ["ayeduase gate", "kotei"] },
  { name: "Commercial Area", area: "KNUST Campus", aliases: ["commercial", "conti"] },
  { name: "Republic Hall", area: "KNUST Campus", aliases: ["republic", "rep hall"] },
  { name: "Unity Hall", area: "KNUST Campus", aliases: ["unity", "conti hall"] },
  { name: "University Hall", area: "KNUST Campus", aliases: ["katanga", "university hall"] },

  // ── Major Transport Hubs ──
  { name: "Kejetia", area: "Central Kumasi — largest market & transport hub", aliases: ["kejetia market", "kejetia terminal"] },
  { name: "Adum", area: "Central business district", aliases: ["adum pz", "post office"] },
  { name: "Asafo", area: "Major transport interchange", aliases: ["asafo market", "asafo station", "asafo interchange"] },
  { name: "Tech Junction", area: "Major junction near KNUST", aliases: ["tech", "tech junc"] },
  { name: "Suame", area: "Industrial and auto hub, north Kumasi", aliases: ["suame magazine", "suame roundabout"] },

  // ── Popular Residential & Commercial Areas ──
  { name: "Abrepo", area: "Residential area, north Kumasi" },
  { name: "Adiebeba", area: "Residential area near Ahodwo" },
  { name: "Adiembra", area: "Neighborhood near Bantama" },
  { name: "Afful Nkwanta", area: "Junction area near Suame" },
  { name: "Ahenema Kokoben", area: "Residential suburb" },
  { name: "Ahensah", area: "Residential neighborhood" },
  { name: "Ahodwo", area: "Upscale residential area", aliases: ["ahodwo roundabout"] },
  { name: "Amakom", area: "Commercial area near Asafo", aliases: ["amakom roundabout"] },
  { name: "Amanfrom", area: "Residential neighborhood" },
  { name: "Ampabame", area: "Residential area" },
  { name: "Anloga", area: "Known for Anloga Junction", aliases: ["anloga junction"] },
  { name: "Anomanye", area: "Residential neighborhood" },
  { name: "Anwomaso", area: "Residential area near Ayeduase", aliases: ["anwomaso"] },
  { name: "Ash Town", area: "Neighborhood near Bantama", aliases: ["ashtown"] },
  { name: "Asawase", area: "Residential area near Asokore", aliases: ["sawase"] },
  { name: "Asem", area: "Residential neighborhood" },
  { name: "Asokore Mampong", area: "Large suburb, east Kumasi", aliases: ["asokore", "mampong"] },
  { name: "Asokwa", area: "Industrial and residential area", aliases: ["asokwa estate"] },
  { name: "Atasemanso", area: "Residential neighborhood" },
  { name: "Atonsu", area: "Residential area, south Kumasi", aliases: ["atonsu agogo"] },
  { name: "Ayeduase", area: "Suburb near KNUST", aliases: ["ayeduase new site"] },
  { name: "Ayigya", area: "Neighborhood near KNUST", aliases: ["ayigya zongo"] },
  { name: "Bantama", area: "Historic area and major hub", aliases: ["bantama high street"] },
  { name: "Bohyen", area: "Residential area near Bantama" },
  { name: "Boubai", area: "Residential neighborhood" },
  { name: "Buokrom", area: "Residential area", aliases: ["buokrom estate"] },
  { name: "Chirapatre", area: "Residential neighborhood" },
  { name: "Daban", area: "Residential suburb, south Kumasi" },
  { name: "Dakodwom", area: "Residential area" },
  { name: "Danyame", area: "Residential area near Ahodwo" },
  { name: "Dichemso", area: "Residential and commercial area" },
  { name: "Esreso", area: "Residential neighborhood" },
  { name: "Fankyenebra", area: "Residential area" },
  { name: "Fante New Town", area: "Historic neighborhood", aliases: ["fante town"] },
  { name: "Gyenyase", area: "Residential suburb" },
  { name: "Kaase", area: "Industrial area, south Kumasi", aliases: ["kaase airport area"] },
  { name: "Krofuom", area: "Residential neighborhood" },
  { name: "Kronum", area: "Residential area, north Kumasi" },
  { name: "Kropo", area: "Neighborhood near Manhyia" },
  { name: "Kwadaso", area: "Major suburb, west Kumasi", aliases: ["kwadaso estate", "kwadaso agric"] },
  { name: "Maakro", area: "Residential neighborhood" },
  { name: "Manhyia", area: "Historic area — Manhyia Palace", aliases: ["manhyia palace", "manhyia roundabout"] },
  { name: "Mbrom", area: "Neighborhood near Adum" },
  { name: "Moshie Zongo", area: "Residential area" },
  { name: "New Tafo", area: "Residential suburb", aliases: ["tafo"] },
  { name: "Nhyiaeso", area: "Residential area near Ahodwo", aliases: ["nhyiaeso roundabout"] },
  { name: "North Suntreso", area: "Residential suburb" },
  { name: "Odoum", area: "Residential neighborhood" },
  { name: "Offinso", area: "Town north of Kumasi" },
  { name: "Ohwim", area: "Residential suburb" },
  { name: "Old Tafo", area: "Historic residential area", aliases: ["old tafo hospital"] },
  { name: "Patasi", area: "Residential suburb, west Kumasi", aliases: ["patasi estate"] },
  { name: "Santasi", area: "Residential and commercial area", aliases: ["santasi roundabout"] },
  { name: "Sokoban", area: "Residential area", aliases: ["sokoban wood village"] },
  { name: "South Suntreso", area: "Residential suburb" },
  { name: "Suntreso", area: "Residential and commercial suburb" },
  { name: "Tanoso", area: "Suburb, west Kumasi" },
];

/**
 * Search/filter places by query string. Matches name, area, and aliases.
 */
export function filterKumasiPlaces(query: string): KumasiPlace[] {
  const q = query.trim().toLowerCase();
  if (!q) return kumasiPlaces;

  return kumasiPlaces.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.area.toLowerCase().includes(q) ||
      p.aliases?.some((a) => a.toLowerCase().includes(q)),
  );
}
