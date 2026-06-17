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
  
  // Tabs supported in V1
  tabs: [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore' },
    { id: 'marine-life', label: 'Marine Life' },
    { id: 'kids-club', label: 'Kids Club' },
    { id: 'education', label: 'Education' },
    { id: 'conservation', label: 'Conservation' },
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

  // Kids Club Quiz Data
  quiz: [
    {
      id: 1,
      question: "Why is the underwater light under our Lantana dock green?",
      options: [
        "It is the owner's favorite color.",
        "Green light travels best through coastal water and attracts fish.",
        "It acts as a traffic light for boats.",
        "It warns sharks to stay away."
      ],
      answer: 1,
      explanation: "Green light has a wavelength that cuts through coastal water exceptionally well. It attracts plankton, which draws small baitfish, which eventually brings in big predators like Snook and Tarpon!"
    },
    {
      id: 2,
      question: "Which fish spotted on our camera is known as the 'Silver King'?",
      options: [
        "Common Snook",
        "Atlantic Tarpon",
        "Goliath Grouper",
        "Southern Stingray"
      ],
      answer: 1,
      explanation: "The Atlantic Tarpon is nicknamed the 'Silver King' due to its large, reflective silver scales and majestic appearance."
    },
    {
      id: 3,
      question: "Can Green Sea Turtles retract their heads into their shells?",
      options: [
        "Yes, they do it when sleeping.",
        "No, unlike land turtles, they cannot pull their heads or flippers inside their shell.",
        "Only when they are young.",
        "Only when they see a shark."
      ],
      answer: 1,
      explanation: "Sea turtles have shells that are streamlined for swimming, meaning they cannot pull their limbs or head inside like land turtles do."
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
  ]
};
