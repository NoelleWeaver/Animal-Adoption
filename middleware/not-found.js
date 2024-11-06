const notFound = (req, res)=> res.status(404).send("You Lost: Route Does not Exist");
module.exports = notFound