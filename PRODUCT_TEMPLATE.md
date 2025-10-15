# Product Template - Copy & Paste to Add New Products

## 📝 How to Use This Template

1. Copy the appropriate template below
2. Fill in all the information
3. Add to the correct array in `src/app/products/robotics-kits/page.tsx`
4. Upload product images to the specified directory
5. Test the product display and filtering

---

## 🎓 EDUCATIONAL KIT TEMPLATE

```typescript
{
  id: "edu-[short-name]",  // Example: "edu-intermediate-kit"
  name: "[Full Product Name]",  // Example: "STEM-ED Intermediate Robotics Kit"
  category: "educational",
  subcategory: "[basic|intermediate|advanced]",  // Choose one
  description: "[100-200 words describing the kit, target audience, what students will learn, and key benefits. Make it engaging and educational-focused.]",
  features: [
    {
      name: "[Feature 1 Title]",  // Example: "Visual Programming"
      description: "[Feature 1 details]"  // Example: "Drag-and-drop coding interface"
    },
    {
      name: "[Feature 2 Title]",
      description: "[Feature 2 details]"
    },
    {
      name: "[Feature 3 Title]",
      description: "[Feature 3 details]"
    },
    {
      name: "[Feature 4 Title]",
      description: "[Feature 4 details]"
    }
  ],
  specifications: {
    "Control Unit": "[Board type]",  // Example: "Arduino Uno R3"
    "Sensors": "[List of sensors]",  // Example: "2x Ultrasonic, 1x Line sensor"
    "Actuators": "[Motors included]",  // Example: "2x DC motors, 1x Servo"
    "Power": "[Power source]",  // Example: "6AA batteries or USB"
    "Programming": "[Programming options]",  // Example: "Scratch, mBlock, Arduino IDE"
    "Building Components": "[Structural parts]",  // Example: "200+ pieces"
    "Age Range": "[Age range]"  // Example: "10-14 years"
  },
  price: "KES [X,XXX]",  // Example: "KES 25,000"
  imageUrl: "/products/robotics/educational/[product-folder]/main.jpg",
  ageRange: ["[X-Y]"],  // Example: ["10-14"] or ["12+"]
  educationLevel: ["[level1]", "[level2]"],  // Options: elementary, middle, high, college
  functionality: ["[func1]", "[func2]"]  // Options: basic-sensors, visual-programming, ai-integration, computer-vision, autonomous-navigation
}
```

### Educational Kit Example (Filled):

```typescript
{
  id: "edu-intermediate-stem",
  name: "STEM-ED Intermediate Robotics Kit",
  category: "educational",
  subcategory: "intermediate",
  description: "Perfect for middle school students ready to advance their robotics skills. This comprehensive kit includes Arduino programming, multiple sensors for complex projects, and mechanical building components. Students learn text-based coding, sensor integration, and problem-solving through 15+ guided projects including maze solvers, automated systems, and interactive robots.",
  features: [
    {
      name: "Arduino Programming",
      description: "Learn real coding with Arduino IDE and C++"
    },
    {
      name: "Advanced Sensors",
      description: "Ultrasonic, IR, color, and touch sensors included"
    },
    {
      name: "15+ Projects",
      description: "Progressive challenges from basic to advanced"
    },
    {
      name: "Complete Curriculum",
      description: "Teacher guides, student worksheets, assessments"
    }
  ],
  specifications: {
    "Control Unit": "Arduino Uno R3 + expansion shield",
    "Sensors": "Ultrasonic x2, IR x2, Color sensor, Touch sensor",
    "Actuators": "DC motors x2, Servo motors x2, Buzzer, LED array",
    "Power": "Rechargeable battery pack with charger",
    "Programming": "Arduino IDE (C++), mBlock optional",
    "Building Components": "300+ pieces including chassis, wheels, brackets",
    "Age Range": "11-14 years"
  },
  price: "KES 28,000",
  imageUrl: "/products/robotics/educational/intermediate-stem/main.jpg",
  ageRange: ["8-12", "12-16"],
  educationLevel: ["middle", "high"],
  functionality: ["basic-sensors", "visual-programming"]
}
```

