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
  }, {
    name: "Sweet Corn and Green Chile Baked Flautas",
    cook_time:25,
    prep_time:10,
    servings:12,
    skill_level:"Easy",
    directions:[
      "Crank your oven to 400 degrees F. Grab a large baking sheet and coat it with a little cooking spray.", "Heat up the oil in a large saute pan over medium heat and throw in the onion. Cook until the onion starts to brown, about 5 minutes. Add the chili powder, cumin, salt and garlic and cook for another 30 seconds and then turn off the heat.", "Throw the beans, chiles and lime juice together in a big-ass bowl. Mash them up using a potato masher or a spoon until a paste forms. It's cool if there are some whole beans left here and there; you don't need to spend the whole goddamn day mashing. Fold in the sauteed onions and corn and stir that motherfucker up. Your filling is ready.", "Using a griddle, your oven or the microwave, warm up the tortillas. Grab about 2 heaping tablespoons of the filling and spread that shit in a nice line toward the edge of the left side of one of the tortillas from top to bottom. Then roll that shit up nice and tight from left to right. You could even put a small smear of beans toward the other end of the tortilla to help that fucker stay shut. Place the flauta seam side down on the baking sheet about an inch or two away from it's flauta brethren. Make sure the filling got all the way to the ends and then adjust how you distribute the filling the next time. Damn. Keep going until you run out of tortillas or filling.", "Lightly coat them all with cooking spray and bake for 10 minutes.When you pull them out, the bottoms should be golden brown-if not, stick them in for another couple minutes. When the bottoms look good, turn them over and bake those bitches until golden and crispy on both sides, another 5.7 minutes. Serve warm topped with lettuce and salsa if you want to impress some motherfuckers."
    ]
  }, {
    ingredient_amounts = [ {
        unit:"tsp",
        quantity:1,
        name:"Olive Oil"
      }, {
        unit:"cup",
        quantity:1,
        state:"chopped",
        name:"Onion"
      }, {
        unit:"tsp",
        quantity:2,
        name:"Chili Powder"
      }, {
        unit:"tsp",
        quantity:0.75,
        state:"ground",
        name:"Cumin"
      }, {
        unit:"tsp",
        quantity:0.5,
        name:"Salt"
      }, {
        unit:"tbsp",
        quantity:2,
        state:"chopped",
        name:"Garlic"
      }, {
        unit:"cups",
        quantity:3,
        state:"cooked",
        name:"Pinto Beans"
      }, {
        unit:"ounces",
        quantity:4,
        name:"Green Chile"
      }, {
        unit:"tbsp",
        quantity:1,
        name:"Lime Juice"
      }, {
        unit:"cup",
        quantity:1,
        name:"Sweet Corn"
      }, {
        unit:"",
        quantity:12,
        name:"Flour Tortilla"
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
