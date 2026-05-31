import type { Scope3CategoryDefinition } from "@/types/assessment.types";

export const PURCHASED_GOODS_SUBCATEGORIES: Record<string, string[]> = {
  "Raw Materials & Production Inputs": [
    "Metals & Minerals",
    "Chemicals & Industrial Materials",
    "Plastics, Rubber & Polymers",
    "Paper, Wood & Packaging Inputs",
    "Textile & Fabric Materials",
    "Agricultural & Food Ingredients",
  ],
  "Components, Parts & Manufactured Products": [
    "Machinery & Industrial Components",
    "Electrical & Electronic Components",
    "Automotive & Transport Components",
    "Finished Goods for Resale",
  ],
  "Packaging Materials": [
    "Primary Packaging",
    "Secondary Packaging",
    "Transport Packaging",
  ],
  "Office, Workplace & General Operational Supplies": [
    "Office Supplies",
    "Pantry & Hospitality Supplies",
    "Cleaning & Janitorial Supplies",
    "Health, Safety & PPE",
    "Furniture & Workplace Items",
  ],
  "Information Technology (IT) & Digital Purchases": [
    "IT Equipment",
    "Software & SaaS Services",
    "Cloud & Data Services",
    "IT Support & Managed Services",
  ],
  "Professional & Corporate Services": [
    "Consulting & Advisory",
    "Legal & Compliance Services",
    "Accounting & Financial Services",
    "Certification & Verification Services",
  ],
  "Facility & Operational Services": [
    "Building & Facility Management",
    "Cleaning & Housekeeping Services",
    "Security Services",
    "Catering & Food Services",
    "Waste & Environmental Services",
  ],
  "Logistics, Warehousing & Distribution Services": [
    "Third-Party Logistics (3PL)",
    "Courier & Delivery Services",
    "Storage & Warehousing",
  ],
  "Human Resources & Workforce Services": [
    "Recruitment & Staffing",
    "Employee Training & Development",
    "Employee Welfare Services",
  ],
  "Marketing, Media & Communication Services": [
    "Advertising & Branding",
    "Media & Printing",
    "Website & Creative Services",
  ],
  "Research, Testing & Technical Services": [
    "Laboratory & Testing Services",
    "Research & Development Services",
  ],
  "Utilities & Consumable Services": [
    "Water Services",
    "Steam, Cooling & Heating",
    "Telecommunications",
  ],
};

