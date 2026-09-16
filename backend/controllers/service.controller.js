const Service = require("../models/service.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

/**
 * 18 Curated Baseline Services (3 tiers per category)
 * Auto-seeded when MongoDB collection is empty.
 */
const DEFAULT_SEED_SERVICES = [
  // --- 1. WEDDING ---
  {
    category: "wedding",
    tier: "Essential",
    folioLabel: "Folio 01",
    eyebrow: "INTIMATE SINGLE DAY",
    subtitle: "Single Day Gathering & Intimate Nuptials",
    badge: "",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
    imageTag: "",
    price: null,
    priceNote: "Exclusive of applicable state VAT / Art transport",
    description: "Curated single-day pacing crafted for intimate nuptials and bespoke gatherings.",
    privilegesLabel: "INCLUDED DELIVERABLES",
    deliverables: [
      "Lead principal photographer + associate",
      "35mm analog film rolls (Portra 400 & HP5)",
      "Private online proofing gallery & print release",
      "Archival USB folio in Belgian linen",
    ],
    order: 1,
    isActive: true,
    isRecommended: false,
  },
  {
    category: "wedding",
    tier: "Signature",
    folioLabel: "Folio 02",
    eyebrow: "ATELIER SIGNATURE CHOICE",
    subtitle: "The Classic Multi-Event Journey",
    badge: "Recommended",
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop",
    imageTag: "120 Analog Film",
    price: null,
    priceNote: "Priority atelier calendar allocation 2025–2026",
    description: "Comprehensive multi-event journey documented on analog medium format and digital raw.",
    privilegesLabel: "INCLUDED ATELIER PRIVILEGES",
    deliverables: [
      "Creative director + 2 master associates",
      "120 Medium Format & 35mm analog film",
      "Handcrafted 12x12 Italian leather heirloom album",
      "Drone & aerial architectural context",
      "Priority 3-week archival digital proof delivery",
    ],
    order: 2,
    isActive: true,
    isRecommended: true,
  },
  {
    category: "wedding",
    tier: "Luxury",
    folioLabel: "Folio 03",
    eyebrow: "DESTINATION RESIDENCY",
    subtitle: "The Complete Destination Residency",
    badge: "",
    imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop",
    imageTag: "Worldwide Residency",
    price: null,
    priceNote: "All atelier travel & lodging inclusive worldwide",
    description: "Full multi-day destination residency with archival narrative monograph and fine-art volumes.",
    privilegesLabel: "INCLUDED DELIVERABLES",
    deliverables: [
      "Full atelier team (Principal, Cinema, Aerial)",
      "Unlimited 35mm & 120 analog negatives (Paris lab)",
      "Bespoke 14x14 heirloom album + 2 parent albums",
      "Pre-wedding editorial session in Europe",
      "Worldwide travel & accommodation covered",
    ],
    order: 3,
    isActive: true,
    isRecommended: false,
  },

  // --- 2. PRE-WEDDING ---
  {
    category: "pre-wedding",
    tier: "Sunset Editorial",
    folioLabel: "Folio 01",
    eyebrow: "GOLDEN HOUR EDITORIAL",
    subtitle: "Intimate Coastal or Countryside Vignette",
    badge: "",
    imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop",
    imageTag: "",
    price: null,
    priceNote: "Single location · Ideal for lakeside or cliffside estates",
    description: "Deliberately paced 3-hour natural light editorial celebrating the quiet chapters before marriage.",
    privilegesLabel: "INCLUDED DELIVERABLES",
    deliverables: [
      "3 Hours focused natural ambient coverage",
      "2 Curated styling and wardrobe transitions",
      "35mm analog film exposures (Kodak Portra)",
      "Private password-protected digital folio",
    ],
    order: 1,
    isActive: true,
    isRecommended: false,
  },
  {
    category: "pre-wedding",
    tier: "Paris Chapter",
    folioLabel: "Folio 02",
    eyebrow: "HISTORIC DESTINATION VOYAGE",
    subtitle: "Full Day Architectural & Editorial Sojourn",
    badge: "Recommended",
    imageUrl: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1000&auto=format&fit=crop",
    imageTag: "Medium Format 6x7",
    price: null,
    priceNote: "Europe / Mediterranean travel inclusive",
    description: "Immersive full-day photographic voyage moving through iconic architecture and private gardens.",
    privilegesLabel: "INCLUDED ATELIER PRIVILEGES",
    deliverables: [
      "Full day editorial direction (Dawn to Twilight)",
      "Hasselblad Medium Format 6x7 analog captures",
      "Haute couture wardrobe coordination assistance",
      "Bespoke 10x10 linen presentation volume",
    ],
    order: 2,
    isActive: true,
    isRecommended: true,
  },
  {
    category: "pre-wedding",
    tier: "Atelier Cinema",
    folioLabel: "Folio 03",
    eyebrow: "MULTI-DAY CINEMATIC EXPEDITION",
    subtitle: "The 35mm Motion & Still Monograph",
    badge: "",
    imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1000&auto=format&fit=crop",
    imageTag: "16mm Cine Film",
    price: null,
    priceNote: "Worldwide expedition rights",
    description: "Dual-medium expedition capturing synchronized motion picture stills and archival large format frames.",
    privilegesLabel: "INCLUDED DELIVERABLES",
    deliverables: [
      "2-Day expedition coverage across 2 unique landscapes",
      "16mm motion picture film teaser vignette",
      "Master archival print box with 20 museum prints",
      "Bespoke leather case with silver USB token",
    ],
    order: 3,
    isActive: true,
    isRecommended: false,
  },

  // --- 3. BIRTHDAY ---
  {
    category: "birthday",
    tier: "Intimate Salon",
    folioLabel: "Folio 01",
    eyebrow: "PRIVATE GATHERING",
    subtitle: "Candid Dinner & Candlelit Milestone",
    badge: "",
    imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1000&auto=format&fit=crop",
    imageTag: "",
    price: null,
    priceNote: "Dinner party & salon coverage",
    description: "Unobtrusive documentary framing of laughter, toasts, and intimate table conversations.",
    privilegesLabel: "INCLUDED DELIVERABLES",
    deliverables: [
      "4 Hours discrete evening coverage",
      "Ambient low-light Leica prime optics",
      "180+ Hand-graded digital archival images",
      "Private gallery with high-res download rights",
    ],
    order: 1,
    isActive: true,
    isRecommended: false,
  },
  {
    category: "birthday",
    tier: "Milestone Soirée",
    folioLabel: "Folio 02",
    eyebrow: "HIGH CELEBRATION",
    subtitle: "Full Evening Gala & Party Narrative",
    badge: "Recommended",
    imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1000&auto=format&fit=crop",
    imageTag: "Direct Flash & 35mm",
    price: null,
    priceNote: "Single evening up to 7 hours",
    description: "Dynamic high-fashion reportage combining raw flash aesthetic with nuanced cocktail portraits.",
    privilegesLabel: "INCLUDED ATELIER PRIVILEGES",
    deliverables: [
      "7 Hours dual-photographer coverage",
      "On-site archival portrait corner for guests",
      "35mm film rolls developed with grain retention",
      "Curated 24-hour social preview set (25 photos)",
    ],
    order: 2,
    isActive: true,
    isRecommended: true,
  },
  {
    category: "birthday",
    tier: "Grand Celebration",
    folioLabel: "Folio 03",
    eyebrow: "WEEKEND FETE",
    subtitle: "Multi-Day Birthday Soiree & Recovery Brunch",
    badge: "",
    imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1000&auto=format&fit=crop",
    imageTag: "Full Weekend Folio",
    price: null,
    priceNote: "Up to 2 consecutive days",
    description: "Comprehensive multi-part coverage covering welcome cocktails, gala evening, and poolside brunch.",
    privilegesLabel: "INCLUDED DELIVERABLES",
    deliverables: [
      "2-Day comprehensive event documentation",
      "Cinema reel highlights vignette (60 seconds)",
      "Handmade silk-bound commemorative book",
      "All master raw edits delivered in archival format",
    ],
    order: 3,
    isActive: true,
    isRecommended: false,
  },

  // --- 4. PORTRAIT ---
  {
    category: "portrait",
    tier: "Daylight Atelier",
    folioLabel: "Folio 01",
    eyebrow: "MINIMALIST STUDIO STUDY",
    subtitle: "Natural Daylight & Spatial Stillness",
    badge: "",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
    imageTag: "",
    price: null,
    priceNote: "Studio booking fees included",
    description: "Pure portraiture focused on nuanced human presence, architectural shadow, and quiet posture.",
    privilegesLabel: "INCLUDED DELIVERABLES",
    deliverables: [
      "2 Hours daylight studio session",
      "3 Styling and wardrobe variations",
      "35mm analog monochrome & color frames",
      "15 Master hand-retouched fine art proofs",
    ],
    order: 1,
    isActive: true,
    isRecommended: false,
  },
  {
    category: "portrait",
    tier: "Archival Character",
    folioLabel: "Folio 02",
    eyebrow: "EDITORIAL LOCATION ESSAY",
    subtitle: "Environmental Persona in Context",
    badge: "Recommended",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
    imageTag: "Hasselblad 80mm",
    price: null,
    priceNote: "Private residence, atelier or outdoor location",
    description: "An evocative visual essay documenting the subject within their creative atelier, home, or landscape.",
    privilegesLabel: "INCLUDED ATELIER PRIVILEGES",
    deliverables: [
      "Half-day on-location narrative session",
      "Medium format Carl Zeiss optics",
      "Full personal and editorial usage license",
      "3 Fine-art cotton rag museum prints (A3+)",
    ],
    order: 2,
    isActive: true,
    isRecommended: true,
  },
  {
    category: "portrait",
    tier: "The Monograph",
    folioLabel: "Folio 03",
    eyebrow: "EXPEDITIONARY RETROSPECTIVE",
    subtitle: "Extensive Personal Monograph Volume",
    badge: "",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
    imageTag: "Fine Art Monograph",
    price: null,
    priceNote: "Worldwide travel by arrangement",
    description: "A monumental multi-session body of work composed into an exclusive limited-edition artist book.",
    privilegesLabel: "INCLUDED DELIVERABLES",
    deliverables: [
      "Multiple sessions across distinct spaces or seasons",
      "Full creative and sartorial direction",
      "One-of-one custom hand-bound linen monograph",
      "Archival gallery display rights included",
    ],
    order: 3,
    isActive: true,
    isRecommended: false,
  },

  // --- 5. EVENT ---
  {
    category: "event",
    tier: "Private Gathering",
    folioLabel: "Folio 01",
    eyebrow: "SALON & VERNISSAGE",
    subtitle: "Art Exhibition & Private Launch",
    badge: "",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop",
    imageTag: "",
    price: null,
    priceNote: "Single evening up to 4 hours",
    description: "Quiet, unobtrusive photographic capture of private gallery vernissages, dinners, and unveilings.",
    privilegesLabel: "INCLUDED DELIVERABLES",
    deliverables: [
      "4 Hours discreet documentation",
      "Architectural context & guest engagement",
      "Rapid next-day editorial PR preview batch",
      "High-res archive with commercial press rights",
    ],
    order: 1,
    isActive: true,
    isRecommended: false,
  },
  {
    category: "event",
    tier: "Gala & Vernissage",
    folioLabel: "Folio 02",
    eyebrow: "CORONATION OF AN EVENING",
    subtitle: "High-Capacity Gala, Gala Dinner & Red Carpet",
    badge: "Recommended",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop",
    imageTag: "Dual Direction",
    price: null,
    priceNote: "Up to 8 hours continuous coverage",
    description: "Dual-photographer coverage balancing monumental stage moments with candid salon encounters.",
    privilegesLabel: "INCLUDED ATELIER PRIVILEGES",
    deliverables: [
      "Lead principal + secondary photojournalist",
      "Red carpet step-and-repeat strobe lighting",
      "Same-night social media press assets",
      "Full high-res catalog with unlimited publication rights",
    ],
    order: 2,
    isActive: true,
    isRecommended: true,
  },
  {
    category: "event",
    tier: "High Profile Summit",
    folioLabel: "Folio 03",
    eyebrow: "MULTI-DAY CONGRESS",
    subtitle: "International Symposium & Leadership Forum",
    badge: "",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
    imageTag: "Complete Summit Agency",
    price: null,
    priceNote: "Up to 3 days continuous presence",
    description: "Complete media agency team deployment with real-time newsroom digital editing and instant wire dispatch.",
    privilegesLabel: "INCLUDED DELIVERABLES",
    deliverables: [
      "Multi-photographer team with on-site digital tech",
      "Live FTP / Cloud feed for instant journalism access",
      "Video highlight vignettes formatted for broadcast",
      "Archival master hard drive containing categorized raw assets",
    ],
    order: 3,
    isActive: true,
    isRecommended: false,
  },

  // --- 6. COMMERCIAL ---
  {
    category: "commercial",
    tier: "Editorial Lookbook",
    folioLabel: "Folio 01",
    eyebrow: "CAPSULE REVEAL",
    subtitle: "Fashion Lookbook & Seasonal Catalog",
    badge: "",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop",
    imageTag: "",
    price: null,
    priceNote: "1-Day studio or location shoot",
    description: "Clean, razor-sharp editorial lookbook highlighting garments, textures, and silhouettes.",
    privilegesLabel: "INCLUDED DELIVERABLES",
    deliverables: [
      "1 Full production day (up to 8 hours)",
      "Up to 20 complete wardrobe looks",
      "Digital tech on-set with live monitor calibration",
      "Commercial advertising & digital e-commerce rights",
    ],
    order: 1,
    isActive: true,
    isRecommended: false,
  },
  {
    category: "commercial",
    tier: "Haute Campaign",
    folioLabel: "Folio 02",
    eyebrow: "SEASONAL CAMPAIGN",
    subtitle: "Global Advertising & Billboard Visuals",
    badge: "Recommended",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop",
    imageTag: "Phase One 150MP",
    price: null,
    priceNote: "Global billboard and print campaign licensing",
    description: "Monumental medium-format imagery crafted with world-class lighting for print, digital, and out-of-home display.",
    privilegesLabel: "INCLUDED ATELIER PRIVILEGES",
    deliverables: [
      "Phase One 150MP ultra-resolution sensor capture",
      "Art direction, casting, and location scout guidance",
      "High-end fashion retouching with color mastery",
      "Global 2-year multi-channel advertising license",
    ],
    order: 2,
    isActive: true,
    isRecommended: true,
  },
  {
    category: "commercial",
    tier: "Brand Monograph",
    folioLabel: "Folio 03",
    eyebrow: "HERITAGE ARCHIVE",
    subtitle: "Maison Storytelling & Artisanal Legacy",
    badge: "",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop",
    imageTag: "Full Brand Heritage",
    price: null,
    priceNote: "Multi-week episodic project",
    description: "Deep narrative visual documentation of a brand's atelier, craftsmanship, founders, and spatial heritage.",
    privilegesLabel: "INCLUDED DELIVERABLES",
    deliverables: [
      "Multi-week episodic shoot schedule at ateliers and factories",
      "Still photography + cinema documentary shorts",
      "Hardbound limited edition coffee table book layout",
      "Perpetual worldwide archival ownership rights",
    ],
    order: 3,
    isActive: true,
    isRecommended: false,
  },
];

/**
 * @route   GET /api/services
 * @desc    Get services, optionally filtered by category
 * @access  Public
 */
const getAllServices = asyncHandler(async (req, res) => {
  const { category, includeInactive } = req.query;

  const query = {};
  if (category) {
    const rawCat = category.toLowerCase().trim();
    const variants = new Set([rawCat]);
    if (rawCat.endsWith('ies')) {
      variants.add(rawCat.slice(0, -3) + 'y');
    } else if (rawCat.endsWith('y')) {
      variants.add(rawCat.slice(0, -1) + 'ies');
    }
    if (rawCat.endsWith('s')) {
      variants.add(rawCat.slice(0, -1));
    } else {
      variants.add(`${rawCat}s`);
    }
    query.category = { $in: Array.from(variants) };
  }
  // Public callers only see active services; admin can pass includeInactive=true
  if (!includeInactive || includeInactive !== "true") {
    query.isActive = true;
  }

  let services = await Service.find(query).sort({ order: 1, createdAt: 1 });

  // Auto-seed default services if the entire collection has 0 items
  const totalCount = await Service.countDocuments();
  if (totalCount === 0) {
    try {
      await Service.insertMany(DEFAULT_SEED_SERVICES);
      services = await Service.find(query).sort({ order: 1, createdAt: 1 });
    } catch {
      // If DB insert fails (e.g. offline fallback), filter from in-memory array
      let inMemory = DEFAULT_SEED_SERVICES;
      if (category) {
        inMemory = inMemory.filter((s) => s.category === category.toLowerCase().trim());
      }
      return res.status(200).json(
        new ApiResponse(200, inMemory, "Default baseline services served")
      );
    }
  }

  return res.status(200).json(
    new ApiResponse(200, services, "Services retrieved successfully")
  );
});

/**
 * @route   GET /api/services/:id
 * @desc    Get single service by ID
 * @access  Public
 */
const getServiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const service = await Service.findById(id);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  return res.status(200).json(
    new ApiResponse(200, service, "Service retrieved successfully")
  );
});

