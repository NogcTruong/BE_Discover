const UserRequire = require("../models/userRequireModel");
const Destination = require("../models/Destination");

const PlanController = {
  async createPlan(req, res) {
    try {
      const userRequireId = req.params.id; // ID của UserRequire được truyền qua params
      const userRequire = await UserRequire.findById(userRequireId).populate(
        "userId"
      );

      if (!userRequire) {
        return res.status(404).json({ message: "UserRequire not found" });
      }

      console.log("UserRequire data:", userRequire);

      const { totalDay, budget } = userRequire;
      // console.log("Category:", category);
      const categories = ["Núi", "Biển", "Khu vui chơi/Nghỉ dưỡng"]; // Định nghĩa categories ở đây
      console.log("Categories:", categories);

      const totalTrips = totalDay * 3;
      console.log("TotalTrips:", totalTrips);

      // const destinations = await Destination.find({
      //   category: { $in: category },
      // });

      // if (destinations.length === 0) {
      //   return res.status(404).json({
      //     message: "No destinations found for the selected Category",
      //   });
      // }

      // let selectedTrips = [];
      // let totalCost = 0;
      // let attempts = 0;
      // const maxAttempts = 100;

      // while (selectedTrips.length < totalTrips && attempts < maxAttempts) {
      //   const randomIndex = Math.floor(Math.random() * destinations.length);
      //   const selectedDestination = destinations[randomIndex];

      //   if (totalCost + selectedDestination.price <= budget + 1000) {
      //     selectedTrips.push(selectedDestination);
      //     totalCost += selectedDestination.price;
      //   }

      //   attempts++;
      // }

      let selectedTrips = [];
      let totalCost = 0;
      let attempts = 0;
      const maxAttempts = 100;

      for (let day = 0; day < totalDay; day++) {
        for (let timeSlot = 0; timeSlot < categories.length; timeSlot++) {
          const category = categories[timeSlot];
          const destinations = await Destination.find({ category });

          if (destinations.length === 0) {
            return res.status(404).json({
              message: `No destinations found for the category: ${category}`,
            });
          }

          let foundTrip = false;

          while (attempts < maxAttempts) {
            const randomIndex = Math.floor(Math.random() * destinations.length);
            const selectedDestination = destinations[randomIndex];

            console.log("Current Total Cost:", totalCost);
            console.log(
              "Selected Destination Price:",
              selectedDestination.price
            );

            if (totalCost + selectedDestination.price <= budget + 1000) {
              selectedTrips.push(selectedDestination);
              totalCost += selectedDestination.price;
              foundTrip = true;
              break; // Thoát khỏi vòng lặp nếu đã tìm được chuyến đi
            }

            attempts++;
          }

          if (!foundTrip) {
            return res.status(400).json({
              message: "Not enough budget for any trips",
              currentTotalCost: totalCost,
              budget: budget,
              maxAffordablePrice: budget + 1000 - totalCost, // Giá tối đa có thể chi cho chuyến đi tiếp theo
            });
          }
        }
      }

      console.log("SelectedTrips:", selectedTrips);
      console.log("TotalCost:", totalCost);

      // if (selectedTrips.length === 0) {
      //   return res
      //     .status(400)
      //     .json({ message: "Not enough budget for any trips" });
      // }

      res.status(200).json({
        type: "success",
        totalCost,
        selectedTrips,
      });
    } catch (error) {
      console.error("Error creating plan:", error);
      res.status(500).json({
        type: "error",
        message: "An error occurred while creating the plan.",
        error: error.message,
      });
    }
  },
};

module.exports = PlanController;