---

## 🏆 COMPETITION KIT TEMPLATE

```typescript
{
  id: "comp-[competition-name]",  // Example: "comp-fll-advanced"
  name: "[Full Product Name]",  // Example: "FLL Advanced Competition Kit"
  category: "competition",
  subcategory: "[fll|wro|vex|first]",  // Competition type
  description: "[100-200 words about competition compatibility, performance features, durability, what competitions it's suitable for, and competitive advantages.]",
  features: [
    {
      name: "[Feature 1 Title]",
      description: "[Feature 1 details]"
    },
    {
      name: "[Feature 2 Title]",
      description: "[Feature 2 details]"
    },
    {
      name: "[Feature 3 Title]",
      description: "[Feature 3 details]"
    },
    {
      name: "[Feature 4 Title]",
      description: "[Feature 4 details]"
    }
  ],
  specifications: {
    "Control Unit": "[Competition-approved controller]",
    "Sensors": "[High-precision sensor list]",
    "Actuators": "[Competition-grade motors]",
    "Building Elements": "[Number and type of pieces]",
    "Power": "[Battery specifications]",
    "Programming": "[Supported languages/platforms]",
    "Competition": "[Competition name and rules compliance]",
    "Age Range": "[Age range]"
  },
  price: "KES [XX,XXX]",
  imageUrl: "/products/robotics/competition/[product-folder]/main.jpg",
  ageRange: ["[X-Y]"],
  educationLevel: ["[level1]", "[level2]"]
}
```

---

## ⚡ ELECTRONICS COMPONENT TEMPLATE

### For Robot Control Units (RCU):

```typescript
{
  id: "rcu-[board-name]",  // Example: "rcu-arduino-mega"
  name: "[Board Name]",  // Example: "Arduino Mega 2560 R3"
  category: "electronics",
  subcategory: "rcu",
  description: "[50-100 words about the microcontroller, its capabilities, typical uses, and who it's best for.]",
  features: [
    {
      name: "[Microcontroller]",
      description: "[Chip details]"
    },
    {
      name: "[I/O Capabilities]",
      description: "[Pin counts and types]"
    },
    {
      name: "[Memory]",
      description: "[Flash, SRAM, EEPROM]"
    },
    {
      name: "[Programming]",
      description: "[How to program it]"
    }
  ],
  specifications: {
    "Microcontroller": "[Chip model]",
    "Operating Voltage": "[Voltage]",
    "Input Voltage": "[Voltage range]",
    "Digital I/O Pins": "[Number (PWM)]",
    "Analog Input Pins": "[Number]",
    "DC Current per I/O": "[mA]",
    "Flash Memory": "[Size]",
    "SRAM": "[Size]",
    "Clock Speed": "[MHz]"
  },
  price: "KES [X,XXX]",
  imageUrl: "/products/electronics/rcu/[product-name]/main.jpg",
  ageRange: ["12+"],
  educationLevel: ["middle", "high", "college"]
}
```

### For Sensors:

```typescript
{
  id: "sensor-[type]-[model]",  // Example: "sensor-ir-tcrt5000"
  name: "[Sensor Name and Model]",  // Example: "TCRT5000 IR Obstacle Sensor"
  category: "electronics",
  subcategory: "sensor",
  description: "[50-100 words about what the sensor detects, how it works, common applications, and accuracy/range information.]",
  features: [
    {
      name: "[Detection Type]",
      description: "[What it detects and how]"
    },
    {
      name: "[Range/Accuracy]",
      description: "[Specifications]"
    },
    {
      name: "[Interface]",
      description: "[How to connect]"
    },
    {
      name: "[Power]",
      description: "[Power requirements]"
    }
  ],
  specifications: {
    "Working Voltage": "[Voltage]",
    "Working Current": "[mA]",
    "Detection Range": "[Range]",
    "Output Type": "[Digital/Analog]",
    "Response Time": "[ms]",
    "Operating Temperature": "[Range]",
    "Dimensions": "[Size]"
  },
  price: "KES [XXX]",
  imageUrl: "/products/electronics/sensor/[sensor-type]/main.jpg",
  ageRange: ["10+"],
  educationLevel: ["elementary", "middle", "high", "college"]
}
```

