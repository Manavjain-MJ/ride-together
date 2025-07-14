const RideModel = require("../models/RideModel");
const userProfileModel = require("../models/UserProfileModel");

const createProfilesForExistingUsers = async () => {
  try {
    const users = await RideModel.find();
    for (const user of users) {
      const profileExists = await userProfileModel.findOne({
        userId: user._id,
      });
      if (!profileExists) {
        await userProfileModel.create({
          userId: user._id,
        });
        console.log(`✅ Profile created for user: ${user.email}`);
      }
    }
    console.log("🎉 All missing profiles created!");
  } catch (err) {
    console.error("❌ Error creating profiles:", err);
  }
};

module.exports = createProfilesForExistingUsers;
