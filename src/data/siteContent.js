export const siteContent = {
  brand: 'SaltWaterCam',
  logoText: 'SALTWATERCAM.COM',
  logoSubtext: 'EXPLORE • LEARN • PROTECT',
  tagline: 'DIVE INTO WONDER. LIVE THE OCEAN.',
  locationBadge: 'LIVE FROM BOYNTON BEACH INLET, FL',
  description: 'Real Ocean. Real Life. Real Impact.',
  location: 'Lantana, Florida • Near Boynton Beach Inlet',
  aboutHeadline: "One simple window into Florida's underwater world.",
  aboutText: "SaltWaterCam is a live underwater camera experience created to share Florida's coastal marine life with families, students, and ocean lovers. Located at the end of a dock near Lantana, Florida, close to the Boynton Beach Inlet, the camera utilizes a green underwater light to attract fish and provide clear visibility day and night.",
  
  // Tabs supported in V2
  tabs: [
    { id: 'home', label: 'Home' },
    { id: 'watch', label: 'Watch Live' },
    { id: 'marine-guide', label: 'Marine Guide' },
    { id: 'kids-club', label: 'Ocean Academy 🎓' },
    { id: 'community', label: 'Community' },
    { id: 'about', label: 'About' }
  ],

  // Environmental conditions
  conditions: [
    { label: 'Water Temp', value: '78.4 °F', desc: 'Bermuda Current influence' },
    { label: 'Visibility', value: 'Good (65 ft)', desc: 'Clear ocean inflow' },
    { label: 'Current', value: 'Incoming', desc: 'Flowing into the inlet' },
    { label: 'Tide', value: 'Rising', desc: 'High tide in 2 hrs' },
    { label: 'Sunset', value: '7:59 PM', desc: 'Optimal fish activity' }
  ],

  // Species Database (Marine Life)
  species: [
    {
      id: 'snook',
      name: 'Common Snook',
      scientific: 'Centropomus undecimalis',
      count: 24,
      size: '22-38 inches',
      diet: 'Crabs, shrimp, small fish',
      fact: 'Snook are sensitive to cold water and congregate around structures like dock pilings for shelter and hunting.',
      funFact: 'They are protandric hermaphrodites—they start life as males and transition to females as they grow larger!',
      status: 'Protected game fish in Florida'
    },
    {
      id: 'tarpon',
      name: 'Atlantic Tarpon',
      scientific: 'Megalops atlanticus',
      count: 18,
      size: '4-8 feet',
      diet: 'Mullet, crabs, shrimp',
      fact: 'Often called the "Silver King," Tarpon are famous for their acrobatic jumps and shiny silver scales.',
      funFact: 'They have a unique swim bladder that allows them to gulp air at the surface, letting them survive in low-oxygen waters!',
      status: 'Catch and release only'
    },
    {
      id: 'turtle',
      name: 'Green Sea Turtle',
      scientific: 'Chelonia mydas',
      count: 7,
      size: '3-4 feet',
      diet: 'Seagrasses and algae',
      fact: 'These gentle reptiles nest on local Boynton Beach beaches and feed in the shallow seagrass beds nearby.',
      funFact: 'Unlike land turtles, green sea turtles cannot pull their heads and limbs inside their shells!',
      status: 'Endangered'
    },
    {
      id: 'grouper',
      name: 'Goliath Grouper',
      scientific: 'Epinephelus itajara',
      count: 11,
      size: 'Up to 8 feet',
      diet: 'Lobsters, crabs, slow fish',
      fact: 'Goliath groupers can weigh up to 800 pounds and are curious giants that often inspect divers and cameras.',
      funFact: 'They produce a booming sound using their swim bladder to warn predators and establish territory!',
      status: 'Critically protected'
    },
    {
      id: 'stingray',
      name: 'Southern Stingray',
      scientific: 'Hypanus americanus',
      count: 5,
      size: '3-5 feet wide',
      diet: 'Clams, worms, shrimp',
      fact: 'Stingrays spend much of their time buried in the sand, using their spiracles behind their eyes to breathe.',
      funFact: 'They have electro-receptors in their snout called Ampullae of Lorenzini to detect the electrical fields of prey buried in the sand!',
      status: 'Stable population'
    }
  ],

  // Sightings Timeline
  timeline: [
    { time: '8:15 AM', species: 'School of Mullet', note: 'Migrating through the dock area.' },
    { time: '9:02 AM', species: 'Atlantic Tarpon', note: 'Two large tarpon feeding under the dock.' },
    { time: '9:47 AM', species: 'Green Sea Turtle', note: 'Grazing on algae around the dock piling.' },
    { time: '10:31 AM', species: 'Nurse Shark', note: 'Cruising slowly along the sandy bottom.' },
    { time: '11:10 AM', species: 'Southern Stingray', note: 'Gliding and foraging in the sand.' }
  ],

  // Ocean Academy Quiz Data (Challenging Marine Biology Trivia)
  quiz: [
    {
      id: 1,
      question: "What biological adaptation allows the Atlantic Tarpon to survive in low-oxygen coastal lagoons?",
      options: [
        "They can absorb oxygen directly through their scales.",
        "They have a specialized swim bladder that allows them to gulp and breathe air.",
        "They hibernate in deep sand until the tide rises.",
        "They use electro-reception to find oxygen pockets."
      ],
      answer: 2,
      explanation: "Tarpon can gulp air at the surface and absorb it through their swim bladder, which acts like a primitive lung!"
    },
    {
      id: 2,
      question: "Common Snook are 'protandric hermaphrodites'. What does this mean?",
      options: [
        "They can change their color instantly to match dock pilings.",
        "They start life as males and transition into females as they grow larger.",
        "They do not require a partner to lay fertilized eggs.",
        "They migrate between fresh and saltwater every single day."
      ],
      answer: 2,
      explanation: "Snook start life as males. When they grow larger (usually around 24 inches), many undergo a transition to become females!"
    },
    {
      id: 3,
      question: "How do Southern Stingrays locate crabs and clams buried deep in the sand?",
      options: [
        "By using high-frequency sonar echolocation.",
        "Through electro-receptors in their snout that detect prey's electrical fields.",
        "By smelling underwater sound waves.",
        "They rely on sea turtles to dig them up."
      ],
      answer: 2,
      explanation: "Stingrays have tiny sensory pores on their snouts (Ampullae of Lorenzini) that detect weak electrical fields emitted by buried prey."
    },
    {
      id: 4,
      question: "Why can't Green Sea Turtles retract their heads and flippers inside their shells like land turtles?",
      options: [
        "Their shells are streamlined for swimming, and the flippers are fused to the shell skeleton.",
        "They only retract their heads when they are very young.",
        "Their neck muscles are too weak to pull their head back.",
        "They choose not to retract them because they are not afraid of predators."
      ],
      answer: 1,
      explanation: "Sea turtles' shells are lightweight and streamlined for swimming. Their flippers and neck bones are fused to their shell skeleton, making retraction impossible."
    },
    {
      id: 5,
      question: "What critical role do Goliath Groupers play in the local Florida reef ecosystem?",
      options: [
        "They clean the algae off the dock pilings.",
        "They act as apex predators, keeping crab and invasive lionfish populations in check.",
        "They build sandy nesting mounds for sea turtles.",
        "They guide migrating schools of mullet through the inlets."
      ],
      answer: 2,
      explanation: "Goliath Groupers are key predators. They help maintain reef health by eating crabs (protecting seagrass) and feeding on invasive species like Lionfish."
    },
    {
      id: 6,
      question: "Which wavelength (color) of light is absorbed first by water, disappearing in the top 30 feet of the ocean?",
      options: [
        "Blue light",
        "Green light",
        "Red light",
        "Violet light"
      ],
      answer: 3,
      explanation: "Red light has the longest wavelength and lowest energy in the visible spectrum, meaning it is absorbed first. Below 30 feet, red objects look black or grey!"
    },
    {
      id: 7,
      question: "What is the primary function of the 'lateral line' visible along the side of a Snook's body?",
      options: [
        "It helps the fish absorb sunlight for energy.",
        "It is a sensory organ that detects vibrations and water pressure changes.",
        "It acts as a camouflage stripe to mimic seagrass.",
        "It releases oil to make the fish swim faster."
      ],
      answer: 2,
      explanation: "The lateral line is a canal of sensory cells that acts like 'distant touch', letting the fish detect movement and vibrations of nearby prey or predators even in pitch black water."
    },
    {
      id: 8,
      question: "Why do sea turtles migrate thousands of miles back to the exact same beach where they were born to lay eggs?",
      options: [
        "They follow older turtles who guide them.",
        "They use Earth's magnetic field to navigate (geomagnetic imprinting).",
        "They recognize the smell of the sand from when they were babies.",
        "They prefer the warmer water temperatures of their home beach."
      ],
      answer: 2,
      explanation: "Sea turtles use geomagnetic navigation. They sense the unique magnetic signature of their birth beach and navigate back to it decades later."
    },
    {
      id: 9,
      question: "What makes the Boynton Beach Inlet particularly dangerous for boats but excellent for fish biodiversity?",
      options: [
        "It is completely closed off during high tide.",
        "It has extremely strong tidal currents that wash nutrients and baitfish back and forth.",
        "The water is fresh water, which ocean fish do not like.",
        "The bottom is covered in giant sea turtle nests."
      ],
      answer: 2,
      explanation: "The narrow inlet has powerful currents that flush nutrients out to the ocean and pull baitfish in, creating a rich feeding highway for predatory marine life."
    },
    {
      id: 10,
      question: "What is the main chemical component of a sea turtle's hard shell (carapace)?",
      options: [
        "Chitin",
        "Keratin (the same protein found in human fingernails)",
        "Calcium carbonate",
        "Cartilage"
      ],
      answer: 2,
      explanation: "The outer layer of a sea turtle's shell consists of scutes made of keratin, which overlays the bony structure beneath."
    }
  ],

  // FAQs
  faqs: [
    {
      q: "Where is the camera located?",
      a: "The camera is installed at the end of a private dock near Lantana, Florida, close to the Boynton Beach Inlet. It provides a real-time window into the marine highway between the Intracoastal Waterway and the Atlantic Ocean."
    },
    {
      q: "Why is the water green at night?",
      a: "An underwater green LED light is active at night. This light serves a double purpose: it attracts marine life (crustaceans, baitfish, and predators) and provides lighting so the camera can record high-definition color video in the dark."
    },
    {
      q: "Is this stream actually live?",
      a: "Yes! The camera feeds directly into our ethernet line and streams 24/7. What you see is happening in Florida right now."
    }
  ],

  // V2 Kids Missions
  missions: [
    { id: 'trivia', label: 'Complete Reef Trivia', xp: 150, description: 'Answer all 3 trivia questions correctly to test your knowledge.' },
    { id: 'report', label: 'Submit Sighting Report', xp: 150, description: 'Report a simulated fish sighting on the Community board.' },
    { id: 'physics', label: 'Read Light Physics Guide', xp: 100, description: 'Learn how the green dock light aids night visibility.' },
    { id: 'watch-time', label: 'Watch the Live Feed', xp: 100, description: 'Keep the livestream player open for at least 3 minutes.' },
    { id: 'cleanup', label: 'Identify Marine Species', xp: 100, description: 'Scan and identify 3 passing fish species on the live camera feed.' }
  ],

  // V2 Community Sightings
  sightingReports: [
    {
      id: 1,
      user: 'Capt. Steve',
      species: 'Atlantic Tarpon',
      time: '12:45 PM',
      count: 3,
      notes: 'Active feeding school near the channel edge. High visibility today.',
      likes: 12
    },
    {
      id: 2,
      user: 'Sarah_DiveFL',
      species: 'Green Sea Turtle',
      time: '11:20 AM',
      count: 1,
      notes: 'Spotted grazing slowly on algae around dock piling #4. Beautiful markings!',
      likes: 8
    },
    {
      id: 3,
      user: 'SnookHunter99',
      species: 'Common Snook',
      time: '10:05 AM',
      count: 15,
      notes: 'Congregating in the shadow of the dock. Waiting for the incoming tide.',
      likes: 14
    }
  ],

  // V2 AI Model Stats
  aiModelStats: {
    accuracy: '98.8%',
    inferenceTime: '6.8ms',
    activeTargets: 8,
    detectionsToday: 1420,
    distribution: [
      { name: 'Common Snook', value: 45 },
      { name: 'Atlantic Tarpon', value: 25 },
      { name: 'Goliath Grouper', value: 15 },
      { name: 'Green Sea Turtle', value: 10 },
      { name: 'Stingrays/Others', value: 5 }
    ]
  },

  // V2 Rewards Catalog
  rewards: [
    {
      id: 'wallpaper-reef',
      title: 'Lantana Reef Desktop Wallpaper',
      cost: 200,
      image: 'watch-live-bg-clean.png',
      desc: 'High-resolution digital wallpaper of the Lantana Reef feed in 4K.'
    },
    {
      id: 'badge-marine-scholar',
      title: 'Digital Marine Scholar Badge',
      cost: 300,
      image: 'logo-circle.png',
      desc: 'A premium digital badge to show off on your profile or share on social media.'
    },
    {
      id: 'coupon-gear',
      title: '15% Off Ocean Gear Vouchers',
      cost: 500,
      image: 'logo-text.png',
      desc: 'Redeemable at local Boynton Beach / Lantana surf and dive shops.'
    }
  ]
};