export const PURCHASED_GOODS_EXAMPLES: Record<string, string[]> = {
  "Metals & Minerals": [
    "Steel",
    "Aluminum",
    "Copper",
    "Iron",
    "Zinc",
    "Cement",
  ],
  "Chemicals & Industrial Materials": [
    "Industrial chemicals",
    "Solvents",
    "Paints & coatings",
    "Adhesives",
    "Lubricants",
  ],
  "Plastics, Rubber & Polymers": [
    "Plastic granules",
    "Polymer sheets",
    "Rubber materials",
    "PVC",
    "Silicone",
  ],
  "Paper, Wood & Packaging Inputs": [
    "Paper",
    "Cardboard",
    "Pulp",
    "Timber",
    "Plywood",
    "Wooden pallets",
  ],
  "Textile & Fabric Materials": [
    "Cotton",
    "Polyester",
    "Leather",
    "Fabric rolls",
  ],
  "Agricultural & Food Ingredients": [
    "Grains",
    "Sugar",
    "Dairy",
    "Oils",
    "Meat products",
  ],
  "Machinery & Industrial Components": [
    "Motors",
    "Pumps",
    "Compressors",
    "Valves",
    "Bearings",
  ],
  "Electrical & Electronic Components": [
    "Circuit boards",
    "Cables",
    "Sensors",
    "Batteries",
    "Transformers",
  ],
  "Automotive & Transport Components": [
    "Vehicle parts",
    "Tires",
    "Engine components",
    "Spare parts",
  ],
  "Finished Goods for Resale": [
    "Consumer products",
    "Retail inventory",
    "Trading goods",
  ],
  "Primary Packaging": ["Bottles", "Containers", "Wrappers", "Labels"],
  "Secondary Packaging": ["Cartons", "Boxes", "Bubble wrap", "Protective foam"],
  "Transport Packaging": [
    "Pallets",
    "Crates",
    "Shipping containers",
    "Stretch films",
  ],
  "Office Supplies": ["Paper", "Pens", "Printer ink", "Stationery"],
  "Pantry & Hospitality Supplies": [
    "Coffee/tea",
    "Drinking water",
    "Disposable cups",
  ],
  "Cleaning & Janitorial Supplies": [
    "Cleaning chemicals",
    "Tissues",
    "Sanitizers",
  ],
  "Health, Safety & PPE": ["Helmets", "Gloves", "Masks", "Safety shoes"],
  "Furniture & Workplace Items": [
    "Chairs",
    "Desks",
    "Storage units",
    "Office fixtures",
  ],
  "IT Equipment": [
    "Laptops",
    "Monitors",
    "Mobile phones",
    "Printers",
    "Routers",
  ],
  "Software & SaaS Services": [
    "ERP software",
    "CRM tools",
    "Cloud software",
    "SaaS subscriptions",
  ],
  "Cloud & Data Services": ["Cloud hosting", "Data centers", "Server hosting"],
  "IT Support & Managed Services": [
    "IT AMC contracts",
    "Helpdesk support",
    "Cybersecurity services",
  ],
  "Consulting & Advisory": [
    "ESG consulting",
    "Management consulting",
    "Engineering consultancy",
  ],
  "Legal & Compliance Services": [
    "Legal advisors",
    "Regulatory consultants",
    "Compliance audits",
  ],
  "Accounting & Financial Services": [
    "Accounting firms",
    "Audit services",
    "Tax consultants",
  ],
  "Certification & Verification Services": [
    "ISO certification",
    "GHG verification",
    "ESG assurance",
  ],
  "Building & Facility Management": [
    "Facility management",
    "HVAC maintenance",
    "Building maintenance",
  ],
  "Cleaning & Housekeeping Services": [
    "Janitorial contracts",
    "Deep cleaning",
    "Pest control",
  ],
  "Security Services": [
    "Security guards",
    "Surveillance monitoring",
    "Access control",
  ],
  "Catering & Food Services": [
    "Staff catering",
    "Cafeteria operations",
    "Event catering",
  ],
  "Waste & Environmental Services": [
    "Waste collection",
    "Hazardous waste handling",
    "Recycling services",
  ],
  "Third-Party Logistics (3PL)": [
    "Outsourced logistics",
    "Freight management",
    "Warehousing",
  ],
  "Courier & Delivery Services": [
    "Parcel services",
    "Document delivery",
    "Last-mile logistics",
  ],
  "Storage & Warehousing": [
    "Cold storage",
    "Inventory storage",
    "Warehouse rental",
  ],
  "Recruitment & Staffing": [
    "Recruitment agencies",
    "Temporary staffing",
    "Manpower supply",
  ],
  "Employee Training & Development": [
    "Corporate training",
    "E-learning services",
    "Skill development",
  ],
  "Employee Welfare Services": [
    "Accommodation services",
    "Transportation contracts",
    "Medical services",
  ],
  "Advertising & Branding": [
    "Digital marketing",
    "Branding agencies",
    "Advertising campaigns",
  ],
  "Media & Printing": [
    "Printing services",
    "Promotional materials",
    "Corporate gifts",
  ],
  "Website & Creative Services": [
    "Website development",
    "Graphic design",
    "Video production",
  ],
  "Laboratory & Testing Services": [
    "Product testing",
    "Environmental testing",
    "Calibration services",
  ],
  "Research & Development Services": [
    "Product R&D",
    "Scientific research",
    "Innovation programs",
  ],
  "Water Services": [
    "Purchased water",
    "Tanker water",
    "Water treatment services",
  ],
  "Steam, Cooling & Heating": [
    "Purchased steam",
    "District cooling",
    "Chilled water",
  ],
  Telecommunications: [
    "Internet services",
    "Mobile services",
    "Communication networks",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// WASTE CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

export const WASTE_CATEGORIES = [
  {
    id: "municipal",
    label: "General Municipal Waste",
    examples: "Mixed office waste",
    methods: "Landfill, incineration",
  },
  {
    id: "food",
    label: "Food / Organic Waste",
    examples: "Cafeteria waste, biodegradable",
    methods: "Composting, anaerobic digestion",
  },
  {
    id: "paper",
    label: "Paper & Cardboard",
    examples: "Office paper, cartons",
    methods: "Recycling, landfill",
  },
  {
    id: "plastic",
    label: "Plastic Waste",
    examples: "Packaging, bottles",
    methods: "Recycling, incineration",
  },
  {
    id: "glass",
    label: "Glass Waste",
    examples: "Bottles, containers",
    methods: "Recycling",
  },
  {
    id: "metal",
    label: "Metal Scrap",
    examples: "Steel, aluminum scrap",
    methods: "Recycling",
  },
  {
    id: "wood",
    label: "Wood Waste",
    examples: "Pallets, timber",
    methods: "Recycling, landfill, combustion",
  },
  {
    id: "ewaste",
    label: "E-Waste",
    examples: "Computers, electronics",
    methods: "Specialized recycling",
  },
  {
    id: "hazardous",
    label: "Hazardous Waste",
    examples: "Chemicals, solvents, batteries",
    methods: "Hazardous treatment/incineration",
  },
  {
    id: "construction",
    label: "Construction & Demolition Waste",
    examples: "Concrete, debris",
    methods: "Recycling, landfill",
  },
  {
    id: "wastewater",
    label: "Wastewater",
    examples: "Sewage, industrial effluent",
    methods: "Wastewater treatment",
  },
  {
    id: "recyclables",
    label: "Recyclables",
    examples: "Segregated recyclable streams",
    methods: "Material recovery",
  },
  {
    id: "incinerated",
    label: "Incinerated Waste",
    examples: "Waste-to-energy streams",
    methods: "Energy recovery",
  },
  {
    id: "landfilled",
    label: "Landfilled Waste",
    examples: "Mixed disposal waste",
    methods: "Landfill",
  },
  {
    id: "packaging_eol",
    label: "Sold Product Packaging Waste",
    examples: "Consumer packaging disposal",
    methods: "Recycling, landfill",
  },
  {
    id: "product_eol",
    label: "Product End-of-Life Waste",
    examples: "Disposed sold products",
    methods: "Recycling, disposal",
  },
];

export const WASTE_DISPOSAL_METHODS = [
  "Recycling",
  "Landfill",
  "Incineration",
  "Composting",
  "Waste-to-energy",
  "Hazardous treatment",
];

// ─────────────────────────────────────────────────────────────────────────────
// TRANSPORT MODES
// ─────────────────────────────────────────────────────────────────────────────

export const TRANSPORT_MODES = [
  { id: "road", label: "Road Freight", icon: "Truck" },
  { id: "air", label: "Air Freight", icon: "Plane" },
  { id: "rail", label: "Rail Freight", icon: "Train" },
  { id: "marine", label: "Marine Shipping", icon: "Ship" },
  { id: "courier", label: "Courier / Parcel", icon: "Package" },
];

// ─────────────────────────────────────────────────────────────────────────────
// BUSINESS TRAVEL MODES
// ─────────────────────────────────────────────────────────────────────────────

export const BUSINESS_TRAVEL_MODES = [
  { id: "air", label: "Air Travel", icon: "Plane" },
  { id: "rail", label: "Rail", icon: "Train" },
  { id: "taxi", label: "Taxi / Ride Sharing", icon: "Car" },
  { id: "personal", label: "Personal Vehicles", icon: "CarFront" },
  { id: "hotel", label: "Hotel Accommodation", icon: "Building" },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMMUTE MODES
// ─────────────────────────────────────────────────────────────────────────────

export const COMMUTE_MODES = [
  { id: "car", label: "Personal Car", icon: "Car" },
  { id: "carpool", label: "Carpool", icon: "Users" },
  { id: "bus", label: "Bus", icon: "Bus" },
  { id: "metro", label: "Metro / Train", icon: "Train" },
  { id: "motorbike", label: "Motorcycle", icon: "Bike" },
  { id: "bicycle", label: "Bicycle", icon: "Bike" },
  { id: "walking", label: "Walking", icon: "Footprints" },
  { id: "company", label: "Company Transport", icon: "BusFront" },
];

// ─────────────────────────────────────────────────────────────────────────────
// DATA MONITORING METHODS (shared across categories)
// ─────────────────────────────────────────────────────────────────────────────

export const MONITORING_METHOD_OPTIONS = [
  { id: "spend_based", label: "Amount Spent (currency-based)" },
  { id: "quantity_based", label: "Quantity Purchased (kg, liters, units)" },
  { id: "both", label: "Both Quantity and Spend" },
  { id: "erp", label: "Procurement / ERP Records" },
  { id: "not_tracked", label: "Not Tracked" },
];

export const PRIMARY_DATA_SOURCES = [
  "ERP / SAP Systems",
  "Procurement Systems",
  "Finance Records",
  "Vendor / Supplier Data",
  "Logistics Providers",
  "Utility Bills",
  "Manual Tracking Sheets",
  "Surveys / Questionnaires",
  "Asset Registers",
  "IoT / Smart Monitoring Systems",
  "Travel Management Systems",
  "Waste Vendor Reports",
];

// ─────────────────────────────────────────────────────────────────────────────
// SCOPE 3 CATEGORIES — All 15
// ─────────────────────────────────────────────────────────────────────────────

export const SCOPE3_CATEGORIES: Scope3CategoryDefinition[] = [
  {
    id: 1,
    ghgCode: "Cat 1",
    isUpstream: true,
    name: "Purchased Goods & Services",
    iconName: "ShoppingCart",
    description:
      "Upstream emissions from the production of all goods and services purchased by your organization.",
    examples: [
      "Raw materials",
      "Office supplies",
      "IT equipment",
      "Professional services",
      "Cloud services",
    ],
  },
  {
    id: 2,
    ghgCode: "Cat 2",
    isUpstream: true,
    name: "Capital Goods",
    iconName: "Factory",
    description:
      "Emissions from the production of capital assets purchased or acquired by your organization.",
    examples: [
      "Manufacturing equipment",
      "Machinery",
      "Servers & IT infrastructure",
      "Buildings",
      "Vehicles",
    ],
  },
  {
    id: 3,
    ghgCode: "Cat 3",
    isUpstream: true,
    name: "Fuel & Energy Related Activities",
    iconName: "Zap",
    description:
      "Emissions not included in Scope 1 or 2 related to fuel and energy consumption.",
    examples: [
      "Upstream fuel extraction",
      "Transmission & distribution losses",
      "Generation of purchased electricity",
    ],
  },
  {
    id: 4,
    ghgCode: "Cat 4",
    isUpstream: true,
    name: "Upstream Transportation & Distribution",
    iconName: "Truck",
    description:
      "Emissions from third-party transportation of purchased goods and materials to your organization.",
    examples: [
      "Supplier deliveries",
      "Freight transportation",
      "Import/export shipping",
      "Courier deliveries",
    ],
  },
  {
    id: 5,
    ghgCode: "Cat 5",
    isUpstream: true,
    name: "Waste Generated in Operations",
    iconName: "Trash2",
    description:
      "Emissions from disposal and treatment of waste generated in your operations.",
    examples: [
      "Office waste",
      "Industrial waste",
      "Packaging waste",
      "Food waste",
      "Hazardous waste",
    ],
  },
  {
    id: 6,
    ghgCode: "Cat 6",
    isUpstream: true,
    name: "Business Travel",
    iconName: "Briefcase",
    description:
      "Emissions from employee travel for business purposes in vehicles not owned by the organization.",
    examples: [
      "Flights",
      "Hotel stays",
      "Train travel",
      "Rental vehicles",
      "Taxi services",
    ],
  },
  {
    id: 7,
    ghgCode: "Cat 7",
    isUpstream: true,
    name: "Employee Commuting",
    iconName: "Users",
    description:
      "Emissions from employee travel between their homes and work sites.",
    examples: [
      "Personal car commute",
      "Public transport",
      "Company shuttle",
      "Remote work",
    ],
  },
  {
    id: 8,
    ghgCode: "Cat 8",
    isUpstream: true,
    name: "Upstream Leased Assets",
    iconName: "KeyRound",
    description:
      "Emissions from assets leased by your organization not included in Scope 1 or 2.",
    examples: [
      "Rented offices",
      "Warehouses",
      "Leased vehicles",
      "Data centers",
      "Manufacturing equipment",
    ],
  },
  {
    id: 9,
    ghgCode: "Cat 9",
    isUpstream: false,
    name: "Downstream Transportation & Distribution",
    iconName: "PackageCheck",
    description:
      "Emissions from third-party transportation of sold products to customers.",
    examples: [
      "Product deliveries",
      "Distributor transportation",
      "Export shipments",
      "Retail distribution",
    ],
  },
  {
    id: 10,
    ghgCode: "Cat 10",
    isUpstream: false,
    name: "Processing of Sold Products",
    iconName: "Settings2",
    description:
      "Emissions from processing of sold intermediate products by customers.",
    examples: [
      "Chemicals used in manufacturing",
      "Steel in automotive",
      "Intermediate materials",
    ],
  },
  {
    id: 11,
    ghgCode: "Cat 11",
    isUpstream: false,
    name: "Use of Sold Products",
    iconName: "Plug",
    description:
      "Emissions from the use of goods and services sold by your organization.",
    examples: [
      "Electrical appliances",
      "Vehicles",
      "HVAC systems",
      "Fuel-burning equipment",
    ],
  },
  {
    id: 12,
    ghgCode: "Cat 12",
    isUpstream: false,
    name: "End-of-Life Treatment of Sold Products",
    iconName: "Recycle",
    description:
      "Emissions from waste disposal and treatment of products sold by your organization at end of life.",
    examples: [
      "Packaging waste",
      "Electronics disposal",
      "Batteries",
      "Plastic products",
    ],
  },
  {
    id: 13,
    ghgCode: "Cat 13",
    isUpstream: false,
    name: "Downstream Leased Assets",
    iconName: "Building2",
    description:
      "Emissions from assets owned by your organization and leased to others.",
    examples: [
      "Leased buildings",
      "Equipment rentals",
      "Vehicle leasing",
      "Industrial machinery",
    ],
  },
  {
    id: 14,
    ghgCode: "Cat 14",
    isUpstream: false,
    name: "Franchises",
    iconName: "Store",
    description:
      "Emissions from franchise operations not included in Scope 1 or 2.",
    examples: ["Franchise restaurants", "Retail outlets", "Service franchises"],
  },
  {
    id: 15,
    ghgCode: "Cat 15",
    isUpstream: false,
    name: "Investments",
    iconName: "TrendingUp",
    description:
      "Emissions associated with your organization's investments and financial activities.",
    examples: [
      "Equity investments",
      "Project financing",
      "Venture capital",
      "Subsidiaries",
    ],
  },
];
