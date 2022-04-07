const { restaurants } = require("../config/mongoCollections");
const connection = require("../config/mongoConnection");
const ObjectId = require("mongodb").ObjectId;

const getAllRestaurants = async () => {
  const restaurantsCollection = await restaurants();
  const allRestaurants = await restaurantsCollection.find({}).toArray();

  return allRestaurants;
};

const getRestaurantById = async (id) => {
  if (!id) throw "Must enter id";
  if (id.trim().length == 0) throw "Must enter id";
  let newId = ObjectId(id);
  if (!ObjectId.isValid(newId)) throw "Must enter valid ObjectId";

  const restaurantsCollection = await restaurants();
  let restaurant = null;
  try {
    restaurant = await restaurantsCollection.findOne({ _id: newId });
  } catch (e) {
    throw e;
  }

  if (restaurant == null) throw `No restaurant available with id ${id}`;

  return restaurant;
};

//This will update a restaurant page with a new comment and returns the updated json
const addComment = async (id, comment) =>{
  if (!id){
    throw 'Must enter id';
  }
  //ids must be passed as a string for this to work, might change it later.
  if (typeof id != 'string'){
    throw 'The id must be a string';
  }
  if (id.trim().length === 0){
    throw 'The id cannot be empty spaces';
  }
  if (!comment){
    throw 'Comment must not be empty';
  }
  //Comments must be strings to be passed in, could probably be updated to change all comments to strings
  if (typeof comment != 'string'){
    throw 'Comment must be a string';
  }

  let usableId = ObjectId(id);
  if (!ObjectId.isValid(usableId)){
    throw 'Must enter valid ObjectId';
  }
  //Find restaurant using id, get existing comments
  const restaurantCollection = await restaurants();
  let foundRestaurant;
  try{
    foundRestaurant = await getRestaurantById(id);
  }
  catch(e){
    throw e;
  }
  //add new comment to existing comments
  let newComments = foundRestaurant.comments;
  newComments.push(comment)
  let updateInfo;
  try{
    updateInfo = await restaurantCollection.updateOne(
      {_id: usableId},
      {$set: {comments: newComments}});
  }
  catch(e){
    throw e;
  }

  if (updateInfo.modifiedCount === 0){
    throw 'Restaurant with id ${id} failed to update comments.';
  }

  //get updated restaurant to return
  let result;
  try{
    result = await getBarById(id);
  }
  catch(e){
    throw e;
  }
  return result;
}

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  addComment,
};
