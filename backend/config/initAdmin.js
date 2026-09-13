const Admin = require("../models/admin.model");

/**
 * Synchronize the administrator credentials defined in .env into MongoDB Atlas.
 * The password will be automatically hashed with bcrypt before saving.
 * No credentials are hardcoded in any file.
 */
const initAdminAccount = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : null;
    const adminPassword = process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.trim() : null;

    if (!adminEmail || !adminPassword) {
      console.warn("⚠️  ADMIN_EMAIL or ADMIN_PASSWORD is not set in .env. Admin login will be disabled until set.");
      return;
    }

    // Check if admin user already exists in MongoDB
    let existingAdmin = await Admin.findOne({ email: adminEmail });

    if (!existingAdmin) {
      // Create new Admin record with bcrypt password hashing
      existingAdmin = new Admin({
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      await existingAdmin.save();
      console.log(`🔐 Admin account synced to MongoDB Atlas: ${adminEmail} (password securely hashed with bcrypt)`);
    } else {
      // Check if the password in .env has changed
      const isMatch = await existingAdmin.isPasswordCorrect(adminPassword);
      if (!isMatch) {
        existingAdmin.password = adminPassword; // Pre-save hook will hash the new password
        await existingAdmin.save();
        console.log(`🔄 Admin password updated in MongoDB Atlas for: ${adminEmail}`);
      }
    }
  } catch (error) {
    console.error("❌ Error initializing admin account in MongoDB:", error.message);
  }
};

module.exports = initAdminAccount;
