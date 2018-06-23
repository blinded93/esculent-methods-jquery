User.find_or_create_by(username:"blinded93").tap do |user|
  unless user.id
    user.email = "blinded93@gmail.com"
    user.password = "pw"
    user.save
  end
end
# ingredients = [
#   "Mushrooms",
#   "Garlic",
#   "Avocado Oil",
#   "Tamari Sauce",
#   "Green Onion",
#   "Ginger",
#   "Sesame Oil",
#   "Rice Vinegar",
#   "Sugar",
#   "Chili-Garlic Paste",
#   "Lime Juice",
#   "Peanuts",
#   "Lettuce Leaves",
#   "Cucumber",
#   "Carrot",
#   "Rice Paper Wrappers",
#   "Sweet Potato",
#   "Water",
#   "Chili Paste",
#   "Brown Rice",
#   "Arugula",
#   "Watercress",
#   "Green Peas",
#   "Couscous",
#   "Cinnamon",
#   "Paprika",
#   "Cumin",
#   "Olive Oil",
#   "Spinach",
#   "Broccoli",
#   "Millet",
#   "Black Pepper",
#   "Lemon Juice",
#   "Tomato",
#   "Jalapeno",
#   "Tomato Paste",
#   "Corn",
#   "Salt",
#   "Cilantro",
#   "Thyme",
#   "Red Pepper",
#   "Crushed Red Pepper",
#   "Almonts",
#   "Basil",
#   "Lemon Zest",
#   "Lasagna Noodles",
#   "Brown Sugar",
#   "Rice Noodles",
#   "Shallots",
#   "Tofu",
#   "Cabbage",
#   "Sprouts",
#   "Lime",
#   "Lemon",
#   "Chili Powder",
#   "Oregano",
#   "Sweet Potato",
#   "Squash"
# ]
#
# ingredients.each do |ingredient|
#   Ingredient.create(name:ingredient)
# end

RECIPES = [ {
    name:"Moroccan Spiced Couscous",
    cook_time:10,
    prep_time:10,
    servings:4,
    skill_level:"Easy",
    directions:[
      "Mix the couscous, salt and spices in a medium saucepot with a tight-fitting lid. Add the boiling water to the couscous mix without splashing it around and burning the fuck out of your hand. Stir everything up and quickly put on the lid. Let it rest for at least 8 minutes. The couscous should absorb all the water while you wait and it should be tender when you take off the lid. Easy shit.",
      "While your ass is waiting, mix together the olive oil and rice vinegar in a small glass. Chop up the spinach into thick ribbons.",
      "When the couscous is ready, stir it around with a fork to fluff it up, add the dressing to it and stir it up some more until it is mixed. Gently fold in the orange pieces and spinach. Season to your fucking taste. Serve cold or at room temperature."
    ]
  }, {
    ingredient_amounts: [ {
        unit:"cups",
        quantity:1.5,
        name:"Couscous"
      }, {
        unit:"tsp",
        quantity:0.25,
        name:"Salt"
      }, {
        unit:"tsp",
        quantity:0.5,
        state:"ground",
        name:"Cinnamon"
      }, {
        unit:"tsp",
        quantity:0.5,
        name:"Paprika"
      }, {
        unit:"tsp",
        quantity:0.25,
        state:"ground",
        name:"Cumin"
      }, {
        unit:"cups",
        quantity:1.5,
        state:"boiling",
        name:"Water"
      }, {
        unit:"tbsp",
        quantity:1.5,
        name:"Olive Oil"
      }, {
        unit:"tbsp",
        quantity:2.5,
        name:"Rice Vinegar"
      }, {
        unit:"cup",
        quantity:3,
        state:"chopped",
        name:"Spinach"
      }
    ]
  }
]

def create_recipe
  user = User.find_by(username:"blinded93")
  recipe = nil
  RECIPES.each do |attrs|
    if attrs[:name]
      recipe = user.recipes.find_or_create_by(attrs)
    elsif attrs[:ingredient_amounts]
      attrs[:ingredient_amounts].each do |i|
        ia = recipe.ingredient_amounts.build
        ia.unit = i[:unit]
        ia.quantity = i[:quantity]
        ia.state = i[:state]
        ia.ingredient = Ingredient.find_or_create_by(name:i[:name])
        recipe.save
      end
    end
  end
end
create_recipe
