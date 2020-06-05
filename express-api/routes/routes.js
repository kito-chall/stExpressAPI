const express = require("express");
const router = express.Router();
const Joi = require("joi");

const drills = [
  {id: 1, name: "Programing"},
  {id: 2, name: "English"},
  {id: 3, name: "Science"},
]

router.get("/", (req, res) => {
  res.send(drills);
});

router.post("/", (req, res) => {
  // validation
  let {error} = validate(req.body);
  if (error) {
    res.send(error.details[0].message);
  }
  let drill = {
    id: drills.length + 1,
    name: req.body.name
  };
  drills.push(drill);
  res.send(drills);
});


router.get("/:id", (req, res) => {
  let drill = getDrill(req.params.id);
  if(!drill) {
    res.send("該当のIDのドリルが見つかりません")
  };
  res.send(drill);
});


router.put("/:id", (req, res) => {
  // id Check
  let drill = getDrill(req.params.id);
  if(!drill) {
    res.send("該当のIDのドリルが見つかりません")
  };

  // validation
  let {error} = validate(req.body);
  if (error) {
    res.send(error.details[0].message);
  }

  // update
  let idx = drills.indexOf(drill);
  drills[idx].name = req.body.name;

  res.send(drills);
});


router.delete("/:id", (req, res) => {
  // id Check
  let drill = getDrill(req.params.id);
  if(!drill) {
    res.send("該当のIDのドリルが見つかりません")
  };

  // delete
  let idx = drills.indexOf(drill);
  drills.splice(idx, 1);

  res.send(drills);
});


function getDrill(id) {
  return drills.find(e => e.id === parseInt(id));
}


function validate(drill) {
  const schema = {
    name: Joi.string().min(3).required()
  };
  return result = Joi.validate(drill, schema);
}


module.exports = router;