/**
 * @route   POST /api/services
 * @desc    Create a new service tier
 * @access  Admin Only
 */
const createService = asyncHandler(async (req, res) => {
  let {
    category,
    tier,
    folioLabel,
    eyebrow,
    subtitle,
    badge,
    imageUrl,
    imageTag,
    price,
    priceNote,
    description,
    privilegesLabel,
    deliverables,
    order,
    isActive,
    isRecommended,
  } = req.body;

  if (!category || !tier) {
    throw new ApiError(400, "Category and tier name are required");
  }

  const cleanCategory = category.toLowerCase().trim();
  if (!cleanCategory) {
    throw new ApiError(400, "Valid category is required");
  }

  // Handle file upload if provided
  if (req.file) {
    const uploaded = await uploadOnCloudinary(req.file.path, "services");
    if (uploaded && uploaded.url) {
      imageUrl = uploaded.url;
    }
  }

  // Deliverables parsing (supports JSON string or array)
  let parsedDeliverables = [];
  if (Array.isArray(deliverables)) {
    parsedDeliverables = deliverables.map((d) => String(d).trim()).filter(Boolean);
  } else if (typeof deliverables === "string") {
    try {
      const parsed = JSON.parse(deliverables);
      if (Array.isArray(parsed)) {
        parsedDeliverables = parsed.map((d) => String(d).trim()).filter(Boolean);
      } else {
        parsedDeliverables = deliverables.split("\n").map((d) => d.trim()).filter(Boolean);
      }
    } catch {
      parsedDeliverables = deliverables.split("\n").map((d) => d.trim()).filter(Boolean);
    }
  }

  // Parse price (null = "[PRICE TO BE ADDED]")
  let parsedPrice = null;
  if (price !== undefined && price !== null && price !== "" && String(price).toLowerCase() !== "null") {
    const num = Number(price);
    if (!isNaN(num) && num >= 0) {
      parsedPrice = num;
    }
  }

  // Determine order: if not specified, place at end of category
  if (order === undefined || order === null || isNaN(Number(order))) {
    const lastService = await Service.findOne({ category: cleanCategory }).sort({ order: -1 });
    order = lastService && typeof lastService.order === "number" ? lastService.order + 1 : 1;
  } else {
    order = Number(order);
  }

  const service = await Service.create({
    category: cleanCategory,
    tier: tier.trim(),
    folioLabel: folioLabel ? folioLabel.trim() : "",
    eyebrow: eyebrow ? eyebrow.trim() : "",
    subtitle: subtitle ? subtitle.trim() : "",
    badge: badge ? badge.trim() : "",
    imageUrl: imageUrl ? imageUrl.trim() : "",
    imageTag: imageTag ? imageTag.trim() : "",
    price: parsedPrice,
    priceNote: priceNote ? priceNote.trim() : "",
    description: description ? description.trim() : "",
    privilegesLabel: privilegesLabel ? privilegesLabel.trim() : "INCLUDED DELIVERABLES",
    deliverables: parsedDeliverables,
    order,
    isActive: isActive === undefined ? true : Boolean(isActive),
    isRecommended: isRecommended === undefined ? false : Boolean(isRecommended),
  });

  return res.status(201).json(
    new ApiResponse(201, service, "Service created successfully")
  );
});

