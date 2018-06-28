class Ingredient < ApplicationRecord
  has_many :ingredient_amounts
  has_many :recipes, through: :ingredient_amounts

  scope :for, -> (recipe_id) {
    joins(:ingredient_amounts).
    where(ingredient_amounts: {recipe_id: recipe_id})
  }
end
