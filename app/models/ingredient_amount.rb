class IngredientAmount < ApplicationRecord
  belongs_to :ingredient
  belongs_to :recipe

  scope :for, -> (recipe) { where(recipe_id: recipe.id) }
  scope :for_id, -> (recipe_id) { where(recipe_id: recipe_id) }
end
