const mongoose = require("mongoose");
const User = require("./models/User");

const MONGO_URI = "mongodb://localhost:27017/mydb"; 
let passwordCounter = 1;

const generatePassword = () => `pass${passwordCounter++}`;


const departments = [
  "hr",
  "legal",
  "finance",
  "it",
  "sales",
  "operations",
  "rnd",
  "marketing",
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await User.deleteMany({});
    console.log("Deleted existing users");

    const head = new User({
      name: "Head User",
      email: "head@example.com",
      password: generatePassword(), 
      role: "head",
      empid: 1,
      dept: null,
      dateOfJoining: new Date(),
      reportingTo: null,
    });
    await head.save();
    console.log("Created Head:", head.name);

    let empidCounter = 2; 

    const groupHeads = [];
    for (const dept of departments) {
      const gh = new User({
        name: `Group Head - ${dept.toUpperCase()}`,
        email: `gh_${dept}@example.com`,
        password: generatePassword(),
        role: "grouphead",
        empid: empidCounter++,
        dept: dept,
        dateOfJoining: new Date(),
        reportingTo: head._id,
      });
      await gh.save();
      groupHeads.push(gh);
      console.log(`Created GH for ${dept}: ${gh.name}`);
    }

    for (let i = 0; i < departments.length; i++) {
      const dept = departments[i];
      const gh = groupHeads[i];

      for (let j = 1; j <= 9; j++) {
        try {
          const emp = new User({
            name: `Employee ${j} - ${dept.toUpperCase()}`,
            email: `emp${j}_${dept}@example.com`,
            password: generatePassword(),
            role: "employee",
            empid: empidCounter++,
            dept: dept,
            dateOfJoining: new Date(),
            reportingTo: gh._id,
          });
          await emp.save();
          console.log(`Created Employee ${j} for ${dept}`);
        } catch (e) {
          console.error(`Error creating employee ${j} for ${dept}:`, e.message);
        }
      }
    }

    console.log("Seeding done. Total users:", empidCounter - 1);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
