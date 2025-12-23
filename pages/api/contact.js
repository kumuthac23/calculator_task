export default function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, phone, propertyValue, monthlySalary } = req.body;

    // Basic validation
    if (
      !name ||
      !email ||
      !phone ||
      propertyValue === undefined ||
      monthlySalary === undefined
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Missing required fields: name, email, phone, propertyValue, monthlySalary",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email format",
      });
    }

    // Validate phone (basic check: at least 10 digits)
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      return res.status(400).json({
        status: "error",
        message: "Phone number must have at least 10 digits",
      });
    }

    // Validate numeric fields
    if (isNaN(propertyValue) || isNaN(monthlySalary)) {
      return res.status(400).json({
        status: "error",
        message: "Property value and monthly salary must be numbers",
      });
    }

    // TODO: Save lead to database (e.g., MongoDB, PostgreSQL, or file)
    console.log("New lead received:", {
      name,
      email,
      phone,
      propertyValue,
      monthlySalary,
    });

    return res.status(200).json({
      status: "success",
      message: "Lead received",
    });
  } else {
    return res.status(405).json({
      status: "error",
      message: "Method not allowed. Use POST.",
    });
  }
}
