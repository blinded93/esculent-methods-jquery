users = [
  {username:"amanril", email:"amanril@telle.us"},
  {username:"bellerli", email:"bellerli@userset.ta"},
  {username:"jadencegeli", email:"jadencegeli@yesterday.to"},
  {username:"berderth", email:"berderth@blanks.for"},
  {username:"dudeuout", email:"dudeuout@junior.fr"},
  {username:"finalider", email:"finalider@theend.co"},
  {username:"linkbiz", email:"linkbiz@justtryit.it"},
  {username:"pridenow", email:"pridenow@rubystar.com"}
]

users.each do |user|
  User.find_or_create_by(username:user[:username]).tap do |u|
    unless u.id
      u.email = user[:email]
      u.password = "pw"
      u.save
    end
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
#   Ingredient.find_or_create_by(name:ingredient)
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
      "Crank your oven to 400 degrees F. Grab a large baking sheet and coat it with a little cooking spray.",
      "Heat up the oil in a large saute pan over medium heat and throw in the onion. Cook until the onion starts to brown, about 5 minutes. Add the chili powder, cumin, salt and garlic and cook for another 30 seconds and then turn off the heat.",
      "Throw the beans, chiles and lime juice together in a big-ass bowl. Mash them up using a potato masher or a spoon until a paste forms. It's cool if there are some whole beans left here and there; you don't need to spend the whole goddamn day mashing. Fold in the sauteed onions and corn and stir that motherfucker up. Your filling is ready.",
      "Using a griddle, your oven or the microwave, warm up the tortillas. Grab about 2 heaping tablespoons of the filling and spread that shit in a nice line toward the edge of the left side of one of the tortillas from top to bottom. Then roll that shit up nice and tight from left to right. You could even put a small smear of beans toward the other end of the tortilla to help that fucker stay shut. Place the flauta seam side down on the baking sheet about an inch or two away from it's flauta brethren. Make sure the filling got all the way to the ends and then adjust how you distribute the filling the next time. Damn. Keep going until you run out of tortillas or filling.",
      "Lightly coat them all with cooking spray and bake for 10 minutes.When you pull them out, the bottoms should be golden brown-if not, stick them in for another couple minutes. When the bottoms look good, turn them over and bake those bitches until golden and crispy on both sides, another 5.7 minutes. Serve warm topped with lettuce and salsa if you want to impress some motherfuckers."
    ]
  }, {
    ingredient_amounts: [ {
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
        quantity:12,
        name:"Flour Tortilla"
      }
    ]
  }, {
  name:"Seeded Miso Sweet Potato Bread",
  cook_time:60,
  prep_time:25,
  servings:4,
  skill_level:"Average",
  directions:[
    "Preheat oven to 350°F. Brush an 8½-by-4½-inch loaf pan with 1 teaspoon of the oil. Whisk flour, baking powder, cinnamon, and salt in a bowl and set aside.",
    "Whisk maple syrup, miso, and vanilla in a large bowl. Whisk in eggs and ½ cup of the oil until well combined; fold in sweet potato. Gradually add flour mixture, stirring until just combined. Transfer batter to the prepared pan.", 
    "Toss pepitas with remaining ½ teaspoon oil in a small bowl and sprinkle over batter in pan. Bake until a skewer inserted in the center of loaf comes out clean, 55 to 60 minutes. Let cool in pan, about 30 minutes. Remove bread from pan and transfer to a wire rack. Let cool completely before slicing. Store tightly wrapped at room temperature for up to 5 days."
  ]
}, {
  ingredient_amounts: [ {
      unit:"cups",
      quantity:0.5,
      name:"Olive Oil"
    }, {
      unit:"cups",
      quantity:1.5,
      name:"Flour"
    }, {
      unit:"tsp",
      quantity:1,
      name:"Baking Powder"
    }, {
      unit:"tsp",
      quantity:1,
      state:"ground",
      name:"Cinnamon"
    }, {
      unit:"tsp",
      quantity:0.5,
      name:"Salt"
    }, {
      unit:"cup",
      quantity:0.5,
      name:"Maple Syrup"
    }, {
      unit:"tbsp",
      quantity:2,
      name:"White Miso Paste"
    }, {
      unit:"tbsp",
      quantity:1,
      name:"Vanilla Extract"
    }, {
      quantity:2,
      name:"Eggs"
    }, {
      unit:"cups",
      quantity:1.5,
      state:"chopped",
      name:"Sweet Potato"
    }, {
      unit:"cup",
      quantity:0.5,
      state:"chopped",
      name:"Pumpkin Seeds"
    }
  ]
}, {
  name:"Buckwheat, Almond, and Coconut Granola",
  cook_time:50,
  prep_time:10,
  servings:5,
  skill_level:"Easy",
  directions:[
    "Preheat oven to 325°F. Stir together buckwheat, oats, almonds, maple syrup, olive oil, coconut oil, vanilla, fennel seeds, and salt in a large bowl. Spread in an even layer on a baking sheet. Bake until golden, about 20 minutes. Remove from oven and stir in flaked coconut. Return to oven and bake until deeply golden, 10 to 15 minutes. Let cool. Store in an airtight container at room temperature for up to 1 month.",
  ]
}, {
  ingredient_amounts: [ 
    {
      unit:"cups",
      quantity:1.5,
      name:"Buckwheat Groats"
    }, {
      unit:"cups",
      quantity:1.5,
      name:"Rolled Oats"
    }, {
      unit:"cups",
      quantity:1,
      state:"sliced",
      name:"Almonds"
    }, {
      unit:"tbsp",
      quantity:3,
      name:"Maple Syrup"
    }, {
      unit:"tbsp",
      quantity:2,
      name:"Olive Oil"
    }, {
      unit:"tbsp",
      quantity:1,
      name:"Coconut Oil"
    }, {
      unit:"tsp",
      quantity:2,
      name:"Vanilla Extract"
    }, {
      unit:"tsp",
      quantity:1,
      name:"Fennel Seeds"
    }, {
      unit:"tsp",
      quantity:0.5,
      name:"Salt"
    }, {
      unit:"cups",
      quantity:1,
      state:"chopped",
      name:"Coconut"
    }
  ]
}, {
  name:"Smørrebrød With Yogurt, Beets, and Eggs",
  cook_time:0,
  prep_time:25,
  servings:4,
  skill_level:"Easy",
  directions:[
    "Bring a large pot of water to a boil. Gently lower eggs into pot and cook, 7 minutes. Drain and rinse eggs under cold water until cool to the touch. Peel eggs; set aside.",
    "While eggs cook, toss together beet slices, chopped dill, oil, vinegar, and ¼ teaspoon of the salt in a medium bowl. In a separate small bowl, stir together yogurt, garlic, several grinds of black pepper, and remaining ¼ teaspoon salt.",
    "Divide yogurt mixture among bread slices, spreading to edges. Top with marinated beets. Gently tear eggs into quarters and place on top of beets along with capers, dill, flaky salt, and several grinds of black pepper. Drizzle with olive oil and serve immediately."

  ]
}, {
  ingredient_amounts: [ 
    {
      quantity:4,
      name:"Eggs"
    }, {
      unit:"cups",
      quantity:1,
      state:"sliced",
      name:"Beets"
    }, {
      unit:"tbsp",
      quantity:1,
      state:"chopped",
      name:"Fresh Dill"
    }, {
      unit:"tsp",
      quantity:1,
      name:"Olive Oil"
    }, {
      unit:"tsp",
      quantity:1,
      name:"Vinegar"
    }, {
      unit:"tsp",
      quantity:0.5,
      name:"Salt"
    }, {
      unit:"cup",
      quantity:1,
      name:"Greek Yogurt"
    }, {
      unit:"tbsp",
      quantity:1,
      state:"grated",
      name:"Garlic"
    }, {
      unit:"tsp",
      quantity:0.25,
      state:"ground",
      name:"Black Pepper"
    }, {
      unit:"tbsp",
      quantity:2,
      name:"Capers"
    }
  ]
}, {
  name:"Savory Cornmeal-Chia Waffles With Spicy Maple Syrup",
  cook_time:15,
  prep_time:15,
  servings:4,
  skill_level:"Easy",
  directions:[
    "Preheat oven to 200°F. Preheat a waffle iron according to manufacturer’s instructions. Stir together chia seeds and 5 tablespoons water in a small bowl. Set aside to thicken, about 5 minutes.",
    "Meanwhile, whisk cornmeal, flour, baking powder, baking soda, and salt in a bowl.",
    "Whisk yogurt, oil, chia mixture, and 1 cup water in a large bowl. Add cornmeal mixture and stir until just combined.",
    "Lightly coat preheated waffle iron with oil. Spoon about ½ cup batter per square waffle onto hot waffle iron. Close lid and cook until golden and crisp, 3 to 4 minutes. Remove waffles from iron and transfer to a wire rack set inside a rimmed baking sheet; place in oven to keep warm. Repeat with remaining batter, brushing iron with oil as needed. (You should be able to make about 8 waffles total.) Waffles can be cooled completely and frozen for up to 1 month. Defrost in the toaster.",
    "Drizzle maple syrup over warm waffles and top with a pinch of crushed red pepper."
  ]
}, {
  ingredient_amounts: [ 
    {
      unit:"tbsp",
      quantity:2,
      name:"Chia Seeds"
    }, {
      unit:"cup",
      quantity:0.5,
      state:"ground",
      name:"Cornmeal"
    }, {
      unit:"cup",
      quantity:1,
      name:"Flour"
    }, {
      unit:"tsp",
      quantity:1.5,
      name:"Baking Powder"
    }, {
      unit:"tsp",
      quantity:1.25,
      name:"Baking Soda"
    }, {
      unit:"tsp",
      quantity:1.25,
      name:"Salt"
    }, {
      unit:"cup",
      quantity:1,
      name:"Greek Yogurt"
    }, {
      unit:"tbsp",
      quantity:2,
      name:"Olive Oil"
    }
  ]
}, {
    name:"Loaded Sweet Potatoes With Coconut and Kale",
    cook_time:45,
    prep_time:15,
    servings:4,
    skill_level:"Average",
    directions:[
      "Prick sweet potatoes all over with a fork; place in a microwavable dish and cover with plastic wrap. Microwave on high for 5 minutes. Turn sweet potatoes over; microwave until tender, about 5 minutes more.",
      "Meanwhile, heat oil in a large skillet over medium-high. Add kale and chile and cook, stirring often, until slightly wilted, about 3 minutes. Stir in coconut milk and bring to a boil. Reduce heat to low and cook, stirring occasionally, until kale is tender and creamy, about 6 minutes. Remove from heat; stir in lime juice, curry powder, and ½ teaspoon of the salt.",
      "Cut sweet potatoes in half lengthwise; carefully scoop flesh into a large bowl, leaving shells intact. Mash together sweet potato flesh, grapefruit juice, butter, allspice, and remaining ½ teaspoon salt until smooth. Spoon mixture into potato skins and top with kale and coconut."    
    ]
}, {
  ingredient_amounts: [ {
      quantity:4,
      name:"Sweet Potato"
    }, {
      unit:"tbsp",
      quantity:2,
      name:"Olive Oil"
    }, {
      unit:"cup",
      quantity:2,
      state:"chopped",
      name:"Kale"
    }, {
      quantity:1,
      state:"chopped",
      name:"Serrano Chile"
    }, {
      unit:"cup",
      quantity:1.5,
      name:"Coconut Milk"
    }, {
      unit:"tsp",
      quantity:2,
      name:"Lime Juice"
    }, {
      unit:"tsp",
      quantity:1.5,
      name:"Curry Powder"
    }, {
      unit:"tsp",
      quantity:1,
      name:"Salt"
    }, {
      unit:"cup",
      quantity:0.5,
      name:"Grapefruit Juice"
    }, {
      unit:"tbsp",
      quantity:3,
      name:"Butter"
    }, {
      unit:"tsp",
      quantity:0.1,
      state:"ground",
      name:"Allspice"
    }, {
      unit:"cup",
      quantity:1,
      name:"Cocount Flakes"
    }
  ]
}, {
    name:"Moroccan-Spiced Fish",
    cook_time:25,
    prep_time:15,
    servings:4,
    skill_level:"Easy",
    directions:[
      "Preheat oven to 425°F. Toss carrots, potatoes, lemon, pepper, 2 tablespoons of the oil, and 1 teaspoon of the salt on a rimmed baking sheet; arrange in a single layer. Roast until potatoes are almost tender, 15 to 20 minutes.",
      "Meanwhile, stir together cumin, coriander, allspice, and remaining 1 tablespoon oil in a small bowl. Rub the mixture evenly over cod and season with remaining ¼ teaspoon salt.",
      "Remove baking sheet from oven and increase heat to broil. Nestle cod fillets among vegetables and return to oven. Broil on top rack until fish is just cooked through and vegetables are tender, 6 to 8 minutes. Top with parsley."
    ]
}, {
  ingredient_amounts: [ {
      quantity:12,
      name:"carrots"
    }, {
      unit:"oz",
      quantity:24,
      state:"chopped",
      name:"Fingerling Potatoes"
    }, {
      quantity:1,
      state:"sliced",
      name:"Lemon"
    }, {
      unit:"tsp",
      quantity:0.5,
      state:"ground",
      name:"Black Pepper"
    }, {
      unit:"tbsp",
      quantity:3,
      name:"Olive Oil"
    }, {
      unit:"tsp",
      quantity:1.25,
      name:"Salt"
    }, {
      unit:"tsp",
      quantity:0.5,
      state:"ground",
      name:"Cumin"
    }, {
      unit:"tsp",
      quantity:0.5,
      state:"ground",
      name:"Coriander"
    }, {
      unit:"tsp",
      quantity:"0.25",
      state:"ground",
      name:"Allspice"
    }, {
      quantity:4,
      name:"Cod Fillet"
    }, {
      unit:"tbsp",
      quantity:3,
      state:"chopped",
      name:"Parsley"
    }
  ]
}, {
    name:"Chicken Adobo",
    cook_time:20,
    prep_time:30,
    servings:4,
    skill_level:"Average",
    directions:[
      "Heat oil in a large skillet over medium-high. Season chicken with ¼ teaspoon of the salt. Add chicken to skillet and cook, turning occasionally, until browned, 8 to 10 minutes. Transfer chicken to a plate; reserve drippings in the skillet.",
      "Add onion and garlic and cook, stirring occasionally, until softened, about 5 minutes. Stir in stock, vinegar, tamari, orange zest and juice, half of the pineapple, and remaining ¼ teaspoon salt.",
      "Bring mixture to a boil. Return chicken to skillet and reduce heat to medium; simmer until chicken is cooked through and sauce is thickened, about 6 minutes.",
      "Serve over rice; top with remaining pineapple and cilantro."
    ]
}, {
  ingredient_amounts: [ {
      unit:"tbsp",
      quantity:2,
      name:"Canola Oil"
    }, {
      quantity:4,
      name:"Chicken Thighs"
    }, {
      unit:"tsp",
      quantity:0.5,
      name:"Salt"
    }, {
      quantity:1,
      state:"chopped",
      name:"Onion"
    }, {
      unit:"tbsp",
      quantity:3,
      state:"chopped",
      name:"Garlic"
    }, {
      unit:"cup",
      quantity:0.5,
      name:"Chicken Stock"
    }, {
      unit:"cup",
      quantity:0.25,
      name:"White Wine Vinegar"
    }, {
      unit:"tbsp",
      quantity:2,
      name:"Tamari"
    }, {
      unit:"cup",
      quantity:0.25,
      name:"Orange Juice"
    }, {
      unit:"cup",
      quantity:1,
      name:"Pineapple"
    }, {
      unit:"cup",
      quantity:0.25,
      state:"chopped",
      name:"Cilantro"
    }, {
      unit:"cup",
      quantity:2,
      name:"Rice"
    }
  ]
}, {
    name:"Tropical Creamsicle Smoothie",
    cook_time:0,
    prep_time:5,
    servings:2,
    skill_level:"Easy",
    directions:[
      "Place mango, carrots, vinegar, lime juice, honey, and 1 cup water in a blender.",
      "Blend until smooth, about 1 minute, stopping to scrape down sides as needed. Divide coconut milk between 2 glasses and top with smoothie."
    ]
}, {
  ingredient_amounts: [ {
      unit:"cup",
      quantity:2,
      name:"Mango"
    }, {
      quantity:12,
      state:"chopped",
      name:"Carrots"
    }, {
      unit:"tbsp",
      quantity:2,
      name:"Apple Cider Vinegar"
    }, {
      unit:"tsp",
      quantity:2,
      name:"Lime Juice"
    }, {
      unit:"tsp",
      quantity:2,
      name:"Raw Honey"
    }, {
      unit:"cup",
      quantity:1.5,
      name:"Coconut Milk"
    }
  ]
}, {
    name:"Creamy Polenta With Sausage and Chard",
    cook_time:20,
    prep_time:20,
    servings:4,
    skill_level:"Average",
    directions:[
      "Melt 1 tablespoon of the butter in a large skillet over medium-high until foamy. Add sausage and cook, turning occasionally, until browned, 5 to 7 minutes. Transfer to a plate, reserving drippings.",
      "Add chard to skillet and cook, stirring, until wilted, about 2 minutes. Return sausage to skillet and add vinegar, thyme, crushed red pepper, and ¼ cup of the stock. Cook, stirring occasionally, until sausage is cooked through and chard is tender and coated in sauce, 6 to 8 minutes.",
      "Meanwhile, bring 4 cups water to a boil in a medium saucepan. Whisk in polenta. Reduce heat to low and simmer, whisking, until thickened, 3 to 4 minutes. Remove from heat and stir in salt, remaining ½ cup stock, and 2 tablespoons butter. Serve polenta topped with sausage, chard, and sauce."
    ]
}, {
  ingredient_amounts: [ {
      unit:"tbsp",
      quantity:4,
      name:"Butter"
    }, {
      unit:"oz",
      quantity:12,
      name:"Italian Sausage"
    }, {
      unit:"cup",
      quantity:1.5,
      state:"chopped",
      name:"Swiss Chard"
    }, {
      unit:"tbsp",
      quantity:2,
      name:"Balsamic Vinegar"
    }, {
      unit:"tbsp",
      quantity:1,
      name:"Thyme"
    }, {
      unit:"tsp",
      quantity:0.25,
      name:"Red Pepper Flakes"
    }, {
      unit:"cup",
      quantity:0.75,
      name:"Chicken Stock"
    }, {
      unit:"cup",
      quantity:1,
      name:"Polenta"
    }, {
      unit:"tsp",
      quantity:0.75,
      name:"Salt"
    }
  ]
}, {
    name:"Tapenade and Red Onion Pizza",
    cook_time:20,
    prep_time:15,
    servings:4,
    skill_level:"Easy",
    directions:[
      "Preheat oven to 450°F with rack in lowest position. Roll dough to a 14-inch wide oval on a floured surface and transfer to a lightly oiled baking sheet; prick dough all over with a fork. Bake on bottom rack until dough begins to turn golden brown, 8 to 10 minutes.",
      "Meanwhile, heat 1 tablespoon oil in a large skillet over medium-high. Add onions and cook, stirring occasionally, until softened, about 8 minutes. Remove from heat; stir in vinegar and pepper.",
      "Scatter onions, mozzarella, and garlic over crust, leaving a 1-inch border. Return to oven and bake until cheese is melted and crust is brown, 8 to 10 minutes. Spoon tapenade evenly over pizza and sprinkle with basil."
    ]
}, {
  ingredient_amounts: [ {
      unit:"oz",
      quantity:16,
      name:"Pizza Dough"
    }, {
      unit:"tbsp",
      quantity:3,
      name:"Flour"
    }, {
      unit:"tbsp",
      quantity:2,
      name:"Olive Oil"
    }, {
      quantity:2,
      state:"sliced",
      name:"Red Onions"
    }, {
      unit:"tbsp",
      quantity:2,
      name:"Red Wine Vinegar"
    }, {
      unit:"tsp",
      quantity:0.5,
      state:"ground",
      name:"Black Pepper"
    }, {
      unit:"cup",
      quantity:2,
      state:"shredded",
      name:"Mozzarella Cheese"
    }, {
      unit:"tbsp",
      quantity:2,
      state:"chopped",
      name:"Garlic"
    }, {
      unit:"tbsp",
      quantity:3,
      name:"Olive Tapenade"
    }, {
      unit:"cup",
      quantity:0.25,
      name:"Basil"
    }
  ]
}
]


def seed_database
  recipe = nil

  RECIPES.each do |attrs|
    user = User.all.sample

    if attrs[:name]
      recipe = user.recipes.find_or_create_by(attrs)
    elsif attrs[:ingredient_amounts]
      attrs[:ingredient_amounts].each do |i|
        ia = recipe.ingredient_amounts.build
        ia.unit = i[:unit]
        ia.quantity = i[:quantity]
        ia.state = i[:state]
        ia.ingredient = Ingredient.find_or_create_by(name:i[:name].downcase)
        recipe.save
      end
    end
  end
end
seed_database
