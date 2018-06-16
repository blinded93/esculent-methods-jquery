class Recipe < ApplicationRecord
  belongs_to :user
  has_many :favorited_recipes
  has_many :favoriters, through: :favorited_recipes, source: :user
  has_many :ingredient_amounts
  has_many :ingredients, through: :ingredient_amounts

  scope :for, -> (user) { where(user_id: user.id) }
end
