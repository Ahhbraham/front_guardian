<template>
  <div class="first-aid-container">
    <!-- Main Layout with Left, Center, and Right Sections -->
    <div class="main-layout">
      <!-- Left Section: Header and Search -->
      <div class="left-section">
        <div class="header">
          <h1>Emergencies <span>&</span> First Aid</h1>
          <p>Quick, clear steps for emergencies</p>
        </div>
        <div class="search-section">
          <div class="search-bar-wrapper">
            <span class="search-icon">🔍</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search emergencies & first aid"
              class="search-bar"
            />
          </div>
        </div>
      </div>

      <!-- Center Section: Panic Button -->
      <div class="center-section">
        <v-btn
          fab
          :class="{ vibrating: !dialog }"
          @click="showDialog"
          style="
            background-color: #ffffff;
            border: 2px solid #f5f5f5;
            width: 12.8vw;
            height: 12.8vw;
            border-radius: 50%;
          "
          elevation="24"
        >
          <span style="color: #333333; font-size: 2.048vw; font-weight: bold">SOS</span>
        </v-btn>
      </div>
    </div>

    <!-- Contact Dialog -->
    <v-dialog v-model="dialog" max-width="400" persistent>
      <v-card color="#ffffff">
        <v-card-title class="text-h5" style="color: #333333"> Emergency Contact </v-card-title>
        <v-card-text>
          <v-btn block class="mb-2" color="#f5f5f5" dark @click="contactService('Police')">
            Police
          </v-btn>
          <v-btn block class="mb-2" color="#f5f5f5" dark @click="contactService('Ambulance')">
            Ambulance
          </v-btn>
          <v-btn block class="mb-2" color="#f5f5f5" dark @click="contactService('Fire Service')">
            Fire Service
          </v-btn>
          <v-btn block color="#f5f5f5" dark @click="contactService('Trusted Circles')">
            Trusted Circles
          </v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#333333" text @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Results Section -->
    <div class="results">
      <p>{{ totalEmergencies }} results in Emergencies Requiring First Aid</p>
    </div>

    <!-- Keyboard with Cards -->
    <div class="keyboard">
      <div v-for="(letterGroup, letter) in filteredEmergenciesByLetter" :key="letter" class="card">
        <h2 class="letter-title">{{ letter }}</h2>
        <ul class="emergency-list">
          <li v-for="(emergency, index) in letterGroup" :key="index">
            <a @click.prevent="toggleSteps(emergency)" class="emergency-link">
              {{ emergency.name }}
            </a>
            <div v-if="emergency.showSteps" class="steps">
              <h4>Instructions:</h4>
              <ol>
                <li v-for="(step, stepIndex) in emergency.steps" :key="stepIndex">{{ step }}</li>
              </ol>
              <button class="read-aloud-button" @click="readSteps(emergency.steps)">
                Read Aloud
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Back to Top -->
    <a href="#" @click.prevent="scrollToTop" class="back-to-top">
      Back to top <span class="arrow">↑</span>
    </a>
  </div>
</template>