### For Actuators/Motors:

```typescript
{
  id: "motor-[type]-[model]",  // Example: "motor-servo-mg996r"
  name: "[Motor Name and Model]",  // Example: "MG996R High-Torque Servo Motor"
  category: "electronics",
  subcategory: "actuator",
  description: "[50-100 words about motor type, torque/speed, typical applications, and what makes it suitable for robotics.]",
  features: [
    {
      name: "[Torque]",
      description: "[Torque specifications]"
    },
    {
      name: "[Speed]",
      description: "[Speed specifications]"
    },
    {
      name: "[Control]",
      description: "[How to control it]"
    },
    {
      name: "[Durability]",
      description: "[Build quality notes]"
    }
  ],
  specifications: {
    "Operating Voltage": "[Voltage range]",
    "Stall Torque": "[kg-cm]",
    "Operating Speed": "[sec/60°]",
    "Control Signal": "[PWM details]",
    "Gear Type": "[Plastic/Metal]",
    "Weight": "[grams]",
    "Dimensions": "[Size]"
  },
  price: "KES [XXX]",
  imageUrl: "/products/electronics/actuator/[motor-type]/main.jpg",
  ageRange: ["10+"],
  educationLevel: ["elementary", "middle", "high", "college"]
}
```

### For Cables/Connectors:

```typescript
{
  id: "cable-[type]",  // Example: "cable-jumper-mf"
  name: "[Cable/Connector Name]",  // Example: "Male-to-Female Jumper Wire Set (40pcs)"
  category: "electronics",
  subcategory: "cable",
  description: "[30-50 words about cable type, quantity in pack, length, quality, and typical uses.]",
  features: [
    {
      name: "[Quantity]",
      description: "[How many pieces]"
    },
    {
      name: "[Length]",
      description: "[Cable length]"
    },
    {
      name: "[Quality]",
      description: "[Build quality]"
    },
    {
      name: "[Compatibility]",
      description: "[What it works with]"
    }
  ],
  specifications: {
    "Connector Type": "[M-M, M-F, F-F, etc.]",
    "Quantity": "[Number of wires/cables]",
    "Wire Length": "[Length in cm]",
    "Wire Gauge": "[AWG]",
    "Color Coded": "[Yes/No]",
    "Pin Spacing": "[mm]"
  },
  price: "KES [XXX]",
  imageUrl: "/products/electronics/cable/[cable-type]/main.jpg",
  ageRange: ["8+"],
  educationLevel: ["elementary", "middle", "high", "college"]
}
```

### For Mechanical Structures:

```typescript
{
  id: "mech-[part-type]",  // Example: "mech-chassis-aluminum"
  name: "[Mechanical Part Name]",  // Example: "Aluminum Robot Chassis - 4WD"
  category: "electronics",
  subcategory: "mechanical",
  description: "[50-100 words about the mechanical component, material, what it's used for, compatibility, and build quality.]",
  features: [
    {
      name: "[Material]",
      description: "[Material type and quality]"
    },
    {
      name: "[Dimensions]",
      description: "[Size specifications]"
    },
    {
      name: "[Compatibility]",
      description: "[What it works with]"
    },
    {
      name: "[Included Parts]",
      description: "[What comes in the package]"
    }
  ],
  specifications: {
    "Material": "[Aluminum/Plastic/Steel]",
    "Dimensions": "[LxWxH in mm]",
    "Weight": "[grams]",
    "Motor Mounts": "[Number and type]",
    "Mounting Holes": "[Number and spacing]",
    "Load Capacity": "[kg]",
    "Included": "[List of included parts]"
  },
  price: "KES [X,XXX]",
  imageUrl: "/products/electronics/mechanical/[part-type]/main.jpg",
  ageRange: ["10+"],
  educationLevel: ["middle", "high", "college"]
}
```

