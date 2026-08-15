import { Chassis } from "./types";

export const CUSTOM_PRESETS: Chassis[] = [
  {
    id: "toyota-supra-mk4",
    make: "Toyota",
    model: "Supra MK4 (JZA80)",
    chassisCode: "JZA80",
    years: [2000, 2001, 2002],
    origin: "Japanese",
    difficultyRating: 2,
    notes: "Late JZA80 Japanese domestic stock parts are goldmines. Always look for factory standard turbo components and electronic actuators.",
    targetParts: [
      {
        name: "ABS Pump / Brake Modulator Valve Unit",
        estValue: 450,
        toolsNeeded: ["10mm Flare-Nut Wrench", "10mm Socket & Extension", "Pliers"],
        failureMode: "Internal shuttle valves seize due to brake fluid contamination. High-cost dealer-only unit widely needed.",
        interchangeability: "Shares core hydraulic pump internals with JZS160 GS300/GS400 and Toyota Aristo models.",
        extractionGuide: "Unplug the main multi-pin solenoid terminal near firewall. Slide open flare lines using a 10mm flare-nut wrench to prevent rounding fitting brass. Loosen three 10mm mount nuts and extract the block.",
        difficulty: "Medium",
        category: "Hydraulics & Braking",
        rarityModifier: "+$150 premium for TRD/special edition active brake-distribution codes.",
        perfModImpact: "Highly negative: Aftermarket braided tuck kits usually involve discarding the OEM ABS pump, making salvageable pumps rare, but ruined lines reduce overall demand."
      },
      {
        name: "Engine Control Unit (2JZ-GTE VVTi ECU)",
        estValue: 890,
        toolsNeeded: ["10mm Socket & Ratchet", "No. 2 Phillips Screwdriver"],
        failureMode: "Electrolytic electrolytic capacitors leak over 15-20 years, causing terminal engine timing synchronization drops, rough idle, or dead ignition logs.",
        interchangeability: "Fits factory turbo VVTi models. Substring code matching is required.",
        extractionGuide: "Expose subfloor on passenger kickboard. Peel down the floor insulation cover. Remove three 10mm speed nuts from bracket, lift core metal frame, and pull grey terminal clamps off.",
        difficulty: "Easy",
        category: "Electronics & Engine Control",
        rarityModifier: "+$250 for manual transmission V160-spec mapping and active spoiler control parameters.",
        perfModImpact: "Negative value impact if tuner has socketed or solder-modded the board for custom maps. Dead stock factory untouched ECUs earn the highest trade value."
      },
      {
        name: "OEM HVAC Digital Climate Control Unit",
        estValue: 580,
        toolsNeeded: ["Plastic Trim Pry Tool", "No. 2 Phillips Screwdriver"],
        failureMode: "Dead internal screen backlights and bleeding LCD fluid make these highly sought after during concours restorations.",
        interchangeability: "Direct physical fit for all series-2 dashboard trims (1996 to 2002).",
        extractionGuide: "Carefully insert plastic wedge below climate trim dial. Pop forward the retaining clips. Remove two Phillips screws beneath the frame, and disengage dual white wiring blocks.",
        difficulty: "Easy",
        category: "Interior Accessories",
        rarityModifier: "Facelift models featuring carbon finish panels yield a substantial +$120 premium.",
        perfModImpact: "Neutral: Aftermarket double-DIN stereo retrofits usually damage adjacent clips, rendering the climate unit undamaged but removing native surround trim."
      }
    ]
  },
  {
    id: "toyota-supra-mk5",
    make: "Toyota",
    model: "Supra MK5 (A90)",
    chassisCode: "A90 / DB82",
    years: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
    origin: "Japanese",
    difficultyRating: 3,
    notes: "The Mk5 is heavily co-developed with BMW (G29 Z4). It uses Euro electronics and standard metric Torx fasteners for almost everything.",
    targetParts: [
      {
        name: "A90 Active Exhaust Valve Actuator",
        estValue: 190,
        toolsNeeded: ["8mm Deep Socket", "Flathead Screwdriver"],
        failureMode: "Road soot and exhaust salt heat-seize the internal shaft actuator pin, leaving the bypass valve stuck permanently shut or causing check-engine fault codes.",
        interchangeability: "Interchanges directly with BMW G20 3-Series, G29 Z4, and high-end M-Sport exhaust valve servos.",
        extractionGuide: "Locate on passenger mufflers tailpipe outlet. Unplug 3-pin harness connector. Unscrew three 8mm hex mounting studs and pull unit off its active spring carrier.",
        difficulty: "Easy",
        category: "Actuators & Exhaust",
        rarityModifier: "Launch Edition and A91 Special Edition exhausts are prized by base model upgraders.",
        perfModImpact: "Highly Positive: Cat-back exhaust upgrades almost always retain the factory actuator to avoid drone, keeping secondary market prices stable and demand robust."
      },
      {
        name: "B58 Direct Injection High Pressure Fuel Pump (HPFP)",
        estValue: 320,
        toolsNeeded: ["E6 Torx", "17mm Flare-Nut Wrench", "10mm Socket"],
        failureMode: "Piston spring wear inside the diesel-like mechanical high pressure pump leads to severe rail pressure drops under high throttle loads.",
        interchangeability: "Fits BMW B58 engine platforms (M340i, Z4, 540i, X5 xDrive40i). Very high demand among gen-1 B58 owners upgrading to the gen-2 pump.",
        extractionGuide: "Remove engine decorative foam cowl. Unbolt high pressure stainless fuel link with 17mm flare wrench. Unfasten two E6 Torx retaining bolts and lift straight up parallel to valve sleeve.",
        difficulty: "Medium",
        category: "Engine & Fueling",
        rarityModifier: "Late production TU (Technical Update) Gen-2 pumps are highly sought after by early-year owners seeking an extra 600psi fuel flow limit.",
        perfModImpact: "Extremely Positive: Highly targeted upgrade part. Ensure no fuel varnish residue is present prior to shipping."
      },
      {
        name: "Digital Cockpit Cluster (BMW Live Professional)",
        estValue: 640,
        toolsNeeded: ["T20 Torx Screwdriver", "Plastic Trim Wedge"],
        failureMode: "Total segment fade-out, intermittent flashing display, or physical front plexiglass scratches block dashboard information visibility.",
        interchangeability: "Identical design platform of BMW G29 Z4, but custom mapped firmware graphics dictate Supra models.",
        extractionGuide: "Lower column column. Pry bezel cluster frame piece outwards. Loosen two upper T20 Torx screws on bezel face, pull display towards seat, and release active violet lever block.",
        difficulty: "Easy",
        category: "Electronics & Displays",
        rarityModifier: "+$180 value for manual transmission models mapping clusters with distinct shift-light sequences.",
        perfModImpact: "Passive negative modifier: Aftermarket software flashes to emulate Alpina gauge cluster skins lower visual OEM appeal to purists."
      }
    ]
  },
  {
    id: "nissan-skyline-r32",
    make: "Nissan",
    model: "Skyline GT-R (R32)",
    chassisCode: "BNR32",
    years: [1989, 1990, 1991, 1992, 1993, 1994],
    origin: "Japanese",
    difficultyRating: 3,
    notes: "Classic BNR32 components are scarce. Focus on engine auxiliary sensors and active chassis actuators to retrieve top tier arbitrage yields.",
    targetParts: [
      {
        name: "ATTESA E-TS AWD Hydraulic Modulator Pump",
        estValue: 950,
        toolsNeeded: ["10mm Flare Wrench", "12mm Socket", "Pliers"],
        failureMode: "Trunk water leaks or under-chassis exposure corrodes the solenoids, causing the torque-split gauge to stay pinned to zero (rear-wheel drive only mode).",
        interchangeability: "Shared with R33 GT-R and Stagea 260RS models.",
        extractionGuide: "Locate in rear driver-side wheel well/trunk area. Disconnect line connections with a 10mm flare ring-wrench. Loosen four 12mm retention brackets to lower the block.",
        difficulty: "Medium",
        category: "Hydraulics & Drivetrain",
        rarityModifier: "Nismo and N1 spec pumps are ultra-rare and fetch up to $1,800 on collector boards.",
        perfModImpact: "Highly Positive: Drift conversions often delete this system, but vintage road-car restorers pay top dollar for clean, un-deleted operational pumps."
      },
      {
        name: "RB26DETT Twin Air Flow Meters (MAF Set of 2)",
        estValue: 340,
        toolsNeeded: ["No. 2 Phillips Screwdriver", "10mm Socket"],
        failureMode: "Circuit board dry-solder joint cracks on connector terminals cause erratic idle or rev-limitation fault patterns.",
        interchangeability: "Fits standard R32 crossmembers and dual-MAF intakes.",
        extractionGuide: "Unscrew intake couplers. Unplug 3-pin harnesses. Remove three 10mm steel socket nuts per flange housing and slide out of filter case.",
        difficulty: "Easy",
        category: "Sensors & Intake",
        rarityModifier: "+$120 if stamped with final-year 1994 production markings or yellow label tags.",
        perfModImpact: "Negative: Upgrading to standalone link ECUs with MAP sensor deletes MAF meters. Look for un-modified filter boxes for maximum recovery chance."
      },
      {
        name: "A/C Digital Temperature Climate Faceplate",
        estValue: 310,
        toolsNeeded: ["No. 2 Phillips Screwdriver", "Hook Pry Tool"],
        failureMode: "Internal relay board burns out, keeping interior fans permanently high or refusing to cycle hot/cold blender doors.",
        interchangeability: "Direct conversion swap for HCR32 / GTS-T models.",
        extractionGuide: "Pull shifter bezel trim block up. Remove two lower console trim screws. Pop out climate center housing, unplug the dual blue ribbon cables behind unit body.",
        difficulty: "Easy",
        category: "Interior Accessories",
        rarityModifier: "Non-smoker configurations with pristine buttons yield a +$80 value bump.",
        perfModImpact: "Neutral: Clean plastic surrounds are extremely scarce as most owners cut or modify console trim for aftermarket tablet screens."
      }
    ]
  },
  {
    id: "nissan-skyline-r33",
    make: "Nissan",
    model: "Skyline GT-R (R33)",
    chassisCode: "BCNR33",
    years: [1995, 1996, 1997, 1998],
    origin: "Japanese",
    difficultyRating: 2,
    notes: "R33 parts have jumped heavily as import rules clear. Focus on active electronic units and specific sensors to secure fast arbitrage payouts.",
    targetParts: [
      {
        name: "Super HICAS Power Steering Solenoid Block",
        estValue: 480,
        toolsNeeded: ["10mm Flare Wrench", "12mm Deep Socket"],
        failureMode: "Seals degrade inside the valve chamber block under high heat pressure, creating hydraulic drips and four-wheel steer computer alert logs.",
        interchangeability: "Shares core hydraulic layout valve configurations with Z32 300ZX Twin Turbo models.",
        extractionGuide: "Mounted beneath the subframe rear carriage assembly. Disconnect key pressure flare inputs. Unscrew two 12mm frame retention bolts and retrieve core block.",
        difficulty: "Medium",
        category: "Hydraulics & Drivetrain",
        rarityModifier: "+$100 value for late facelift Series 3 models with upgraded sensor interfaces.",
        perfModImpact: "Negative value impact from deletion. Drifters bypass the HICAS steering with lock bars, so clean functional blocks are rare but sought after by purists."
      },
      {
        name: "ATTESA E-TS G-Sensor Module (Console Mount)",
        estValue: 410,
        toolsNeeded: ["10mm Wrench", "Phillips Screwdriver"],
        failureMode: "Internal silicone fluid dampening layers solidify with age, leaving active torque transfer systems blind and causing error codes 13 or 14.",
        interchangeability: "Direct fitment in both standard GT-R R33 and GTR-R34 models.",
        extractionGuide: "Unscrew central armrest console box. Unplug direct-wire yellow connector and unscrew two 10mm floor speed nuts retaining the active metal cube safely.",
        difficulty: "Easy",
        category: "Electronics & Sensors",
        rarityModifier: "Rare V-Spec active differentials require correct coded models, netting an immediate +$150.",
        perfModImpact: "Extremely Positive: Highly desired. Aftermarket setups cannot emulate OEM calibration for vintage class races."
      },
      {
        name: "OEM RB26DETT Igniter Pack Unit",
        estValue: 260,
        toolsNeeded: ["10mm Socket & Driver"],
        failureMode: "Heat-soak failure causes transistor heat sinks to fail internally, dropping spark across ignition cylinder columns randomly under load.",
        interchangeability: "Fits standard Nissan RB26DETT models (R32 and R33 series).",
        extractionGuide: "Located on coilpack valve harness center valley bridge cover rear. Unfasten two 10mm standard retaining harness screws and unclip standard dual pin-holders.",
        difficulty: "Easy",
        category: "Electronics & Ignition",
        rarityModifier: "Nismo core upgrades are prized collectibles.",
        perfModImpact: "Negative: Heavy performance tuning involving conversion to smart-coils bypasses the factory igniter entirely, which can decrease salvage demand."
      }
    ]
  },
  {
    id: "nissan-skyline-r34-gtr",
    make: "Nissan",
    model: "Skyline GT-R (R34)",
    chassisCode: "BNR34",
    years: [1999, 2000, 2001, 2002],
    origin: "Japanese",
    difficultyRating: 3,
    notes: "BNR34 components represent peak value. Even tiny ancillary parts are worth hundreds. Always exercise extreme caution to avoid damaging connectors.",
    targetParts: [
      {
        name: "MFD (Multi Function Display) Core screen Unit",
        estValue: 1200,
        toolsNeeded: ["Pry Wedge Tool", "Phillips Screwdriver", "No. 1 Screwdriver"],
        failureMode: "Internal inverter capacitor failure causes total screen dimming or blank, unreadable liquid bleeds on display sections.",
        interchangeability: "Fits factory premium dashboard housing specs across series catalogs.",
        extractionGuide: "Prise loose dynamic high dashboard frame bezel. Loosen four Phillips screws holding active console, slide display forward, disconnect black multi-plug lock.",
        difficulty: "Medium",
        category: "Electronics & Displays",
        rarityModifier: "+$400 for late generation spec-2 active models containing higher screen resolution matrices.",
        perfModImpact: "Extremely Positive: Highly desirable item. Many owners update normal consoles to replicate the iconic multi-function panel."
      },
      {
        name: "RB26DETT Individual Throttle Body (ITB) Assembly",
        estValue: 750,
        toolsNeeded: ["10mm and 12mm Sockets", "Needle Nose Pliers"],
        failureMode: "Center shaft spindle linkage bushings leak un-metered air, causing high unstable idle or difficult balance runs.",
        interchangeability: "Compatible with Skyline R32, R33, and R34 GT-R models.",
        extractionGuide: "Unscrew standard steel intake surge tank pipe. Release throttle pulley cable linkage. Remove the bracket nuts and carefully lift individual runners.",
        difficulty: "Hard",
        category: "Engine & Intake Flow",
        rarityModifier: "Rare Nur Spec individual runner finishes carry a heavy premium, yielding +$200.",
        perfModImpact: "Negative value impact if aftermarket boring has widened chambers beyond original spec borders."
      },
      {
        name: "OEM Xenon Headlight Ballast Converter",
        estValue: 280,
        toolsNeeded: ["8mm Deep Socket", "T20 security Torx Bit"],
        failureMode: "Saltwater condensation inside headlight bottom wells ruins electronic control components.",
        interchangeability: "Matsushita shared internal block models built into late generation Nissan performance lines.",
        extractionGuide: "Remove corner bracket holding headlamp. Uncover ballast under lower corner seal. Remove three Torx screws and release connection wire terminal.",
        difficulty: "Easy",
        category: "Electronics & Lighting",
        rarityModifier: "Excellent condition lenses or gold-bezel GT-R trim models increase desirability.",
        perfModImpact: "Neutral: Converting to customized aftermarket LEDs usually makes ballasts obsolete, keeping a steady supply of salvage parts."
      }
    ]
  },
  {
    id: "bmw-e46-m3",
    make: "BMW",
    model: "M3 (E46)",
    chassisCode: "E46 M3",
    years: [2000, 2001, 2002, 2003, 2004, 2005, 2006],
    origin: "German",
    difficultyRating: 3,
    notes: "M3 components sell immediately. Always pull differential cases, manual modules, and individual throttle bodies on sight.",
    targetParts: [
      {
        name: "SMG II Hydraulic Electric Pump (Solenoid Block)",
        estValue: 850,
        toolsNeeded: ["10mm, 13mm, 15mm Sockets", "Flat Wrench Set"],
        failureMode: "Electric motor thermal wear drops hydraulic pressure below 40 bar target limits, dropping vehicle to neutral with 'clog' sensor logs.",
        interchangeability: "Fits standard E46 M3 SMG models directly.",
        extractionGuide: "Expose undercarriage shield. Locate hydraulic block mounted near transmission main housing frame. Unscrew power supply feed, relieve valve pressure, undo 10mm bolts and slide clear.",
        difficulty: "Hard",
        category: "Hydraulics & Drivetrain",
        rarityModifier: "Upgraded CSL-specific program setups command high demand but require matching serial tags.",
        perfModImpact: "Positive value: Manual transmission chassis conversions discard the SMG pump completely, keeping salvage yard inventory fluid."
      },
      {
        name: "S54 Individual Throttle Body (ITB) Assembly",
        estValue: 920,
        toolsNeeded: ["6mm Socket", "10mm Socket & Extension", "Pliers"],
        failureMode: "Mechanical wear across connecting bar linkages leaks intake pressure, registering standard BMW fuel lean codes.",
        interchangeability: "Direct fit on S54 engines matching Z3 M and Z4 M platforms.",
        extractionGuide: "Undo visual carbon intake plenum chambers. Release air valve lines. Unbolt 10mm hex nuts fastening flanges near intake cylinders, lift out clean.",
        difficulty: "Hard",
        category: "Engine & Intake Flow",
        rarityModifier: "+$200 for CSL carbon-airbox accessory layouts.",
        perfModImpact: "Neutral/Negative: Aftermarket modifications boring individual runners reduces original collector target pool value."
      },
      {
        name: "MK60 ABS / DSC Control Module (10.0960-xxxx)",
        estValue: 480,
        toolsNeeded: ["T20 Torx Bit", "5mm Allen Key", "Needle nose pliers"],
        failureMode: "Internal silicon pressure sensor fails with G-fault codes. Extremely sought after by track day builders needing early hardware models for custom brake coding.",
        interchangeability: "Highly desired stamped codes fit both E46 M3, late non-M facelift models, and early Z4 series.",
        extractionGuide: "Reach below brake master booster cylinder. Release mounting Torx bolts holding computer boards. Disengage harness plug cleanly without breaking tabs.",
        difficulty: "Easy",
        category: "Electronics & Braking",
        rarityModifier: "Part numbers matching 10.0961 or 10.0960 carry huge weight for motorsport projects (+$150).",
        perfModImpact: "Extremely Positive: Standalone track-spec ABS custom harnesses can adapt the MK60, increasing retail interest of this device."
      }
    ]
  },
  {
    id: "bmw-e46-330i",
    make: "BMW",
    model: "330i (E46)",
    chassisCode: "E46 / M54B30",
    years: [2000, 2001, 2002, 2003, 2004, 2005],
    origin: "German",
    difficultyRating: 2,
    notes: "M54B30 3L engines possess superb interchange across both 3-series and 5-series chassis lines. Check for M-Sport trims.",
    targetParts: [
      {
        name: "DISA Valve (Intake Manifold Adjuster Unit)",
        estValue: 145,
        toolsNeeded: ["T40 Torx screwdriver", "Flathead Screwdriver"],
        failureMode: "Plastic flapper valve flap shaft breaks or vacuum diaphragm punctures, creating vacuum leaks or dropping plastic fragments inside engine channels.",
        interchangeability: "Matches all late 3.0L M54 engine manifolds (E39 530i, E53 X5, Z4, E83 X3).",
        extractionGuide: "Locate on side of air collector manifold behind air intake bellows. Undo two T40 Torx mounting screws and pull the bypass module out safely of manifold block.",
        difficulty: "Easy",
        category: "Actuators & Intake",
        rarityModifier: "Upgraded billet aluminum rebuild-valve variants carry a +$50 premium.",
        perfModImpact: "Highly Positive: Many owners bypass vacuum designs using aluminum rebuild components, elevating demand for intact pristine factory cores."
      },
      {
        name: "M-Sport 3-Spoke Tech Steering Wheel trim",
        estValue: 240,
        toolsNeeded: ["Flathead Screwdriver", "16mm socket & ratchet"],
        failureMode: "Standard vinyl grip degradation or surface leather splitting reduces restoration class values.",
        interchangeability: "Direct swap fitment for standard layout sedan dashboard lines.",
        extractionGuide: "Insert long thin screwdriver in rear steering wheel slot holes to push active side springs releasing visual airbag. Unbolt main 16mm column screw, slide off central spline.",
        difficulty: "Easy",
        category: "Interior Accessories",
        rarityModifier: "Pristine alcantara wraps matching ZHP performance packages double value (+$200).",
        perfModImpact: "Neutral/Positive: Quick release setups usually displace stock pieces, maintaining strong demand for OEM leather wheels by restorers."
      },
      {
        name: "Siemens VDO M54B30 Electronic Throttle Body",
        estValue: 135,
        toolsNeeded: ["10mm Socket & extension", "6mm socket for hose clamps"],
        failureMode: "Carbon dirt build accumulation blocks internal throttle armature travel causing engine limp warnings and unstable speed outputs.",
        interchangeability: "Matches M54 3.0L engines on corresponding platforms.",
        extractionGuide: "Unfasten engine air filter chamber. Remove accordion rubber sleeve. Loosen four 10mm bolts securing throttle neck to collector flange and unhook electrical terminal wire.",
        difficulty: "Medium",
        category: "Engine & Intake Flow",
        rarityModifier: "ZHP model specific components have slight upgrade market preferences.",
        perfModImpact: "Neutral: Normal replacement part with steady failure rate on age-worn commuter German cruisers."
      }
    ]
  },
  {
    id: "bmw-e46-325i",
    make: "BMW",
    model: "325i (E46)",
    chassisCode: "E46 / M54B25",
    years: [2000, 2001, 2002, 2003, 2004, 2005],
    origin: "German",
    difficultyRating: 2,
    notes: "Commuter workhorses. Millions sold globally, keeping part turnover rapid. Focus on lightweight electrical sensors and cooling control interfaces.",
    targetParts: [
      {
        name: "Pristine Xenon Light Control Module (LCM)",
        estValue: 110,
        toolsNeeded: ["Phillips Screwdriver", "Plastic wedge hook"],
        failureMode: "Solder decay or failed thermal switches keep lights active continuously, running batteries target dry.",
        interchangeability: "Matches standard E46 series models.",
        extractionGuide: "Unscrew lower trim under standard light dimmer selector. UnclipLCM wire frame and pull housing clear out of cavity block.",
        difficulty: "Easy",
        category: "Electronics & Lighting",
        rarityModifier: "Facet Xenon-spec configurations with rear fog switches fetch +$50.",
        perfModImpact: "Neutral: Coded interfaces require programming tool configurations matching VIN registries."
      },
      {
        name: "Siemens MS43 Engine ECU",
        estValue: 180,
        toolsNeeded: ["10mm Socket & ratchet"],
        failureMode: "Unregulated output voltages short circuit core internal map registers, creating hard-start states.",
        interchangeability: "Matches most M54B25 motor controller harnesses across series platforms.",
        extractionGuide: "Uncover white electronic plastic module enclosure adjacent to brake booster. Pop back cover panel. Pull wire harness release collars up and extract unit.",
        difficulty: "Easy",
        category: "Electronics & Engine Control",
        rarityModifier: "Pre-flashed 'EWS deleted' bypass modules command +$80 value.",
        perfModImpact: "Extremely Positive: Drift conversion drift engine tuning projects require these ECUs for simple plug-and-play tuning."
      },
      {
        name: "Denso Mass Air Flow Sensor",
        estValue: 95,
        toolsNeeded: ["Stubby Phillips head", "Flathead screwdriver"],
        failureMode: "Sensing element contamination from aftermarket oiled filters triggers lean oxygen warning codes.",
        interchangeability: "Highly compatible JDM/Euro overlap specs.",
        extractionGuide: "Loosen plastic gear hose clips. Slide harness terminal off MAF sleeve walls. Detach from engine air chamber framework and pull out sliding cylinder.",
        difficulty: "Easy",
        category: "Sensors & Intake",
        rarityModifier: "OEM Siemens VDO parts are worth far more than generic aftermarket budget alternatives (+$40).",
        perfModImpact: "Negative: Converting to cold air induction layouts often damages original wire housings, lowering reuse rates."
      }
    ]
  },
  {
    id: "infiniti-g35-z33",
    make: "Infiniti",
    model: "G35 Coupe (V35 / Z33)",
    chassisCode: "V35 / Z33",
    years: [2003, 2004, 2005, 2006, 2007],
    origin: "Japanese",
    difficultyRating: 2,
    notes: "High value-to-weight ratio. Interchangeable with Nissan 350Z. Highly demanded cross-platform drift components.",
    targetParts: [
      {
        name: "Hitachi Electronic Throttle Body",
        estValue: 125,
        toolsNeeded: ["5mm Allen Hex Key", "Pliers"],
        failureMode: "Plastic gears on the butterfly actuator strip or wear due to carbon accumulation, causing unstable idle and limp mode.",
        interchangeability: "Fits Infiniti G35, Nissan 350Z (Z33), FX35, and Murano with VQ35DE single-intake engines.",
        extractionGuide: "Remove air intake tube hose clamp. Unplug the 6-pin harness. Softly pry cooling lines (plug with bolts). Unbolt the four 5mm Hex screws and slide throttle body off manifold.",
        difficulty: "Easy",
        category: "Engine & Intake Flow",
        rarityModifier: "RevUp engine variants (2005-2007 manual) command a slight premium due to higher airflow specs.",
        perfModImpact: "Neutral: Enthusiasts upgrading to 75mm throttle setups leave high-quality OEM Hitachi units available for salvage collectors."
      },
      {
        name: "Brembo 4-Piston Front Brake Caliper Set",
        estValue: 480,
        toolsNeeded: ["12mm Flare-Nut Wrench", "19mm Socket & Breaker Bar", "Pliers"],
        failureMode: "Piston dust boots tear on high-heat track days, leading to seized pistons or cosmetic clearcoat peeling (fading to pink 'Brembos').",
        interchangeability: "Direct bolt-on conversion for standard Infiniti G35, Nissan 350Z (Z33), and wide range of Nissan sports compact hub carriers.",
        extractionGuide: "Pry out brake pad retention pins. Disconnect brake fluid line with 12mm flare wrench. Unbolt two heavy 19mm caliper-to-hub mounting bolts on knuckle back. Lift clear.",
        difficulty: "Medium",
        category: "Hydraulics & Braking",
        rarityModifier: "Factory gold finish with red lettering is highly prized over black resprayed sets (+$120).",
        perfModImpact: "Highly Positive: Highly targeted upgrade path for non-Brembo trims. Massive buyer base in track and drift communities."
      },
      {
        name: "V35/Z33 Climate Control / Stereo Hazard Switch Board",
        estValue: 180,
        toolsNeeded: ["Plastic Trim Wedge", "Phillips Screwdriver"],
        failureMode: "Internal ribbon cable fails or solder joints on the circuit board crack, leaving the system stuck on full defrost at maximum fan speed.",
        interchangeability: "Direct cross-functional fit across V35 Skyline, Infiniti G35, and convertible models of same series.",
        extractionGuide: "Remove shift knob. Use trim wedge to pry lower console center bezel. Unbolt four Phillips screws securing hazard and climate interface housing. Disengage white ribbon port.",
        difficulty: "Easy",
        category: "Interior Accessories",
        rarityModifier: "+$40 premium for dual-zone automatic climate control trims.",
        perfModImpact: "Highly Positive: Aftermarket double-DIN stereo retrofits usually damage these components or break retention clips, making undamaged units highly valuable."
      }
    ]
  },
  {
    id: "honda-s2000-ap",
    make: "Honda",
    model: "S2000 (AP1 / AP2)",
    chassisCode: "AP1 / AP2",
    years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009],
    origin: "Japanese",
    difficultyRating: 2,
    notes: "AP1/AP2 original parts are becoming hyper-collectible. F20C/F22C ancillaries sell instantly.",
    targetParts: [
      {
        name: "F20C / F22C VTEC Solenoid Assembly",
        estValue: 240,
        toolsNeeded: ["10mm Socket & Ratchet", "Pliers"],
        failureMode: "Internal mesh filter screen clogs with oil sludge or pressure sensor seal leaks, preventing engine VTEC ignition engagement above 6000rpm.",
        interchangeability: "Compatible across all Honda S2000 chassis (AP1 and AP2).",
        extractionGuide: "Unplug round pressure switch plug and flat 1-pin solenoid connector. Unscrew three 10mm bolts mounting solenoid body to rear cylinder head corner.",
        difficulty: "Easy",
        category: "Engine & Fueling",
        rarityModifier: "Pristine untouched assemblies with yellow factory torque-marks grab up to +$60.",
        perfModImpact: "Positive: Track days wear these out frequently, keeping demand for OEM spares continuously elevated among club racers."
      },
      {
        name: "AP1 Digital Cluster Tachometer Display",
        estValue: 680,
        toolsNeeded: ["Short Phillips Screwdriver", "Plastic wedge"],
        failureMode: "LCD glass segment fade or internal board capacitor failure, causing speedometer digits to flicker or display blanks under high heat.",
        interchangeability: "Sought after internationally by Honda builders for custom engine swaps (e.g. K-swapped Civics).",
        extractionGuide: "Pry gauge hood trim forward. Remove three Phillips screws securing display bezel. Tilt unit forward and slide locking connectors off rear socket slots.",
        difficulty: "Easy",
        category: "Electronics & Displays",
        rarityModifier: "AP1 9,000 RPM redline clusters command a substantial +$150 over the AP2 8,000 RPM version.",
        perfModImpact: "Extremely Positive: Huge demand for retrofitting into restomod builds of older 80s/90s Hondas."
      },
      {
        name: "Torsen Limited Slip Differential Core (LSD)",
        estValue: 550,
        toolsNeeded: ["14mm & 17mm Sockets", "14mm Box-End Wrench", "Drain Pan"],
        failureMode: "Aggressive clutch-kick drift launches shear teeth off the carrier gears, producing loud clicking under turns.",
        interchangeability: "Interchangeable with certain Mazda MX-5 Miata setups and fits all AP1/AP2 casing shells.",
        extractionGuide: "Drain gear oil. Loosen four rear 14mm driveshaft bolts. Loosen axle stub bolts. Unbolt differential support mounts using 17mm sockets and lower unit using jack.",
        difficulty: "Hard",
        category: "Hydraulics & Drivetrain",
        rarityModifier: "Late direct drive models (CR models) are extremely sought after.",
        perfModImpact: "Neutral: Upgraded aftermarket clutches or 2-way track differentials discard the factory core, sustaining a good recycling ecosystem."
      }
    ]
  },
  {
    id: "bmw-e90-335i",
    make: "BMW",
    model: "335i (E90 / E92)",
    chassisCode: "E90 / E92 / N54",
    years: [2007, 2008, 2009, 2010, 2011, 2012, 2013],
    origin: "German",
    difficultyRating: 3,
    notes: "N54 twin-turbo setup creates huge part rotation. High failure rates on fuel system and turbo actuator components.",
    targetParts: [
      {
        name: "N54 Piezo Direct Fuel Injectors (Index 12)",
        estValue: 800,
        toolsNeeded: ["14mm Flare Wrench", "10mm Socket & Extension", "Pry Tool"],
        failureMode: "Early revision indexes index 1-11 leak fuel under shutoff, fouling spark plugs, creating cold start misfires, and risking engine wash.",
        interchangeability: "Fits N54 and N63 engines (335i, 535i, 135i, Z4, X6, 750i). Extremely sought after on the secondary market.",
        extractionGuide: "Remove engine cowl. Carefully disconnect electric clips. Loosen fuel rail line using 14mm flare wrench. Unbolt index hold-down bracket with 10mm socket. Gently pry injector straight out. Check side stamp for 'Index 12'.",
        difficulty: "Medium",
        category: "Engine & Fueling",
        rarityModifier: "Index 12 is the only version of interest: a full set of 6 Index 12s can fetch up to $1,800 used.",
        perfModImpact: "Highly Positive: Critical upgrade path. Upgraded single turbo setups still rely 100% on high-quality Index 12 injectors."
      },
      {
        name: "M-Sport Leather Seats / Front Assembly",
        estValue: 505,
        toolsNeeded: ["T50 Torx Socket & Breaker Bar", "10mm Socket"],
        failureMode: "Standard commuter bolsters crack or tear, or active heating grid fails in severe climates.",
        interchangeability: "Fits E90 sedan (or E92 coupe) lines directly.",
        extractionGuide: "Disconnect battery first to avoid airbag codes. Slide seat fully forward to uncover rear rail bolts, remove two T50 screws. Slide seat back, remove front two T50 screws. Unhook yellow master wiring yellow block, lift out through open door.",
        difficulty: "Medium",
        category: "Interior Accessories",
        rarityModifier: "Sport seats with adjustable side thigh bolsters in Chestnut Brown or Dakota Red fetch up to +$300.",
        perfModImpact: "Neutral: Race seat installations leave these pristine OEM items for premium restoration specialists."
      },
      {
        name: "FRM3 Footwell Module (Body Module)",
        estValue: 220,
        toolsNeeded: ["10mm Socket", "Plastic Pry Tool"],
        failureMode: "Volt drops during simple battery changes corrupt EEPROM memory, bricking window, mirror, and light indicators.",
        interchangeability: "Direct diagnostic programming swap for E90, E87, and E70 series platforms.",
        extractionGuide: "Access below driver kick panel near hood release. Remove trim covering footwell module. Unbolt single 10mm security speed nut. Slide off main harness slider and extract.",
        difficulty: "Easy",
        category: "Electronics & Engine Control",
        rarityModifier: "Pre-programmed or refurbished modules yield +$70 over core value.",
        perfModImpact: "Neutral: Regular age failure triggers a massive base of buyers needing replacement hardware."
      }
    ]
  },
  {
    id: "chevrolet-corvette-c5",
    make: "Chevrolet",
    model: "Corvette C5 (LS1)",
    chassisCode: "C5 / Y-Body",
    years: [1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004],
    origin: "American",
    difficultyRating: 3,
    notes: "High value Chevy LS internals and suspension components. Extreme demand in muscle retrofit swap circles.",
    targetParts: [
      {
        name: "C5 Active Handling Electronic Brake Control Module (EBCM)",
        estValue: 450,
        toolsNeeded: ["T20 Torx", "10mm Socket", "Pick Tool"],
        failureMode: "Internal relay solder joints fracture due to continuous chassis vibrations, triggering 'Service Active Handling' alerts on dash.",
        interchangeability: "Specially sought for 1997-2004 Corvette chassis restores; pre-2001 modules are obsolete and highly valuable.",
        extractionGuide: "Located ahead of the engine block near the steering column. Disconnect ground block. Remove five T20 Torx fasteners holding module to pump assembly. Unplug electronic pigtails.",
        difficulty: "Medium",
        category: "Electronics & Engine Control"
      },
      {
        name: "LS1 PCM Engine Controller (ECU/PCM)",
        estValue: 180,
        toolsNeeded: ["8mm Socket & Extension", "10mm Socket"],
        failureMode: "Water intrusion through clogged cowl drain holes drains directly onto wiring harnesses, leading to pin oxidation.",
        interchangeability: "The legendary serv. number #0411 fits Corvette, Camaro, Silverado, and is universally matched in custom hot-rod LS swaps.",
        extractionGuide: "Jack up passenger wheel, remove inner fender liner. Unbolt bracket shield. Use 8mm socket to unscrew custom blue/grey main harness connectors, slide PCM container out from frame.",
        difficulty: "Easy",
        category: "Electronics & Engine Control"
      },
      {
        name: "Magnesium Front Hub Carrier & Spindle",
        estValue: 260,
        toolsNeeded: ["18mm Socket", "21mm Deep Socket", "Tie Rod Separator"],
        failureMode: "Track-day curb hops fracture or crack the alloy arms, which cannot be welded safely.",
        interchangeability: "Direct swap across standard and Z06 formats; very popular for custom hot-rod suspension geometry swaps.",
        extractionGuide: "Secure chassis. Unbolt balljoint nuts using 18mm/21mm. Separate tie rod using pry fork. Disconnect wheel speed ABS wire. Remove entire spindle casting.",
        difficulty: "Hard",
        category: "Drivetrain & Core Parts"
      }
    ]
  },
  {
    id: "saab-93-b207",
    make: "Saab",
    model: "9-3 Aero (B207R)",
    chassisCode: "YS3F / Epsilon",
    years: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2011],
    origin: "Swedish",
    difficultyRating: 2,
    notes: "High failure rate on engine control unit due to bad placement. Extremely fast flipping rate for ignition components.",
    targetParts: [
      {
        name: "Trionic 8 Engine Management ECU (T8)",
        estValue: 340,
        toolsNeeded: ["8mm Socket", "Flathead screwdriver"],
        failureMode: "Mounted directly onto the hot intake manifold. Engine block thermal cycles bake the processor until communications drop completely.",
        interchangeability: "Fits standard Saab 9-3 2.0T versions with B207 engines.",
        extractionGuide: "Unscrew plastic engine vanity cover. Locate aluminium ECU module. Remove four 8mm bolts, slide locking plastic harness clamps back to pop lines.",
        difficulty: "Easy",
        category: "Electronics & Engine Control"
      },
      {
        name: "OEM SEM Direct Ignition Cassette",
        estValue: 210,
        toolsNeeded: ["T30 Torx Socket"],
        failureMode: "Internal oil-filled transformers leak or coil insulation cracks, causing cylinder misfires under heavy boost.",
        interchangeability: "Universal across 4-cylinder Turbo powerplants of corresponding decades.",
        extractionGuide: "Unlock middle cartridge clip. Remove four T30 Torx mounting screws from cylinder valve cover. Lift ignition block assembly vertically out of spark plugs wells.",
        difficulty: "Easy",
        category: "Engine & Fueling"
      },
      {
        name: "CIM Column Integration Module (Key System)",
        estValue: 240,
        toolsNeeded: ["T25 Torx", "Steering Wheel Puller"],
        failureMode: "Internal optical angle sensor tracks wear out, causing stability control failure warnings and refusing to recognize key transponders.",
        interchangeability: "Standard fit across the YS3F body style spectrum.",
        extractionGuide: "Disconnect battery (critical!). Pry off airbag module. Unbolt center steering nut. Slide off wheel bezel. Remove column trim Torx screws to extract housing cylinder.",
        difficulty: "Hard",
        category: "Interior Accessories"
      }
    ]
  },
  {
    id: "mazda-rx7-fd",
    make: "Mazda",
    model: "RX-7 Turbo (FD3S)",
    chassisCode: "FD3S / Rotary",
    years: [1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002],
    origin: "Japanese",
    difficultyRating: 4,
    notes: "Rotary-driven lightweight component goldmines. Watch out for brittle, heat-soaked 1990s plastic vacuum lines.",
    targetParts: [
      {
        name: "Twin Turbo Control Solenoid Valve Block",
        estValue: 310,
        toolsNeeded: ["8mm, 10mm Sockets & Ratchet", "Needle Nose Pliers"],
        failureMode: "Continuous underhood turbo rotary heat bakes the Solenoid manifold (the 'Black Box') causing active gate-valve sticking and loss of secondary boost curve.",
        interchangeability: "Fits Mazda RX-7 FD series sports compact twin-turbo platforms.",
        extractionGuide: "Locate valve manifold underneath intake manifold plenum. Tag and disconnect vacuum hoses carefully. Disengage electrical connectors. Unbolt three 10mm mounting bolts and extract.",
        difficulty: "Hard",
        category: "Actuators & Intake",
        rarityModifier: "+$100 for version 5/6 (late JDM) setups.",
        perfModImpact: "Neutral: Standalone ECU runners often replace this with a single-turbo aftermarket layout, creating a rich supply of OEM core units."
      },
      {
        name: "Denso OEM 13B-REW Igniter Module",
        estValue: 240,
        toolsNeeded: ["10mm Socket & Driver"],
        failureMode: "Severe ignition drift heat degradation bakes internal transistors, triggering ignition dropouts under high rotary boost ranges.",
        interchangeability: "Direct transplant or swap across FD3S generation engines.",
        extractionGuide: "Locate on drivers inner fender well. Release clip-lock terminals. Undo two 10mm speed nuts holding unit to structural sheet metal and pull clean.",
        difficulty: "Easy",
        category: "Electronics & Ignition",
        perfModImpact: "Neutral: High-performance builds converting to smart-coils discard these modules, providing excellent salvage stock."
      },
      {
        name: "OEM Dual-Flow Right Side Fender Oil Cooler",
        estValue: 380,
        toolsNeeded: ["12mm Socket", "14mm & 17mm Flare-Nut Wrenches"],
        failureMode: "Front corner debris impact punctures delicate aluminum multi-core fins, leading to slow oil trickles.",
        interchangeability: "Sought after internationally for dual-cooler conversions on base RX-7 trims.",
        extractionGuide: "Jack up vehicle and remove front passenger inner fender guard liner. Disconnect high-pressure feed pipes with flare wrench. Undo 12mm carrier retaining bolts.",
        difficulty: "Medium",
        category: "Drivetrain & Core Parts"
      }
    ]
  },
  {
    id: "subaru-wrx-sti-gd",
    make: "Subaru",
    model: "Impreza WRX STI (GD)",
    chassisCode: "GD / EJ257",
    years: [2004, 2005, 2006, 2007],
    origin: "Japanese",
    difficultyRating: 3,
    notes: "Boxer EJ257 parts and active symmetrical AWD electronics are prime targets for aftermarket retrofitter projects.",
    targetParts: [
      {
        name: "STI Brembo Gold 4-Piston Caliper Set (Front)",
        estValue: 550,
        toolsNeeded: ["12mm Flare Wrench", "17mm Socket & Power Bar"],
        failureMode: "High tracking heat cooks brake fluid, leading to binding pistons or faded aesthetic gold clearcoat.",
        interchangeability: "Highly compatible upgrade component for non-STI Impreza models, WRX chassis, and Forester XT offsets.",
        extractionGuide: "Disconnect fluid line with 12mm flare wrench. Loosen two 17mm knuckle bracket back mounting bolts, lift caliper away from vented disc rotor.",
        difficulty: "Medium",
        category: "Hydraulics & Braking"
      },
      {
        name: "EJ257 Active Valve Control System (AVCS) Solenoids",
        estValue: 195,
        toolsNeeded: ["10mm Socket", "Pliers"],
        failureMode: "Metal shavings or dirty oil block delicate solenoid screens, failing to advance camshaft timing angles and triggering standard P0011 fault logs.",
        interchangeability: "Matches Subaru Forester XT, Legacy GT, and standard WRX ej255/ej257 motor blocks.",
        extractionGuide: "Mounted on back corner of each cylinder head. Disconnect electrical slider. Unbolt single 10mm bolt and gently slide solenoid canister out.",
        difficulty: "Easy",
        category: "Engine & Fueling"
      },
      {
        name: "DCCD Center Differential Control Switch & G-Sensor",
        estValue: 280,
        toolsNeeded: ["Plastic Trim Pry Tool", "10mm Socket"],
        failureMode: "Moisture or beverage spills inside center console corrode internal sliding contacts, throwing active diff lock error codes.",
        interchangeability: "Core components match GC8 / GD platform WRX STI model limits.",
        extractionGuide: "Pry up console shifter trim plate, unplug switch housing connectors. Reach forward under handbrake console to unbolt the active yaw-rate G-sensor cube.",
        difficulty: "Easy",
        category: "Interior Accessories"
      }
    ]
  },
  {
    id: "ford-mustang-svt-cobra",
    make: "Ford",
    model: "Mustang SVT Cobra (Terminator)",
    chassisCode: "SN95 / Cobra",
    years: [2003, 2004],
    origin: "American",
    difficultyRating: 3,
    notes: "Legendary 4.6L Supercharged 'Terminator' parts are high-value collector items. Enthusiasts value untouched OEM cores.",
    targetParts: [
      {
        name: "Eaton M112 Supercharger Assembly Core",
        estValue: 850,
        toolsNeeded: ["10mm, 13mm, 15mm Sockets", "1/2-inch Drive Ratchet", "Pliers"],
        failureMode: "Nose drive snout bearing wear causes roaring rattles, and rotor coating flakes under high supercharger boost velocities.",
        interchangeability: "Direct fitment on Cobra 4.6L 32V DOHC powerplants.",
        extractionGuide: "Use 1/2-inch ratchet to release belt tensioner, slide belt off. Disconnect rear vacuum linkages and throttle cables. Unbolt matching intake elbow screws. Remove matching supercharger base bolts.",
        difficulty: "Hard",
        category: "Engine & Intake Flow"
      },
      {
        name: "OEM Cobra 39lb/hr Fuel Injector Set",
        estValue: 210,
        toolsNeeded: ["8mm Socket", "Fuel Line Disconnect Tool"],
        failureMode: "Varnish or fuel residue buildup gums up target micro-nozzles, leading to injector sticking and engine lean hazards.",
        interchangeability: "Universally swapped in Mustang GT turbo builds.",
        extractionGuide: "Relieve pressure via Schrader valve. Unclip injector control wires. De-mate fuel rail bracket with 8mm sockets, pull rail assembly up and extract injectors.",
        difficulty: "Medium",
        category: "Engine & Fueling"
      },
      {
        name: "SVT Cobra Independent Rear Axle (IRS) Hub Carrier",
        estValue: 340,
        toolsNeeded: ["18mm Socket", "21mm Deep Socket", "Breaker Bar"],
        failureMode: "Heavy drag-launch wheelhop shatters casting aluminum flanges or damages lower control link bushings.",
        interchangeability: "Highly sought after retrofitting conversion item for solid-axle standard SN95 Mustang platforms.",
        extractionGuide: "Jack car up. Safely support trailing arms. Unbolt axle stub nut. Remove two major 21mm retaining bracket bolts and remove wheel hub carrier.",
        difficulty: "Hard",
        category: "Drivetrain & Core Parts"
      }
    ]
  },
  {
    id: "audi-s4-b5",
    make: "Audi",
    model: "S4 (B5 2.7T)",
    chassisCode: "B5 / 2.7T",
    years: [2000, 2001, 2002],
    origin: "German",
    difficultyRating: 4,
    notes: "Stuffed engine bay requires surgical workspace entry. High turnover on turbo bypass valves and ignition controllers.",
    targetParts: [
      {
        name: "OEM Bosch 2.7T Electronic Throttle Body",
        estValue: 155,
        toolsNeeded: ["5mm Hex/Allen bits", "Flathead Screwdriver"],
        failureMode: "Cracked soldered links on internal throttle sweep track cause emergency diagnostic safety limp mode and unstable idle loops.",
        interchangeability: "Fits Audi A6, Allroad, and S4 models utilizing the 2.7 Bi-Turbo block.",
        extractionGuide: "Remove Y-pipe air duct. Disengage the rubber throttle boot. Unscrew 4 hex screws mounting throttle valve to direct runner throat, and unplug wiring interface.",
        difficulty: "Medium",
        category: "Engine & Intake Flow"
      },
      {
        name: "Hitachi ME7.5 Engine Computer (ECU)",
        estValue: 220,
        toolsNeeded: ["Flathead Screwdriver"],
        failureMode: "Age-induced moisture leaks past weatherstrip cowls into ECU cabin container, shorting microprocessor circuits.",
        interchangeability: "Highly swap-friendly across B5 platform configurations.",
        extractionGuide: "Open protective plastic box integrated within cowl area below wipers. Flip bracket metal spring wires, slide plug slide tabs, and pull unit out.",
        difficulty: "Easy",
        category: "Electronics & Engine Control"
      },
      {
        name: "Bosch Twin Turbo Side Diverter Valves (710N Set)",
        estValue: 130,
        toolsNeeded: ["Pliers", "Flathead Screwdriver"],
        failureMode: "Internal rubber diaphragm splits under heat load, causing turbo boost pressure bypass leaks into intake channels.",
        interchangeability: "Highly popular high-boost upgrade for standard 1.8T engines and early Porsche turbo builds.",
        extractionGuide: "Locate on dual boost pipes ahead of engine block. Pinch securing spring clamps. Slide bypass hoses off valve stems and remove core set.",
        difficulty: "Easy",
        category: "Actuators & Intake"
      }
    ]
  },
  {
    id: "porsche-911-996",
    make: "Porsche",
    model: "911 Carrera (996)",
    chassisCode: "996 / M96",
    years: [1999, 2000, 2001, 2002, 2003, 2004, 2005],
    origin: "German",
    difficultyRating: 3,
    notes: "First water-cooled 911. Many end up in salvage due to engine failure, but non-blown accessories and cockpit components hold premium value.",
    targetParts: [
      {
        name: "Litronic Xenon Headlight Ballast Module",
        estValue: 290,
        toolsNeeded: ["8mm Socket & Extension", "T20 security Torx Bit"],
        failureMode: "Corrosion triggers inside ballast chambers due to condensation accumulation, causing high voltage projector flickering.",
        interchangeability: "Compatible with Boxster (986) high-intensity optional headlamps.",
        extractionGuide: "Release headlight assembly lock arm in rear luggage compartment. Slide light assembly forward out of fender. Remove protective rear cover screws to fetch ballast.",
        difficulty: "Easy",
        category: "Electronics & Lighting"
      },
      {
        name: "996 Carrera 3-Spoke Leather Steering Wheel",
        estValue: 380,
        toolsNeeded: ["T30 Torx Screwdriver", "24mm Socket & Breaker Bar"],
        failureMode: "Leather grip splits or thread seams unravel on high-mileage convertible cruisers.",
        interchangeability: "Sought after upgrade for early 4-spoke 996 and Boxster 986 owners.",
        extractionGuide: "Insert T30 Torx to loosen two air-bag retention bolts on back of wheel. Disconnect yellow airbag block. Remove center steering shaft 24mm nut and slide wheel off spline.",
        difficulty: "Medium",
        category: "Interior Accessories"
      },
      {
        name: "Continental VarioCam Camshaft Adjuster Valve",
        estValue: 220,
        toolsNeeded: ["E10 External Torx Socket", "Pick Tool"],
        failureMode: "Solenoid coil internal resistance drifts high when hot, failing to initiate high-RPM variable cam timing shift commands.",
        interchangeability: "Matches M96 horizontally-opposed flat-6 powerplants.",
        extractionGuide: "Access below rear wheel well or from engine cowl area. Undo retaining bracket External Torx screws. Carefully disengage green sealing ring out of valve head jacket.",
        difficulty: "Medium",
        category: "Engine & Fueling"
      }
    ]
  },
  {
    id: "chevrolet-silverado-gmt800",
    make: "Chevrolet",
    model: "Silverado / Tahoe (GMT800)",
    chassisCode: "GMT800 / Gen III",
    years: [1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006],
    origin: "American",
    difficultyRating: 1,
    notes: "The undisputed king of high-volume salvage yards. GM trucks are built like Legos; many fast-pull high-demand components sell within hours.",
    targetParts: [
      {
        name: "Instrument Cluster assembly (Digital Odometer)",
        estValue: 145,
        toolsNeeded: ["7mm Socket & Nut Driver", "Plastic Pry tool"],
        failureMode: "Failing factory stepper motors freeze gauges completely, and cracked resistors cause the digital display to fade to black.",
        interchangeability: "Interchanges with 2003-2006 Silverado, Sierra, Suburban, Yukon, and Tahoe.",
        extractionGuide: "Turn key to drop gear shifter low. Pull bezel trim plate off with bare hands. Remove four 7mm silver hex screws, pull forward and disconnect main harness.",
        difficulty: "Easy",
        category: "Interior Accessories",
        perfModImpact: "Neutral: Extremely popular rebuild core for immediate repair swaps."
      },
      {
        name: "Driver Door Master Switch Module",
        estValue: 85,
        toolsNeeded: ["Flathead Screwdriver"],
        failureMode: "Rain exposure from open windows shorts out internal power window, mirror, and lock PCBs.",
        interchangeability: "Specially keyed for 2003-2006 Sierra/Yukon/Silverado Crew Cabs.",
        extractionGuide: "Pry up plastic control bezel from door panel. Disengage harness locking pins manually, slide old module right out.",
        difficulty: "Easy",
        category: "Electronics"
      },
      {
        name: "Electronic 4WD Transfer Case Switch Button",
        estValue: 75,
        toolsNeeded: ["Pry Tool", "7mm Socket"],
        failureMode: "Continuous circuit cycles crack interior board solder spots, throwing active Service AWD alerts on the dashboard.",
        interchangeability: "Fits 1999-2002 or 2003-2006 GM full-size chassis equipped with Autotrac (NP246).",
        extractionGuide: "Pop dashboard cluster bezel. Leverage flat pry wedge behind button assembly package, push back locks, and slide connector free.",
        difficulty: "Easy",
        category: "Electronics"
      }
    ]
  },
  {
    id: "ford-f155-eleventh-gen",
    make: "Ford",
    model: "F-150 / Expedition (Eleventh Gen)",
    chassisCode: "P221 / Triton",
    years: [2004, 2005, 2006, 2007, 2008],
    origin: "American",
    difficultyRating: 2,
    notes: "Massively abundant fullsize truck chassis. Very prone to electronic faults, making module pull components extremely valuable.",
    targetParts: [
      {
        name: "Fuel Pump Driver Module (FPDM)",
        estValue: 95,
        toolsNeeded: ["8mm Socket", "Wire Brush"],
        failureMode: "Mounted directly on the steel frame rail. Galvanic corrosion rots the aluminum housing, splitting open to short circuit the pump.",
        interchangeability: "Standard fitment on almost all 2004-2008 Ford F-150, Lincoln Mark LT, and Ford Expedition configurations.",
        extractionGuide: "Lower spare tire. Unbolt two 8mm bolts from the frame crossmember. Unplug harness. Always clean the frame bracket with wire brush before putting spacers in.",
        difficulty: "Easy",
        category: "Engine & Fueling",
        perfModImpact: "Neutral: Absolute goldmine because nearly every F-150 on the road will fail this twice in its lifetime."
      },
      {
        name: "IWE 4WD Vacuum Solenoid Actuator",
        estValue: 65,
        toolsNeeded: ["10mm Socket", "Nose Pliers"],
        failureMode: "Rainwater runs past bad wind cowl seals directly into active solenoid circuitry, causing vacuum failures and hub grinding sounds.",
        interchangeability: "Interchanges with 2004-2015 F150 models; late-revised part features water shielding.",
        extractionGuide: "Locate on firewall behind battery. Unbolt bracket using 10mm socket. Pinch plastic vacuum connectors and remove harness.",
        difficulty: "Easy",
        category: "Actuators & Intake"
      },
      {
        name: "Overhead Console Storage & Computer",
        estValue: 120,
        toolsNeeded: ["T15 Torx", "Plastic Pry Tool"],
        failureMode: "SMD resistor soldering fractures cut off power supply to the digital mpg/direction display screen completely.",
        interchangeability: "Fits premium XLT and Lariat crews of similar generation.",
        extractionGuide: "Open storage bin. Remove single Torx screw holding trim. Tug down on panel to disengage pressure pins. Unsnap central display wires.",
        difficulty: "Easy",
        category: "Interior Accessories"
      }
    ]
  },
  {
    id: "honda-civic-eighth-gen",
    make: "Honda",
    model: "Civic (Eighth Gen)",
    chassisCode: "FA1 / FG1 / FA5",
    years: [2006, 2007, 2008, 2009, 2010, 2011],
    origin: "Japanese",
    difficultyRating: 2,
    notes: "The bulletproof daily driver. Although reliable, secondary electronic components fail often due to wear, creating high salvage demand.",
    targetParts: [
      {
        name: "MICU Fuse Box Engine (Multiplex Integrated Control Unit)",
        estValue: 190,
        toolsNeeded: ["10mm Socket", "Plastic Trim Pry Tool", "Pliers"],
        failureMode: "Undetected cabin cowl gasket leaks drop water straight onto the internal fusebox board, causing wild phantom power drains and horn cycling.",
        interchangeability: "Needs exact matching part numbers across corresponding trim tiers (DX, LX, EX).",
        extractionGuide: "Remove lower dashboard knee cover. Unpack three main yellow/grey floor looms. Remove two 10mm hex nuts holding box to chassis brace, slide down.",
        difficulty: "Medium",
        category: "Electronics & Engine Control",
        perfModImpact: "Neutral: Extremely high replacement demand online from daily-commuter owners."
      },
      {
        name: "Camshaft VTEC Spool Control Solenoid",
        estValue: 105,
        toolsNeeded: ["10mm Deep Socket", "Flathead Driver"],
        failureMode: "Engine oil sludging blocks the micro-fine intake filter mesh screen, choking off oil velocity to VTEC lobe pin lock.",
        interchangeability: "Direct swap for all standard R18A 1.8L Civic engine templates.",
        extractionGuide: "Located on rear right side of engine block. Remove three 10mm bolts holding spool valve to block, slide off making sure not to lose original metal screen gasket.",
        difficulty: "Easy",
        category: "Engine & Fueling"
      },
      {
        name: "HVAC Air Blend Door Actuator Motor",
        estValue: 80,
        toolsNeeded: ["Short Phillips Screwdriver"],
        failureMode: "Plastic gears drop tooth alignment or internal carbon contacts dry up, blowing cold air exclusively during winter.",
        interchangeability: "Interchangeable across all 2006-2011 standard Civic models.",
        extractionGuide: "Lie in passenger footwell looking up behind center dash glove box. Remove three Phillips screw pins and disengage control bar.",
        difficulty: "Medium",
        category: "Interior Accessories"
      }
    ]
  },
  {
    id: "toyota-corolla-matrix-1zz",
    make: "Toyota",
    model: "Corolla / Matrix (Ninth Gen)",
    chassisCode: "E120 / E130",
    years: [2003, 2004, 2005, 2006, 2007, 2008],
    origin: "Japanese",
    difficultyRating: 1,
    notes: "One of the most sold vehicles globally. Simple mechanics make parts pulling a breeze, with high salvage velocity.",
    targetParts: [
      {
        name: "Denso Delco Engine Management Computer (PCM/ECU)",
        estValue: 165,
        toolsNeeded: ["10mm Socket", "Phillips Screwdriver"],
        failureMode: "Toyota issued a massive recall for bad solder points on the circuit card causing sudden engine stalling.",
        interchangeability: "Matched across corresponding years of 1ZZ-FE Corolla, Matrix, and Pontiac Vibe configurations.",
        extractionGuide: "Open cabin glovebox door and squeeze sides to lower. Locate ECU attached immediately above bracket. Remove three 10mm gold screws and pull lock plugs.",
        difficulty: "Easy",
        category: "Electronics & Engine Control"
      },
      {
        name: "VVTi Camshaft Control Valve Solenoid",
        estValue: 80,
        toolsNeeded: ["10mm Socket", "Flathead Screwdriver"],
        failureMode: "High miles trigger carbon varnish deposits that sticky the solenoid shaft valve, causing rough, unstable idling.",
        interchangeability: "Fits 1ZZ-FE 1.8L powertrains across multiple decades of Toyota build outs.",
        extractionGuide: "Locate left corner of cylinder valve cover. Unbolt single 10mm keeper bolt and rotate collar outwards gently to break lock seal.",
        difficulty: "Easy",
        category: "Engine & Fueling"
      },
      {
        name: "Power Master Window Console Switches",
        estValue: 70,
        toolsNeeded: ["Trim Tool", "Phillips Screwdriver"],
        failureMode: "Factory lubricant hardens and bakes, triggering resistive tracking that smokes interior button nodes.",
        interchangeability: "Matches standard Corolla body layouts, as well as several Scion model trims of same cohort.",
        extractionGuide: "Lever trim plastic cover up from armrest frame. Undo one Phillips lock screw from underlying housing casing, unfasten clip.",
        difficulty: "Easy",
        category: "Interior Accessories"
      }
    ]
  },
  {
    id: "nissan-maxima-a34",
    make: "Nissan",
    model: "Maxima (A34 6th Gen)",
    chassisCode: "A34 / VQ35DE",
    years: [2004, 2005, 2006, 2007, 2008],
    origin: "Japanese",
    difficultyRating: 2,
    notes: "6th-Gen '4-Door Sports Car' (4DSC) with 255-265hp 3.5L V6 VQ35DE. 2007-2008 facelift brought the Jatco Xtronic CVT (RE0F09B), refined IPDM electrical architecture, and revised Matsushita Gen IV lighting. Massive parts interchangeability with 350Z, G35, Altima 3.5 SE-R, FX35, and Murano makes it a salvage yard goldmine.",
    targetParts: [
      {
        name: "Hitachi OEM Camshaft & Crankshaft Position Sensor Set (3-Piece)",
        estValue: 145,
        toolsNeeded: ["10mm Socket & 1/4\" Ratchet", "6-inch Extension", "Flathead Screwdriver"],
        failureMode: "Extreme cylinder head thermal cycles degrade internal Hall-effect solder points and magnet coils, causing sudden highway engine stalling, hot extended cranking, and P0340/P0345 trouble codes.",
        interchangeability: "Direct cross-compatibility with Nissan 350Z (Z33), Infiniti G35 (V35), Altima 3.5L, Murano (Z50), FX35, and Quest 3.5L.",
        extractionGuide: "Locate Bank 1 & Bank 2 cam sensors on rear and front cylinder heads near firewall and intake tube. Disconnect green locking wire harness clips. Unbolt single 10mm retaining bolt per sensor and twist gently to extract without tearing O-ring. Pull crank sensor near bellhousing bottom.",
        difficulty: "Easy",
        category: "Sensors & Electronics",
        rarityModifier: "Must be authentic Hitachi / Nissan stamped cores; aftermarket clones have near 50% out-of-box failure rates.",
        perfModImpact: "Neutral: Extremely high turnover on secondary marketplace due to daily driver fleet breakdowns."
      },
      {
        name: "Matsushita Gen IV HID Xenon Headlight Ballast & Igniter",
        estValue: 175,
        toolsNeeded: ["10mm Socket", "Phillips Screwdriver", "T20 Torx Bit", "Plastic Trim Tool"],
        failureMode: "Condensation pooling at the bottom of the headlight housing seeps directly into the ballast casing, causing internal high-voltage circuitry short-circuits and permanent low-beam failure.",
        interchangeability: "High demand interchange across 2003-2009 Nissan 350Z, Infiniti G35 Coupe/Sedan, FX35/FX45, Murano, and Maxima.",
        extractionGuide: "Remove front bumper top clips and fender liner screws to pull bumper corner forward. Unbolt three 10mm headlight mounting bolts. Remove headlight housing, flip upside down, and unscrew three T20/Phillips mounting screws securing the ballast. Unclip the braided metal igniter harness.",
        difficulty: "Medium",
        category: "Electronics & Lighting",
        rarityModifier: "+$35 if wire pigtail and uncorroded rubber sealing gasket are intact."
      },
      {
        name: "Hitachi 70mm Drive-By-Wire Throttle Body Assembly",
        estValue: 155,
        toolsNeeded: ["8mm & 10mm Sockets", "5mm Hex/Allen Key", "Pliers", "Flathead Screwdriver"],
        failureMode: "Carbon blowby sludge gums up the throttle plate while internal drive gear teeth strip, resulting in erratic surging idle, P0507 trouble codes, and limp-home mode under load.",
        interchangeability: "Direct bolt-on replacement and popular upgrade for Nissan 350Z, G35, Altima 3.5 SE-R, Murano, and Pathfinder VQ35DE platforms.",
        extractionGuide: "Remove air intake accordion duct using flathead screwdriver on clamps. Pinch coolant bypass hose clamps with pliers and plug lines. Disconnect main 6-pin electrical harness. Remove four 5mm hex bolts and lift throttle body off intake manifold.",
        difficulty: "Easy",
        category: "Engine & Intake Flow",
        perfModImpact: "High demand: Enthusiasts port and polish OEM Hitachi throttle bodies for naturally aspirated VQ power gains."
      },
      {
        name: "IPDM E/R (Intelligent Power Distribution Module / Fuse-Relay Block)",
        estValue: 165,
        toolsNeeded: ["10mm Socket", "Plastic Pry Tool", "Needle Nose Pliers"],
        failureMode: "Internal solid-state relays (especially ECM/fuel pump and radiator cooling fan relays) overheat and fail intermittently, causing mysterious engine no-start issues or battery drains.",
        interchangeability: "Matches 2004-2008 Maxima, 2005-2006 Altima, and select Murano trims. Highly sought after by mechanics avoiding $500 dealer replacements.",
        extractionGuide: "Located in the engine bay next to the passenger strut tower inside a black protective enclosure. Pop the lid clips, remove two 10mm bracket nuts, slide the module upward, and release the multiple color-coded locking harness connectors.",
        difficulty: "Easy",
        category: "Electronics & Engine Control",
        rarityModifier: "White label Rev B & C units sell faster due to factory-improved internal relay soldering."
      },
      {
        name: "VIAS Variable Intake Air Solenoid Valve & Actuator (Power Valve)",
        estValue: 110,
        toolsNeeded: ["10mm Socket & Extension", "Phillips Screwdriver", "Needle Nose Pliers"],
        failureMode: "The internal plastic butterfly flap linkage wears out or rattles violently like a broken rod bearing ('VIAS rattle'), and the vacuum actuator diaphragm ruptures, destroying low-end torque.",
        interchangeability: "Direct fit on 2002-2008 VQ35DE intake manifolds (Maxima, Altima 3.5, Quest, Murano).",
        extractionGuide: "Mounted on the driver's side of the upper aluminum intake manifold plenum. Tag and pull vacuum lines, remove three 10mm bolts securing the actuator valve to the manifold, and slide the assembly out horizontally.",
        difficulty: "Easy",
        category: "Actuators & Intake",
        perfModImpact: "High turnover: Many owners seek good OEM units to eliminate the loud engine bay rattle without buying complete intake manifolds."
      },
      {
        name: "Bose 8-Speaker Premium Trunk Amplifier & Subwoofer Module",
        estValue: 140,
        toolsNeeded: ["10mm Socket & Ratchet", "Panel Pry Tool"],
        failureMode: "Capacitors dry out and corrosion from rear trunk lid gasket leaks cause sound dropouts, loud popping noises, or complete audio silence.",
        interchangeability: "Specific to 6th Gen Maxima SE/SL trims equipped with factory Bose sound systems.",
        extractionGuide: "Open trunk, peel back right side trunk liner clips with panel tool. The amplifier is mounted to the metal chassis quarter panel behind the wheel arch. Unbolt three 10mm bracket bolts and unplug two multi-pin wiring harnesses.",
        difficulty: "Easy",
        category: "Interior Accessories",
        rarityModifier: "+$40 if paired with working 6x9 rear deck subwoofers."
      },
      {
        name: "VTC Variable Timing Solenoid Valves (Pair)",
        estValue: 130,
        toolsNeeded: ["10mm Socket & 1/4\" Ratchet", "Small Pick Tool"],
        failureMode: "Engine sludge or dirty oil clogs the microscopic oil feed screens inside the solenoids, preventing valve timing advance and throwing P0011 / P0021 codes.",
        interchangeability: "Fits all front-wheel drive and rear-wheel drive VQ35DE engines across Nissan/Infiniti lines from 2002 to 2008.",
        extractionGuide: "Located on front timing covers of both cylinder heads. Disconnect electrical plugs, remove three 10mm bolts per solenoid, and gently pry the valve body forward off the timing cover.",
        difficulty: "Easy",
        category: "Engine & Fueling"
      },
      {
        name: "ABS / VDC Hydraulic Control Unit & Pump Assembly",
        estValue: 210,
        toolsNeeded: ["10mm & 12mm Flare Nut Wrenches", "10mm Socket & Ratchet"],
        failureMode: "Internal motor brushes stick or pressure sensors fail, permanently illuminating ABS, SLIP, and BRAKE warning lights.",
        interchangeability: "Direct swap for 2004-2008 Maxima SE/SL and compatible 3.5 Altima models with Vehicle Dynamic Control.",
        extractionGuide: "Located in the engine bay passenger rear corner. Bleed line pressure, use flare nut wrenches to disconnect 6 brake hard lines (labeling each), unbolt three 10mm mounting bracket bolts, and disconnect the main electronic plug lever.",
        difficulty: "Hard",
        category: "Hydraulics & Braking"
      },
      {
        name: "Jatco CVT Stepper Motor & Valve Body Solenoids (RE0F09B / JF010E)",
        estValue: 245,
        toolsNeeded: ["10mm Socket & Extension", "Torx T25 Bit", "Drain Pan", "Flathead Screwdriver"],
        failureMode: "Internal stepper motor coil windings burn out or pressure solenoids stick from fluid overheating, causing the 2007-2008 Maxima CVT to lock into 1st gear ratio / limp-mode (P1778 code).",
        interchangeability: "Direct fit for 2007-2008 Maxima 3.5, 2007-2012 Altima 3.5, 2003-2008 Murano, and 2008-2012 Quest equipped with the Jatco RE0F09B / JF010E CVT transmission.",
        extractionGuide: "Drain transmission pan using 19mm hex drain bolt. Unbolt twenty 10mm oil pan bolts. Disconnect internal wire harness clips on the valve body. Unscrew two Torx T25 screws securing the stepper motor to the valve body and unhook the ratio control arm.",
        difficulty: "Medium",
        category: "Drivetrain & Core Parts",
        rarityModifier: "+$40 if harvested with the complete uncut internal transmission wiring harness.",
        perfModImpact: "Extremely high secondary market velocity: Allows repair shops to fix $4,000 CVT transmission failures for under $400 in parts."
      },
      {
        name: "Power Steering High-Pressure Hose Assembly w/ Pressure Switch",
        estValue: 120,
        toolsNeeded: ["16mm Flare Nut Wrench", "10mm & 12mm Sockets", "Pliers"],
        failureMode: "The factory rubber-to-metal crimp ferrule fails directly above the exhaust manifold and alternator, spraying high-pressure ATF fluid and creating an active engine fire risk and alternator failure.",
        interchangeability: "Direct replacement across 2004-2008 Nissan Maxima 3.5L and 2002-2006 Altima 3.5L SE/SE-R.",
        extractionGuide: "Raise vehicle front or turn wheel full right. Disconnect the pressure sensor harness. Use 16mm flare nut wrench on the steering rack banjo/flare fitting and 10mm socket on the heat shield support brackets. Unbolt 12mm banjo bolt from the power steering pump.",
        difficulty: "Medium",
        category: "Hydraulics & Steering"
      },
      {
        name: "Intelligent Key Twist-Knob Ignition Switch & BCM Module",
        estValue: 140,
        toolsNeeded: ["Phillips Screwdriver", "10mm Socket", "Plastic Pry Tool"],
        failureMode: "The steering lock actuator and keyless ignition antenna receiver degrade, leaving the car stuck in Lock mode with the keyless knob refusing to turn.",
        interchangeability: "Interchangeable with 2007-2008 Maxima (facelift with Intelligent Key) and 2005-2006 Infiniti G35 Sedan Smart Key setups.",
        extractionGuide: "Remove steering column plastic cover screws. Unbolt two 10mm sheer bolts or bracket screws holding the ignition cylinder. Reach behind dash to unplug the antenna ring and ignition harness. Pull BCM behind driver side dash kick panel.",
        difficulty: "Easy",
        category: "Electronics & Security",
        rarityModifier: "+$35 if matching 2007-2008 OEM Smart Key Fob is found in the vehicle glovebox/cupholder."
      },
      {
        name: "Elite Package 4-Passenger Rear Center Console & Switchgear",
        estValue: 195,
        toolsNeeded: ["10mm & 14mm Sockets", "Phillips Screwdriver", "Trim Pry Tool"],
        failureMode: "Cup holder spring lids break and heated seat rocker switches short circuit from spilled liquids in the rear passenger cabin.",
        interchangeability: "Extremely rare option on 2004-2008 Maxima SE Elite Package (replaces 3-passenger rear bench with dual bucket seats and fixed full-length center console).",
        extractionGuide: "Pry up rear center console cup holder trim. Unbolt four 10mm mounting bolts securing console to floor structure. Disconnect heated seat harness and 12V power outlet pigtail. Remove console upward.",
        difficulty: "Easy",
        category: "Interior Accessories",
        rarityModifier: "+$75 if leather armrest stitching is undamaged and all spring-loaded cup holder doors operate smoothly."
      }
    ]
  },
  {
    id: "nissan-maxima-a33",
    make: "Nissan",
    model: "Maxima (A33 / 5.5 Gen)",
    chassisCode: "A33B / VQ35DE & VQ30DE-K",
    years: [2000, 2001, 2002, 2003],
    origin: "Japanese",
    difficultyRating: 2,
    notes: "The golden era of the 4-Door Sports Car. 2002-2003 '5.5 Gen' introduced the 255hp 3.5L VQ35DE with available 6-speed manual and factory Helical Limited Slip Differential (HLSD). Cult classic with ultra-high resale value on manual drivetrain conversions.",
    targetParts: [
      {
        name: "6-Speed Manual Transmission w/ Factory Helical LSD (RS6F51H)",
        estValue: 750,
        toolsNeeded: ["14mm, 17mm, 19mm Sockets", "Breaker Bar", "Engine Support Bar", "Axle Nut Socket"],
        failureMode: "High mileage 3rd gear synchronizer crunch or differential pinion bearing wear.",
        interchangeability: "The holy grail transmission for Maxima, Altima, and Sentra SER Spec-V manual swap builds. Extremely rare with factory HLSD code on firewall plate.",
        extractionGuide: "Support engine from top. Remove axles, starter, shifter cables, and clutch slave cylinder. Unbolt bellhousing bolts (14mm & 17mm), drop subframe, and slide transaxle away from flywheel.",
        difficulty: "Hard",
        category: "Drivetrain & Core Parts",
        rarityModifier: "+$200 for verified HLSD stamped casing (tag ends in 'H')."
      },
      {
        name: "5.5-Gen Titanium Edition / SE Guage Cluster & Amber Shift Knob",
        estValue: 165,
        toolsNeeded: ["Phillips Screwdriver", "Plastic Pry Tool"],
        failureMode: "Backlight inverter failure or broken tachometer stepper needle.",
        interchangeability: "Sought after plug-and-play upgrade for 2000-2001 A33 Maxima owners.",
        extractionGuide: "Lower tilt steering wheel. Pry upper steering column shroud. Remove two Phillips screws in upper cluster bezel. Remove cluster retaining screws, pull forward, and unclip three rear harnesses.",
        difficulty: "Easy",
        category: "Interior Accessories"
      },
      {
        name: "Hitachi 22680-2Y001 Mass Air Flow (MAF) Sensor with Housing",
        estValue: 120,
        toolsNeeded: ["Security Torx T20 / 7mm Socket", "Flathead Screwdriver"],
        failureMode: "Hot-wire element collects oily grime and burns out, causing severe stumbling, hesitation above 2500 RPM, and P0171/P0174 lean codes.",
        interchangeability: "Universal demand for 2000-2003 VQ30DE-K and VQ35DE Nissan Maxima, I30, and I35.",
        extractionGuide: "Unclip sensor harness. Loosen hose clamp on intake duct. Remove two 7mm or Torx screws securing MAF tube to air filter box and lift unit out.",
        difficulty: "Easy",
        category: "Sensors & Electronics"
      }
    ]
  }
];
