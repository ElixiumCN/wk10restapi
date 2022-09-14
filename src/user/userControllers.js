const User = require("./userModel");

exports.addUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    const token = newUser.generateAuthToken();
    console.log(token);
    res.status(200).send({ user: newUser.username, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
      const listUsers = await User.find({});
      const usernames = listUsers.map((users) => {
          return users
      })
      res.status(200).send({users: usernames})
  } catch (error) {
      console.log(error)
      res.status(500).send({ error: error.message });
  }
}  


exports.login = async (req, res) => {
  try {
    if (req.user) {
      res.status(200).send({ user: req.user.username });
    } else {
      const user = await User.findByCredentials(
        req.body.username,
        req.body.password
      );
      res.status(200).send({ username: user.username });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $set: { [req.body.key]: req.body.value },
      });
      const user = await User.findById(req.user._id);
      res.status(200).send({ user: user.username });
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user) {
      await User.findByIdAndDelete(req.user._id);
      res.status(200).send({ message: "Successfully deleted user" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};


// new code

exports.passwordEdit = async (req, res) => {
  try{
      if(req.user) {
          await Users.findByIdAndUpdate({_id : req.user._id} ,{ $set : {password: req.body.password} })
          res.status(200).send(await Users.find({password: req.body.password}))
      } 
  } catch (error) {
          res.status(400).send(console.log("Failed to update items"))
          console.log(error)
  }
}

// 

exports.userDelete = async (req, res) => {
  try {
      if (req.user) {
      await Users.findByIdAndDelete({ _id : req.user._id })
      res.status(200).send("Account deleted")
      } else {
          console.log("Please log in")
          res.status(400).send({error: "request failed, please log in"})
      }
  } catch (error) {
      console.log("error in userDeleteOne")
      res.status(500).send({error:"internal server error"})
      console.log(error)
  }
}

//

exports.tokenCheck = async (req, res, next) => {
  try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await Users.findOne({ _id: decoded._id });
      if (!user) {
          throw new Error("User does not exist")
      }
      req.user = user
      next()
  } catch (error) {
      res.status(500).send({ error: "Please log in" })
  }
}