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

  // Ocean Academy Quiz Data (Easy Marine Trivia for Kids 2-6)
  quiz: [
    {
      id: 1,
      question: "What color is our underwater dock light at night?",
      options: ["Green 💚", "Red ❤️", "Blue 💙", "Purple 💜"],
      answer: 1,
      explanation: "The light is green! Green light helps us see the fish clearly at night and attracts friendly sea creatures."
    },
    {
      id: 2,
      question: "Which friend has a hard shell on their back?",
      options: ["Sea Turtle 🐢", "Octopus 🐙", "Jellyfish 🪼", "Dolphin 🐬"],
      answer: 1,
      explanation: "Sea turtles have hard, strong shells that protect them like a house!"
    },
    {
      id: 3,
      question: "What shape is a starfish?",
      options: ["Star ⭐", "Circle 🔴", "Square ⬛", "Triangle 🔺"],
      answer: 1,
      explanation: "Starfish look just like stars shining in the sky!"
    },
    {
      id: 4,
      question: "How many arms does an octopus have?",
      options: ["2 arms", "4 arms", "8 arms 🐙", "10 arms"],
      answer: 3,
      explanation: "An octopus has 8 long wiggly arms!"
    },
    {
      id: 5,
      question: "What do fish use to swim in the water?",
      options: ["Fins 🐟", "Wings 🪽", "Legs 🦵", "Wheels 🛞"],
      answer: 1,
      explanation: "Fish wiggle their fins and tails to swim smoothly through the ocean!"
    },
    {
      id: 6,
      question: "Which of these lives in the ocean?",
      options: ["Dog 🐶", "Cat 🐱", "Fish 🐠", "Cow 🐮"],
      answer: 3,
      explanation: "Fish live and swim in the beautiful blue ocean water!"
    },
    {
      id: 7,
      question: "Where do mother sea turtles lay their eggs?",
      options: ["On the sandy beach 🏖️", "Up in a tree 🌳", "In a cloud ☁️", "On a bicycle 🚲"],
      answer: 1,
      explanation: "Sea turtles crawl up onto the sandy beach at night to build nests for their eggs."
    },
    {
      id: 8,
      question: "What sound does a giant splashing fish make?",
      options: ["Splash! 💦", "Meow! 🐱", "Oink! 🐷", "Chirp! 🐦"],
      answer: 1,
      explanation: "When big fish jump out of the water, they go Splash!"
    },
    {
      id: 9,
      question: "Which ocean friend is known for a big friendly smile and jumping in the air?",
      options: ["Dolphin 🐬", "Crab 🦀", "Sea Urchin 🧆", "Worm 🪱"],
      answer: 1,
      explanation: "Dolphin is a super friendly marine mammal that loves to jump and play!"
    },
    {
      id: 10,
      question: "What color is the beautiful ocean water?",
      options: ["Blue 💙", "Pink 🩷", "Brown 🤎", "Orange 🧡"],
      answer: 1,
      explanation: "The ocean looks blue because it reflects the blue sky!"
    },
    {
      id: 11,
      question: "Which creature has two claws and crawls sideways on the sand?",
      options: ["Crab 🦀", "Snail 🐌", "Shark 🦈", "Pelican 🐦"],
      answer: 1,
      explanation: "Crabs walk sideways on the beach and have two pinchy claws!"
    },
    {
      id: 12,
      question: "What do sea turtles love to eat?",
      options: ["Seagrass & Jellyfish 🐢", "Pizza 🍕", "Ice Cream 🍦", "French Fries 🍟"],
      answer: 1,
      explanation: "Green sea turtles love eating healthy seagrass, algae, and jellyfish!"
    },
    {
      id: 13,
      question: "Which fish looks like a little horse swimming in the water?",
      options: ["Seahorse 🎠", "Hammerhead Shark 🦈", "Snook 🐟", "Goldfish 🐠"],
      answer: 1,
      explanation: "Seahorses have heads that look just like tiny horses!"
    },
    {
      id: 14,
      question: "What do fish breathe with under the water?",
      options: ["Gills 🐟", "Noses 👃", "Straws 🥤", "Socks 🧦"],
      answer: 1,
      explanation: "Fish have special gills on the sides of their heads that let them breathe underwater!"
    },
    {
      id: 15,
      question: "Which friend is very slow and carries its spiral house on its back?",
      options: ["Sea Snail 🐌", "Tarpon 🐟", "Barracuda 🦈", "Seagull 🐦"],
      answer: 1,
      explanation: "Sea snails move very slowly and carry their spiral shell homes wherever they go!"
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