---

## 📸 Image Checklist for Each Product

### Required Images:

- [ ] Main product image (1200x1200px, white background)
- [ ] Top view
- [ ] Side view (if applicable)
- [ ] Bottom/back view (if applicable)
- [ ] Close-up of key features
- [ ] Size comparison (with ruler or common object)
- [ ] In use / assembled (for kits)
- [ ] Packaging (optional)

### Image File Naming:

```
main.jpg          (Primary product photo)
view-top.jpg      (Top view)
view-side.jpg     (Side view)
view-back.jpg     (Back/bottom view)
detail-1.jpg      (Close-up of feature 1)
detail-2.jpg      (Close-up of feature 2)
scale.jpg         (Size comparison)
assembled.jpg     (In use / assembled)
package.jpg       (Product packaging)
```

---

## ✅ Pre-Launch Checklist

Before adding a product, ensure:

- [ ] Product name is clear and descriptive
- [ ] Description is 50-200 words (depending on product type)
- [ ] 3-4 key features listed
- [ ] 5-10 specifications included
- [ ] Price in KES format
- [ ] Age range accurately reflects complexity
- [ ] Education level(s) correctly assigned
- [ ] Functionality tags added (for educational kits)
- [ ] All images uploaded to correct folder
- [ ] Images optimized (<200KB each)
- [ ] Main image named "main.jpg"
- [ ] Unique product ID assigned
- [ ] Tested on desktop and mobile
- [ ] Filtering works correctly
- [ ] No typos or errors

---

## 🔢 ID Naming Convention

### Format:

```
[category]-[type/model]-[variant]
```

### Examples:

- `edu-basic-kit`
- `edu-ai-advanced`
- `comp-fll-starter`
- `comp-wro-pro`
- `rcu-arduino-uno`
- `rcu-raspi-4-4gb`
- `sensor-ultrasonic-hcsr04`
- `sensor-ir-obstacle`
- `motor-servo-sg90`
- `motor-dc-12v-100rpm`
- `cable-jumper-mf-40`
- `mech-chassis-4wd`

### Rules:

- All lowercase
- Use hyphens, not underscores or spaces
- Be descriptive but concise
- Include model number when relevant
- Include variant (like "4gb" for RPi) when applicable

---

## 💰 Pricing Guidelines

### Educational Kits:

- Basic (Ages 5-10): KES 8,000 - 15,000
- Intermediate (Ages 10-14): KES 15,000 - 35,000
- Advanced (Ages 14-18): KES 35,000 - 60,000
- AI/Professional (Ages 16+): KES 60,000 - 100,000+

### Competition Kits:

- Entry: KES 40,000 - 70,000
- Advanced: KES 70,000 - 150,000
- Professional: KES 150,000+

### Electronics:

- Small parts (sensors, cables): KES 100 - 1,000
- Control boards: KES 1,500 - 8,000
- Motors/Actuators: KES 300 - 5,000
- Camera modules: KES 2,000 - 15,000
- Chassis/Large parts: KES 2,000 - 10,000

---

## 📞 Need Help?

**Questions about adding products?**

- Check: `ROBOTICS_KITS_GUIDE.md` for detailed instructions
- See: `ROBOTICS_KITS_SUMMARY.md` for quick reference
- Edit: `src/app/products/robotics-kits/page.tsx` to add products

**Template not working?**

- Verify JSON syntax (commas, quotes, brackets)
- Check TypeScript types match
- Ensure image paths are correct
- Test filtering after adding

---

**Last Updated**: October 15, 2025  
**Version**: 1.0
