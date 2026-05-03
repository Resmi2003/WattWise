const appliances = require('../model/applianceModel')


// ADD APPLIANCE
exports.addApplianceController = async (req, res) => {
    console.log("inside add appliance");

    const { name, power } = req.body

    try {

        const newAppliance = await appliances.create({
            name,
            power,
            userId: req.payload
        })

        res.status(200).json(newAppliance)

    } catch (err) {
        console.log(err);
        res.status(500).json("Failed to add appliance")
    }
}


// GET APPLIANCES
exports.getApplianceController = async (req, res) => {
    console.log("inside get appliances");

    try {

        const allAppliances = await appliances.find({
            userId: req.payload
        })

        res.status(200).json(allAppliances)

    } catch (err) {
        console.log(err);
        res.status(500).json("Failed to fetch appliances")
    }
}


// DELETE APPLIANCE
exports.deleteApplianceController = async (req, res) => {
    console.log("inside delete appliance");

    const { id } = req.params

    try {

        const deleted = await appliances.findOneAndDelete({
            _id: id,
            userId: req.payload
        })

        if (!deleted) {
            return res.status(404).json("Appliance not found")
        }

        res.status(200).json("Deleted successfully")

    } catch (err) {
        console.log(err);
        res.status(500).json("Delete failed")
    }
}


// UPDATE APPLIANCE
exports.updateApplianceController = async (req, res) => {
    console.log("inside update appliance");

    const { id } = req.params
    const { name, power } = req.body

    try {

        const updated = await appliances.findOneAndUpdate(
            { _id: id, userId: req.payload },
            { name, power },
            { new: true }
        )

        if (!updated) {
            return res.status(404).json("Appliance not found")
        }

        res.status(200).json(updated)

    } catch (err) {
        console.log(err);
        res.status(500).json("Update failed")
    }
}