class Ingredient < ApplicationRecord
  has_many :ingredient_amounts
  has_many :recipes, through: :ingredient_amount
end