/**
 * @route   PUT /api/services/:id
 * @desc    Update an existing service tier
 * @access  Admin Only
 */
const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const service = await Service.findById(id);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  const {
    category,
    tier,
    folioLabel,
    eyebrow,
    subtitle,
    badge,
    imageUrl,
    imageTag,
    price,
    priceNote,
    description,
    privilegesLabel,
    deliverables,
    order,
    isActive,
    isRecommended,
  } = req.body;

  if (category) {
    const cleanCategory = category.toLowerCase().trim();
    if (!cleanCategory) {
      throw new ApiError(400, "Valid category is required");
    }
    service.category = cleanCategory;
  }

  if (tier !== undefined) service.tier = tier.trim();
  if (folioLabel !== undefined) service.folioLabel = folioLabel.trim();
  if (eyebrow !== undefined) service.eyebrow = eyebrow.trim();
  if (subtitle !== undefined) service.subtitle = subtitle.trim();
  if (badge !== undefined) service.badge = badge.trim();
  if (imageTag !== undefined) service.imageTag = imageTag.trim();
  if (priceNote !== undefined) service.priceNote = priceNote.trim();
  if (description !== undefined) service.description = description.trim();
  if (privilegesLabel !== undefined) service.privilegesLabel = privilegesLabel.trim();

  // Price handling
  if (price !== undefined) {
    if (price === null || price === "" || String(price).toLowerCase() === "null") {
      service.price = null;
    } else {
      const num = Number(price);
      if (!isNaN(num) && num >= 0) {
        service.price = num;
      }
    }
  }

  // Handle image upload or image URL update
  if (req.file) {
    const uploaded = await uploadOnCloudinary(req.file.path, "services");
    if (uploaded && uploaded.url) {
      service.imageUrl = uploaded.url;
    }
  } else if (imageUrl !== undefined) {
    service.imageUrl = imageUrl.trim();
  }

  // Deliverables update
  if (deliverables !== undefined) {
    if (Array.isArray(deliverables)) {
      service.deliverables = deliverables.map((d) => String(d).trim()).filter(Boolean);
    } else if (typeof deliverables === "string") {
      try {
        const parsed = JSON.parse(deliverables);
        if (Array.isArray(parsed)) {
          service.deliverables = parsed.map((d) => String(d).trim()).filter(Boolean);
        } else {
          service.deliverables = deliverables.split("\n").map((d) => d.trim()).filter(Boolean);
        }
      } catch {
        service.deliverables = deliverables.split("\n").map((d) => d.trim()).filter(Boolean);
      }
    }
  }

  if (order !== undefined && !isNaN(Number(order))) {
    service.order = Number(order);
  }

  if (isActive !== undefined) {
    service.isActive = Boolean(isActive);
  }

  if (isRecommended !== undefined) {
    service.isRecommended = Boolean(isRecommended);
  }

  await service.save();

  return res.status(200).json(
    new ApiResponse(200, service, "Service updated successfully")
  );
});

/**
 * @route   DELETE /api/services/:id
 * @desc    Delete a service tier
 * @access  Admin Only
 */
const deleteService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const service = await Service.findById(id);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  await Service.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(200, { id }, "Service deleted successfully")
  );
});

/**
 * @route   PATCH /api/services/reorder
 * @desc    Reorder services within a category
 * @access  Admin Only
 */
const reorderServices = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Items array with { id, order } is required");
  }

  const bulkOps = items.map((item) => ({
    updateOne: {
      filter: { _id: item.id || item._id },
      update: { $set: { order: Number(item.order) } },
    },
  }));

  await Service.bulkWrite(bulkOps);

  return res.status(200).json(
    new ApiResponse(200, null, "Services reordered successfully")
  );
});

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  reorderServices,
  DEFAULT_SEED_SERVICES,
};
