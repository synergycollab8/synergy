var router = express.Router();
const getAllContacts = require("../services/4_getAllContacts");
// GET /contacts
router.post('/', function (req, res) {
 res.status(200).send("received request at http://localhost:3000/businesses");
});
module.exports = {router};