<script>
export default {
  name: 'FirstAid',
  data() {
    return {
      searchQuery: '',
      dialog: false,
      emergencies: [
        {
          title: 'Traumatic Injuries (Bleeding, Breaks, and Penetrating Wounds)',
          subcategories: [
            {
              name: 'Bystander-Applied',
              emergencies: [
                {
                  name: 'Severe bleeding',
                  steps: [
                    'Ensure safety; call 911.',
                    'Wear gloves if available.',
                    'Apply firm pressure with clean cloth.',
                    'Elevate limb above heart if possible.',
                    'Add layers if blood soaks through; don’t remove first cloth.',
                    'Use tourniquet if trained and bleeding persists.',
                    'Monitor for shock; keep warm.',
                    'Stay until help arrives.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Gunshot wounds',
                  steps: [
                    'Ensure scene safety; call 911.',
                    'Wear gloves if possible.',
                    'Apply firm pressure with clean cloth.',
                    'Elevate limb above heart if on arm/leg.',
                    'Don’t move unless in danger.',
                    'Start CPR if not breathing and trained.',
                    'Keep calm and warm until help arrives.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Stab wounds',
                  steps: [
                    'Ensure safety; call 911.',
                    'Don’t remove object in wound.',
                    'Press around wound with clean cloth.',
                    'Keep person still and calm.',
                    'Start CPR if not breathing and trained.',
                    'Monitor until help arrives.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Amputations',
                  steps: [
                    'Ensure safety; call 911.',
                    'Apply firm pressure to stop bleeding.',
                    'Elevate limb if possible.',
                    'Wrap amputated part in damp cloth, seal in plastic bag, place on ice.',
                    'Monitor for shock; keep warm.',
                    'Stay until help arrives.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Crush injuries',
                  steps: [
                    'Ensure safety; call 911.',
                    'Don’t move unless in danger.',
                    'Apply pressure to bleeding with clean cloth.',
                    'Keep injured area still.',
                    'Monitor for shock; keep warm.',
                    'Stay until help arrives.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Road accidents',
                  steps: [
                    'Ensure traffic safety; call 911.',
                    'Check breathing; start CPR if trained.',
                    'Apply pressure to bleeding.',
                    'Don’t move unless in danger.',
                    'Don’t remove helmet if worn.',
                    'Keep warm until help arrives.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Crowd stampede injuries',
                  steps: [
                    'Ensure safety; call 911.',
                    'Move to safe spot if possible.',
                    'Check breathing; start CPR if trained.',
                    'Apply pressure to bleeding.',
                    'Monitor for shock; keep warm.',
                    'Stay until help arrives.',
                  ],
                  showSteps: false,
                },
              ],
            },
            {
              name: 'Self-Applicable (Minor)',
              emergencies: [
                {
                  name: 'Minor cuts and scrapes',
                  steps: [
                    'Wash hands; rinse cut with water.',
                    'Clean around wound with soap.',
                    'Pat dry; apply antibiotic ointment.',
                    'Cover with bandage; change daily.',
                    'Watch for infection; see doctor if red/swollen.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Hammer/cut wounds (minor)',
                  steps: [
                    'Apply pressure with clean cloth.',
                    'Rinse with water; clean with soap.',
                    'Pat dry; apply antibiotic ointment.',
                    'Cover with bandage.',
                    'See doctor if bleeding persists or deep.',
                  ],
                  showSteps: false,
                },
              ],
            },
          ],
        },
        {
          title: 'Musculoskeletal Injuries (Bones, Joints, and Sprains)',
          subcategories: [
            {
              name: 'Bystander-Applied',
              emergencies: [
                {
                  name: 'Fractures',
                  steps: [
                    'Ensure safety; call 911.',
                    'Don’t move unless in danger.',
                    'Immobilize with splint if trained.',
                    'Apply ice wrapped in cloth.',
                    'Monitor for shock; keep warm.',
                    'Stay until help arrives.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Dislocations',
                  steps: [
                    'Ensure safety; call 911.',
                    'Don’t reposition joint.',
                    'Immobilize with sling/splint.',
                    'Apply ice wrapped in cloth.',
                    'Keep calm and warm until help arrives.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Spinal injuries',
                  steps: [
                    'Ensure safety; call 911.',
                    'Don’t move; keep head/neck still.',
                    'Check breathing; start CPR if trained.',
                    'Monitor until help arrives.',
                  ],
                  showSteps: false,
                },
              ],
            },
            {
              name: 'Self-Applicable',
              emergencies: [
                {
                  name: 'Sprains/strains',
                  steps: [
                    'Rest injured area.',
                    'Apply ice wrapped in cloth for 15-20 min.',
                    'Wrap with elastic bandage; not too tight.',
                    'Elevate above heart.',
                    'Take pain reliever if needed.',
                    'See doctor if no improvement in 1-2 days.',
                  ],
                  showSteps: false,
                },
              ],
            },
          ],
        },
        {
          title: 'Burns and Chemical Exposures',
          subcategories: [
            {
              name: 'Bystander-Applied',
              emergencies: [
                {
                  name: 'Burns (severe)',
                  steps: [
                    'Ensure safety; call 911.',
                    'Move from burn source if safe.',
                    'Cool with running water for 10-15 min.',
                    'Cover with non-stick bandage.',
                    'Don’t use ice/ointments; don’t pop blisters.',
                    'Monitor for shock; keep warm.',
                    'Stay until help arrives.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Eye injuries (chemical/penetration)',
                  steps: [
                    'Call 911.',
                    'Flush eye with water for 15 min.',
                    'Don’t rub or remove objects.',
                    'Cover with clean cloth.',
                    'Get to doctor immediately.',
                  ],
                  showSteps: false,
                },
              ],
            },
            {
              name: 'Self-Applicable',
              emergencies: [
                {
                  name: 'Burns (minor)',
                  steps: [
                    'Cool with running water for 10 min.',
                    'Pat dry; cover with non-stick bandage.',
                    'Don’t use ice/ointments; don’t pop blisters.',
                    'Take pain reliever if needed.',
                    'Watch for infection; see doctor if needed.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Pepper spray exposure',
                  steps: [
                    'Move to fresh air.',
                    'Blink to flush eyes; rinse with water for 15 min.',
                    'Wash skin with soap and water.',
                    'Don’t rub eyes/skin.',
                    'See doctor if symptoms persist.',
                  ],
                  showSteps: false,
                },
              ],
            },
          ],
        },
        {
          title: 'Cardiac and Respiratory Emergencies',
          subcategories: [
            {
              name: 'Bystander-Applied',
              emergencies: [
                {
                  name: 'Cardiac arrest / Heart attack',
                  steps: [
                    'Call 911.',
                    'Start CPR if trained; push hard/fast on chest.',
                    'Use AED if available; follow instructions.',
                    'Continue until help arrives or breathing resumes.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Choking (severe)',
                  steps: [
                    'Confirm choking; can’t speak.',
                    'Stand behind; give upward abdominal thrusts.',
                    'Continue until object dislodges.',
                    'Call 911 if they pass out; start CPR if trained.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Drowning',
                  steps: [
                    'Ensure water safety; call 911.',
                    'Remove from water if safe.',
                    'Check breathing; start CPR if trained.',
                    'If breathing, lay on side.',
                    'Keep warm until help arrives.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Smoke inhalation',
                  steps: [
                    'Move to fresh air; call 911.',
                    'Check breathing; start CPR if trained.',
                    'Keep sitting up if coughing.',
                    'Keep warm until help arrives.',
                  ],
                  showSteps: false,
                },
              ],
            },
          ],
        },
        {
          title: 'Neurological and Consciousness-Related Incidents',
          subcategories: [
            {
              name: 'Bystander-Applied',
              emergencies: [
                {
                  name: 'Seizures',
                  steps: [
                    'Clear area of hazards.',
                    'Don’t restrain; protect head with soft item.',
                    'Time seizure; call 911 if >5 min.',
                    'Roll to side after seizure.',
                    'Stay until fully awake or help arrives.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Fainting',
                  steps: [
                    'Lay flat; elevate legs 12 inches.',
                    'Loosen tight clothing.',
                    'Ensure fresh air.',
                    'Call 911 if not awake in 1 min.',
                    'Stay until fully awake.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Head injuries',
                  steps: [
                    'Call 911.',
                    'Don’t move; keep head/neck still.',
                    'Apply gentle pressure to bleeding.',
                    'Check breathing; start CPR if trained.',
                    'Report confusion/vomiting to paramedics.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Panic attacks (intense)',
                  steps: [
                    'Speak calmly; move to quiet area.',
                    'Encourage slow breathing: 4 sec in, 4 sec out.',
                    'Give space; reassure safety.',
                    'Call 911 if breathing worsens.',
                  ],
                  showSteps: false,
                },
              ],
            },
            {
              name: 'Self-Applicable',
              emergencies: [
                {
                  name: 'Panic attack (mild)',
                  steps: [
                    'Sit in quiet place.',
                    'Breathe slowly: 4 sec in, hold 4, out 4.',
                    'Focus on surroundings (e.g., count objects).',
                    'Reassure self: “This will pass.”',
                    'Sip water; call for help if worsens.',
                  ],
                  showSteps: false,
                },
              ],
            },
          ],
        },
        {
          title: 'Heat, Cold, and Environmental Exposure',
          subcategories: [
            {
              name: 'Bystander-Applied',
              emergencies: [
                {
                  name: 'None specific',
                  steps: [],
                  showSteps: false,
                },
              ],
            },
            {
              name: 'Self-Applicable',
              emergencies: [
                {
                  name: 'Heat exhaustion',
                  steps: [
                    'Move to cool, shaded area.',
                    'Rest; sip cool water/electrolyte drink.',
                    'Loosen clothes; apply cool cloth to forehead.',
                    'Call doctor if dizzy/vomiting persists 30 min.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Hypothermia (early stage)',
                  steps: [
                    'Move to warm, dry place.',
                    'Remove wet clothes; wrap in blankets.',
                    'Drink warm (not hot) beverage.',
                    'Apply warm (not hot) compress to chest.',
                    'Call for help if shivering/confusion worsens.',
                  ],
                  showSteps: false,
                },
              ],
            },
          ],
        },
        {
          title: 'Poisoning and Allergic Reactions',
          subcategories: [
            {
              name: 'Bystander-Applied',
              emergencies: [
                {
                  name: 'Poisoning',
                  steps: [
                    'Call 911 or poison control.',
                    'Identify substance if possible.',
                    'Don’t induce vomiting unless instructed.',
                    'Rinse skin if exposed; move to fresh air if inhaled.',
                    'Start CPR if not breathing and trained.',
                    'Stay until help arrives.',
                  ],
                  showSteps: false,
                },
              ],
            },
            {
              name: 'Self-Applicable',
              emergencies: [
                {
                  name: 'Allergic reactions (mild)',
                  steps: [
                    'Avoid allergen.',
                    'Take antihistamine if safe.',
                    'Apply cool cloth to itchy areas.',
                    'Sip water.',
                    'Call 911 if breathing/swelling worsens.',
                  ],
                  showSteps: false,
                },
              ],
            },
          ],
        },
        {
          title: 'Facial and Sensory Injuries',
          subcategories: [
            {
              name: 'Bystander-Applied',
              emergencies: [
                {
                  name: 'Nosebleeds (severe/unconscious)',
                  steps: [
                    'Call 911.',
                    'If unconscious, lay on side.',
                    'If awake, sit up, lean forward, pinch nose 10 min.',
                    'Apply cold cloth to forehead.',
                    'Check breathing; start CPR if trained.',
                    'Stay until help arrives.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Eye injuries (chemical/penetration)',
                  steps: [
                    'Call 911.',
                    'Flush eye with water for 15 min.',
                    'Don’t rub or remove objects.',
                    'Cover with clean cloth.',
                    'Get to doctor immediately.',
                  ],
                  showSteps: false,
                },
              ],
            },
            {
              name: 'Self-Applicable',
              emergencies: [
                {
                  name: 'Nosebleeds (conscious)',
                  steps: [
                    'Sit; lean forward; pinch nose 10 min.',
                    'Breathe through mouth.',
                    'Apply cold cloth to forehead.',
                    'Don’t blow nose for hours.',
                    'See doctor if persists 20 min.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Embedded object in limb (minor)',
                  steps: [
                    'Don’t remove object.',
                    'Keep still; bandage around object.',
                    'Elevate limb.',
                    'Get to doctor.',
                    'Watch for infection.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Tooth knocked out',
                  steps: [
                    'Handle tooth by crown; rinse gently.',
                    'Reinsert in socket if possible; else store in milk/saliva.',
                    'Get to dentist within 30 min.',
                    'Rinse mouth if bleeding.',
                  ],
                  showSteps: false,
                },
              ],
            },
          ],
        },
        {
          title: 'Bites, Stings, and Skin Issues',
          subcategories: [
            {
              name: 'Self-Applicable',
              emergencies: [
                {
                  name: 'Insect stings/bites',
                  steps: [
                    'Remove stinger with card/fingernail.',
                    'Wash with soap and water.',
                    'Apply ice wrapped in cloth 10 min.',
                    'Use antihistamine/cream for itch.',
                    'Call 911 if breathing/swelling worsens.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Blisters',
                  steps: [
                    'Don’t pop blister.',
                    'Wash with soap and water.',
                    'Cover with bandage/moleskin.',
                    'If pops, clean, apply ointment, bandage.',
                    'See doctor if infected.',
                  ],
                  showSteps: false,
                },
              ],
            },
          ],
        },
        {
          title: 'Violence and Assault-Related',
          subcategories: [
            {
              name: 'Bystander-Applied',
              emergencies: [
                {
                  name: 'Domestic violence / assault injuries',
                  steps: [
                    'Ensure safety; call 911.',
                    'Apply pressure to bleeding.',
                    'Don’t move if spinal injury suspected.',
                    'Reassure; help to safe place.',
                    'Stay until help arrives.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Sexual assault trauma',
                  steps: [
                    'Ensure safety; call 911 or hotline.',
                    'Don’t suggest showering (preserves evidence).',
                    'Listen without pressing for details.',
                    'Offer blanket; help to hospital if ready.',
                    'Stay or find trusted person.',
                  ],
                  showSteps: false,
                },
                {
                  name: 'Rope/binding injuries (if victim is incapacitated)',
                  steps: [
                    'Ensure safety; call 911.',
                    'Carefully remove bindings.',
                    'Apply pressure to bleeding.',
                    'Monitor for shock; keep warm.',
                    'Stay until help arrives.',
                  ],
                  showSteps: false,
                },
              ],
            },
            {
              name: 'Self-Applicable (if escape possible)',
              emergencies: [
                {
                  name: 'Rope/binding injuries',
                  steps: [
                    'Carefully remove bindings.',
                    'Wash wounds with soap and water.',
                    'Bandage cuts/scrapes.',
                    'See doctor if numb/tingly.',
                    'Get to safe place; call for help.',
                  ],
                  showSteps: false,
                },
              ],
            },
          ],
        },
      ],
    }
  },
  computed: {
    emergenciesByLetter() {
      const allEmergencies = this.emergencies.flatMap((category) =>
        category.subcategories.flatMap((subcategory) =>
          subcategory.emergencies.filter((emergency) => emergency.name !== 'None specific'),
        ),
      )

      const grouped = allEmergencies.reduce((acc, emergency) => {
        const firstLetter = emergency.name[0].toUpperCase()
        if (!acc[firstLetter]) {
          acc[firstLetter] = []
        }
        acc[firstLetter].push(emergency)
        return acc
      }, {})

      return Object.keys(grouped)
        .sort()
        .reduce((acc, letter) => {
          acc[letter] = grouped[letter].sort((a, b) => a.name.localeCompare(b.name))
          return acc
        }, {})
    },
    filteredEmergenciesByLetter() {
      if (!this.searchQuery) return this.emergenciesByLetter

      const filtered = {}
      Object.keys(this.emergenciesByLetter).forEach((letter) => {
        if (letter.toLowerCase() === this.searchQuery.toLowerCase()) {
          filtered[letter] = this.emergenciesByLetter[letter]
        }
      })
      return filtered
    },
    totalEmergencies() {
      return Object.values(this.filteredEmergenciesByLetter).flat().length
    },
  },
  methods: {
    toggleSteps(emergency) {
      emergency.showSteps = !emergency.showSteps
    },
    showDialog() {
      this.dialog = true
    },
    contactService(service) {
      console.log(`Contacting ${service}...`)
      alert(`Contacting ${service}`)
      this.dialog = false
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    readSteps(steps) {
      window.speechSynthesis.cancel()
      const textToRead = steps.map((step, index) => `Step ${index + 1}: ${step}`).join(' ')
      const utterance = new SpeechSynthesisUtterance(textToRead)
      utterance.lang = 'en-US'
      utterance.rate = 1.0
      utterance.pitch = 0.5
      window.speechSynthesis.speak(utterance)
    },
  },
}
</script>

<style scoped>
/* General Container */
.first-aid-container {
  width: 100%;
  margin: 0;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); /* Gradient blue background */
  min-height: 100vh;
  box-sizing: border-box;
}

/* Main Layout */
.main-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  align-items: flex-start;
}

/* Left Section: Header and Search */
.left-section {
  flex: 1;
  min-width: 300px;
}

/* Header */
.header {
  color: #ffffff;
  padding: 10px 0;
}

.header h1 {
  font-size: 3em;
  font-weight: bold;
  margin: 0;
  line-height: 1.2;
}

.header h1 span {
  font-size: 1.2em; /* Slightly larger ampersand */
}

.header p {
  font-size: 1.2em;
  margin: 10px 0;
  opacity: 0.9;
}

/* Search Section */
.search-section {
  margin-top: 20px;
}

.search-bar-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-bar {
  width: 100%;
  padding: 10px 40px 10px 40px;
  font-size: 1.1em;
  border: none;
  border-radius: 25px;
  outline: none;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-bar:focus {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2em;
  color: #666;
}

/* Center Section: Panic Button */
.center-section {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 150px;
}

/* Vibrating button animation */
.vibrating {
  animation: vibrate 0.67s infinite; /* 70% reduced speed */
}

@keyframes vibrate {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-4px, 4px);
  } /* Larger radius */
  40% {
    transform: translate(-4px, -4px);
  }
  60% {
    transform: translate(4px, 4px);
  }
  80% {
    transform: translate(4px, -4px);
  }
  100% {
    transform: translate(0);
  }
}

/* Dark text for dialog and buttons */
.v-card-title,
.v-btn {
  color: #333333 !important;
}

/* Button hover effect */
.v-btn:hover {
  background-color: #e0e0e0 !important;
}

/* Results */
.results {
  text-align: center;
  margin: 20px 0;
}

.results p {
  font-size: 1.1em;
  color: #ffffff;
  margin: 0;
}

/* Keyboard with Cards */
.keyboard {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.card {
  background: #e2e2f3;
  border-radius: 1px;
  border: 1px solid rgba(0, 0, 255, 0.2);
  box-shadow: 12px 12px 2px 1px rgba(245, 245, 245, 0.5);
  padding: 15px;
  width: 300px;
  min-height: 400px;
  transition: all 0.5s;
  overflow-y: auto;
}

.card:hover {
  box-shadow: -12px 12px 2px -1px rgba(0, 0, 255, 0.2);
}

.letter-title {
  font-size: 1.8em;
  color: black;
  margin-bottom: 10px;
  font-weight: bold;
  text-align: center;
}

.emergency-list {
  list-style: none;
  padding: 0;
}

.emergency-link {
  color: #005a9c;
  font-size: 1em;
  text-decoration: underline;
  cursor: pointer;
  display: block;
  margin-bottom: 5px;
}

.emergency-link:hover {
  text-decoration: none;
}

.steps {
  background: #ffffff;
  padding: 10px;
  margin: 10px 0;
  border-left: 2px solid #e2e4e5;
  border-radius: 5px;
}

.steps h4 {
  font-size: 1.3em;
  color: black;
  margin: 0 0 8px;
  font-weight: 600;
}

.steps ol {
  padding-left: 25px;
  margin: 0;
}

.steps li {
  font-size: 1.1em;
  color: black;
  line-height: 1.5;
  margin-bottom: 8px;
  font-weight: 400;
}

.read-aloud-button {
  position: relative;
  font-size: 14px;
  text-transform: uppercase;
  text-decoration: none;
  padding: 0.8em 2em;
  display: inline-block;
  cursor: pointer;
  border-radius: 1px;
  transition: all 0.1s;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: inherit;
  font-weight: 500;
  color: black;
  background-color: #ffffff;
  margin-top: 8px;
}

.read-aloud-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.read-aloud-button:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.read-aloud-button::after {
  content: '';
  display: inline-block;
  height: 100%;
  width: 100%;
  border-radius: 8px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  transition: all 0.4s;
  background-color: #fff;
}

.read-aloud-button:hover::after {
  transform: scaleX(1.4) scaleY(1.6);
  opacity: 0;
}

/* Back to Top */
.back-to-top {
  display: block;
  color: #ffffff;
  text-decoration: underline;
  font-size: 1em;
  margin: 20px 0;
  text-align: center;
}

.back-to-top:hover {
  text-decoration: none;
}

.back-to-top .arrow {
  font-size: 1.2em;
  vertical-align: middle;
}
</style>
